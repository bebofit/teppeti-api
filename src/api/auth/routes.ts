import { Router } from 'express';
import errorHandler from 'express-async-handler';
import { isAuthenticated, isNotAuthenticated } from '../../common/middleware';
import * as controller from './controller';

const router = Router();

router.post(
  '/v1/registerUser',
  isNotAuthenticated,
  errorHandler(controller.registerUser)
);

router.post(
  '/v1/registerMobile',
  isNotAuthenticated,
  errorHandler(controller.registerMobile)
);

export default router;
