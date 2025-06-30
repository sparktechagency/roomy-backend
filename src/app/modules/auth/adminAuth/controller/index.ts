import changePassword from './change-password';
import AdminLogin from './login-user';

import resetPassword from './reset-password';
import sendOTP from './send-otp';

import verifyOTP from './verify-otp';

const authControllers = {
  AdminLogin,
  changePassword,
  verifyOTP,
  resetPassword,
  sendOTP,

};

export default authControllers;
