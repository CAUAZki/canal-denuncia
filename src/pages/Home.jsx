import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeOffIcon,
  FilePlusIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  ScaleIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from '../components/Icons';
import { OCCURRENCE_TYPES } from '../../shared/catalog';

const audience = [
  {
    title: 'Colaboradores',
    description: 'Efetivos, temporários, estagiários e aprendizes de qualquer área ou unidade.',
    icon: <UsersIcon size={20} />,
  },
  {
    title: 'Fornecedores e prestadores',
    description: 'Empresas e profissionais que prestam serviços à organização.',
    icon: <ScaleIcon size={20} />,
  },
  {
    title: 'Clientes e usuários',
    description: 'Quem utiliza nossos produtos, serviços ou canais de atendimento.',
    icon: <MailIcon size={20} />,
  },
  {
    title: 'Terceiros com relação legítima',
    description: 'Parceiros, comunidades e demais pessoas com vínculo legítimo com a organização.',
    icon: <ShieldIcon size={20} />,
  },
];

const notAccepted = [
  'Reclamações comerciais rotineiras sem indício ético.',
  'Denúncias de má-fé, com informações sabidamente falsas ou sem qualquer elemento verificável.',
  'Conteúdo ofensivo sem fundamentação, sem relato de conduta e sem elementos mínimos de apuração.',
];

const flow = [
  { title: 'Orientação de privacidade', text: 'Você entende seus direitos, o anonimato e a LGPD antes de escrever.' },
  { title: 'Registro', text: 'O relato é enviado por um formulário em etapas, com anexo opcional.' },
  { title: 'Triagem', text: 'A equipe recebe o caso com a sugestão de classificação da IA.' },
  { title: 'Protocolo', text: 'Um protocolo único e um código de acesso são gerados.' },
  { title: 'Análise humana', text: 'Pessoas treinadas revisam, confirmam ou alteram a sugestão.' },
  { title: 'Encaminhamento', text: 'A área responsável recebe apenas o necessário para apurar.' },
  { title: 'Acompanhamento', text: 'Você consulta status e respostas com protocolo e código.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow"><ShieldIcon size={14} /> Canal de denúncias • Confidencial</span>
            <h1>Sua denúncia é <em>confidencial</em> e você pode ser anônimo</h1>
            <p className="hero-lead">
              Um espaço seguro para relatar condutas antiéticas, com privacidade por padrão,
              acolhimento e apoio responsável de Inteligência Artificial. A decisão final é sempre humana.
            </p>
            <div className="hero-actions">
              <Link to="/denuncia" className="btn btn-primary">
                <FilePlusIcon size={18} />
                Fazer denúncia
              </Link>
              <Link to="/acompanhar" className="btn btn-ghost-light">
                <SearchIcon size={18} />
                Acompanhar denúncia
              </Link>
            </div>
            <div className="hero-meta">
              <span><EyeOffIcon size={15} /> Anonimato disponível</span>
              <span><ClockIcon size={15} /> Retorno com protocolo</span>
              <span><LockIcon size={15} /> Dados minimizados</span>
            </div>
          </div>

          <aside className="hero-card">
            <h2>Como protegemos você</h2>
            <ul>
              <li>
                <span className="hero-icon"><EyeOffIcon size={17} /></span>
                <span>
                  <strong>Anonimato por padrão</strong>
                  Não pedimos CPF, RG, matrícula, endereço ou dados de saúde.
                </span>
              </li>
              <li>
                <span className="hero-icon"><ScaleIcon size={17} /></span>
                <span>
                  <strong>A IA apenas sugere</strong>
                  Classificação, urgência e área são sugestões — nunca decisões.
                </span>
              </li>
              <li>
                <span className="hero-icon"><LockIcon size={17} /></span>
                <span>
                  <strong>Acesso por função</strong>
                  Cada perfil vê apenas o que precisa para atuar, com log de auditoria.
                </span>
              </li>
            </ul>
            <div className="hero-card-foot">
              <CheckCircleIcon size={15} />
              Nenhuma ação é tomada sem revisão humana.
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Quem pode denunciar</span>
            <h2>Um canal aberto a quem tem relação legítima com a organização</h2>
            <p>
              Você não precisa ser colaborador para relatar uma irregularidade. O canal acolhe
              relatos de diferentes vínculos, sempre com confidencialidade.
            </p>
          </div>
          <div className="grid grid-4">
            {audience.map((item) => (
              <article className="icon-card" key={item.title}>
                <span className="icon-badge icon-badge--navy">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">O que pode ser denunciado</span>
            <h2>Condutas que devem ser relatadas ao canal</h2>
            <p>
              Se a situação envolver risco à integridade física ou psicológica, registre imediatamente.
              O canal identifica sinais de risco iminente e alerta a equipe humana.
            </p>
          </div>
          <div className="grid grid-3">
            {OCCURRENCE_TYPES.map((type) => (
              <article className="icon-card" key={type.key}>
                <span className="icon-badge"><CheckCircleIcon size={19} /></span>
                <h3>{type.label}</h3>
                <p>Relate de forma objetiva o que aconteceu, quando, onde e como.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <div className="section-head" style={{ marginBottom: 24 }}>
                <span className="eyebrow">O que não é aceito</span>
                <h2>Uso responsável do canal</h2>
                <p>
                  O canal é destinado a relatos de conduta ética. Denúncias de má-fé desviam
                  recursos da apuração e podem causar danos a pessoas inocentes.
                </p>
              </div>
              <div className="stack">
                {notAccepted.map((item) => (
                  <div className="card card--soft" key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <AlertTriangleIcon size={18} style={{ color: 'var(--amber-700)', flexShrink: 0, marginTop: 3 }} />
                    <p className="small" style={{ color: 'var(--ink-soft)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ background: 'var(--navy-900)', color: '#dbe6f3', border: 'none' }}>
              <span className="icon-badge" style={{ background: 'rgba(23,165,111,.16)', color: '#8fe3bd' }}>
                <ShieldAlertIcon size={19} />
              </span>
              <h3 style={{ color: '#fff', marginBottom: 8 }}>Em situação de risco imediato</h3>
              <p style={{ color: '#c6d4e6', fontSize: '.92rem' }}>
                Se houver risco à vida ou à integridade física, acione primeiro os canais de emergência.
                O canal recebe o relato, mas não substitui atendimento urgente.
              </p>
              <div className="cluster" style={{ marginTop: 16 }}>
                <span className="badge" data-tone="solid-red">190 — Polícia</span>
                <span className="badge" data-tone="solid-red">180 — Central da Mulher</span>
                <span className="badge" data-tone="solid-red">100 — Direitos Humanos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Como funciona</span>
            <h2>Sete etapas, com revisão humana em todas as decisões</h2>
            <p>
              O fluxo combina proteção de dados, apoio de IA e decisão humana. Você acompanha
              cada avanço com o protocolo e o código de acesso gerados no registro.
            </p>
          </div>
          <div className="flow">
            {flow.map((step, index) => (
              <div className="flow-step" key={step.title}>
                <span className="flow-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Canais de entrada</span>
            <h2>Você escolhe como falar com o canal</h2>
            <p>
              Além do formulário, a organização fictícia mantém dois canais oficiais de entrada.
              Os contatos abaixo são fictícios e existem apenas para este projeto acadêmico.
            </p>
          </div>
          <div className="grid grid-2">
            <article className="card">
              <span className="icon-badge"><MailIcon size={19} /></span>
              <h3>E-mail dedicado</h3>
              <p className="mono" style={{ fontSize: '.95rem', margin: '6px 0 10px', color: 'var(--navy-900)', fontWeight: 600 }}>
                canal.seguro@organizacao-ficticia.exemplo
              </p>
              <p className="small muted">
                Recebido apenas pela equipe de Compliance/Ouvidoria. Não envie documentos com dados
                sensíveis sem necessidade.
              </p>
            </article>
            <article className="card">
              <span className="icon-badge"><PhoneIcon size={19} /></span>
              <h3>WhatsApp oficial</h3>
              <p className="mono" style={{ fontSize: '.95rem', margin: '6px 0 10px', color: 'var(--navy-900)', fontWeight: 600 }}>
                +55 (11) 90000-0000
              </p>
              <p className="small muted">
                Atendimento humano em dias úteis. O canal não solicita senhas, dados bancários,
                CPF ou documentos por mensagem.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="ai-band">
            <span className="ai-band-icon"><SparklesIcon size={26} /></span>
            <div>
              <h2>Transparência sobre o uso de Inteligência Artificial</h2>
              <p>
                Este canal usa Inteligência Artificial como apoio. A IA nunca decide sobre sua denúncia;
                toda decisão final é humana.
              </p>
              <p className="small">
                A IA sugere a classificação, o nível de urgência e a área responsável, e alerta sobre
                excesso de dados sensíveis. O relato não é compartilhado com terceiros.
              </p>
              <div className="cluster" style={{ marginTop: 18 }}>
                <Link to="/privacidade#limites-ia" className="btn btn-ghost-light btn-sm">
                  Conhecer os limites da IA
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Comece agora</span>
          <h2 style={{ maxWidth: 620, margin: '0 auto' }}>Relatar uma irregularidade é um ato de cuidado com as pessoas</h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', color: 'var(--ink-soft)' }}>
            Leva poucos minutos. Você pode ser anônimo, anexar evidências se quiser e receber um
            protocolo para acompanhar o caso.
          </p>
          <div className="cluster" style={{ justifyContent: 'center', marginTop: 26 }}>
            <Link to="/denuncia" className="btn btn-primary">
              <FilePlusIcon size={18} />
              Fazer denúncia
            </Link>
            <Link to="/acompanhar" className="btn btn-outline">
              <SearchIcon size={18} />
              Acompanhar denúncia
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
