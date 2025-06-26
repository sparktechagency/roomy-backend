import { Router } from 'express';
import subscriptionController from './subcription.controller';

const subscriptionRouter = Router();

subscriptionRouter.post('/create', subscriptionController.createSubscription);
subscriptionRouter.get('/retrieve', subscriptionController.getSubscriptions);
subscriptionRouter.get('/retrieve/:id', subscriptionController.getSubscriptionById);
subscriptionRouter.patch('/update/:id', subscriptionController.updateSubscription);
subscriptionRouter.delete('/delete/:id', subscriptionController.deleteSubscription);

export default subscriptionRouter;
