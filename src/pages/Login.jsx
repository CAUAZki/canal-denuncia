import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UI';
import { LockIcon, ShieldIcon } from '../components/Icons';

const demoAccounts = [
  { email: 'compliance@canalseguro.exemplo', label: 'Compliance/Ouvidoria — acesso completo' },
  { email: 'gestor.rh@canalseguro.exemplo', label: 'Gestor de área — Recursos Humanos' },
  { email: 'auditoria@canalseguro.exemplo', label: 'Auditoria — logs e metadados' },
];

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/painel';

  useEffect(() => {
    document.title = 'Área restrita — Canal Seguro IA';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate('/painel', { replace: true });
  }, [user, loading, navigate]);

  function fillDemo(accountEmail) {
    setEmail(accountEmail);
    setPassword('Demo@2026');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha para entrar.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div>
          <Link to="/" className="brand" style={{ color: '#fff' }}>
            <span className="brand-mark"><ShieldIcon size={22} /></span>
            <span className="brand-text">
              <span className="brand-name">Canal Seguro IA</span>
              <span className="brand-sub">Área restrita</span>
            </span>
          </Link>
          <h1>Painel de apuração com acesso por perfil</h1>
          <p>
            Compliance/Ouvidoria, gestores de área e auditoria acessam apenas o que a função permite.
            Todo acesso é registrado em log.
          </p>
          <ul>
            <li><LockIcon size={16} /> Denunciantes anônimos nunca são identificados.</li>
            <li><LockIcon size={16} /> Gestor vê apenas denúncias da própria área.</li>
            <li><LockIcon size={16} /> Auditoria vê logs e metadados, sem o relato.</li>
            <li><LockIcon size={16} /> A IA sugere; a decisão é sempre humana.</li>
          </ul>
        </div>
        <p className="small" style={{ color: '#8fa5c0' }}>
          Projeto acadêmico, dados fictícios. Não utilize dados reais de pessoas.
        </p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h2>Acessar o painel</h2>
          <p>Entre com suas credenciais institucionais.</p>

          <form className="stack" onSubmit={handleSubmit} noValidate>
            {error ? <Alert tone="danger" title="Não foi possível entrar">{error}</Alert> : null}

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@organizacao.com"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Entrando…' : 'Entrar no painel'}
            </button>
          </form>

          <div className="demo-box">
            <strong>Credenciais de demonstração (dados fictícios)</strong>
            {demoAccounts.map((account) => (
              <button key={account.email} type="button" onClick={() => fillDemo(account.email)}>
                {account.label}
                <span className="mono" style={{ display: 'block', fontSize: '.72rem', color: 'var(--muted)' }}>
                  {account.email} • senha Demo@2026
                </span>
              </button>
            ))}
          </div>

          <p className="small muted" style={{ marginTop: 18 }}>
            <Link to="/">← Voltar ao canal público</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
