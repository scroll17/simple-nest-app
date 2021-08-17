/*external modules*/
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  receivers: string[];
}
