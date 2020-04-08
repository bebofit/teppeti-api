import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQuery } from '../../common/types';
import { ISale, Sale } from '../../database/models';

class SaleRepository extends BaseDBRepository<ISale> {
  constructor(protected model: Model<ISale>) {
    super(model);
  }

  async getSales(min: Date, max: Date, branch: string): Promise<any> {
    const res = await this.model.aggregate([
      {
        $match: {
          branch,
          date: { $gte: min, $lte: max }
        }
      },
      {
        $group: {
          _id: {
            $add: [
              { $dayOfYear: '$date' },
              { $multiply: [400, { $year: '$date' }] }
            ]
          },
          // branch: { $first: '$branch' },
          // soldItems: { $sum: 1 },
          // first: { $min: '$date' },
          sales: { $sum: '$price' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          //     // yearMonthDayUTC: {
          //     //   $dateToString: { format: '%d-%m-%Y', date: '$first' }
          //     // },
          //     // date: '$first',
          sales: 1,
          _id: 0
        }
      }
    ]);
    return res.map(s => s.sales);
  }

  groupClients(min: Date, max: Date, branch: string): IDBQuery<ISale> {
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: min, $lte: max }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'client',
            foreignField: '_id',
            as: 'cc'
          }
        },
        { $unwind: '$cc' },
        {
          $group: {
            _id: '$cc',
            soldItems: { $sum: 1 },
            amountPaid: { $sum: '$price' }
          }
        },
        { $sort: { soldItems: -1, amountPaid: -1 } },
        {
          $project: {
            soldItems: 1,
            amountPaid: 1,
            client: {
              name: '$_id.name',
              _id: '$_id._id',
              phoneNumber: '$_id.phoneNumber'
            },
            _id: 0
          }
        }
      ])
      .exec();
  }
}

const saleRepository = new SaleRepository(Sale);

export default saleRepository;
