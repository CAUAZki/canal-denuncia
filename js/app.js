// Roteador e estrutura das páginas — HTML, CSS e JavaScript puro.
(function () {
  const icon = Icons.svg;
  const root = document.getElementById('root');

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/denuncia', label: 'Fazer denúncia' },
    { path: '/acompanhar', label: 'Acompanhar denúncia' },
    { path: '/privacidade', label: 'Privacidade e LGPD' },
    { path: '/faq', label: 'FAQ' },
  ];

  function header(path) {
    function isActive(item) {
      if (item.path === '/') return path === '/';
      return path.indexOf(item.path) === 0;
    }

    return `<header class="site-header">
      <div class="container header-inner">
        <a href="#/" class="brand" aria-label="Canal Seguro IA — página inicial">
          <span class="brand-mark">${icon('shield', 22)}</span>
          <span class="brand-text"><span class="brand-name">Canal Seguro IA</span><span class="brand-sub">Canal de denúncias</span></span>
        </a>
        <nav class="site-nav" aria-label="Navegação principal">
          ${navItems.map(function (item) {
            return '<a href="#' + item.path + '"' + (isActive(item) ? ' class="active" aria-current="page"' : '') + '>' + item.label + '</a>';
          }).join('')}
          <a href="#/painel/login" class="nav-login-mobile">Área restrita</a>
        </nav>
        <div class="header-actions">
          <a href="#/painel/login" class="header-login">Área restrita</a>
          <a href="#/denuncia" class="btn btn-primary btn-sm">${icon('lock', 16)}<span>Denúncia sigilosa</span></a>
          <button type="button" class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">
            ${icon('menu', 20)}
          </button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    return `<footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><span class="brand-mark">${icon('shield', 20)}</span><strong>Canal Seguro IA</strong></div>
            <p>Canal de denúncias confidencial de uma organização fictícia. Registro com anonimato, privacidade por padrão e apoio responsável de Inteligência Artificial.</p>
            <div class="footer-disclaimer" style="margin-top:16px">${icon('lock', 14)}
              <span>Conteúdo confidencial. Acesso restrito por perfil e registrado em log de auditoria.</span></div>
          </div>
          <div>
            <h3>Canal</h3>
            <ul>
              <li><a href="#/denuncia">Fazer denúncia</a></li>
              <li><a href="#/acompanhar">Acompanhar denúncia</a></li>
              <li><a href="#/privacidade">Privacidade e LGPD</a></li>
              <li><a href="#/faq">Perguntas frequentes</a></li>
            </ul>
          </div>
          <div>
            <h3>Transparência</h3>
            <ul>
              <li><a href="#/privacidade/limites-ia">Limites da IA</a></li>
              <li><a href="#/painel/login">Área restrita</a></li>
              <li><span>Projeto acadêmico, dados fictícios</span></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Canal Seguro IA — organização fictícia. Todos os dados exibidos são fictícios.</span>
          <span>Projeto acadêmico, dados fictícios.</span>
        </div>
      </div>
    </footer>`;
  }

  function renderPublic(path, renderPage) {
    root.innerHTML = header(path) + '<main id="view"></main>' + footer();
    const view = document.getElementById('view');
    renderPage(view);
    bindChrome();
  }

  function bindChrome() {
    const toggle = root.querySelector('.nav-toggle');
    const nav = root.querySelector('.site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      toggle.innerHTML = open ? Icons.svg('close', 20) : Icons.svg('menu', 20);
    });
  }

  function parseHash() {
    const raw = location.hash.replace(/^#/, '');
    const parts = raw.split('?');
    return {
      path: parts[0] || '/',
      query: new URLSearchParams(parts[1] || ''),
    };
  }

  function setTitle(text) {
    document.title = text ? text + ' — Canal Seguro IA' : 'Canal Seguro IA — Canal de Denúncias';
  }

  const titles = {
    '/': '',
    '/denuncia': 'Fazer denúncia',
    '/acompanhar': 'Acompanhar denúncia',
    '/privacidade': 'Privacidade e LGPD',
    '/faq': 'Perguntas frequentes',
    '/painel/login': 'Área restrita',
    '/painel': 'Dashboard',
    '/painel/denuncias': 'Denúncias',
    '/painel/auditoria': 'Auditoria',
  };

  function route() {
    const parsed = parseHash();
    const path = parsed.path;
    const user = Store.currentUser();

    if (path === '/painel/login') {
      setTitle(titles[path]);
      if (user) {
        window.location.hash = '#/painel';
        return;
      }
      PublicPages.login(root);
      return;
    }

    if (path.indexOf('/painel') === 0) {
      if (!user) {
        window.location.hash = '#/painel/login';
        return;
      }

      if (path === '/painel' || path === '/painel/') {
        setTitle('Dashboard');
        PanelPages.dashboard(root, user);
      } else if (path === '/painel/denuncias') {
        setTitle('Denúncias');
        PanelPages.reportList(root, user, { urgency: parsed.query.get('urgency') || '' });
      } else if (/^\/painel\/denuncias\/\d+$/.test(path)) {
        setTitle('Denúncia');
        PanelPages.reportDetail(root, user, Number(path.split('/').pop()));
      } else if (path === '/painel/auditoria') {
        if (user.role === 'gestor') {
          setTitle('Auditoria');
          PanelPages.auditLogs(root, user);
          return;
        }
        setTitle('Auditoria');
        PanelPages.auditLogs(root, user);
      } else {
        setTitle('Painel');
        window.location.hash = '#/painel';
        return;
      }
      window.scrollTo(0, 0);
      return;
    }

    if (path === '/' || path === '') {
      setTitle(titles['/']);
      renderPublic('/', PublicPages.home);
    } else if (path === '/denuncia') {
      setTitle(titles[path]);
      renderPublic(path, PublicPages.denuncia);
    } else if (path === '/acompanhar') {
      setTitle(titles[path]);
      renderPublic(path, PublicPages.acompanhar);
    } else if (path === '/privacidade' || path === '/privacidade/limites-ia') {
      setTitle(titles['/privacidade']);
      renderPublic('/privacidade', PublicPages.privacidade);
      if (path === '/privacidade/limites-ia') {
        const anchor = document.getElementById('limites-ia');
        if (anchor) anchor.scrollIntoView();
      }
    } else if (path === '/faq') {
      setTitle(titles[path]);
      renderPublic(path, PublicPages.faq);
    } else {
      setTitle('Página não encontrada');
      renderPublic(path, PublicPages.notFound);
    }

    if (path !== '/privacidade/limites-ia') window.scrollTo(0, 0);
  }

  // Botões de copiar (protocolo e código de acesso).
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    const value = button.getAttribute('data-copy');
    const label = button.querySelector('[data-copy-label]');
    const iconSlot = button.querySelector('[data-copy-icon]');

    function done() {
      if (label) label.textContent = 'Copiado';
      if (iconSlot) iconSlot.innerHTML = Icons.svg('check', 14);
      window.setTimeout(function () {
        if (label) label.textContent = button.getAttribute('aria-label').replace(value, '').trim() || 'Copiar';
        if (iconSlot) iconSlot.innerHTML = Icons.svg('copy', 14);
      }, 2200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(function () {});
    } else {
      const area = document.createElement('textarea');
      area.value = value;
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch (error) { /* ignora */ }
      document.body.removeChild(area);
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();
