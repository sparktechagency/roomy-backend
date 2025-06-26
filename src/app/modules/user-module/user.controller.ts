import { userServices } from './services/index';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import User from './user.model';


// register user
const registerController = handleAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await User.findOne({ $or: [{ email: userData.email, phone: userData.phone }] });

  if (user) {
    throw new CustomError.BadRequestError('email or phone already exist');
  }

  const result = await userServices.createUser(userData);
  
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User registration successful.Check email for verify your email',
    data: result,
  });
});

// get specific user



export default {
  registerController,
};
