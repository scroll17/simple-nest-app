/*external modules*/
import { Controller, Post, UseGuards } from '@nestjs/common';
/*services*/
import { UserService } from './user.service';
/*@common*/
import { JwtAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
/*@entities*/
import { User } from '@entities/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/confirm-terms')
  @UseGuards(JwtAuthGuard)
  confirmTerms(@CurrentUser() user: User) {
    return this.userService.confirmTerms(user);
  }
}
