import { expect } from 'chai';
import { MongoDB } from './index';

interface Schema {
  name: string;
}

interface Schema2 {
  surname: string;
}

const collection = MongoDB.connection.createCollection<Schema>({
  collectionName: 'tests',
});

describe('mongodb', () => {

  before(async () => {
    await MongoDB.connection.open('mongodb://127.0.0.1:27017/mongodb-test?retryWrites=true&authSource=mognodb-test2');
  });

  after(async () => {
    await MongoDB.connection.close();
  });

  beforeEach(async () => {
    await collection.insertOne({
      name: 'andy',
    });
  });

  afterEach(async () => {
    await collection.deleteMany({});
  });

  it('should findOne', async () => {
    await collection.findOne({}).then((r) => {
      if (!r) {
        throw new Error('record should be there');
      }

      expect(r.name).to.equals('andy');
    });
  });

  it('should find', async () => {
    const records = await collection.find({}).toArray();

    expect(records[0].name).to.equals('andy');
  });

  it('should find cursor()', async () => {
    const cursor = collection.find({});

    while (await cursor.hasNext()) {
      const record = await cursor.next();

      if (!record) {
        throw new Error('no record');
      }

      expect(record.name).to.equals('andy');
    }
  });

  it('should insert', async () => {
    await collection.insertOne({
      name: 'john',
    });
    await collection.insertMany([{
      name: 'john',
    }]);
  });

  it('should aggregate', async () => {
    const records = await collection.aggregate<Schema2>([{
      $project: {
        surname: '$name',
      },
    }])
      .toArray();

    expect(records.length).to.be.a('number');
    for (const record of records) {
      expect(record.surname).to.be.a('string');
    }
  });

  it('should ignore undefined values', async () => {
    await collection.deleteMany({});
    const r = await collection.updateOne({}, {
      $set: {
        shouldBeMissing: undefined,
        shouldBeNull: null,
        visible: true,
      },
    }, {
      upsert: true,
    });

    const record = await collection.findOne({});

    expect(record).to.deep.equals({
      _id: r.upsertedId._id,
      shouldBeNull: null,
      visible: true,
    });
  });

  it('should return collectionName', async () => {
    expect(collection.collectionName).to.equals('tests');
  });

  describe('transactions', () => {
    it('should support transactions', async () => {
      const client = MongoDB.connection.getClient();
      const session = client.startSession();

      expect((<any>session).startTransaction).to.be.an('function');
    });

    it('should not create docs in the db if transaction was aborted', async () => {
      const client = MongoDB.connection.getClient();
      const session = client.startSession();

      await client.db('test').createCollection('one');
      await client.db('test').createCollection('two');

      const one = client.db('test').collection('one');
      const two = client.db('test').collection('two');

      await one.deleteMany({});
      await two.deleteMany({});

      session.startTransaction({});

      await one.insertOne({ test: true }, { session });
      await two.insertOne({ test: false }, { session });

      await (<any>session).abortTransaction();

      await client.db('test').collection('one').estimatedDocumentCount().then((r) => {
        expect(r).to.equals(0);
      });

      await client.db('test').collection('two').estimatedDocumentCount().then((r) => {
        expect(r).to.equals(0);
      });
    });

    it('should throw if not connected', async () => {
      const connection = new MongoDB.Connection();
      const collection = connection.createCollection({
        collectionName: 'test2',
      });

      try {
        await collection.findOne({});
      } catch (e) {
        expect(e.message).to.match(/not connected/);
      }
    });

    it('should create indexes', async () => {
      await collection.createIndex({
        poi: 1,
      }, {
        name: 'test',
        unique: true,
      });

      await collection.dropIndex('test');
    });
  });
});
