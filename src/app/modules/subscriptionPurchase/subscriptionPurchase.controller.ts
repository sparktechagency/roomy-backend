import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import config from '../../../config';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import userServices from '../userModule/user.services';
import subscriptionPurchaseServices from './subscriptionPurchase.services';
import sendMail from '../../../utils/sendEmail';
import { ENUM_USER_ROLE } from '../../../enums/user';
import CarOwner from '../carOwnerModule/carOwner.model';
import Business from '../businessModule/business.model';

const stripe = new Stripe(config.stripe_secret_key as string);

//create subscription
const createSubscriptionPurchaseController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { priceId } = req.body;

  if (!userId && !priceId) {
    throw new CustomError.BadRequestError('userId and priceId are missing');
  }

  const user: any = await userServices.getSpecificUser(userId);
  if (!user) throw new CustomError.NotFoundError('User not found!');
  
  let name;
  if(user.profile.role === ENUM_USER_ROLE.CAR_OWNER){
   const profile = await CarOwner.findById(user.profile.id);
    name = profile?.firstName + " " + profile?.lastName
  }
  
  if(user.profile.role === ENUM_USER_ROLE.BUSINESS){
    const profile = await Business.findById(user.profile.id);
    name = profile?.name
  }

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name
    });

    user.stripeCustomerId = customer.id;
    await user.save();
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  const activeSubscription = subscriptions.data[0];

  if (activeSubscription) {
    const currentItem = activeSubscription.items.data[0];
    const currentPriceId = currentItem.price.id;

    if (currentPriceId === priceId) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        status: 'fail',
        message: 'You already have this subscription active.',
      });
    }

    // 3. Switch plan by updating existing subscription
    await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: currentItem.id,
          price: priceId,
        },
      ],
    });

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Subscription plan updated successfully.',
      data: {
        subscriptionId: activeSubscription.id,
      },
    });
  }

  // 4. No active subscription → Create Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: user.stripeCustomerId,
    success_url: `${config.frontend_url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontend_url}/cancel`,
  });

  //checkout url
  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Checkout session created',
    data: {
      checkoutUrl: session.url,
    },
  });
});

// cancel subscriptions
 const cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const subscriptionPurchase = await subscriptionPurchaseServices.getSubscriptionPurchaseById(id);
    if (!subscriptionPurchase) {
      throw new CustomError.NotFoundError('Subscription Purchase not found!');
    }

    const user = await userServices.getSpecificUser(subscriptionPurchase.user.toString());
    if (!user) {
      throw new CustomError.NotFoundError('User not found!');
    }

    const stripeSubscriptionId = subscriptionPurchase.subscription?.subscriptionId;
    if (!stripeSubscriptionId) {
      throw new CustomError.BadRequestError('Stripe subscription ID not found!');
    }

    // Cancel at period end on Stripe
    await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local DB
    subscriptionPurchase.isActive = false;
    await subscriptionPurchase.save();


    // Send cancellation email
    await sendMail({
      from: config.gmail_app_user as string,
      to: user.email,
      subject: 'Subscription Cancellation',
      text: `Your subscription has been successfully scheduled for cancellation at the end of the current billing period.`,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Subscription cancellation scheduled successfully',
    });
  });

export default {
  createSubscriptionPurchaseController,
  cancelSubscription
};
