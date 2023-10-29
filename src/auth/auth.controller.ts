import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  AuthDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOTPDto,
} from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }
  @Post('register')
  async register(@Body() body: AuthDto) {
    return this.authService.register(body.email, body.password);
  }
  @Get('logout')
  @Auth()
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user);
  }
  @Post('send-otp')
  async sendOTP(@Body() body: SendOtpDto) {
    console.log(body);
    return this.authService.sendOTP(body);
  }
  @Post('verify-otp')
  async VerifyOTP(@Body() body: VerifyOTPDto) {
    return this.authService.verifyOTP(body);
  }
  @Post('reset-password')
  async restPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
