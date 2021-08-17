/*external modules*/
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
/*modules*/
import { MailModule } from '../mail/mail.module';
/*services*/
/*controllers*/
/*consumers*/
import {
  AudioConsumer,
  audioProcessorName,
} from './processors/audio.processor';
import {
  SendEmailConsumer,
  sendEmailProcessorName,
} from './processors/send-email.processor';

const consumers = [AudioConsumer, SendEmailConsumer];

@Global()
@Module({
  imports: [
    MailModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      prefix: `${process.env.ENV_NAME}:bull`,
      defaultJobOptions: {
        attempts: 3,
      },
    }),
    BullModule.registerQueue({ name: audioProcessorName }),
    BullModule.registerQueue({ name: sendEmailProcessorName }),
  ],
  providers: consumers,
  exports: [BullModule, ...consumers],
})
export class JobModule {}
