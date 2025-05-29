import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '@everapharm/database'

export class LoginDto {
  @ApiProperty({ example: 'admin@everapharm.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string
}

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@company.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string

  @ApiPropertyOptional({ example: '+1-555-123-4567' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.DISTRIBUTOR_USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiPropertyOptional({ example: 'uuid-of-company' })
  @IsOptional()
  @IsUUID()
  companyId?: string

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  currentPassword: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string
}

export class TwoFactorDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  code: string
}

export class AuthResponseDto {
  @ApiProperty()
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    company?: any
  }

  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  expiresIn: number
}