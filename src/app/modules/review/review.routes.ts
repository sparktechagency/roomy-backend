
import express from 'express';
import authentication from '../../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import reviewController from './review.controller';

const reviewRouter = express.Router();

reviewRouter.post('/create',authentication(ENUM_USER_ROLE.GUEST),reviewController.addUserReview)

export default reviewRouter;