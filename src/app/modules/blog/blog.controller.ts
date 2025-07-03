import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import IBlog from './blog.interfaces';
import blogServices from './blog.services';

const createBlog = handleAsync(async (req: Request, res: Response) => {
  const data = JSON.parse(req.body.data);
  console.log(data);
  const file = req.files as unknown as Record<string, Express.Multer.File[]>;
  const result = await blogServices.createBlog(data, file);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Blog has been created succesfully',
    data: result,
  });
});

const getAllBlogsByRole = handleAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const result = await blogServices.retrieveAllBlogsByRole(req.query, user.role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been retrieved succesfully',
    data: result,
  });
});

const recentsBlog = handleAsync(async (req: Request, res: Response) => {
  const result = await blogServices.retrieveRecentBlogs(3);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been retrieved succesfully',
    data: result,
  });
});

const getAllBlogs = handleAsync(async (req: Request, res: Response) => {
  const result = await blogServices.retrieveAllBlogs(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been retrieved succesfully',
    data: result,
  });
});

const editBlog = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = req.files as unknown as Record<string, Express.Multer.File[]>;
  const rawData = req.body?.data;

  if (!rawData) {
    throw new CustomError.BadRequestError('Missing blog data');
  }

  let data: Partial<IBlog>;
  try {
    data = JSON.parse(rawData);
  } catch {
    throw new CustomError.BadRequestError('Invalid JSON in blog data');
  }

  const image = file?.blog_image?.[0]?.path;

  const updatedData: Partial<IBlog> = {
    ...data,
    ...(image && { image }),
  };

  const result = await blogServices.updateBlog(id, updatedData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been updated successfully',
    data: result,
  });
});


const deleteBlog = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.deleteBlog(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Blog data has been deleted succesfully',
    data: result,
  });
});

export default {
  createBlog,
  recentsBlog,
  getAllBlogs,
  getAllBlogsByRole,
  editBlog,
  deleteBlog,
};
