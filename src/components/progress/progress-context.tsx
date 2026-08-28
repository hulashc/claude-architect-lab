"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  EMPTY_PROGRESS,
  overallReadiness,
  domainReadiness,
  type ProgressState,
} from "@/lib/progress/store";

interface ProgressContextValue {
  progress: ProgressState;
  /** Always true. Progress is plain in-memory React state now (see
   * architecture/adr/0004-ephemeral-session-only-progress.md) — there's no
   * external store to read on mount, so server render and first client
   * render already agree and there's nothing to wait for. Kept in the API
   * so existing consumers (readiness-badge, domain-progress-badge,
   * practice-summary) don't need to change. */
  hydrated: boolean;
  mode: ProgressState["mode"];
  setMode: (mode: ProgressState["mode"]) => void;
  completeLesson: (domainId: string) => void;
  answerQuestion: (questionId: string, correct: boolean) => void;
  resetProgress: () => void;
  overallReadiness: number;
  domainReadiness: (domainId: string) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated: true,
      mode: progress.mode,
      setMode: (mode) => setProgress((p) => ({ ...p, mode })),
      completeLesson: (domainId) =>
        setProgress((p) =>
          p.completedLessons.includes(domainId)
            ? p
            : { ...p, completedLessons: [...p.completedLessons, domainId] },
        ),
      answerQuestion: (questionId, correct) =>
        setProgress((p) => ({
          ...p,
          quizAttempts: { ...p.quizAttempts, [questionId]: correct },
        })),
      resetProgress: () => setProgress(EMPTY_PROGRESS),
      overallReadiness: overallReadiness(progress),
      domainReadiness: (domainId) => domainReadiness(domainId, progress),
    }),
    [progress],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
