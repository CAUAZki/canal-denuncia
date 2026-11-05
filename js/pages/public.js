// Páginas públicas do canal, em HTML e JavaScript puro.
window.PublicPages = (function () {
  const esc = UI.esc;
  const icon = Icons.svg;

  function link(href, label, className) {
    return '<a href="' + href + '"' + (className ? ' class="' + className + '"' : '') + '>' + label + '</a>';
  }

  function sectionHead(eyebrow, title, text) {
    return '<div class="section-head">' + (eyebrow ? '<span class="eyebrow">' + eyebrow + '</span>' : '') +
      '<h2>' + title + '</h2>' + (text ? '<p>' + text + '</p>' : '') + '</div>';
  }

  // 1. Home
  function home(view) {
    const audience = [
      { title: 'Colaboradores', text: 'Efetivos, temporários, estagiários e aprendizes de qualquer área ou unidade.', icon: 'users' },
      { title: 'Fornecedores e prestadores', text: 'Empresas e profissionais que prestam serviços à organização.', icon: 'scale' },
      { title: 'Clientes e usuários', text: 'Quem utiliza nossos produtos, serviços ou canais de atendimento.', icon: 'mail' },
      { title: 'Terceiros com relação legítima', text: 'Parceiros, comunidades e demais pessoas com vínculo legítimo com a organização.', icon: 'shield' },
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

    view.innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <span class="eyebrow">${icon('shield', 14)} Canal de denúncias • Confidencial</span>
            <h1>Sua denúncia é <em>confidencial</em> e você pode ser anônimo</h1>
            <p class="hero-lead">
              Um espaço seguro para relatar condutas antiéticas, com privacidade por padrão,
              acolhimento e apoio responsável de Inteligência Artificial. A decisão final é sempre humana.
            </p>
            <div class="hero-actions">
              <a href="#/denuncia" class="btn btn-primary">${icon('filePlus', 18)} Fazer denúncia</a>
              <a href="#/acompanhar" class="btn btn-ghost-light">${icon('search', 18)} Acompanhar denúncia</a>
            </div>
            <div class="hero-meta">
              <span>${icon('eyeOff', 15)} Anonimato disponível</span>
              <span>${icon('clock', 15)} Retorno com protocolo</span>
              <span>${icon('lock', 15)} Dados minimizados</span>
            </div>
          </div>

          <aside class="hero-card">
            <h2>Como protegemos você</h2>
            <ul>
              <li>
                <span class="hero-icon">${icon('eyeOff', 17)}</span>
                <span><strong>Anonimato por padrão</strong> Não pedimos CPF, RG, matrícula, endereço ou dados de saúde.</span>
              </li>
              <li>
                <span class="hero-icon">${icon('scale', 17)}</span>
                <span><strong>A IA apenas sugere</strong> Classificação, urgência e área são sugestões — nunca decisões.</span>
              </li>
              <li>
                <span class="hero-icon">${icon('lock', 17)}</span>
                <span><strong>Acesso por função</strong> Cada perfil vê apenas o que precisa para atuar, com log de auditoria.</span>
              </li>
            </ul>
            <div class="hero-card-foot">${icon('checkCircle', 15)} Nenhuma ação é tomada sem revisão humana.</div>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead('Quem pode denunciar', 'Um canal aberto a quem tem relação legítima com a organização', 'Você não precisa ser colaborador para relatar uma irregularidade. O canal acolhe relatos de diferentes vínculos, sempre com confidencialidade.')}
          <div class="grid grid-4">
            ${audience.map(function (item) {
              return `<article class="icon-card"><span class="icon-badge icon-badge--navy">${icon(item.icon, 20)}</span><h3>${item.title}</h3><p>${item.text}</p></article>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          ${sectionHead('O que pode ser denunciado', 'Condutas que devem ser relatadas ao canal', 'Se a situação envolver risco à integridade física ou psicológica, registre imediatamente. O canal identifica sinais de risco iminente e alerta a equipe humana.')}
          <div class="grid grid-3">
            ${Catalog.OCCURRENCE_TYPES.map(function (type) {
              return `<article class="icon-card"><span class="icon-badge">${icon('checkCircle', 19)}</span><h3>${esc(type.label)}</h3><p>Relate de forma objetiva o que aconteceu, quando, onde e como.</p></article>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid grid-2" style="align-items:start">
            <div>
              <div class="section-head" style="margin-bottom:24px">
                <span class="eyebrow">O que não é aceito</span>
                <h2>Uso responsável do canal</h2>
                <p>O canal é destinado a relatos de conduta ética. Denúncias de má-fé desviam recursos da apuração e podem causar danos a pessoas inocentes.</p>
              </div>
              <div class="stack">
                ${notAccepted.map(function (item) {
                  return `<div class="card card--soft" style="display:flex;gap:12px;align-items:flex-start">
                    <span style="color:var(--amber-700);flex-shrink:0;margin-top:3px">${icon('alertTriangle', 18)}</span>
                    <p class="small" style="color:var(--ink-soft)">${esc(item)}</p>
                  </div>`;
                }).join('')}
              </div>
            </div>
            <div class="card" style="background:var(--navy-900);color:#dbe6f3;border:none">
              <span class="icon-badge" style="background:rgba(23,165,111,.16);color:#8fe3bd">${icon('shieldAlert', 19)}</span>
              <h3 style="color:#fff;margin-bottom:8px">Em situação de risco imediato</h3>
              <p style="color:#c6d4e6;font-size:.92rem">Se houver risco à vida ou à integridade física, acione primeiro os canais de emergência. O canal recebe o relato, mas não substitui atendimento urgente.</p>
              <div class="cluster" style="margin-top:16px">
                <span class="badge" data-tone="solid-red">190 — Polícia</span>
                <span class="badge" data-tone="solid-red">180 — Central da Mulher</span>
                <span class="badge" data-tone="solid-red">100 — Direitos Humanos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          ${sectionHead('Como funciona', 'Sete etapas, com revisão humana em todas as decisões', 'O fluxo combina proteção de dados, apoio de IA e decisão humana. Você acompanha cada avanço com o protocolo e o código de acesso gerados no registro.')}
          <div class="flow">
            ${flow.map(function (step, index) {
              return `<div class="flow-step"><span class="flow-step-number">${index + 1}</span><h3>${step.title}</h3><p>${step.text}</p></div>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead('Canais de entrada', 'Você escolhe como falar com o canal', 'Além do formulário, a organização fictícia mantém dois canais oficiais de entrada. Os contatos abaixo são fictícios e existem apenas para este projeto acadêmico.')}
          <div class="grid grid-2">
            <article class="card">
              <span class="icon-badge">${icon('mail', 19)}</span>
              <h3>E-mail dedicado</h3>
              <p class="mono" style="font-size:.95rem;margin:6px 0 10px;color:var(--navy-900);font-weight:600">canal.seguro@organizacao-ficticia.exemplo</p>
              <p class="small muted">Recebido apenas pela equipe de Compliance/Ouvidoria. Não envie documentos com dados sensíveis sem necessidade.</p>
            </article>
            <article class="card">
              <span class="icon-badge">${icon('phone', 19)}</span>
              <h3>WhatsApp oficial</h3>
              <p class="mono" style="font-size:.95rem;margin:6px 0 10px;color:var(--navy-900);font-weight:600">+55 (11) 90000-0000</p>
              <p class="small muted">Atendimento humano em dias úteis. O canal não solicita senhas, dados bancários, CPF ou documentos por mensagem.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="container">
          <div class="ai-band">
            <span class="ai-band-icon">${icon('sparkles', 26)}</span>
            <div>
              <h2>Transparência sobre o uso de Inteligência Artificial</h2>
              <p>Este canal usa Inteligência Artificial como apoio. A IA nunca decide sobre sua denúncia; toda decisão final é humana.</p>
              <p class="small">A IA sugere a classificação, o nível de urgência e a área responsável, e alerta sobre excesso de dados sensíveis. O relato não é compartilhado com terceiros.</p>
              <div class="cluster" style="margin-top:18px">
                <a href="#/privacidade/limites-ia" class="btn btn-ghost-light btn-sm">Conhecer os limites da IA ${icon('arrowRight', 15)}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container" style="text-align:center">
          <span class="eyebrow">Comece agora</span>
          <h2 style="max-width:620px;margin:0 auto">Relatar uma irregularidade é um ato de cuidado com as pessoas</h2>
          <p style="max-width:600px;margin:14px auto 0;color:var(--ink-soft)">Leva poucos minutos. Você pode ser anônimo, anexar evidências se quiser e receber um protocolo para acompanhar o caso.</p>
          <div class="cluster" style="justify-content:center;margin-top:26px">
            <a href="#/denuncia" class="btn btn-primary">${icon('filePlus', 18)} Fazer denúncia</a>
            <a href="#/acompanhar" class="btn btn-outline">${icon('search', 18)} Acompanhar denúncia</a>
          </div>
        </div>
      </section>
    `;
  }

  // 2. Nova denúncia (três etapas)
  function denuncia(view) {
    const form = {
      consent: false,
      modality: 'anonima',
      reporterName: '',
      contactPreference: '',
      contactValue: '',
      description: '',
      involved: '',
      category: '',
    };
    let step = 1;
    let attachment = null;
    let errors = {};
    let result = null;
    let alerts = [];
    let alertTimer = null;

    function stepsBar() {
      const steps = ['Orientação de privacidade', 'Modalidade', 'Relato'];
      return '<div class="wizard-steps" aria-label="Etapas do formulário">' + steps.map(function (label, index) {
        const number = index + 1;
        const state = step === number ? 'active' : step > number ? 'done' : 'idle';
        return '<span class="wizard-step" data-state="' + state + '">' +
          '<span class="dot">' + (step > number ? icon('check', 13) : number) + '</span>' +
          '<span class="label">' + label + '</span></span>' +
          (index < steps.length - 1 ? '<span class="wizard-line" aria-hidden="true"></span>' : '');
      }).join('') + '</div>';
    }

    function renderResult() {
      const highRisk = ['Alto', 'Prioridade Máxima'].indexOf(result.urgency) !== -1 || result.ai.imminentRisk;
      view.innerHTML = `
        <section class="section">
          <div class="container wizard-shell">
            <div class="card" style="padding:32px">
              <div class="confirm-hero">
                <span class="confirm-check">${icon('check', 28)}</span>
                <h1 style="font-size:1.8rem">Denúncia registrada com sucesso</h1>
                <p class="muted" style="margin-top:8px">Guarde o protocolo e o código de acesso. Eles são a única forma de acompanhar o caso, inclusive em denúncias anônimas.</p>
              </div>

              <div class="protocol-box">
                <div class="protocol-item">
                  <span>Protocolo</span>
                  <strong class="mono">${esc(result.protocol)}</strong>
                  ${UI.copyButton(result.protocol, 'Copiar protocolo')}
                </div>
                <div class="protocol-item">
                  <span>Código de acesso</span>
                  <strong class="mono">${esc(result.accessCode)}</strong>
                  ${UI.copyButton(result.accessCode, 'Copiar código')}
                </div>
              </div>

              ${UI.alertBox('warn', 'Guarde estes dados em local seguro', 'Nós não conseguimos recuperar o código de acesso. Sem ele, não será possível consultar o andamento da denúncia. Não compartilhe o código com outras pessoas.')}

              <div class="cluster" style="margin-top:18px">
                ${UI.badge('Status: Recebida', 'blue')}
                ${UI.badge('Urgência: ' + result.urgency, UI.urgencyTone[result.urgency] || 'slate')}
                <span class="small muted">Categoria: ${esc(result.category)}</span>
              </div>

              ${highRisk ? `
                <div class="emergency-box" style="margin-top:22px">
                  <strong style="display:flex;align-items:center;gap:8px;color:var(--red-700)">
                    ${icon('shieldAlert', 18)} Sua denúncia foi sinalizada para alerta humano prioritário
                  </strong>
                  <p class="small" style="margin-top:6px;color:#8a3a32">Se houver risco imediato à sua vida ou à de outra pessoa, procure também os canais de emergência:</p>
                  <div class="emergency-numbers">
                    <span class="emergency-number"><strong>190</strong> Polícia</span>
                    <span class="emergency-number"><strong>180</strong> Central da Mulher</span>
                    <span class="emergency-number"><strong>100</strong> Direitos Humanos</span>
                  </div>
                </div>` : ''}

              <div class="alert" data-tone="neutral" style="margin-top:22px">
                <span style="margin-top:1px">${icon('lock', 18)}</span>
                <div>O código de acesso não substitui o protocolo: você precisa dos dois para consultar. Em caso de perda, não é possível recuperar o acesso.</div>
              </div>

              <div class="wizard-actions" style="justify-content:flex-end">
                <button type="button" class="btn btn-outline" data-reset>Registrar outra denúncia</button>
                <a href="#/acompanhar" class="btn btn-primary">Acompanhar denúncia ${icon('arrowRight', 16)}</a>
              </div>
            </div>
          </div>
        </section>`;

      view.querySelector('[data-reset]').addEventListener('click', function () {
        step = 1;
        result = null;
        attachment = null;
        errors = {};
        form.consent = false;
        form.modality = 'anonima';
        form.reporterName = '';
        form.contactPreference = '';
        form.contactValue = '';
        form.description = '';
        form.involved = '';
        form.category = '';
        render();
      });

      window.scrollTo(0, 0);
    }

    function renderStepOne() {
      return `
        <div class="stack">
          <h2 style="font-size:1.25rem">Antes de começar: sua privacidade</h2>
          <p class="small" style="color:var(--ink-soft)">Este canal trata seus dados com base na Lei Geral de Proteção de Dados (LGPD), apenas para registrar, apurar e responder à denúncia. Você pode ser anônimo e tem direitos sobre seus dados.</p>

          <div class="grid grid-2">
            <div class="card card--soft" style="box-shadow:none">
              <span class="icon-badge">${icon('lock', 18)}</span>
              <h3 style="font-size:.95rem">Anonimato disponível</h3>
              <p class="small muted">Na modalidade anônima não pedimos nome, contato, CPF, RG, matrícula, endereço, dados bancários ou dados de saúde. Seu relato é vinculado apenas a um protocolo.</p>
            </div>
            <div class="card card--soft" style="box-shadow:none">
              <span class="icon-badge">${icon('shield', 18)}</span>
              <h3 style="font-size:.95rem">Acesso restrito</h3>
              <p class="small muted">A equipe de Compliance/Ouvidoria acessa o conteúdo. Gestores de área veem apenas denúncias da própria área; auditoria vê apenas metadados e logs, sem o relato.</p>
            </div>
          </div>

          <div>
            <p class="field-label" style="margin-bottom:6px">Seus direitos como titular</p>
            <ul class="small" style="color:var(--ink-soft);padding-left:20px;display:grid;gap:4px">
              <li>Confirmação da existência de tratamento e acesso aos dados.</li>
              <li>Correção de dados incompletos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Informação sobre compartilhamento — que não ocorre com terceiros.</li>
              <li>Revogação do consentimento, quando aplicável.</li>
            </ul>
          </div>

          <div class="checkbox-row">
            <input id="consent" type="checkbox" ${form.consent ? 'checked' : ''} aria-invalid="${Boolean(errors.consent)}">
            <label for="consent">
              Li e compreendi a orientação de privacidade e consinto, de forma informada, com o
              tratamento dos dados que eu fornecer para o registro e a apuração desta denúncia.
              Estou ciente de que a IA apenas apoia a triagem e que a decisão final é humana.
              <a href="#/privacidade" target="_blank" rel="noreferrer">Ler a política completa</a>.
            </label>
          </div>
          ${errors.consent ? '<span class="error-text">' + esc(errors.consent) + '</span>' : ''}

          <div class="wizard-actions" style="justify-content:flex-end">
            <button type="button" class="btn btn-primary" data-next>Continuar ${icon('arrowRight', 16)}</button>
          </div>
        </div>`;
    }

    function renderStepTwo() {
      return `
        <div class="stack">
          <h2 style="font-size:1.25rem">Como você quer se identificar?</h2>
          <p class="small" style="color:var(--ink-soft)">A modalidade anônima é o padrão do canal. Se escolher a identificada, você decide se informa nome e contato — ambos os campos são opcionais.</p>

          <div class="radio-grid">
            <label class="radio-card">
              <input type="radio" name="modality" value="anonima" ${form.modality === 'anonima' ? 'checked' : ''}>
              <strong>Anônima (recomendada)</strong>
              <span>Nenhum dado identificador é solicitado. Você acompanha com protocolo e código de acesso.</span>
            </label>
            <label class="radio-card">
              <input type="radio" name="modality" value="identificada" ${form.modality === 'identificada' ? 'checked' : ''}>
              <strong>Identificada</strong>
              <span>Permite retorno da equipe pelo contato informado. Seus dados ficam restritos ao Compliance.</span>
            </label>
          </div>

          ${form.modality === 'identificada' ? `
            <div class="stack" style="margin-top:6px">
              ${UI.alertBox('info', 'Dados opcionais', 'Não informe CPF, RG, matrícula, endereço, dados bancários ou dados de saúde. Gestores de área nunca veem a identidade do denunciante.')}
              <div class="field">
                <label for="reporterName">Nome (opcional)</label>
                <input id="reporterName" class="input" value="${esc(form.reporterName)}" placeholder="Como a equipe pode chamar você" maxlength="120">
                ${errors.reporterName ? '<span class="error-text">' + esc(errors.reporterName) + '</span>' : '<span class="hint">Se preferir, use apenas um primeiro nome.</span>'}
              </div>
              <div class="grid grid-2">
                <div class="field">
                  <label for="contactPreference">Preferência de contato (opcional)</label>
                  <select id="contactPreference" class="select">
                    <option value="" ${form.contactPreference === '' ? 'selected' : ''}>Não quero contato</option>
                    <option value="email" ${form.contactPreference === 'email' ? 'selected' : ''}>E-mail</option>
                    <option value="whatsapp" ${form.contactPreference === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                  </select>
                </div>
                ${form.contactPreference ? `
                  <div class="field">
                    <label for="contactValue">${form.contactPreference === 'email' ? 'E-mail para retorno' : 'WhatsApp com DDD'}</label>
                    <input id="contactValue" class="input" value="${esc(form.contactValue)}" placeholder="${form.contactPreference === 'email' ? 'voce@exemplo.com' : '(11) 90000-0000'}" inputmode="${form.contactPreference === 'email' ? 'email' : 'tel'}">
                    ${errors.contactValue ? '<span class="error-text">' + esc(errors.contactValue) + '</span>' : ''}
                  </div>` : ''}
              </div>
            </div>` : ''}

          <div class="wizard-actions">
            <button type="button" class="btn btn-outline" data-back>Voltar</button>
            <button type="button" class="btn btn-primary" data-next>Continuar ${icon('arrowRight', 16)}</button>
          </div>
        </div>`;
    }

    function renderStepThree() {
      return `
        <div class="stack">
          <h2 style="font-size:1.25rem">Conte o que aconteceu</h2>
          <p class="small" style="color:var(--ink-soft)">Descreva de forma factual: o que aconteceu, quando, onde e como. Evite opiniões e não inclua dados de terceiros que não sejam necessários.</p>

          <div class="form-helper">Não informe dados desnecessários, como CPF, endereço ou dados de saúde.</div>

          <div id="sensitive-alerts">${alerts.length ? UI.alertBox('warn', 'Possíveis dados sensíveis no relato',
            '<p>Detectamos elementos que podem identificar pessoas ou expor dados sensíveis. Recomendamos remover o que não for necessário para a apuração:</p><ul>' +
            alerts.map(function (alert) { return '<li><strong>' + esc(alert.label) + ':</strong> ' + esc(alert.recommendation) + '</li>'; }).join('') +
            '</ul>') : ''}</div>

          <div class="field">
            <label for="description">Relato da ocorrência *</label>
            <textarea id="description" class="textarea" placeholder="O que aconteceu, quando, onde e como. Descreva os fatos que você presenciou ou dos quais tem conhecimento." maxlength="8000" aria-invalid="${Boolean(errors.description)}">${esc(form.description)}</textarea>
            <span class="hint" id="description-hint">${form.description.trim().length} de 8.000 caracteres (mínimo 40).</span>
            ${errors.description ? '<span class="error-text">' + esc(errors.description) + '</span>' : ''}
          </div>

          <div class="field">
            <label for="involved">Pessoas envolvidas (opcional)</label>
            <textarea id="involved" class="textarea" style="min-height:92px" placeholder="Ex.: gerente do setor, coordenador do turno da noite, fornecedor de manutenção." maxlength="2000" aria-invalid="${Boolean(errors.involved)}">${esc(form.involved)}</textarea>
            <span class="hint">Nomes ou funções, se conhecidos. Não é necessário identificar testemunhas.</span>
            ${errors.involved ? '<span class="error-text">' + esc(errors.involved) + '</span>' : ''}
          </div>

          <div class="field">
            <label for="category">Tipo de ocorrência *</label>
            <select id="category" class="select" aria-invalid="${Boolean(errors.category)}">
              <option value="">Selecione a categoria que melhor descreve o caso</option>
              ${Catalog.OCCURRENCE_TYPES.map(function (type) {
                return '<option value="' + esc(type.label) + '"' + (form.category === type.label ? ' selected' : '') + '>' + esc(type.label) + '</option>';
              }).join('')}
            </select>
            ${errors.category ? '<span class="error-text">' + esc(errors.category) + '</span>' : ''}
          </div>

          <div class="field">
            <label for="attachment">Evidências (opcional)</label>
            <div class="checkbox-row" style="align-items:center;background:#fff">
              <span style="color:var(--muted)">${icon('paperclip', 18)}</span>
              <input id="attachment" type="file" style="border:none;padding:0;width:auto;flex:1" accept=".pdf,.png,.jpg,.jpeg,.txt,.docx">
            </div>
            <span class="hint">PDF, PNG, JPG, DOCX ou TXT, até 5 MB. O anexo nunca é obrigatório.</span>
            ${errors.attachment ? '<span class="error-text">' + esc(errors.attachment) + '</span>' : ''}
          </div>

          ${attachment ? '<p class="small muted">Anexo selecionado: ' + esc(attachment.name) + '</p>' : ''}

          ${UI.alertBox('info', 'O que acontece depois do envio', 'Você receberá um protocolo e um código de acesso. A IA sugere classificação, urgência e área responsável, mas nenhuma medida é tomada sem revisão de uma pessoa.')}

          <div class="wizard-actions">
            <button type="button" class="btn btn-outline" data-back>Voltar</button>
            <button type="submit" class="btn btn-primary" ${errors.submitting ? 'disabled' : ''}>${icon('sparkles', 17)} Enviar denúncia</button>
          </div>
        </div>`;
    }

    function render() {
      if (result) {
        renderResult();
        return;
      }

      view.innerHTML = `
        <section class="section">
          <div class="container wizard-shell">
            <div class="section-head">
              <span class="eyebrow">${icon('filePlus', 14)} Nova denúncia</span>
              <h1 style="font-size:clamp(1.8rem,3.4vw,2.4rem)">Fazer denúncia</h1>
              <p>Três etapas, com privacidade desde o primeiro passo. Campos com <strong>*</strong> são obrigatórios; o anexo é sempre opcional.</p>
            </div>

            ${stepsBar()}

            <form class="card" style="padding:28px" novalidate>
              ${errors.server ? '<div style="margin-bottom:18px">' + UI.alertBox('danger', 'Não foi possível enviar', esc(errors.server)) + '</div>' : ''}
              ${step === 1 ? renderStepOne() : ''}
              ${step === 2 ? renderStepTwo() : ''}
              ${step === 3 ? renderStepThree() : ''}
            </form>

            <p class="small muted" style="margin-top:16px;display:flex;gap:8px;align-items:center">
              ${icon('alertTriangle', 15)} Em situação de risco imediato, acione 190, 180 ou 100 antes de registrar a denúncia.
            </p>
          </div>
        </section>`;

      bind();
      window.scrollTo(0, 0);
    }

    function bind() {
      const consent = view.querySelector('#consent');
      if (consent) {
        consent.addEventListener('change', function () { form.consent = consent.checked; });
      }

      view.querySelectorAll('input[name="modality"]').forEach(function (input) {
        input.addEventListener('change', function () {
          form.modality = input.value;
          render();
        });
      });

      const name = view.querySelector('#reporterName');
      if (name) {
        name.addEventListener('input', function () { form.reporterName = name.value; });
      }
      const preference = view.querySelector('#contactPreference');
      if (preference) {
        preference.addEventListener('change', function () {
          form.contactPreference = preference.value;
          form.contactValue = '';
          render();
        });
      }
      const contact = view.querySelector('#contactValue');
      if (contact) {
        contact.addEventListener('input', function () { form.contactValue = contact.value; });
      }

      const description = view.querySelector('#description');
      if (description) {
        description.addEventListener('input', function () {
          form.description = description.value;
          const hint = view.querySelector('#description-hint');
          if (hint) hint.textContent = form.description.trim().length + ' de 8.000 caracteres (mínimo 40).';
          window.clearTimeout(alertTimer);
          alertTimer = window.setTimeout(refreshAlerts, 400);
        });
      }

      const involved = view.querySelector('#involved');
      if (involved) {
        involved.addEventListener('input', function () {
          form.involved = involved.value;
          window.clearTimeout(alertTimer);
          alertTimer = window.setTimeout(refreshAlerts, 400);
        });
      }

      const category = view.querySelector('#category');
      if (category) {
        category.addEventListener('change', function () { form.category = category.value; });
      }

      const file = view.querySelector('#attachment');
      if (file) {
        file.addEventListener('change', function () {
          attachment = file.files && file.files[0] ? file.files[0] : null;
          errors.attachment = '';
          render();
          const refile = view.querySelector('#attachment');
          if (refile) refile.focus();
        });
      }

      UI.onClick(view, '[data-next]', function () {
        if (step === 1 && !form.consent) {
          errors.consent = 'Para continuar, é necessário aceitar o termo de consentimento informado.';
          render();
          return;
        }
        if (step === 2 && !validateStepTwo()) {
          render();
          return;
        }
        step = Math.min(3, step + 1);
        render();
      });

      UI.onClick(view, '[data-back]', function () {
        step = Math.max(1, step - 1);
        render();
      });

      const formElement = view.querySelector('form');
      if (formElement) {
        formElement.addEventListener('submit', handleSubmit);
      }
    }

    function refreshAlerts() {
      if (form.description.trim().length < 40) {
        alerts = [];
      } else {
        alerts = Analyzer.detectSensitiveData(form.description, form.involved);
      }
      const box = view.querySelector('#sensitive-alerts');
      if (!box) return;
      box.innerHTML = alerts.length ? UI.alertBox('warn', 'Possíveis dados sensíveis no relato',
        '<p>Detectamos elementos que podem identificar pessoas ou expor dados sensíveis. Recomendamos remover o que não for necessário para a apuração:</p><ul>' +
        alerts.map(function (alert) { return '<li><strong>' + esc(alert.label) + ':</strong> ' + esc(alert.recommendation) + '</li>'; }).join('') +
        '</ul>') : '';
    }

    function validateStepTwo() {
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
      errors = next;
      return Object.keys(next).length === 0;
    }

    function validateStepThree() {
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
          'application/pdf', 'image/png', 'image/jpeg', 'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowed.indexOf(attachment.type) === -1) {
          next.attachment = 'Formato não aceito. Envie PDF, PNG, JPG, DOCX ou TXT.';
        }
      }
      errors = next;
      return Object.keys(next).length === 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      errors = {};
      if (!form.consent) {
        errors.consent = 'Para continuar, é necessário aceitar o termo de consentimento informado.';
        step = 1;
        render();
        return;
      }
      if (!validateStepTwo()) {
        step = 2;
        render();
        return;
      }
      if (!validateStepThree()) {
        render();
        return;
      }

      result = Store.createReport({
        modality: form.modality,
        reporterName: form.reporterName.trim(),
        contactPreference: form.modality === 'identificada' ? form.contactPreference : '',
        contactValue: form.modality === 'identificada' ? form.contactValue.trim() : '',
        description: form.description.trim(),
        involved: form.involved.trim(),
        category: form.category,
        attachment: attachment ? { filename: attachment.name, size: attachment.size, mimetype: attachment.type } : null,
      });

      if (form.modality === 'identificada') {
        result.reporter = { name: form.reporterName.trim(), contactPreference: form.contactPreference, contactValue: form.contactValue.trim() };
      }
      renderResult();
    }

    render();
  }

  // 3. Acompanhar denúncia
  function acompanhar(view) {
    let report = null;
    let error = '';

    function renderResult() {
      const flow = Catalog.PUBLIC_STATUS_FLOW;
      const finished = ['Concluída', 'Arquivada'].indexOf(report.status) !== -1;
      const currentIndex = flow.indexOf(report.status);
      const visibleEvents = report.events.filter(function (event) { return event.visibility === 'reporter'; });

      function eventTitle(event) {
        if (event.kind === 'opened') return 'Denúncia registrada';
        if (event.kind === 'forward') return 'Encaminhamento para a área responsável';
        if (event.kind === 'message') return 'Resposta da equipe';
        if (event.kind === 'status' && event.toStatus) return 'Status atualizado: ' + event.toStatus;
        return 'Atualização do caso';
      }

      return `
        <div style="margin-top:26px">
          <div class="card" style="margin-bottom:18px">
            <div class="cluster" style="justify-content:space-between;align-items:flex-start">
              <div>
                <span class="tiny muted" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">Protocolo</span>
                <h2 class="mono" style="font-size:1.3rem">${esc(report.protocol)}</h2>
              </div>
              <div class="cluster">
                ${UI.badge(report.status, UI.statusTone[report.status] || 'slate')}
                ${UI.badge('Urgência: ' + report.urgency, UI.urgencyTone[report.urgency] || 'slate')}
              </div>
            </div>
            <div class="cluster small muted" style="margin-top:12px;gap:18px">
              <span><strong style="color:var(--ink)">Categoria:</strong> ${esc(report.category)}</span>
              ${report.area ? '<span><strong style="color:var(--ink)">Área:</strong> ' + esc(report.area) + '</span>' : ''}
              <span>${icon('clock', 14)} Registrada em ${UI.fmtDateTime(report.createdAt)}</span>
            </div>
          </div>

          <div class="card" style="margin-bottom:18px">
            <h2 style="font-size:1.05rem;margin-bottom:16px">Linha do tempo</h2>
            <div class="flow" style="grid-template-columns:repeat(${flow.length},minmax(0,1fr));margin-bottom:24px">
              ${flow.map(function (status, index) {
                const done = finished || index <= currentIndex;
                const current = !finished && index === currentIndex;
                return `<div class="flow-step" style="min-height:auto;padding:12px;border-color:${current ? 'var(--green-600)' : done ? '#c6ebda' : 'var(--line)'};background:${current ? '#f4fcf8' : done ? '#fbfefc' : '#fff'}">
                  <span class="flow-step-number" style="background:${done ? 'var(--green-600)' : 'var(--line-strong)'};margin-bottom:8px">${done && !current ? icon('check', 12) : index + 1}</span>
                  <h3 style="font-size:.8rem">${status}</h3>
                </div>`;
              }).join('')}
            </div>

            ${finished ? '<div style="margin-bottom:20px">' + UI.badge(report.status, UI.statusTone[report.status]) +
              '<p class="small muted" style="margin-top:6px">Este caso foi encerrado. As respostas da equipe permanecem disponíveis abaixo.</p></div>' : ''}

            <ul class="timeline">
              ${visibleEvents.map(function (event) {
                return `<li class="timeline-item">
                  <span class="timeline-dot" data-tone="${event.kind === 'message' ? 'green' : 'navy'}">${event.kind === 'message' ? icon('checkCircle', 14) : icon('shield', 13)}</span>
                  <div class="timeline-body">
                    <h3>${eventTitle(event)}</h3>
                    ${event.body ? '<p>' + esc(event.body) + '</p>' : ''}
                    ${event.toStatus && event.kind === 'status' ? '<p class="small muted">Novo status: ' + esc(event.toStatus) + '</p>' : ''}
                    <div class="timeline-time">${UI.fmtDateTime(event.at)}</div>
                  </div>
                </li>`;
              }).join('')}
            </ul>
          </div>

          ${UI.alertBox('info', 'Sobre o acompanhamento', 'As respostas exibidas aqui são registradas pela equipe responsável. Nenhuma decisão é tomada automaticamente pela IA: toda mudança de status passa por revisão humana.')}
        </div>`;
    }

    view.innerHTML = `
      <section class="section">
        <div class="container" style="max-width:860px">
          <div class="section-head">
            <span class="eyebrow">${icon('search', 14)} Acompanhar denúncia</span>
            <h1 style="font-size:clamp(1.8rem,3.4vw,2.4rem)">Acompanhar denúncia</h1>
            <p>Consulte o andamento com o protocolo e o código de acesso recebidos no registro. Não é necessário se identificar.</p>
          </div>

          <form class="card" novalidate>
            <div class="grid grid-2">
              <div class="field">
                <label for="protocol">Protocolo</label>
                <input id="protocol" class="input mono" placeholder="CS-2026-00001" autocomplete="off">
              </div>
              <div class="field">
                <label for="code">Código de acesso</label>
                <input id="code" class="input mono" placeholder="XXXX-XXXX" autocomplete="off">
              </div>
            </div>
            <div id="track-error"></div>
            <div class="wizard-actions" style="align-items:center">
              <p class="small muted" style="max-width:420px">Por segurança, a mensagem de erro é sempre a mesma, mesmo que apenas um dos dados esteja incorreto.</p>
              <button type="submit" class="btn btn-primary">${icon('search', 17)} Consultar denúncia</button>
            </div>
          </form>

          <div id="track-result"></div>
        </div>
      </section>`;

    const formElement = view.querySelector('form');
    const protocolInput = view.querySelector('#protocol');
    const codeInput = view.querySelector('#code');
    const resultBox = view.querySelector('#track-result');
    const errorBox = view.querySelector('#track-error');

    resultBox.innerHTML = '<div class="card card--soft" style="margin-top:22px;display:grid;gap:10px">' +
      '<strong style="color:var(--navy-900)">Onde encontro esses dados?</strong>' +
      '<p class="small muted">O protocolo tem o formato CS-2026-00001 e o código de acesso foi exibido uma única vez, na tela de confirmação do envio. Guarde os dois em local seguro: eles não podem ser recuperados.</p>' +
      '<a href="#/denuncia" class="link-arrow">Ainda não registrou? Fazer denúncia →</a></div>';

    protocolInput.addEventListener('input', function () {
      protocolInput.value = protocolInput.value.toUpperCase();
    });
    codeInput.addEventListener('input', function () {
      codeInput.value = codeInput.value.toUpperCase();
    });

    formElement.addEventListener('submit', function (event) {
      event.preventDefault();
      errorBox.innerHTML = '';
      error = '';

      if (!protocolInput.value.trim() || !codeInput.value.trim()) {
        error = 'Informe o protocolo e o código de acesso para consultar.';
      } else {
        report = Store.track(protocolInput.value, codeInput.value);
        if (!report) {
          error = 'Protocolo ou código de acesso inválidos. Confira os dados e tente novamente.';
        }
      }

      if (error) {
        errorBox.innerHTML = '<div style="margin-top:16px">' + UI.alertBox('danger', 'Consulta não realizada', esc(error)) + '</div>';
        resultBox.innerHTML = '';
        return;
      }

      resultBox.innerHTML = renderResult();
      window.scrollTo({ top: resultBox.offsetTop - 40, behavior: 'smooth' });
    });
  }

  // 4. Privacidade e LGPD
  function privacidade(view) {
    const principles = [
      { title: 'Minimização de dados', icon: 'data', text: 'Coletamos apenas o necessário para receber e apurar o relato. O canal não pede CPF, RG, matrícula, endereço, dados bancários ou dados de saúde. O anexo é sempre opcional.' },
      { title: 'Criptografia em trânsito e em repouso', icon: 'lock', text: 'O tráfego entre o navegador e o canal usa HTTPS. Os dados armazenados ficam protegidos, com credenciais restritas e sem exposição pública. Em produção, recomenda-se criptografia de disco e de backups.' },
      { title: 'Controle de acesso por função', icon: 'users', text: 'Compliance/Ouvidoria acessa o caso completo. Gestor de área vê somente denúncias encaminhadas à sua área. Auditoria/Segurança da Informação acessa apenas logs e metadados, sem o conteúdo do relato.' },
      { title: 'Logs de auditoria', icon: 'history', text: 'Cada acesso e cada alteração registra data, hora, usuário, perfil e ação. Os logs são somente leitura para quem os consulta e apoiam a investigação de acessos indevidos.' },
      { title: 'Anonimização em relatórios', icon: 'eyeOff', text: 'Painéis e relatórios gerenciais mostram apenas dados agregados, sem nomes, contatos ou qualquer elemento que permita reidentificar um denunciante anônimo.' },
      { title: 'Retenção e exclusão segura', icon: 'shield', text: 'Os dados são mantidos pelo prazo necessário à apuração e às obrigações legais e, depois, eliminados de forma segura. Prazos variam conforme a natureza do caso e a legislação aplicável.' },
      { title: 'Proteção contra retaliação', icon: 'shieldOff', text: 'Retaliação a quem denuncia de boa-fé é proibida. O canal trata o relato com confidencialidade e encaminha apenas as informações necessárias à área responsável.' },
      { title: 'Direitos do titular', icon: 'scale', text: 'Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, eliminação e informação sobre compartilhamento, além de revogar o consentimento quando aplicável. O atendimento é feito pela Ouvidoria.' },
    ];

    const aiLimits = [
      'A IA não decide se a denúncia é verdadeira ou falsa.',
      'A IA não aplica sanções a ninguém.',
      'A IA não arquiva nem conclui casos sem revisão humana.',
      'A IA não revela a identidade de um denunciante anônimo.',
      'A IA não emite parecer jurídico.',
      'A IA não compartilha dados com terceiros.',
    ];

    view.innerHTML = `
      <section class="section section--muted" style="padding-bottom:48px">
        <div class="container" style="max-width:860px">
          <span class="eyebrow">${icon('shield', 14)} Privacidade e LGPD</span>
          <h1 style="font-size:clamp(1.9rem,3.6vw,2.6rem)">Privacidade e proteção de dados</h1>
          <p style="color:var(--ink-soft);margin-top:14px;max-width:640px">
            Este canal foi desenhado com privacidade por padrão: o anonimato é possível, os dados são
            minimizados e o acesso é limitado por função. A Inteligência Artificial apoia a triagem,
            nunca a decisão.
          </p>
          <div class="cluster" style="margin-top:22px">
            ${UI.badge('LGPD', 'green')} ${UI.badge('Privacidade por padrão', 'blue')}
            ${UI.badge('Acesso por função', 'slate')} ${UI.badge('Log de auditoria', 'slate')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width:900px">
          <div class="section-head" style="margin-bottom:24px">
            <h2 style="font-size:1.4rem">Como seus dados são tratados</h2>
            <p>Oito compromissos que orientam o funcionamento do canal.</p>
          </div>
          <div class="grid grid-2">
            ${principles.map(function (item) {
              return `<article class="card"><span class="icon-badge">${icon(item.icon, 19)}</span><h3 style="font-size:1rem">${item.title}</h3><p class="small" style="color:var(--ink-soft);margin-top:6px">${item.text}</p></article>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section section--muted" id="limites-ia">
        <div class="container" style="max-width:900px">
          ${sectionHead(icon('sparkles', 14) + ' Limites da IA', 'O que a Inteligência Artificial não faz', 'A IA do canal é uma camada de apoio: ela sugere classificação, urgência e área responsável, e alerta sobre excesso de dados sensíveis. Nada além disso.')}
          <div class="grid grid-2">
            ${aiLimits.map(function (limit) {
              return `<div class="card card--flat" style="display:flex;gap:12px;align-items:flex-start">
                <span style="color:var(--red-700);flex-shrink:0;margin-top:3px">${icon('alertTriangle', 18)}</span>
                <p class="small" style="color:var(--ink-soft)">${limit}</p></div>`;
            }).join('')}
          </div>
          <div style="margin-top:22px">
            ${UI.alertBox('info', 'Sugestão, não decisão', 'Toda sugestão da IA aparece identificada como “Sugestão da IA” no painel restrito. Um responsável humano precisa confirmar ou alterar a classificação antes de qualquer encaminhamento. O nome desse responsável fica registrado no histórico.')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width:900px">
          <div class="grid grid-2" style="align-items:start">
            <div class="card">
              <h2 style="font-size:1.15rem">Anonimato e identificação</h2>
              <p class="small" style="color:var(--ink-soft);margin-top:8px">Na modalidade anônima, nenhum dado identificador é solicitado. O relato é vinculado apenas ao protocolo e ao código de acesso. Na modalidade identificada, nome e contato são opcionais e ficam restritos à equipe de Compliance — gestores de área nunca os veem.</p>
              <p class="small" style="color:var(--ink-soft);margin-top:10px">O canal não solicita CPF, RG, matrícula, endereço, dados bancários ou dados de saúde. Se você incluir esse tipo de informação no texto, a IA sinaliza o excesso e recomenda remover antes do envio.</p>
            </div>
            <div class="card">
              <h2 style="font-size:1.15rem">Transparência e projeto acadêmico</h2>
              <p class="small" style="color:var(--ink-soft);margin-top:8px">Este site é um projeto acadêmico de uma organização fictícia. Todos os dados exibidos, inclusive os de exemplo, são fictícios. Não envie dados reais de pessoas.</p>
              <p class="small" style="color:var(--ink-soft);margin-top:10px">As referências à LGPD têm finalidade educativa e não constituem parecer jurídico. Para uma implantação real, é necessário envolver encarregado de dados (DPO), jurídico e segurança da informação.</p>
              <div class="cluster" style="margin-top:16px"><a href="#/faq" class="link-arrow">Perguntas frequentes →</a></div>
            </div>
          </div>

          <div class="ai-band" style="margin-top:24px">
            <span class="ai-band-icon">${icon('shield', 26)}</span>
            <div>
              <h2>Sua denúncia é confidencial e você pode ser anônimo</h2>
              <p class="small">Registre o relato com segurança e acompanhe o caso com protocolo e código de acesso.</p>
              <div class="cluster" style="margin-top:16px">
                <a href="#/denuncia" class="btn btn-primary btn-sm">${icon('filePlus', 16)} Fazer denúncia</a>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  // 5. FAQ
  function faq(view) {
    const items = [
      { q: 'Minha denúncia é realmente anônima?', a: 'Sim. Na modalidade anônima não solicitamos nome, contato, CPF, RG, matrícula ou endereço. O relato é vinculado apenas a um protocolo e a um código de acesso. O código não revela quem você é, e a equipe não consegue identificar o autor da denúncia por meio dele. Acompanhe o caso usando os dois dados.' },
      { q: 'Como funcionam o protocolo e o código de acesso?', a: 'Ao enviar a denúncia, o canal gera um protocolo no formato CS-2026-00001 e um código de acesso único. O código é exibido uma única vez e não pode ser recuperado. Guarde os dois em local seguro: eles são a única forma de acompanhar o andamento, mesmo sem se identificar. Não compartilhe o código.' },
      { q: 'O que a Inteligência Artificial faz com o meu relato?', a: 'A IA sugere a classificação do tipo de denúncia, o nível de urgência, a área responsável e alerta quando há excesso de dados sensíveis. Se identificar linguagem de risco iminente, marca o caso como Prioridade Máxima para alerta humano. Ela não decide se a denúncia é verdadeira, não aplica sanções e não arquiva casos. O relato não é compartilhado com terceiros.' },
      { q: 'Quais são os prazos de resposta?', a: 'Os prazos variam conforme a complexidade e a área envolvida. Este projeto acadêmico não define prazos reais de apuração; em uma implantação efetiva, a organização deve publicar prazos de triagem, análise e resposta, com acompanhamento pelo protocolo. O andamento e as respostas da equipe ficam disponíveis na consulta.' },
      { q: 'Posso sofrer retaliação por denunciar?', a: 'Retaliação a quem denuncia de boa-fé é proibida. O canal adota confidencialidade, acesso por função e registro de todos os acessos em log de auditoria. Se você sofrer qualquer retaliação, registre uma nova denúncia informando o ocorrido e as pessoas envolvidas.' },
      { q: 'Preciso anexar evidências para denunciar?', a: 'Não. O anexo é sempre opcional. Você pode relatar os fatos apenas com o texto. Se tiver evidências, envie PDF, imagem, DOCX ou TXT de até 5 MB — mas não inclua dados pessoais desnecessários de terceiros.' },
      { q: 'Posso denunciar em nome de outra pessoa?', a: 'Sim, desde que a pessoa tenha autorizado e o relato seja feito de boa-fé. Nesse caso, prefira a modalidade identificada e informe apenas um contato de retorno, sem incluir dados sensíveis da outra pessoa. Se houver risco à integridade física, acione também os canais de emergência (190, 180 ou 100).' },
      { q: 'O canal substitui a polícia ou o atendimento de emergência?', a: 'Não. O canal é um instrumento de integridade e compliance. Em situações de risco imediato à vida ou à integridade física, procure primeiro a polícia (190), a Central de Atendimento à Mulher (180) ou os Direitos Humanos (100). Depois, se fizer sentido, registre a denúncia no canal.' },
      { q: 'Quem consegue ver o conteúdo da minha denúncia?', a: 'A equipe de Compliance/Ouvidoria acessa o caso completo. Gestores de área veem apenas denúncias encaminhadas à própria área e nunca a identidade de quem optou pelo anonimato. Auditoria/Segurança da Informação acessa apenas logs e metadados, sem o conteúdo do relato. Todo acesso é registrado com data, hora, usuário e ação.' },
    ];

    view.innerHTML = `
      <section class="section section--muted" style="padding-bottom:44px">
        <div class="container" style="max-width:860px">
          <span class="eyebrow">Perguntas frequentes</span>
          <h1 style="font-size:clamp(1.9rem,3.6vw,2.6rem)">Dúvidas sobre o canal</h1>
          <p style="color:var(--ink-soft);margin-top:14px;max-width:620px">Anonimato, protocolo, uso da IA, prazos, retaliação e limites do canal. Se a sua dúvida não estiver aqui, procure a Ouvidoria da organização.</p>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width:820px">
          <div class="faq-list">
            ${items.map(function (item) {
              return `<details class="faq-item"><summary>${esc(item.q)}</summary><div class="faq-answer">${esc(item.a)}</div></details>`;
            }).join('')}
          </div>
          <div class="card" style="margin-top:28px;background:var(--bg)">
            <h2 style="font-size:1.1rem">Ainda com dúvidas?</h2>
            <p class="small" style="color:var(--ink-soft);margin-top:6px">Você pode registrar uma denúncia ou acompanhar um caso existente. Em situação de risco imediato, acione 190, 180 ou 100.</p>
            <div class="cluster" style="margin-top:16px">
              <a href="#/denuncia" class="btn btn-primary btn-sm">${icon('filePlus', 16)} Fazer denúncia</a>
              <a href="#/acompanhar" class="btn btn-outline btn-sm">${icon('search', 16)} Acompanhar denúncia</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  // 6. Login do painel
  function login(view) {
    let error = '';
    let email = '';

    function render() {
      view.innerHTML = `
        <div class="auth-shell">
          <aside class="auth-aside">
            <div>
              <a href="#/" class="brand" style="color:#fff">
                <span class="brand-mark">${icon('shield', 22)}</span>
                <span class="brand-text"><span class="brand-name">Canal Seguro IA</span><span class="brand-sub">Área restrita</span></span>
              </a>
              <h1>Painel de apuração com acesso por perfil</h1>
              <p>Compliance/Ouvidoria, gestores de área e auditoria acessam apenas o que a função permite. Todo acesso é registrado em log.</p>
              <ul>
                <li>${icon('lock', 16)} Denunciantes anônimos nunca são identificados.</li>
                <li>${icon('lock', 16)} Gestor vê apenas denúncias da própria área.</li>
                <li>${icon('lock', 16)} Auditoria vê logs e metadados, sem o relato.</li>
                <li>${icon('lock', 16)} A IA sugere; a decisão é sempre humana.</li>
              </ul>
            </div>
            <p class="small" style="color:#8fa5c0">Projeto acadêmico, dados fictícios. Não utilize dados reais de pessoas.</p>
          </aside>

          <main class="auth-main">
            <div class="auth-card">
              <h2>Acessar o painel</h2>
              <p>Entre com suas credenciais institucionais.</p>

              <form class="stack" novalidate>
                ${error ? UI.alertBox('danger', 'Não foi possível entrar', esc(error)) : ''}
                <div class="field">
                  <label for="email">E-mail</label>
                  <input id="email" class="input" type="email" value="${esc(email)}" placeholder="nome@organizacao.com" autocomplete="username">
                </div>
                <div class="field">
                  <label for="password">Senha</label>
                  <input id="password" class="input" type="password" placeholder="••••••••" autocomplete="current-password">
                </div>
                <button type="submit" class="btn btn-primary btn-block">Entrar no painel</button>
              </form>

              <div class="demo-box">
                <strong>Credenciais de demonstração (dados fictícios)</strong>
                ${Catalog.USERS.map(function (user) {
                  const label = Catalog.ROLES[user.role] + (user.area ? ' — ' + user.area : '') + ' — acesso ' + (user.role === 'compliance' ? 'completo' : user.role === 'gestor' ? 'da área' : 'a logs e metadados');
                  return `<button type="button" data-demo="${esc(user.email)}">${esc(label)}
                    <span class="mono" style="display:block;font-size:.72rem;color:var(--muted)">${esc(user.email)} • senha ${Catalog.DEMO_PASSWORD}</span>
                  </button>`;
                }).join('')}
              </div>

              <p class="small muted" style="margin-top:18px"><a href="#/">← Voltar ao canal público</a></p>
            </div>
          </main>
        </div>`;

      const emailInput = view.querySelector('#email');
      const passwordInput = view.querySelector('#password');

      emailInput.addEventListener('input', function () { email = emailInput.value; });

      view.querySelectorAll('[data-demo]').forEach(function (button) {
        button.addEventListener('click', function () {
          email = button.getAttribute('data-demo');
          emailInput.value = email;
          passwordInput.value = Catalog.DEMO_PASSWORD;
          error = '';
          emailInput.focus();
        });
      });

      view.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const user = Store.login(emailInput.value, passwordInput.value);
        if (!user) {
          error = 'E-mail ou senha inválidos. Use uma das credenciais de demonstração.';
          render();
          return;
        }
        Store.addAudit(user, 'Acessou o painel');
        window.location.hash = '#/painel';
      });

      window.scrollTo(0, 0);
    }

    render();
  }

  // 7. Rota não encontrada
  function notFound(view) {
    view.innerHTML = `
      <section class="section">
        <div class="container" style="max-width:640px;text-align:center">
          <span class="eyebrow">Página não encontrada</span>
          <h1 style="font-size:2rem">Este endereço não existe</h1>
          <p style="margin-top:12px;color:var(--ink-soft)">O link pode estar incorreto ou a página foi movida. Volte ao início do canal.</p>
          <div class="cluster" style="justify-content:center;margin-top:22px">
            <a href="#/" class="btn btn-primary">Ir para o início</a>
            <a href="#/faq" class="btn btn-outline">Perguntas frequentes</a>
          </div>
        </div>
      </section>`;
  }

  return {
    home: home,
    denuncia: denuncia,
    acompanhar: acompanhar,
    privacidade: privacidade,
    faq: faq,
    login: login,
    notFound: notFound,
  };
})();
