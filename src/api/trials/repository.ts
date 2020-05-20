import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { ITrial, Trial } from '../../database/models';
import { Branch, TrialStatus } from '../../common/enums';
import { IDBQueryOptions, IDBQuery } from '../../common/types';

class TrialRepository extends BaseDBRepository<ITrial> {
  constructor(protected model: Model<ITrial>) {
    super(model);
  }

  getTrails(sender: Branch, options?: IDBQueryOptions): IDBQuery<ITrial> {
    return super
      .find({ sender }, options)
      .populate('receivedCarpets')
      .populate('sentCarpets');
  }

  acceptTrial(
    id: string,
    body: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    const soldCarpets = body.soldCarpets.map((c: any) => c.id);
    return super.flexibleUpdateOne(
      { _id: id, sender: body.sender },
      {
        soldCarpets,
        status: TrialStatus.Sold,
        $pull: { sentCarpets: { $in: soldCarpets } }
      },
      options
    );
  }
}

export default new TrialRepository(Trial);
