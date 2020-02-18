import { Utils } from '@splytech-io/utils';
import { expect } from 'chai';
import { CollectionWatchStream } from './collection-watch-stream';
import { MongoDB } from './index';
import sinon = require('sinon');

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

    await connection.close();
  });
  it('should deliver updated only', async () => {
    interface Schema {
      _id: MongoDB.ObjectID;
      name: string;
    }

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<Schema>({
      collectionName: 'test2',
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
    await connection.close();
  });
  it('should deliver inserts and updates', async () => {
    interface Schema {
      _id: MongoDB.ObjectID;
      name: string;
    }

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<Schema>({
      collectionName: 'test3',
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
    await connection.close();
  });
  it('should warn about overuse of watch operations', async () => {
    const warnStub = sinon.stub(console, 'warn');

    const connection = new MongoDB.Connection();
    const collection = connection.createCollection<any>({
      collectionName: 'test4',
    });

    await connection.open('mongodb://127.0.0.1:27017/test?replSet=local');

    await collection.insertOne({});

    const cursor1 = collection.watch([]).stream();
    const cursor2 = collection.watch([]).stream();

    cursor1.pipe(Utils.callbackStream(() => void 0));
    cursor2.pipe(Utils.callbackStream(() => void 0));

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    await connection.close();

    expect(warnStub.callCount).to.equals(1);
    expect(warnStub.getCall(0).args[0]).to.match(/number of watch operations/);
  });
});
