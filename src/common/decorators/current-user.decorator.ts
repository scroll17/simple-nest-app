/*external modules*/
import { createParamDecorator } from '@nestjs/common';
/*@interfaces*/
import { IPlainUser } from '../interfaces/user';

export const CurrentUser = createParamDecorator<keyof IPlainUser>(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
