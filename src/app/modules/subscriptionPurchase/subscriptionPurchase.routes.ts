import { Router } from 'express';


import subscriptionPurchaseController from './subscriptionPurchase.controller';

const subscriptionPurchaseRouter = Router();

// subscriptionPurchaseRouter.use(authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER))

subscriptionPurchaseRouter.post('/create/:id', subscriptionPurchaseController.createSubscriptionPurchaseController);

subscriptionPurchaseRouter.patch('/cancel/:id', subscriptionPurchaseController.cancelSubscription);

export default subscriptionPurchaseRouter