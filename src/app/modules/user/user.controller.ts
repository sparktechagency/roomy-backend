import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import User from './user.model';
import userServices from './user.services';

// register user
const registerUser = handleAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await User.findOne({ $or: [{ email: userData.email, phone: userData.phone }] });
  console.log(user);
  if (user) {
    throw new CustomError.BadRequestError('email or phone already exist');
  }

  const result = await userServices.createUserIntoDb(userData, userData.role);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User registration successful.Check email for verify your email',
    data: result,
  });
});

const getSingleUserDetails = handleAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await userServices.retrieveUserDetails(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user details has been retrieved successfully',
    data: result,
  });
});



const changeUserStatus = handleAsync(async (req, res) => {
  const { status } = req.body;
  const result = await userServices.changeUserStatus(req.params.id, status);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `User is ${result?.status}`,
    data: result,
  });
});

export default {
  registerUser,
  changeUserStatus,
  getSingleUserDetails,
};
