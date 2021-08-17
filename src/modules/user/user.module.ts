/*external modules*/
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
/*modules*/
import { AuthModule } from "../auth/auth.module";
/*services*/
import { UserService } from './user.service';
/*controllers*/
import { UserController } from './user.controller';
/*@entities*/
import { User } from '@entities/user/user.entity';

@Module({
  imports: [
    // method to define which repositories are registered in the current scope
    // after using the @InjectRepository() for inject the UsersRepository
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
