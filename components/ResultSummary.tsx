import Link from "next/link";
import type { Level } from "@/data/questions";

const LEVEL_LABELS: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

interface ResultSummaryProps {
  level: Level;
  score: number;
  totalQuestions: number;
  isNewRecord: boolean;
  isSaving: boolean;
  onPlayAgain: () => void;
}

function getMessage(percentage: number): string {
  if (percentage === 100) return "Perfeito! Você dominou este nível.";
  if (percentage >= 70) return "Muito bem! Você manda bem no assunto.";
  if (percentage >= 40) return "Bom começo, continue praticando.";
  return "Vale a pena revisar o conteúdo e tentar de novo.";
}

export function ResultSummary({
  level,
  score,
  totalQuestions,
  isNewRecord,
  isSaving,
  onPlayAgain,
}: ResultSummaryProps) {
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-terracotta-100">
      <span className="rounded-full bg-terracotta-50 px-4 py-1 text-sm font-semibold text-terracotta-700">
        Nível {LEVEL_LABELS[level]}
      </span>
      <h1 className="text-3xl font-bold text-ink">
        {score}/{totalQuestions} acertos
      </h1>
      {!isSaving && isNewRecord && (
        <p className="font-semibold text-terracotta-600">
          <span aria-hidden="true">🏆</span> Novo recorde neste nível!
        </p>
      )}
      <p className="text-ink-soft">{getMessage(percentage)}</p>
      <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-xl bg-terracotta-500 px-5 py-2.5 font-semibold text-white transition hover:bg-terracotta-600"
        >
          Jogar novamente este nível
        </button>
        <Link
          href="/"
          className="rounded-xl border-2 border-terracotta-500 px-5 py-2.5 font-semibold text-terracotta-700 transition hover:bg-terracotta-50"
        >
          Escolher outro nível
        </Link>
        <Link
          href="/progresso"
          className="rounded-xl border-2 border-terracotta-500 px-5 py-2.5 font-semibold text-terracotta-700 transition hover:bg-terracotta-50"
        >
          Ver progresso
        </Link>
        <Link
          href="/"
          className="rounded-xl px-5 py-2.5 font-semibold text-ink-soft transition hover:text-ink"
        >
          Voltar à Home
        </Link>
      </div>
    </div>
  );
}
