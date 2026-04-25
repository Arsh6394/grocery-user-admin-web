const { requireAdmin, handleOptions } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  const claims = requireAdmin(req, res);
  if (!claims) return;
  return res.status(200).json({ email: claims.email, role: claims.role });
};
