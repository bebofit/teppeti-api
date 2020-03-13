import { IPartialRecord } from './IPartialRecord';
import { IPermissionType } from './IPermissionType';
import { IResource } from './IResource';

export type IPermissions = IPartialRecord<
  IResource,
  IPartialRecord<IPermissionType, Boolean>
>;
