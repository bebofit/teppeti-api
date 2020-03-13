import { NextFunction, Response } from 'express';
import { UNPROCESSABLE_ENTITY } from 'http-status';
import { IRequest } from '../types';

function middleware(
  err: any,
  req: IRequest,
  res: Response,
  next: NextFunction
): void {
  if (err.validationError) {
    res.status(UNPROCESSABLE_ENTITY).json(err);
  } else {
    next(err);
  }
}

export default middleware;
