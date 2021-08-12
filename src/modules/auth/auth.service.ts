/*external modules*/
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { classToPlain } from 'class-transformer';
/*services*/
import { RedisService } from "../redis/redis.service";
/*@entities*/
import { User } from '@entities/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
    private redisService: RedisService,
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

  async login() {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const users = [new User('1', '1'), new User('2', '2')];

      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async checkVerificationCode(email: string, code: number) {
    const client = await this.redisService.getConnection();

    let codeInRedis = await client.get(email);
    console.log('codeInRedis => ', codeInRedis)

    const result = await client.set(email, code);
    console.log('result => ', result)

    codeInRedis = await client.get(email);
    console.log('codeInRedis => ', codeInRedis)

    return true
  }
}
