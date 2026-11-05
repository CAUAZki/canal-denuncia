import { Link } from 'react-router-dom';
import { Alert } from '../components/UI';
import {
  AlertTriangleIcon,
  DataIcon,
  EyeOffIcon,
  FilePlusIcon,
  HistoryIcon,
  LockIcon,
  ScaleIcon,
  ShieldIcon,
  ShieldOffIcon,
  SparklesIcon,
  UsersIcon,
} from '../components/Icons';

const principles = [
  {
    title: 'Minimização de dados',
    icon: <DataIcon size={19} />,
    text: 'Coletamos apenas o necessário para receber e apurar o relato. O canal não pede CPF, RG, matrícula, endereço, dados bancários ou dados de saúde. O anexo é sempre opcional.',
  },
  {
    title: 'Criptografia em trânsito e em repouso',
    icon: <LockIcon size={19} />,
    text: 'O tráfego entre o navegador e o canal usa HTTPS. Os dados armazenados ficam em banco protegido, com credenciais restritas e sem exposição pública. Em produção, recomenda-se criptografia de disco e de backups.',
  },
  {
    title: 'Controle de acesso por função',
    icon: <UsersIcon size={19} />,
    text: 'Compliance/Ouvidoria acessa o caso completo. Gestor de área vê somente denúncias encaminhadas à sua área. Auditoria/Segurança da Informação acessa apenas logs e metadados, sem o conteúdo do relato.',
  },
  {
    title: 'Logs de auditoria',
    icon: <HistoryIcon size={19} />,
    text: 'Cada acesso e cada alteração registra data, hora, usuário, perfil e ação. Os logs são somente leitura para quem os consulta e apoiam a investigação de acessos indevidos.',
  },
  {
    title: 'Anonimização em relatórios',
    icon: <EyeOffIcon size={19} />,
    text: 'Painéis e relatórios gerenciais mostram apenas dados agregados, sem nomes, contatos ou qualquer elemento que permita reidentificar um denunciante anônimo.',
  },
  {
    title: 'Retenção e exclusão segura',
    icon: <ShieldIcon size={19} />,
    text: 'Os dados são mantidos pelo prazo necessário à apuração e às obrigações legais e, depois, eliminados de forma segura. Prazos variam conforme a natureza do caso e a legislação aplicável.',
  },
  {
    title: 'Proteção contra retaliação',
    icon: <ShieldOffIcon size={19} />,
    text: 'Retaliação a quem denuncia de boa-fé é proibida. O canal trata o relato com confidencialidade e encaminha apenas as informações necessárias à área responsável.',
  },
  {
    title: 'Direitos do titular',
    icon: <ScaleIcon size={19} />,
    text: 'Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, eliminação e informação sobre compartilhamento, além de revogar o consentimento quando aplicável. O atendimento é feito pela Ouvidoria.',
  },
];

const aiLimits = [
  'A IA não decide se a denúncia é verdadeira ou falsa.',
  'A IA não aplica sanções a ninguém.',
  'A IA não arquiva nem conclui casos sem revisão humana.',
  'A IA não revela a identidade de um denunciante anônimo.',
  'A IA não emite parecer jurídico.',
  'A IA não compartilha dados com terceiros.',
];

export default function Privacy() {
  return (
    <>
      <section className="section section--muted" style={{ paddingBottom: 48 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="eyebrow"><ShieldIcon size={14} /> Privacidade e LGPD</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.6rem)' }}>Privacidade e proteção de dados</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 14, maxWidth: 640 }}>
            Este canal foi desenhado com privacidade por padrão: o anonimato é possível, os dados são
            minimizados e o acesso é limitado por função. A Inteligência Artificial apoia a triagem,
            nunca a decisão.
          </p>
          <div className="cluster" style={{ marginTop: 22 }}>
            <span className="badge" data-tone="green">LGPD</span>
            <span className="badge" data-tone="blue">Privacidade por padrão</span>
            <span className="badge" data-tone="slate">Acesso por função</span>
            <span className="badge" data-tone="slate">Log de auditoria</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem' }}>Como seus dados são tratados</h2>
            <p>Oito compromissos que orientam o funcionamento do canal.</p>
          </div>

          <div className="grid grid-2">
            {principles.map((item) => (
              <article className="card" key={item.title}>
                <span className="icon-badge">{item.icon}</span>
                <h3 style={{ fontSize: '1rem' }}>{item.title}</h3>
                <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted" id="limites-ia">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head">
            <span className="eyebrow"><SparklesIcon size={14} /> Limites da IA</span>
            <h2>O que a Inteligência Artificial não faz</h2>
            <p>
              A IA do canal é uma camada de apoio: ela sugere classificação, urgência e área
              responsável, e alerta sobre excesso de dados sensíveis. Nada além disso.
            </p>
          </div>

          <div className="grid grid-2">
            {aiLimits.map((limit) => (
              <div className="card card--flat" key={limit} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AlertTriangleIcon size={18} style={{ color: 'var(--red-700)', flexShrink: 0, marginTop: 3 }} />
                <p className="small" style={{ color: 'var(--ink-soft)' }}>{limit}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <Alert tone="info" title="Sugestão, não decisão">
              Toda sugestão da IA aparece identificada como “Sugestão da IA” no painel restrito. Um
              responsável humano precisa confirmar ou alterar a classificação antes de qualquer
              encaminhamento. O nome desse responsável fica registrado no histórico.
            </Alert>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="card">
              <h2 style={{ fontSize: '1.15rem' }}>Anonimato e identificação</h2>
              <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
                Na modalidade anônima, nenhum dado identificador é solicitado. O relato é vinculado
                apenas ao protocolo e ao código de acesso. Na modalidade identificada, nome e contato
                são opcionais e ficam restritos à equipe de Compliance — gestores de área nunca os veem.
              </p>
              <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 10 }}>
                O canal não solicita CPF, RG, matrícula, endereço, dados bancários ou dados de saúde.
                Se você incluir esse tipo de informação no texto, a IA sinaliza o excesso e recomenda
                remover antes do envio.
              </p>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '1.15rem' }}>Transparência e projeto acadêmico</h2>
              <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
                Este site é um projeto acadêmico de uma organização fictícia. Todos os dados exibidos,
                inclusive os de exemplo, são fictícios. Não envie dados reais de pessoas.
              </p>
              <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 10 }}>
                As referências à LGPD têm finalidade educativa e não constituem parecer jurídico.
                Para uma implantação real, é necessário envolver encarregado de dados (DPO),
                jurídico e segurança da informação.
              </p>
              <div className="cluster" style={{ marginTop: 16 }}>
                <Link to="/faq" className="link-arrow">Perguntas frequentes →</Link>
              </div>
            </div>
          </div>

          <div className="ai-band" style={{ marginTop: 24 }}>
            <span className="ai-band-icon"><ShieldIcon size={26} /></span>
            <div>
              <h2>Sua denúncia é confidencial e você pode ser anônimo</h2>
              <p className="small">
                Registre o relato com segurança e acompanhe o caso com protocolo e código de acesso.
              </p>
              <div className="cluster" style={{ marginTop: 16 }}>
                <Link to="/denuncia" className="btn btn-primary btn-sm">
                  <FilePlusIcon size={16} />
                  Fazer denúncia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
