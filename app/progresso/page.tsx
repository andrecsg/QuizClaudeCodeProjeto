"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { HistoryList } from "@/components/HistoryList";
import { WrongAnswersReview } from "@/components/WrongAnswersReview";
import { PlayerOnboarding } from "@/components/PlayerOnboarding";
import type { Level } from "@/data/questions";
import type { Attempt, WrongQuestionSummary } from "@/lib/db";

const LEVELS: Level[] = ["iniciante", "intermediario", "avancado"];

interface LevelData {
  attempts: Attempt[];
  highScore: number;
}

export default function ProgressPage() {
  const {
    player,
    isReady,
    updateName,
    getAttemptsByLevel,
    getHighScore,
    getWrongQuestionsSummary,
  } = useIndexedDB();
  const [levelData, setLevelData] = useState<Record<
    Level,
    LevelData
  > | null>(null);
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestionSummary[]>(
    [],
  );
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        LEVELS.map(async (level) => {
          const [attempts, highScore] = await Promise.all([
            getAttemptsByLevel(level),
            getHighScore(level),
          ]);
          return [level, { attempts, highScore }] as const;
        }),
      );
      const summary = await getWrongQuestionsSummary();
      if (cancelled) return;
      setLevelData(Object.fromEntries(entries) as Record<Level, LevelData>);
      setWrongQuestions(summary);
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, getAttemptsByLevel, getHighScore, getWrongQuestionsSummary]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          Meu progresso
        </h1>
        <Link
          href="/"
          className="text-sm font-semibold text-terracotta-600 hover:underline"
        >
          ← Voltar à Home
        </Link>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-terracotta-100">
        <h2 className="text-lg font-bold text-ink">Jogador</h2>
        {isEditingName ? (
          <div className="mt-3">
            <PlayerOnboarding
              mode="inline"
              initialName={player?.name}
              onSubmit={async (name) => {
                await updateName(name);
                setIsEditingName(false);
              }}
            />
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-ink-soft">{player?.name ?? "Jogador"}</span>
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-terracotta-600 hover:underline"
            >
              Editar nome
            </button>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-ink">
          Recordes e tentativas por nível
        </h2>
        {levelData === null ? (
          <p className="text-sm text-ink-soft">Carregando...</p>
        ) : (
          LEVELS.map((level) => (
            <HistoryList
              key={level}
              level={level}
              highScore={levelData[level].highScore}
              attempts={levelData[level].attempts}
            />
          ))
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-ink">Revisar erros</h2>
        <WrongAnswersReview items={wrongQuestions} />
      </section>
    </main>
  );
}
