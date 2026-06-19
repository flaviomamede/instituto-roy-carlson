'use strict';

const PLAN_ORDER = ['public', 'member', 'founder', 'sponsor'];

function planRank(level) {
  const i = PLAN_ORDER.indexOf(level);
  return i === -1 ? 0 : i;
}

function getMinLevel(doc) {
  return (doc.access && doc.access.minLevel) || 'public';
}

function meetsMinLevel(userLevel, minLevel) {
  if (minLevel === 'public') return true;
  if (!userLevel) return false;
  return planRank(userLevel) >= planRank(minLevel);
}

function canAccessDocument(doc, user) {
  return meetsMinLevel(user && user.planLevel, getMinLevel(doc));
}

module.exports = { getMinLevel, meetsMinLevel, canAccessDocument };
