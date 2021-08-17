/*external modules*/
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataGenerateHelper {
  randomNumber(min: number, max: number, len: number) {
    let result = '';

    for (let i = 0; i < len; i++) {
      result += Math.floor(min + Math.random() * (max - min));
    }

    return parseInt(result, 10);
  }
}
