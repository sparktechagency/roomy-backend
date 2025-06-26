import { Request, Response } from "express";
import handleAsync from "../../../../../shared/handleAsync";
import authServices from "../auth.services";
import CustomError from "../../../../errors";
import jwtHelpers from "../../../../../helpers/jwtHelpers";
import config from "../../../../../config";
import { Secret } from "jsonwebtoken";
import sendResponse from "../../../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const userLogin = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await authServices.getUserByEmail(email);

  if (!user) throw new CustomError.BadRequestError('Invalid email or password!');

  // check the password is correct
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password');

  // generate token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    payload as typeof payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  const refreshToken = jwtHelpers.createToken(
    payload as typeof payload,
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expiresin as string,
  );

  const userInfo = {
    name: user.profile.name,
    email: user.email,
    _id: user._id,
    role: user.role,
    accessToken,
    refreshToken,
    isEmailVerified: user.isEmailVerified,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `User login successfull`,
    data: userInfo,
  });
});


export default userLogin