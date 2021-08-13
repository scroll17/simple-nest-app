/*external modules*/
import { Global, Module } from '@nestjs/common';
/*services*/
import { RedisService } from './redis.service';
/*controllers*/
/*@entities*/

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
