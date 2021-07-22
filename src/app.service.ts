import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloKitty(): string {
    return 'Hello Kitty!';
  }
}
