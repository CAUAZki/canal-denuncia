import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { formatDateTime, statusTone, urgencyTone } from '../lib/format';
import { Alert, Badge } from '../components/UI';
import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  SearchIcon,
  ShieldIcon,
} from '../components/Icons';

const FLOW = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada'];

function eventTitle(event) {
  if (event.kind === 'opened') return 'Denúncia registrada';
  if (event.kind === 'forward') return 'Encaminhamento para a área responsável';
  if (event.kind === 'message') return 'Resposta da equipe';
  if (event.kind === 'status' && event.toStatus) return `Status atualizado: ${event.toStatus}`;
  return 'Atualização do caso';
}

export default function Track() {
  const [protocol, setProtocol] = useState('');
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setReport(null);

    if (!protocol.trim() || !code.trim()) {
      setError('Informe o protocolo e o código de acesso para consultar.');
      return;
    }

    setLoading(true);
    try {
      const data = await api('/reports/track', {
        method: 'POST',
        body: { protocol: protocol.trim(), code: code.trim() },
      });
      setReport(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const finished = report ? ['Concluída', 'Arquivada'].includes(report.status) : false;
  const currentIndex = report ? FLOW.indexOf(report.status) : -1;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="section-head">
          <span className="eyebrow"><SearchIcon size={14} /> Acompanhar denúncia</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)' }}>Acompanhar denúncia</h1>
          <p>
            Consulte o andamento com o protocolo e o código de acesso recebidos no registro.
            Não é necessário se identificar.
          </p>
        </div>

        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="protocol">Protocolo</label>
              <input
                id="protocol"
                className="input mono"
                value={protocol}
                onChange={(event) => setProtocol(event.target.value.toUpperCase())}
                placeholder="CS-2026-00001"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label htmlFor="code">Código de acesso</label>
              <input
                id="code"
                className="input mono"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="XXXX-XXXX"
                autoComplete="off"
              />
            </div>
          </div>

          {error ? <div style={{ marginTop: 16 }}><Alert tone="danger" title="Consulta não realizada">{error}</Alert></div> : null}

          <div className="wizard-actions" style={{ alignItems: 'center' }}>
            <p className="small muted" style={{ maxWidth: 420 }}>
              Por segurança, a mensagem de erro é sempre a mesma, mesmo que apenas um dos dados esteja incorreto.
            </p>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <SearchIcon size={17} />
              {loading ? 'Consultando…' : 'Consultar denúncia'}
            </button>
          </div>
        </form>

        {!report ? (
          <div className="card card--soft" style={{ marginTop: 22, display: 'grid', gap: 10 }}>
            <strong style={{ color: 'var(--navy-900)' }}>Onde encontro esses dados?</strong>
            <p className="small muted">
              O protocolo tem o formato CS-2026-00001 e o código de acesso foi exibido uma única vez,
              na tela de confirmação do envio. Guarde os dois em local seguro: eles não podem ser recuperados.
            </p>
            <Link to="/denuncia" className="link-arrow">Ainda não registrou? Fazer denúncia →</Link>
          </div>
        ) : null}

        {report ? (
          <div ref={resultRef} style={{ marginTop: 26 }}>
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="cluster" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="tiny muted" style={{ textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Protocolo</span>
                  <h2 className="mono" style={{ fontSize: '1.3rem' }}>{report.protocol}</h2>
                </div>
                <div className="cluster">
                  <Badge tone={statusTone[report.status] || 'slate'}>{report.status}</Badge>
                  <Badge tone={urgencyTone[report.urgency] || 'slate'}>Urgência: {report.urgency}</Badge>
                </div>
              </div>

              <div className="cluster small muted" style={{ marginTop: 12, gap: 18 }}>
                <span><strong style={{ color: 'var(--ink)' }}>Categoria:</strong> {report.category}</span>
                {report.area ? <span><strong style={{ color: 'var(--ink)' }}>Área:</strong> {report.area}</span> : null}
                <span><ClockIcon size={14} style={{ verticalAlign: '-2px' }} /> Registrada em {formatDateTime(report.createdAt)}</span>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.05rem', marginBottom: 16 }}>Linha do tempo</h2>

              <div className="flow" style={{ gridTemplateColumns: `repeat(${FLOW.length}, minmax(0, 1fr))`, marginBottom: 24 }}>
                {FLOW.map((status, index) => {
                  const done = finished || index <= currentIndex;
                  const current = !finished && index === currentIndex;
                  return (
                    <div
                      key={status}
                      className="flow-step"
                      style={{
                        minHeight: 'auto',
                        padding: '12px 12px',
                        borderColor: current ? 'var(--green-600)' : done ? '#c6ebda' : 'var(--line)',
                        background: current ? '#f4fcf8' : done ? '#fbfefc' : '#fff',
                      }}
                    >
                      <span
                        className="flow-step-number"
                        style={{
                          background: done ? 'var(--green-600)' : 'var(--line-strong)',
                          marginBottom: 8,
                        }}
                      >
                        {done && !current ? <CheckIcon size={12} /> : index + 1}
                      </span>
                      <h3 style={{ fontSize: '.8rem' }}>{status}</h3>
                    </div>
                  );
                })}
              </div>

              {finished ? (
                <div style={{ marginBottom: 20 }}>
                  <Badge tone={statusTone[report.status]}>{report.status}</Badge>
                  <p className="small muted" style={{ marginTop: 6 }}>
                    Este caso foi encerrado. As respostas da equipe permanecem disponíveis abaixo.
                  </p>
                </div>
              ) : null}

              <ul className="timeline">
                {report.timeline.map((event, index) => (
                  <li className="timeline-item" key={`${event.kind}-${index}`}>
                    <span className="timeline-dot" data-tone={event.kind === 'message' ? 'green' : 'navy'}>
                      {event.kind === 'message' ? <CheckCircleIcon size={14} /> : <ShieldIcon size={13} />}
                    </span>
                    <div className="timeline-body">
                      <h3>{eventTitle(event)}</h3>
                      {event.body ? <p>{event.body}</p> : null}
                      {event.toStatus && event.kind === 'status' ? (
                        <p className="small muted">Novo status: {event.toStatus}</p>
                      ) : null}
                      <div className="timeline-time">{formatDateTime(event.at)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Alert tone="info" title="Sobre o acompanhamento">
              As respostas exibidas aqui são registradas pela equipe responsável. Nenhuma decisão é
              tomada automaticamente pela IA: toda mudança de status passa por revisão humana.
            </Alert>
          </div>
        ) : null}
      </div>
    </section>
  );
}
