import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import User from '../user/user.model';
import listingServices from './listing.services';

const createListing = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const files = req.files as unknown as Record<string, Express.Multer.File[]>;
  console.log('listing', data);
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new CustomError.BadRequestError('user not found');
  }
  if (user.profile.role !== ENUM_USER_ROLE.HOST) {
    throw new CustomError.BadRequestError('profile is not host profile');
  }

  const result = await listingServices.createListingIntoDb(id, data, files);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'listing has been added succesfully!',
    data: result,
  });
});

export default {
  createListing,
};
