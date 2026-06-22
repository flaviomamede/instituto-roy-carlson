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
    if (path.startsWith('/revista/submissao')) return 'submissao';
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

  /* ---------- Login de qualquer página (modal) ----------
     Intercepta os links "Login" do menu (institucional e revista) e abre um modal
     de login por e-mail (POST /api/login + /api/session), em vez de mandar para a
     Biblioteca. Funciona em qualquer página que carregue este script. */
  (function setupLogin() {
    if (!document.querySelector('[data-nav="login"]')) return;
    if (document.getElementById('lmOverlay')) return;
    var RANK = { public: 0, member: 1, founder: 2, sponsor: 3 };

    var css = document.createElement('style');
    css.textContent =
      '#lmOverlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(18,26,30,.55)}' +
      '#lmOverlay.open{display:flex}' +
      '.lm-card{background:#fff;border-radius:14px;max-width:380px;width:100%;padding:24px;position:relative;' +
      'box-shadow:0 20px 50px rgba(0,0,0,.3);font-family:inherit;color:#1f2630}' +
      '.lm-close{position:absolute;top:8px;right:12px;border:0;background:none;font-size:24px;color:#999;cursor:pointer;line-height:1}' +
      '.lm-card h3{margin:0 0 6px;font-size:19px;color:#16504f}' +
      '.lm-card p{margin:0 0 14px;font-size:13.5px;color:#5c6470}' +
      '.lm-card form{display:flex;gap:8px;flex-wrap:wrap}' +
      '.lm-card input{flex:1 1 180px;min-width:0;height:44px;border:1px solid #d8cfbb;border-radius:9px;padding:0 12px;font-size:15px;outline:none}' +
      '.lm-card input:focus{border-color:#c79a3e}' +
      '.lm-btn{height:44px;padding:0 18px;border:0;border-radius:9px;background:#1f6b6b;color:#fff;font-weight:700;cursor:pointer}' +
      '.lm-btn:disabled{opacity:.6;cursor:default}' +
      '.lm-msg{min-height:16px;font-size:13px;margin-top:8px;color:#9a6a14}' +
      '.lm-assine{margin-top:14px!important;font-size:13px}' +
      '.lm-assine a{color:#a9802c;font-weight:600;text-decoration:none}' +
      '.lm-logout{background:#b04a2f;margin-top:6px}';
    document.head.appendChild(css);

    var ov = document.createElement('div');
    ov.id = 'lmOverlay';
    ov.innerHTML =
      '<div class="lm-card" role="dialog" aria-modal="true">' +
      '<button class="lm-close" type="button" aria-label="Fechar">×</button>' +
      '<div class="lm-anon">' +
      '<h3>Entrar</h3>' +
      '<p>Acesse com o e-mail cadastrado como assinante ou fundador do IRC.</p>' +
      '<form class="lm-form"><input class="lm-email" type="email" placeholder="seu@email.com" autocomplete="email" inputmode="email" required>' +
      '<button type="submit" class="lm-btn lm-enter">Entrar</button></form>' +
      '<div class="lm-msg" role="status"></div>' +
      '<p class="lm-assine">Ainda não é assinante? <a href="/assinatura/">Quero assinar →</a></p>' +
      '</div>' +
      '<div class="lm-logged" hidden><h3>Sua conta</h3><p class="lm-who"></p>' +
      '<button type="button" class="lm-btn lm-logout">Sair</button></div>' +
      '</div>';
    document.body.appendChild(ov);

    var anon = ov.querySelector('.lm-anon');
    var logged = ov.querySelector('.lm-logged');
    var emailI = ov.querySelector('.lm-email');
    var msg = ov.querySelector('.lm-msg');
    var who = ov.querySelector('.lm-who');

    function openModal() { ov.classList.add('open'); refreshState(); }
    function closeModal() { ov.classList.remove('open'); }
    ov.querySelector('.lm-close').addEventListener('click', closeModal);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    document.querySelectorAll('[data-nav="login"]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });

    function rankOf(s) { return s && s.logged ? (RANK[s.planLevel] || 0) : 0; }
    function session() {
      return fetch('/api/session', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : { logged: false }; })
        .catch(function () { return { logged: false }; });
    }
    function setUI(s) {
      if (rankOf(s) >= 1) {
        anon.hidden = true; logged.hidden = false;
        who.textContent = (s.name || s.email) + ' · ' + (s.planLevel || 'assinante');
        document.querySelectorAll('[data-nav="login"]').forEach(function (a) {
          a.textContent = s.name ? s.name.split(' ')[0] : 'Conta';
        });
      } else {
        anon.hidden = false; logged.hidden = true;
        document.querySelectorAll('[data-nav="login"]').forEach(function (a) { a.textContent = 'Login'; });
      }
    }
    function refreshState() { session().then(setUI); }

    ov.querySelector('.lm-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (emailI.value || '').trim();
      var btn = ov.querySelector('.lm-enter');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = 'Digite um e-mail válido.'; return; }
      btn.disabled = true; msg.textContent = 'Entrando…';
      fetch('/api/login', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.toLowerCase() })
      }).then(session).then(function (s) {
        btn.disabled = false;
        if (rankOf(s) >= 1) { msg.textContent = 'Bem-vindo! Atualizando…'; setTimeout(function () { location.reload(); }, 600); }
        else { msg.textContent = 'E-mail não encontrado ou sem acesso. Confira ou torne-se assinante.'; }
      }).catch(function () { btn.disabled = false; msg.textContent = 'Erro ao entrar. Tente novamente.'; });
    });

    ov.querySelector('.lm-logout').addEventListener('click', function () {
      fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
        .then(function () { location.reload(); })
        .catch(function () { location.reload(); });
    });

    refreshState();   /* atualiza o rótulo do link se já estiver logado */
  })();
})();
