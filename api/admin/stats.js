const { getDb } = require('../_lib/mongo');
const { requireAdmin, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireAdmin(req, res)) return;

  try {
    const db = await getDb();
    const [products, orders, users] = await Promise.all([
      db.collection('products').countDocuments(),
      db.collection('orders').countDocuments(),
      db.collection('users').countDocuments()
    ]);

    const revenueAgg = await db
      .collection('orders')
      .aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }])
      .toArray();
    const revenue = revenueAgg[0]?.total || 0;

    const recentOrders = await db
      .collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return res.status(200).json({
      products,
      orders,
      users,
      revenue,
      recentOrders
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
