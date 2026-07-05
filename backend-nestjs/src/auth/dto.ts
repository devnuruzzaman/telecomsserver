import { IsEmail, IsString, IsNotEmpty, IsPhoneNumber, Length, IsEnum, IsOptional, IsDecimal } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEnum(['CUSTOMER', 'RETAILER', 'DEALER', 'MASTER_DEALER', 'DISTRIBUTOR', 'AGENT', 'SUPPORT', 'FINANCE', 'MANAGER', 'ADMIN'])
  role: 'CUSTOMER' | 'RETAILER' | 'DEALER' | 'MASTER_DEALER' | 'DISTRIBUTOR' | 'AGENT' | 'SUPPORT' | 'FINANCE' | 'MANAGER' | 'ADMIN';

  @IsString()
  @IsOptional()
  currency?: string;
}

export class LoginDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class Verify2faDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
