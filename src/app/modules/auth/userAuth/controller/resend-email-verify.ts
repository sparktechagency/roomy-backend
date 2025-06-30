import { Request, Response } from "express";
import handleAsync from "../../../../../shared/handleAsync";
import IdGenerator from "../../../../../utilities/idGenerator";
import authServices from "../auth.services";
import CustomError from "../../../../errors";
import config from "../../../../../config";
import sendMail from "../../../../../utilities/sendEmail";
import sendResponse from "../../../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";



const resendEmailVerificationCode = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code: code,
    expireDate,
  };

  const user = await authServices.getUserByEmail(email);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  user.verification = verification;
  await user.save();


  const content = `Your email veirfication code is ${verification?.code}`;
  
  const mailOptions = {
    from: config.gmail_app_user as string,
    to: email,
    subject: 'Email Verification',
    html: content,
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification code resend successfull',
  });
});

export default resendEmailVerificationCode;