
import express from 'express';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import { uploadFile } from '../../../helpers/fileUploader';
import categoryController from './category.controller';

const categoryRouter = express.Router();

categoryRouter.post('/create',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),uploadFile(),categoryController.createCategory)
categoryRouter.get('/retrieve',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),categoryController.getAllCategory)
categoryRouter.patch('/update/:id',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),uploadFile(),categoryController.editCategory)
categoryRouter.delete('/delete/:id',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),categoryController.deleteCategory)

export default categoryRouter;