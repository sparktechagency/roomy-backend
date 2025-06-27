import changePassword from './change-password';

import userLogin from './login-user';
import resetPassword from './reset-password';
import sendOTP from './send-otp';

import verifyOTP from './verify-otp';

const authControllers = {
  userLogin,
  changePassword,
  verifyOTP,
  resetPassword,
  sendOTP,

};

export default authControllers;
