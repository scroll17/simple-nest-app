/*external modules*/
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from "@nestjs/config";
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
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
          prefix: `${configService.get('env')}:bull`,
          defaultJobOptions: {
            attempts: 3,
          },
        }
      },
      inject: [ConfigService]
    }),
    BullModule.registerQueue({ name: audioProcessorName }),
    BullModule.registerQueue({ name: sendEmailProcessorName }),
  ],
  providers: consumers,
  exports: [BullModule, ...consumers],
})
export class JobModule {}
