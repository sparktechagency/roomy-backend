import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../../shared/sendResponse";
import sendMail from "../../../../../utilities/sendEmail";
import config from "../../../../../config";
import handleAsync from "../../../../../shared/handleAsync";
import { Request, Response } from "express";
import CustomError from "../../../../errors";
import authServices from "../auth.services";
import IdGenerator from "../../../../../utilities/idGenerator";
import otpMailTemplate from "../../../../../mailTemplate/otpMailTemplate";


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
    html: otpMailTemplate(code,expiredTime),
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.',
  });
});


export default sendOTP