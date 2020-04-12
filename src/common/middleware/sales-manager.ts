import { NextFunction, Response } from 'express';
import { FORBIDDEN } from 'http-status';
import { IRequest } from '../types';

function middleware(req: IRequest, res: Response, next: NextFunction): void {
  if (!req.authInfo.isSalesManager) {
    return next({
      statusCode: FORBIDDEN
    });
  }
  next();
}

export default middleware;
