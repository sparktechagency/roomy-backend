import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../../../shared/handleAsync';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import authServices from '../admin.auth.services';

const resetPassword = handleAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  userExistance.password = newPassword;
  await userExistance.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull',
  });
});

export default resetPassword;
