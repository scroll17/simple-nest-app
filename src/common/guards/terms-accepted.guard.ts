/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from "@nestjs/common";

@Injectable()
export class TermsAcceptedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) throw new NotFoundException('User not found');

    if(!user.terms) throw new ForbiddenException('Terms policy not accepted.')

    return true;
  }
}