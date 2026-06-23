const crypto = require('crypto');

const sessions = new Map();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_SECRET || 'edulaw-dev-secret-change-in-production';
}

function createToken() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

function verifyToken(token) {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return false;
  }
  session.createdAt = Date.now();
  return true;
}

function revokeToken(token) {
  sessions.delete(token);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'ไม่ได้รับอนุญาต — กรุณาเข้าสู่ระบบ admin' });
  }
  next();
}

function checkPin(pin) {
  const expected = process.env.ADMIN_PIN || 'edulaw2567';
  return pin === expected;
}

module.exports = {
  createToken,
  verifyToken,
  revokeToken,
  authMiddleware,
  checkPin,
};
