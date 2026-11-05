# Canal Seguro IA

Canal de denúncias de uma **organização fictícia**, criado para um projeto acadêmico sobre
privacidade, LGPD e uso responsável de Inteligência Artificial. Todo o conteúdo e todos os dados
exibidos são fictícios.

## Formato

O site é feito **apenas de HTML, CSS e JavaScript básico** — sem React, sem build, sem API e sem
banco de dados. Basta abrir `index.html` no navegador (ou servir a pasta) para o canal funcionar.

- `index.html` — página única que carrega os estilos e os scripts.
- `css/styles.css` — todo o visual (mesmos tokens de cor do projeto original).
- `js/` — scripts clássicos (sem `import`), carregados na ordem do `index.html`.
- Navegação por hash (`#/denuncia`, `#/acompanhar`, `#/painel`), então os links funcionam também
  quando o arquivo é aberto direto do disco.
- Denúncias, sessão do painel e logs de auditoria ficam no `localStorage` do navegador. Na
  primeira visita, dez denúncias fictícias e os três usuários de demonstração são criados. Para
  voltar ao estado inicial, limpe os dados do site no navegador.

## O que está implementado

**Páginas públicas**
- Home com apresentação, público elegível, tipos de denúncia aceitos, o que não é aceito, fluxo em
  sete etapas, canais de entrada fictícios e aviso de transparência sobre a IA.
- Nova denúncia em três etapas (orientação de privacidade com consentimento, modalidade anônima ou
  identificada, relato com anexo opcional), com alerta de dados sensíveis durante a digitação.
- Tela de confirmação com protocolo sequencial `CS-2026-00011`, código de acesso e canais de
  emergência (190, 180, 100) quando o risco é alto.
- Acompanhamento por protocolo + código de acesso, com linha do tempo e respostas da equipe.
- Privacidade e LGPD, incluindo a seção “Limites da IA”, e FAQ.

**Painel restrito** (`#/painel`)
- Perfis: Compliance/Ouvidoria (completo), Gestor de área (somente denúncias da própria área) e
  Auditoria/Segurança da Informação (apenas logs e metadados, sem conteúdo).
- Dashboard com cards e gráficos agregados/anonimizados, alerta de plantão para Prioridade Máxima.
- Lista com filtros por status, tipo, urgência e período, com destaque para Prioridade Máxima.
- Detalhe com relato, sugestão da IA (confirmar ou alterar), alteração de status, encaminhamento,
  resposta ao denunciante, observação interna, histórico e log de acessos (somente leitura).
- 10 denúncias fictícias de tipos, status e urgências variados.

## Como executar

**Opção 1 — abrir direto:** clique duas vezes em `index.html` (ou arraste para o navegador).

**Opção 2 — servir a pasta** (recomendado, inclusive no preview):

```bash
python3 -m http.server 3000
```

Depois acesse <http://localhost:3000>. Não há instalação de dependências nem etapa de build.

## GitHub Pages

O site deve ser publicado diretamente da pasta raiz, sem compilar nem processar com Jekyll.
O arquivo `.nojekyll` na raiz indica isso ao GitHub Pages. Mantenha `index.html`, `css/`, `js/`
e `public/` juntos; os caminhos relativos funcionam também no subdiretório do repositório.

1. Incorpore as alterações da branch de trabalho ao `main`: publicar pelo `main` não inclui
   automaticamente as alterações de outras branches.
2. Em **Settings → Pages**, use **Deploy from a branch**, branch **main**, pasta **/(root)**.
3. Aguarde a execução **pages build and deployment** em **Actions** e abra o endereço indicado
   em **Settings → Pages**. A navegação deve continuar usando `#/denuncia`, `#/acompanhar` etc.

Se o site ainda não abrir, confira a resposta do endereço publicado e dos arquivos `index.html`,
`js/catalog.js` e `css/styles.css`. Uma resposta **404** significa que o Pages não está entregando
os arquivos — não é uma falha do formulário. Se a execução estiver verde e o endereço continuar
em 404, use **Re-run all jobs** na execução do Pages para refazer a publicação. Para descartar
uma versão antiga no navegador, faça uma recarga forçada (`Ctrl+Shift+R` ou `Cmd+Shift+R`).

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

Denúncias registradas no próprio navegador também geram protocolo e código, exibidos uma única vez
na tela de confirmação.

## IA: o que ela faz e o que não faz

A camada de IA roda dentro da página, sem chamadas externas, e **apenas sugere**:

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
index.html        página única (carrega CSS e scripts)
css/styles.css    estilos do site e do painel
js/catalog.js     tipos, áreas, status, perfis e usuários de demonstração
js/analyzer.js    motor local e determinístico de sugestões da IA
js/store.js       persistência em localStorage, dados de exemplo e regras
js/icons.js       ícones SVG
js/ui.js          formatação, badges, alertas e gráficos
js/pages/public.js  home, denúncia, acompanhamento, privacidade, FAQ, login
js/pages/panel.js   dashboard, lista, detalhe e auditoria
js/app.js         roteador por hash e estrutura das páginas
```

## Aviso

Projeto acadêmico, dados fictícios. As referências à LGPD têm finalidade educativa e não
constituem parecer jurídico. Não utilize dados reais de pessoas neste ambiente.
