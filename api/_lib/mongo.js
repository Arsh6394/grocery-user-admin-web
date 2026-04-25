const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'freshmart';

if (!uri) {
  console.warn('[mongo] MONGODB_URI not set');
}

let cached = global.__mongo;
if (!cached) cached = global.__mongo = { client: null, promise: null };

async function getDb() {
  if (cached.client) return cached.client.db(dbName);
  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000
    }).then((client) => {
      cached.client = client;
      return client;
    });
  }
  const client = await cached.promise;
  return client.db(dbName);
}

module.exports = { getDb };
