import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQuery, IDBQueryOptions } from '../../common/types';
import { ISale, Sale, ICarpet } from '../../database/models';

class SaleRepository extends BaseDBRepository<ISale> {
  constructor(protected model: Model<ISale>) {
    super(model);
  }

  createSale(
    amount: number,
    date: Date,
    branch: string,
    carpet?: ICarpet,
    options?: IDBQueryOptions
  ): IDBQuery<ISale> {
    const queryDate = new Date(date.setHours(1, 0, 0, 0));
    const body = carpet
      ? { date, $push: { carpets: carpet }, $inc: { totalAmount: amount } }
      : { date, totalAmount: 0 };
    return this.model.findOneAndUpdate({ branch, date: queryDate }, body, {
      ...options,
      upsert: true
    });
  }

  async getSales(min: Date, max: Date, branch: string): Promise<any> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    const res = await this.model.aggregate([
      {
        $match: {
          branch,
          date: { $gte: queryMin, $lte: queryMax }
        }
      },
      { $sort: { date: 1 } },
      { $project: { totalAmount: 1, _id: 0 } }
    ]);
    return res.map(s => s.totalAmount);
  }

  groupClients(min: Date, max: Date, branch: string): IDBQuery<ISale> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        {
          $unwind: '$carpets'
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'carpets.client',
            foreignField: '_id',
            as: 'cc'
          }
        },
        { $unwind: '$cc' },
        {
          $group: {
            _id: '$cc',
            soldItems: { $sum: 1 },
            amountPaid: { $sum: '$carpets.price' }
          }
        },
        { $sort: { soldItems: -1, amountPaid: -1 } },
        {
          $project: {
            soldItems: 1,
            amountPaid: 1,
            name: '$_id.name',
            _id: '$_id._id',
            phoneNumber: '$_id.phoneNumber'
          }
        }
      ])
      .exec();
  }

  async supplierPieChart(min: Date, max: Date, branch: string): Promise<any> {
    const [suppliersCarpets, totalNumberCarpets] = await Promise.all([
      this.groupSupplier(min, max, branch),
      this.numberOfCarpetsSold(min, max, branch)
    ]);
    return suppliersCarpets.map((supplier: any) => ({
      name: supplier._id,
      percentage: supplier.count / totalNumberCarpets
    }));
  }

  groupSupplier(min: Date, max: Date, branch: string): IDBQuery<ISale> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        {
          $unwind: '$carpets'
        },
        {
          $group: {
            _id: '$carpets.supplier',
            count: { $sum: 1 }
          }
        }
      ])
      .exec();
  }

  async materialPieChart(min: Date, max: Date, branch: string): Promise<any> {
    const [materialsCarpets, totalNumberCarpets] = await Promise.all([
      this.groupMaterial(min, max, branch),
      this.numberOfCarpetsSold(min, max, branch)
    ]);
    return materialsCarpets.map((material: any) => ({
      name: material._id,
      percentage: material.count / totalNumberCarpets
    }));
  }

  groupMaterial(min: Date, max: Date, branch: string): IDBQuery<ISale> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        {
          $unwind: '$carpets'
        },
        {
          $group: {
            _id: '$carpets.material',
            count: { $sum: 1 }
          }
        }
      ])
      .exec();
  }

  async typePieChart(min: Date, max: Date, branch: string): Promise<any> {
    const [typesCarpets, totalNumberCarpets] = await Promise.all([
      this.groupType(min, max, branch),
      this.numberOfCarpetsSold(min, max, branch)
    ]);
    return typesCarpets.map((type: any) => ({
      name: type._id,
      percentage: type.count / totalNumberCarpets
    }));
  }

  groupType(min: Date, max: Date, branch: string): IDBQuery<ISale> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        {
          $unwind: '$carpets'
        },
        {
          $group: {
            _id: '$carpets.type',
            count: { $sum: 1 }
          }
        }
      ])
      .exec();
  }

  async numberOfCarpetsSold(
    min: Date,
    max: Date,
    branch: string
  ): Promise<any> {
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    return this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        {
          $unwind: '$carpets'
        },
        {
          $count: 'count'
        }
      ])
      .then((res: any) => res[0].count);
  }
}

const saleRepository = new SaleRepository(Sale);

export default saleRepository;
