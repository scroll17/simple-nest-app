/*external modules*/
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
/*services*/
import { RedisService } from '../redis/redis.service';
/*@entities*/
import { User } from '@entities/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private connection: Connection,
    private redisService: RedisService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('audio')
    private audioQueue: Queue,
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
    this.logger.debug('codeInRedis => ', codeInRedis);

    const result = await client.set(email, code);
    this.logger.debug('result => ', result);

    codeInRedis = await client.get(email);
    this.logger.debug('codeInRedis => ', codeInRedis);

    await this.audioQueue.add({ data: 'hello world' });

    return true;
  }
}
