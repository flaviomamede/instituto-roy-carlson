'use strict';

const { clearSessionCookie } = require('./_lib/auth.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
};
