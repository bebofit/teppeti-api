import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { MovingStock, IMovingStock } from '../../database/models';
import { Branch, MovingStockStatus } from '../../common/enums';

class MovingStockRepository extends BaseDBRepository<IMovingStock> {
  constructor(protected model: Model<IMovingStock>) {
    super(model);
  }

  getMovingStocksBySender(
    sender: Branch,
    options?: IDBQueryOptions
  ): IDBQuery<IMovingStock> {
    return super
      .find({ sender }, options)
      .populate('receivedCarpets', 'id code')
      .populate('sentCarpets', 'id code');
  }

  getMovingStocksByReceiver(
    receiver: Branch,
    options?: IDBQueryOptions
  ): IDBQuery<IMovingStock> {
    return super
      .find({ receiver }, options)
      .populate('receivedCarpets', 'id code')
      .populate('sentCarpets', 'id code');
  }

  acceptMovingStock(
    id: string,
    body: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { _id: id, receiver: body.receiver },
      {
        receivedCarpets: body.receivedCarpets,
        status: MovingStockStatus.Received
        // $pull: { sentCarpets: { $in: body.receivedCarpets } }
      },
      options
    );
  }
}

const movingStockRepository = new MovingStockRepository(MovingStock);

export default movingStockRepository;
