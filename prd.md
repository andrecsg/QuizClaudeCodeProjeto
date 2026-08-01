# PRD — Quiz Web: Verdadeiro ou Falso sobre Claude Code

## 1. Visão Geral

**Nome do projeto:** Quiz Claude Code
**Tipo:** Aplicação Web (SPA) de quiz educativo, formato Verdadeiro/Falso
**Objetivo de negócio:** Criar uma experiência interativa e gamificada que ensina e testa o conhecimento das pessoas sobre a ferramenta Claude Code (CLI da Anthropic), cobrindo desde conceitos de negócio/produto (para não-técnicos e stakeholders) até detalhes técnicos avançados (para desenvolvedores).

**Público-alvo:**
- Iniciante: profissionais de negócio, gestores, curiosos sobre IA que querem entender o que é o Claude Code e seu valor.
- Intermediário/Avançado: desenvolvedores e usuários técnicos que já usam ou pretendem usar o Claude Code no dia a dia.

**Proposta de valor:** Reforçar aprendizado sobre Claude Code de forma leve e rápida (quiz de ~5-10 min por nível), servindo como material de onboarding, treinamento interno ou conteúdo de divulgação.

## 2. Escopo

### Dentro do escopo (MVP)
- Quiz de Verdadeiro/Falso com 3 níveis de dificuldade progressivos: **Iniciante**, **Intermediário**, **Avançado**.
- 10 perguntas por nível (30 perguntas no total) — banco de perguntas fornecido neste PRD (seção 7).
- Timer por pergunta (contagem regressiva individual).
- Feedback imediato após cada resposta: indicação de certo/errado + explicação breve (1-2 frases).
- Tela de resultado final por nível, com resumo de acertos/erros.
- **Persistência local no navegador via IndexedDB** (sem servidor/backend), armazenando:
  - Perfil simples do jogador (nome informado, sem senha/login).
  - Histórico de tentativas por nível (data, pontuação, tempo gasto).
  - Melhor pontuação (high score) por nível.
  - Respostas erradas de cada tentativa, para permitir revisão posterior.
- Tela de "Meu Progresso"/Histórico, com melhores pontuações, tentativas anteriores e revisão de perguntas erradas.
- Tema visual inspirado na identidade da Anthropic/Claude.
- Responsivo (desktop e mobile).

### Fora do escopo (não fazer no MVP)
- Autenticação de usuários / contas com senha.
- Backend/servidor de dados ou banco de dados remoto (persistência é 100% local, no navegador, via IndexedDB).
- Ranking global / leaderboard multiplayer (dados não saem do navegador do usuário).
- Sincronização entre dispositivos/navegadores.
- Internacionalização (idioma único: Português - Brasil).
- Edição de perguntas via interface administrativa (banco de perguntas é estático, editado via código).

### Possíveis evoluções futuras (fora do MVP, mencionar como backlog)
- Exportar/importar histórico (ex: backup em JSON).
- Painel admin para gerenciar perguntas.
- Compartilhamento de resultado em redes sociais.
- Mais níveis/categorias (ex: MCP, Hooks, Agent SDK como trilhas separadas).
- Sincronização de progresso via backend real, caso o projeto evolua além do MVP local.

## 3. Requisitos Funcionais

### 3.1 Fluxo principal do usuário
1. **Onboarding de perfil (primeira visita):** ao acessar pela primeira vez (sem nome salvo no IndexedDB), exibir um modal/tela simples pedindo o nome do jogador (sem senha). O nome fica salvo localmente e é reutilizado em visitas futuras nesse mesmo navegador. Deve haver opção de editar o nome depois (ex: a partir da tela de Histórico).
2. **Tela Home:** título do quiz, breve descrição, saudação com o nome do jogador, seleção de nível (Iniciante / Intermediário / Avançado) e link/botão para "Meu Progresso". Deve deixar claro que os níveis são independentes (usuário pode jogar em qualquer ordem).
3. **Tela de Quiz (jogo):**
   - Exibe uma pergunta por vez, com opções "Verdadeiro" e "Falso".
   - Timer visível por pergunta (contagem regressiva).
   - Ao expirar o tempo sem resposta, a pergunta é marcada como errada automaticamente e o fluxo segue para o feedback.
   - Barra/indicador de progresso (ex: "Pergunta 3 de 10").
4. **Feedback por pergunta:**
   - Após responder (ou tempo esgotar), mostrar imediatamente se acertou ou errou.
   - Exibir explicação breve (1-2 frases) sobre a resposta correta.
   - Botão "Próxima pergunta" (ou avanço automático após alguns segundos).
5. **Tela de Resultado (fim do nível):**
   - Pontuação final (ex: "7/10 acertos").
   - Resumo visual (ex: barra de progresso, mensagem motivacional conforme desempenho).
   - Indicação se foi um novo recorde (high score) para aquele nível.
   - Ao concluir o nível, a tentativa é salva automaticamente no IndexedDB (pontuação, data/hora, tempo gasto, perguntas erradas).
   - Opções: "Jogar novamente este nível", "Escolher outro nível", "Ver progresso", "Voltar à Home".
6. **Tela "Meu Progresso" (Histórico):**
   - Melhor pontuação (high score) por nível.
   - Lista de tentativas anteriores por nível (data, pontuação, tempo gasto), mais recentes primeiro.
   - Seção "Revisar erros": lista as perguntas que o jogador mais errou (ou errou na última tentativa), mostrando enunciado, resposta correta e explicação.
   - Opção de editar o nome do jogador.

### 3.2 Regras de negócio
- Cada nível tem exatamente 10 perguntas, na ordem definida no banco (ou embaralhadas — ver seção 8, decisão em aberto/assumida).
- Timer por pergunta: **20 segundos** (valor padrão sugerido, configurável em constante do código).
- Não há penalidade adicional por errar além de não pontuar; não há eliminação/game over.
- Pontuação da partida em andamento é apenas em memória (recarregar a página no meio de um nível reinicia aquela tentativa específica).
- Ao final de cada nível (tentativa completa), o resultado é persistido automaticamente no IndexedDB do navegador — isso sobrevive a fechar/reabrir o navegador, mas é local a cada dispositivo/navegador (sem sincronização entre eles).
- Nome do jogador é armazenado localmente e não requer validação/autenticação — é apenas identificação amigável.

## 4. Requisitos Não-Funcionais
- **Responsividade:** funcionar bem em telas mobile (360px+) e desktop.
- **Performance:** carregamento inicial rápido (sem backend, apenas assets estáticos); build otimizado do Next.js.
- **Acessibilidade:** contraste adequado, navegação por teclado nas opções de resposta, textos alternativos em ícones.
- **Sem dependência de backend/servidor de dados** — toda a lógica roda no cliente (client-side); banco de perguntas embutido como dado estático (JSON/TS) e progresso do jogador persistido localmente via IndexedDB no navegador.
- **Resiliência de dados local:** falhas ao acessar o IndexedDB (ex: navegador em modo privado que restringe storage) não devem quebrar o quiz — o jogo deve continuar funcionável mesmo sem conseguir salvar o histórico, apenas sem persistir o progresso.
- **Idioma:** Português (Brasil).

## 5. Especificação Técnica

### 5.1 Stack
- **Framework:** Next.js (App Router), React, TypeScript.
- **Estilização:** CSS Modules ou Tailwind CSS (a critério da implementação; recomenda-se Tailwind para agilidade).
- **Estado:** gerenciamento local via React state/hooks (`useState`/`useReducer`) — sem necessidade de biblioteca externa de estado global dado o escopo pequeno.
- **Persistência local:** IndexedDB no navegador, acessado via uma camada utilitária própria (ou biblioteca leve como `idb`) — sem backend/API própria. Todo acesso ao IndexedDB deve ocorrer em componentes/hooks client-side (`"use client"`), nunca durante render no servidor.
- **Deploy sugerido:** Vercel (compatível nativamente com Next.js), mas o projeto deve poder rodar localmente via `npm run dev`.

### 5.2 Arquitetura de dados

**Banco de perguntas** — arquivo estático tipado, por exemplo `data/questions.ts`:

```ts
export type Level = "iniciante" | "intermediario" | "avancado";

export interface Question {
  id: string;
  level: Level;
  statement: string;       // enunciado da pergunta (afirmação a ser avaliada)
  answer: boolean;         // true = Verdadeiro, false = Falso
  explanation: string;     // explicação breve exibida no feedback
}
```

**Persistência local (IndexedDB)** — banco de dados no navegador, por exemplo `quiz-claude-code-db`, com as seguintes object stores:

```ts
// Object store "player" (registro único)
export interface Player {
  id: string;          // id fixo, ex: "local-player"
  name: string;
  createdAt: string;   // ISO date
}

// Object store "attempts" (histórico de tentativas)
export interface Attempt {
  id: string;                 // uuid
  level: Level;
  score: number;               // acertos
  totalQuestions: number;      // 10
  timeSpentSeconds: number;
  completedAt: string;         // ISO date
  wrongQuestionIds: string[];  // ids das perguntas erradas nessa tentativa
}

// Derivado (não precisa de store própria): high score por nível
// = maior "score" entre todos os Attempts daquele "level"
```

Funções utilitárias sugeridas em `lib/db.ts`: `getOrCreatePlayer()`, `updatePlayerName(name)`, `saveAttempt(attempt)`, `getAttemptsByLevel(level)`, `getHighScore(level)`, `getWrongQuestionsSummary()`.

### 5.3 Estrutura de telas/rotas sugerida (Next.js App Router)
- `/` — Home (seleção de nível, saudação ao jogador, acesso ao progresso)
- `/quiz/[level]` — Tela de jogo para o nível selecionado
- `/quiz/[level]/resultado` — Tela de resultado (ou gerenciado como estado dentro da mesma rota `/quiz/[level]`, evitando rota extra)
- `/progresso` — Tela "Meu Progresso": high scores, histórico de tentativas e revisão de erros

### 5.4 Componentes principais sugeridos
- `PlayerOnboarding` — modal/tela de captura do nome do jogador na primeira visita.
- `LevelSelector` — cards de seleção de nível na Home.
- `QuestionCard` — exibe pergunta, opções V/F, timer.
- `Timer` — componente de contagem regressiva reutilizável.
- `FeedbackPanel` — exibe resultado da resposta + explicação.
- `ResultSummary` — tela final com pontuação e indicação de novo recorde.
- `ProgressBar` — indicador de progresso dentro do quiz.
- `HistoryList` — lista de tentativas anteriores por nível.
- `WrongAnswersReview` — lista de perguntas erradas com explicação, usada na tela de progresso.
- `useIndexedDB` (hook) — encapsula abertura da conexão e chamadas às funções de `lib/db.ts`.

## 6. Design / UI

**Tema visual:** inspirado na identidade da Anthropic/Claude.
- Paleta: tons terracota/laranja queimado como cor primária, tons neutros em creme/branco para fundo, texto em cinza-escuro/preto para contraste.
- Tipografia limpa e legível (sans-serif).
- Cards com bordas suaves/arredondadas, respiro visual generoso (whitespace).
- Feedback de acerto em verde, erro em vermelho/terracota escuro — mantendo harmonia com a paleta.
- Ícones simples para "Verdadeiro" (✓) e "Falso" (✗) nas opções de resposta (usar sem exagero de emojis conforme preferência de estilo minimalista).
- Onboarding de nome: modal leve e não intrusivo, com campo de texto único e botão "Começar" (nome pode ser opcional/"Jogador" como padrão, para não bloquear quem não quiser informar).
- Tela de Progresso: destaque visual para o high score de cada nível (ex: cards com selo/troféu), lista de tentativas em formato de tabela/lista simples, e seção de revisão de erros com o mesmo padrão visual do `FeedbackPanel` usado durante o quiz.

## 7. Banco de Perguntas (MVP — 30 perguntas)

> Formato: cada pergunta é uma afirmação; o usuário responde Verdadeiro ou Falso. `answer: true` significa que a afirmação é **Verdadeira**; `answer: false` significa que é **Falsa**.

### Nível Iniciante (negócio/conceitual)

1. **Claude Code é uma ferramenta de linha de comando (CLI) desenvolvida pela Anthropic para auxiliar em tarefas de programação.**
   `answer: true` — Claude Code é o agente de codificação em CLI da Anthropic, também disponível como extensão de IDE, app desktop e web.

2. **Claude Code só pode ser usado pelo terminal; não existe integração com editores de código como VS Code.**
   `answer: false` — Existem extensões para VS Code e JetBrains, além de app desktop.

3. **Claude Code utiliza os modelos da família Claude (como Sonnet, Opus e Haiku) para entender e gerar código.**
   `answer: true` — O Claude Code é alimentado pelos modelos Claude da Anthropic.

4. **Claude Code pode ler arquivos, editar código e executar comandos no terminal, sempre respeitando permissões configuráveis pelo usuário.**
   `answer: true` — Ações sensíveis podem exigir confirmação, conforme o modo de permissão configurado.

5. **Claude Code só pode ser usado por assinatura; não é possível pagar por uso via API.**
   `answer: false` — Claude Code pode ser usado tanto com planos de assinatura (ex: Pro, Max) quanto com cobrança por uso via API.

6. **Claude Code serve apenas para escrever código novo; não é capaz de revisar código existente ou corrigir bugs.**
   `answer: false` — Também é usado para revisão de código, debugging, refatoração e mais.

7. **Claude Code pode auxiliar na criação de commits e pull requests em repositórios Git/GitHub.**
   `answer: true` — É uma das tarefas comuns suportadas pela ferramenta.

8. **É obrigatório já ser um programador experiente para conseguir usar o Claude Code.**
   `answer: false` — Pode ser usado por pessoas com diferentes níveis de experiência técnica, embora seja voltado principalmente a tarefas de desenvolvimento.

9. **Claude Code funciona totalmente offline, sem necessidade de conexão com a internet.**
   `answer: false` — Precisa se conectar aos modelos Claude (via API da Anthropic ou provedores de nuvem) para funcionar.

10. **Claude Code faz parte do ecossistema de produtos da Anthropic, a mesma empresa por trás do modelo Claude.**
    `answer: true` — Anthropic é a empresa criadora do Claude Code e dos modelos Claude.

### Nível Intermediário

1. **Arquivos chamados CLAUDE.md podem ser usados para fornecer contexto e instruções persistentes sobre um projeto ao Claude Code.**
   `answer: true` — É um mecanismo comum para documentar convenções e contexto do projeto.

2. **Comandos de barra ("slash commands"), como /help ou /clear, são usados no Claude Code para executar ações rápidas dentro da sessão.**
   `answer: true` — São comandos especiais reconhecidos pela interface do Claude Code.

3. **O Claude Code não permite a criação de comandos personalizados (custom slash commands) pelo usuário.**
   `answer: false` — É possível criar comandos de barra personalizados para o projeto.

4. **O "Plan Mode" do Claude Code permite que o assistente apresente um plano de implementação antes de executar mudanças no código.**
   `answer: true` — O modo de planejamento é usado para alinhar a abordagem antes de agir.

5. **Subagentes ("subagents") no Claude Code são sempre o mesmo agente genérico; não é possível especializá-los para tarefas específicas.**
   `answer: false` — É possível definir subagentes especializados com ferramentas e instruções próprias.

6. **O Model Context Protocol (MCP) é um padrão aberto, criado pela Anthropic, para conectar assistentes de IA a ferramentas e fontes de dados externas.**
   `answer: true` — MCP permite integrar o Claude Code a serviços externos como GitHub, Slack, bancos de dados etc.

7. **Claude Code não possui suporte a "hooks" (ganchos) que executam comandos automaticamente em resposta a eventos.**
   `answer: false` — Hooks permitem disparar comandos antes/depois de certas ações do agente.

8. **É possível configurar diferentes níveis de permissão no Claude Code para controlar quais ações a IA pode executar automaticamente sem confirmação.**
   `answer: true` — Existem modos de permissão que vão de mais restritivos a mais autônomos.

9. **O Claude Code sempre executa todas as ações imediatamente, sem nunca pedir confirmação para ações sensíveis.**
   `answer: false` — Ações consideradas arriscadas normalmente pedem confirmação do usuário.

10. **Claude Code pode ser integrado a servidores MCP para acessar ferramentas como Slack, GitHub ou bancos de dados.**
    `answer: true` — Essa é justamente a finalidade do protocolo MCP dentro do Claude Code.

### Nível Avançado (técnico)

1. **O Claude Code oferece um modo "headless" (não interativo) que permite executá-lo em scripts e pipelines de automação.**
   `answer: true` — Esse modo permite uso programático/automatizado sem interface interativa de terminal.

2. **O Claude Agent SDK permite que desenvolvedores construam seus próprios agentes autônomos usando a mesma infraestrutura do Claude Code.**
   `answer: true` — O SDK expõe a base do Claude Code para criação de agentes customizados.

3. **Claude Code só pode se conectar diretamente à API da Anthropic; não há suporte a provedores de nuvem como Amazon Bedrock ou Google Vertex AI.**
   `answer: false` — Há suporte para uso via Bedrock e Vertex AI, além da API direta da Anthropic.

4. **Hooks como "PreToolUse" e "PostToolUse" permitem executar comandos de shell antes ou depois do uso de uma ferramenta pelo agente.**
   `answer: true` — São exemplos de eventos de hook suportados pelo Claude Code.

5. **O cache de prompt (prompt caching) é uma técnica usada para reduzir custo e latência ao reaproveitar partes repetidas do contexto entre requisições.**
   `answer: true` — É uma otimização suportada pelos modelos Claude e aproveitada pelo Claude Code.

6. **O Claude Code não possui nenhum mecanismo de sandboxing ou isolamento para limitar comandos potencialmente perigosos.**
   `answer: false` — Existem mecanismos de permissão/sandbox para reduzir riscos de comandos destrutivos.

7. **Ferramentas como Read, Write, Edit, Bash, Glob e Grep são exemplos de ferramentas internas usadas pelo Claude Code para interagir com arquivos e terminal.**
   `answer: true` — São ferramentas nativas comuns na caixa de ferramentas do agente.

8. **O arquivo de configuração de permissões (settings.json) não permite definir regras específicas para permitir ou negar comandos automaticamente.**
   `answer: false` — É possível definir listas de permissão/negação granulares nesse arquivo.

9. **Tarefas agendadas (scheduled tasks) e loops permitem que o Claude Code execute ações repetidamente em intervalos definidos, sem intervenção manual a cada execução.**
   `answer: true` — Esses recursos existem para automação recorrente.

10. **O contexto da conversa no Claude Code é sempre limitado à janela de contexto do modelo e nunca pode ser resumido ou compactado automaticamente.**
    `answer: false` — O sistema pode compactar/resumir automaticamente o histórico conforme se aproxima do limite de contexto.

## 8. Premissas e Decisões Assumidas
- Perguntas de cada nível são exibidas na ordem do banco por padrão; **embaralhar (shuffle) a ordem a cada nova tentativa** é recomendado para melhorar replay, mas fica como decisão de implementação (sugestão: sim, embaralhar).
- Timer de 20 segundos por pergunta é um valor inicial sugerido; deve ser fácil de ajustar (constante centralizada).
- Sem multiplayer, sem contas de usuário com senha, sem coleta de dados pessoais sensíveis — apenas um nome informado livremente, guardado só no navegador do próprio usuário.
- Persistência é local por navegador/dispositivo (IndexedDB): limpar dados do navegador ou trocar de dispositivo reinicia o progresso; não há sincronização entre dispositivos.
- "Nome do jogador" não passa por nenhuma validação de unicidade nem é enviado a servidor algum — existe apenas para personalizar a experiência localmente.
- Todo o conteúdo é em Português (Brasil).

## 9. Critérios de Aceite (MVP)
- [ ] Na primeira visita, o usuário é convidado a informar um nome, salvo localmente e reaproveitado em visitas futuras.
- [ ] Usuário consegue escolher entre os 3 níveis na Home.
- [ ] Cada nível apresenta exatamente 10 perguntas Verdadeiro/Falso do banco definido na seção 7.
- [ ] Timer por pergunta funciona e, ao zerar, conta como resposta errada automaticamente.
- [ ] Após cada resposta, o usuário recebe feedback imediato (certo/errado + explicação).
- [ ] Ao final do nível, é exibida a pontuação total, indicação de novo recorde (se aplicável) e opções de jogar novamente ou voltar à Home.
- [ ] Ao concluir um nível, a tentativa (pontuação, data, tempo, erros) é salva no IndexedDB do navegador.
- [ ] A tela "Meu Progresso" exibe corretamente o high score por nível, o histórico de tentativas e permite revisar as perguntas erradas com suas explicações.
- [ ] Fechar e reabrir o navegador preserva o nome do jogador e o histórico salvo (mesmo dispositivo/navegador).
- [ ] Aplicação é responsiva em mobile e desktop.
- [ ] Nenhuma chamada a backend/servidor de dados é necessária para o funcionamento do quiz ou da persistência (100% local via IndexedDB).
- [ ] Visual segue paleta inspirada na identidade Anthropic/Claude (terracota + neutros).

## 10. Como este PRD deve ser usado
Este documento deve ser fornecido ao Claude Code como especificação de referência para gerar o projeto Next.js completo (estrutura de pastas, componentes, dados e estilos), implementando o fluxo descrito na seção 3, a arquitetura da seção 5 e o banco de perguntas da seção 7.
