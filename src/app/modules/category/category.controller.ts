import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import ICategory from './category.interface';
import categoryServices from './category.services';

const createCategory = handleAsync(async (req: Request, res: Response) => {
  const data = JSON.parse(req.body.data);
  const file = req.files as unknown as Record<string, Express.Multer.File[]>;
  const result = await categoryServices.createCategoryIntoDb(data, file);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Category has been created succesfully',
    data: result,
  });
});

const getAllCategory = handleAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const result = await categoryServices.retrieveAllCategory(user.role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category data retrieve has been succesfully',
    data: result,
  });
});

const editCategory = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as { role: string };
  const file = req.files as unknown as Record<string, Express.Multer.File[]>;
  const { id } = req.params;

  if (user.role !== ENUM_USER_ROLE.ADMIN && user.role !== ENUM_USER_ROLE.SUPER_ADMIN) {
    throw new CustomError.ForbiddenError('Only admins can update categories');
  }

  const rawData = req.body?.data;
  if (!rawData) {
    throw new CustomError.BadRequestError('Missing category data');
  }

  let data: Partial<ICategory>;
  try {
    data = JSON.parse(rawData);
  } catch {
    throw new CustomError.BadRequestError('Invalid JSON in category data');
  }

  const image = file?.category_image?.[0]?.path;

  const updatedData = {
    ...data,
    ...(image && { image }),
  };

  const result = await categoryServices.updateCategory(id, updatedData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category has been updated successfully',
    data: result,
  });
});

const deleteCategory = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryServices.deleteCategory(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been deleted succesfully',
    data: result,
  });
});

export default {
  createCategory,
  getAllCategory,
  editCategory,
  deleteCategory,
};
