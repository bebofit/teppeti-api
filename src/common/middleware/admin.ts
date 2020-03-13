import { NextFunction, Response } from 'express';
import { FORBIDDEN } from 'http-status';
import { Permission } from '../enums';
import { IPermissionType, IRequest, IResource } from '../types';

function middleware(req: IRequest, res: Response, next: NextFunction): void {
  const { isAdmin, permissions, isSuperAdmin } = req.authInfo;
  if (!(isAdmin || isSuperAdmin)) {
    return next({
      statusCode: FORBIDDEN
    });
  }
  if (isSuperAdmin) {
    return next();
  }
  const resource = req.baseUrl
    .split('/')
    .pop()
    .split('-')
    .map((x: string, index: number) =>
      index > 0 ? `${x.charAt(0).toUpperCase()}${x.slice(1)}` : x
    )
    .join('') as IResource;
  const method = req.method;
  let permission: IPermissionType;
  switch (method) {
    case 'GET':
      permission = Permission.Read;
      break;
    case 'POST':
      permission = Permission.Create;
      break;
    case 'PATCH':
      permission = Permission.Update;
      break;
    case 'DELETE':
      permission = Permission.Delete;
      break;
  }
  if (!permissions[resource] || !permissions[resource][permission]) {
    return next({
      statusCode: FORBIDDEN
    });
  }
  next();
}

export default middleware;
