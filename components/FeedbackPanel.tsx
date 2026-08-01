interface FeedbackPanelProps {
  isCorrect: boolean;
  correctAnswer: boolean;
  explanation: string;
  onNext: () => void;
  nextLabel?: string;
}

export function FeedbackPanel({
  isCorrect,
  correctAnswer,
  explanation,
  onNext,
  nextLabel = "Próxima pergunta",
}: FeedbackPanelProps) {
  return (
    <div
      className={`rounded-2xl border-2 p-6 sm:p-8 ${
        isCorrect
          ? "border-success bg-success-bg"
          : "border-danger bg-danger-bg"
      }`}
      role="status"
    >
      <p
        className={`text-lg font-bold ${
          isCorrect ? "text-success" : "text-danger"
        }`}
      >
        {isCorrect ? "Você acertou!" : "Você errou."}
      </p>
      <p className="mt-2 text-ink">
        Resposta correta:{" "}
        <strong>{correctAnswer ? "Verdadeiro" : "Falso"}</strong>
      </p>
      <p className="mt-2 text-ink-soft">{explanation}</p>
      <button
        type="button"
        onClick={onNext}
        className="mt-6 rounded-xl bg-terracotta-500 px-5 py-2.5 font-semibold text-white transition hover:bg-terracotta-600"
      >
        {nextLabel}
      </button>
    </div>
  );
}
