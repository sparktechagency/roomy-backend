import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import authentication from '../../middlewares/auth.middleware';
import reviewController from './review.controller';

const reviewRouter = express.Router();

reviewRouter.post('/create', authentication(ENUM_USER_ROLE.GUEST), reviewController.addUserReview);

export default reviewRouter;
