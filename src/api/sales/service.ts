import { ISale, ICarpet, IClient } from '../../database/models';
import repository from './repository';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Branch } from '../../common/enums';

const getAnalytics = (min: Date, max: Date, branch: string): Promise<any> =>
  Promise.all([
    repository.getSales(min, max, branch),
    repository.groupClients(min, max, branch)
  ]);

const getSaleById = (id: string, options?: IDBQueryOptions): IDBQuery<ISale> =>
  repository.findById(id, options);

const createSale = (body: any, options?: IDBQueryOptions): Promise<ISale> =>
  repository.create(body, options);

const updateSale = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<ISale> => repository.findByIdAndUpdate(id, body, options);

const softDeleteSale = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

const prepareBody = (
  carpet: ICarpet,
  clientId: IClient,
  finalPricePerSquareMeter: number
): any => ({
  date: new Date(),
  supplier: carpet.supplier,
  type: carpet.type,
  branch: carpet.type,
  client: clientId,
  carpet: carpet._id,
  material: carpet.material,
  price: carpet.width * carpet.length * finalPricePerSquareMeter
});

export {
  getAnalytics,
  getSaleById,
  createSale,
  updateSale,
  softDeleteSale,
  prepareBody
};
