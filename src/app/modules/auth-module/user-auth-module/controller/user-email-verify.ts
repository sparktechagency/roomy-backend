import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../../../shared/handleAsync';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import User from '../../../user-module/user.model';
import authServices from '../auth.services';

const userEmailVerify = handleAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await authServices.getUserByEmail(email);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const isVerificationCodeMatch = user.compareVerificationCode(code);
  if (!isVerificationCodeMatch) {
    throw new CustomError.BadRequestError('Invalid code!');
  }

  const now = new Date();
  if (user.verification?.expireDate && user.verification?.expireDate < now) {
    throw new CustomError.BadRequestError('Sorry, Email verification Code using date expired!');
  }

  // update the email verification status of user

  await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
  await User.findByIdAndUpdate(user._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification successfull',
  });
});

export default userEmailVerify;
