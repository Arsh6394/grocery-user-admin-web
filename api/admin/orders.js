const { ObjectId } = require('mongodb');
const { getDb } = require('../_lib/mongo');
const { requireAdmin, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireAdmin(req, res)) return;

  try {
    const db = await getDb();
    const col = db.collection('orders');

    if (req.method === 'GET') {
      const items = await col.find({}).sort({ createdAt: -1 }).limit(500).toArray();
      return res.status(200).json({ items });
    }

    if (req.method === 'PUT') {
      const { _id, status, trackingUpdate } = req.body || {};
      if (!_id) return res.status(400).json({ error: '_id required' });
      const set = { updatedAt: new Date() };
      if (status) set.status = status;
      const ops = { $set: set };
      if (trackingUpdate) {
        ops.$push = {
          trackingUpdates: {
            status: trackingUpdate.status || 'Update',
            message: trackingUpdate.message || '',
            timestamp: new Date()
          }
        };
      }
      await col.updateOne({ _id: new ObjectId(_id) }, ops);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/orders]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
