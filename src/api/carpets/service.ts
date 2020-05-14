import { ICarpet } from '../../database/models';
import repository from './repository';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Branch } from '../../common/enums';

const getCarpets = (options?: IDBQueryOptions): IDBQuery<ICarpet> =>
  repository.getCarpets(options);

const getCarpetsByBranch = (
  branch: Branch,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.getCarpetsByBranch(branch, options);

const getCarpetById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.findById(id, options);

const searchCarpets = (
  branch: string,
  body: any,
  options: IDBQueryOptions
): IDBQuery<ICarpet> => repository.searchCarpets(branch, body, options);

const getSoldCarpets = (options?: IDBQueryOptions): IDBQuery<ICarpet> =>
  repository.getSoldCarpets(options);

const createCarpet = (body: any, options?: IDBQueryOptions): Promise<ICarpet> =>
  repository.create(body, options);

const sellCarpet = (
  id: string,
  finalPricePerSquareMeter: string,
  client: string,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> =>
  repository.sellCarpet(id, finalPricePerSquareMeter, client, options);

const lockCarpets = (
  carpetsIds: string[],
  options?: IDBQueryOptions
): Promise<boolean> => repository.lockCarpets(carpetsIds, options);

const unLockCarpets = (
  carpetsIds: string[],
  options?: IDBQueryOptions
): Promise<boolean> => repository.unLockCarpets(carpetsIds, options);

const updateCarpet = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.findByIdAndUpdate(id, body, options);

const updatePhoto = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.updatePhoto(id, body, options);

const moveCarpetToBranch = (
  id: string,
  branch: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.moveCarpetToBranch(id, branch, options);

const softDeleteCarpet = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

export {
  getCarpets,
  getSoldCarpets,
  searchCarpets,
  getCarpetsByBranch,
  moveCarpetToBranch,
  getCarpetById,
  createCarpet,
  sellCarpet,
  lockCarpets,
  unLockCarpets,
  updateCarpet,
  updatePhoto,
  softDeleteCarpet
};
