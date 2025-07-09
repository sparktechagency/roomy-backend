import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import profileServices from './profile.services';

const getAllProfileByRole = handleAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const role: string = req.params.role;
  if (user.role !== ENUM_USER_ROLE.ADMIN) {
    throw new CustomError.ForbiddenError('only admin can see all users');
  }
  if (![ENUM_USER_ROLE.GUEST as string, ENUM_USER_ROLE.HOST as string].includes(role)) {
    throw new CustomError.BadRequestError('invalid role in request');
  }
  const result = await profileServices.retrieveAllProfiles(req.query, role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user data has been retrieved succesfully',
    data: result,
  });
});

const getSingleProfile = handleAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const { id } = req.params;
  const isOwner = user.id === id;
  console.log(isOwner);
  const result = await profileServices.retrieveSingleProfile(id, user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user profile has been retrieved succesfully',
    data: result,
  });
});

const updateProfile = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = JSON.parse(req.body.data);
  const file = req.files as unknown as Record<string, Express.Multer.File[]>;

  const profileImage = file?.profile_image?.[0]?.path;
  const profileGallery = file.profile_gallery?.map((file: Express.Multer.File) => file.path) || [];

  console.log(profileGallery);
  const updatedData = {
    ...data,
    ...(profileImage && { profileImage }),
    ...(profileGallery && { photoGallery: profileGallery }),
  };
  console.log(updatedData);
  const result = await profileServices.updateProfileInfo(updatedData, id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'user profile data has been updated succesfully',
    data: result,
  });
});

const changeProfileVisibility = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await profileServices.updateProfileVisibility(req.body, id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'profile visibility has been updated succesfully',
    data: result,
  });
});

export default {
  getAllProfileByRole,
  getSingleProfile,
  updateProfile,
  changeProfileVisibility,
};
