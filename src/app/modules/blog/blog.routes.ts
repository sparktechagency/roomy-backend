import { updateBlog } from './blog.services';
import { uploadFile } from './../../../helpers/fileUploader';

import express from 'express';
import blogController from './blog.controller';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';

const blogRouter = express.Router();

blogRouter.post('/create',authentication(ENUM_USER_ROLE.ADMIN),uploadFile(),blogController.createBlog);
blogRouter.get('/retrieve',authentication(ENUM_USER_ROLE.ADMIN),blogController.getAllBlogs);
blogRouter.get('/retrieve/recent',authentication(ENUM_USER_ROLE.ADMIN),blogController.recentsBlog);
blogRouter.get('/retrieve-specific-role/',authentication(ENUM_USER_ROLE.ADMIN),blogController.recentsBlog);
blogRouter.patch('/update/:id',authentication(ENUM_USER_ROLE.ADMIN),blogController.editBlog);
blogRouter.delete('/delete/:id',authentication(ENUM_USER_ROLE.ADMIN),blogController.deleteBlog);

export default blogRouter;