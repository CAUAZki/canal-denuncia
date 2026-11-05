import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatDateTime, statusTone, urgencyTone } from '../../lib/format';
import { Alert, Badge, Loading } from '../../components/UI';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  HistoryIcon,
  InfoIcon,
  LockIcon,
  NoteIcon,
  PaperclipIcon,
  SendIcon,
  ShieldAlertIcon,
  SparklesIcon,
} from '../../components/Icons';
import {
  AREAS,
  OCCURRENCE_LABELS,
  STATUSES,
  URGENCIES,
} from '../../../shared/catalog';

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

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);

  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [forwardForm, setForwardForm] = useState({ area: '', note: '' });
  const [aiForm, setAiForm] = useState({ category: '', urgency: '', area: '' });
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError('');
    try {
      const result = await api(`/panel/reports/${id}`);
      setData(result);
      if (!result.restricted) {
        setStatusForm((current) => ({ ...current, status: result.report.status }));
        setForwardForm((current) => ({
          ...current,
          area: result.report.area || result.report.ai.area || '',
        }));
        setAiForm({
          category: result.report.category,
          urgency: result.report.urgency,
          area: result.report.area || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load(true);
  }, [load]);

  async function submitAction(path, body, successText, after) {
    setBusy(true);
    setFeedback(null);
    try {
      await api(`/panel/reports/${id}/${path}`, { method: 'POST', body });
      await load(false);
      setFeedback({ tone: 'success', title: 'Ação registrada', text: successText });
      if (after) after();
    } catch (err) {
      setFeedback({ tone: 'danger', title: 'Não foi possível concluir', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (loading && !data) return <Loading label="Carregando denúncia…" />;

  if (error && !data) {
    return (
      <>
        <div className="panel-topbar">
          <div>
            <Link to="/painel/denuncias" className="small">← Voltar para denúncias</Link>
            <h1>Denúncia</h1>
          </div>
        </div>
        <Alert tone="danger" title="Acesso não realizado">{error}</Alert>
      </>
    );
  }

  if (!data) return null;

  const { report, events, auditLogs, restricted } = data;
  const isAuditoria = restricted || user?.role === 'auditoria';
  const isOpen = !['Concluída', 'Arquivada'].includes(report.status);

  return (
    <>
      <div className="panel-topbar">
        <div>
          <Link to="/painel/denuncias" className="small">← Voltar para denúncias</Link>
          <h1 className="mono" style={{ marginTop: 4 }}>{report.protocol}</h1>
          <p>{report.category} • Registrada em {formatDateTime(report.createdAt)}</p>
        </div>
        <div className="cluster">
          {report.urgency === 'Prioridade Máxima' ? <Badge tone="solid-red">Prioridade Máxima</Badge> : null}
          <Badge tone={statusTone[report.status] || 'slate'}>{report.status}</Badge>
          <Badge tone={urgencyTone[report.urgency] || 'slate'}>{report.urgency}</Badge>
        </div>
      </div>

      {report.urgency === 'Prioridade Máxima' && isOpen ? (
        <div className="panel-alert" style={{ marginBottom: 16 }}>
          <ShieldAlertIcon size={22} />
          <div>
            <strong>Alerta de plantão — Prioridade Máxima</strong>
            <p>
              A IA identificou sinais de risco iminente ou gravidade elevada. Acione a equipe humana
              de plantão e registre quem assumiu a revisão.
            </p>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={feedback.tone} title={feedback.title}>{feedback.text}</Alert>
        </div>
      ) : null}

      {isAuditoria ? (
        <>
          <Alert tone="warn" title="Perfil Auditoria/Segurança da Informação">
            Você acessa apenas metadados, histórico de alterações e logs. O conteúdo do relato,
            das pessoas envolvidas e das mensagens não é exibido.
          </Alert>

          <div className="detail-grid" style={{ marginTop: 18 }}>
            <section className="detail-section">
              <h2>Histórico de alterações (metadados)</h2>
              <p className="section-note">Sem conteúdo de relato ou de respostas.</p>
              <div className="event-list">
                {events.map((event, index) => (
                  <div className="event-item" key={`${event.kind}-${index}`}>
                    <div className="event-head">
                      <strong>
                        <span className="event-tag" data-kind={event.kind}>{eventTagLabels[event.kind] || event.kind}</span>{' '}
                        {eventLabels[event.kind] || 'Atualização'}
                        {event.toStatus ? ` — ${event.toStatus}` : ''}
                      </strong>
                      <time>{formatDateTime(event.at)}</time>
                    </div>
                    <p className="tiny muted">Responsável: {event.author}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="stack">
              <section className="detail-section">
                <h2>Metadados da denúncia</h2>
                <dl className="meta-grid" style={{ marginTop: 12 }}>
                  <div><dt>Protocolo</dt><dd className="mono">{report.protocol}</dd></div>
                  <div><dt>Modalidade</dt><dd>{report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</dd></div>
                  <div><dt>Tipo</dt><dd>{report.category}</dd></div>
                  <div><dt>Urgência</dt><dd>{report.urgency}</dd></div>
                  <div><dt>Status</dt><dd>{report.status}</dd></div>
                  <div><dt>Área</dt><dd>{report.area || 'Não definida'}</dd></div>
                  <div><dt>Registrada em</dt><dd>{formatDateTime(report.createdAt)}</dd></div>
                  <div><dt>Atualizada em</dt><dd>{formatDateTime(report.updatedAt)}</dd></div>
                </dl>
              </section>

              <section className="detail-section">
                <h2><HistoryIcon size={16} style={{ verticalAlign: '-3px' }} /> Log de acessos</h2>
                <p className="section-note">Somente leitura.</p>
                <div className="stack-sm">
                  {auditLogs.map((log, index) => (
                    <div key={`${log.at}-${index}`} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                      <div className="small"><strong>{log.user}</strong> — {log.action}</div>
                      <div className="tiny muted">{log.role || '—'} • {formatDateTime(log.at)}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : (
        <div className="detail-grid">
          <div className="stack">
            <section className="ai-panel">
              <div className="cluster" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2><SparklesIcon size={17} /> Sugestão da IA</h2>
                <Badge tone={report.ai.confirmed ? 'green' : 'amber'}>
                  {report.ai.confirmed ? 'Confirmada por humano' : 'Aguardando revisão humana'}
                </Badge>
              </div>
              <p className="tiny muted" style={{ marginTop: 4 }}>
                Gerada automaticamente. Não é decisão, não altera status e pode ser confirmada ou
                alterada por uma pessoa.
              </p>

              <div className="ai-grid">
                <div className="ai-cell">
                  <span>Tipo sugerido</span>
                  <strong>{report.ai.category || '—'}</strong>
                  {report.ai.confidence ? <span className="tiny muted">{report.ai.confidence}% de confiança</span> : null}
                </div>
                <div className="ai-cell">
                  <span>Urgência sugerida</span>
                  <strong>{report.ai.urgency || '—'}</strong>
                </div>
                <div className="ai-cell">
                  <span>Área sugerida</span>
                  <strong>{report.ai.area || '—'}</strong>
                </div>
              </div>

              {report.ai.imminentRisk ? (
                <div style={{ marginTop: 12 }}>
                  <Alert tone="danger" title="Sinal de risco iminente">
                    O texto contém linguagem associada a risco à integridade. A IA marcou o caso como
                    Prioridade Máxima para alerta humano. Nenhuma medida é automática.
                  </Alert>
                </div>
              ) : null}

              {report.ai.sensitiveAlerts?.length > 0 ? (
                <div style={{ marginTop: 12 }}>
                  <Alert tone="warn" title="Possíveis dados sensíveis no relato">
                    <ul>
                      {report.ai.sensitiveAlerts.map((alert) => (
                        <li key={alert.key}><strong>{alert.label}:</strong> {alert.recommendation}</li>
                      ))}
                    </ul>
                  </Alert>
                </div>
              ) : null}

              <div className="ai-actions">
                <button
                  type="button"
                  className="btn btn-navy btn-sm"
                  disabled={busy}
                  onClick={() => submitAction(
                    'ai-decision',
                    { accept: true },
                    `Sugestão da IA confirmada por ${user.name}.`,
                  )}
                >
                  Confirmar sugestão da IA
                </button>
                <span className="tiny muted" style={{ alignSelf: 'center' }}>
                  A confirmação registra seu nome no histórico.
                </span>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #dbe7f5' }}>
                <p className="tiny" style={{ fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8 }}>
                  Ou altere a classificação antes de confirmar:
                </p>
                <div className="grid grid-3">
                  <div className="field">
                    <label htmlFor="ai-category" className="tiny">Tipo</label>
                    <select
                      id="ai-category"
                      className="select"
                      value={aiForm.category}
                      onChange={(event) => setAiForm((current) => ({ ...current, category: event.target.value }))}
                    >
                      {OCCURRENCE_LABELS.map((label) => <option key={label} value={label}>{label}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ai-urgency" className="tiny">Urgência</label>
                    <select
                      id="ai-urgency"
                      className="select"
                      value={aiForm.urgency}
                      onChange={(event) => setAiForm((current) => ({ ...current, urgency: event.target.value }))}
                    >
                      {URGENCIES.map((urgency) => <option key={urgency} value={urgency}>{urgency}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ai-area" className="tiny">Área</label>
                    <select
                      id="ai-area"
                      className="select"
                      value={aiForm.area}
                      onChange={(event) => setAiForm((current) => ({ ...current, area: event.target.value }))}
                    >
                      <option value="">Não definida</option>
                      {AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 8 }}
                  disabled={busy}
                  onClick={() => submitAction(
                    'ai-decision',
                    { accept: false, category: aiForm.category, urgency: aiForm.urgency, area: aiForm.area },
                    `Classificação alterada por ${user.name}: ${aiForm.category}, urgência ${aiForm.urgency}.`,
                  )}
                >
                  Salvar classificação
                </button>
              </div>
            </section>

            <section className="detail-section">
              <h2>Relato</h2>
              <p className="section-note">Conteúdo integral enviado pelo denunciante.</p>
              <p className="report-text">{report.description}</p>

              <h3 style={{ fontSize: '.92rem', marginTop: 20, marginBottom: 6 }}>Pessoas envolvidas</h3>
              <p className="report-text small">{report.involved || 'Não informado.'}</p>

              {report.attachment ? (
                <div className="card card--soft" style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <span className="small" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <PaperclipIcon size={16} /> {report.attachment.filename}
                  </span>
                  <a
                    className="btn btn-outline btn-sm"
                    href={`/api/panel/reports/${report.id}/attachment`}
                  >
                    Baixar anexo
                  </a>
                </div>
              ) : null}

              {report.ai.sensitiveAlerts?.length > 0 ? (
                <div style={{ marginTop: 16 }}>
                  <Alert tone="neutral" title="Atenção para dados desnecessários">
                    Este relato contém possíveis dados sensíveis. Evite reproduzi-los em respostas ou
                    relatórios e solicite remoção ao denunciante, se possível.
                  </Alert>
                </div>
              ) : null}
            </section>

            <section className="detail-section">
              <h2>Histórico de alterações</h2>
              <p className="section-note">Somente leitura. Cada ação registra o responsável humano.</p>

              <div className="event-list">
                {events.map((event, index) => (
                  <div className="event-item" key={`${event.kind}-${index}`} data-visibility={event.visibility}>
                    <div className="event-head">
                      <strong>
                        <span className="event-tag" data-kind={event.kind}>{eventTagLabels[event.kind] || event.kind}</span>{' '}
                        {eventLabels[event.kind] || 'Atualização'}
                        {event.kind === 'status' && event.toStatus ? `: ${event.fromStatus || '—'} → ${event.toStatus}` : ''}
                      </strong>
                      <time>{formatDateTime(event.at)}</time>
                    </div>
                    {event.body ? <p>{event.body}</p> : null}
                    <p className="tiny muted">
                      Responsável: {event.author}
                      {event.visibility === 'reporter' ? ' • visível ao denunciante' : ' • interno'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="stack">
            <section className="detail-section">
              <h2>Dados da denúncia</h2>
              <dl className="meta-grid" style={{ marginTop: 12 }}>
                <div><dt>Protocolo</dt><dd className="mono">{report.protocol}</dd></div>
                <div><dt>Modalidade</dt><dd>{report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</dd></div>
                <div>
                  <dt>Identificação</dt>
                  <dd>
                    {report.modality === 'identificada'
                      ? (report.reporter?.name || 'Nome não informado')
                      : 'Anônima — sem dados identificadores'}
                  </dd>
                </div>
                <div>
                  <dt>Contato</dt>
                  <dd>
                    {report.reporter?.contactPreference
                      ? `${report.reporter.contactPreference === 'email' ? 'E-mail' : 'WhatsApp'}: ${report.reporter.contactValue}`
                      : 'Não informado'}
                  </dd>
                </div>
                <div><dt>Área responsável</dt><dd>{report.area || 'Não definida'}</dd></div>
                <div><dt>Status</dt><dd>{report.status}</dd></div>
                <div><dt>Registrada em</dt><dd>{formatDateTime(report.createdAt)}</dd></div>
                <div><dt>Atualizada em</dt><dd>{formatDateTime(report.updatedAt)}</dd></div>
              </dl>
              {report.modality === 'anonima' ? (
                <p className="tiny muted" style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <LockIcon size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  Denúncia anônima: nenhum dado de identificação existe ou pode ser recuperado — nem
                  pela IA, nem por gestores de área.
                </p>
              ) : (
                <p className="tiny muted" style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <InfoIcon size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  Dados de contato restritos à apuração. Não reproduza em relatórios agregados.
                </p>
              )}
            </section>

            <section className="detail-section">
              <h2>Alterar status</h2>
              <p className="section-note">Responsável registrado: {user.name}</p>
              <div className="form-inline">
                <label htmlFor="new-status">Novo status</label>
                <select
                  id="new-status"
                  className="select"
                  value={statusForm.status}
                  onChange={(event) => setStatusForm((current) => ({ ...current, status: event.target.value }))}
                >
                  {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <textarea
                  className="textarea"
                  style={{ minHeight: 70 }}
                  placeholder="Observação interna (opcional)"
                  maxLength={2000}
                  value={statusForm.note}
                  onChange={(event) => setStatusForm((current) => ({ ...current, note: event.target.value }))}
                />
                <button
                  type="button"
                  className="btn btn-navy btn-sm"
                  disabled={busy}
                  onClick={() => submitAction(
                    'status',
                    { status: statusForm.status, note: statusForm.note },
                    `Status atualizado para “${statusForm.status}”. O responsável humano ficou registrado.`,
                    () => setStatusForm((current) => ({ ...current, note: '' })),
                  )}
                >
                  Atualizar status
                </button>
                <p className="tiny muted">
                  Arquivar ou concluir exige esta ação humana — a IA nunca encerra um caso.
                </p>
              </div>
            </section>

            <section className="detail-section">
              <h2>Encaminhar para área</h2>
              <div className="form-inline">
                <label htmlFor="forward-area">Área responsável</label>
                <select
                  id="forward-area"
                  className="select"
                  value={forwardForm.area}
                  onChange={(event) => setForwardForm((current) => ({ ...current, area: event.target.value }))}
                >
                  <option value="">Selecione a área</option>
                  {AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
                </select>
                <textarea
                  className="textarea"
                  style={{ minHeight: 64 }}
                  placeholder="Observação interna (opcional)"
                  value={forwardForm.note}
                  onChange={(event) => setForwardForm((current) => ({ ...current, note: event.target.value }))}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={busy || !forwardForm.area}
                  onClick={() => submitAction(
                    'forward',
                    { area: forwardForm.area, note: forwardForm.note },
                    `Denúncia encaminhada para ${forwardForm.area}. Status alterado para “Encaminhada”.`,
                    () => setForwardForm((current) => ({ ...current, note: '' })),
                  )}
                >
                  <ArrowRightIcon size={15} />
                  Encaminhar
                </button>
              </div>
            </section>

            <section className="detail-section">
              <h2>Responder ao denunciante</h2>
              <p className="section-note">A resposta aparece na consulta por protocolo e código.</p>
              <div className="form-inline">
                <textarea
                  className="textarea"
                  style={{ minHeight: 84 }}
                  placeholder="Escreva uma resposta clara, sem dados de terceiros."
                  maxLength={4000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busy || message.trim().length < 2}
                  onClick={() => submitAction(
                    'messages',
                    { body: message },
                    'Resposta enviada ao denunciante e registrada no histórico.',
                    () => setMessage(''),
                  )}
                >
                  <SendIcon size={15} />
                  Enviar resposta
                </button>
              </div>
            </section>

            <section className="detail-section">
              <h2>Observação interna</h2>
              <p className="section-note">Visível apenas para a equipe. Não aparece ao denunciante.</p>
              <div className="form-inline">
                <textarea
                  className="textarea"
                  style={{ minHeight: 74 }}
                  placeholder="Registre procedimentos, contatos e próximos passos."
                  maxLength={4000}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={busy || note.trim().length < 2}
                  onClick={() => submitAction(
                    'notes',
                    { body: note },
                    'Observação interna registrada no histórico.',
                    () => setNote(''),
                  )}
                >
                  <NoteIcon size={15} />
                  Salvar observação
                </button>
              </div>
            </section>

            <section className="detail-section">
              <h2><HistoryIcon size={16} style={{ verticalAlign: '-3px' }} /> Log de acessos</h2>
              <p className="section-note">Somente leitura — data, hora, usuário e ação.</p>
              <div className="stack-sm">
                {auditLogs.length === 0 ? (
                  <p className="small muted">Nenhum acesso registrado.</p>
                ) : auditLogs.map((log, index) => (
                  <div key={`${log.at}-${index}`} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                    <div className="small"><strong>{log.user}</strong> — {log.action}</div>
                    <div className="tiny muted">{log.role || '—'} • {formatDateTime(log.at)}</div>
                    {log.detail ? <div className="tiny muted">{log.detail}</div> : null}
                  </div>
                ))}
              </div>
              <p className="tiny muted" style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <AlertTriangleIcon size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                Todo acesso ao conteúdo é registrado e pode ser auditado.
              </p>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
