/*external modules*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
/*services*/
import { UserService } from './user.service';
/*controllers*/
import { UserController } from './user.controller';
/*@entities*/
import { User } from '@entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
