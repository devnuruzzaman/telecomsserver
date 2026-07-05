import { IsString, IsNotEmpty, IsDecimal, IsOptional, IsUUID, IsBoolean, IsPhoneNumber } from 'class-validator';

export class CreateRechargeDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  recipientNumber: string;

  @IsDecimal()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  operatorCode?: string;

  @IsUUID()
  @IsOptional()
  packageId?: string;

  @IsBoolean()
  @IsOptional()
  isPostpaid?: boolean;

  @IsString()
  @IsOptional()
  clientReference?: string;
}
