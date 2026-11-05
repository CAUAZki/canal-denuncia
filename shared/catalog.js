// Catálogo único compartilhado entre o servidor (IA e regras) e a interface.

export const OCCURRENCE_TYPES = [
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

export const OCCURRENCE_LABELS = OCCURRENCE_TYPES.map((t) => t.label);

export function areaForCategory(label) {
  const found = OCCURRENCE_TYPES.find((t) => t.label === label);
  return found ? found.area : 'Compliance e Ouvidoria';
}

export const URGENCIES = ['Baixo', 'Médio', 'Alto', 'Prioridade Máxima'];

export const STATUSES = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada', 'Concluída', 'Arquivada'];

export const PUBLIC_STATUS_FLOW = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada'];

export const AREAS = [
  'Compliance e Ouvidoria',
  'Recursos Humanos',
  'Financeiro',
  'Segurança da Informação',
  'Auditoria Interna',
  'Jurídico',
  'Saúde e Segurança do Trabalho',
];

export const ROLES = {
  compliance: 'Compliance/Ouvidoria',
  gestor: 'Gestor de área',
  auditoria: 'Auditoria/Segurança da Informação',
};
