import * as optionTypes from './option-types';

export type EmailBasicOptions = {
  to: string | string[];
  subject: string;
  fromEmail?: string;
  replyTo?: string;
};

export type EmailTemplate = EmailBasicOptions & (
  | optionTypes.ConfirmEmail
  | optionTypes.UserSendEmail
)
