import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  DashboardIcon,
  HistoryIcon,
  ListIcon,
  LogOutIcon,
  ShieldIcon,
} from '../../components/Icons';

export default function PanelLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const showAudit = user?.role === 'compliance' || user?.role === 'auditoria';

  async function handleLogout() {
    setLeaving(true);
    try {
      await logout();
      navigate('/painel/login', { replace: true });
    } finally {
      setLeaving(false);
    }
  }

  return (
    <div className="panel-shell">
      <aside className="panel-sidebar">
        <Link to="/painel" className="brand" style={{ color: '#fff' }}>
          <span className="brand-mark"><ShieldIcon size={20} /></span>
          <span className="brand-text">
            <span className="brand-name">Canal Seguro IA</span>
            <span className="brand-sub">Painel restrito</span>
          </span>
        </Link>

        <nav className="panel-nav" aria-label="Navegação do painel">
          <NavLink to="/painel" end>
            <DashboardIcon size={17} />
            Dashboard
          </NavLink>
          <NavLink to="/painel/denuncias">
            <ListIcon size={17} />
            Denúncias
          </NavLink>
          {showAudit ? (
            <NavLink to="/painel/auditoria">
              <HistoryIcon size={17} />
              Auditoria
            </NavLink>
          ) : null}
        </nav>

        <div className="panel-sidebar-foot">
          <div className="panel-user">
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.roleLabel}{user?.area ? ` • ${user.area}` : ''}</span>
              <span>{user?.email}</span>
            </div>
            <button type="button" onClick={handleLogout} disabled={leaving}>
              <LogOutIcon size={14} />
              {leaving ? 'Saindo…' : 'Sair'}
            </button>
          </div>
          <Link to="/" className="tiny" style={{ color: '#8fa5c0', display: 'inline-block', marginTop: 8 }}>
            ← Canal público
          </Link>
        </div>
      </aside>

      <main className="panel-main">
        <Outlet />
      </main>
    </div>
  );
}
