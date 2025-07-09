import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import platformFeeServices from './platform.fee.services';

const updatePlatformFee = handleAsync(async (req: Request, res: Response) => {
  const result = await platformFeeServices.changePlatformFee(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'platform fee has been successfully',
    data: result,
  });
});

const resetPlatFormFee = handleAsync(async (req:Request, res:Response)=>{
    const result = await platformFeeServices.setDefaultPlatformFee();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'platform fee has been reset successfully',
    data: result,
  });
})

export default {
  updatePlatformFee,
  resetPlatFormFee
};
