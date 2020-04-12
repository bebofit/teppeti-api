import { IPermission } from '../../database/models';
import { UserType } from '../enums';

export interface IAuthInfo {
  userId: string;
  isSalesManager: boolean;
  jti?: string;
  isSuperAdmin?: boolean;
  permissions?: IPermission;
  branch?: UserType;
}
