import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../../shared/sendResponse";
import handleAsync from "../../../../../shared/handleAsync";
import { Request, Response } from "express";
import CustomError from "../../../../errors";
import authServices from "../auth.services";
import User from "../../../user-module/user.model";


// controller for verify otp
const verifyOTP = handleAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const isMatchOTP = userExistance.compareVerificationCode(otp);
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!');
  }

  // set null verification object in user model

  await User.findByIdAndUpdate(userExistance._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'OTP match successfull',
  });
});

export default verifyOTP
