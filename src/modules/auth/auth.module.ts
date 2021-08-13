/*external modules*/
import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
/*modules*/
import { UserModule } from '../user/user.module';
/*services*/
import { AuthService } from './auth.service';
/*controllers*/
import { AuthController } from './auth.controller';
/*other*/
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
