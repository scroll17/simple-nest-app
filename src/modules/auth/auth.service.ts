import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@entities/user/user.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  async register(email: string, password: string) {
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User with email already exist',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const user = new User(email, password);

    await user.hashPassword();
    await user.save();

    return classToPlain(user);
  }
}
