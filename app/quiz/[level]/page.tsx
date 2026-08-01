"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { QuizRun } from "./QuizRun";
import { LEVEL_LABELS, type Level } from "@/data/questions";

const VALID_LEVELS: Level[] = ["iniciante", "intermediario", "avancado"];

interface QuizPageProps {
  params: Promise<{ level: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { level: levelParam } = use(params);
  const [attemptKey, setAttemptKey] = useState(0);

  if (!VALID_LEVELS.includes(levelParam as Level)) {
    notFound();
  }
  const level = levelParam as Level;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <h1 className="text-center text-2xl font-bold text-ink sm:text-3xl">
        Quiz — Nível {LEVEL_LABELS[level]}
      </h1>
      <QuizRun
        key={attemptKey}
        level={level}
        onPlayAgain={() => setAttemptKey((key) => key + 1)}
      />
    </main>
  );
}
