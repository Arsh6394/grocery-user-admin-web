const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const TOKEN_TTL = '12h';

function signAdminToken(admin) {
  return jwt.sign(
    { sub: String(admin._id), email: admin.email, role: admin.role || 'admin' },
    SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function verifyAdmin(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function requireAdmin(req, res) {
  const claims = verifyAdmin(req);
  if (!claims) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return claims;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(204).end();
    return true;
  }
  setCors(res);
  return false;
}

module.exports = { signAdminToken, verifyAdmin, requireAdmin, setCors, handleOptions };
