import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQuery, IDBQueryOptions } from '../../common/types';
import { ISale, Sale, ICarpet, IBranch } from '../../database/models';
import { format } from 'date-fns';
import { ClientRef } from '../../common/enums';

class SaleRepository extends BaseDBRepository<ISale> {
  constructor(protected model: Model<ISale>) {
    super(model);
  }

  createSale(
    amount: number,
    date: Date,
    branch: IBranch,
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
    const xAxis: any = [];
    const yAxis: any = [];
    const queryMin = new Date(min.setHours(1, 0, 0, 0));
    const queryMax = new Date(max.setHours(1, 0, 0, 0));
    this.model
      .aggregate([
        {
          $match: {
            branch,
            date: { $gte: queryMin, $lte: queryMax }
          }
        },
        { $sort: { date: 1 } },
        {
          $project: {
            totalAmount: 1,
            _id: 0,
            date: 1
          }
        }
      ])
      .then(res =>
        res.map(sale => {
          xAxis.push(format(new Date(sale.date), 'dd-MMM-yyyy'));
          yAxis.push(sale.totalAmount);
        })
      );
    return { xAxis, yAxis };
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
    const suppliersCarpets = await this.groupSupplier(min, max, branch);
    const labels: any = [];
    const percentages: any = [];
    suppliersCarpets.map((supplier: any) => {
      labels.push(supplier._id), percentages.push(supplier.count);
    });
    return { labels, percentages };
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
    const materialsCarpets = await this.groupMaterial(min, max, branch);
    const labels: any = [];
    const percentages: any = [];
    materialsCarpets.map((material: any) => {
      labels.push(material._id), percentages.push(material.count);
    });
    return { labels, percentages };
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
    const typesCarpets = await this.groupType(min, max, branch);
    const labels: any = [];
    const percentages: any = [];
    typesCarpets.map((type: any) => {
      labels.push(type._id), percentages.push(type.count);
    });
    return { labels, percentages };
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

  async soldCarpets(min: Date, max: Date, branch: string): Promise<any> {
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
          $project: {
            _id: 0,
            carpets: 1
          }
        }
      ])
      .exec()
      .then((res: any) => res.map((c: any) => c.carpets));
  }

  groupColor(min: Date, max: Date, branch: string): IDBQuery<ISale> {
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
          $unwind: '$carpets.color.primary'
        },
        {
          $group: {
            _id: '$carpets.color.primary',
            count: { $sum: 1 }
          }
        }
      ])
      .exec();
  }

  async colorPieChart(min: Date, max: Date, branch: string): Promise<any> {
    const colorsCarpets = await this.groupColor(min, max, branch);
    const labels: any = [];
    const percentages: any = [];
    colorsCarpets.map((color: any) => {
      labels.push(color._id), percentages.push(color.count);
    });
    return { labels, percentages };
  }

  groupReferralsType(min: Date, max: Date, branch: string): IDBQuery<ISale> {
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
            _id: '$cc.reference.type',
            count: { $sum: 1 }
          }
        }
      ])
      .exec();
  }

  async referralTypePieChart(
    min: Date,
    max: Date,
    branch: string
  ): Promise<any> {
    const referralsCarpets = await this.groupReferralsType(min, max, branch);
    const labels: any = [];
    const percentages: any = [];
    referralsCarpets.map((referral: any) => {
      labels.push(referral._id), percentages.push(referral.count);
    });
    return { labels, percentages };
  }

  async groupReferralsWho(min: Date, max: Date, branch: string): Promise<any> {
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
          $match: {
            'cc.reference.type': ClientRef.Other
          }
        },
        {
          $group: {
            _id: '$cc.reference.who',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: 1 } },
        {
          $project: {
            _id: 0,
            who: '$_id',
            count: 1
          }
        }
      ])
      .exec();
  }
}

const saleRepository = new SaleRepository(Sale);

export default saleRepository;
