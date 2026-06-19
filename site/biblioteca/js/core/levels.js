'use strict';

/** Ordem crescente de privilégio. */
export const PLAN_ORDER = ['public', 'member', 'founder', 'sponsor'];

export const PLAN_LABELS = {
  public: 'Aberto',
  member: 'Assinante',
  founder: 'Membro fundador',
  sponsor: 'Patrocinador'
};

export function planRank(level) {
  const i = PLAN_ORDER.indexOf(level);
  return i === -1 ? 0 : i;
}

export function meetsMinLevel(userLevel, minLevel) {
  if (minLevel === 'public') return true;
  if (!userLevel) return false;
  return planRank(userLevel) >= planRank(minLevel);
}
