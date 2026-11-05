import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatDateTime, statusTone, urgencyTone } from '../../lib/format';
import { Alert, Badge, BarChart, Loading } from '../../components/UI';
import { AlertTriangleIcon, ShieldAlertIcon, SparklesIcon } from '../../components/Icons';
import { OCCURRENCE_TYPES, STATUSES, URGENCIES } from '../../../shared/catalog';

const urgencyBarTone = {
  'Prioridade Máxima': 'red',
  Alto: 'orange',
  Médio: 'amber',
  Baixo: 'slate',
};

const statusBarTone = {
  Recebida: 'navy',
  'Em triagem': 'slate',
  'Em análise': 'amber',
  Encaminhada: 'navy',
  Concluída: 'green',
  Arquivada: 'slate',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api('/panel/summary')
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loading label="Carregando indicadores…" />;
  if (error) return <Alert tone="danger" title="Não foi possível carregar o dashboard">{error}</Alert>;
  if (!data) return null;

  return (
    <>
      <div className="panel-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Visão agregada e anonimizada das denúncias. Nenhum dado pessoal é exibido nos gráficos.</p>
        </div>
        <span className="panel-tag"><SparklesIcon size={14} /> IA apenas sugere</span>
      </div>

      {user?.role === 'gestor' ? (
        <div style={{ marginBottom: 18 }}>
          <Alert tone="info" title="Escopo do perfil Gestor de área">
            Você vê apenas denúncias encaminhadas à área {user.area} e nunca a identidade de quem
            optou pelo anonimato.
          </Alert>
        </div>
      ) : null}

      {user?.role === 'auditoria' ? (
        <div style={{ marginBottom: 18 }}>
          <Alert tone="warn" title="Escopo do perfil Auditoria/Segurança da Informação">
            Este perfil acessa apenas logs e metadados agregados. O conteúdo das denúncias não é exibido.
          </Alert>
        </div>
      ) : null}

      <div className="stat-grid" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-label">Total de denúncias</div>
          <div className="stat-value">{data.total}</div>
          <div className="stat-foot">No escopo do seu perfil</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Em acompanhamento</div>
          <div className="stat-value">{data.active}</div>
          <div className="stat-foot">Recebidas, em triagem, análise ou encaminhadas</div>
        </div>
        <div className="stat-card" data-tone="red">
          <div className="stat-label">Prioridade Máxima</div>
          <div className="stat-value">{data.maxPriorityOpen}</div>
          <div className="stat-foot">Casos abertos com alerta de plantão</div>
        </div>
        <div className="stat-card" data-tone="green">
          <div className="stat-label">Concluídas</div>
          <div className="stat-value">{data.concluded}</div>
          <div className="stat-foot">Encerradas com decisão humana</div>
        </div>
      </div>

      {data.alerts.length > 0 ? (
        <div className="panel-alert" style={{ marginBottom: 18 }}>
          <ShieldAlertIcon size={22} />
          <div>
            <strong>Alerta de plantão: {data.alerts.length} caso(s) em Prioridade Máxima</strong>
            <p>Acione a equipe humana de plantão e registre o responsável pela revisão.</p>
          </div>
          <Link to="/painel/denuncias?urgency=Prioridade%20M%C3%A1xima" className="btn btn-danger btn-sm">
            Ver casos
          </Link>
        </div>
      ) : null}

      <div className="panel-grid-2" style={{ marginBottom: 18 }}>
        <BarChart
          title="Por nível de urgência"
          note="Sugestão inicial da IA, confirmada ou alterada por uma pessoa."
          data={URGENCIES.map((urgency) => ({
            label: urgency,
            value: data.byUrgency[urgency] || 0,
            tone: urgencyBarTone[urgency],
          }))}
        />
        <BarChart
          title="Por status"
          note="Fluxo com revisão humana em cada etapa."
          data={STATUSES.map((status) => ({
            label: status,
            value: data.byStatus[status] || 0,
            tone: statusBarTone[status],
          }))}
        />
      </div>

      <div className="panel-grid-2">
        <BarChart
          title="Por tipo de denúncia"
          note="Dados agregados e anonimizados."
          data={OCCURRENCE_TYPES.map((type) => ({
            label: type.label,
            value: data.byCategory[type.label] || 0,
            tone: 'navy',
          }))}
        />

        <div className="chart-card">
          <h2>Casos em Prioridade Máxima</h2>
          <p>Ordenados do mais recente para o mais antigo.</p>
          {data.alerts.length === 0 ? (
            <p className="chart-empty">Nenhum caso aberto em prioridade máxima.</p>
          ) : (
            <div className="stack-sm">
              {data.alerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={`/painel/denuncias/${alert.id}`}
                  className="card card--flat"
                  style={{ padding: 12, display: 'block', color: 'inherit' }}
                >
                  <div className="cluster" style={{ justifyContent: 'space-between' }}>
                    <strong className="mono" style={{ fontSize: '.85rem' }}>{alert.protocol}</strong>
                    <Badge tone={urgencyTone[alert.urgency]}>{alert.urgency}</Badge>
                  </div>
                  <p className="small muted" style={{ marginTop: 4 }}>{alert.category}</p>
                  <div className="cluster tiny muted" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                    <span>{alert.area || 'Sem área definida'}</span>
                    <span>{formatDateTime(alert.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {data.alerts.length > 0 ? (
            <p className="tiny muted" style={{ marginTop: 12 }}>
              <AlertTriangleIcon size={13} style={{ verticalAlign: '-2px' }} />
              {' '}Toda mudança de status exige registro do responsável humano.
            </p>
          ) : null}
          <div className="cluster tiny muted" style={{ marginTop: 14 }}>
            <span><Badge tone={statusTone.Recebida}>Recebida</Badge></span>
            <span><Badge tone={statusTone['Em análise']}>Em análise</Badge></span>
            <span><Badge tone={statusTone.Concluída}>Concluída</Badge></span>
          </div>
        </div>
      </div>
    </>
  );
}
