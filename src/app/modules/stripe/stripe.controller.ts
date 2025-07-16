import { Request, Response } from 'express';
import Stripe from 'stripe';
import config from '../../../config';
import handleAsync from '../../../shared/handleAsync';
import CustomError from '../../errors';
import User from '../user/user.model';
import stripeServices from './stripe.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';



const createOnboardLink = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const host = await User.findById(id);
  if (!host) {
    throw new CustomError.BadRequestError('user not found');
  }
  const result = await stripeServices.openOnboardingLink(host)
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'onboarding url link retrieved successfully ',
    data: result,
  });
});

export default {
  createOnboardLink,
};
