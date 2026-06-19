'use strict';

const {
  normalizeEmail,
  findUser,
  setSessionCookie,
  checkRateLimit
} = require('./_lib/auth.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  if (!checkRateLimit(req)) {
    res.status(429).json({ ok: true });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const email = normalizeEmail(body && body.email);
  if (email) {
    try {
      const user = findUser(email);
      if (user) setSessionCookie(res, user);
    } catch (err) {
      console.error('[login]', err.message);
    }
  }

  res.status(200).json({ ok: true });
};
