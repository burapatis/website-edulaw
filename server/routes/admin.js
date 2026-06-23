const express = require('express');
const { checkPin, createToken, revokeToken, verifyToken } = require('../auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const pin = (req.body?.pin || '').trim();
  if (!checkPin(pin)) {
    return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
  }
  const token = createToken();
  res.json({ token, expiresIn: 12 * 60 * 60 });
});

router.post('/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token) revokeToken(token);
  res.json({ ok: true });
});

router.get('/session', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  res.json({ authenticated: verifyToken(token) });
});

module.exports = router;
