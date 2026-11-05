// Catálogo único de tipos, áreas, status e perfis do canal.
window.Catalog = (function () {
  const OCCURRENCE_TYPES = [
    { key: 'assedio', label: 'Assédio moral ou sexual', area: 'Recursos Humanos' },
    { key: 'fraude', label: 'Fraude', area: 'Financeiro' },
    { key: 'corrupcao', label: 'Corrupção e desvio de recursos', area: 'Compliance e Ouvidoria' },
    { key: 'conflito', label: 'Conflito de interesses', area: 'Compliance e Ouvidoria' },
    { key: 'discriminacao', label: 'Discriminação', area: 'Recursos Humanos' },
    { key: 'etica', label: 'Violação do código de ética e compliance', area: 'Compliance e Ouvidoria' },
    {
      key: 'seguranca_info',
      label: 'Ameaça à segurança da informação ou vazamento de dados',
      area: 'Segurança da Informação',
    },
    {
      key: 'integridade',
      label: 'Risco à integridade física ou psicológica',
      area: 'Saúde e Segurança do Trabalho',
    },
    { key: 'outras', label: 'Outras irregularidades', area: 'Compliance e Ouvidoria' },
  ];

  const OCCURRENCE_LABELS = OCCURRENCE_TYPES.map(function (type) { return type.label; });

  function areaForCategory(label) {
    const found = OCCURRENCE_TYPES.find(function (type) { return type.label === label; });
    return found ? found.area : 'Compliance e Ouvidoria';
  }

  const URGENCIES = ['Baixo', 'Médio', 'Alto', 'Prioridade Máxima'];

  const STATUSES = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada', 'Concluída', 'Arquivada'];

  const PUBLIC_STATUS_FLOW = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada'];

  const AREAS = [
    'Compliance e Ouvidoria',
    'Recursos Humanos',
    'Financeiro',
    'Segurança da Informação',
    'Auditoria Interna',
    'Jurídico',
    'Saúde e Segurança do Trabalho',
  ];

  const ROLES = {
    compliance: 'Compliance/Ouvidoria',
    gestor: 'Gestor de área',
    auditoria: 'Auditoria/Segurança da Informação',
  };

  const USERS = [
    {
      name: 'Marina Alves',
      email: 'compliance@canalseguro.exemplo',
      role: 'compliance',
      area: '',
    },
    {
      name: 'Rafael Lima',
      email: 'gestor.rh@canalseguro.exemplo',
      role: 'gestor',
      area: 'Recursos Humanos',
    },
    {
      name: 'Helena Costa',
      email: 'auditoria@canalseguro.exemplo',
      role: 'auditoria',
      area: '',
    },
  ];

  const DEMO_PASSWORD = 'Demo@2026';

  return {
    OCCURRENCE_TYPES: OCCURRENCE_TYPES,
    OCCURRENCE_LABELS: OCCURRENCE_LABELS,
    areaForCategory: areaForCategory,
    URGENCIES: URGENCIES,
    STATUSES: STATUSES,
    PUBLIC_STATUS_FLOW: PUBLIC_STATUS_FLOW,
    AREAS: AREAS,
    ROLES: ROLES,
    USERS: USERS,
    DEMO_PASSWORD: DEMO_PASSWORD,
  };
})();
