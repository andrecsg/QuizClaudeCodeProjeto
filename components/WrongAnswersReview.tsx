import type { WrongQuestionSummary } from "@/lib/db";

interface WrongAnswersReviewProps {
  items: WrongQuestionSummary[];
}

export function WrongAnswersReview({ items }: WrongAnswersReviewProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Nenhuma pergunta errada registrada até agora. Continue jogando!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li
          key={item.questionId}
          className="rounded-2xl border-2 border-danger bg-danger-bg p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-ink">{item.statement}</p>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-danger">
              Errada {item.timesWrong}x
            </span>
          </div>
          <p className="mt-2 text-ink">
            Resposta correta:{" "}
            <strong>{item.answer ? "Verdadeiro" : "Falso"}</strong>
          </p>
          <p className="mt-2 text-ink-soft">{item.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
