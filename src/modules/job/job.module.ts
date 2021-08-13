/*external modules*/
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
/*services*/
/*controllers*/
/*consumers*/
import {
  AudioConsumer,
  audioProcessorName,
} from './processors/audio.processor';

const consumers = [AudioConsumer];

@Global()
@Module({
  imports: [
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
  ],
  providers: consumers,
  exports: [BullModule, ...consumers],
})
export class JobModule {}
