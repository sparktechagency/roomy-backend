import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../../../config';
import jwtHelpers from '../../../../helpers/jwtHelpers';
import otpMailTemplate from '../../../../mailTemplate/otpMailTemplate';
import handleAsync from '../../../../shared/handleAsync';
import sendResponse from '../../../../shared/sendResponse';
import IdGenerator from '../../../../utilities/idGenerator';
import sendMail from '../../../../utilities/sendEmail';
import CustomError from '../../../errors';
import User from '../../user/user.model';
import userAuthServices from './user.auth.services';


const userLogin = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await userAuthServices.getUserByEmail(email);

  if (!user) throw new CustomError.BadRequestError('user not found');

  if (user.isDeleted) {
    throw new CustomError.ForbiddenError('This user is already deleted');
  }
  if (user.status === 'blocked') {
    throw new CustomError.ForbiddenError('This user is blocked');
  }

  // check the password is correct
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) throw new CustomError.BadRequestError(`password didn't match`);

  // generate token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.profile.role,
    isEmailVerified: user.isEmailVerified,
    isVerifiedId: user.isVerifiedId
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
    profile: user.profile,
    accessToken,
    refreshToken,
    isEmailVerified: user.isEmailVerified,
    isVerifiedId: user.isVerifiedId
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `User login successfull`,
    data: userInfo,
  });
});

const resendEmailVerificationCode = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code: code,
    expireDate,
  };

  const user = await userAuthServices.getUserByEmail(email);
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

const resetPassword = handleAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await userAuthServices.getUserByEmail(email);
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

  const userExistance = await userAuthServices.getUserByEmail(email);
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

const userEmailVerify = handleAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await userAuthServices.getUserByEmail(email);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const isVerificationCodeMatch = user.compareVerificationCode(code);
  console.log(isVerificationCodeMatch);
  if (!isVerificationCodeMatch) {
    throw new CustomError.BadRequestError('Invalid code!');
  }

  const now = new Date();
  if (user.verification?.expireDate && user.verification?.expireDate < now) {
    throw new CustomError.BadRequestError('Your email verification code is expired!');
  }

  // update the email verification status of user

  await User.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification successfull',
  });
});

const verifyOTP = handleAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await userAuthServices.getUserByEmail(email);
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

const changePassword = handleAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const userExistance = await userAuthServices.getUserByEmail(email);
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

const getAccessTokenByRefreshToken = handleAsync(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const actualRefreshToken = refresh_token.split(' ')[1];

  const tokenPayload = jwtHelpers.verifyToken(actualRefreshToken, config.jwt_refresh_token_secret as Secret);
  if (!tokenPayload) {
    throw new CustomError.BadRequestError('Invalid refresh token!');
  }

  const user = await userAuthServices.getUserByEmail(tokenPayload.email);

  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const payload = {
    email: user.email,
    roles: user.profile.role,
  };

  const newAccessToken = jwtHelpers.createToken(
    payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'New access token created using refresh token. User logged In successful',
    data: {
      accessToken: newAccessToken,
      refreshToken: actualRefreshToken,
    },
  });
});

export default {
  userLogin,
  userEmailVerify,
  resetPassword,
  sendOTP,
  verifyOTP,
  getAccessTokenByRefreshToken,
  changePassword,
  resendEmailVerificationCode,
};
