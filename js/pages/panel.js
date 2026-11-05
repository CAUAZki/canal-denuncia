// Painel restrito: dashboard, lista, detalhe e auditoria — em JavaScript puro.
window.PanelPages = (function () {
  const esc = UI.esc;
  const icon = Icons.svg;

  const eventLabels = {
    opened: 'Denúncia registrada',
    status: 'Alteração de status',
    forward: 'Encaminhamento de área',
    message: 'Resposta ao denunciante',
    note: 'Observação interna',
    ai: 'Revisão da sugestão da IA',
  };

  const eventTagLabels = {
    opened: 'Abertura',
    status: 'Status',
    forward: 'Encaminhamento',
    message: 'Resposta',
    note: 'Interno',
    ai: 'IA',
  };

  function topbar(title, text, extra) {
    return '<div class="panel-topbar"><div>' + title + (text ? '<p>' + text + '</p>' : '') + '</div>' + (extra || '') + '</div>';
  }

  function shell(user, active, body) {
    const showAudit = user.role === 'compliance' || user.role === 'auditoria';
    const nav = [
      { href: '#/painel', key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '#/painel/denuncias', key: 'reports', label: 'Denúncias', icon: 'list' },
    ];
    if (showAudit) nav.push({ href: '#/painel/auditoria', key: 'audit', label: 'Auditoria', icon: 'history' });

    return `
      <div class="panel-shell">
        <aside class="panel-sidebar">
          <a href="#/painel" class="brand" style="color:#fff">
            <span class="brand-mark">${icon('shield', 20)}</span>
            <span class="brand-text"><span class="brand-name">Canal Seguro IA</span><span class="brand-sub">Painel restrito</span></span>
          </a>
          <nav class="panel-nav" aria-label="Navegação do painel">
            ${nav.map(function (item) {
              return '<a href="' + item.href + '"' + (item.key === active ? ' class="active" aria-current="page"' : '') + '>' +
                icon(item.icon, 17) + item.label + '</a>';
            }).join('')}
          </nav>
          <div class="panel-sidebar-foot">
            <div class="panel-user">
              <div>
                <strong>${esc(user.name)}</strong>
                <span>${esc(Catalog.ROLES[user.role])}${user.area ? ' • ' + esc(user.area) : ''}</span>
                <span>${esc(user.email)}</span>
              </div>
              <button type="button" data-logout>${icon('logOut', 14)} Sair</button>
            </div>
            <a href="#/" class="tiny" style="color:#8fa5c0;display:inline-block;margin-top:8px">← Canal público</a>
          </div>
        </aside>
        <main class="panel-main">${body}</main>
      </div>`;
  }

  function renderShell(view, user, active, body) {
    view.innerHTML = shell(user, active, body);
    const logout = view.querySelector('[data-logout]');
    if (logout) {
      logout.addEventListener('click', function () {
        Store.logout();
        window.location.hash = '#/painel/login';
      });
    }
  }

  // Dashboard
  function dashboard(view, user) {
    const data = Store.summary(user);
    const urgencyTone = { 'Prioridade Máxima': 'red', 'Alto': 'orange', 'Médio': 'amber', 'Baixo': 'slate' };
    const statusTone = {
      'Recebida': 'navy', 'Em triagem': 'slate', 'Em análise': 'amber',
      'Encaminhada': 'navy', 'Concluída': 'green', 'Arquivada': 'slate',
    };

    const body = topbar(
      '<h1>Dashboard</h1>',
      'Visão agregada e anonimizada das denúncias. Nenhum dado pessoal é exibido nos gráficos.',
      '<span class="panel-tag">' + icon('sparkles', 14) + ' IA apenas sugere</span>'
    ) +
      (user.role === 'gestor' ? '<div style="margin-bottom:18px">' + UI.alertBox('info', 'Escopo do perfil Gestor de área', 'Você vê apenas denúncias encaminhadas à área ' + esc(user.area) + ' e nunca a identidade de quem optou pelo anonimato.') + '</div>' : '') +
      (user.role === 'auditoria' ? '<div style="margin-bottom:18px">' + UI.alertBox('warn', 'Escopo do perfil Auditoria/Segurança da Informação', 'Este perfil acessa apenas logs e metadados agregados. O conteúdo das denúncias não é exibido.') + '</div>' : '') +
      `<div class="stat-grid" style="margin-bottom:18px">
        <div class="stat-card"><div class="stat-label">Total de denúncias</div><div class="stat-value">${data.total}</div><div class="stat-foot">No escopo do seu perfil</div></div>
        <div class="stat-card"><div class="stat-label">Em acompanhamento</div><div class="stat-value">${data.active}</div><div class="stat-foot">Recebidas, em triagem, análise ou encaminhadas</div></div>
        <div class="stat-card" data-tone="red"><div class="stat-label">Prioridade Máxima</div><div class="stat-value">${data.maxPriorityOpen}</div><div class="stat-foot">Casos abertos com alerta de plantão</div></div>
        <div class="stat-card" data-tone="green"><div class="stat-label">Concluídas</div><div class="stat-value">${data.concluded}</div><div class="stat-foot">Encerradas com decisão humana</div></div>
      </div>` +
      (data.alerts.length ? `<div class="panel-alert" style="margin-bottom:18px">${icon('shieldAlert', 22)}<div>
        <strong>Alerta de plantão: ${data.alerts.length} caso(s) em Prioridade Máxima</strong>
        <p>Acione a equipe humana de plantão e registre o responsável pela revisão.</p></div>
        <a href="#/painel/denuncias?urgency=Prioridade%20M%C3%A1xima" class="btn btn-danger btn-sm">Ver casos</a></div>` : '') +
      `<div class="panel-grid-2" style="margin-bottom:18px">
        ${UI.barChart('Por nível de urgência', 'Sugestão inicial da IA, confirmada ou alterada por uma pessoa.', Catalog.URGENCIES.map(function (urgency) {
          return { label: urgency, value: data.byUrgency[urgency] || 0, tone: urgencyTone[urgency] };
        }))}
        ${UI.barChart('Por status', 'Fluxo com revisão humana em cada etapa.', Catalog.STATUSES.map(function (status) {
          return { label: status, value: data.byStatus[status] || 0, tone: statusTone[status] };
        }))}
      </div>
      <div class="panel-grid-2">
        ${UI.barChart('Por tipo de denúncia', 'Dados agregados e anonimizados.', Catalog.OCCURRENCE_TYPES.map(function (type) {
          return { label: type.label, value: data.byCategory[type.label] || 0, tone: 'navy' };
        }))}
        <div class="chart-card">
          <h2>Casos em Prioridade Máxima</h2>
          <p>Ordenados do mais recente para o mais antigo.</p>
          ${data.alerts.length === 0 ? '<p class="chart-empty">Nenhum caso aberto em prioridade máxima.</p>' :
            '<div class="stack-sm">' + data.alerts.map(function (alert) {
              return `<a href="#/painel/denuncias/${alert.id}" class="card card--flat" style="padding:12px;display:block;color:inherit">
                <div class="cluster" style="justify-content:space-between">
                  <strong class="mono" style="font-size:.85rem">${esc(alert.protocol)}</strong>
                  ${UI.badge(alert.urgency, UI.urgencyTone[alert.urgency])}
                </div>
                <p class="small muted" style="margin-top:4px">${esc(alert.category)}</p>
                <div class="cluster tiny muted" style="justify-content:space-between;margin-top:6px">
                  <span>${esc(alert.area || 'Sem área definida')}</span><span>${UI.fmtDateTime(alert.createdAt)}</span>
                </div></a>`;
            }).join('') + '</div>'}
          ${data.alerts.length ? '<p class="tiny muted" style="margin-top:12px">' + icon('alertTriangle', 13) + ' Toda mudança de status exige registro do responsável humano.</p>' : ''}
          <div class="cluster tiny muted" style="margin-top:14px">
            <span>${UI.badge('Recebida', 'blue')}</span><span>${UI.badge('Em análise', 'amber')}</span><span>${UI.badge('Concluída', 'green')}</span>
          </div>
        </div>
      </div>`;

    renderShell(view, user, 'dashboard', body);
  }

  // Lista de denúncias
  function reportList(view, user, query) {
    const filters = {
      status: '',
      category: '',
      urgency: query.urgency || '',
      from: '',
      to: '',
    };

    function filtered() {
      return Store.visibleReports(user).filter(function (report) {
        if (filters.status && report.status !== filters.status) return false;
        if (filters.category && report.category !== filters.category) return false;
        if (filters.urgency && report.urgency !== filters.urgency) return false;
        if (filters.from && new Date(report.createdAt) < new Date(filters.from + 'T00:00:00')) return false;
        if (filters.to && new Date(report.createdAt) >= new Date(filters.to + 'T23:59:59')) return false;
        return true;
      });
    }

    function render() {
      const reports = filtered();
      const urgentCount = reports.filter(function (report) { return report.urgency === 'Prioridade Máxima'; }).length;

      const body = topbar('<h1>Denúncias</h1>', 'Casos ordenados por urgência e data. Prioridade Máxima aparece sempre no topo.',
        '<span class="panel-tag">' + reports.length + ' registro(s)</span>') +
        (urgentCount ? `<div class="panel-alert" style="margin-bottom:16px">${icon('shieldAlert', 22)}<div>
          <strong>${urgentCount} denúncia(s) em Prioridade Máxima nesta lista</strong>
          <p>Alerta de plantão: acione a equipe humana e registre quem assumiu a revisão.</p></div></div>` : '') +
        `<div class="filter-bar" style="margin-bottom:16px">
          <div class="field"><label for="filter-status">Status</label><select id="filter-status" class="select">
            <option value="">Todos</option>${Catalog.STATUSES.map(function (status) {
              return '<option value="' + esc(status) + '"' + (filters.status === status ? ' selected' : '') + '>' + esc(status) + '</option>';
            }).join('')}</select></div>
          <div class="field"><label for="filter-category">Tipo</label><select id="filter-category" class="select">
            <option value="">Todos</option>${Catalog.OCCURRENCE_TYPES.map(function (type) {
              return '<option value="' + esc(type.label) + '"' + (filters.category === type.label ? ' selected' : '') + '>' + esc(type.label) + '</option>';
            }).join('')}</select></div>
          <div class="field"><label for="filter-urgency">Urgência</label><select id="filter-urgency" class="select">
            <option value="">Todas</option>${Catalog.URGENCIES.map(function (urgency) {
              return '<option value="' + esc(urgency) + '"' + (filters.urgency === urgency ? ' selected' : '') + '>' + esc(urgency) + '</option>';
            }).join('')}</select></div>
          <div class="field"><label for="filter-from">De</label><input id="filter-from" type="date" class="input" value="${esc(filters.from)}"></div>
          <div class="field"><label for="filter-to">Até</label><input id="filter-to" type="date" class="input" value="${esc(filters.to)}"></div>
          <button type="button" class="btn btn-outline btn-sm" data-clear>Limpar filtros</button>
        </div>
        <div class="table-wrap">
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>Protocolo</th><th>Tipo de ocorrência</th><th>Urgência</th><th>Status</th><th>Área</th><th>Modalidade</th><th>Registro</th></tr></thead>
              <tbody>
                ${reports.map(function (report) {
                  return `<tr class="${report.urgency === 'Prioridade Máxima' ? 'row-urgent' : ''}">
                    <td><a href="#/painel/denuncias/${report.id}" class="mono">${esc(report.protocol)}</a>${report.attachment ? '<span class="tiny muted" style="display:block">com anexo</span>' : ''}</td>
                    <td>${esc(report.category)}</td>
                    <td>${UI.badge(report.urgency, UI.urgencyTone[report.urgency] || 'slate')}</td>
                    <td>${UI.badge(report.status, UI.statusTone[report.status] || 'slate')}</td>
                    <td>${report.area ? esc(report.area) : '<span class="muted">Não definida</span>'}</td>
                    <td>${report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</td>
                    <td class="nowrap"><span style="display:block">${UI.fmtDate(report.createdAt)}</span><span class="tiny muted">${UI.fmtDateTime(report.createdAt).slice(-5)}</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          ${reports.length === 0 ? UI.emptyState('Nenhuma denúncia encontrada', '<p>Ajuste os filtros para ampliar a busca. Se o seu perfil é Gestor de área, você vê apenas denúncias encaminhadas à sua área.</p>') : ''}
        </div>
        <p class="tiny muted" style="margin-top:12px;display:flex;gap:6px;align-items:center">${icon('alertTriangle', 13)}
          Dados agregados e anonimizados. Nunca compartilhe conteúdo de denúncia fora dos canais oficiais.</p>`;

      renderShell(view, user, 'reports', body);

      view.querySelector('#filter-status').addEventListener('change', function (event) { filters.status = event.target.value; render(); });
      view.querySelector('#filter-category').addEventListener('change', function (event) { filters.category = event.target.value; render(); });
      view.querySelector('#filter-urgency').addEventListener('change', function (event) { filters.urgency = event.target.value; render(); });
      view.querySelector('#filter-from').addEventListener('change', function (event) { filters.from = event.target.value; render(); });
      view.querySelector('#filter-to').addEventListener('change', function (event) { filters.to = event.target.value; render(); });
      view.querySelector('[data-clear]').addEventListener('click', function () {
        filters.status = '';
        filters.category = '';
        filters.urgency = '';
        filters.from = '';
        filters.to = '';
        render();
      });
    }

    render();
  }

  // Detalhe da denúncia
  function reportDetail(view, user, id) {
    const report = Store.getReport(id, user);

    if (!report) {
      const body = topbar('<a href="#/painel/denuncias" class="small">← Voltar para denúncias</a><h1>Denúncia</h1>', '') +
        UI.alertBox('danger', 'Acesso não realizado', user.role === 'gestor'
          ? 'Este perfil acessa apenas denúncias encaminhadas à sua área.'
          : 'Denúncia não encontrada.');
      renderShell(view, user, 'reports', body);
      return;
    }

    const restricted = user.role === 'auditoria';
    let statusChoice = report.status;
    let forwardChoice = report.area || report.ai.area || '';
    let aiCategory = report.category;
    let aiUrgency = report.urgency;
    let aiArea = report.area || '';
    let feedback = '';

    Store.addAudit(user, restricted ? 'Visualizou metadados da denúncia' : 'Visualizou a denúncia', report);

    function eventsList(withBody) {
      return '<div class="event-list">' + report.events.map(function (event) {
        return `<div class="event-item" data-visibility="${esc(event.visibility)}">
          <div class="event-head">
            <strong><span class="event-tag" data-kind="${esc(event.kind)}">${esc(eventTagLabels[event.kind] || event.kind)}</span>
              ${esc(eventLabels[event.kind] || 'Atualização')}${event.kind === 'status' && event.toStatus ? ': ' + esc(event.fromStatus || '—') + ' → ' + esc(event.toStatus) : ''}</strong>
            <time>${UI.fmtDateTime(event.at)}</time>
          </div>
          ${withBody && event.body ? '<p>' + esc(event.body) + '</p>' : ''}
          <p class="tiny muted">Responsável: ${esc(event.author)}${event.visibility === 'reporter' ? ' • visível ao denunciante' : ' • interno'}</p>
        </div>`;
      }).join('') + '</div>';
    }

    function auditList() {
      const logs = Store.logs(300).filter(function (log) { return log.protocol === report.protocol; });
      if (!logs.length) return '<p class="small muted">Nenhum acesso registrado.</p>';
      return '<div class="stack-sm">' + logs.map(function (log) {
        return `<div style="border-bottom:1px solid var(--line);padding-bottom:8px">
          <div class="small"><strong>${esc(log.user)}</strong> — ${esc(log.action)}</div>
          <div class="tiny muted">${esc(log.role || '—')} • ${UI.fmtDateTime(log.at)}</div>
          ${log.detail ? '<div class="tiny muted">' + esc(log.detail) + '</div>' : ''}</div>`;
      }).join('') + '</div>';
    }

    function render() {
      const isOpen = ['Concluída', 'Arquivada'].indexOf(report.status) === -1;

      const header = `<div class="panel-topbar">
        <div>
          <a href="#/painel/denuncias" class="small">← Voltar para denúncias</a>
          <h1 class="mono" style="margin-top:4px">${esc(report.protocol)}</h1>
          <p>${esc(report.category)} • Registrada em ${UI.fmtDateTime(report.createdAt)}</p>
        </div>
        <div class="cluster">
          ${report.urgency === 'Prioridade Máxima' ? UI.badge('Prioridade Máxima', 'solid-red') : ''}
          ${UI.badge(report.status, UI.statusTone[report.status] || 'slate')}
          ${UI.badge(report.urgency, UI.urgencyTone[report.urgency] || 'slate')}
        </div>
      </div>`;

      const alert = report.urgency === 'Prioridade Máxima' && isOpen
        ? `<div class="panel-alert" style="margin-bottom:16px">${icon('shieldAlert', 22)}<div>
            <strong>Alerta de plantão — Prioridade Máxima</strong>
            <p>A IA identificou sinais de risco iminente ou gravidade elevada. Acione a equipe humana de plantão e registre quem assumiu a revisão.</p></div></div>`
        : '';

      const feedbackBox = feedback ? '<div style="margin-bottom:16px">' + feedback + '</div>' : '';

      if (restricted) {
        const body = header + feedbackBox + `
          ${UI.alertBox('warn', 'Perfil Auditoria/Segurança da Informação', 'Você acessa apenas metadados, histórico de alterações e logs. O conteúdo do relato, das pessoas envolvidas e das mensagens não é exibido.')}
          <div class="detail-grid" style="margin-top:18px">
            <section class="detail-section">
              <h2>Histórico de alterações (metadados)</h2>
              <p class="section-note">Sem conteúdo de relato ou de respostas.</p>
              ${eventsList(false)}
            </section>
            <div class="stack">
              <section class="detail-section">
                <h2>Metadados da denúncia</h2>
                <dl class="meta-grid" style="margin-top:12px">
                  <div><dt>Protocolo</dt><dd class="mono">${esc(report.protocol)}</dd></div>
                  <div><dt>Modalidade</dt><dd>${report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</dd></div>
                  <div><dt>Tipo</dt><dd>${esc(report.category)}</dd></div>
                  <div><dt>Urgência</dt><dd>${esc(report.urgency)}</dd></div>
                  <div><dt>Status</dt><dd>${esc(report.status)}</dd></div>
                  <div><dt>Área</dt><dd>${esc(report.area || 'Não definida')}</dd></div>
                  <div><dt>Registrada em</dt><dd>${UI.fmtDateTime(report.createdAt)}</dd></div>
                  <div><dt>Atualizada em</dt><dd>${UI.fmtDateTime(report.updatedAt)}</dd></div>
                </dl>
              </section>
              <section class="detail-section">
                <h2>${icon('history', 16)} Log de acessos</h2>
                <p class="section-note">Somente leitura.</p>
                ${auditList()}
              </section>
            </div>
          </div>`;
        renderShell(view, user, 'reports', body);
        return;
      }

      const body = header + alert + feedbackBox + `
        <div class="detail-grid">
          <div class="stack">
            <section class="ai-panel">
              <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                <h2>${icon('sparkles', 17)} Sugestão da IA</h2>
                ${UI.badge(report.ai.confirmed ? 'Confirmada por humano' : 'Aguardando revisão humana', report.ai.confirmed ? 'green' : 'amber')}
              </div>
              <p class="tiny muted" style="margin-top:4px">Gerada automaticamente. Não é decisão, não altera status e pode ser confirmada ou alterada por uma pessoa.</p>
              <div class="ai-grid">
                <div class="ai-cell"><span>Tipo sugerido</span><strong>${esc(report.ai.category || '—')}</strong>
                  ${report.ai.confidence ? '<span class="tiny muted">' + report.ai.confidence + '% de confiança</span>' : ''}</div>
                <div class="ai-cell"><span>Urgência sugerida</span><strong>${esc(report.ai.urgency || '—')}</strong></div>
                <div class="ai-cell"><span>Área sugerida</span><strong>${esc(report.ai.area || '—')}</strong></div>
              </div>
              ${report.ai.imminentRisk ? '<div style="margin-top:12px">' + UI.alertBox('danger', 'Sinal de risco iminente', 'O texto contém linguagem associada a risco à integridade. A IA marcou o caso como Prioridade Máxima para alerta humano. Nenhuma medida é automática.') + '</div>' : ''}
              ${report.ai.sensitiveAlerts && report.ai.sensitiveAlerts.length ? '<div style="margin-top:12px">' + UI.alertBox('warn', 'Possíveis dados sensíveis no relato',
                '<ul>' + report.ai.sensitiveAlerts.map(function (alertItem) {
                  return '<li><strong>' + esc(alertItem.label) + ':</strong> ' + esc(alertItem.recommendation) + '</li>';
                }).join('') + '</ul>') + '</div>' : ''}
              <div class="ai-actions">
                <button type="button" class="btn btn-navy btn-sm" data-ai-accept>Confirmar sugestão da IA</button>
                <span class="tiny muted" style="align-self:center">A confirmação registra seu nome no histórico.</span>
              </div>
              <div style="margin-top:16px;padding-top:14px;border-top:1px solid #dbe7f5">
                <p class="tiny" style="font-weight:600;color:var(--ink-soft);margin-bottom:8px">Ou altere a classificação antes de confirmar:</p>
                <div class="grid grid-3">
                  <div class="field"><label for="ai-category" class="tiny">Tipo</label>
                    <select id="ai-category" class="select">${Catalog.OCCURRENCE_LABELS.map(function (label) {
                      return '<option value="' + esc(label) + '"' + (aiCategory === label ? ' selected' : '') + '>' + esc(label) + '</option>';
                    }).join('')}</select></div>
                  <div class="field"><label for="ai-urgency" class="tiny">Urgência</label>
                    <select id="ai-urgency" class="select">${Catalog.URGENCIES.map(function (urgency) {
                      return '<option value="' + esc(urgency) + '"' + (aiUrgency === urgency ? ' selected' : '') + '>' + esc(urgency) + '</option>';
                    }).join('')}</select></div>
                  <div class="field"><label for="ai-area" class="tiny">Área</label>
                    <select id="ai-area" class="select"><option value="">Não definida</option>${Catalog.AREAS.map(function (area) {
                      return '<option value="' + esc(area) + '"' + (aiArea === area ? ' selected' : '') + '>' + esc(area) + '</option>';
                    }).join('')}</select></div>
                </div>
                <button type="button" class="btn btn-outline btn-sm" style="margin-top:8px" data-ai-save>Salvar classificação</button>
              </div>
            </section>

            <section class="detail-section">
              <h2>Relato</h2>
              <p class="section-note">Conteúdo integral enviado pelo denunciante.</p>
              <p class="report-text">${esc(report.description)}</p>
              <h3 style="font-size:.92rem;margin-top:20px;margin-bottom:6px">Pessoas envolvidas</h3>
              <p class="report-text small">${esc(report.involved || 'Não informado.')}</p>
              ${report.attachment ? `<div class="card card--soft" style="margin-top:18px;display:flex;justify-content:space-between;gap:12px;align-items:center">
                <span class="small" style="display:flex;gap:8px;align-items:center">${icon('paperclip', 16)} ${esc(report.attachment.filename)}</span>
                <span class="tiny muted">${UI.fmtBytes(report.attachment.size)} • anexo registrado no envio</span></div>` : ''}
              ${report.ai.sensitiveAlerts && report.ai.sensitiveAlerts.length ? '<div style="margin-top:16px">' + UI.alertBox('neutral', 'Atenção para dados desnecessários', 'Este relato contém possíveis dados sensíveis. Evite reproduzi-los em respostas ou relatórios e solicite remoção ao denunciante, se possível.') + '</div>' : ''}
            </section>

            <section class="detail-section">
              <h2>Histórico de alterações</h2>
              <p class="section-note">Somente leitura. Cada ação registra o responsável humano.</p>
              ${eventsList(true)}
            </section>
          </div>

          <div class="stack">
            <section class="detail-section">
              <h2>Dados da denúncia</h2>
              <dl class="meta-grid" style="margin-top:12px">
                <div><dt>Protocolo</dt><dd class="mono">${esc(report.protocol)}</dd></div>
                <div><dt>Modalidade</dt><dd>${report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</dd></div>
                <div><dt>Identificação</dt><dd>${report.modality === 'identificada' ? esc(report.reporterName || 'Nome não informado') : 'Anônima — sem dados identificadores'}</dd></div>
                <div><dt>Contato</dt><dd>${report.contactPreference ? esc((report.contactPreference === 'email' ? 'E-mail' : 'WhatsApp') + ': ' + report.contactValue) : 'Não informado'}</dd></div>
                <div><dt>Área responsável</dt><dd>${esc(report.area || 'Não definida')}</dd></div>
                <div><dt>Status</dt><dd>${esc(report.status)}</dd></div>
                <div><dt>Registrada em</dt><dd>${UI.fmtDateTime(report.createdAt)}</dd></div>
                <div><dt>Atualizada em</dt><dd>${UI.fmtDateTime(report.updatedAt)}</dd></div>
              </dl>
              <p class="tiny muted" style="margin-top:12px;display:flex;gap:6px;align-items:flex-start">
                ${icon(report.modality === 'anonima' ? 'lock' : 'info', 13)}
                ${report.modality === 'anonima'
                  ? 'Denúncia anônima: nenhum dado de identificação existe ou pode ser recuperado — nem pela IA, nem por gestores de área.'
                  : 'Dados de contato restritos à apuração. Não reproduza em relatórios agregados.'}
              </p>
            </section>

            <section class="detail-section">
              <h2>Alterar status</h2>
              <p class="section-note">Responsável registrado: ${esc(user.name)}</p>
              <div class="form-inline">
                <label for="new-status">Novo status</label>
                <select id="new-status" class="select">${Catalog.STATUSES.map(function (status) {
                  return '<option value="' + esc(status) + '"' + (statusChoice === status ? ' selected' : '') + '>' + esc(status) + '</option>';
                }).join('')}</select>
                <textarea id="status-note" class="textarea" style="min-height:70px" placeholder="Observação interna (opcional)" maxlength="2000"></textarea>
                <button type="button" class="btn btn-navy btn-sm" data-status>Atualizar status</button>
                <p class="tiny muted">Arquivar ou concluir exige esta ação humana — a IA nunca encerra um caso.</p>
              </div>
            </section>

            <section class="detail-section">
              <h2>Encaminhar para área</h2>
              <div class="form-inline">
                <label for="forward-area">Área responsável</label>
                <select id="forward-area" class="select"><option value="">Selecione a área</option>${Catalog.AREAS.map(function (area) {
                  return '<option value="' + esc(area) + '"' + (forwardChoice === area ? ' selected' : '') + '>' + esc(area) + '</option>';
                }).join('')}</select>
                <textarea id="forward-note" class="textarea" style="min-height:64px" placeholder="Observação interna (opcional)"></textarea>
                <button type="button" class="btn btn-outline btn-sm" data-forward>${icon('arrowRight', 15)} Encaminhar</button>
              </div>
            </section>

            <section class="detail-section">
              <h2>Responder ao denunciante</h2>
              <p class="section-note">A resposta aparece na consulta por protocolo e código.</p>
              <div class="form-inline">
                <textarea id="reply-message" class="textarea" style="min-height:84px" placeholder="Escreva uma resposta clara, sem dados de terceiros." maxlength="4000"></textarea>
                <button type="button" class="btn btn-primary btn-sm" data-reply>${icon('send', 15)} Enviar resposta</button>
              </div>
            </section>

            <section class="detail-section">
              <h2>Observação interna</h2>
              <p class="section-note">Visível apenas para a equipe. Não aparece ao denunciante.</p>
              <div class="form-inline">
                <textarea id="internal-note" class="textarea" style="min-height:74px" placeholder="Registre procedimentos, contatos e próximos passos." maxlength="4000"></textarea>
                <button type="button" class="btn btn-outline btn-sm" data-note>${icon('note', 15)} Salvar observação</button>
              </div>
            </section>

            <section class="detail-section">
              <h2>${icon('history', 16)} Log de acessos</h2>
              <p class="section-note">Somente leitura — data, hora, usuário e ação.</p>
              ${auditList()}
              <p class="tiny muted" style="margin-top:10px;display:flex;gap:6px;align-items:flex-start">${icon('alertTriangle', 13)} Todo acesso ao conteúdo é registrado e pode ser auditado.</p>
            </section>
          </div>
        </div>`;

      renderShell(view, user, 'reports', body);
      bindActions();
    }

    function success(title, text) {
      feedback = UI.alertBox('success', title, esc(text));
      render();
      window.scrollTo(0, 0);
    }

    function bindActions() {
      const statusSelect = view.querySelector('#new-status');
      const statusNote = view.querySelector('#status-note');
      const forwardSelect = view.querySelector('#forward-area');
      const forwardNote = view.querySelector('#forward-note');
      const replyBox = view.querySelector('#reply-message');
      const internalBox = view.querySelector('#internal-note');

      if (statusSelect) statusSelect.addEventListener('change', function () { statusChoice = statusSelect.value; });
      if (forwardSelect) forwardSelect.addEventListener('change', function () { forwardChoice = forwardSelect.value; });
      if (view.querySelector('#ai-category')) view.querySelector('#ai-category').addEventListener('change', function (event) { aiCategory = event.target.value; });
      if (view.querySelector('#ai-urgency')) view.querySelector('#ai-urgency').addEventListener('change', function (event) { aiUrgency = event.target.value; });
      if (view.querySelector('#ai-area')) view.querySelector('#ai-area').addEventListener('change', function (event) { aiArea = event.target.value; });

      const accept = view.querySelector('[data-ai-accept]');
      if (accept) {
        accept.addEventListener('click', function () {
          Store.updateReport(report, {
            category: report.ai.category,
            urgency: report.ai.urgency,
            area: report.ai.area || report.area,
            aiConfirmed: true,
          });
          report.ai.confirmed = true;
          Store.addEvent(report, {
            kind: 'ai',
            body: 'Classificação revisada por ' + user.name + ': tipo “' + report.ai.category + '”, urgência “' + report.ai.urgency + '”, área “' + (report.ai.area || 'não definida') + '”. Sugestão da IA confirmada pelo responsável humano.',
            author: user.name,
            visibility: 'internal',
          });
          Store.addAudit(user, 'Confirmou a sugestão da IA', report, 'Tipo: ' + report.category + '; urgência: ' + report.urgency + '; área: ' + (report.area || 'não definida'));
          success('Ação registrada', 'Sugestão da IA confirmada por ' + user.name + '.');
        });
      }

      const saveAi = view.querySelector('[data-ai-save]');
      if (saveAi) {
        saveAi.addEventListener('click', function () {
          Store.updateReport(report, {
            category: aiCategory,
            urgency: aiUrgency,
            area: aiArea,
            aiConfirmed: true,
          });
          report.ai.confirmed = true;
          Store.addEvent(report, {
            kind: 'ai',
            body: 'Classificação revisada por ' + user.name + ': tipo “' + aiCategory + '”, urgência “' + aiUrgency + '”, área “' + (aiArea || 'não definida') + '”. Sugestão da IA alterada pelo responsável humano.',
            author: user.name,
            visibility: 'internal',
          });
          Store.addAudit(user, 'Alterou a classificação sugerida pela IA', report, 'Tipo: ' + aiCategory + '; urgência: ' + aiUrgency + '; área: ' + (aiArea || 'não definida'));
          success('Ação registrada', 'Classificação alterada por ' + user.name + ': ' + aiCategory + ', urgência ' + aiUrgency + '.');
        });
      }

      const statusButton = view.querySelector('[data-status]');
      if (statusButton) {
        statusButton.addEventListener('click', function () {
          const previous = report.status;
          Store.updateReport(report, { status: statusChoice });
          Store.addEvent(report, {
            kind: 'status', fromStatus: previous, toStatus: statusChoice, author: user.name, visibility: 'reporter',
          });
          if (statusNote.value.trim()) {
            Store.addEvent(report, { kind: 'note', body: statusNote.value.trim(), author: user.name, visibility: 'internal' });
          }
          Store.addAudit(user, 'Alterou o status', report, 'De “' + previous + '” para “' + statusChoice + '”');
          success('Ação registrada', 'Status atualizado para “' + statusChoice + '”. O responsável humano ficou registrado.');
        });
      }

      const forwardButton = view.querySelector('[data-forward]');
      if (forwardButton) {
        forwardButton.addEventListener('click', function () {
          if (!forwardChoice) {
            feedback = UI.alertBox('danger', 'Não foi possível concluir', 'Selecione a área responsável.');
            render();
            return;
          }
          const previous = report.status;
          Store.updateReport(report, { area: forwardChoice, status: 'Encaminhada' });
          Store.addEvent(report, {
            kind: 'forward', fromStatus: previous, toStatus: 'Encaminhada',
            body: 'Denúncia encaminhada para a área ' + forwardChoice + '.',
            author: user.name, visibility: 'reporter',
          });
          if (forwardNote.value.trim()) {
            Store.addEvent(report, { kind: 'note', body: forwardNote.value.trim(), author: user.name, visibility: 'internal' });
          }
          Store.addAudit(user, 'Encaminhou a denúncia', report, 'Área: ' + forwardChoice);
          success('Ação registrada', 'Denúncia encaminhada para ' + forwardChoice + '. Status alterado para “Encaminhada”.');
        });
      }

      const replyButton = view.querySelector('[data-reply]');
      if (replyButton) {
        replyButton.addEventListener('click', function () {
          const text = replyBox.value.trim();
          if (text.length < 2) return;
          Store.addEvent(report, { kind: 'message', body: text, author: user.name, visibility: 'reporter' });
          Store.addAudit(user, 'Respondeu ao denunciante', report);
          success('Ação registrada', 'Resposta enviada ao denunciante e registrada no histórico.');
        });
      }

      const noteButton = view.querySelector('[data-note]');
      if (noteButton) {
        noteButton.addEventListener('click', function () {
          const text = internalBox.value.trim();
          if (text.length < 2) return;
          Store.addEvent(report, { kind: 'note', body: text, author: user.name, visibility: 'internal' });
          Store.addAudit(user, 'Registrou observação interna', report);
          success('Ação registrada', 'Observação interna registrada no histórico.');
        });
      }
    }

    render();
  }

  // Auditoria
  function auditLogs(view, user) {
    const logs = Store.logs(300);

    const body = topbar('<h1>Auditoria e logs de acesso</h1>',
      'Registro somente leitura de acessos e alterações. Data, hora, usuário e ação são preservados.',
      '<span class="panel-tag">' + icon('history', 14) + ' Somente leitura</span>') +
      (user.role === 'gestor'
        ? UI.alertBox('warn', 'Acesso restrito', 'O perfil Gestor de área não acessa o log de auditoria. Fale com Compliance/Ouvidoria ou com Auditoria/Segurança da Informação.')
        : `<div style="margin-bottom:16px">${UI.alertBox('info', 'Trilha de auditoria', 'Os registros abaixo apoiam a investigação de acessos indevidos. O conteúdo das denúncias não é armazenado neste log: apenas a ação, o protocolo e o responsável.')}</div>
          <div class="table-wrap">
            ${logs.length === 0 ? UI.emptyState('Nenhum registro de auditoria') : `
              <div class="table-scroll"><table class="data-table">
                <thead><tr><th>Data e hora</th><th>Usuário</th><th>Perfil</th><th>Ação</th><th>Protocolo</th><th>Detalhe</th></tr></thead>
                <tbody>${logs.map(function (log) {
                  return `<tr>
                    <td class="nowrap">${UI.fmtDateTime(log.at)}</td>
                    <td>${esc(log.user)}</td>
                    <td>${log.role ? esc(log.role) : '<span class="muted">—</span>'}</td>
                    <td>${esc(log.action)}</td>
                    <td class="mono">${log.protocol ? esc(log.protocol) : '<span class="muted">—</span>'}</td>
                    <td class="small muted">${esc(log.detail || '—')}</td>
                  </tr>`;
                }).join('')}</tbody>
              </table></div>`}
          </div>
          <p class="tiny muted" style="margin-top:12px"><a href="#/painel">← Voltar ao dashboard</a></p>`);

    renderShell(view, user, 'audit', body);
  }

  return {
    dashboard: dashboard,
    reportList: reportList,
    reportDetail: reportDetail,
    auditLogs: auditLogs,
  };
})();
