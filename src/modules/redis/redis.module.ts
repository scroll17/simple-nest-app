/*external modules*/
import { Module } from '@nestjs/common';
/*services*/
import { RedisService } from './redis.service';
/*controllers*/
/*@entities*/

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
