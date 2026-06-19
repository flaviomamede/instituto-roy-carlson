'use strict';

export const BUILD = '2026-06-19-v3';

export const CONFIG = {
  DEFAULT_PDF_URL: '/revista/leitura/revista.pdf',
  PDFJS_BASE: '/revista/leitura/pdfjs',
  SHOW_FILE_UPLOAD: false,
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

export const RS = 2.5;
export const dpr = Math.min(window.devicePixelRatio || 1, 2);
