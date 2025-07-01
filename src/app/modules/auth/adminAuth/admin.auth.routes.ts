import express from 'express';
import adminAuthController from './admin.auth.controller';

const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', adminAuthController.adminLogin);
adminAuthRouter.post('/forget-password/send-otp', adminAuthController.sendOTP);
adminAuthRouter.post('/verify-otp', adminAuthController.verifyOTP);
adminAuthRouter.post('/reset-password', adminAuthController.resetPassword);
adminAuthRouter.post('/change-password', adminAuthController.changePassword);

export default adminAuthRouter;
