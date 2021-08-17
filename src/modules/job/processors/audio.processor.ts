/*external modules*/
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueProgress,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

export const audioProcessorName = 'audio' as const;

@Processor(audioProcessorName)
export class AudioConsumer {
  private readonly logger = new Logger(this.constructor.name);

  @Process()
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (let i = 0; i < 10; i++) {
      progress += 10;
      await job.progress(progress);
    }
    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}: progress - ${progress}`,
    );
  }

  @OnQueueFailed()
  onFail(job: Job, err: Error) {
    this.logger.debug(
      `Job ${job.id} of type ${job.name} failed with error`,
      err,
    );
  }
}
