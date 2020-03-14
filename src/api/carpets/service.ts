import { ICarpet } from '../../database/models';
import repository from './repository';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Branch } from '../../common/enums';

const getCarpets = (options?: IDBQueryOptions): IDBQuery<ICarpet> =>
  repository.findAll(options);

const getCarpetsByBranch = (
  branch: Branch,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.getCarpetsByBranch(branch, options);

const getCarpetById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.findById(id, options);

const createCarpet = (body: any, options?: IDBQueryOptions): Promise<ICarpet> =>
  repository.create(body, options);

const updateCarpet = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<ICarpet> => repository.findByIdAndUpdate(id, body, options);

const softDeleteCarpet = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

export {
  getCarpets,
  getCarpetsByBranch,
  getCarpetById,
  createCarpet,
  updateCarpet,
  softDeleteCarpet
};
