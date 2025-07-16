import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import config from './config';

import compression from 'compression';
import CustomError from './app/errors';
import globalErrorHandler from './app/middlewares/globalHandle.error';
import notFound from './app/middlewares/notFound.route';
import routers from './app/routers';
import { compressionOptions } from './config/compression.config';
import { errorHandler, successHandler } from './config/morgan';
import { applyRateLimit } from './config/rateLimit.config';
import rootDesign from './helpers/rootDesign';

const app: Application = express();

// app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
// global middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (config.node_env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

app.use(cookieParser());
app.use(compression(compressionOptions));
// app.use(helmetConfig);
app.use('/v1/uploads', express.static(path.join('uploads')));
app.use(applyRateLimit());

// application middleware
app.use('/', routers);

// send html design with a button 'click to see server health' and integrate an api to check server health
app.get('/', rootDesign);

app.get('/health_check', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the server. Server health is good.',
  });
});

//
app.get('/plan', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Example error logging
app.get('/error', (_req, _res, next) => {
  next(new CustomError.BadRequestError('Testing error'));
});

app.get('/favicon.ico', (_req: Request, res: Response) => {
  res.status(204).end(); // No Content
});

// Error handling middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
