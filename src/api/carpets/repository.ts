import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Carpet, ICarpet } from '../../database/models';
import { Branch } from '../../common/enums';

class CarpetRepository extends BaseDBRepository<ICarpet> {
  constructor(protected model: Model<ICarpet>) {
    super(model);
  }

  getCarpetsByBranch(
    branch: Branch,
    options?: IDBQueryOptions
  ): IDBQuery<ICarpet> {
    return super.find({ branch }, options);
  }

  moveCarpetToBranch(
    id: string,
    branch: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(id, { branch }, options);
  }
}

const carpetRepository = new CarpetRepository(Carpet);

export default carpetRepository;
