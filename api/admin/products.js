const { ObjectId } = require('mongodb');
const { getDb } = require('../_lib/mongo');
const { requireAdmin, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireAdmin(req, res)) return;

  try {
    const db = await getDb();
    const col = db.collection('products');

    if (req.method === 'GET') {
      const items = await col.find({}).sort({ createdAt: -1 }).limit(500).toArray();
      return res.status(200).json({ items });
    }

    if (req.method === 'POST') {
      const { name, price, category, stock, image, description } = req.body || {};
      if (!name || price == null) return res.status(400).json({ error: 'name and price required' });
      const doc = {
        name: String(name),
        price: Number(price),
        category: category || 'general',
        stock: Number(stock || 0),
        image: image || '',
        description: description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await col.insertOne(doc);
      return res.status(201).json({ _id: result.insertedId, ...doc });
    }

    if (req.method === 'PUT') {
      const { _id, ...rest } = req.body || {};
      if (!_id) return res.status(400).json({ error: '_id required' });
      const update = { ...rest, updatedAt: new Date() };
      delete update.createdAt;
      await col.updateOne({ _id: new ObjectId(_id) }, { $set: update });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || (req.body && req.body._id);
      if (!id) return res.status(400).json({ error: 'id required' });
      await col.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/products]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
