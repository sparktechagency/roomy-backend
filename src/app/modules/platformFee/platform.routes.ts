
import express from 'express';
import platformFeeController from './platform.fee.controller';

const platformFeeRouter = express.Router();

platformFeeRouter.patch('/update',platformFeeController.updatePlatformFee)
platformFeeRouter.patch('/reset',platformFeeController.resetPlatFormFee)

export default platformFeeRouter;