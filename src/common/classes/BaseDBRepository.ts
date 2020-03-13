import { Document, Model } from 'mongoose';
import { IDBQuery, IDBQueryOptions } from '../types';
import { genObjectId } from '../utils';

export abstract class BaseDBRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  protected parseQueryOptions(options: IDBQueryOptions = {}): any {
    const result: any = {};
    // if (options.pojo == null) {
    //   result.lean = true;
    // }
    if (options.new == null) {
      result.new = true;
    }
    if (options.page != null) {
      result.skip = options.page * options.pageSize;
      result.limit = options.pageSize;
    }
    if (options.search) {
      result.search = options.search;
    }
    if (options.sort) {
      result.sort = options.sort;
    }
    if (options.includeDeleted) {
      result.includeDeleted = options.includeDeleted;
    }
    if (options.trx) {
      result.session = options.trx;
    }
    return result;
  }

  create(body: any, options?: IDBQueryOptions): Promise<T> {
    const parsedOptions = this.parseQueryOptions(options);
    const instance = new this.model(body);
    return instance.save({ session: parsedOptions.session });
  }

  find(conditions: any, options?: IDBQueryOptions): IDBQuery<T> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    if (parsedOptions.search) {
      conditions.$text = { $search: options.search };
    }
    return this.model.find(conditions, null, parsedOptions);
  }

  findAll(options?: IDBQueryOptions): IDBQuery<T> {
    return this.find({}, options);
  }

  count(conditions: any, options?: IDBQueryOptions): Promise<number> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    if (parsedOptions.search) {
      conditions.$text = { $search: options.search };
    }
    return this.model.countDocuments(conditions).exec();
  }

  countAll(options?: IDBQueryOptions): Promise<number> {
    return this.count({}, options);
  }

  findById(id: string, options?: IDBQueryOptions): IDBQuery<T> {
    return this.findOne({ _id: id }, options);
  }

  findOne(conditions: any, options?: IDBQueryOptions): IDBQuery<T> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model.findOne(conditions, null, parsedOptions);
  }

  findByIdAndUpdate(
    id: string,
    update: any,
    options?: IDBQueryOptions
  ): IDBQuery<T> {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  flexibleFindByIdAndUpdate(
    id: string,
    update: any,
    options?: IDBQueryOptions
  ): IDBQuery<T> {
    return this.flexibleFindOneAndUpdate({ _id: id }, update, options);
  }

  findOneAndUpdate(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): IDBQuery<T> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model.findOneAndUpdate(
      conditions,
      { $set: update },
      parsedOptions
    );
  }

  flexibleFindOneAndUpdate(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): IDBQuery<T> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model.findOneAndUpdate(conditions, update, parsedOptions);
  }

  findByIdAndLock(id: string, options?: IDBQueryOptions): IDBQuery<T> {
    return this.findByIdAndUpdate(id, { lock: genObjectId() }, options);
  }

  flexibleFindOneAndLock(
    conditions: any,
    options?: IDBQueryOptions
  ): IDBQuery<T> {
    return this.flexibleFindOneAndUpdate(
      conditions,
      { lock: genObjectId() },
      options
    );
  }

  updateById(
    id: string,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return this.updateOne({ _id: id }, update, options);
  }

  flexibleUpdateById(
    id: string,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return this.flexibleUpdateOne({ _id: id }, update, options);
  }

  updateOne(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model
      .updateOne(conditions, { $set: update }, parsedOptions)
      .exec()
      .then(result => result.n === 1);
  }

  flexibleUpdateOne(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model
      .updateOne(conditions, update, parsedOptions)
      .exec()
      .then(result => result.n === 1);
  }

  updateMany(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model
      .updateMany(conditions, { $set: update }, parsedOptions)
      .exec()
      .then(result => true);
  }

  updateAll(update: any, options?: IDBQueryOptions): Promise<boolean> {
    return this.updateMany({}, update, options);
  }

  flexibleUpdateMany(
    conditions: any,
    update: any,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    if (parsedOptions.includeDeleted == null) {
      conditions.deletedAt = null;
    }
    return this.model
      .updateMany(conditions, update, parsedOptions)
      .exec()
      .then(result => true);
  }

  flexibleUpdateAll(update: any, options?: IDBQueryOptions): Promise<boolean> {
    return this.flexibleUpdateMany({}, update, options);
  }

  softDeleteById(id: string, options?: IDBQueryOptions): Promise<boolean> {
    return this.softDeleteOne({ _id: id }, options);
  }

  softDeleteOne(conditions: any, options?: IDBQueryOptions): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    conditions.deletedAt = null;
    return this.model
      .updateOne(
        conditions,
        {
          $currentDate: {
            deletedAt: true
          }
        },
        parsedOptions
      )
      .exec()
      .then(result => result.n === 1);
  }

  softDeleteMany(conditions: any, options?: IDBQueryOptions): Promise<boolean> {
    const parsedOptions = this.parseQueryOptions(options);
    conditions.deletedAt = null;
    return this.model
      .updateMany(
        conditions,
        {
          $currentDate: {
            deletedAt: true
          }
        },
        parsedOptions
      )
      .exec()
      .then(result => true);
  }

  softDeleteAll(options?: IDBQueryOptions): Promise<boolean> {
    return this.softDeleteMany({}, options);
  }

  deleteById(id: string, options?: IDBQueryOptions): Promise<boolean> {
    return this.deleteOne({ _id: id }, options);
  }

  deleteOne(conditions: any, options?: IDBQueryOptions): Promise<boolean> {
    // To-do: clean this when @types/mongoose is updated
    return (this.model.deleteOne as any)(conditions, options)
      .exec()
      .then(
        (result: { ok?: number; n?: number; deletedCount?: number }) =>
          result.n === 1
      );
  }

  deleteMany(conditions: any, options?: IDBQueryOptions): Promise<boolean> {
    // To-do: clean this when @types/mongoose is updated
    return (this.model.deleteMany as any)(conditions, options)
      .exec()
      .then(
        (result: { ok?: number; n?: number; deletedCount?: number }) => true
      );
  }

  deleteAll(options?: IDBQueryOptions): Promise<boolean> {
    return this.deleteMany({}, options);
  }
}
