"use client";

import Link from "next/link";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { LevelSelector } from "@/components/LevelSelector";
import { PlayerOnboarding } from "@/components/PlayerOnboarding";

export default function HomePage() {
  const { player, isReady, isNewPlayer, updateName } = useIndexedDB();

  const showOnboarding = isReady && isNewPlayer;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center gap-8 px-4 py-10 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">
          Quiz Claude Code
        </h1>
        <p className="mt-2 text-ink-soft">
          {isReady && player
            ? `Olá, ${player.name}! Teste seus conhecimentos sobre o Claude Code.`
            : "Teste seus conhecimentos sobre o Claude Code."}
        </p>
      </div>

      <div className="w-full">
        <h2 className="mb-4 text-center text-lg font-semibold text-ink">
          Escolha um nível para começar (jogue em qualquer ordem)
        </h2>
        <LevelSelector />
      </div>

      <Link
        href="/progresso"
        className="rounded-xl border-2 border-terracotta-500 px-5 py-2.5 font-semibold text-terracotta-700 transition hover:bg-terracotta-50"
      >
        Meu progresso
      </Link>

      {showOnboarding && (
        <PlayerOnboarding
          mode="modal"
          onSubmit={(name) => updateName(name)}
        />
      )}
    </main>
  );
}
