import { Controller, Post, Body, UseGuards, Get, UnauthorizedException, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { BlacklistService } from './blacklist.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private blacklistService: BlacklistService
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.usersService.create(registerUserDto);
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const token = req.headers.authorization.split(' ')[1];
    this.blacklistService.add(token);
    return { message: 'Logged out successfully' };
  }
} 