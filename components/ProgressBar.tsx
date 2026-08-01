interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const clampedCurrent = Math.min(current, total);
  const percentage = total > 0 ? (clampedCurrent / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="mb-1 text-sm text-ink-soft">
        Pergunta {clampedCurrent} de {total}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-terracotta-50"
        role="progressbar"
        aria-valuenow={clampedCurrent}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-terracotta-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
