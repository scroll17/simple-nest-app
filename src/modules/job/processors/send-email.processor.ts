/*external modules*/
import _ from 'lodash'
import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import nodemailer, { SendMailOptions } from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
/*services*/
import { MailService } from '../../mail/mail.service';
/*other*/
import { EmailTemplate } from '../../mail/templates';

export type SendEmailOptions = EmailTemplate;

export const sendEmailProcessorName = 'send-email' as const;

const isDev = process.env.ENV_NAME === 'dev';

const EMAIL_DEBUG = process.env.EMAIL_DEBUG === 'true';
const FROM_EMAIL = process.env.FROM_EMAIL;
const REPLY_TO_DOMAIN = process.env.REPLY_TO_DOMAIN;

const EMAIL_ACCESS_KEY_ID = process.env.EMAIL_ACCESS_KEY_ID;
const EMAIL_SECRET_ACCESS_KEY = process.env.EMAIL_SECRET_ACCESS_KEY;

@Processor(sendEmailProcessorName)
export class SendEmailConsumer {
  private readonly logger = new Logger(this.constructor.name);
  private SESTransport: any;

  constructor(private mailService: MailService) {
    this.SESTransport = sesTransport({
      accessKeyId: EMAIL_ACCESS_KEY_ID,
      secretAccessKey: EMAIL_SECRET_ACCESS_KEY,
      ServiceUrl: `https://${'email'}.${'us-west-2'}.amazonaws.com`,
      region: 'us-west-2',
    });
  }

  @Process()
  async sendEmail(job: Job<SendEmailOptions>) {
    this.logger.debug(
      `Sending email "${job.data.subject}" to "${job.data.to}"`,
      job.data,
    );

    const someToEmailInvalid = _.some(
      Array.isArray(job.data.to) ? job.data.to : [job.data.to],
      (toEmail) => !toEmail.includes('@')
    )
    if(someToEmailInvalid) {
      this.logger.warn(
        `User "to" email doesn't have final @domain`,
        job.data,
      );
      return;
    }

    if (job.data.fromEmail && !job.data.fromEmail.includes('@')) {
      this.logger.warn(
        `User "from" email doesn't have final @domain`,
        job.data,
      );
      return;
    }

    const subject = job.data.subject.replace(/\n/g, ' ');

    const html = await this.mailService.lookup(job.data.template, {
      ...job.data.locals,
      subject,
      doNotReply: !job.data.replyTo,
      currentYear: new Date().getFullYear(),
    });

    /**
     *  https://docs.aws.amazon.com/console/ses/sandbox
     *  When SES account is in "sandbox" mode:
     *    - Only send from verified domains and email addressed
     *    - Only send to verified domains and email addresses
     * */
    const from = `MoodMeter <${
      !isDev && job.data.fromEmail
        ? job.data.fromEmail
        : EMAIL_DEBUG || FROM_EMAIL
    }>`;
    const mailOption: SendMailOptions = {
      from: from,
      to: job.data.to,
      subject: job.data.subject,
      html: html,
    };

    if (job.data.replyTo) {
      mailOption['replyTo'] = `${job.data.replyTo}@${REPLY_TO_DOMAIN}`;
    }

    if (typeof EMAIL_DEBUG === 'boolean' && EMAIL_DEBUG) {
      this.logger.debug(`Debug email`);
      return;
    }

    const transporter = nodemailer.createTransport(this.SESTransport);

    try {
      await transporter.sendMail(mailOption);
    } catch (error) {
      if (!error.statusCode || error.statusCode >= 400) {
        throw new Error(`Cannot send the email: ${error.message}`);
      }
    }
  }

  @OnQueueFailed()
  onFail(job: Job, err: Error) {
    this.logger.error(
      `Job ${job.id} of type "${sendEmailProcessorName}" failed with error`,
      err,
    );
  }
}
