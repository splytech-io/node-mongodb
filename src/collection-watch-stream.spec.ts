import { expect } from 'chai';
import { CollectionWatchStream } from './collection-watch-stream';
import { MongoDB } from './index';

describe('collection watch stream', () => {
  it('should deliver inserts only', async () => {
    interface Schema {
      _id: MongoDB.ObjectID;
      name: string;
    }

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<Schema>({
      collectionName: 'test',
    });

    await connection.open('mongodb://127.0.0.1:27017/test');
    await collection.deleteMany({});

    const cis = new CollectionWatchStream(collection, {
      operationType: 'insert',
    });
    await cis.start();

    const buffer: Array<any> = [];

    await cis.findAndTail({
      name: 'john10',
    }, (doc) => {
      buffer.push(doc);
    });

    await collection.insertOne({ name: 'john10' } as any);
    await collection.updateOne({}, { $set: { surname: 'two' } });
    await collection.insertOne({ name: 'john10' } as any);
    await collection.insertOne({ name: 'john11' } as any);

    await new Promise((r) => setTimeout(r, 100));

    expect(buffer.length).to.equals(2);
  });
  it('should deliver updated only', async () => {
    interface Schema {
      _id: MongoDB.ObjectID;
      name: string;
    }

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<Schema>({
      collectionName: 'test',
    });

    await connection.open('mongodb://127.0.0.1:27017/test');
    await collection.deleteMany({});

    const cis = new CollectionWatchStream(collection, {
      operationType: 'update',
    });
    await cis.start();

    const buffer: Array<any> = [];

    await cis.findAndTail({
      name: 'john10',
    }, (doc) => {
      buffer.push(doc);
    });

    await collection.insertOne({ name: 'john10' } as any);
    await collection.updateOne({}, { $set: { surname: 'two' } });
    await collection.insertOne({ name: 'john10' } as any);
    await collection.insertOne({ name: 'john11' } as any);

    await new Promise((r) => setTimeout(r, 100));

    expect(buffer.length).to.equals(1);
  });
  it('should deliver inserts and updates', async () => {
    interface Schema {
      _id: MongoDB.ObjectID;
      name: string;
    }

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<Schema>({
      collectionName: 'test',
    });

    await connection.open('mongodb://127.0.0.1:27017/test');
    await collection.deleteMany({});

    const cis = new CollectionWatchStream(collection, {
      operationType: ['update', 'insert'],
    });
    await cis.start();

    const buffer: Array<any> = [];

    await cis.findAndTail({
      name: 'john10',
    }, (doc) => {
      buffer.push(doc);
    });

    await collection.insertOne({ name: 'john10' } as any);
    await collection.updateOne({}, { $set: { surname: 'two' } });
    await collection.insertOne({ name: 'john10' } as any);
    await collection.insertOne({ name: 'john11' } as any);

    await new Promise((r) => setTimeout(r, 100));

    expect(buffer.length).to.equals(3);
  });
});
