/*external modules*/
import { Module } from '@nestjs/common';
/*modules*/
import { RedisModule } from "../redis/redis.module";
import { UserModule } from '../user/user.module';
/*services*/
import { AuthService } from './auth.service';
/*controllers*/
import { AuthController } from './auth.controller';

@Module({
  imports: [RedisModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
