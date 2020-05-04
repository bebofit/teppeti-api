import { IDBQuery, IDBQueryOptions } from '../../common/types';
import { ICarpet, ISale } from '../../database/models';
import repository from './repository';

const getAnalytics = (min: Date, max: Date, branch: string): Promise<any> =>
  Promise.all([
    repository.getSales(min, max, branch),
    repository.groupClients(min, max, branch),
    repository.supplierPieChart(min, max, branch),
    repository.materialPieChart(min, max, branch),
    repository.typePieChart(min, max, branch),
    repository.soldCarpets(min, max, branch),
    repository.colorPieChart(min, max, branch),
    repository.referralTypePieChart(min, max, branch),
    repository.groupReferralsWho(min, max, branch)
  ]);

const getSaleById = (id: string, options?: IDBQueryOptions): IDBQuery<ISale> =>
  repository.findById(id, options);

const createSale = (
  amount: number,
  date: Date,
  branch: string,
  carpet?: ICarpet,
  options?: IDBQueryOptions
): IDBQuery<ISale> =>
  repository.createSale(amount, date, branch, carpet, options);

const updateSale = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<ISale> => repository.findByIdAndUpdate(id, body, options);

const softDeleteSale = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

export { getAnalytics, getSaleById, createSale, updateSale, softDeleteSale };
