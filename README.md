# @splytech-io/mongodb

Typescript MongoDB client library.

- [x] Document schema
- [x] Multiple connections
- [x] Typings

## Example

```js
import { MongoDB } from '../index';

interface Schema {
  name: string;
}

const User = MongoDB.connection.createCollection<Schema>({
  collectionName: 'users',
});

async function main() {
  await MongoDB.connection.open('mongodb://127.0.0.1/test');

  const user = await User.findOne({});

  if (!user) {
    throw new Error('user not found');
  }

  console.log(user.name);

  await MongoDB.connection.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

```

see more examples in `examples` folder

## MongoDB

### class MongoDB.Connection

#### open(url: string, options?: MongoClientOptions): Promise<void>;

Connects to the mongodb and creates indexes

#### close(): Promise<void>;

Disconnects from mongodb

#### createCollection<T>(options: CollectionOptions): Collection<T>;

Creates a collection

### const MongoDB.connection: Connection

default connection instance
