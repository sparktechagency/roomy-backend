import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../../shared/sendResponse";
import handleAsync from "../../../../../shared/handleAsync";
import { Request, Response } from "express";
import CustomError from "../../../../errors";
import authServices from "../auth.services";


const changePassword = handleAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  // compare user given old password and database saved password
  const isOldPassMatch = userExistance.comparePassword(oldPassword);
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password');
  }

  userExistance.password = newPassword;
  await userExistance.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull',
  });
});

export default changePassword;