import { IMovingStock } from '../../database/models';
import repository from './repository';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Branch } from '../../common/enums';

const getMovingStocksBySender = (
  sender: Branch,
  options?: IDBQueryOptions
): IDBQuery<IMovingStock> =>
  repository.getMovingStocksBySender(sender, options);

const getMovingStocksByReceiver = (
  sender: Branch,
  options?: IDBQueryOptions
): IDBQuery<IMovingStock> =>
  repository.getMovingStocksByReceiver(sender, options);

const getMovingStockById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IMovingStock> => repository.findById(id, options);

const createMovingStock = (
  body: any,
  options?: IDBQueryOptions
): Promise<IMovingStock> => repository.create(body, options);

const acceptMovingStock = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): Promise<boolean> => repository.acceptMovingStock(id, body, options);

const softDeleteMovingStock = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

export {
  getMovingStockById,
  getMovingStocksBySender,
  getMovingStocksByReceiver,
  createMovingStock,
  acceptMovingStock,
  softDeleteMovingStock
};
