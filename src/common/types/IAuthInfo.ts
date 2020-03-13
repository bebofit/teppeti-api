import { IAuthUserType } from '../../database/models';
import { IPermissions } from './IPermissions';

export interface IAuthInfo {
  userId: string;
  brokerId?: string;
  jti?: string;
  accountType?: IAuthUserType;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  permissions?: IPermissions;
}
