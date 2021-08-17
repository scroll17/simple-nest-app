/*external modules*/
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
/*services*/
/*@entities*/
import { User } from "@entities/user";
/*@interfaces*/


@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async send() {

  }
}
