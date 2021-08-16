/*external modules*/
import { createParamDecorator } from '@nestjs/common';
/*@entities*/
import type { User } from "@entities/user";

export const UserFromReq = createParamDecorator<keyof User>(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);