import { Body, Controller, Get, Post, Put, UseFilters, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { RolesGuard } from '@common/guards/roles.guard';

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
  async login() {}

  @Put('/verify-email')
  async verifyEmail() {
    return;
  }

  @Get('/resend-verify-code')
  async resendVerifyCode() {
    return;
  }
}
