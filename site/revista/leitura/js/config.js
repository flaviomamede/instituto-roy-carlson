'use strict';

export const BUILD = '2026-06-20-v10';

export const CONFIG = {
  DEFAULT_PDF_URL: '/revista/leitura/revista.pdf',
  PDFJS_BASE: '/revista/leitura/pdfjs',
  SHOW_FILE_UPLOAD: false,
  ALLOW_SHARE: true,
  ALLOW_DOWNLOAD: false,
  MAGAZINE: {
    name: 'Revista IRC',
    kicker: 'Vol. 1, No. 1 · Junho 2026',
    tagline: 'Instituto Roy Carlson',
    coverLine: 'De ontem até hoje, do Brasil para o mundo',
    coverKicker: 'Instituto Roy Carlson'
  },
  PAGE_WIDTH: 470,
  FLIP_LIB: true,
  MOBILE_BREAKPOINT: 680,
  /** 'revista' | 'biblioteca' — contexto do leitor */
  READER_CONTEXT: 'revista',
  DOC_SLUG: '',
  /** Sumário do documento (biblioteca), ex.: [{ title, page }] */
  DOC_TOC: [],
  GATE: {
    enabled: true,
    indexPage: 2,
    mode: 'apps_script',
    endpoint: 'https://script.google.com/macros/s/AKfycbxNl-alO6cSr3wGn0r1EgTnP7Cx7035YRIrVv5ZeCM4kYXFgOxh4hd1fV1JqzUbfH5S/exec',
    form: {
      action: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
      email: 'entry.0000000000',
      source: '',
      page: '',
      ref: '',
      ua: ''
    },
    source: 'revista-v1n1',
    allowSkip: false,
    kicker: 'Continue a leitura',
    title: 'Receba a edição completa',
    subtitle: 'Deixe seu e-mail para continuar lendo esta edição. Sem spam.',
    button: 'Continuar lendo',
    privacy: 'Usamos seu e-mail apenas para enviar conteúdos desta publicação. Você pode sair quando quiser.',
    privacyUrl: ''
  }
};

export const ARTICLE_SLUGS = {
  'china-barragens': 5,
  'historico-concreto-massa-brasil': 11,
  'roy-carlson-reminiscencias': 19,
  'homenagem-roy-carlson': 25,
  'homenagem-walton-pacelli': 31,
  'damworld-2025': 39
};

export const ARTICLE_TITLES = {
  'china-barragens': 'China e barragens',
  'historico-concreto-massa-brasil': 'Concreto de massa no Brasil',
  'roy-carlson-reminiscencias': 'Roy Carlson — Reminiscências',
  'homenagem-roy-carlson': 'Homenagem a Roy Carlson',
  'homenagem-walton-pacelli': 'Homenagem a Walton Pacelli',
  'damworld-2025': 'Dam World 2025'
};

/* Aparelhos de toque (iPhone/iPad/Android) têm limite de memória por aba bem
   menor — sobretudo o Safari no iOS. Renderizar muitas páginas em alta resolução
   estoura esse limite e a aba colapsa ("A problem repeatedly occurred"). Nesses
   aparelhos reduzimos a resolução, o prefetch, e desligamos o pré-render pesado
   do StPageFlip (fica a virada em CSS, leve). */
export const LOW_MEM =
  (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0) ||
  (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches);

export const RS = LOW_MEM ? 1.5 : 2.5;
export const dpr = Math.min(window.devicePixelRatio || 1, LOW_MEM ? 1.5 : 2);
