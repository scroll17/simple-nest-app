export type EmailBasicOptions = {
  to: string;
  subject: string;
  fromEmail?: string;
  replyTo?: string;
};

export type ConfirmEmail = {
  template: 'confirm-email';
  locals: {
    code: number;
  };
};
