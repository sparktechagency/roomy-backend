import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../../../../config';
import otpMailTemplate from '../../../../../mailTemplate/otpMailTemplate';
import handleAsync from '../../../../../shared/handleAsync';
import sendResponse from '../../../../../shared/sendResponse';
import IdGenerator from '../../../../../utilities/idGenerator';
import sendMail from '../../../../../utilities/sendEmail';
import CustomError from '../../../../errors';
import authServices from '../admin.auth.services';

const sendOTP = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  const expiredTime = 10;
  expireDate.setMinutes(expireDate.getMinutes() + expiredTime);
  const verification = {
    code,
    expireDate,
  };

  userExistance.verification = verification;
  await userExistance.save();

  const mailOptions = {
    from: config.gmail_app_user as string,
    to: email,
    subject: 'Password Reset OTP',
    html: otpMailTemplate(code, expiredTime),
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.',
  });
});

export default sendOTP;
