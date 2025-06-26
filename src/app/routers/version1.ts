import express from 'express';
import userRouter from '../modules/user-module/user.routes';


const routersVersionOne = express.Router();

const appRouters = [
    {
    path: '/user',
    router: userRouter,
  },
];

appRouters.forEach((router) => {
  routersVersionOne.use(router.path, router.router);
});

export default routersVersionOne;
