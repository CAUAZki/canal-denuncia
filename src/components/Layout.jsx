import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LockIcon, MenuIcon, CloseIcon, ShieldIcon } from './Icons';

const navItems = [
  { to: '/', label: 'Início', end: true },
  { to: '/denuncia', label: 'Fazer denúncia' },
  { to: '/acompanhar', label: 'Acompanhar denúncia' },
  { to: '/privacidade', label: 'Privacidade e LGPD' },
  { to: '/faq', label: 'FAQ' },
];

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname]);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Canal Seguro IA — página inicial">
            <span className="brand-mark"><ShieldIcon size={22} /></span>
            <span className="brand-text">
              <span className="brand-name">Canal Seguro IA</span>
              <span className="brand-sub">Canal de denúncias</span>
            </span>
          </Link>

          <nav className={`site-nav${open ? ' open' : ''}`} aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/painel/login" className="nav-login-mobile">Área restrita</NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/painel/login" className="header-login">Área restrita</Link>
            <Link to="/denuncia" className="btn btn-primary btn-sm">
              <LockIcon size={16} />
              <span>Denúncia sigilosa</span>
            </Link>
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <span className="brand-mark"><ShieldIcon size={20} /></span>
                <strong>Canal Seguro IA</strong>
              </div>
              <p>
                Canal de denúncias confidencial de uma organização fictícia. Registro com anonimato,
                privacidade por padrão e apoio responsável de Inteligência Artificial.
              </p>
              <div className="footer-disclaimer" style={{ marginTop: 16 }}>
                <LockIcon size={14} />
                <span>Conteúdo confidencial. Acesso restrito por perfil e registrado em log de auditoria.</span>
              </div>
            </div>
            <div>
              <h3>Canal</h3>
              <ul>
                <li><Link to="/denuncia">Fazer denúncia</Link></li>
                <li><Link to="/acompanhar">Acompanhar denúncia</Link></li>
                <li><Link to="/privacidade">Privacidade e LGPD</Link></li>
                <li><Link to="/faq">Perguntas frequentes</Link></li>
              </ul>
            </div>
            <div>
              <h3>Transparência</h3>
              <ul>
                <li><Link to="/privacidade#limites-ia">Limites da IA</Link></li>
                <li><Link to="/painel/login">Área restrita</Link></li>
                <li><span>Projeto acadêmico, dados fictícios</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Canal Seguro IA — organização fictícia. Todos os dados exibidos são fictícios.</span>
            <span>Projeto acadêmico, dados fictícios.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
