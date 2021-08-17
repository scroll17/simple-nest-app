/*external modules*/
import path from 'path';
import fs from 'fs';
import mjml from 'mjml';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ejs, { TemplateFunction } from 'ejs';
/*services*/
/*@entities*/
import { User } from '@entities/user';
/*@interfaces*/

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);
  private cache: Record<string, TemplateFunction> = {};

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async lookup(
    filepath: string,
    data: Record<string, any>,
  ): Promise<string> {
    if (this.cache[filepath]) return this.cache[filepath](data);

    const filePath = path.join(__dirname, `${filepath}.mjml`);
    const content = await fs.promises.readFile(filePath, { encoding: 'utf8' });

    const template = mjml(content, {
      validationLevel: 'soft',
      filePath,
    });

    if (template.errors.length > 0) {
      this.logger.error(`MJML is not valid`, template.errors);
    }

    return ejs.compile(template.html)(data);
  }

  public async send() {}
}
