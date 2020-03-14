import { IPermission } from '../../database/models';
import { UserType } from '../enums';

export interface IAuthInfo {
  userId: string;
  jti?: string;
  isSuperAdmin?: boolean;
  permissions?: IPermission;
  type?: UserType;
}
