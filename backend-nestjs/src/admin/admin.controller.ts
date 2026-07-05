import { Controller, Get, Post, Body, UseGuards, Query, BadRequestException, Patch, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  /**
   * Enterprise Analytics Dashboard Summary for platform health monitoring
   */
  @Get('dashboard-metrics')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  async getDashboardMetrics() {
    const [
      userCount,
      rechargeStats,
      walletTotals,
      kycPending,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.recharge.groupBy({
        by: ['status'],
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.wallet.aggregate({
        _sum: {
          mainBalance: true,
          commissionBalance: true,
          cashbackBalance: true,
        },
      }),
      this.prisma.kycVerification.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalRegisteredUsers: userCount,
      rechargeSummaryByStatus: rechargeStats.map(stat => ({
        status: stat.status,
        count: stat._count,
        totalVolume: stat._sum.amount || 0,
      })),
      financialLiquidity: {
        totalMainBalance: walletTotals._sum.mainBalance || 0,
        totalCommissionOwed: walletTotals._sum.commissionBalance || 0,
        totalCashbackRewarded: walletTotals._sum.cashbackBalance || 0,
      },
      actionableTasks: {
        pendingKycApprovals: kycPending,
      },
    };
  }

  /**
   * Platform-wide Audit Log tracking system transactions
   */
  @Get('audit-logs')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAuditLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('limit') limit = '50',
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        userId: userId ? userId : undefined,
        action: action ? action : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(parseInt(limit, 10), 500),
      include: {
        user: {
          select: { email: true, phone: true, role: true },
        },
      },
    });
  }

  /**
   * Manage Dynamic Commission Rules for hierarchy groups
   */
  @Post('commission-rules')
  @Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
  async createOrUpdateCommissionRule(@Body() dto: any) {
    const { role, operatorId, packageId, percentage, flatRate, isActive } = dto;

    if (!role) {
      throw new BadRequestException('Role is required');
    }

    const percentageDecimal = parseFloat(percentage);
    const flatRateDecimal = parseFloat(flatRate || '0');

    // Create or update commission rules dynamically
    return this.prisma.commissionRule.upsert({
      where: {
        role_operatorId_packageId: {
          role,
          operatorId: operatorId || null,
          packageId: packageId || null,
        },
      },
      update: {
        percentage: percentageDecimal,
        flatRate: flatRateDecimal,
        isActive: isActive !== undefined ? isActive : true,
      },
      create: {
        role,
        operatorId: operatorId || null,
        packageId: packageId || null,
        percentage: percentageDecimal,
        flatRate: flatRateDecimal,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
  }

  /**
   * Systemic KYC Approvals and compliance auditing
   */
  @Patch('kyc-verifications/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  async verifyKycSubmission(
    @Param('id') id: string,
    @Body() dto: { status: 'APPROVED' | 'REJECTED' | 'RE_SUBMISSION_REQUIRED'; notes?: string; adminUserId: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update verification record
      const verification = await tx.kycVerification.update({
        where: { id },
        data: {
          status: dto.status,
          notes: dto.notes,
          verifiedBy: dto.adminUserId,
        },
      });

      // 2. Update user master status
      await tx.user.update({
        where: { id: verification.userId },
        data: { kycStatus: dto.status },
      });

      // 3. Create Audit log
      await tx.auditLog.create({
        data: {
          userId: dto.adminUserId,
          action: `KYC_${dto.status}`,
          ipAddress: '127.0.0.1',
          newValues: { verificationId: id, notes: dto.notes, targetUserId: verification.userId },
        },
      });

      return {
        success: true,
        message: `KYC state updated to ${dto.status} successfully.`,
      };
    });
  }
}
