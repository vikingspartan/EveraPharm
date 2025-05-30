import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    // TODO: Use JwtAuthGuard to get user from JWT
    // For now, return a mock user
    const userId = req.user?.id || '1';
    const user = await this.usersService.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    const { password, ...profile } = user;
    return profile;
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    // TODO: Use JwtAuthGuard to get user from JWT
    const userId = req.user?.id || '1';
    const updatedUser = await this.usersService.update(userId, updateUserDto);
    const { password, ...profile } = updatedUser;
    return profile;
  }
} 