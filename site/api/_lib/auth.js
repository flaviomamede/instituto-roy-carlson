'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const COOKIE_NAME = 'irc_library_session';
const SESSION_DAYS = 14;
const rateMap = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function loadAllowlistUsers() {
  const raw = process.env.IRC_ALLOWLIST_JSON;
  if (raw) {
    const data = JSON.parse(raw);
    return data.users || [];
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('IRC_ALLOWLIST_JSON não configurado');
  }
  const fallback = path.join(process.cwd(), '..', 'biblioteca-adapters', 'irc', 'allowlist.json');
  if (fs.existsSync(fallback)) {
    const data = JSON.parse(fs.readFileSync(fallback, 'utf8'));
    return data.users || [];
  }
  return [];
}

/** Assinatura vencida? (founders/sponsors normalmente não têm validUntil). */
function isExpired(user) {
  if (!user || !user.validUntil) return false;
  const t = Date.parse(user.validUntil);
  return !Number.isNaN(t) && Date.now() > t;
}

function findUser(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const user = loadAllowlistUsers().find((u) => normalizeEmail(u.email) === normalized) || null;
  if (!user || isExpired(user)) return null; // expirado = sem acesso (trata como público)
  return user;
}

function getSecret() {
  const secret = process.env.IRC_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('IRC_SESSION_SECRET não configurado');
    }
    return 'dev-only-insecure-secret-change-me';
  }
  return secret;
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  return body + '.' + sig;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  return verifyToken(cookies[COOKIE_NAME]);
}

function setSessionCookie(res, user) {
  // A sessão não pode durar além do fim da assinatura (validUntil), para o
  // acesso se auto-revogar mesmo dentro de uma sessão ativa.
  let exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  if (user.validUntil) {
    const vu = Date.parse(user.validUntil);
    if (!Number.isNaN(vu)) exp = Math.min(exp, vu);
  }
  const token = signToken({
    email: user.email,
    planLevel: user.planLevel,
    name: user.name || user.email,
    exp
  });
  const maxAge = Math.max(0, Math.floor((exp - Date.now()) / 1000));
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
}

function checkRateLimit(req) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 20;
  let entry = rateMap.get(ip);
  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 0 };
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count <= max;
}

module.exports = {
  COOKIE_NAME,
  normalizeEmail,
  findUser,
  getSessionFromRequest,
  setSessionCookie,
  clearSessionCookie,
  checkRateLimit
};
