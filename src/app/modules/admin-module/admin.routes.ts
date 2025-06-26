import express from 'express';
import adminControllers from './admin.controllers';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';

const adminRouter = express.Router();

adminRouter.post('/create', adminControllers.createAdmin);
adminRouter.get('/retrive/all', adminControllers.getAllAdmin);
adminRouter.get('/retrive/:id', adminControllers.getSpecificAdmin);
adminRouter.patch('/update/:id', authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), adminControllers.updateSpecificAdmin);
// adminRouter.patch('/update/status/:id',authorization(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.BUSINESS),adminControllers.updateUserInfoOrStatusChanged)
adminRouter.delete('/delete/:id', authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), adminControllers.deleteSpecificAdmin);

export default adminRouter;
