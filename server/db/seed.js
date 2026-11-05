import { pool } from './pool.js';
import { hashAccessCode, hashPassword } from '../lib/auth.js';
import { analyzeReport } from '../ai/analyzer.js';
import { AREAS } from '../../shared/catalog.js';

const DEMO_PASSWORD = 'Demo@2026';

function hoursFrom(base, hours) {
  return new Date(base.getTime() + hours * 60 * 60 * 1000);
}

const REPORTS = [
  {
    protocol: 'CS-2026-00001',
    accessCode: 'DEMO0001',
    modality: 'anonima',
    category: 'Assédio moral ou sexual',
    urgency: 'Alto',
    status: 'Em análise',
    area: 'Recursos Humanos',
    daysAgo: 12,
    description:
      'Meu gestor imediato humilha a equipe nas reuniões semanais. Ele faz piadas sobre o desempenho das pessoas, grita e expõe colegas que estão em período de experiência. Já pedi transferência de setor e passei a receber avaliações injustas depois disso. As situações acontecem desde março, sempre na reunião de segunda-feira, na sala do 4º andar da unidade Centro. Ele também envia mensagens fora do horário cobrando resultados sob ameaça de demissão.',
    involved: 'Gerente de operações e coordenação da equipe. Nomes completos são de conhecimento interno.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 4, author: 'Marina Alves' },
      { kind: 'note', body: 'Relato consistente. Necessário ouvir o time e verificar registros de avaliação.', hours: 6, author: 'Marina Alves' },
      { kind: 'status', to: 'Em análise', hours: 30, author: 'Marina Alves' },
      { kind: 'message', body: 'Recebemos sua denúncia e ela está em análise pela equipe de Compliance e Recursos Humanos. Nenhuma medida será tomada sem revisão humana. Você pode continuar acompanhando por aqui.', hours: 52, author: 'Equipe de Compliance' },
    ],
  },
  {
    protocol: 'CS-2026-00002',
    accessCode: 'DEMO0002',
    modality: 'anonima',
    category: 'Fraude',
    urgency: 'Médio',
    status: 'Em triagem',
    area: null,
    daysAgo: 5,
    description:
      'Há notas fiscais duplicadas sendo lançadas no sistema financeiro para o mesmo serviço de manutenção. O valor é pago duas vezes e o fornecedor devolve parte em dinheiro. Identifiquei o padrão em três pagamentos do mês passado. Os lançamentos são aprovados sem conferência do contrato.',
    involved: 'Analista financeiro responsável pelos lançamentos e suposto fornecedor de manutenção.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 5, author: 'Marina Alves' },
    ],
  },
  {
    protocol: 'CS-2026-00003',
    accessCode: 'DEMO0003',
    modality: 'anonima',
    category: 'Risco à integridade física ou psicológica',
    urgency: 'Prioridade Máxima',
    status: 'Recebida',
    area: null,
    daysAgo: 0,
    description:
      'Na noite de ontem, um supervisor ameaçou um colega com uma arma no estacionamento da fábrica. Ele disse que vai resolver o problema fora do expediente e que o colega vai se arrepender. Há relato de agressão física e ameaça de morte. O clima é de risco de vida e as pessoas estão com medo de ir trabalhar hoje.',
    involved: 'Supervisor do turno da noite e um operador de produção.',
    timeline: [],
  },
  {
    protocol: 'CS-2026-00004',
    accessCode: 'DEMO0004',
    modality: 'anonima',
    category: 'Ameaça à segurança da informação ou vazamento de dados',
    urgency: 'Alto',
    status: 'Encaminhada',
    area: 'Segurança da Informação',
    daysAgo: 8,
    description:
      'Uma planilha com dados pessoais de clientes, incluindo CPF e telefone, foi compartilhada por e-mail para uma lista externa de marketing sem autorização. O arquivo está em uma pasta aberta a toda a área comercial. Pelo que sei, não houve registro de incidente nem comunicação aos titulares.',
    involved: 'Coordenação comercial e equipe de relacionamento.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 3, author: 'Marina Alves' },
      { kind: 'status', to: 'Em análise', hours: 20, author: 'Marina Alves' },
      { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Segurança da Informação.', hours: 28, author: 'Marina Alves' },
      { kind: 'message', body: 'Sua denúncia foi encaminhada à área de Segurança da Informação para avaliação do incidente e das medidas cabíveis.', hours: 30, author: 'Equipe de Compliance' },
    ],
  },
  {
    protocol: 'CS-2026-00005',
    accessCode: 'DEMO0005',
    modality: 'anonima',
    category: 'Discriminação',
    urgency: 'Médio',
    status: 'Concluída',
    area: 'Recursos Humanos',
    daysAgo: 26,
    description:
      'Durante o processo seletivo, uma candidata foi dispensada depois de informar que é pessoa com deficiência. Também presenciei comentários racistas de um gestor sobre a aparência de outra candidata. Esses comentários são recorrentes no departamento e criam um ambiente de preconceito.',
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
    protocol: 'CS-2026-00006',
    accessCode: 'DEMO0006',
    modality: 'anonima',
    category: 'Corrupção e desvio de recursos',
    urgency: 'Alto',
    status: 'Encaminhada',
    area: 'Compliance e Ouvidoria',
    daysAgo: 17,
    description:
      'Um fornecedor de obra pública pagou propina a um coordenador para fechar contrato com dispensa de licitação. O pagamento por fora foi combinado em reunião e há previsão de vantagem indevida em cada medição. O contrato foi assinado com valor acima do mercado.',
    involved: 'Coordenador de infraestrutura e representante do fornecedor.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 2, author: 'Marina Alves' },
      { kind: 'status', to: 'Em análise', hours: 18, author: 'Marina Alves' },
      { kind: 'forward', to: 'Encaminhada', body: 'Denúncia encaminhada para a área Compliance e Ouvidoria.', hours: 26, author: 'Marina Alves' },
    ],
  },
  {
    protocol: 'CS-2026-00007',
    accessCode: 'DEMO0007',
    modality: 'anonima',
    category: 'Conflito de interesses',
    urgency: 'Baixo',
    status: 'Arquivada',
    area: 'Compliance e Ouvidoria',
    daysAgo: 40,
    description:
      'Um gerente contratou a empresa da esposa para prestar serviços de limpeza, sem declarar o conflito de interesses. A empresa recebeu o contrato por indicação direta e não havia outras propostas. Não tenho informações sobre valores.',
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
    protocol: 'CS-2026-00008',
    accessCode: 'DEMO0008',
    modality: 'anonima',
    category: 'Violação do código de ética e compliance',
    urgency: 'Médio',
    status: 'Em análise',
    area: 'Compliance e Ouvidoria',
    daysAgo: 9,
    description:
      'Diretores recebem presentes e viagens de fornecedores em troca de preferência nas compras. O código de ética proíbe qualquer vantagem, mas as viagens são lançadas como treinamento. Descumpriram a política interna de presentes e hospitalidade em pelo menos quatro ocasiões.',
    involved: 'Diretoria de compras e dois fornecedores estratégicos.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 3, author: 'Marina Alves' },
      { kind: 'note', body: 'Solicitados registros de viagens e agenda de compras para conferência.', hours: 8, author: 'Marina Alves' },
      { kind: 'status', to: 'Em análise', hours: 24, author: 'Marina Alves' },
    ],
  },
  {
    protocol: 'CS-2026-00009',
    accessCode: 'DEMO0009',
    modality: 'identificada',
    reporterName: 'Carla Menezes',
    contactPreference: 'email',
    contactValue: 'carla.menezes@exemplo.com',
    category: 'Assédio moral ou sexual',
    urgency: 'Prioridade Máxima',
    aiUrgency: 'Prioridade Máxima',
    status: 'Em análise',
    area: 'Recursos Humanos',
    daysAgo: 3,
    description:
      'Um diretor faz insinuações e cantadas para uma colaboradora do meu time. Ela relatou constrangimento, coação sexual e medo de retaliação por parte do superior. Estou registrando com autorização dela. O comportamento acontece em reuniões individuais e em viagens de trabalho.',
    involved: 'Diretor de operações e uma analista do time.',
    timeline: [
      { kind: 'status', to: 'Em triagem', hours: 2, author: 'Marina Alves' },
      { kind: 'note', body: 'Denunciante identificada. Contato protegido e restrito ao Compliance. Acolhimento iniciado.', hours: 4, author: 'Marina Alves' },
      { kind: 'status', to: 'Em análise', hours: 20, author: 'Marina Alves' },
      { kind: 'message', body: 'Recebemos seu relato e acionamos o protocolo de acolhimento. O acesso ao seu contato é restrito ao Compliance e nenhuma medida será tomada sem revisão humana.', hours: 22, author: 'Equipe de Compliance' },
    ],
  },
  {
    protocol: 'CS-2026-00010',
    accessCode: 'DEMO0010',
    modality: 'anonima',
    category: 'Outras irregularidades',
    urgency: 'Baixo',
    status: 'Recebida',
    area: null,
    daysAgo: 1,
    description:
      'Algumas pessoas usam o estacionamento reservado a visitantes todos os dias, ocupando as vagas de clientes. Pedi orientação ao setor responsável e não obtive resposta. Ocorre no estacionamento da unidade Centro.',
    involved: 'Não sei identificar as pessoas.',
    timeline: [],
  },
];

const AUDIT_SEED = [
  { user: 'Marina Alves', role: 'compliance', action: 'Visualizou a denúncia', protocol: 'CS-2026-00003', hoursAgo: 2 },
  { user: 'Marina Alves', role: 'compliance', action: 'Alterou o status', protocol: 'CS-2026-00004', detail: 'De “Em análise” para “Encaminhada”', hoursAgo: 20 },
  { user: 'Rafael Lima', role: 'gestor', action: 'Visualizou a denúncia', protocol: 'CS-2026-00005', hoursAgo: 110 },
  { user: 'Helena Costa', role: 'auditoria', action: 'Visualizou metadados da denúncia', protocol: 'CS-2026-00002', hoursAgo: 60 },
  { user: 'Marina Alves', role: 'compliance', action: 'Respondeu ao denunciante', protocol: 'CS-2026-00001', hoursAgo: 50 },
  { user: 'Helena Costa', role: 'auditoria', action: 'Consultou o log de acessos', hoursAgo: 30, detail: 'Exportação de metadados para auditoria trimestral' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const areaIds = {};
    for (const name of AREAS) {
      const result = await client.query(
        `INSERT INTO areas (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [name],
      );
      areaIds[name] = result.rows[0].id;
    }

    const passwordHash = hashPassword(DEMO_PASSWORD);
    const users = [
      { name: 'Marina Alves', email: 'compliance@canalseguro.exemplo', role: 'compliance', area: null },
      { name: 'Rafael Lima', email: 'gestor.rh@canalseguro.exemplo', role: 'gestor', area: 'Recursos Humanos' },
      { name: 'Helena Costa', email: 'auditoria@canalseguro.exemplo', role: 'auditoria', area: null },
    ];

    const userIds = {};
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (name, email, role, area_id, password_hash)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role,
           area_id = EXCLUDED.area_id, password_hash = EXCLUDED.password_hash
         RETURNING id`,
        [user.name, user.email, user.role, user.area ? areaIds[user.area] : null, passwordHash],
      );
      userIds[user.email] = result.rows[0].id;
    }

    const existing = await client.query('SELECT count(*)::int AS count FROM reports');
    if (existing.rows[0].count === 0) {
      for (const sample of REPORTS) {
        const base = new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000);
        base.setHours(9, 20, 0, 0);
        const analysis = analyzeReport({
          description: sample.description,
          involved: sample.involved,
          selectedCategory: sample.category,
        });

        const inserted = await client.query(
          `INSERT INTO reports (
             protocol, access_code_hash, modality, reporter_name, contact_preference, contact_value,
             description, involved, category, urgency, status, area_id,
             ai_category, ai_category_confidence, ai_urgency, ai_area, ai_imminent_risk,
             ai_sensitive_flags, ai_confirmed, created_at, updated_at
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
           RETURNING id`,
          [
            sample.protocol,
            hashAccessCode(sample.accessCode),
            sample.modality,
            sample.reporterName || null,
            sample.contactPreference || null,
            sample.contactValue || null,
            sample.description,
            sample.involved || null,
            sample.category,
            sample.urgency,
            sample.status,
            sample.area ? areaIds[sample.area] : null,
            analysis.suggestedCategory,
            analysis.confidence,
            sample.aiUrgency || analysis.urgency,
            analysis.area,
            analysis.imminentRisk,
            JSON.stringify(analysis.sensitiveAlerts),
            sample.area ? true : false,
            base,
            sample.timeline.length ? hoursFrom(base, sample.timeline[sample.timeline.length - 1].hours) : base,
          ],
        );

        const reportId = inserted.rows[0].id;

        await client.query(
          `INSERT INTO report_events (report_id, kind, to_status, body, author_label, visibility, created_at)
           VALUES ($1, 'opened', 'Recebida', $2, 'Denunciante', 'reporter', $3)`,
          [reportId, 'Denúncia registrada com sucesso. Protocolo gerado automaticamente.', base],
        );

        for (const event of sample.timeline) {
          const at = hoursFrom(base, event.hours);
          const author = event.author || 'Equipe de Compliance';
          const visibility = event.kind === 'note' ? 'internal' : 'reporter';
          await client.query(
            `INSERT INTO report_events (report_id, kind, from_status, to_status, body, author_label, visibility, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              reportId,
              event.kind === 'forward' ? 'forward' : event.kind,
              event.from || null,
              event.to || null,
              event.body || null,
              author,
              visibility,
              at,
            ],
          );
        }
      }

      await client.query(`SELECT setval('report_protocol_seq', ${REPORTS.length}, true)`);
    }

    const logCount = await client.query('SELECT count(*)::int AS count FROM audit_logs');
    if (logCount.rows[0].count === 0) {
      for (const log of AUDIT_SEED) {
        await client.query(
          `INSERT INTO audit_logs (user_id, user_label, role, action, report_protocol, detail, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            Object.values(userIds)[0] || null,
            log.user,
            log.role,
            log.action,
            log.protocol || null,
            log.detail || null,
            new Date(Date.now() - log.hoursAgo * 60 * 60 * 1000),
          ],
        );
      }
    }

    await client.query('COMMIT');
    console.log('[db] dados de exemplo garantidos');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[db] falha ao popular dados:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
