import type { Attempt } from "@/lib/db";
import { LEVEL_LABELS, type Level } from "@/data/questions";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) return `${remaining}s`;
  return `${minutes}min ${remaining}s`;
}

interface HistoryListProps {
  level: Level;
  highScore: number;
  attempts: Attempt[];
}

export function HistoryList({ level, highScore, attempts }: HistoryListProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-terracotta-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-ink">{LEVEL_LABELS[level]}</h3>
        <span className="flex items-center gap-1 rounded-full bg-terracotta-50 px-3 py-1 text-sm font-semibold text-terracotta-700">
          <span aria-hidden="true">🏆</span> Recorde: {highScore}/10
        </span>
      </div>
      {attempts.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Nenhuma tentativa registrada ainda neste nível.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-terracotta-50">
          {attempts.map((attempt) => (
            <li
              key={attempt.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <span className="text-ink-soft">
                {formatDate(attempt.completedAt)}
              </span>
              <span className="font-semibold text-ink">
                {attempt.score}/{attempt.totalQuestions}
              </span>
              <span className="text-ink-soft">
                {formatDuration(attempt.timeSpentSeconds)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
