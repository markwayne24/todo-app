import { MongoDBService } from '@/databases/mongo/mongo.service';
import { Injectable } from '@nestjs/common';
import {
  Collection,
  Filter,
  Document,
  FindOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
  PushOperator,
} from 'mongodb';

type UpdateData = {
  [key: string]: any;
};

/**
 * Repository to work with database.
 */
@Injectable()
export abstract class AbstractRepository<TRecord extends Document> {
  readonly collection: Collection<TRecord>;

  constructor(
    readonly _mongo: MongoDBService,
    collectionName: string,
    databaseName: string = 'to-do',
  ) {
    this.collection = this._mongo
      .db(databaseName)
      .collection<TRecord>(collectionName);
  }

  async findOne(
    query: Filter<TRecord>,
    options?: FindOptions<TRecord> | { projection: { [key: string]: number } },
  ) {
    return this.collection.findOne(query, options);
  }

  async find(
    query: Filter<TRecord>,
    options?: FindOptions<TRecord> | { projection: { [key: string]: number } },
  ) {
    return this.collection.find(query, options).toArray();
  }

  async aggregate(params: Document[]) {
    return this.collection.aggregate(params).toArray();
  }

  async count(query: Filter<TRecord>) {
    return this.collection.countDocuments(query);
  }

  async create(params: OptionalUnlessRequiredId<TRecord>) {
    const data = {
      ...params,
      created_at: new Date(),
    };
    return this.collection.insertOne(data);
  }

  async updateOne(query: Filter<TRecord>, data: Partial<TRecord>) {
    return this.collection.updateOne(query, { $set: data });
  }

  async updateOneWithOptionalPush(
    query: Filter<TRecord>,
    data: Partial<TRecord & UpdateData>,
    push?: PushOperator<TRecord>,
  ) {
    if (push) {
      return this.collection.updateOne(query, { $set: data, $push: push });
    }

    return this.collection.updateOne(query, { $set: data });
  }

  async updateOneWithSet(query: Filter<TRecord>, data: UpdateFilter<TRecord>) {
    return this.collection.updateOne(query, data);
  }

  async findAndUpdate(query: Filter<TRecord>, data: UpdateFilter<TRecord>) {
    return this.collection.findOneAndUpdate(query, data);
  }

  async upsert(
    query: Filter<TRecord>,
    data: OptionalUnlessRequiredId<TRecord> | Partial<TRecord>,
  ) {
    const now = new Date();
    const updateData = {
      ...data,
      updated_at: now,
    } as Partial<TRecord>;

    const result = await this.collection.findOne(query);

    if (!result) {
      const id = await this.create(data as OptionalUnlessRequiredId<TRecord>);

      return {
        _id: id.insertedId,
      };
    }

    await this.updateOne(query, updateData);

    return {
      _id: result._id,
    };
  }

  async insertMany(data: OptionalUnlessRequiredId<TRecord>[]) {
    return this.collection.insertMany(data);
  }

  async updateMany(
    query: Filter<TRecord>,
    data: Partial<TRecord & UpdateData>,
  ) {
    return this.collection.updateMany(query, { $set: data });
  }

  async createIndex(keys: any, options?: any) {
    return this.collection.createIndex(keys, options);
  }

  async deleteMany(query: Filter<TRecord>) {
    return this.collection.deleteMany(query);
  }

  async deleteOne(query: Filter<TRecord>) {
    return this.collection.deleteOne(query);
  }
}
