import { MongoDB } from '../src/index';

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
