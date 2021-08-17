/*external modules*/
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectQueue } from "@nestjs/bull";
import { Connection, Repository } from "typeorm";
import { classToPlain } from "class-transformer";
import { Queue } from "bull";
/*services*/
import { RedisService } from "../redis/redis.service";
/*@entities*/
import { User } from "@entities/user/user.entity";
/*@interfaces*/
import { IPlainUser, IUserDataInGoogle } from '@interfaces/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private connection: Connection,
    private redisService: RedisService,
    private jwtService: JwtService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('audio')
    private audioQueue: Queue,
  ) {}

  private generateAuthToken(user: Pick<User, 'id' | 'email'>) {
    // property name of sub need for hold our userId value to be consistent with JWT standards.
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async validateUser(
    email: string,
    pass: string,
  ): Promise<IPlainUser | undefined> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) return;

    if (!user.password) {
      throw new ForbiddenException(
        'You cannot login to this account with password.',
      );
    }

    const isValidPassword = await user.comparePassword(pass);
    if (!isValidPassword) return;

    return classToPlain(user) as IPlainUser;
  }

  public async register(
    email: string,
    password: string,
  ): Promise<{ user: IPlainUser; accessToken: string }> {
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

    return {
      user: classToPlain(user) as IPlainUser,
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }

  public async login(user: User): Promise<{ accessToken: string }> {
    return this.generateAuthToken(user);
  }

  public async googleLogin(googleAuthUser: IUserDataInGoogle) {
    if (!googleAuthUser) throw new BadRequestException('No user from Google');

    let user = await this.usersRepository.findOne({ email: googleAuthUser.email });
    if (user) {
      if (user.googleId !== googleAuthUser.profileId) {
        throw new BadRequestException(
          'Multiple IDs for Google provider detected. Please contact with BEYREP support.',
        );
      }

      const { accessToken } = this.generateAuthToken(user);
      return {
        user: classToPlain(user),
        accessToken,
        new: false
      }
    }

    user = await this.usersRepository.create({
      email: googleAuthUser.email,
      googleId: googleAuthUser.profileId,
      verified: true,
    })
    await user.save();

    const { accessToken } = this.generateAuthToken(user);
    return {
      user: classToPlain(user),
      accessToken,
      new: true
    }
  }

  public async checkVerificationCode(email: string, code: number) {
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

  private async loginV2() {
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
}
