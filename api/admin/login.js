const bcrypt = require('bcryptjs');
const { getDb } = require('../_lib/mongo');
const { signAdminToken, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const db = await getDb();
    const admins = db.collection('admins');

    let admin = await admins.findOne({ email: String(email).toLowerCase() });

    if (!admin) {
      const bootstrapEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || '').toLowerCase();
      const bootstrapPwd = process.env.ADMIN_BOOTSTRAP_PASSWORD || '';
      if (
        bootstrapEmail &&
        bootstrapPwd &&
        String(email).toLowerCase() === bootstrapEmail &&
        password === bootstrapPwd
      ) {
        const hash = await bcrypt.hash(password, 10);
        const insert = await admins.insertOne({
          email: bootstrapEmail,
          passwordHash: hash,
          role: 'superadmin',
          createdAt: new Date()
        });
        admin = { _id: insert.insertedId, email: bootstrapEmail, role: 'superadmin' };
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      const ok = await bcrypt.compare(password, admin.passwordHash || '');
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signAdminToken(admin);
    return res.status(200).json({
      token,
      admin: { email: admin.email, role: admin.role || 'admin' }
    });
  } catch (err) {
    console.error('[admin/login]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
