
import express from 'express';
import requestValidator from '../../middlewares/request.validator';
import userValidationZodSchema from './user.zod.validations';
import userController from './user.controller';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';


const userRouter = express.Router();

userRouter.post('/create',requestValidator(userValidationZodSchema.registerUserValidationSchema),userController.registerUser)
userRouter.get('/retrieve-guest',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),userController.getAllGuestProfile)
userRouter.get('/retrieve-host',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),userController.getAllHostProfile)


export default userRouter;