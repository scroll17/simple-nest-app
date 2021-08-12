import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from "@nestjs/common";
import { User } from '@entities/user/user.entity';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const user = User.findOne(value);
    if(!user) throw new NotFoundException('User not found');

    return user;
  }
}
