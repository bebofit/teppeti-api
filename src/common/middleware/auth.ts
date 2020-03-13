import { NextFunction, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { extractToken, isAuthenticated } from '../../api/auth/service';
import { IRequest } from '../types';

async function middleware(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractToken(req.headers.authorization);
  try {
    const authInfo = await isAuthenticated(token);
    req.authInfo = authInfo;
    next();
  } catch (err) {
    next({
      statusCode: UNAUTHORIZED
    });
  }
}

export default middleware;
