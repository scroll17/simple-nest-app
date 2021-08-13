/*external modules*/
import { createParamDecorator } from '@nestjs/common';
/*@entities*/
import type { User as TUser } from "@entities/user";

export const User = createParamDecorator<keyof TUser>(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);