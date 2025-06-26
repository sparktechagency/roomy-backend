import { NextFunction, Request, Response,  } from 'express';
import config from '../../config';
import { ENUM_USER_ROLE } from '../../enums/user-role';
import jwtHelpers from '../../helpers/jwtHelpers';
import CustomError from '../errors';
import adminServices from '../modules/admin-module/admin.services';
import { userServices } from '../modules/user-module/services';
import { JwtPayload } from 'jsonwebtoken';


const getUserByRole = async (payload: any) => {
  const { id, role } = payload;

  const user =
    role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN
      ? await adminServices.getSpecificAdmin(id)
      : await userServices.getSpecificUser(id);

  if (!user) throw new CustomError.NotFoundError('User not found with the token');
  return user;
};


const authentication = (...requiredRoles: string[]) => {
  return async (req:Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) throw new CustomError.UnAuthorizedError('Unauthorized access!');

      const payload = jwtHelpers.verifyToken(token, config.jwt_access_token_secret as string) as JwtPayload ;
      if (!payload) throw new CustomError.UnAuthorizedError('Invalid token!');
      
      req.user  = payload
      const user: any = getUserByRole(payload);
     

      if (user.status === 'disabled') {
        throw new CustomError.BadRequestError('Your current account is disabled!');
      }
      if (user.status === 'blocked') {
        throw new CustomError.BadRequestError('Currently your account is blocked by admin!');
      }

      if (payload.role !== ENUM_USER_ROLE.ADMIN && payload.role !== ENUM_USER_ROLE.SUPER_ADMIN) {
        if (!user.isEmailVerified) {
          throw new CustomError.UnAuthorizedError('Unauthorized user');
        }

        if (user.isDeleted) {
          throw new CustomError.BadRequestError('User not found');
        }
      }

      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        throw new CustomError.ForbiddenError('Forbidden!');
      }
          
      next();
    } catch (error) {
      next(error);
    }
  };
};


// export const validateUserStatus = (user: any) => {
//   if (user.status === 'disabled') {
//     throw new CustomError.BadRequestError('Your current account is disabled!');
//   }
//   if (user.status === 'blocked') {
//     throw new CustomError.BadRequestError('Currently your account is blocked by admin!');
//   }
// };

// export const validateUserSpecificChecks = (user: any, payload: any) => {
//   if (payload.role !== ENUM_USER_ROLE.ADMIN && payload.role !== ENUM_USER_ROLE.SUPER_ADMIN) {
//     if (!user.isEmailVerified) {
//       throw new CustomError.UnAuthorizedError('Unauthorized user');
//     }

//     if (user.isDeleted) {
//       throw new CustomError.BadRequestError('User not found');
//     }
//   }
// };

// export const validateUserRole = (role: string, requiredRoles: string[]) => {
//   if (requiredRoles.length && !requiredRoles.includes(role)) {
//     throw new CustomError.ForbiddenError('Forbidden!');
//   }
// };

export default authentication;
