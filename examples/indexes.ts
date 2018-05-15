import { MongoDB } from '../src/index';
import connection = MongoDB.connection;

interface Schema {
  name: string;
}

const User = connection.createCollection<Schema>({
  collectionName: 'users',
  indexes: [{
    spec: {
      username: 1,
    },
    options: {
      unique: true,
    },
  }],
});

// connect and create indexes
connection.open('mongodb://127.0.0.1').then(async () => {
  await User.count({});
}, (e) => {
  console.error(e);

  // connection or creation of indexes failed
});
