import { Request } from 'express';
import { IAuthInfo } from '.';

export interface IRequest extends Request {
  authInfo?: IAuthInfo;
}
