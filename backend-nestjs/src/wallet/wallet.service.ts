import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType, TransactionPurpose } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves user's wallet with active locks
   */
  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new BadRequestException('Wallet not found for the specified user');
    }
    return wallet;
  }

  /**
   * Executes double-entry general ledger transactions safely.
   * Utilizes database transactions to lock records and prevent double-spending.
   */
  async adjustBalance(
    userId: string,
    amount: number | Prisma.Decimal,
    type: TransactionType,
    purpose: TransactionPurpose,
    referenceId?: string,
  ) {
    const decimalAmount = new Prisma.Decimal(amount);
    if (decimalAmount.isNegative() || decimalAmount.isZero()) {
      throw new BadRequestException('Transaction amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch wallet and apply horizontal row-level locking (SELECT ... FOR UPDATE)
      // Since Prisma Client doesn't support select...for update natively in direct methods easily,
      // we utilize raw queries to acquire exclusive locks, ensuring concurrent requests wait.
      const wallets = await tx.$queryRaw<any[]>`
        SELECT id, main_balance, commission_balance, cashback_balance 
        FROM wallets 
        WHERE user_id = ${userId}::uuid 
        FOR UPDATE
      `;

      if (wallets.length === 0) {
        throw new BadRequestException('Wallet not found or account is deactivated');
      }

      const wallet = wallets[0];
      const previousBalance = new Prisma.Decimal(wallet.main_balance);
      let currentBalance: Prisma.Decimal;

      if (type === TransactionType.DEBIT) {
        if (previousBalance.lessThan(decimalAmount)) {
          throw new ConflictException('Insufficient funds in main wallet balance');
        }
        currentBalance = previousBalance.minus(decimalAmount);
      } else {
        currentBalance = previousBalance.plus(decimalAmount);
      }

      // 2. Perform the update
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          mainBalance: currentBalance,
        },
      });

      // 3. Create double-entry immutable ledger log
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type,
          purpose,
          amount: decimalAmount,
          previousBalance,
          currentBalance,
          referenceId,
        },
      });

      return {
        transactionId: transaction.id,
        newBalance: updatedWallet.mainBalance,
        type: transaction.type,
      };
    });
  }

  /**
   * B2B Peer-to-Peer Wallet Balance Transfer with ACID compliance
   */
  async transferBalance(
    senderId: string,
    receiverPhone: string,
    amount: number,
  ) {
    const decimalAmount = new Prisma.Decimal(amount);
    if (decimalAmount.lessThanOrEqualTo(0)) {
      throw new BadRequestException('Transfer amount must be greater than zero');
    }

    return this.prisma.$transaction(async (tx) => {
      // Find receiver by phone number
      const receiverUser = await tx.user.findUnique({
        where: { phone: receiverPhone },
      });

      if (!receiverUser) {
        throw new BadRequestException('Recipient user not found');
      }

      if (receiverUser.id === senderId) {
        throw new BadRequestException('Cannot transfer funds to your own wallet');
      }

      // Row-locking the sender's wallet
      const senderWallets = await tx.$queryRaw<any[]>`
        SELECT id, main_balance FROM wallets WHERE user_id = ${senderId}::uuid FOR UPDATE
      `;
      // Row-locking the receiver's wallet
      const receiverWallets = await tx.$queryRaw<any[]>`
        SELECT id, main_balance FROM wallets WHERE user_id = ${receiverUser.id}::uuid FOR UPDATE
      `;

      if (senderWallets.length === 0 || receiverWallets.length === 0) {
        throw new BadRequestException('Sender or receiver wallet does not exist');
      }

      const senderWallet = senderWallets[0];
      const receiverWallet = receiverWallets[0];

      const senderPrevBalance = new Prisma.Decimal(senderWallet.main_balance);
      const receiverPrevBalance = new Prisma.Decimal(receiverWallet.main_balance);

      if (senderPrevBalance.lessThan(decimalAmount)) {
        throw new ConflictException('Insufficient funds to perform transfer');
      }

      const senderNewBalance = senderPrevBalance.minus(decimalAmount);
      const receiverNewBalance = receiverPrevBalance.plus(decimalAmount);

      // Perform updates
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { mainBalance: senderNewBalance },
      });

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { mainBalance: receiverNewBalance },
      });

      // Create Ledger records for sender
      const senderTx = await tx.transaction.create({
        data: {
          walletId: senderWallet.id,
          type: TransactionType.DEBIT,
          purpose: TransactionPurpose.WALLET_TRANSFER,
          amount: decimalAmount,
          previousBalance: senderPrevBalance,
          currentBalance: senderNewBalance,
          referenceId: receiverUser.id,
        },
      });

      // Create Ledger records for receiver
      await tx.transaction.create({
        data: {
          walletId: receiverWallet.id,
          type: TransactionType.CREDIT,
          purpose: TransactionPurpose.WALLET_TRANSFER,
          amount: decimalAmount,
          previousBalance: receiverPrevBalance,
          currentBalance: receiverNewBalance,
          referenceId: senderId,
        },
      });

      return {
        transactionId: senderTx.id,
        amount: decimalAmount,
        senderRemainingBalance: senderNewBalance,
        recipient: receiverUser.phone,
      };
    });
  }
}
