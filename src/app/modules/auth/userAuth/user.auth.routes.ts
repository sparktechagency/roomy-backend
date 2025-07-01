import express from 'express';
import userAuthController from './user.auth.controller';

const userAuthRouter = express.Router();

// outlet also can be login using the route
userAuthRouter.post('/login', userAuthController.userLogin);

// route for resend email verification code
userAuthRouter.post('/email-verification/resend-code', userAuthController.resendEmailVerificationCode);

// route for user email verify
userAuthRouter.post('/verify-email', userAuthController.userEmailVerify);

// route for send password reset OTP
userAuthRouter.post('/forget-password/send-otp', userAuthController.sendOTP);

// route for verify OTP
userAuthRouter.post('/verify-otp', userAuthController.verifyOTP);

// route for reset password
userAuthRouter.post('/reset-password', userAuthController.resetPassword);

// route for change password
userAuthRouter.post('/change-password', userAuthController.changePassword);

// route for user stability (get new accesstoken)
userAuthRouter.post('/refresh-token', userAuthController.getAccessTokenByRefreshToken);

export default userAuthRouter;
