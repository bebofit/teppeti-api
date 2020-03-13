import { NextFunction, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { isProduction } from '../../config';
import { IRequest } from '../types';

function middleware(
  err: any,
  req: IRequest,
  res: Response,
  next: NextFunction
): void {
  if (!isProduction) {
    console.error(err);
  }
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const errorCode = err.errorCode;
  if (errorCode) {
    res.status(statusCode).json({
      errorCode
    });
  } else {
    res.status(statusCode).send();
  }
}

export default middleware;
