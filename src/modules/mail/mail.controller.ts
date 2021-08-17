/*external modules*/
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
/*services*/
import { MailService } from './mail.service';
/*dto*/
/*@common*/
import { JwtAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
import { User } from '@entities/user';
/*@entities*/

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  async send() {}

  @Get('/receivers')
  @UseGuards(JwtAuthGuard)
  async getReceivers(@CurrentUser() user: User) {
    return user.receivers;
  }
}
