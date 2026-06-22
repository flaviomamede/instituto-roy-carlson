(function () {
  'use strict';

  function normPath(pathname) {
    let p = pathname || '/';
    if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }

  const path = normPath(location.pathname);
  const isRevista = path === '/revista' || path.startsWith('/revista/');

  function pickNav() {
    if (path === '/') return 'institucional';
    if (path.startsWith('/sobre')) return 'sobre';
    if (path.startsWith('/assinatura')) return 'assinatura';
    if (path.startsWith('/biblioteca')) return 'biblioteca';
    if (path.startsWith('/revista/leitura')) return 'flipbook';
    if (path.startsWith('/revista/apresentacao')) return 'apresentacao';
    if (path.startsWith('/revista/expediente')) return 'expediente';
    if (path.startsWith('/revista/normas-publicacao')) return 'normas';
    if (path.startsWith('/revista/edicoes')) return 'edicoes';
    if (path === '/revista') return 'revista';
    if (path.startsWith('/revista')) return 'revista';
    return 'institucional';
  }

  const current = pickNav();

  document.body.classList.toggle('section-revista', isRevista);
  document.body.classList.toggle('section-institutional', !isRevista);
  document.documentElement.classList.toggle('section-revista', isRevista);
  document.documentElement.classList.toggle('section-institutional', !isRevista);

  const instNav = document.querySelector('.nav-institutional');
  const revNav = document.querySelector('.nav-revista');
  if (instNav) instNav.hidden = isRevista;
  if (revNav) revNav.hidden = !isRevista;

  /* Link discreto "Planejamento" (área exclusiva). Aparece para todos; quem não
     estiver logado como assinante/fundador cai no gate da própria página. */
  if (instNav && !instNav.querySelector('[data-nav="planejamento"]')) {
    const pl = document.createElement('a');
    pl.href = '/planejamento/';
    pl.setAttribute('data-nav', 'planejamento');
    pl.textContent = 'Planejamento';
    const anchor = instNav.querySelector('.nav-cta') || instNav.querySelector('.nav-login');
    if (anchor) instNav.insertBefore(pl, anchor);
    else instNav.appendChild(pl);
  }

  document.querySelectorAll('[data-brand="revista"]').forEach((el) => {
    el.hidden = !isRevista;
  });
  document.querySelectorAll('[data-brand="institucional"]').forEach((el) => {
    el.hidden = isRevista;
  });

  document.querySelectorAll('[data-nav]').forEach((el) => {
    const key = el.getAttribute('data-nav');
    if (key === current) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });

  if (isRevista && current === 'revista') {
    const revistaTitle = document.querySelector('.brand-title-revista');
    if (revistaTitle) revistaTitle.setAttribute('aria-current', 'page');
  }

  if (!isRevista && current === 'revista') {
    const trigger = document.querySelector('.nav-institutional [data-nav="revista"]');
    if (trigger) trigger.setAttribute('aria-current', 'page');
  }

  /* Submenu Revista IRC: hover no desktop; sem bloquear clique em /revista/index.html */
  const dropdown = document.getElementById('revistaDropdown');
  if (dropdown && !isRevista) {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    function closeDropdown() {
      dropdown.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (menu) {
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeDropdown());
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ---------- Menu hambúrguer no celular ----------
     No celular a navegação empilhava verticalmente e comia metade da tela.
     Aqui ela colapsa num botão; abre como dropdown sob o cabeçalho. */
  (function setupMobileMenu() {
    const header = document.querySelector('.site-header');
    if (!header || header.querySelector('.nav-toggle')) return;

    const HIDE =
      'body.section-revista .site-header .nav-revista,' +
      'html.section-revista .site-header .nav-revista,' +
      'body.section-institutional .site-header .nav-institutional,' +
      'html.section-institutional .site-header .nav-institutional';
    const SHOW =
      'body.section-revista .site-header.nav-open .nav-revista,' +
      'html.section-revista .site-header.nav-open .nav-revista,' +
      'body.section-institutional .site-header.nav-open .nav-institutional,' +
      'html.section-institutional .site-header.nav-open .nav-institutional';
    const style = document.createElement('style');
    style.textContent =
      '.nav-toggle{display:none}' +
      '@media (max-width:760px){' +
      '.site-header{position:relative;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:.5rem}' +
      '.nav-toggle{display:inline-flex;align-items:center;justify-content:center;' +
      'width:40px;height:40px;margin-left:auto;flex:0 0 auto;border:1px solid rgba(40,50,68,.28);' +
      'border-radius:8px;background:#fff;color:#283244;cursor:pointer;padding:0}' +
      '.nav-toggle svg{width:22px;height:22px}' +
      HIDE + '{' +
      'display:none;position:absolute;top:100%;left:0;right:0;width:auto;flex-direction:column;' +
      'align-items:stretch;gap:0;background:#fff;border-bottom:1px solid rgba(40,50,68,.16);' +
      'padding:.35rem 1.25rem 1rem;z-index:50;box-shadow:0 14px 26px rgba(40,50,68,.16)}' +
      SHOW + '{display:flex}' +
      '.site-header .nav a{padding:.7rem 0}' +
      '.site-header .nav-dropdown{position:static}' +
      '.site-header .nav-dropdown-menu{position:static;display:block;box-shadow:none;' +
      'border:0;padding:0 0 0 1rem;min-width:0}' +
      '}';
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Abrir menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    btn.addEventListener('click', function () {
      const open = header.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    header.appendChild(btn);

    header.querySelectorAll('.nav a').forEach((a) => {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  })();
})();
