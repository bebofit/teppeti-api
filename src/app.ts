import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import routes from './api';
import {
  validationErrorHandler,
  logicErrorHandler,
  notFoundErrorHandler
} from './common/middleware';
import { isDeployed, isTesting } from './config';
// import swaggerUi from 'swagger-ui-express';
// import * as swaggerDocument from './swagger.json';

const app = express();
if (isDeployed) {
  // Trust the proxy to give us the correct client IP address as we are behind AWS ELB not front facing the client
  app.set('trust proxy', true);
}
if (!isTesting) {
  app.use(logger(isDeployed ? 'combined' : 'dev'));
}
app.use(helmet());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use('/api', routes);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(validationErrorHandler);
app.use(logicErrorHandler);
app.use(notFoundErrorHandler);

export default app;
