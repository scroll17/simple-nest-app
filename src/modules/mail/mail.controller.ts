/*external modules*/
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
/*services*/
import { MailService } from './mail.service';
/*dto*/
import { SendEmailDto } from "./dto/send-email.dto";
/*@common*/
import { JwtAuthGuard, TermsAcceptedGuard } from "@common/guards";
import { CurrentUser } from '@common/decorators';
/*@entities*/
import { User } from '@entities/user';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  @UseGuards(JwtAuthGuard, TermsAcceptedGuard)
  async send(@Body() data: SendEmailDto, @CurrentUser() user: User) {
    return this.mailService.send(user, data);
  }

  @Get('/receivers')
  @UseGuards(JwtAuthGuard)
  async getReceivers(@CurrentUser() user: User) {
    return user.receivers;
  }
}
