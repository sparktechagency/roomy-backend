import express from 'express';
import adminAuthRouter from '../modules/auth/adminAuth/auth.routes';
import userAuthRouter from '../modules/auth/userAuth/auth.routes';
import listingRouter from '../modules/listing/listing.routes';
import userRouter from '../modules/user/user.routes';
import verificationRouter from '../modules/verification/verification.routes';
import blogRouter from '../modules/blog/blog.routes';


const routersVersionOne = express.Router();

const appRouters = [
  {
    path: '/user',
    router: userRouter,
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
];

appRouters.forEach((router) => {
  routersVersionOne.use(router.path, router.router);
});

export default routersVersionOne;
