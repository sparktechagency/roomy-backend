
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import User from './user.model';
import userServices from './user.services';
import { ENUM_USER_ROLE } from '../../../enums/user-role';


// register user
const registerUser = handleAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const role = userData.role;
  console.log(role)
  const user = await User.findOne({ $or: [{ email: userData.email, phone: userData.phone }] });

  if (user) {
    throw new CustomError.BadRequestError('email or phone already exist');
  }

  const result = await userServices.createUser(userData,role);
  
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User registration successful.Check email for verify your email',
    data: result,
  });
});

// get all user
const getAllGuestProfile = handleAsync(async(req:Request,res:Response)=>{
   const user:any = req.user;
   console.log('user',user)
   if(user.role !== ENUM_USER_ROLE.ADMIN){
    throw new CustomError.ForbiddenError('only admin can see all users')
   } 
   const result = await userServices.retrieveAllGuests(req.query);
   sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user data has been retrieved succesfully',
    data: result,
  });
})


const getAllHostProfile = handleAsync(async(req:Request,res:Response)=>{
   const user:any = req.user;
   if(user.role !== ENUM_USER_ROLE.ADMIN){
    throw new CustomError.ForbiddenError('only admin can see all users')
   } 
   const result = await userServices.retrieveAllHosts(req.query);
   sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user data has been retrieved succesfully',
    data: result,
  });
})


export default {
  registerUser,
  getAllGuestProfile,
  getAllHostProfile
};
