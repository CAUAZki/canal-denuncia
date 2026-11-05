import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';
import { Alert, EmptyState, Loading } from '../../components/UI';
import { HistoryIcon } from '../../components/Icons';

export default function AuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/panel/logs?limit=300')
      .then((data) => {
        if (active) setLogs(data.logs);
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

  return (
    <>
      <div className="panel-topbar">
        <div>
          <h1>Auditoria e logs de acesso</h1>
          <p>Registro somente leitura de acessos e alterações. Data, hora, usuário e ação são preservados.</p>
        </div>
        <span className="panel-tag"><HistoryIcon size={14} /> Somente leitura</span>
      </div>

      {user?.role === 'gestor' ? (
        <Alert tone="warn" title="Acesso restrito">
          O perfil Gestor de área não acessa o log de auditoria. Fale com Compliance/Ouvidoria ou
          com Auditoria/Segurança da Informação.
        </Alert>
      ) : null}

      {user?.role !== 'gestor' ? (
        <>
          <Alert tone="info" title="Trilha de auditoria">
            Os registros abaixo apoiam a investigação de acessos indevidos. O conteúdo das denúncias
            não é armazenado neste log: apenas a ação, o protocolo e o responsável.
          </Alert>

          <div className="table-wrap" style={{ marginTop: 16 }}>
            {loading ? (
              <Loading label="Carregando logs…" />
            ) : error ? (
              <div style={{ padding: 16 }}>
                <Alert tone="danger" title="Não foi possível carregar os logs">{error}</Alert>
              </div>
            ) : logs.length === 0 ? (
              <EmptyState title="Nenhum registro de auditoria" />
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Data e hora</th>
                      <th>Usuário</th>
                      <th>Perfil</th>
                      <th>Ação</th>
                      <th>Protocolo</th>
                      <th>Detalhe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={`${log.at}-${index}`}>
                        <td className="nowrap">{formatDateTime(log.at)}</td>
                        <td>{log.user}</td>
                        <td>{log.role || <span className="muted">—</span>}</td>
                        <td>{log.action}</td>
                        <td className="mono">{log.protocol || <span className="muted">—</span>}</td>
                        <td className="small muted">{log.detail || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="tiny muted" style={{ marginTop: 12 }}>
            <Link to="/painel">← Voltar ao dashboard</Link>
          </p>
        </>
      ) : null}
    </>
  );
}
