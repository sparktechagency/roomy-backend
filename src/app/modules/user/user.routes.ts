import express from 'express';
import requestValidator from '../../middlewares/request.validator';
import userValidationZodSchema from './user.zod.validations';
import userController from './user.controller';


const userRouter = express.Router();

userRouter.post('/create',requestValidator(userValidationZodSchema.registerUserValidationSchema),userController.registerUser)


export default userRouter;