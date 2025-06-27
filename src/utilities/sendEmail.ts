import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import config from '../config';
import CustomError from '../app/errors';

// Define a type for the mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: any;
}

const currentDate = new Date();

const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

// Define the sendMail function
const sendMail = async ({ from, to, subject, html }: MailOptions): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail_app_user,
        pass: config.gmail_app_password,
      },
    });

    const mailOptions: SendMailOptions = {
      from,
      to,
      date:formattedDate,
      subject,
      html,
    };

    // Wait for the sendMail operation to complete
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new CustomError.BadRequestError('Failed to send mail!');
  }
};

export default sendMail;
