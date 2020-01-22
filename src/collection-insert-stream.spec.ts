import { expect } from 'chai';
import { CollectionInsertStream } from './collection-insert-stream';
import { MongoDB } from './index';

describe('collection insert stream', () => {
  it('should ', async () => {
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

    const cis = new CollectionInsertStream(collection);
    await cis.start();

    const buffer: Array<any> = [];

    await cis.findAndTail({
      name: 'john10',
    }, (doc) => {
      buffer.push(doc);
    });

    await collection.insertOne({ name: 'john10' } as any);
    await collection.insertOne({ name: 'john10' } as any);
    await collection.insertOne({ name: 'john11' } as any);

    await new Promise((r) => setTimeout(r, 100));

    expect(buffer.length).to.equals(2);
  }).timeout(0);
});
