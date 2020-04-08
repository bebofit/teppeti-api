import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Carpet, ICarpet } from '../../database/models';
import { Branch } from '../../common/enums';

class CarpetRepository extends BaseDBRepository<ICarpet> {
  constructor(protected model: Model<ICarpet>) {
    super(model);
  }

  getCarpets(options?: IDBQueryOptions): IDBQuery<ICarpet> {
    return super.find({ isSold: false, isLocked: false }, options);
  }

  getSoldCarpets(options?: IDBQueryOptions): IDBQuery<ICarpet> {
    return super.find({ isSold: true }, options);
  }

  lockCarpets(
    carpetsIds: string[],
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateMany(
      { _id: { $in: carpetsIds } },
      { isLocked: true },
      options
    );
  }

  unLockCarpets(
    carpetsIds: string[],
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateMany(
      { _id: { $in: carpetsIds } },
      { isLocked: false },
      options
    );
  }

  getCarpetsByBranch(
    branch: Branch,
    options?: IDBQueryOptions
  ): IDBQuery<ICarpet> {
    return super.find({ branch, isSold: false, isLocked: false }, options);
  }

  sellCarpet(
    id: string,
    finalPricePerSquareMeter: string,
    client: string,
    options?: IDBQueryOptions
  ): IDBQuery<ICarpet> {
    return super.findByIdAndUpdate(
      id,
      {
        finalPricePerSquareMeter,
        client,
        isSold: true,
        isLocked: false
      },
      options
    );
  }

  moveCarpetToBranch(
    id: string,
    branch: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(id, { branch }, options);
  }

  updatePhoto(
    id: string,
    body: any,
    options?: IDBQueryOptions
  ): IDBQuery<ICarpet> {
    return super.findByIdAndUpdate(id, { photo: body }, options);
  }
}

const carpetRepository = new CarpetRepository(Carpet);

export default carpetRepository;
