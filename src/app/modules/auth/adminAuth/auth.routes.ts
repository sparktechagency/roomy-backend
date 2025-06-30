import express from 'express';
import authControllers from './controller';

const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', authControllers.AdminLogin);
adminAuthRouter.post('/forget-password/send-otp', authControllers.sendOTP);
adminAuthRouter.post('/verify-otp', authControllers.verifyOTP);
adminAuthRouter.post('/reset-password', authControllers.resetPassword);
adminAuthRouter.post('/change-password', authControllers.changePassword);

export default adminAuthRouter;
