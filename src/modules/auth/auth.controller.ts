/*external modules*/
import {
  Body,
  Req,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
/*services*/
import { AuthService } from './auth.service';
/*dto*/
import { RegisterUserDto } from './dto/register-user.dto';
/*@common*/
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { RolesGuard } from '@common/guards/roles.guard';
import { LocalAuthGuard, JwtAuthGuard, GoogleAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
/*@entities*/
import { User } from '@entities/user';

@Controller('/auth')
@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleInit() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Put('/verify-email')
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@Body('code', ParseIntPipe) code: number) {
    await this.authService.checkVerificationCode('test@gmail.com', code);

    return;
  }

  @Get('/resend-verify-code')
  @UseGuards(JwtAuthGuard)
  async resendVerifyCode() {
    return;
  }
}
