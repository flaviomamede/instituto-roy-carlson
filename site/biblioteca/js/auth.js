'use strict';

const VIEWER_PREF_KEY = 'irc_library_viewer_mode';

let sessionCache = null;
let sessionPromise = null;

export async function refreshSession() {
  try {
    const res = await fetch('/api/session', { credentials: 'include' });
    if (!res.ok) {
      sessionCache = null;
      return null;
    }
    const data = await res.json();
    sessionCache = data.logged ? data : null;
    return sessionCache;
  } catch {
    sessionCache = null;
    return null;
  }
}

export function getSession() {
  return sessionCache;
}

export async function ensureSession() {
  if (sessionPromise) return sessionPromise;
  sessionPromise = refreshSession().finally(() => {
    sessionPromise = null;
  });
  return sessionPromise;
}

export async function loginWithEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return { ok: false, error: 'Informe seu e-mail.' };

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalized })
    });
    if (!res.ok) {
      return { ok: false, error: 'Serviço de login indisponível. Tente novamente.' };
    }
    await refreshSession();
    if (!sessionCache) {
      return {
        ok: false,
        error: 'Não foi possível entrar. Verifique o e-mail ou solicite acesso ao Instituto Roy Carlson.'
      };
    }
    return { ok: true, user: sessionCache };
  } catch {
    return { ok: false, error: 'Erro de rede ao entrar. Tente novamente.' };
  }
}

export async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore */
  }
  sessionCache = null;
}

export function getViewerPreference() {
  return localStorage.getItem(VIEWER_PREF_KEY) || 'iframe';
}

export function setViewerPreference(mode) {
  localStorage.setItem(VIEWER_PREF_KEY, mode);
}
