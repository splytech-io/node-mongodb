import { MongoDB } from '../index';

const db1 = new MongoDB.Connection();
const db2 = new MongoDB.Connection();

const User = db1.createCollection({
  collectionName: 'users',
});

const Login = db2.createCollection({
  collectionName: 'logins',
});

async function main() {
  await db1.open('mongodb://127.0.0.1');
  await db2.open('mongodb://127.0.0.1');

  await User.count({});
  await Login.insertOne({});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
