import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import { uploadFile } from '../../../helpers/fileUploader';
import authentication from '../../middlewares/auth.middleware';
import listingController from './listing.controller';

const listingRouter = express.Router();

listingRouter.post('/create/:id', authentication(ENUM_USER_ROLE.HOST), uploadFile(), listingController.createListing);
listingRouter.get('/filtered', authentication(ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST), listingController.getSpecificListing);
export default listingRouter;
