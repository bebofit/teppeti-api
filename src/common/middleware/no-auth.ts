import { NextFunction, Response } from 'express';
import { FORBIDDEN } from 'http-status';
import { extractToken, isNotAuthenticated } from '../../api/auth/service';
import { IRequest } from '../types';

async function middleware(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractToken(req.headers.authorization);
  try {
    await isNotAuthenticated(token);
    next();
  } catch (err) {
    next({
      statusCode: FORBIDDEN
    });
  }
}

export default middleware;
