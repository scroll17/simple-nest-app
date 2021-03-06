/*external modules*/
import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
/*@interfaces*/
import { IUserDataInGoogle } from "@common/interfaces/user";
/*@entities*/

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('secrets.googleAppId'),
      clientSecret: configService.get('secrets.googleAppSecret'),
      callbackURL: `${configService.get('host')}/auth/google/callback`,
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
