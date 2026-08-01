import { openDB, type IDBPDatabase } from "idb";
import { getQuestionById, type Level } from "@/data/questions";

const DB_NAME = "quiz-claude-code-db";
const DB_VERSION = 1;
const PLAYER_STORE = "player";
const ATTEMPTS_STORE = "attempts";
const LOCAL_PLAYER_ID = "local-player";

export interface Player {
  id: string;
  name: string;
  createdAt: string; // ISO date
}

export interface Attempt {
  id: string; // uuid
  level: Level;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string; // ISO date
  wrongQuestionIds: string[];
}

export interface WrongQuestionSummary {
  questionId: string;
  statement: string;
  answer: boolean;
  explanation: string;
  timesWrong: number;
}

function isIndexedDBAvailable(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function createDefaultPlayer(): Player {
  return {
    id: LOCAL_PLAYER_ID,
    name: "Jogador",
    createdAt: new Date().toISOString(),
  };
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PLAYER_STORE)) {
          db.createObjectStore(PLAYER_STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(ATTEMPTS_STORE)) {
          db.createObjectStore(ATTEMPTS_STORE, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Retorna o player local, criando-o na primeira chamada.
 * `isNew` indica se nenhum player existia antes desta chamada (usado para
 * decidir se o onboarding deve ser exibido automaticamente).
 * Em falha de storage, retorna um player efêmero em memória (isNew: true).
 */
export async function getOrCreatePlayer(): Promise<{
  player: Player;
  isNew: boolean;
}> {
  if (!isIndexedDBAvailable()) {
    return { player: createDefaultPlayer(), isNew: true };
  }
  try {
    const db = await getDB();
    const existing = (await db.get(PLAYER_STORE, LOCAL_PLAYER_ID)) as
      | Player
      | undefined;
    if (existing) {
      return { player: existing, isNew: false };
    }
    const player = createDefaultPlayer();
    await db.put(PLAYER_STORE, player);
    return { player, isNew: true };
  } catch (error) {
    console.warn("Falha ao acessar IndexedDB (getOrCreatePlayer):", error);
    return { player: createDefaultPlayer(), isNew: true };
  }
}

export async function updatePlayerName(name: string): Promise<Player | null> {
  const trimmedName = name.trim() || "Jogador";
  if (!isIndexedDBAvailable()) {
    return null;
  }
  try {
    const db = await getDB();
    const existing = (await db.get(PLAYER_STORE, LOCAL_PLAYER_ID)) as
      | Player
      | undefined;
    const player: Player = {
      id: LOCAL_PLAYER_ID,
      name: trimmedName,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    await db.put(PLAYER_STORE, player);
    return player;
  } catch (error) {
    console.warn("Falha ao acessar IndexedDB (updatePlayerName):", error);
    return null;
  }
}

export async function saveAttempt(attempt: Attempt): Promise<void> {
  if (!isIndexedDBAvailable()) {
    return;
  }
  try {
    const db = await getDB();
    await db.add(ATTEMPTS_STORE, attempt);
  } catch (error) {
    console.warn("Falha ao acessar IndexedDB (saveAttempt):", error);
  }
}

export async function getAttemptsByLevel(level: Level): Promise<Attempt[]> {
  if (!isIndexedDBAvailable()) {
    return [];
  }
  try {
    const db = await getDB();
    const all = (await db.getAll(ATTEMPTS_STORE)) as Attempt[];
    return all
      .filter((attempt) => attempt.level === level)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  } catch (error) {
    console.warn("Falha ao acessar IndexedDB (getAttemptsByLevel):", error);
    return [];
  }
}

export async function getHighScore(level: Level): Promise<number> {
  const attempts = await getAttemptsByLevel(level);
  if (attempts.length === 0) return 0;
  return Math.max(0, ...attempts.map((attempt) => attempt.score));
}

export async function getWrongQuestionsSummary(): Promise<
  WrongQuestionSummary[]
> {
  if (!isIndexedDBAvailable()) {
    return [];
  }
  try {
    const db = await getDB();
    const all = (await db.getAll(ATTEMPTS_STORE)) as Attempt[];
    const frequency = new Map<string, number>();
    for (const attempt of all) {
      for (const questionId of attempt.wrongQuestionIds) {
        frequency.set(questionId, (frequency.get(questionId) ?? 0) + 1);
      }
    }
    const summary: WrongQuestionSummary[] = [];
    for (const [questionId, timesWrong] of frequency.entries()) {
      const question = getQuestionById(questionId);
      if (!question) continue;
      summary.push({
        questionId,
        statement: question.statement,
        answer: question.answer,
        explanation: question.explanation,
        timesWrong,
      });
    }
    return summary.sort((a, b) => b.timesWrong - a.timesWrong);
  } catch (error) {
    console.warn(
      "Falha ao acessar IndexedDB (getWrongQuestionsSummary):",
      error,
    );
    return [];
  }
}
