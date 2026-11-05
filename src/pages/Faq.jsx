import { Link } from 'react-router-dom';
import { FilePlusIcon, SearchIcon } from '../components/Icons';

const faqs = [
  {
    question: 'Minha denúncia é realmente anônima?',
    answer:
      'Sim. Na modalidade anônima não solicitamos nome, contato, CPF, RG, matrícula ou endereço. O relato é vinculado apenas a um protocolo e a um código de acesso. O código não revela quem você é, e a equipe não consegue identificar o autor da denúncia por meio dele. Acompanhe o caso usando os dois dados.',
  },
  {
    question: 'Como funcionam o protocolo e o código de acesso?',
    answer:
      'Ao enviar a denúncia, o canal gera um protocolo no formato CS-2026-00001 e um código de acesso único. O código é exibido uma única vez e não pode ser recuperado. Guarde os dois em local seguro: eles são a única forma de acompanhar o andamento, mesmo sem se identificar. Não compartilhe o código.',
  },
  {
    question: 'O que a Inteligência Artificial faz com o meu relato?',
    answer:
      'A IA sugere a classificação do tipo de denúncia, o nível de urgência, a área responsável e alerta quando há excesso de dados sensíveis. Se identificar linguagem de risco iminente, marca o caso como Prioridade Máxima para alerta humano. Ela não decide se a denúncia é verdadeira, não aplica sanções e não arquiva casos. O relato não é compartilhado com terceiros.',
  },
  {
    question: 'Quais são os prazos de resposta?',
    answer:
      'Os prazos variam conforme a complexidade e a área envolvida. Este projeto acadêmico não define prazos reais de apuração; em uma implantação efetiva, a organização deve publicar prazos de triagem, análise e resposta, com acompanhamento pelo protocolo. O andamento e as respostas da equipe ficam disponíveis na consulta.',
  },
  {
    question: 'Posso sofrer retaliação por denunciar?',
    answer:
      'Retaliação a quem denuncia de boa-fé é proibida. O canal adota confidencialidade, acesso por função e registro de todos os acessos em log de auditoria. Se você sofrer qualquer retaliação, registre uma nova denúncia informando o ocorrido e as pessoas envolvidas.',
  },
  {
    question: 'Preciso anexar evidências para denunciar?',
    answer:
      'Não. O anexo é sempre opcional. Você pode relatar os fatos apenas com o texto. Se tiver evidências, envie PDF, imagem, DOCX ou TXT de até 5 MB — mas não inclua dados pessoais desnecessários de terceiros.',
  },
  {
    question: 'Posso denunciar em nome de outra pessoa?',
    answer:
      'Sim, desde que a pessoa tenha autorizado e o relato seja feito de boa-fé. Nesse caso, prefira a modalidade identificada e informe apenas um contato de retorno, sem incluir dados sensíveis da outra pessoa. Se houver risco à integridade física, acione também os canais de emergência (190, 180 ou 100).',
  },
  {
    question: 'O canal substitui a polícia ou o atendimento de emergência?',
    answer:
      'Não. O canal é um instrumento de integridade e compliance. Em situações de risco imediato à vida ou à integridade física, procure primeiro a polícia (190), a Central de Atendimento à Mulher (180) ou os Direitos Humanos (100). Depois, se fizer sentido, registre a denúncia no canal.',
  },
  {
    question: 'Quem consegue ver o conteúdo da minha denúncia?',
    answer:
      'A equipe de Compliance/Ouvidoria acessa o caso completo. Gestores de área veem apenas denúncias encaminhadas à própria área e nunca a identidade de quem optou pelo anonimato. Auditoria/Segurança da Informação acessa apenas logs e metadados, sem o conteúdo do relato. Todo acesso é registrado com data, hora, usuário e ação.',
  },
];

export default function Faq() {
  return (
    <>
      <section className="section section--muted" style={{ paddingBottom: 44 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="eyebrow">Perguntas frequentes</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.6rem)' }}>Dúvidas sobre o canal</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 14, maxWidth: 620 }}>
            Anonimato, protocolo, uso da IA, prazos, retaliação e limites do canal. Se a sua dúvida
            não estiver aqui, procure a Ouvidoria da organização.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="faq-list">
            {faqs.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <div className="faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="card" style={{ marginTop: 28, background: 'var(--bg)' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Ainda com dúvidas?</h2>
            <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
              Você pode registrar uma denúncia ou acompanhar um caso existente. Em situação de risco
              imediato, acione 190, 180 ou 100.
            </p>
            <div className="cluster" style={{ marginTop: 16 }}>
              <Link to="/denuncia" className="btn btn-primary btn-sm">
                <FilePlusIcon size={16} />
                Fazer denúncia
              </Link>
              <Link to="/acompanhar" className="btn btn-outline btn-sm">
                <SearchIcon size={16} />
                Acompanhar denúncia
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
