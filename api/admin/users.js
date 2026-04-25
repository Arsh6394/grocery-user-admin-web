const { getDb } = require('../_lib/mongo');
const { requireAdmin, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireAdmin(req, res)) return;

  try {
    const db = await getDb();
    const col = db.collection('users');

    if (req.method === 'GET') {
      const items = await col
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray();
      return res.status(200).json({ items });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/users]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
