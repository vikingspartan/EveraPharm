import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { PrismaService } from '../database/prisma.service'
import { UsersService } from '../users/users.service'
import { 
  AuthUser, 
  UserRole, 
  rolePermissions,
  validatePassword,
  validateEmail,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  createAuditLog,
} from '@everapharm/database'
import { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto, 
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  TwoFactorDto,
} from './dto'

@Injectable()
export class AuthService {
  private supabase: SupabaseClient

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.supabase = createClient(
      this.configService.get('auth.supabase.url'),
      this.configService.get('auth.supabase.serviceKey'),
    )
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = dto

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Please try again later.')
    }

    // Verify password with Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      // Increment login attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1,
          lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      })

      throw new UnauthorizedException('Invalid credentials')
    }

    // Check if email is verified
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Please verify your email before logging in')
    }

    // Check if company is approved (for distributor users)
    if (user.companyId && user.company?.status !== 'APPROVED') {
      throw new UnauthorizedException('Your company is not yet approved')
    }

    // Reset login attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    })

    // Create activity log
    await this.prisma.activityLog.create({
      data: createAuditLog({
        userId: user.id,
        action: 'LOGIN',
        ipAddress,
        userAgent,
      }),
    })

    // Generate JWT token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: [...rolePermissions[user.role], ...(user.permissions as string[])],
    }

    const tokens = this.generateTokens(authUser)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
      },
      ...tokens,
    }
  }

  async register(dto: RegisterDto) {
    // Validate email
    if (!validateEmail(dto.email)) {
      throw new BadRequestException('Invalid email format')
    }

    // Validate password
    const passwordValidation = validatePassword(dto.password)
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.errors.join(', '))
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existingUser) {
      throw new BadRequestException('Email already registered')
    }

    // Check if company exists (for distributor registration)
    let company = null
    if (dto.companyId) {
      company = await this.prisma.company.findUnique({
        where: { id: dto.companyId },
      })

      if (!company) {
        throw new BadRequestException('Company not found')
      }
    }

    // Register with Supabase
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    })

    if (authError || !authData.user) {
      throw new BadRequestException('Failed to create account')
    }

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        authId: authData.user.id,
        role: dto.role || 'DISTRIBUTOR_USER',
        companyId: dto.companyId,
        language: dto.language || 'en',
        timezone: dto.timezone || 'UTC',
        currency: dto.currency || 'USD',
      },
    })

    // Send verification email
    await this.sendVerificationEmail(user.email, authData.user.id)

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id,
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken)
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      })

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        permissions: [...rolePermissions[user.role], ...(user.permissions as string[])],
      }

      return this.generateTokens(authUser)
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(userId: string, ipAddress?: string, userAgent?: string) {
    // Sign out from Supabase
    await this.supabase.auth.signOut()

    // Create activity log
    await this.prisma.activityLog.create({
      data: createAuditLog({
        userId,
        action: 'LOGOUT',
        ipAddress,
        userAgent,
      }),
    })

    return { message: 'Logout successful' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email } = dto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a password reset link has been sent.' }
    }

    // Generate reset token
    const resetToken = generateSecureToken(32)
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store reset token (in production, use Redis)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // In production, store these in a separate table or Redis
        // passwordResetToken: resetToken,
        // passwordResetExpiry: resetExpiry,
      },
    })

    // Send reset email
    await this.sendPasswordResetEmail(email, resetToken)

    return { message: 'If the email exists, a password reset link has been sent.' }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.errors.join(', '))
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    // Verify current password with Supabase
    const { error } = await this.supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (error) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    // Update password in Supabase
    const { error: updateError } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      throw new BadRequestException('Failed to update password')
    }

    // Update password changed timestamp
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordChangedAt: new Date(),
      },
    })

    return { message: 'Password changed successfully' }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { token } = dto

    // Verify token with Supabase
    const { error } = await this.supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    })

    if (error) {
      throw new BadRequestException('Invalid or expired verification token')
    }

    // Update user's email verification status
    // In production, get user ID from token
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { emailVerifiedAt: new Date() },
    // })

    return { message: 'Email verified successfully' }
  }

  private generateTokens(user: AuthUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: user.permissions,
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 hours in seconds
    }
  }

  private async sendVerificationEmail(email: string, userId: string) {
    // Implementation would use email service
    console.log(`Sending verification email to ${email}`)
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    // Implementation would use email service
    console.log(`Sending password reset email to ${email}`)
  }
}