import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import userServices from '../user/user.services';
import profileServices from './profile.services';

const getAllProfileByRole = handleAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const role:string = req.params.role;
  if (user.role !== ENUM_USER_ROLE.ADMIN) {
    throw new CustomError.ForbiddenError('only admin can see all users');
  }
  if (![ENUM_USER_ROLE.GUEST as string, ENUM_USER_ROLE.HOST as string].includes(role)) {
    throw new CustomError.BadRequestError('invalid role')  
}
  const result = await profileServices.retrieveAllProfiles(req.query,role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user data has been retrieved succesfully',
    data: result,
  });
});

export default {
  getAllProfileByRole,
};
