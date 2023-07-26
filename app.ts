import bodyParser from 'body-parser';
import express from 'express';
import {Middleware} from './libs/middleware';
import {ConversationController} from './controllers';

export const createApp = function () {
  const app: express.Application = express();
  // Add body parsers.
  app.use(bodyParser.json());
  // Add parsers for application/x-www-form-urlencoded and application/json.
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // Add headers for CORS.
  app.use(Middleware.addAllowCrossDomainHeaders);
  // Add routes.
  app.use('/conversation', ConversationController);
  return app;
};
