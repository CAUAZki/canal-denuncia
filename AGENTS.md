# Instruções para agentes — Canal Seguro IA

## Formato do projeto

- O site é **HTML, CSS e JavaScript puro**: `index.html`, `css/styles.css` e scripts clássicos em
  `js/`. Não há React, Vite, Node, Express, banco de dados, `npm install` nem build.
- O ponto de entrada é `index.html`, que carrega os scripts na ordem:
  `catalog.js`, `analyzer.js`, `store.js`, `icons.js`, `ui.js`, `pages/public.js`,
  `pages/panel.js`, `app.js`. Cada arquivo publica um único global (`Catalog`, `Analyzer`,
  `Store`, `Icons`, `UI`, `PublicPages`, `PanelPages`).
- Navegação por hash (`#/`, `#/denuncia`, `#/acompanhar`, `#/privacidade`, `#/faq`,
  `#/painel/login`, `#/painel`, `#/painel/denuncias`, `#/painel/denuncias/:id`,
  `#/painel/auditoria`), para funcionar também ao abrir o arquivo direto do disco.
- Denúncias, logs de auditoria e sessão ficam no `localStorage` (`canalSeguroIA.v1`). Na primeira
  visita, `Store` cria as 10 denúncias fictícias e os 3 usuários de demonstração. Para zerar, limpe
  os dados do site no navegador.
- O preview é servido por um servidor estático na porta 3000 (configuração de ambiente externa).
  Não há servidor de desenvolvimento: recarregar o navegador já mostra as alterações.

## Verificação

- `curl -s http://localhost:3000/` deve devolver o `index.html`.
- Fluxo público: `#/denuncia` (três etapas, consentimento obrigatório) gera protocolo
  `CS-<ano>-NNNNN` e código de acesso; `#/acompanhar` consulta com protocolo + código.
- Painel: login com as contas de demonstração (senha `Demo@2026`) e rotas
  `#/painel`, `#/painel/denuncias`, `#/painel/denuncias/:id`, `#/painel/auditoria`.
- Contas e códigos de acompanhamento estão no README.

## Regras de negócio que não devem ser quebradas

- A IA apenas sugere. Nunca arquivar/concluir automaticamente, nunca expor identidade anônima.
- Gestor vê somente denúncias da própria área; auditoria só metadados/logs.
- Toda alteração de status, classificação, encaminhamento ou resposta registra o usuário em
  `audit_logs` e/ou no histórico da denúncia.
- Não pedir CPF, RG, matrícula, endereço, dados bancários ou de saúde nos formulários.
- Anonimato é o padrão; anexo é sempre opcional.

## Estilo

- Todo o conteúdo em português do Brasil. Rodapé mantém “Projeto acadêmico, dados fictícios.”
- Visual sóbrio: azul-escuro, branco e verde como destaque. Tokens em `css/styles.css`.
