// Quick connectivity check. Run: node scripts/ping-mongo.js
const fs = require('fs');
const path = require('path');

if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const text = fs.readFileSync(envPath, 'utf8');
    text.split('\n').forEach(line => {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2];
    });
  } catch {}
}

const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('OK: connected to MongoDB');
  } catch (err) {
    console.error('FAIL:', err.message);
    process.exit(2);
  } finally {
    await client.close();
  }
})();
