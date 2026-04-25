const { getDb } = require('./_lib/mongo');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({ ok: true, db: db.databaseName });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
