/*external modules*/
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { classToPlain } from 'class-transformer';
/*@entities*/
import { User } from '@entities/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new HttpException(
        'User with email already exist',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = new User(email, password);

    await user.hashPassword();
    await user.save();

    return classToPlain(user);
  }
}
