/*external modules*/
import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
/*@interfaces*/
import { IUserDataInGoogle } from '../../../common/interfaces/user';
/*@entities*/

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: 'http://localhost:3100/auth/google/callback', // TODO: _update
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<IUserDataInGoogle> {
    const { email, id: profileId } = profile;

    if (!email) {
      throw new BadRequestException(
        'Social network issue - "email" not provided.',
      );
    }

    return {
      email,
      profileId,
      accessToken,
    };
  }
}
