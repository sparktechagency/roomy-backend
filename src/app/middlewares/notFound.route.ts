import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response): void => {
  const url = req.url
  res.status(StatusCodes.NOT_FOUND).json({
    message: `${url} - Route doesn't exist`,
  });
};

export default notFound;
