import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Req,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common'
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger'
  import { Request } from 'express'
  import { AuthService } from './auth.service'
  import { JwtAuthGuard } from './guards/jwt-auth.guard'
  import { CurrentUser } from './decorators/current-user.decorator'
  import { 
    LoginDto, 
    RegisterDto, 
    RefreshTokenDto, 
    ResetPasswordDto,
    ChangePasswordDto,
    VerifyEmailDto,
    AuthResponseDto,
  } from './dto'
  import { AuthUser } from '@everapharm/database'
  
  @ApiTags('auth')
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto, @Req() req: Request) {
      const ipAddress = req.ip
      const userAgent = req.headers['user-agent']
      return this.authService.login(dto, ipAddress, userAgent)
    }
  
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'Registration successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto)
    }
  
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Body() dto: RefreshTokenDto) {
      return this.authService.refreshTokens(dto)
    }
  
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout current user' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@CurrentUser() user: AuthUser, @Req() req: Request) {
      const ipAddress = req.ip
      const userAgent = req.headers['user-agent']
      return this.authService.logout(user.id, ipAddress, userAgent)
    }
  
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset email sent' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
      return this.authService.resetPassword(dto)
    }
  
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change current password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid password' })
    async changePassword(
      @CurrentUser() user: AuthUser,
      @Body() dto: ChangePasswordDto,
    ) {
      return this.authService.changePassword(user.id, dto)
    }
  
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify email address' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid token' })
    async verifyEmail(@Body() dto: VerifyEmailDto) {
      return this.authService.verifyEmail(dto)
    }
  }