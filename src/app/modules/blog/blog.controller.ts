import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
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

const recentsBlog = handleAsync(async (req: Request, res: Response) => {});

const getAllBlogsByRole = handleAsync(async (req: Request, res: Response) => {});

const getAllBlogs = handleAsync(async (req: Request, res: Response) => {});

const editBlog = handleAsync(async (req: Request, res: Response) => {});

const deleteBlog = handleAsync(async (req: Request, res: Response) => {});

export default {
  createBlog,
  recentsBlog,
  getAllBlogs,
  getAllBlogsByRole,
  editBlog,
  deleteBlog,
};
