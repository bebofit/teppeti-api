import {
  IAuthInfo,
  IDBQueryOptions,
  IPaginatedData,
  IDBQuery
} from '../../common/types';
import { ITrial } from '../../database/models';
import repository from './repository';
import { Branch } from '../../common/enums';

const getTrials = (
  sender: Branch,
  options?: IDBQueryOptions
): IDBQuery<ITrial> => repository.getTrails(sender, options);

const getTrialById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<ITrial> => repository.findById(id, options);

const getTrialByIdAndLock = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<ITrial> => repository.findByIdAndLock(id, options);

const createTrial = (body: any, options?: IDBQueryOptions): Promise<ITrial> =>
  repository.create(body, options);

const updateTrial = (id: string, options?: IDBQueryOptions): IDBQuery<ITrial> =>
  repository.findByIdAndUpdate(id, options);

const acceptTrial = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): Promise<boolean> => repository.acceptTrial(id, body, options);

const softDeleteTrial = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.deleteById(id, options);

function isAuthorized(authInfo: IAuthInfo, user?: Partial<ITrial>): boolean {
  if (authInfo.isSuperAdmin) {
    return true;
  }
  if (user?.id === authInfo.userId) {
    return true;
  }
  return false;
}

export {
  getTrialById,
  getTrialByIdAndLock,
  getTrials,
  createTrial,
  acceptTrial,
  updateTrial,
  softDeleteTrial,
  isAuthorized
};
