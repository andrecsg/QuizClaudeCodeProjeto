"use client";

import { useState, type FormEvent } from "react";

interface PlayerOnboardingProps {
  mode: "modal" | "inline";
  initialName?: string;
  onSubmit: (name: string) => void;
}

export function PlayerOnboarding({
  mode,
  initialName = "",
  onSubmit,
}: PlayerOnboardingProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name.trim());
  };

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="player-name" className="text-sm font-medium text-ink">
          Seu nome
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jogador"
          maxLength={40}
          autoFocus={mode === "modal"}
          className="rounded-xl border-2 border-terracotta-100 bg-white px-4 py-2.5 text-ink outline-none focus:border-terracotta-500"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-terracotta-500 px-5 py-2.5 font-semibold text-white transition hover:bg-terracotta-600"
      >
        {mode === "modal" ? "Começar" : "Salvar nome"}
      </button>
    </form>
  );

  if (mode === "inline") {
    return form;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-cream p-6 text-center shadow-lg sm:p-8">
        <h2 id="onboarding-title" className="text-xl font-bold text-ink">
          Bem-vindo(a) ao Quiz Claude Code!
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Como podemos te chamar? (opcional)
        </p>
        <div className="mt-4">{form}</div>
      </div>
    </div>
  );
}
