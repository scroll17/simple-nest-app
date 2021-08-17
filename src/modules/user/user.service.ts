/*external modules*/
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/*services*/
/*@entities*/
import { User } from '@entities/user';
import { classToPlain } from 'class-transformer';
/*@interfaces*/

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async confirmTerms(user: User) {
    if (!user.terms) {
      user.terms = true;
      await this.usersRepository.save(user);
    }

    return classToPlain(user);
  }
}
