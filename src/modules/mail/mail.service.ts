/*external modules*/
import path from "path";
import fs from "fs";
import mjml from "mjml";
import _ from "lodash";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ejs, { TemplateFunction } from "ejs";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
/*services*/
/*dto*/
import { SendEmailDto } from "./dto/send-email.dto";
/*@entities*/
import { User } from "@entities/user";

/*@interfaces*/

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);
  private cache: Record<string, TemplateFunction> = {};

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('send-email')
    private sendEmailQueue: Queue,
  ) {}

  public async lookup(
    filepath: string,
    data: Record<string, any>,
  ): Promise<string> {
    if (this.cache[filepath]) return this.cache[filepath](data);

    const filePath = path.join(__dirname, 'templates', `${filepath}.mjml`);
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

  public async send(user: User, data: SendEmailDto) {
    const newReceiversAdded = user.addReceivers(data.receivers);
    if(newReceiversAdded) await user.save();

    await this.sendEmailQueue.add({
      to: _.uniq(data.receivers),
      fromEmail: user.email,
      template: 'user-send-email',
      subject: data.subject,
      locals: {
        message: data.message,
        fromEmail: user.email,
      },
    })

    return true;
  }
}
