// Camada de apoio de IA do canal: determinística, local e apenas sugestiva.
window.Analyzer = (function () {
  const CATEGORY_KEYWORDS = {
    assedio: ['assédio', 'assedio', 'humilha', 'humilhação', 'constrang', 'importun', 'insinua', 'cantada', 'coação sexual', 'coacao sexual', 'gritos', 'persegui', 'exposição', 'piada', 'toque', 'apalp', 'intimid', 'chantag', 'superior imediato'],
    fraude: ['fraude', 'falsific', 'nota fisc', 'fisca', 'superfatur', 'desvio de verba', 'desvio de recurso', 'pagamento indevido', 'pagamento repetido', 'duplic', 'balanço', 'balanco', 'contábil', 'contabil', 'rombo', 'caixa', 'reembolso'],
    corrupcao: ['propina', 'suborno', 'comissão', 'comissao', 'licitação', 'licitacao', 'favorec', 'vantagem indevida', 'pagamento por fora', 'cartel', 'obra pública', 'obra publica', 'dispensa de licitação', 'dispensa de licitacao'],
    conflito: ['conflito de interesses', 'parente', 'cunhado', 'esposa', 'marido', 'empresa da família', 'empresa da familia', 'contratou a própria', 'contratou a propria', 'benefício próprio', 'beneficio proprio', 'sócio', 'socio'],
    discriminacao: ['racismo', 'racista', 'discrimin', 'preconceito', 'homofobia', 'machismo', 'misogin', 'religião', 'religiao', 'deficiência', 'deficiencia', 'etarismo', 'xenofobia', 'transfobia', 'gordofobia'],
    etica: ['código de ética', 'codigo de etica', 'ética', 'etica', 'compliance', 'política interna', 'politica interna', 'descumpr', 'norma interna', 'presente', 'brinde', 'viagem', 'uso indevido de cargo'],
    seguranca_info: ['vazamento', 'dados pessoais', 'senha', 'phishing', 'acesso indevido', 'hacker', 'backup', 'lgpd', 'informação confidencial', 'informacao confidencial', 'banco de dados', 'planilha compartilhada', 'e-mail indevido', 'compartilhou dados', 'credenciais'],
    integridade: ['ameaça', 'ameaca', 'agress', 'violência', 'violencia', 'arma', 'drogas', 'risco de vida', 'acidente', 'segurança do trabalho', 'seguranca do trabalho', 'suicíd', 'automutila', 'emergência', 'emergencia', 'pressão psicológica', 'pressao psicologica', 'sem epi'],
    outras: [],
  };

  const CATEGORY_LABELS = {
    assedio: 'Assédio moral ou sexual',
    fraude: 'Fraude',
    corrupcao: 'Corrupção e desvio de recursos',
    conflito: 'Conflito de interesses',
    discriminacao: 'Discriminação',
    etica: 'Violação do código de ética e compliance',
    seguranca_info: 'Ameaça à segurança da informação ou vazamento de dados',
    integridade: 'Risco à integridade física ou psicológica',
    outras: 'Outras irregularidades',
  };

  const IMMINENT_RISK_TERMS = ['vai me matar', 'vou me matar', 'me matar', 'tirar minha vida', 'suicíd', 'suicid', 'risco de vida', 'risco iminente', 'arma', 'armado', 'agressão física', 'agressao fisica', 'agrediu', 'ameaça de morte', 'ameaca de morte', 'estupro', 'sequestro', 'explosivo', 'bomba', 'incêndio', 'incendio', 'envenen', 'intoxica', 'acidente grave', 'desabamento', 'violência imediata', 'violencia imediata', 'emergência médica', 'emergencia medica'];

  const HIGH_PRESSURE_TERMS = ['assédio', 'assedio', 'vazamento', 'dados sensíveis', 'dados sensiveis', 'fraude', 'corrupção', 'corrupcao', 'discrimina', 'violência', 'violencia', 'reincidência', 'reincidencia', 'diretor', 'gerente', 'superior', 'ameaça', 'ameaca', 'pressão', 'pressao', 'humilha', 'desvio'];

  const SENSITIVE_RULES = [
    { key: 'cpf', label: 'CPF identificado', pattern: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}-?\d{2}\b/, recommendation: 'Remova o CPF do relato: ele não é necessário para a apuração.' },
    { key: 'telefone', label: 'Telefone identificado', pattern: /(\(\d{2}\)\s?9?\d{4}[\s-]?\d{4})|(\b\d{2}\s?9\d{4}[\s-]?\d{4}\b)/, recommendation: 'Prefira não informar telefones de terceiros no relato.' },
    { key: 'email', label: 'E-mail identificado', pattern: /[\w.+-]+@[\w-]+\.[\w.]+/, recommendation: 'Se o e-mail não for essencial, remova-o para preservar a privacidade.' },
    { key: 'endereco', label: 'Endereço ou CEP mencionado', pattern: /\b(rua|avenida|av\.|alameda|travessa|rodovia|cep)\b/i, recommendation: 'Informe apenas o local de forma geral (setor, unidade, cidade).' },
    { key: 'saude', label: 'Dado de saúde mencionado', pattern: /\b(diagnóstico|diagnostico|atestado|medicamento|doença|doenca|saúde mental|saude mental|psicólogo|psicologo|psiquiatra|exame médico|exame medico|licença médica|licenca medica)\b/i, recommendation: 'Dados de saúde são sensíveis: descreva apenas o impacto no ambiente de trabalho.' },
    { key: 'financeiro', label: 'Dado bancário mencionado', pattern: /\b(agência bancária|agencia bancaria|conta corrente|cartão de crédito|cartao de credito|chave pix)\b/i, recommendation: 'Dados bancários não são necessários para registrar a denúncia.' },
  ];

  function countMatches(text, keywords) {
    let score = 0;
    keywords.forEach(function (keyword) {
      if (text.indexOf(keyword) !== -1) score += 1;
    });
    return score;
  }

  function detectSensitiveData(description, involved) {
    const text = String(description || '') + '\n' + String(involved || '');
    return SENSITIVE_RULES.filter(function (rule) {
      return rule.pattern.test(text);
    }).map(function (rule) {
      return { key: rule.key, label: rule.label, recommendation: rule.recommendation };
    });
  }

  function analyze(description, involved, selectedCategory) {
    const text = String(description || '').toLowerCase() + '\n' + String(involved || '').toLowerCase();

    const scores = {};
    Object.keys(CATEGORY_KEYWORDS).forEach(function (key) {
      scores[key] = countMatches(text, CATEGORY_KEYWORDS[key]);
    });

    let topKey = null;
    let topScore = 0;
    Object.keys(scores).forEach(function (key) {
      if (scores[key] > topScore) {
        topScore = scores[key];
        topKey = key;
      }
    });

    let suggestedCategory = selectedCategory || Catalog.OCCURRENCE_LABELS[Catalog.OCCURRENCE_LABELS.length - 1];
    let confidence = 35;

    if (topScore > 0 && topKey) {
      suggestedCategory = CATEGORY_LABELS[topKey];
      confidence = Math.min(94, 45 + topScore * 9);
    }

    const imminentRisk = IMMINENT_RISK_TERMS.some(function (term) { return text.indexOf(term) !== -1; });
    const pressure = countMatches(text, HIGH_PRESSURE_TERMS);
    const longReport = String(description || '').length > 700;

    let urgency = 'Baixo';
    if (imminentRisk) {
      urgency = 'Prioridade Máxima';
    } else if (pressure >= 3 || (pressure >= 2 && longReport)) {
      urgency = 'Alto';
    } else if (pressure >= 1 || topScore >= 1) {
      urgency = 'Médio';
    }

    const sensitiveAlerts = detectSensitiveData(description, involved);
    const area = imminentRisk ? 'Saúde e Segurança do Trabalho' : Catalog.areaForCategory(suggestedCategory);

    return {
      category: suggestedCategory,
      confidence: confidence,
      urgency: urgency,
      area: area,
      imminentRisk: imminentRisk,
      sensitiveAlerts: sensitiveAlerts,
    };
  }

  return { analyze: analyze, detectSensitiveData: detectSensitiveData };
})();
