import { Request, Response } from "express";
import handleAsync from "../../../../shared/handleAsync";
import adminAuthServices from "./admin.auth.services";
import CustomError from "../../../errors";
import sendResponse from "../../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import jwtHelpers from "../../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import config from "../../../../config";
import IdGenerator from "../../../../utilities/idGenerator";
import otpMailTemplate from "../../../../mailTemplate/otpMailTemplate";
import sendMail from "../../../../utilities/sendEmail";
import Admin from "../../admin/admin.model";



const adminLogin = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await adminAuthServices.getAdminByEmail(email);
  console.log(user)
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
    fullName: user.fullName,
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
    message: `Admin login successfull`,
    data: userInfo,
  });
});


const changePassword = handleAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const userExistance = await adminAuthServices.getAdminByEmail(email);
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


const resetPassword = handleAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await adminAuthServices.getAdminByEmail(email);
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


const sendOTP = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await adminAuthServices.getAdminByEmail(email);
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
    html: otpMailTemplate(code, expiredTime),
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.',
  });
});

const verifyOTP = handleAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  console.log(email)
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await adminAuthServices.getAdminByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }
  console.log(userExistance)
  const isMatchOTP = userExistance.compareVerificationCode(otp);
  console.log(isMatchOTP)
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!');
  }

  // set null verification object in user model

  await Admin.findByIdAndUpdate(userExistance._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'OTP match successfull',
  });
});


export default {
    adminLogin,
    resetPassword,
    verifyOTP,
    sendOTP,
    changePassword
}