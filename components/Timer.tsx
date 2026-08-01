"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  durationSeconds: number;
  isPaused?: boolean;
  onExpire: () => void;
}

const LOW_TIME_THRESHOLD_SECONDS = 5;

export function Timer({
  durationSeconds,
  isPaused = false,
  onExpire,
}: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused]);

  // Notifying the parent (which may update its own state) belongs in its
  // own effect, not inside the setRemaining updater above — calling it
  // there triggers React's "setState while rendering a different
  // component" violation.
  useEffect(() => {
    if (remaining === 0) {
      onExpireRef.current();
    }
  }, [remaining]);

  const isLow = remaining <= LOW_TIME_THRESHOLD_SECONDS;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border-2 px-3 py-1 text-sm font-semibold tabular-nums ${
        isLow
          ? "border-danger bg-danger-bg text-danger"
          : "border-terracotta-500 bg-terracotta-50 text-terracotta-700"
      }`}
      role="timer"
      aria-live="polite"
      aria-label={`${remaining} segundos restantes`}
    >
      {remaining}s
    </div>
  );
}
