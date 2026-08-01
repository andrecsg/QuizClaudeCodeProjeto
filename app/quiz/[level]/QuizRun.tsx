"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Timer } from "@/components/Timer";
import { QuestionCard } from "@/components/QuestionCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ResultSummary } from "@/components/ResultSummary";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { getQuestionsByLevel, type Level, type Question } from "@/data/questions";
import { shuffleArray } from "@/lib/shuffle";
import { AUTO_ADVANCE_DELAY_SECONDS, QUESTION_TIME_SECONDS } from "@/lib/constants";

interface QuizRunProps {
  level: Level;
  onPlayAgain: () => void;
}

type Phase = "answering" | "feedback" | "result";

interface QuizState {
  phase: Phase;
  currentIndex: number;
  score: number;
  wrongQuestionIds: string[];
  lastAnswerCorrect: boolean | null;
}

type QuizAction =
  | { type: "ANSWER"; correct: boolean; questionId: string }
  | { type: "ADVANCE"; isLast: boolean };

const initialState: QuizState = {
  phase: "answering",
  currentIndex: 0,
  score: 0,
  wrongQuestionIds: [],
  lastAnswerCorrect: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER":
      return {
        ...state,
        phase: "feedback",
        lastAnswerCorrect: action.correct,
        score: action.correct ? state.score + 1 : state.score,
        wrongQuestionIds: action.correct
          ? state.wrongQuestionIds
          : [...state.wrongQuestionIds, action.questionId],
      };
    case "ADVANCE":
      if (action.isLast) {
        return { ...state, phase: "result" };
      }
      return {
        ...state,
        phase: "answering",
        currentIndex: state.currentIndex + 1,
        lastAnswerCorrect: null,
      };
    default:
      return state;
  }
}

export function QuizRun({ level, onPlayAgain }: QuizRunProps) {
  const { saveAttempt, getHighScore } = useIndexedDB();
  // Server and initial client render must agree on question order (no
  // Math.random during render), so start unshuffled and shuffle only once
  // mounted in the browser — avoids a hydration mismatch.
  const [questions, setQuestions] = useState<Question[]>(() =>
    getQuestionsByLevel(level),
  );
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const startedAtRef = useRef<number | null>(null);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
    // Shuffling here (client-only, post-mount) is intentional: doing it
    // during render would make Math.random() run differently on the
    // server and client passes and break hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(shuffleArray(getQuestionsByLevel(level)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [resultMeta, setResultMeta] = useState<{
    isNewRecord: boolean;
  } | null>(null);

  const currentQuestion = questions[state.currentIndex];
  const isLastQuestion = state.currentIndex === questions.length - 1;

  const handleAnswer = useCallback(
    (answer: boolean | null) => {
      const correct = answer !== null && answer === currentQuestion.answer;
      dispatch({ type: "ANSWER", correct, questionId: currentQuestion.id });
    },
    [currentQuestion],
  );

  const handleAdvance = useCallback(() => {
    dispatch({ type: "ADVANCE", isLast: isLastQuestion });
  }, [isLastQuestion]);

  useEffect(() => {
    if (state.phase !== "feedback") return;
    const timeoutId = setTimeout(() => {
      dispatch({ type: "ADVANCE", isLast: isLastQuestion });
    }, AUTO_ADVANCE_DELAY_SECONDS * 1000);
    return () => clearTimeout(timeoutId);
  }, [state.phase, state.currentIndex, isLastQuestion]);

  useEffect(() => {
    if (state.phase !== "result" || hasSavedRef.current) return;
    hasSavedRef.current = true;

    (async () => {
      const timeSpentSeconds = Math.round(
        (Date.now() - (startedAtRef.current ?? Date.now())) / 1000,
      );
      const previousHighScore = await getHighScore(level);
      await saveAttempt({
        id: crypto.randomUUID(),
        level,
        score: state.score,
        totalQuestions: questions.length,
        timeSpentSeconds,
        completedAt: new Date().toISOString(),
        wrongQuestionIds: state.wrongQuestionIds,
      });
      setResultMeta({ isNewRecord: state.score > previousHighScore });
    })();
  }, [
    state.phase,
    state.score,
    state.wrongQuestionIds,
    level,
    questions.length,
    getHighScore,
    saveAttempt,
  ]);

  if (state.phase === "result") {
    return (
      <ResultSummary
        level={level}
        score={state.score}
        totalQuestions={questions.length}
        isNewRecord={resultMeta?.isNewRecord ?? false}
        isSaving={resultMeta === null}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <ProgressBar current={state.currentIndex + 1} total={questions.length} />
      <div className="flex justify-end">
        <Timer
          key={currentQuestion.id}
          durationSeconds={QUESTION_TIME_SECONDS}
          isPaused={state.phase !== "answering"}
          onExpire={() => handleAnswer(null)}
        />
      </div>
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        disabled={state.phase !== "answering"}
      />
      {state.phase === "feedback" && state.lastAnswerCorrect !== null && (
        <FeedbackPanel
          isCorrect={state.lastAnswerCorrect}
          correctAnswer={currentQuestion.answer}
          explanation={currentQuestion.explanation}
          onNext={handleAdvance}
          nextLabel={isLastQuestion ? "Ver resultado" : "Próxima pergunta"}
        />
      )}
    </div>
  );
}
