import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatDate, formatDateTime, statusTone, urgencyTone } from '../../lib/format';
import { Alert, Badge, EmptyState, Loading } from '../../components/UI';
import { AlertTriangleIcon, ShieldAlertIcon } from '../../components/Icons';
import { OCCURRENCE_TYPES, STATUSES, URGENCIES } from '../../../shared/catalog';

const emptyFilters = { status: '', category: '', urgency: '', from: '', to: '' };

export default function ReportList() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    urgency: searchParams.get('urgency') || '',
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    setLoading(true);
    setError('');
    api(`/panel/reports${params.toString() ? `?${params.toString()}` : ''}`, { signal: controller.signal })
      .then((data) => setReports(data.reports))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters]);

  const urgentCount = useMemo(
    () => reports.filter((report) => report.urgency === 'Prioridade Máxima').length,
    [reports],
  );

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <div className="panel-topbar">
        <div>
          <h1>Denúncias</h1>
          <p>Casos ordenados por urgência e data. Prioridade Máxima aparece sempre no topo.</p>
        </div>
        <span className="panel-tag">{reports.length} registro(s)</span>
      </div>

      {urgentCount > 0 ? (
        <div className="panel-alert" style={{ marginBottom: 16 }}>
          <ShieldAlertIcon size={22} />
          <div>
            <strong>{urgentCount} denúncia(s) em Prioridade Máxima nesta lista</strong>
            <p>Alerta de plantão: acione a equipe humana e registre quem assumiu a revisão.</p>
          </div>
        </div>
      ) : null}

      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="filter-status">Status</label>
          <select id="filter-status" className="select" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option value="">Todos</option>
            {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-category">Tipo</label>
          <select id="filter-category" className="select" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">Todos</option>
            {OCCURRENCE_TYPES.map((type) => <option key={type.key} value={type.label}>{type.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-urgency">Urgência</label>
          <select id="filter-urgency" className="select" value={filters.urgency} onChange={(event) => updateFilter('urgency', event.target.value)}>
            <option value="">Todas</option>
            {URGENCIES.map((urgency) => <option key={urgency} value={urgency}>{urgency}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-from">De</label>
          <input id="filter-from" type="date" className="input" value={filters.from} onChange={(event) => updateFilter('from', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="filter-to">Até</label>
          <input id="filter-to" type="date" className="input" value={filters.to} onChange={(event) => updateFilter('to', event.target.value)} />
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilters(emptyFilters)}>
          Limpar filtros
        </button>
      </div>

      {error ? <Alert tone="danger" title="Não foi possível carregar a lista">{error}</Alert> : null}

      {loading ? (
        <Loading label="Carregando denúncias…" />
      ) : (
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Tipo de ocorrência</th>
                  <th>Urgência</th>
                  <th>Status</th>
                  <th>Área</th>
                  <th>Modalidade</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className={report.urgency === 'Prioridade Máxima' ? 'row-urgent' : ''}>
                    <td>
                      <Link to={`/painel/denuncias/${report.id}`} className="mono">
                        {report.protocol}
                      </Link>
                      {report.hasAttachment ? <span className="tiny muted" style={{ display: 'block' }}>com anexo</span> : null}
                    </td>
                    <td>{report.category}</td>
                    <td><Badge tone={urgencyTone[report.urgency] || 'slate'}>{report.urgency}</Badge></td>
                    <td><Badge tone={statusTone[report.status] || 'slate'}>{report.status}</Badge></td>
                    <td>{report.area || <span className="muted">Não definida</span>}</td>
                    <td>{report.modality === 'identificada' ? 'Identificada' : 'Anônima'}</td>
                    <td className="nowrap">
                      <span style={{ display: 'block' }}>{formatDate(report.createdAt)}</span>
                      <span className="tiny muted">{formatDateTime(report.createdAt).slice(-5)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.length === 0 ? (
            <EmptyState title="Nenhuma denúncia encontrada">
              Ajuste os filtros para ampliar a busca. Se o seu perfil é Gestor de área, você vê
              apenas denúncias encaminhadas à sua área.
            </EmptyState>
          ) : null}
        </div>
      )}

      <p className="tiny muted" style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
        <AlertTriangleIcon size={13} />
        Dados agregados e anonimizados. Nunca compartilhe conteúdo de denúncia fora dos canais oficiais.
      </p>
    </>
  );
}
