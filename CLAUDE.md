# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state of this repository

This repository currently contains **only `prd.md`** — no code has been generated yet. There is no `package.json`, no Next.js scaffold, and no git repository initialized. Before writing any code, read `prd.md` in full; it is the authoritative specification (in Portuguese) for the project to build.

Once the project is scaffolded per the spec below, standard Next.js commands apply (`npm run dev`, `npm run build`, `npm run lint`) — there is no existing build/test setup to reference yet, so don't assume scripts exist until you (or a prior session) added them to `package.json`.

## What this project is

**Quiz Claude Code** — a Portuguese-language (pt-BR), single-page True/False quiz web app that teaches people about the Claude Code CLI tool, across three progressive difficulty levels (Iniciante / Intermediário / Avançado), 10 questions each. No backend: all state is client-side, with player profile and attempt history persisted locally in the browser via IndexedDB.

## Required stack (per `prd.md` §5.1)

- **Next.js (App Router) + React + TypeScript**
- Styling: Tailwind CSS recommended (CSS Modules acceptable)
- State: local React hooks (`useState`/`useReducer`) — no global state library needed
- Persistence: IndexedDB only, accessed through a client-side utility layer (or the `idb` library). **All IndexedDB access must happen in `"use client"` components/hooks — never during server render.**
- No backend/API routes for data — the question bank is static, and progress persistence is 100% local to the browser/device (no sync).

## Architecture

### Data model (`data/questions.ts`)
Static, typed question bank — one `Question` per True/False item with `id`, `level` (`"iniciante" | "intermediario" | "avancado"`), `statement`, `answer: boolean`, `explanation`. The full 30-question bank (10 per level, with correct answers and explanations) is defined in `prd.md` §7 and must be transcribed verbatim into this file — do not invent or alter question content.

### Persistence layer (`lib/db.ts`)
IndexedDB database `quiz-claude-code-db` with two object stores:
- `player` — single record (`id`, `name`, `createdAt`) for the local player profile, no auth.
- `attempts` — history of completed quiz attempts (`id`, `level`, `score`, `totalQuestions`, `timeSpentSeconds`, `completedAt`, `wrongQuestionIds[]`).

High score per level is *derived* (max `score` among that level's attempts), not stored separately. Expected utility functions: `getOrCreatePlayer()`, `updatePlayerName(name)`, `saveAttempt(attempt)`, `getAttemptsByLevel(level)`, `getHighScore(level)`, `getWrongQuestionsSummary()`.

IndexedDB failures (e.g. private browsing restricting storage) must degrade gracefully — the quiz must remain playable even if history can't be saved.

### Routes (App Router)
- `/` — Home: player greeting, level selector, link to progress.
- `/quiz/[level]` — gameplay for a level; result screen can be handled as state within this same route rather than a separate route.
- `/progresso` — high scores, attempt history, wrong-answer review.

### Core flow
1. First visit with no saved player → onboarding modal asks for a name (optional, defaults to "Jogador"), saved to IndexedDB.
2. Home → pick a level (levels are independent, playable in any order).
3. Quiz screen shows one question at a time with a per-question countdown timer (default 20s, centralized as a constant — must stay easy to tune). Timeout with no answer auto-marks the question wrong and proceeds to feedback.
4. Feedback panel shows correct/incorrect + a short explanation immediately after each answer (or timeout).
5. End of level → result screen (score, high-score indication) and the attempt is auto-saved to IndexedDB.
6. `/progresso` shows per-level high scores, attempt history (most recent first), and a wrong-answers review section, plus the ability to edit the player name.

In-progress score is memory-only — reloading mid-level restarts that attempt; only completed attempts are persisted.

### Suggested components
`PlayerOnboarding`, `LevelSelector`, `QuestionCard`, `Timer`, `FeedbackPanel`, `ResultSummary`, `ProgressBar`, `HistoryList`, `WrongAnswersReview`, and a `useIndexedDB` hook wrapping `lib/db.ts`.

## Design

Anthropic/Claude-inspired visual theme: burnt terracotta/orange as primary color, cream/white neutrals for background, dark gray/black text for contrast. Clean sans-serif type, soft rounded cards, generous whitespace. Correct-answer feedback in green, incorrect in red/dark terracotta. Minimal use of icons/emoji (✓/✗ for True/False options). Must be responsive down to 360px width.

## Non-negotiable constraints

- No authentication, no backend/remote database, no cross-device sync, no global leaderboard — these are explicitly out of scope for the MVP (see `prd.md` §2).
- Single language: Portuguese (Brazil) only — no i18n.
- Question bank is static/code-edited only, no admin UI.
