import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import Admin from './admin.model';
import adminServices from './admin.services';

// controller for create new admin
const createAdmin = handleAsync(async (req: Request, res: Response) => {
  const adminData = req.body;

  console.log('ahsan-========================');

  const isAdminExist = await Admin.findOne({ email: adminData.email });
  if (isAdminExist) {
    throw new CustomError.BadRequestError('This admin already exist');
  }
  const admin = await adminServices.createAdmin(adminData);
  if (!admin) {
    throw new CustomError.BadRequestError('Failed to create new admin!');
  }

  const { password, ...adminInfoAcceptPass } = admin.toObject();

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Admin creation successfull',
    data: adminInfoAcceptPass,
  });
});

// controller for get all admin
const getAllAdmin = handleAsync(async (req: Request, res: Response) => {
  const admins = await adminServices.getAllAdmin();
  const adminsAcceptSuperAdmin = admins.filter((admin) => admin.role !== 'super-admin');

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin retrive successfull',
    data: adminsAcceptSuperAdmin,
  });
});

// controller for get specific admin
const getSpecificAdmin = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = await adminServices.getSpecificAdmin(id);
  if (!admin) {
    throw new CustomError.NotFoundError('No admin found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin found successfull',
    data: admin,
  });
});

// controller for update specific admin
const updateSpecificAdmin = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (data.password || data.email) {
    throw new CustomError.BadRequestError("You can't update adminId, email, password directly!");
  }

  const updatedAdmin = await adminServices.updateSpecificAdmin(id, data);

  if (!updatedAdmin.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update Admin!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin update successfull',
  });
});

// controller for delete specific admin
const deleteSpecificAdmin = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = await adminServices.deleteSpecificAdmin(id);
  if (!admin.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete admin!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin delete successfull',
  });
});

export default {
  createAdmin,
  getAllAdmin,
  getSpecificAdmin,
  updateSpecificAdmin,
  deleteSpecificAdmin,
};
