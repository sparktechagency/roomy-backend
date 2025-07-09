import express from 'express';
import termsConditionControllers from './termsCondition.controllers';
import authentication from '../../middlewares/auth.middleware';


const termsConditionRouter = express.Router();

termsConditionRouter.post(
  '/create-or-update',
  authentication('super-admin', 'admin'),
  termsConditionControllers.createOrUpdateTermsCondition
);


termsConditionRouter.get(
  '/retrieve',
  termsConditionControllers.getTermsCondition
);

export default termsConditionRouter;
