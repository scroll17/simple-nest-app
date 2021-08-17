/*external modules*/
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectQueue } from "@nestjs/bull";
import { Connection, Repository } from "typeorm";
import { classToPlain } from "class-transformer";
import { Queue } from "bull";
/*services*/
import { RedisService } from "../redis/redis.service";
/*@common*/
import { DataGenerateHelper } from "@common/helpers";
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

    private dataGenerateHelper: DataGenerateHelper,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('send-email')
    private sendEmailQueue: Queue,
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

    const verifyCode = this.dataGenerateHelper.randomNumber(0, 9, 5);

    const client = await this.redisService.getConnection();
    await client.set(email, verifyCode);

    await this.sendEmailQueue.add({
      to: email,
      template: 'confirm-email',
      subject: `Confirm email`,
      locals: {
        code: verifyCode,
      }
    })

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

  public async checkVerificationCode(user: User, code: number) {
    const client = await this.redisService.getConnection();

    const verifyCode = await client.get(user.email);
    if(!verifyCode) throw new NotFoundException('Verify code not found. Please resend verify code.')

    if (parseInt(verifyCode, 10) !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    user.verified = true;
    await user.save();

    return true;
  }

  public async resendVerificationCode(user: User) {
    if(user.verified) {
      throw new BadRequestException('You account already verified.')
    }

    const verifyCode = this.dataGenerateHelper.randomNumber(0, 9, 5);

    const client = await this.redisService.getConnection();
    await client.set(user.email, verifyCode);

    await this.sendEmailQueue.add({
      to: user.email,
      template: 'confirm-email',
      subject: `Confirm email`,
      locals: {
        code: verifyCode,
      }
    })

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
