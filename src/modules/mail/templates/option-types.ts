export type ConfirmEmail = {
  template: 'confirm-email';
  locals: {
    code: number;
  };
};

export type UserSendEmail = {
  template: 'user-send-email';
  locals: {
    fromEmail: string;
    message: string;
  };
};

