/*external modules*/
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, method } = req;

    this.logger.debug(`REQUEST: ${method} ${baseUrl}`);

    next();
  }
}
