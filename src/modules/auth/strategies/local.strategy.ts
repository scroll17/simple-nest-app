/*external modules*/
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
/*services*/
import { AuthService } from '../auth.service';
/*@interfaces*/
import { IPlainUser } from '../../../common/interfaces/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<IPlainUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // exceptions layer handle this error
      throw new UnauthorizedException();
    }

    return user;
  }
}
