'use strict';

const { getSessionFromRequest } = require('./_lib/auth.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ logged: false });
    return;
  }
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(200).json({ logged: false });
    return;
  }
  res.status(200).json({
    logged: true,
    email: session.email,
    planLevel: session.planLevel,
    name: session.name || session.email
  });
};
