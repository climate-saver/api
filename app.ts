import express from 'express';
import {UserController} from './controllers/user';
import {Middleware} from './libs/middleware';

export const createApp = function () {
  const app: express.Application = express();
  // Add headers for CORS.
  app.use(Middleware.addAllowCrossDomainHeaders);
  // Add routes.
  app.use('/user', UserController);
  return app;
};
