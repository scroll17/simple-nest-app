import { Processor, Process, OnQueueActive, OnQueueProgress, OnQueueFailed, BullModule } from "@nestjs/bull";
import { Job } from 'bull';

export const audioProcessorName = 'audio' as const;

@Processor(audioProcessorName)
export class AudioConsumer {
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
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    console.log(
      `Processing job ${job.id} of type ${job.name}: progress - ${progress}`,
    );
  }

  @OnQueueFailed()
  onFail(job: Job, err: Error) {
    console.log(
      `Job ${job.id} of type ${job.name} failed with error`,
      err
    );
  }
}
