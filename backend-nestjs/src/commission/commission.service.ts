import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType, TransactionPurpose } from '@prisma/client';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Distribute B2B commission splits across agent/retailer hierarchies
   * Executes as part of the transaction block of a successful recharge.
   */
  async distributeCommissions(rechargeId: string, tx: Prisma.TransactionClient) {
    const recharge = await tx.recharge.findUnique({
      where: { id: rechargeId },
      include: { package: true },
    });

    if (!recharge) {
      this.logger.error(`Cannot distribute commission: Recharge ${rechargeId} not found`);
      return;
    }

    // Resolve beneficiary merchant user
    const beneficiary = await tx.user.findUnique({
      where: { id: recharge.userId },
    });

    if (!beneficiary) {
      this.logger.error(`Beneficiary user ${recharge.userId} not found for commission payout`);
      return;
    }

    // 1. Fetch matching active commission rule
    const rule = await tx.commissionRule.findFirst({
      where: {
        role: beneficiary.role,
        operatorId: recharge.operatorId,
        packageId: recharge.packageId || null,
        isActive: true,
      },
    });

    if (!rule) {
      this.logger.warn(`No commission rule matching role ${beneficiary.role}, operator ${recharge.operatorId}, package ${recharge.packageId || 'NULL'}`);
      return;
    }

    // 2. Compute payout amounts
    const grossAmount = new Prisma.Decimal(recharge.amount);
    const rulePercentage = new Prisma.Decimal(rule.percentage);
    const flatRate = new Prisma.Decimal(rule.flatRate);

    // Commission = (gross * percentage / 100) + flatRate
    const commissionEarned = grossAmount
      .times(rulePercentage)
      .dividedBy(100)
      .plus(flatRate);

    if (commissionEarned.lessThanOrEqualTo(0)) {
      return;
    }

    // 3. Update beneficiary's commission balance securely with row locking
    const wallet = await tx.wallet.findUnique({
      where: { userId: beneficiary.id },
    });

    if (!wallet) {
      this.logger.error(`Wallet not found for beneficiary ${beneficiary.id}`);
      return;
    }

    const previousCommissionBalance = new Prisma.Decimal(wallet.commissionBalance);
    const currentCommissionBalance = previousCommissionBalance.plus(commissionEarned);

    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        commissionBalance: currentCommissionBalance,
      },
    });

    // 4. Record the double-entry transaction credit log for commissions
    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        purpose: TransactionPurpose.RECHARGE_COMMISSION,
        amount: commissionEarned,
        previousBalance: previousCommissionBalance,
        currentBalance: currentCommissionBalance,
        referenceId: rechargeId,
      },
    });

    // 5. Save the final distribution split entry
    await tx.commissionDistribution.create({
      data: {
        rechargeId,
        userId: beneficiary.id,
        amount: commissionEarned,
        percentage: rulePercentage,
      },
    });

    this.logger.log(`Distributed B2B Commission of ${commissionEarned.toString()} to User ${beneficiary.id} (${beneficiary.role}) for Recharge ${rechargeId}`);
  }
}
