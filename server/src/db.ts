import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const DB_NAME = 'todo-app';

let client: MongoClient | null = null;

export async function connectDB(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    // Sparse index: only indexes documents that have a dueDate field,
    // keeping the index small for todos without a due date.
    await client.db(DB_NAME).collection('todos').createIndex(
      { dueDate: 1 },
      { sparse: true }
    );
  }
  return client.db(DB_NAME);
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
