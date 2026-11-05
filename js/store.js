// Persistência local (localStorage) e dados fictícios de demonstração.
window.Store = (function () {
  const KEY = 'canalSeguroIA.v1';
  const DEMO_PASSWORD = Catalog.DEMO_PASSWORD;
  const AREAS = Catalog.AREAS;

  let memory = null;

  function hoursFrom(base, hours) {
    return new Date(base.getTime() + hours * 60 * 60 * 1000).toISOString();
  }

  const SEED_REPORTS = [
    {
      protocol: 'CS-2026-00001', accessCode: 'DEMO0001', category: 'Assédio moral ou sexual',
      urgency: 'Alto', status: 'Em análise', area: 'Recursos Humanos', daysAgo: 12,
      description: 'Meu gestor imediato humilha a equipe nas reuniões semanais. Ele faz piadas sobre o desempenho das pessoas, grita e expõe colegas que estão em período de experiência. Já pedi transferência de setor e passei a receber avaliações injustas depois disso. As situações acontecem desde março, sempre na reunião de segunda-feira, na sala do 4º andar da unidade Centro. Ele também envia mensagens fora do horário cobrando resultados sob ameaça de demissão.',
      involved: 'Gerente de operações e coordenação da equipe. Nomes completos são de conhecimento interno.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 4, author: 'Marina Alves' },
        { kind: 'note', body: 'Relato consistente. Necessário ouvir o time e verificar registros de avaliação.', hours: 6, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 30, author: 'Marina Alves' },
        { kind: 'message', body: 'Recebemos sua denúncia e ela está em análise pela equipe de Compliance e Recursos Humanos. Nenhuma medida será tomada sem revisão humana. Você pode continuar acompanhando por aqui.', hours: 52, author: 'Equipe de Compliance' },
      ],
    },
    {
      protocol: 'CS-2026-00002', accessCode: 'DEMO0002', category: 'Fraude',
      urgency: 'Médio', status: 'Em triagem', area: '', daysAgo: 5,
      description: 'Há notas fiscais duplicadas sendo lançadas no sistema financeiro para o mesmo serviço de manutenção. O valor é pago duas vezes e o fornecedor devolve parte em dinheiro. Identifiquei o padrão em três pagamentos do mês passado. Os lançamentos são aprovados sem conferência do contrato.',
      involved: 'Analista financeiro responsável pelos lançamentos e suposto fornecedor de manutenção.',
      timeline: [{ kind: 'status', to: 'Em triagem', hours: 5, author: 'Marina Alves' }],
    },
    {
      protocol: 'CS-2026-00003', accessCode: 'DEMO0003', category: 'Risco à integridade física ou psicológica',
      urgency: 'Prioridade Máxima', status: 'Recebida', area: '', daysAgo: 0,
      description: 'Na noite de ontem, um supervisor ameaçou um colega com uma arma no estacionamento da fábrica. Ele disse que vai resolver o problema fora do expediente e que o colega vai se arrepender. Há relato de agressão física e ameaça de morte. O clima é de risco de vida e as pessoas estão com medo de ir trabalhar hoje.',
      involved: 'Supervisor do turno da noite e um operador de produção.',
      timeline: [],
    },
    {
      protocol: 'CS-2026-00004', accessCode: 'DEMO0004', category: 'Ameaça à segurança da informação ou vazamento de dados',
      urgency: 'Alto', status: 'Encaminhada', area: 'Segurança da Informação', daysAgo: 8,
      description: 'Uma planilha com dados pessoais de clientes, incluindo CPF e telefone, foi compartilhada por e-mail para uma lista externa de marketing sem autorização. O arquivo está em uma pasta aberta a toda a área comercial. Pelo que sei, não houve registro de incidente nem comunicação aos titulares.',
      involved: 'Coordenação comercial e equipe de relacionamento.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 3, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 20, author: 'Marina Alves' },
        { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Segurança da Informação.', hours: 28, author: 'Marina Alves' },
        { kind: 'message', body: 'Sua denúncia foi encaminhada à área de Segurança da Informação para avaliação do incidente e das medidas cabíveis.', hours: 30, author: 'Equipe de Compliance' },
      ],
    },
    {
      protocol: 'CS-2026-00005', accessCode: 'DEMO0005', category: 'Discriminação',
      urgency: 'Médio', status: 'Concluída', area: 'Recursos Humanos', daysAgo: 26,
      description: 'Durante o processo seletivo, uma candidata foi dispensada depois de informar que é pessoa com deficiência. Também presenciei comentários racistas de um gestor sobre a aparência de outra candidata. Esses comentários são recorrentes no departamento e criam um ambiente de preconceito.',
      involved: 'Gestor de recrutamento. Candidatas não fazem parte da organização.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 4, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 26, author: 'Marina Alves' },
        { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Recursos Humanos.', hours: 40, author: 'Marina Alves' },
        { kind: 'note', body: 'Processo conduzido com entrevistas e revisão das políticas de recrutamento. Plano de ação registrado.', hours: 120, author: 'Rafael Lima' },
        { kind: 'message', body: 'A apuração foi concluída pela área de Recursos Humanos com medidas educativas e revisão do processo seletivo. O caso está encerrado.', hours: 150, author: 'Equipe de Compliance' },
        { kind: 'status', to: 'Concluída', hours: 152, author: 'Marina Alves' },
      ],
    },
    {
      protocol: 'CS-2026-00006', accessCode: 'DEMO0006', category: 'Corrupção e desvio de recursos',
      urgency: 'Alto', status: 'Encaminhada', area: 'Compliance e Ouvidoria', daysAgo: 17,
      description: 'Um fornecedor de obra pública pagou propina a um coordenador para fechar contrato com dispensa de licitação. O pagamento por fora foi combinado em reunião e há previsão de vantagem indevida em cada medição. O contrato foi assinado com valor acima do mercado.',
      involved: 'Coordenador de infraestrutura e representante do fornecedor.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 2, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 18, author: 'Marina Alves' },
        { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Compliance e Ouvidoria.', hours: 26, author: 'Marina Alves' },
      ],
    },
    {
      protocol: 'CS-2026-00007', accessCode: 'DEMO0007', category: 'Conflito de interesses',
      urgency: 'Baixo', status: 'Arquivada', area: 'Compliance e Ouvidoria', daysAgo: 40,
      description: 'Um gerente contratou a empresa da esposa para prestar serviços de limpeza, sem declarar o conflito de interesses. A empresa recebeu o contrato por indicação direta e não havia outras propostas. Não tenho informações sobre valores.',
      involved: 'Gerente administrativo e empresa prestadora de serviços.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 6, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 30, author: 'Marina Alves' },
        { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Compliance e Ouvidoria.', hours: 48, author: 'Marina Alves' },
        { kind: 'note', body: 'Após revisão humana: contratação seguiu o procedimento e o vínculo familiar foi declarado antes da assinatura. Sem indício de irregularidade.', hours: 96, author: 'Marina Alves' },
        { kind: 'message', body: 'A análise foi concluída e o caso arquivado após revisão humana. Agradecemos o registro.', hours: 100, author: 'Equipe de Compliance' },
        { kind: 'status', to: 'Arquivada', hours: 101, author: 'Marina Alves' },
      ],
    },
    {
      protocol: 'CS-2026-00008', accessCode: 'DEMO0008', category: 'Violação do código de ética e compliance',
      urgency: 'Médio', status: 'Em análise', area: 'Compliance e Ouvidoria', daysAgo: 9,
      description: 'Diretores recebem presentes e viagens de fornecedores em troca de preferência nas compras. O código de ética proíbe qualquer vantagem, mas as viagens são lançadas como treinamento. Descumpriram a política interna de presentes e hospitalidade em pelo menos quatro ocasiões.',
      involved: 'Diretoria de compras e dois fornecedores estratégicos.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 3, author: 'Marina Alves' },
        { kind: 'note', body: 'Solicitados registros de viagens e agenda de compras para conferência.', hours: 8, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 24, author: 'Marina Alves' },
      ],
    },
    {
      protocol: 'CS-2026-00009', accessCode: 'DEMO0009', modality: 'identificada',
      reporterName: 'Carla Menezes', contactPreference: 'email', contactValue: 'carla.menezes@exemplo.com',
      category: 'Assédio moral ou sexual', urgency: 'Prioridade Máxima', aiUrgency: 'Prioridade Máxima',
      status: 'Em análise', area: 'Recursos Humanos', daysAgo: 3,
      description: 'Um diretor faz insinuações e cantadas para uma colaboradora do meu time. Ela relatou constrangimento, coação sexual e medo de retaliação por parte do superior. Estou registrando com autorização dela. O comportamento acontece em reuniões individuais e em viagens de trabalho.',
      involved: 'Diretor de operações e uma analista do time.',
      timeline: [
        { kind: 'status', to: 'Em triagem', hours: 2, author: 'Marina Alves' },
        { kind: 'note', body: 'Denunciante identificada. Contato protegido e restrito ao Compliance. Acolhimento iniciado.', hours: 4, author: 'Marina Alves' },
        { kind: 'status', to: 'Em análise', hours: 20, author: 'Marina Alves' },
        { kind: 'message', body: 'Recebemos seu relato e acionamos o protocolo de acolhimento. O acesso ao seu contato é restrito ao Compliance e nenhuma medida será tomada sem revisão humana.', hours: 22, author: 'Equipe de Compliance' },
      ],
    },
    {
      protocol: 'CS-2026-00010', accessCode: 'DEMO0010', category: 'Outras irregularidades',
      urgency: 'Baixo', status: 'Recebida', area: '', daysAgo: 1,
      description: 'Algumas pessoas usam o estacionamento reservado a visitantes todos os dias, ocupando as vagas de clientes. Pedi orientação ao setor responsável e não obtive resposta. Ocorre no estacionamento da unidade Centro.',
      involved: 'Não sei identificar as pessoas.',
      timeline: [],
    },
  ];

  const SEED_AUDIT = [
    { user: 'Marina Alves', role: 'compliance', action: 'Visualizou a denúncia', protocol: 'CS-2026-00003', hoursAgo: 2 },
    { user: 'Marina Alves', role: 'compliance', action: 'Alterou o status', protocol: 'CS-2026-00004', detail: 'De “Em análise” para “Encaminhada”', hoursAgo: 20 },
    { user: 'Rafael Lima', role: 'gestor', action: 'Visualizou a denúncia', protocol: 'CS-2026-00005', hoursAgo: 110 },
    { user: 'Helena Costa', role: 'auditoria', action: 'Visualizou metadados da denúncia', protocol: 'CS-2026-00002', hoursAgo: 60 },
    { user: 'Marina Alves', role: 'compliance', action: 'Respondeu ao denunciante', protocol: 'CS-2026-00001', hoursAgo: 50 },
    { user: 'Helena Costa', role: 'auditoria', action: 'Consultou o log de acessos', hoursAgo: 30, detail: 'Exportação de metadados para auditoria trimestral' },
  ];

  function buildSeed() {
    const now = Date.now();
    const reports = SEED_REPORTS.map(function (sample, index) {
      const base = new Date(now - sample.daysAgo * 24 * 60 * 60 * 1000);
      base.setHours(9, 20, 0, 0);
      const analysis = Analyzer.analyze(sample.description, sample.involved, sample.category);
      const events = [{
        kind: 'opened',
        toStatus: 'Recebida',
        body: 'Denúncia registrada com sucesso. Protocolo gerado automaticamente.',
        author: 'Denunciante',
        visibility: 'reporter',
        at: base.toISOString(),
      }];

      sample.timeline.forEach(function (event) {
        events.push({
          kind: event.kind,
          fromStatus: event.from || null,
          toStatus: event.to || null,
          body: event.body || null,
          author: event.author || 'Equipe de Compliance',
          visibility: event.kind === 'note' ? 'internal' : 'reporter',
          at: hoursFrom(base, event.hours),
        });
      });

      const last = sample.timeline.length ? sample.timeline[sample.timeline.length - 1].hours : 0;

      return {
        id: index + 1,
        protocol: sample.protocol,
        accessCode: sample.accessCode,
        modality: sample.modality || 'anonima',
        reporterName: sample.reporterName || '',
        contactPreference: sample.contactPreference || '',
        contactValue: sample.contactValue || '',
        description: sample.description,
        involved: sample.involved || '',
        category: sample.category,
        urgency: sample.urgency,
        status: sample.status,
        area: sample.area || '',
        ai: {
          category: analysis.category,
          confidence: analysis.confidence,
          urgency: sample.aiUrgency || analysis.urgency,
          area: analysis.area,
          imminentRisk: analysis.imminentRisk,
          sensitiveAlerts: analysis.sensitiveAlerts,
          confirmed: Boolean(sample.area),
        },
        attachment: null,
        createdAt: base.toISOString(),
        updatedAt: hoursFrom(base, last),
        events: events,
      };
    });

    const auditLogs = SEED_AUDIT.map(function (log, index) {
      return {
        id: index + 1,
        user: log.user,
        role: Catalog.ROLES[log.role],
        action: log.action,
        protocol: log.protocol || '',
        detail: log.detail || '',
        at: new Date(now - log.hoursAgo * 60 * 60 * 1000).toISOString(),
      };
    });

    return {
      reports: reports,
      auditLogs: auditLogs,
      nextProtocol: SEED_REPORTS.length + 1,
      nextAudit: auditLogs.length + 1,
      sessionEmail: '',
    };
  }

  function load() {
    if (memory) return memory;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.reports)) {
          memory = parsed;
          return memory;
        }
      }
    } catch (error) {
      // localStorage indisponível: segue apenas em memória.
    }
    memory = buildSeed();
    persist();
    return memory;
  }

  function persist() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(memory));
    } catch (error) {
      // Sem persistência: mantém a sessão atual em memória.
    }
  }

  function currentUser() {
    const email = load().sessionEmail;
    if (!email) return null;
    const user = Catalog.USERS.find(function (item) { return item.email === email; });
    return user || null;
  }

  function login(email, password) {
    const user = Catalog.USERS.find(function (item) { return item.email === String(email || '').trim().toLowerCase(); });
    if (!user || password !== DEMO_PASSWORD) return null;
    const db = load();
    db.sessionEmail = user.email;
    persist();
    return user;
  }

  function logout() {
    const db = load();
    db.sessionEmail = '';
    persist();
  }

  function visibleReports(user) {
    const reports = load().reports.slice();
    const scoped = user && user.role === 'gestor'
      ? reports.filter(function (report) { return report.area === user.area; })
      : reports;
    return scoped.sort(function (a, b) {
      const weight = { 'Prioridade Máxima': 0, Alto: 1, Médio: 2, Baixo: 3 };
      const diff = weight[a.urgency] - weight[b.urgency];
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  function getReport(id, user) {
    const report = load().reports.find(function (item) { return item.id === Number(id); });
    if (!report) return null;
    if (user && user.role === 'gestor' && report.area !== user.area) return null;
    return report;
  }

  function addAudit(user, action, report, detail) {
    const db = load();
    db.auditLogs.push({
      id: db.nextAudit++,
      user: user ? user.name : 'Sistema',
      role: user ? Catalog.ROLES[user.role] : '',
      action: action,
      protocol: report ? report.protocol : '',
      detail: detail || '',
      at: new Date().toISOString(),
    });
    persist();
  }

  function generateAccessCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let index = 0; index < 8; index += 1) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      if (index === 3) code += '-';
    }
    return code;
  }

  function createReport(form) {
    const db = load();
    const analysis = Analyzer.analyze(form.description, form.involved, form.category);
    const protocol = 'CS-' + new Date().getFullYear() + '-' + String(db.nextProtocol++).padStart(5, '0');
    const accessCode = generateAccessCode();
    const now = new Date().toISOString();

    const report = {
      id: db.reports.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1,
      protocol: protocol,
      accessCode: accessCode,
      modality: form.modality,
      reporterName: form.modality === 'identificada' ? form.reporterName : '',
      contactPreference: form.modality === 'identificada' ? form.contactPreference : '',
      contactValue: form.modality === 'identificada' ? form.contactValue : '',
      description: form.description,
      involved: form.involved,
      category: form.category,
      urgency: analysis.urgency,
      status: 'Recebida',
      area: '',
      ai: {
        category: analysis.category,
        confidence: analysis.confidence,
        urgency: analysis.urgency,
        area: analysis.area,
        imminentRisk: analysis.imminentRisk,
        sensitiveAlerts: analysis.sensitiveAlerts,
        confirmed: false,
      },
      attachment: form.attachment || null,
      createdAt: now,
      updatedAt: now,
      events: [
        {
          kind: 'opened',
          toStatus: 'Recebida',
          body: 'Denúncia registrada com sucesso. Protocolo gerado automaticamente.',
          author: 'Denunciante',
          visibility: 'reporter',
          at: now,
        },
        {
          kind: 'ai',
          body: 'Sugestão gerada: tipo “' + analysis.category + '” (' + analysis.confidence + '% de confiança), ' +
            'urgência “' + analysis.urgency + '”, área sugerida “' + analysis.area + '”. ' +
            'Sinais de dados sensíveis: ' + analysis.sensitiveAlerts.length + '. ' +
            'Linguagem de risco iminente: ' + (analysis.imminentRisk ? 'sim' : 'não') + '.',
          author: 'Apoio de IA',
          visibility: 'internal',
          at: now,
        },
      ],
    };

    db.reports.push(report);
    persist();
    return report;
  }

  function track(protocol, code) {
    const normalizedProtocol = String(protocol || '').trim().toUpperCase();
    const normalizedCode = String(code || '').trim().toUpperCase();
    const report = load().reports.find(function (item) { return item.protocol === normalizedProtocol; });
    if (!report || report.accessCode !== normalizedCode) return null;
    return report;
  }

  function updateReport(report, changes) {
    Object.assign(report, changes);
    report.updatedAt = new Date().toISOString();
    persist();
  }

  function addEvent(report, event) {
    report.events.push(Object.assign({ at: new Date().toISOString() }, event));
    report.updatedAt = new Date().toISOString();
    persist();
  }

  function summary(user) {
    const reports = visibleReports(user);
    const byStatus = {};
    const byCategory = {};
    const byUrgency = {};
    Catalog.STATUSES.forEach(function (status) { byStatus[status] = 0; });
    Catalog.OCCURRENCE_LABELS.forEach(function (label) { byCategory[label] = 0; });
    Catalog.URGENCIES.forEach(function (urgency) { byUrgency[urgency] = 0; });

    reports.forEach(function (report) {
      byStatus[report.status] = (byStatus[report.status] || 0) + 1;
      byCategory[report.category] = (byCategory[report.category] || 0) + 1;
      byUrgency[report.urgency] = (byUrgency[report.urgency] || 0) + 1;
    });

    const openStatuses = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada'];
    const active = openStatuses.reduce(function (sum, status) { return sum + (byStatus[status] || 0); }, 0);
    const alerts = reports.filter(function (report) {
      return report.urgency === 'Prioridade Máxima' && ['Concluída', 'Arquivada'].indexOf(report.status) === -1;
    });

    return {
      total: reports.length,
      active: active,
      concluded: byStatus['Concluída'] || 0,
      maxPriorityOpen: alerts.length,
      byStatus: byStatus,
      byCategory: byCategory,
      byUrgency: byUrgency,
      alerts: alerts.slice(0, 8),
    };
  }

  function logs(limit) {
    return load().auditLogs.slice().sort(function (a, b) {
      return new Date(b.at) - new Date(a.at);
    }).slice(0, limit || 300);
  }

  return {
    currentUser: currentUser,
    login: login,
    logout: logout,
    visibleReports: visibleReports,
    getReport: getReport,
    addAudit: addAudit,
    createReport: createReport,
    track: track,
    updateReport: updateReport,
    addEvent: addEvent,
    summary: summary,
    logs: logs,
  };
})();
