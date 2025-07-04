
import express from 'express';
import requestValidator from '../../middlewares/request.validator';
import userController from './user.controller';
import userValidationZodSchema from './user.zod.validations';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import authentication from '../../middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.post('/create', requestValidator(userValidationZodSchema.registerUserValidationSchema), userController.registerUser);
userRouter.get('/details/:id', authentication(ENUM_USER_ROLE.ADMIN), userController.getSingleUserDetails);
userRouter.patch(
  '/change-status/:id',
  authentication(ENUM_USER_ROLE.ADMIN),
  userController.changeUserStatus,
);

export default userRouter;
