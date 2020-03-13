import { Response } from 'express';
import { NOT_FOUND } from 'http-status';
import { IRequest } from '../types';

function middleware(req: IRequest, res: Response): void {
  res.status(NOT_FOUND).send();
}

export default middleware;
