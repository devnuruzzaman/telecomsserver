import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { CommissionService } from '../commission/commission.service';
import { RechargeStatus, RechargeType, TransactionType, TransactionPurpose } from '@prisma/client';
import { CreateRechargeDto } from './dto';

@Injectable()
export class RechargeService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private commissionService: CommissionService,
  ) {}

  /**
   * Automations: Auto detects operator code based on phone number prefix
   */
  async detectOperator(phoneNumber: string): Promise<string> {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Check common global/national prefix mappings (e.g., GP, Robi, Banglalink, Teletalk, etc.)
    if (cleanNumber.startsWith('88017') || cleanNumber.startsWith('017') || cleanNumber.startsWith('88013') || cleanNumber.startsWith('013')) {
      return 'GP'; // Grameenphone
    }
    if (cleanNumber.startsWith('88018') || cleanNumber.startsWith('018')) {
      return 'ROBI'; // Robi Axiata
    }
    if (cleanNumber.startsWith('88019') || cleanNumber.startsWith('019') || cleanNumber.startsWith('88014') || cleanNumber.startsWith('014')) {
      return 'BL'; // Banglalink
    }
    if (cleanNumber.startsWith('88016') || cleanNumber.startsWith('016')) {
      return 'AIRTEL'; // Airtel Bangladesh
    }
    if (cleanNumber.startsWith('88015') || cleanNumber.startsWith('015')) {
      return 'TELE'; // Teletalk
    }

    throw new BadRequestException('Unsupported phone prefix. Please select your operator manually.');
  }

  /**
   * Main Core Endpoint: Initiate Recharge Workflow
   * Includes balance checking, pre-debit, queue dispatching, and vendor brokering
   */
  async initiateRecharge(userId: string, dto: CreateRechargeDto) {
    const operatorCode = dto.operatorCode || (await this.detectOperator(dto.recipientNumber));
    
    // 1. Resolve operator catalog
    const operator = await this.prisma.operator.findUnique({
      where: { code: operatorCode },
    });
    if (!operator || !operator.isActive) {
      throw new BadRequestException('Operator is offline or invalid');
    }

    // 2. Validate package catalog if specified
    let packageEntity = null;
    let finalAmount = dto.amount;

    if (dto.packageId) {
      packageEntity = await this.prisma.package.findUnique({
        where: { id: dto.packageId },
      });
      if (!packageEntity || !packageEntity.isActive || packageEntity.operatorId !== operator.id) {
        throw new BadRequestException('Selected tariff package is currently unavailable');
      }
      finalAmount = Number(packageEntity.price);
    }

    if (finalAmount <= 0) {
      throw new BadRequestException('Recharge amount must be greater than zero');
    }

    // 3. Begin ACID Transaction flow for balance check & pre-debit locking
    return this.prisma.$transaction(async (tx) => {
      // Row lock wallets to prevent double spending
      const wallets = await tx.$queryRaw<any[]>`
        SELECT id, main_balance FROM wallets WHERE user_id = ${userId}::uuid FOR UPDATE
      `;
      if (wallets.length === 0) {
        throw new BadRequestException('Active wallet required to perform recharges');
      }

      const wallet = wallets[0];
      const previousBalance = Number(wallet.main_balance);
      if (previousBalance < finalAmount) {
        throw new BadRequestException('Insufficient wallet balance to perform recharge');
      }

      // Pre-debit the balance from user's wallet
      const newBalance = previousBalance - finalAmount;
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { mainBalance: newBalance },
      });

      // Log the pre-debit transaction log as pending reference
      const rechargeId = crypto.randomUUID();
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.DEBIT,
          purpose: TransactionPurpose.RECHARGE,
          amount: finalAmount,
          previousBalance,
          currentBalance: newBalance,
          referenceId: rechargeId,
        },
      });

      // Create recharge record with QUEUED status
      const recharge = await tx.recharge.create({
        data: {
          id: rechargeId,
          userId,
          operatorId: operator.id,
          packageId: packageEntity?.id || null,
          recipientNumber: dto.recipientNumber,
          amount: finalAmount,
          status: RechargeStatus.QUEUED,
          type: dto.isPostpaid ? RechargeType.POSTPAID : RechargeType.PREPAID,
          clientReference: dto.clientReference,
        },
      });

      // 4. Return initial response.
      // In production, the system dispatches this task to BullMQ or Celery for background processing.
      return {
        rechargeId: recharge.id,
        recipientNumber: recharge.recipientNumber,
        amount: recharge.amount,
        status: recharge.status,
        operator: operator.name,
        transactionId: transaction.id,
        message: 'Recharge queued successfully. Processing background handshake with operator...',
      };
    });
  }

  /**
   * Airtime Broker Core: Handshake gateway API and resolve result
   */
  async processRechargeWorker(rechargeId: string) {
    const recharge = await this.prisma.recharge.findUnique({
      where: { id: rechargeId },
      include: { operator: true, user: true },
    });

    if (!recharge || recharge.status !== RechargeStatus.QUEUED) {
      return;
    }

    // Set status as PROCESSING
    await this.prisma.recharge.update({
      where: { id: rechargeId },
      data: { status: RechargeStatus.PROCESSING, attempts: { increment: 1 } },
    });

    try {
      // Handshake gateway simulation (In production, make AXIOS request with HMAC/Bearer signatures to external telecom APIs)
      const gatewayResponse = await this.dispatchToVendorGateway(recharge);

      if (gatewayResponse.success) {
        await this.prisma.$transaction(async (tx) => {
          // Resolve recharge as successful
          await tx.recharge.update({
            where: { id: rechargeId },
            data: {
              status: RechargeStatus.SUCCESS,
              gatewayReference: gatewayResponse.reference,
              gatewayResponse: JSON.stringify(gatewayResponse),
              completedAt: new Date(),
            },
          });

          // Trigger hierarchical commission distribution module
          await this.commissionService.distributeCommissions(rechargeId, tx);
        });
      } else {
        await this.handleRechargeFailure(rechargeId, 'GATEWAY_DECLINED', gatewayResponse.error);
      }
    } catch (error) {
      await this.handleRechargeFailure(rechargeId, 'GATEWAY_ERROR', error.message || 'Network Timeout');
    }
  }

  /**
   * Airtime Gateway Protocol client (Simulated, easily extended for Twilio, Ding, Reloadly, local SMSC gateway APIs)
   */
  private async dispatchToVendorGateway(recharge: any) {
    // Mimic standard high-availability API callback with random failure threshold
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const isMockSuccess = Math.random() > 0.05; // 95% SLA Success rate
    if (isMockSuccess) {
      return {
        success: true,
        reference: `VND-RECH-${Math.floor(100000 + Math.random() * 900000)}`,
        statusCode: '200',
        networkLatencyMs: 450,
      };
    } else {
      return {
        success: false,
        error: 'Operator network temporary congestion',
        statusCode: '503',
      };
    }
  }

  /**
   * Auto-Rollback: Refund funds back to merchant wallet in case of gateway failure
   */
  private async handleRechargeFailure(rechargeId: string, errorType: string, reason: string) {
    await this.prisma.$transaction(async (tx) => {
      const recharge = await tx.recharge.findUnique({
        where: { id: rechargeId },
      });

      if (!recharge || recharge.status === RechargeStatus.FAILED || recharge.status === RechargeStatus.REFUNDED) {
        return;
      }

      // Mark recharge as FAILED/REFUNDED
      await tx.recharge.update({
        where: { id: rechargeId },
        data: {
          status: RechargeStatus.FAILED,
          gatewayResponse: JSON.stringify({ errorType, reason, timestamp: new Date() }),
        },
      });

      // Lock user's wallet
      const wallets = await tx.$queryRaw<any[]>`
        SELECT id, main_balance FROM wallets WHERE user_id = ${recharge.userId}::uuid FOR UPDATE
      `;
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const previousBalance = Number(wallet.main_balance);
        const currentBalance = previousBalance + Number(recharge.amount);

        // Refund balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { mainBalance: currentBalance },
        });

        // Insert Credit ledger audit log
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: TransactionType.CREDIT,
            purpose: TransactionPurpose.REFUND,
            amount: recharge.amount,
            previousBalance,
            currentBalance,
            referenceId: recharge.id,
          },
        });
      }
    });
  }
}
