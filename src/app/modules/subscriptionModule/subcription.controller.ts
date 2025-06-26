import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import subscriptionServices from './subscription.services';

//create subscription
const createSubscription = asyncHandler(async (req: Request, res: Response) => {
  const subscriptionData = req.body;
  const newSubscription = await subscriptionServices.createSubscription(subscriptionData);

  if (!newSubscription) {
    throw new CustomError.BadRequestError('Failed to create subscription!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Subscription created successfully',
    data: newSubscription,
  });
});

// get subscription

const getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const subscriptions = await subscriptionServices.getSubscriptions();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Subscriptions retrieved successfully',
    data: subscriptions,
  });
});

//get subcription by Id
const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subscription = await subscriptionServices.getSubscriptionById(id);

  if (!subscription) {
    throw new CustomError.NotFoundError('Subscription not found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Subscription retrieved successfully',
    data: subscription,
  });
});

// update subcription
const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subscriptionData = req.body;

  if (subscriptionData.name) {
    const subscription: any = await subscriptionServices.getSubscriptionById(id);
    if (subscription) {
      subscription.name = subscriptionData.name;
      await subscription.save();
    }
  }

  const updatedSubscription = await subscriptionServices.updateSubscription(id, subscriptionData);

  if (!updatedSubscription) {
    throw new CustomError.BadRequestError('Failed to update subscription!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Subscription updated successfully',
  });
});

// delete subscription
const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedSubscription = await subscriptionServices.deleteSubscription(id);

  if (!deletedSubscription?.$isDeleted) {
    throw new CustomError.BadRequestError('Failed to delete subscription!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'subscriptions deleted successfully',
  });
});


export default {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  getSubscriptionById,
  deleteSubscription,
};
