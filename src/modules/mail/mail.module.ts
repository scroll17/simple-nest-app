/*external modules*/
import { Module } from '@nestjs/common';
/*modules*/
import { UserModule } from '../user/user.module';
/*services*/
import { MailService } from './mail.service';
/*controllers*/
import { MailController } from './mail.controller';

@Module({
  imports: [UserModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
