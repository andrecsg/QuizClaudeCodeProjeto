import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-terracotta-100 sm:p-8">
      <p className="text-lg font-medium text-ink sm:text-xl">
        {question.statement}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAnswer(true)}
          disabled={disabled}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-success bg-success-bg px-4 py-3 font-semibold text-success transition hover:bg-success hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">✓</span>
          Verdadeiro
        </button>
        <button
          type="button"
          onClick={() => onAnswer(false)}
          disabled={disabled}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-danger bg-danger-bg px-4 py-3 font-semibold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">✗</span>
          Falso
        </button>
      </div>
    </div>
  );
}
