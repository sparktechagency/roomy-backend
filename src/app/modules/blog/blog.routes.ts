import { uploadFile } from './../../../helpers/fileUploader';

import express from 'express';
import blogController from './blog.controller';

const blogRouter = express.Router();

blogRouter.post('/create',uploadFile(),blogController.createBlog);

export default blogRouter;