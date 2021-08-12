/*external modules*/
import { Module } from '@nestjs/common';
/*modules*/
import { UserModule } from '../user/user.module';
/*services*/
import { AuthService } from './auth.service';
/*controllers*/
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
