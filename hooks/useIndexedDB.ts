"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getOrCreatePlayer,
  updatePlayerName as updatePlayerNameInDB,
  saveAttempt as saveAttemptInDB,
  getAttemptsByLevel as getAttemptsByLevelFromDB,
  getHighScore as getHighScoreFromDB,
  getWrongQuestionsSummary as getWrongQuestionsSummaryFromDB,
  type Player,
  type Attempt,
} from "@/lib/db";
import type { Level } from "@/data/questions";

export function useIndexedDB() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrCreatePlayer().then(({ player, isNew }) => {
      if (cancelled) return;
      setPlayer(player);
      setIsNewPlayer(isNew);
      setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateName = useCallback(async (name: string) => {
    const updated = await updatePlayerNameInDB(name);
    const nextPlayer: Player = updated ?? {
      id: "local-player",
      name: name.trim() || "Jogador",
      createdAt: new Date().toISOString(),
    };
    setPlayer(nextPlayer);
    setIsNewPlayer(false);
    return nextPlayer;
  }, []);

  const saveAttempt = useCallback(async (attempt: Attempt) => {
    await saveAttemptInDB(attempt);
  }, []);

  const getAttemptsByLevel = useCallback((level: Level) => {
    return getAttemptsByLevelFromDB(level);
  }, []);

  const getHighScore = useCallback((level: Level) => {
    return getHighScoreFromDB(level);
  }, []);

  const getWrongQuestionsSummary = useCallback(() => {
    return getWrongQuestionsSummaryFromDB();
  }, []);

  return {
    player,
    isReady,
    isNewPlayer,
    updateName,
    saveAttempt,
    getAttemptsByLevel,
    getHighScore,
    getWrongQuestionsSummary,
  };
}
