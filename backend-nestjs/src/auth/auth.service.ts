import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto, Verify2faDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as authenticator from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email or phone number is already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: dto.role,
          kycStatus: 'PENDING',
        },
      });

      // Initialize Main, Commission, and Cashback wallets for the user
      await tx.wallet.create({
        data: {
          userId: user.id,
          mainBalance: 0.0000,
          commissionBalance: 0.0000,
          cashbackBalance: 0.0000,
          currency: dto.currency || 'USD',
        },
      });

      // Create empty profile
      await tx.profile.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          companyName: dto.companyName,
        },
      });

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        message: 'Registration successful. Wallet and profile initialized.',
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid phone or password credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account has been deactivated. Contact support.');
    }

    if (user.isTwoFactorEnabled) {
      return {
        mfaRequired: true,
        tempToken: this.jwtService.sign(
          { sub: user.id, mfaPending: true },
          { expiresIn: '5m' },
        ),
      };
    }

    return this.generateTokens(user.id, user.role);
  }

  async verifyTwoFactor(userId: string, dto: Verify2faDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('MFA is not enabled on this account');
    }

    const isValid = authenticator.authenticator.verify({
      token: dto.code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA verification code');
    }

    return this.generateTokens(user.id, user.role);
  }

  async generateTwoFactorSecret(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = authenticator.authenticator.generateSecret();
    const otpauthUrl = authenticator.authenticator.keyuri(
      user.email,
      'RechargeSaaS Telecom',
      secret,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return {
      secret,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`,
    };
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Generate a secret key before enabling MFA');
    }

    const isValid = authenticator.authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid confirmation code. MFA not enabled.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    return { success: true, message: '2FA has been successfully activated.' };
  }

  private generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 3600,
    };
  }
}
