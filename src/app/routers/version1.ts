import express from 'express';
import adminRouter from '../modules/admin/admin.routes';
import adminAuthRouter from '../modules/auth/adminAuth/admin.auth.routes';
import userAuthRouter from '../modules/auth/userAuth/user.auth.routes';
import blogRouter from '../modules/blog/blog.routes';
import categoryRouter from '../modules/category/category.routes';
import listingRouter from '../modules/listing/listing.routes';
import platformFeeRouter from '../modules/platformFee/platform.routes';
import privacyPolicyRouter from '../modules/privacyPolicy/privacyPolicy.routes';
import profileRouter from '../modules/profile/profile.routes';
import reviewRouter from '../modules/review/review.routes';
import termsConditionRouter from '../modules/termsCondition/termsCondition.routes';
import userRouter from '../modules/user/user.routes';
import verificationRouter from '../modules/verification/verification.routes';
import stripeRouter from '../modules/stripe/stripe.routes';

const routersVersionOne = express.Router();

const appRouters = [
  {
    path: '/user',
    router: userRouter,
  },
  {
    path: '/profile',
    router: profileRouter,
  },
  {
    path: '/admin',
    router: adminRouter,
  },
  {
    path: '/user/auth',
    router: userAuthRouter,
  },
  {
    path: '/admin/auth',
    router: adminAuthRouter,
  },
  {
    path: '/verification',
    router: verificationRouter,
  },
  {
    path: '/listing',
    router: listingRouter,
  },
  {
    path: '/blog',
    router: blogRouter,
  },
  {
    path: '/category',
    router: categoryRouter,
  },
  {
    path: '/review',
    router: reviewRouter,
  },
  {
    path: '/platform-fee',
    router: platformFeeRouter,
  },

  {
    path: '/stripe',
    router: stripeRouter,
  },
  {
    path: '/terms-condition',
    router: termsConditionRouter,
  },
  {
    path: '/privacy-policy',
    router: privacyPolicyRouter,
  },
];

appRouters.forEach((router) => {
  routersVersionOne.use(router.path, router.router);
});

export default routersVersionOne;
