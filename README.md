# Canal Seguro IA ---

Canal de denúncias de uma **organização fictícia**, criado para um projeto acadêmico sobre
privacidade, LGPD e uso responsável de Inteligência Artificial. Todo o conteúdo e todos os dados
exibidos são fictícios.

## O que está implementado

**Páginas públicas**
- Home com apresentação, público elegível, tipos de denúncia aceitos, o que não é aceito, fluxo em
  sete etapas, canais de entrada fictícios e aviso de transparência sobre a IA.
- Nova denúncia em três etapas (orientação de privacidade com consentimento, modalidade anônima ou
  identificada, relato com anexo opcional), com alerta de dados sensíveis durante a digitação.
- Tela de confirmação com protocolo sequencial `CS-2026-00001`, código de acesso e canais de
  emergência (190, 180, 100) quando o risco é alto.
- Acompanhamento por protocolo + código de acesso, com linha do tempo e respostas da equipe.
- Privacidade e LGPD, incluindo a seção “Limites da IA”, e FAQ.

**Painel restrito** (`/painel`)
- Perfis: Compliance/Ouvidoria (completo), Gestor de área (somente denúncias da própria área) e
  Auditoria/Segurança da Informação (apenas logs e metadados, sem conteúdo).
- Dashboard com cards e gráficos agregados/anonimizados, alerta de plantão para Prioridade Máxima.
- Lista com filtros por status, tipo, urgência e período, com destaque para Prioridade Máxima.
- Detalhe com relato, sugestão da IA (confirmar ou alterar), alteração de status, encaminhamento,
  resposta ao denunciante, observação interna, histórico e log de acessos (somente leitura).
- 10 denúncias fictícias de tipos, status e urgências variados.

## Stack

- React + Vite (front-end), React Router.
- Node.js + Express (API), PostgreSQL.
- Sessões em banco, cookie `cs_session` (HTTP-only, 8 horas), senhas com scrypt.
- IA de apoio local e determinística (`server/ai/analyzer.js`): não envia o relato a terceiros.

## Como executar

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Aplicação: <http://localhost:3000>
- API interna: `http://api:8000` (o Vite encaminha `/api`)
- PostgreSQL: serviço `db`, volume `db_data`

O container da API aplica o esquema e garante os dados de exemplo na inicialização. Para recriar o
banco do zero: `docker compose -f docker-compose.base44.yml down -v` (apaga os dados).

## Acessos de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Compliance/Ouvidoria | `compliance@canalseguro.exemplo` | `Demo@2026` |
| Gestor de área (RH) | `gestor.rh@canalseguro.exemplo` | `Demo@2026` |
| Auditoria/Segurança | `auditoria@canalseguro.exemplo` | `Demo@2026` |

Denúncias fictícias para consultar em **Acompanhar denúncia** (protocolo + código):

| Protocolo | Código |
| --- | --- |
| CS-2026-00001 | DEMO0001 |
| CS-2026-00003 | DEMO0003 |
| CS-2026-00005 | DEMO0005 |
| CS-2026-00009 | DEMO0009 |

## IA: o que ela faz e o que não faz

A camada de IA roda dentro da aplicação, sem chamadas externas, e **apenas sugere**:

1. classificação do tipo de denúncia;
2. nível de urgência (Baixo, Médio, Alto, Prioridade Máxima);
3. área responsável;
4. alerta de excesso de dados sensíveis (CPF, telefone, e-mail, endereço, saúde, dados bancários);
5. detecção de linguagem de risco iminente, elevando o caso a Prioridade Máxima para alerta humano.

Ela **não** julga veracidade, não aplica sanções, não arquiva casos, não revela identidade de
denunciante anônimo, não emite parecer jurídico e não compartilha dados com terceiros. Toda
alteração de status ou classificação registra o responsável humano.

## Estrutura

```
server/           API Express, autenticação, rotas públicas e do painel
server/ai/        motor de sugestões (IA local)
server/db/        esquema, migração idempotente e dados de exemplo
shared/           catálogo único de tipos, áreas, status e perfis
src/              front-end React (páginas públicas e painel)
docker-compose.base44.yml
```

## Aviso

Projeto acadêmico, dados fictícios. As referências à LGPD têm finalidade educativa e não
constituem parecer jurídico. Não utilize dados reais de pessoas neste ambiente.
