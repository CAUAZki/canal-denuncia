import { Link } from 'react-router-dom';
import { SearchIcon, ShieldIcon } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
        <span className="icon-badge" style={{ margin: '0 auto 16px' }}><ShieldIcon size={22} /></span>
        <h1 style={{ fontSize: '2rem' }}>Página não encontrada</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 12 }}>
          O endereço acessado não existe neste canal. Volte ao início ou consulte uma denúncia.
        </p>
        <div className="cluster" style={{ justifyContent: 'center', marginTop: 24 }}>
          <Link to="/" className="btn btn-primary">Ir para o início</Link>
          <Link to="/acompanhar" className="btn btn-outline">
            <SearchIcon size={16} />
            Acompanhar denúncia
          </Link>
        </div>
      </div>
    </section>
  );
}
