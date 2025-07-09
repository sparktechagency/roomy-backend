import express from 'express';
import privacyPolicyControllers from './privacyPolicy.controllers';
import authentication from '../../middlewares/auth.middleware';


const privacyPolicyRouter = express.Router();

// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
privacyPolicyRouter.post(
  '/create-or-update',
  authentication('super-admin', 'admin'),
  privacyPolicyControllers.createOrUpdatePrivacyPolicy
);

// Route to retrieve Privacy Policy content (accessible to everyone)
privacyPolicyRouter.get(
  '/retrieve',
  privacyPolicyControllers.getPrivacyPolicy
);

export default privacyPolicyRouter;
