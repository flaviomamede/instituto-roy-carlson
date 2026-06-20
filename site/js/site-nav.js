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
})();
