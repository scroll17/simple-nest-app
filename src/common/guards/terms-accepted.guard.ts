/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";

@Injectable()
export class TermsAcceptedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) throw new NotFoundException('User not found');

    return user.terms;
  }
}