import {
  IAuthInfo,
  IDBQueryOptions,
  IPaginatedData,
  IDBQuery
} from '../../common/types';
import { IUser } from '../../database/models';
import repository from './repository';

const getUsers = (options?: IDBQueryOptions): Promise<IPaginatedData<IUser>> =>
  Promise.all([
    repository.countAll(options),
    repository.findAll(options)
  ]).then(([total, results]) => ({ total, results }));

const getUserById = (id: string, options?: IDBQueryOptions): IDBQuery<IUser> =>
  repository.findById(id, options);

const createUser = (body: any): Promise<IUser> => repository.create(body);

const updateUser = (id: string, options?: IDBQueryOptions): IDBQuery<IUser> =>
  repository.findByIdAndUpdate(id, options);

const softDeleteUser = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.deleteById(id, options);

function isAuthorized(authInfo: IAuthInfo, user?: Partial<IUser>): boolean {
  if (authInfo.isSuperAdmin) {
    return true;
  }
  if (user?.id === authInfo.userId) {
    return true;
  }
  return false;
}

export {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  softDeleteUser,
  isAuthorized
};
