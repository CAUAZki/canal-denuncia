# Instruções para agentes — Canal Seguro IA

## Ambiente de desenvolvimento

- Suba tudo com `docker compose -f docker-compose.base44.yml up -d`. O front-end fica em
  `http://localhost:3000` (porta host obrigatória) e a API é interna (`api:8000`).
- Os serviços `api` e `web` usam `node:22-alpine`, montam o repositório em `/workspace` e
  compartilham o volume nomeado `app_node_modules`. O comando de inicialização roda
  `npm install` antes de iniciar; o `api` começa primeiro e o `web` depende dele estar saudável.
  Evite rodar dois `npm install` simultâneos.
- `Dockerfile.base44` não é usado: o build do Compose não funciona neste sandbox porque
  `BASE44_CONFIG_ROOT` aponta para fora do repositório. Por isso os serviços usam a imagem Node
  diretamente.
- O banco é um serviço PostgreSQL com o volume `db_data`. `server/db/migrate.js` é idempotente e o
  `server/db/seed.js` só insere dados quando as tabelas estão vazias. Para zerar:
  `docker compose -f docker-compose.base44.yml down -v`.
- O Vite faz proxy de `/api` para `http://api:8000` (variável `API_PROXY_TARGET`), mantendo
  autenticação por cookie na mesma origem. O allowlist de hosts do preview é adicionado apenas
  quando `BASE44_PREVIEW_MODE === '1'`, usando `.${BASE44_SANDBOX_HOST_DOMAIN}`.

## Verificação

- Saúde: `curl -s http://localhost:3000/api/health`.
- Fluxo público: `POST /api/reports` (multipart, campos `consent`, `modality`, `category`,
  `description`, `involved`, opcional `attachment`) e `POST /api/reports/track` com
  `{protocol, code}`.
- Painel: `POST /api/auth/login` com `{"email","password"}`, cookie `cs_session`. Rotas em
  `/api/panel/*` (`summary`, `reports`, `reports/:id`, `logs`).
- Contas de demonstração e códigos de acompanhamento estão no README. Senha `Demo@2026`.
- Se o front-end não refletir mudanças, `docker compose ... restart web`; a API usa `node --watch`.

## Regras de negócio que não devem ser quebradas

- A IA apenas sugere. Nunca arquivar/concluir automaticamente, nunca expor identidade anônima.
- Gestor vê somente denúncias com `area_id` da própria área; auditoria só metadados/logs.
- Toda alteração de status, classificação, encaminhamento ou resposta registra o usuário em
  `audit_logs` e/ou `report_events`.
- Não pedir CPF, RG, matrícula, endereço, dados bancários ou de saúde nos formulários.
- Anonimato é o padrão; anexo é sempre opcional.

## Estilo

- Todo o conteúdo em português do Brasil. Rodapé mantém “Projeto acadêmico, dados fictícios.”
- Visual sóbrio: azul-escuro, branco e verde como destaque. Tokens em `src/styles.css`.
