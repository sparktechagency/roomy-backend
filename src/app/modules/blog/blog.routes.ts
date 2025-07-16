import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import { uploadFile } from '../../../helpers/fileUploader';
import authentication from '../../middlewares/auth.middleware';
import blogController from './blog.controller';

const blogRouter = express.Router();

blogRouter.post('/create', authentication(ENUM_USER_ROLE.ADMIN), uploadFile(), blogController.createBlog);
blogRouter.get('/retrieve', authentication(ENUM_USER_ROLE.ADMIN), blogController.getAllBlogs);
blogRouter.get('/:id', authentication(ENUM_USER_ROLE.ADMIN), blogController.getSpecificBlogDetails);
blogRouter.get('/retrieve/recent', authentication(ENUM_USER_ROLE.ADMIN), blogController.recentsBlog);
blogRouter.get('/retrieve-specific-role', authentication(ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST), blogController.getAllBlogsByRole);
blogRouter.patch('/update/:id', authentication(ENUM_USER_ROLE.ADMIN), uploadFile(), blogController.editBlog);
blogRouter.delete('/delete/:id', authentication(ENUM_USER_ROLE.ADMIN), blogController.deleteBlog);

export default blogRouter;
