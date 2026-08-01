export type Level = "iniciante" | "intermediario" | "avancado";

export interface Question {
  id: string;
  level: Level;
  statement: string;
  answer: boolean;
  explanation: string;
}

export const questions: Question[] = [
  // Nível Iniciante (negócio/conceitual)
  {
    id: "iniciante-1",
    level: "iniciante",
    statement:
      "Claude Code é uma ferramenta de linha de comando (CLI) desenvolvida pela Anthropic para auxiliar em tarefas de programação.",
    answer: true,
    explanation:
      "Claude Code é o agente de codificação em CLI da Anthropic, também disponível como extensão de IDE, app desktop e web.",
  },
  {
    id: "iniciante-2",
    level: "iniciante",
    statement:
      "Claude Code só pode ser usado pelo terminal; não existe integração com editores de código como VS Code.",
    answer: false,
    explanation:
      "Existem extensões para VS Code e JetBrains, além de app desktop.",
  },
  {
    id: "iniciante-3",
    level: "iniciante",
    statement:
      "Claude Code utiliza os modelos da família Claude (como Sonnet, Opus e Haiku) para entender e gerar código.",
    answer: true,
    explanation: "O Claude Code é alimentado pelos modelos Claude da Anthropic.",
  },
  {
    id: "iniciante-4",
    level: "iniciante",
    statement:
      "Claude Code pode ler arquivos, editar código e executar comandos no terminal, sempre respeitando permissões configuráveis pelo usuário.",
    answer: true,
    explanation:
      "Ações sensíveis podem exigir confirmação, conforme o modo de permissão configurado.",
  },
  {
    id: "iniciante-5",
    level: "iniciante",
    statement:
      "Claude Code só pode ser usado por assinatura; não é possível pagar por uso via API.",
    answer: false,
    explanation:
      "Claude Code pode ser usado tanto com planos de assinatura (ex: Pro, Max) quanto com cobrança por uso via API.",
  },
  {
    id: "iniciante-6",
    level: "iniciante",
    statement:
      "Claude Code serve apenas para escrever código novo; não é capaz de revisar código existente ou corrigir bugs.",
    answer: false,
    explanation:
      "Também é usado para revisão de código, debugging, refatoração e mais.",
  },
  {
    id: "iniciante-7",
    level: "iniciante",
    statement:
      "Claude Code pode auxiliar na criação de commits e pull requests em repositórios Git/GitHub.",
    answer: true,
    explanation: "É uma das tarefas comuns suportadas pela ferramenta.",
  },
  {
    id: "iniciante-8",
    level: "iniciante",
    statement:
      "É obrigatório já ser um programador experiente para conseguir usar o Claude Code.",
    answer: false,
    explanation:
      "Pode ser usado por pessoas com diferentes níveis de experiência técnica, embora seja voltado principalmente a tarefas de desenvolvimento.",
  },
  {
    id: "iniciante-9",
    level: "iniciante",
    statement:
      "Claude Code funciona totalmente offline, sem necessidade de conexão com a internet.",
    answer: false,
    explanation:
      "Precisa se conectar aos modelos Claude (via API da Anthropic ou provedores de nuvem) para funcionar.",
  },
  {
    id: "iniciante-10",
    level: "iniciante",
    statement:
      "Claude Code faz parte do ecossistema de produtos da Anthropic, a mesma empresa por trás do modelo Claude.",
    answer: true,
    explanation:
      "Anthropic é a empresa criadora do Claude Code e dos modelos Claude.",
  },

  // Nível Intermediário
  {
    id: "intermediario-1",
    level: "intermediario",
    statement:
      "Arquivos chamados CLAUDE.md podem ser usados para fornecer contexto e instruções persistentes sobre um projeto ao Claude Code.",
    answer: true,
    explanation:
      "É um mecanismo comum para documentar convenções e contexto do projeto.",
  },
  {
    id: "intermediario-2",
    level: "intermediario",
    statement:
      'Comandos de barra ("slash commands"), como /help ou /clear, são usados no Claude Code para executar ações rápidas dentro da sessão.',
    answer: true,
    explanation: "São comandos especiais reconhecidos pela interface do Claude Code.",
  },
  {
    id: "intermediario-3",
    level: "intermediario",
    statement:
      "O Claude Code não permite a criação de comandos personalizados (custom slash commands) pelo usuário.",
    answer: false,
    explanation: "É possível criar comandos de barra personalizados para o projeto.",
  },
  {
    id: "intermediario-4",
    level: "intermediario",
    statement:
      'O "Plan Mode" do Claude Code permite que o assistente apresente um plano de implementação antes de executar mudanças no código.',
    answer: true,
    explanation:
      "O modo de planejamento é usado para alinhar a abordagem antes de agir.",
  },
  {
    id: "intermediario-5",
    level: "intermediario",
    statement:
      'Subagentes ("subagents") no Claude Code são sempre o mesmo agente genérico; não é possível especializá-los para tarefas específicas.',
    answer: false,
    explanation:
      "É possível definir subagentes especializados com ferramentas e instruções próprias.",
  },
  {
    id: "intermediario-6",
    level: "intermediario",
    statement:
      "O Model Context Protocol (MCP) é um padrão aberto, criado pela Anthropic, para conectar assistentes de IA a ferramentas e fontes de dados externas.",
    answer: true,
    explanation:
      "MCP permite integrar o Claude Code a serviços externos como GitHub, Slack, bancos de dados etc.",
  },
  {
    id: "intermediario-7",
    level: "intermediario",
    statement:
      'Claude Code não possui suporte a "hooks" (ganchos) que executam comandos automaticamente em resposta a eventos.',
    answer: false,
    explanation:
      "Hooks permitem disparar comandos antes/depois de certas ações do agente.",
  },
  {
    id: "intermediario-8",
    level: "intermediario",
    statement:
      "É possível configurar diferentes níveis de permissão no Claude Code para controlar quais ações a IA pode executar automaticamente sem confirmação.",
    answer: true,
    explanation:
      "Existem modos de permissão que vão de mais restritivos a mais autônomos.",
  },
  {
    id: "intermediario-9",
    level: "intermediario",
    statement:
      "O Claude Code sempre executa todas as ações imediatamente, sem nunca pedir confirmação para ações sensíveis.",
    answer: false,
    explanation:
      "Ações consideradas arriscadas normalmente pedem confirmação do usuário.",
  },
  {
    id: "intermediario-10",
    level: "intermediario",
    statement:
      "Claude Code pode ser integrado a servidores MCP para acessar ferramentas como Slack, GitHub ou bancos de dados.",
    answer: true,
    explanation:
      "Essa é justamente a finalidade do protocolo MCP dentro do Claude Code.",
  },

  // Nível Avançado (técnico)
  {
    id: "avancado-1",
    level: "avancado",
    statement:
      'O Claude Code oferece um modo "headless" (não interativo) que permite executá-lo em scripts e pipelines de automação.',
    answer: true,
    explanation:
      "Esse modo permite uso programático/automatizado sem interface interativa de terminal.",
  },
  {
    id: "avancado-2",
    level: "avancado",
    statement:
      "O Claude Agent SDK permite que desenvolvedores construam seus próprios agentes autônomos usando a mesma infraestrutura do Claude Code.",
    answer: true,
    explanation: "O SDK expõe a base do Claude Code para criação de agentes customizados.",
  },
  {
    id: "avancado-3",
    level: "avancado",
    statement:
      "Claude Code só pode se conectar diretamente à API da Anthropic; não há suporte a provedores de nuvem como Amazon Bedrock ou Google Vertex AI.",
    answer: false,
    explanation:
      "Há suporte para uso via Bedrock e Vertex AI, além da API direta da Anthropic.",
  },
  {
    id: "avancado-4",
    level: "avancado",
    statement:
      'Hooks como "PreToolUse" e "PostToolUse" permitem executar comandos de shell antes ou depois do uso de uma ferramenta pelo agente.',
    answer: true,
    explanation: "São exemplos de eventos de hook suportados pelo Claude Code.",
  },
  {
    id: "avancado-5",
    level: "avancado",
    statement:
      "O cache de prompt (prompt caching) é uma técnica usada para reduzir custo e latência ao reaproveitar partes repetidas do contexto entre requisições.",
    answer: true,
    explanation:
      "É uma otimização suportada pelos modelos Claude e aproveitada pelo Claude Code.",
  },
  {
    id: "avancado-6",
    level: "avancado",
    statement:
      "O Claude Code não possui nenhum mecanismo de sandboxing ou isolamento para limitar comandos potencialmente perigosos.",
    answer: false,
    explanation:
      "Existem mecanismos de permissão/sandbox para reduzir riscos de comandos destrutivos.",
  },
  {
    id: "avancado-7",
    level: "avancado",
    statement:
      "Ferramentas como Read, Write, Edit, Bash, Glob e Grep são exemplos de ferramentas internas usadas pelo Claude Code para interagir com arquivos e terminal.",
    answer: true,
    explanation: "São ferramentas nativas comuns na caixa de ferramentas do agente.",
  },
  {
    id: "avancado-8",
    level: "avancado",
    statement:
      "O arquivo de configuração de permissões (settings.json) não permite definir regras específicas para permitir ou negar comandos automaticamente.",
    answer: false,
    explanation:
      "É possível definir listas de permissão/negação granulares nesse arquivo.",
  },
  {
    id: "avancado-9",
    level: "avancado",
    statement:
      "Tarefas agendadas (scheduled tasks) e loops permitem que o Claude Code execute ações repetidamente em intervalos definidos, sem intervenção manual a cada execução.",
    answer: true,
    explanation: "Esses recursos existem para automação recorrente.",
  },
  {
    id: "avancado-10",
    level: "avancado",
    statement:
      "O contexto da conversa no Claude Code é sempre limitado à janela de contexto do modelo e nunca pode ser resumido ou compactado automaticamente.",
    answer: false,
    explanation:
      "O sistema pode compactar/resumir automaticamente o histórico conforme se aproxima do limite de contexto.",
  },
];

export function getQuestionsByLevel(level: Level): Question[] {
  return questions.filter((question) => question.level === level);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id);
}
