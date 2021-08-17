/*external modules*/
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from "@nestjs/config";
import { Repository } from 'typeorm';
/*@interfaces*/
import { IUserDataInJwt } from "@common/interfaces/user";
/*@entities*/
import { User } from '@entities/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secrets.jwtSecret'),
    });
  }

  async validate(payload: IUserDataInJwt): Promise<User> {
    const user = await this.usersRepository.findOne(payload.sub);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
