import { NextFunction, Request, RequestHandler, Response } from 'express';

const handleAsync = (controller: RequestHandler) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default handleAsync;
