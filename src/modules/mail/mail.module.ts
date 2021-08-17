/*external modules*/
import { Module } from '@nestjs/common';
/*services*/
import { MailService } from './mail.service';
/*controllers*/
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
