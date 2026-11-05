import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { OCCURRENCE_TYPES } from '../../shared/catalog';
import { api } from '../lib/api';
import { urgencyTone } from '../lib/format';
import { Alert, Badge, CopyButton, Field } from '../components/UI';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  FilePlusIcon,
  LockIcon,
  PaperclipIcon,
  ShieldAlertIcon,
  ShieldIcon,
  SparklesIcon,
} from '../components/Icons';

const STEPS = [
  { n: 1, label: 'Orientação de privacidade' },
  { n: 2, label: 'Modalidade' },
  { n: 3, label: 'Relato' },
];

const initialForm = {
  consent: false,
  modality: 'anonima',
  reporterName: '',
  contactPreference: '',
  contactValue: '',
  description: '',
  involved: '',
  category: '',
};

export default function NewReport() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sensitiveAlerts, setSensitiveAlerts] = useState([]);
  const topRef = useRef(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  }

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, result]);

  useEffect(() => {
    if (result || form.description.trim().length < 40) {
      setSensitiveAlerts([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api('/reports/analyze', {
          method: 'POST',
          body: { description: form.description, involved: form.involved, category: form.category },
        });
        setSensitiveAlerts(data.sensitiveAlerts || []);
      } catch {
        setSensitiveAlerts([]);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form.description, form.involved, form.category, result]);

  function validateStep1() {
    if (!form.consent) {
      setErrors({ consent: 'Para continuar, é necessário aceitar o termo de consentimento informado.' });
      return false;
    }
    return true;
  }

  function validateStep2() {
    const next = {};
    if (form.modality === 'identificada' && form.contactPreference) {
      if (!form.contactValue.trim()) {
        next.contactValue = 'Informe o contato correspondente à preferência escolhida.';
      } else if (form.contactPreference === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactValue.trim())) {
        next.contactValue = 'Informe um e-mail válido.';
      } else if (form.contactPreference === 'whatsapp' && !/^\d{10,13}$/.test(form.contactValue.replace(/\D/g, ''))) {
        next.contactValue = 'Informe um WhatsApp válido com DDD.';
      }
    }
    if (form.reporterName.trim().length > 120) {
      next.reporterName = 'O nome deve ter no máximo 120 caracteres.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3() {
    const next = {};
    if (form.description.trim().length < 40) {
      next.description = 'Descreva o relato com pelo menos 40 caracteres (o que, quando, onde e como).';
    }
    if (form.involved.length > 2000) {
      next.involved = 'Use no máximo 2.000 caracteres.';
    }
    if (!form.category) {
      next.category = 'Selecione o tipo de ocorrência.';
    }
    if (attachment) {
      if (attachment.size > 5 * 1024 * 1024) {
        next.attachment = 'O anexo deve ter no máximo 5 MB.';
      }
      const allowed = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowed.includes(attachment.type)) {
        next.attachment = 'Formato não aceito. Envie PDF, PNG, JPG, DOCX ou TXT.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((current) => Math.min(3, current + 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) return;

    setSubmitting(true);
    setServerError('');

    const payload = new FormData();
    payload.append('consent', 'true');
    payload.append('modality', form.modality);
    payload.append('description', form.description.trim());
    payload.append('involved', form.involved.trim());
    payload.append('category', form.category);
    if (form.modality === 'identificada') {
      payload.append('reporterName', form.reporterName.trim());
      if (form.contactPreference) {
        payload.append('contactPreference', form.contactPreference);
        payload.append('contactValue', form.contactValue.trim());
      }
    }
    if (attachment) payload.append('attachment', attachment);

    try {
      const data = await api('/reports', { method: 'POST', body: payload });
      setResult(data);
    } catch (error) {
      setServerError(error.message);
      if (error.fields) setErrors(error.fields);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setAttachment(null);
    setErrors({});
    setServerError('');
    setResult(null);
    setStep(1);
  }

  if (result) {
    const highRisk = ['Alto', 'Prioridade Máxima'].includes(result.urgency) || result.ai?.imminentRisk;
    return (
      <section className="section">
        <div className="container wizard-shell" ref={topRef}>
          <div className="card" style={{ padding: 32 }}>
            <div className="confirm-hero">
              <span className="confirm-check"><CheckIcon size={28} /></span>
              <h1 style={{ fontSize: '1.8rem' }}>Denúncia registrada com sucesso</h1>
              <p className="muted" style={{ marginTop: 8 }}>
                Guarde o protocolo e o código de acesso. Eles são a única forma de acompanhar o caso,
                inclusive em denúncias anônimas.
              </p>
            </div>

            <div className="protocol-box">
              <div className="protocol-item">
                <span>Protocolo</span>
                <strong className="mono">{result.protocol}</strong>
                <CopyButton value={result.protocol} label="Copiar protocolo" />
              </div>
              <div className="protocol-item">
                <span>Código de acesso</span>
                <strong className="mono">{result.accessCode}</strong>
                <CopyButton value={result.accessCode} label="Copiar código" />
              </div>
            </div>

            <Alert tone="warn" title="Guarde estes dados em local seguro">
              Nós não conseguimos recuperar o código de acesso. Sem ele, não será possível consultar
              o andamento da denúncia. Não compartilhe o código com outras pessoas.
            </Alert>

            <div className="cluster" style={{ marginTop: 18 }}>
              <Badge tone="blue">Status: Recebida</Badge>
              <Badge tone={urgencyTone[result.urgency] || 'slate'}>Urgência: {result.urgency}</Badge>
              <span className="small muted">Categoria: {result.category}</span>
            </div>

            {highRisk ? (
              <div className="emergency-box" style={{ marginTop: 22 }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red-700)' }}>
                  <ShieldAlertIcon size={18} />
                  Sua denúncia foi sinalizada para alerta humano prioritário
                </strong>
                <p className="small" style={{ marginTop: 6, color: '#8a3a32' }}>
                  Se houver risco imediato à sua vida ou à de outra pessoa, procure também os canais de emergência:
                </p>
                <div className="emergency-numbers">
                  <span className="emergency-number"><strong>190</strong> Polícia</span>
                  <span className="emergency-number"><strong>180</strong> Central da Mulher</span>
                  <span className="emergency-number"><strong>100</strong> Direitos Humanos</span>
                </div>
              </div>
            ) : null}

            <div className="alert" data-tone="neutral" style={{ marginTop: 22 }}>
              <span style={{ marginTop: 1 }}><LockIcon size={18} /></span>
              <div>
                O código de acesso não substitui o protocolo: você precisa dos dois para consultar.
                Em caso de perda, não é possível recuperar o acesso.
              </div>
            </div>

            <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={reset}>Registrar outra denúncia</button>
              <Link to="/acompanhar" className="btn btn-primary">
                Acompanhar denúncia
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container wizard-shell" ref={topRef}>
        <div className="section-head">
          <span className="eyebrow"><FilePlusIcon size={14} /> Nova denúncia</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)' }}>Fazer denúncia</h1>
          <p>
            Três etapas, com privacidade desde o primeiro passo. Campos com <strong>*</strong> são
            obrigatórios; o anexo é sempre opcional.
          </p>
        </div>

        <div className="wizard-steps" aria-label="Etapas do formulário">
          {STEPS.map((item, index) => (
            <div key={item.n} style={{ display: 'contents' }}>
              <span className="wizard-step" data-state={step === item.n ? 'active' : step > item.n ? 'done' : 'idle'}>
                <span className="dot">{step > item.n ? <CheckIcon size={13} /> : item.n}</span>
                <span className="label">{item.label}</span>
              </span>
              {index < STEPS.length - 1 ? <span className="wizard-line" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>

        <form className="card" style={{ padding: 28 }} onSubmit={handleSubmit} noValidate>
          {serverError ? <div style={{ marginBottom: 18 }}><Alert tone="danger" title="Não foi possível enviar">{serverError}</Alert></div> : null}

          {step === 1 ? (
            <div className="stack">
              <h2 style={{ fontSize: '1.25rem' }}>Antes de começar: sua privacidade</h2>
              <p className="small" style={{ color: 'var(--ink-soft)' }}>
                Este canal trata seus dados com base na Lei Geral de Proteção de Dados (LGPD), apenas
                para registrar, apurar e responder à denúncia. Você pode ser anônimo e tem direitos
                sobre seus dados.
              </p>

              <div className="grid grid-2">
                <div className="card card--soft" style={{ boxShadow: 'none' }}>
                  <span className="icon-badge"><LockIcon size={18} /></span>
                  <h3 style={{ fontSize: '.95rem' }}>Anonimato disponível</h3>
                  <p className="small muted">
                    Na modalidade anônima não pedimos nome, contato, CPF, RG, matrícula, endereço,
                    dados bancários ou dados de saúde. Seu relato é vinculado apenas a um protocolo.
                  </p>
                </div>
                <div className="card card--soft" style={{ boxShadow: 'none' }}>
                  <span className="icon-badge"><ShieldIcon size={18} /></span>
                  <h3 style={{ fontSize: '.95rem' }}>Acesso restrito</h3>
                  <p className="small muted">
                    A equipe de Compliance/Ouvidoria acessa o conteúdo. Gestores de área veem apenas
                    denúncias da própria área; auditoria vê apenas metadados e logs, sem o relato.
                  </p>
                </div>
              </div>

              <div>
                <p className="field-label" style={{ marginBottom: 6 }}>Seus direitos como titular</p>
                <ul className="small" style={{ color: 'var(--ink-soft)', paddingLeft: 20, display: 'grid', gap: 4 }}>
                  <li>Confirmação da existência de tratamento e acesso aos dados.</li>
                  <li>Correção de dados incompletos ou desatualizados.</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                  <li>Informação sobre compartilhamento — que não ocorre com terceiros.</li>
                  <li>Revogação do consentimento, quando aplicável.</li>
                </ul>
              </div>

              <div className="checkbox-row">
                <input
                  id="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => update('consent', event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                />
                <label htmlFor="consent">
                  Li e compreendi a orientação de privacidade e consinto, de forma informada, com o
                  tratamento dos dados que eu fornecer para o registro e a apuração desta denúncia.
                  Estou ciente de que a IA apenas apoia a triagem e que a decisão final é humana.{' '}
                  <Link to="/privacidade" target="_blank" rel="noreferrer">Ler a política completa</Link>.
                </label>
              </div>
              {errors.consent ? <span className="error-text">{errors.consent}</span> : null}

              <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Continuar
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="stack">
              <h2 style={{ fontSize: '1.25rem' }}>Como você quer se identificar?</h2>
              <p className="small" style={{ color: 'var(--ink-soft)' }}>
                A modalidade anônima é o padrão do canal. Se escolher a identificada, você decide se
                informa nome e contato — ambos os campos são opcionais.
              </p>

              <div className="radio-grid">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="modality"
                    value="anonima"
                    checked={form.modality === 'anonima'}
                    onChange={() => update('modality', 'anonima')}
                  />
                  <strong>Anônima (recomendada)</strong>
                  <span>Nenhum dado identificador é solicitado. Você acompanha com protocolo e código de acesso.</span>
                </label>
                <label className="radio-card">
                  <input
                    type="radio"
                    name="modality"
                    value="identificada"
                    checked={form.modality === 'identificada'}
                    onChange={() => update('modality', 'identificada')}
                  />
                  <strong>Identificada</strong>
                  <span>Permite retorno da equipe pelo contato informado. Seus dados ficam restritos ao Compliance.</span>
                </label>
              </div>

              {form.modality === 'identificada' ? (
                <div className="stack" style={{ marginTop: 6 }}>
                  <Alert tone="info" title="Dados opcionais">
                    Não informe CPF, RG, matrícula, endereço, dados bancários ou dados de saúde.
                    Gestores de área nunca veem a identidade do denunciante.
                  </Alert>
                  <Field label="Nome (opcional)" htmlFor="reporterName" error={errors.reporterName}
                    hint="Se preferir, use apenas um primeiro nome.">
                    <input
                      id="reporterName"
                      className="input"
                      value={form.reporterName}
                      onChange={(event) => update('reporterName', event.target.value)}
                      placeholder="Como a equipe pode chamar você"
                      maxLength={120}
                    />
                  </Field>
                  <div className="grid grid-2">
                    <Field label="Preferência de contato (opcional)" htmlFor="contactPreference">
                      <select
                        id="contactPreference"
                        className="select"
                        value={form.contactPreference}
                        onChange={(event) => update('contactPreference', event.target.value)}
                      >
                        <option value="">Não quero contato</option>
                        <option value="email">E-mail</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </Field>
                    {form.contactPreference ? (
                      <Field
                        label={form.contactPreference === 'email' ? 'E-mail para retorno' : 'WhatsApp com DDD'}
                        htmlFor="contactValue"
                        error={errors.contactValue}
                      >
                        <input
                          id="contactValue"
                          className="input"
                          value={form.contactValue}
                          onChange={(event) => update('contactValue', event.target.value)}
                          placeholder={form.contactPreference === 'email' ? 'voce@exemplo.com' : '(11) 90000-0000'}
                          inputMode={form.contactPreference === 'email' ? 'email' : 'tel'}
                        />
                      </Field>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="wizard-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Voltar</button>
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Continuar
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="stack">
              <h2 style={{ fontSize: '1.25rem' }}>Conte o que aconteceu</h2>
              <p className="small" style={{ color: 'var(--ink-soft)' }}>
                Descreva de forma factual: o que aconteceu, quando, onde e como. Evite opiniões e
                não inclua dados de terceiros que não sejam necessários.
              </p>

              <div className="form-helper">
                Não informe dados desnecessários, como CPF, endereço ou dados de saúde.
              </div>

              {sensitiveAlerts.length > 0 ? (
                <Alert tone="warn" title="Possíveis dados sensíveis no relato">
                  <p>
                    Detectamos elementos que podem identificar pessoas ou expor dados sensíveis.
                    Recomendamos remover o que não for necessário para a apuração:
                  </p>
                  <ul>
                    {sensitiveAlerts.map((alert) => (
                      <li key={alert.key}><strong>{alert.label}:</strong> {alert.recommendation}</li>
                    ))}
                  </ul>
                </Alert>
              ) : null}

              <Field
                label="Relato da ocorrência *"
                htmlFor="description"
                error={errors.description}
                hint={`${form.description.trim().length} de 8.000 caracteres (mínimo 40).`}
              >
                <textarea
                  id="description"
                  className="textarea"
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="O que aconteceu, quando, onde e como. Descreva os fatos que você presenciou ou dos quais tem conhecimento."
                  maxLength={8000}
                  aria-invalid={Boolean(errors.description)}
                />
              </Field>

              <Field
                label="Pessoas envolvidas (opcional)"
                htmlFor="involved"
                error={errors.involved}
                hint="Nomes ou funções, se conhecidos. Não é necessário identificar testemunhas."
              >
                <textarea
                  id="involved"
                  className="textarea"
                  style={{ minHeight: 92 }}
                  value={form.involved}
                  onChange={(event) => update('involved', event.target.value)}
                  placeholder="Ex.: gerente do setor, coordenador do turno da noite, fornecedor de manutenção."
                  maxLength={2000}
                  aria-invalid={Boolean(errors.involved)}
                />
              </Field>

              <Field label="Tipo de ocorrência *" htmlFor="category" error={errors.category}>
                <select
                  id="category"
                  className="select"
                  value={form.category}
                  onChange={(event) => update('category', event.target.value)}
                  aria-invalid={Boolean(errors.category)}
                >
                  <option value="">Selecione a categoria que melhor descreve o caso</option>
                  {OCCURRENCE_TYPES.map((type) => (
                    <option key={type.key} value={type.label}>{type.label}</option>
                  ))}
                </select>
              </Field>

              <Field
                label="Evidências (opcional)"
                htmlFor="attachment"
                error={errors.attachment}
                hint="PDF, PNG, JPG, DOCX ou TXT, até 5 MB. O anexo nunca é obrigatório."
              >
                <div className="checkbox-row" style={{ alignItems: 'center', background: '#fff' }}>
                  <PaperclipIcon size={18} style={{ color: 'var(--muted)' }} />
                  <input
                    id="attachment"
                    type="file"
                    style={{ border: 'none', padding: 0, width: 'auto', flex: 1 }}
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
                    onChange={(event) => {
                      setAttachment(event.target.files?.[0] || null);
                      setErrors((current) => ({ ...current, attachment: undefined }));
                    }}
                  />
                </div>
              </Field>

              {attachment ? (
                <p className="small muted">Anexo selecionado: {attachment.name}</p>
              ) : null}

              <Alert tone="info" title="O que acontece depois do envio">
                Você receberá um protocolo e um código de acesso. A IA sugere classificação, urgência
                e área responsável, mas nenhuma medida é tomada sem revisão de uma pessoa.
              </Alert>

              <div className="wizard-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Voltar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <SparklesIcon size={17} />
                  {submitting ? 'Enviando com segurança…' : 'Enviar denúncia'}
                </button>
              </div>
            </div>
          ) : null}
        </form>

        <p className="small muted" style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangleIcon size={15} />
          Em situação de risco imediato, acione 190, 180 ou 100 antes de registrar a denúncia.
        </p>
      </div>
    </section>
  );
}
