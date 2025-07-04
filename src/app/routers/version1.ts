import express from 'express';
import adminAuthRouter from '../modules/auth/adminAuth/admin.auth.routes';
import userAuthRouter from '../modules/auth/userAuth/user.auth.routes';
import blogRouter from '../modules/blog/blog.routes';
import listingRouter from '../modules/listing/listing.routes';
import userRouter from '../modules/user/user.routes';
import verificationRouter from '../modules/verification/verification.routes';
import adminRouter from '../modules/admin/admin.routes';
import categoryRouter from '../modules/category/category.routes';
import reviewRouter from '../modules/review/review.routes';
import profileRouter from '../modules/profile/profile.routes';

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
];

appRouters.forEach((router) => {
  routersVersionOne.use(router.path, router.router);
});

export default routersVersionOne;
