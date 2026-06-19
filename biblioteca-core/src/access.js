'use strict';

import { meetsMinLevel, PLAN_LABELS } from './levels.js';

export function getMinLevel(doc) {
  return (doc.access && doc.access.minLevel) || 'public';
}

export function canAccessDocument(doc, user) {
  const min = getMinLevel(doc);
  if (min === 'public') return true;
  return meetsMinLevel(user && user.planLevel, min);
}

export function accessLabel(doc) {
  const min = getMinLevel(doc);
  if (min === 'public') return PLAN_LABELS.public;
  return PLAN_LABELS[min] || min;
}

export function isLockedForUser(doc, user) {
  return !canAccessDocument(doc, user);
}

/** Campos sempre públicos na ficha. */
export function getPublicDocument(doc) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    authors: doc.authors || [],
    year: doc.year,
    language: doc.language,
    type: doc.type,
    collection: doc.collection,
    tags: doc.tags || [],
    access: doc.access,
    public: doc.public || {},
    related: doc.related || null
  };
}
