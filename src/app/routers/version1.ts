import express from 'express';
import userRouter from '../modules/user-module/user.routes';
import verificationRouter from '../modules/verification-module/verification.routes';
import userAuthRouter from '../modules/auth-module/user-auth-module/auth.routes';
import adminAuthRouter from '../modules/auth-module/admin-auth-module/auth.routes';

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
];

appRouters.forEach((router) => {
  routersVersionOne.use(router.path, router.router);
});

export default routersVersionOne;
