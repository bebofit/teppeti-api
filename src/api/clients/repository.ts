import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Client, IClient } from '../../database/models';
import { Branch } from '../../common/enums';

class ClientRepository extends BaseDBRepository<IClient> {
  constructor(protected model: Model<IClient>) {
    super(model);
  }

  searchClients(options: IDBQueryOptions): IDBQuery<IClient> {
    const search = options.search;
    return super.find({ $or: [{ phoneNumber: search, name: search }] });
  }
}

const clientRepository = new ClientRepository(Client);

export default clientRepository;
