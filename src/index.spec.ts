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
    await MongoDB.connection.open('mongodb://127.0.0.1/mongodb-test');
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
});
