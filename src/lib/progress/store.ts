import { DOMAINS } from "@/lib/exam-blueprint";
import { getQuizBank } from "@/lib/content";

/**
 * Progress is session-only — see
 * architecture/adr/0004-ephemeral-session-only-progress.md. Nothing about a
 * learner is written to localStorage, a cookie, or a server: this module
 * just defines the shape of in-memory state that `progress-context.tsx`
 * holds in `useState`. It resets on every reload, by design.
 */

export interface ProgressState {
  completedLessons: string[]; // domainIds
  /** questionId -> whether the most recent attempt was correct. */
  quizAttempts: Record<string, boolean>;
  mode: "certification" | "architect";
}

export const EMPTY_PROGRESS: ProgressState = {
  completedLessons: [],
  quizAttempts: {},
  mode: "certification",
};

/** Fraction (0–1) of a domain's quiz bank the learner has answered
 * correctly at least once. Domains without a quiz bank yet are 0. */
export function domainReadiness(domainId: string, state: ProgressState): number {
  const bank = getQuizBank(domainId);
  if (bank.length === 0) return 0;
  const correct = bank.filter((q) => state.quizAttempts[q.id] === true).length;
  return correct / bank.length;
}

/** Overall exam readiness, weighted by the official exam domain weights.
 * Domains with no lesson/quiz content yet contribute 0 — this is
 * deliberate: it should read as "27% max right now", not hide how much of
 * the blueprint isn't built yet. See docs/certification-blueprint.md. */
export function overallReadiness(state: ProgressState): number {
  const weighted = DOMAINS.reduce(
    (sum, d) => sum + d.weight * domainReadiness(d.id, state),
    0,
  );
  return weighted / 100;
}
