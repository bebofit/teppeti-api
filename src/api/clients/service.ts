import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { IClient } from '../../database/models';
import repository from './repository';

const getClients = (options?: IDBQueryOptions): IDBQuery<IClient> =>
  repository.findAll(options);

const searchClients = (options?: IDBQueryOptions): IDBQuery<IClient> =>
  repository.searchClients(options);

const getClientById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IClient> => repository.findById(id, options);

const createClient = (body: any, options?: IDBQueryOptions): Promise<IClient> =>
  repository.create(body, options);

const updateClient = (
  id: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<IClient> => repository.findByIdAndUpdate(id, body, options);

const softDeleteClient = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.softDeleteById(id, options);

export {
  getClients,
  searchClients,
  getClientById,
  createClient,
  updateClient,
  softDeleteClient
};
