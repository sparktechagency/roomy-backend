import express from 'express';
import adminControllers from './admin.controllers';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';

const adminRouter = express.Router();

adminRouter.post('/create', adminControllers.createAdmin);
adminRouter.get('/retrieve/all', adminControllers.getAllAdmin);
adminRouter.get('/retrieve/:id', adminControllers.getSpecificAdmin);
adminRouter.patch('/update/:id', adminControllers.updateSpecificAdmin);
// adminRouter.patch('/update/status/:id',authorization(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.BUSINESS),adminControllers.updateUserInfoOrStatusChanged)
adminRouter.delete('/delete/:id', adminControllers.deleteSpecificAdmin);

export default adminRouter;
