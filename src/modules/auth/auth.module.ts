/*external modules*/
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
/*modules*/
import { UserModule } from '../user/user.module';
/*services*/
import { AuthService } from './auth.service';
/*controllers*/
import { AuthController } from './auth.controller';
/*@common*/
import { DataGenerateHelper } from '@common/helpers';
/*other*/
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    DataGenerateHelper,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
