import Link from "next/link";
import type { Level } from "@/data/questions";

const LEVELS: { level: Level; label: string; description: string }[] = [
  {
    level: "iniciante",
    label: "Iniciante",
    description: "Conceitos de negócio e visão geral do Claude Code.",
  },
  {
    level: "intermediario",
    label: "Intermediário",
    description:
      "Recursos do dia a dia: CLAUDE.md, slash commands, MCP e mais.",
  },
  {
    level: "avancado",
    label: "Avançado",
    description: "Detalhes técnicos: SDK, hooks, sandboxing, automação.",
  },
];

export function LevelSelector() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {LEVELS.map(({ level, label, description }) => (
        <Link
          key={level}
          href={`/quiz/${level}`}
          className="flex flex-col gap-2 rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-terracotta-100 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-lg font-bold text-terracotta-700">
            {label}
          </span>
          <span className="text-sm text-ink-soft">{description}</span>
          <span className="mt-2 text-sm font-semibold text-terracotta-500">
            Jogar →
          </span>
        </Link>
      ))}
    </div>
  );
}
