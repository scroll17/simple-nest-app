/*external modules*/
import { Controller } from '@nestjs/common';
/*services*/
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
