/*external modules*/
import {
  Body,
  Controller,
  Get, ParseIntPipe,
  Post,
  Put,
  UseFilters,
  UseGuards
} from "@nestjs/common";
/*services*/
import { AuthService } from './auth.service';
/*dto*/
import { RegisterUserDto } from './dto/register-user.dto';
/*@common*/
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
  async verifyEmail(@Body('code', ParseIntPipe) code: number) {
    await this.authService.checkVerificationCode('test@gmail.com', code);

    return;
  }

  @Get('/resend-verify-code')
  async resendVerifyCode() {
    return;
  }
}
