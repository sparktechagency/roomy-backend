import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import User from '../user-module/user.model';
import verificationServices from './verification.services';

const verificationUserWithKyc = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as unknown as Record<string, Express.Multer.File[]>;
  const data = JSON.parse(req.body.data);

  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.BadRequestError('user not found');
  }
 
  const result = await verificationServices.saveVerificationUserWithKyc(id, data, files);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User verification credential saved succesfully',
    data: result,
  });
});

export default {
  verificationUserWithKyc,
};
