# ADR-0004: Progress is ephemeral and session-only — nothing is stored

Status: Accepted
Date: 2026-08-28

## Context

ADR-0003 shipped progress tracking (completed lessons, quiz attempts,
mode preference) via `localStorage`, framed as a "local-first, syncs to a
DB once auth lands" pattern — persistence across visits was the goal, only
the backend was deferred.

The project owner reconsidered that goal directly: no data about a learner
should be retained anywhere, even locally on their own machine, even
without an account. Progress should be a live, in-the-moment signal —
what you've done *this session* — not a record that outlives the tab.

## Options considered

1. **Keep `localStorage` (ADR-0003 as shipped)** — persists across reloads
   and browser restarts; this is exactly the retention the owner rejected.
2. **DB + auth-backed progress** — the "later" half of ADR-0003's plan;
   retains learner data even more durably (server-side, cross-device).
   Moves further in the direction being rejected, not away from it.
3. **Session-only in-memory state (React state, no storage adapter)** —
   progress exists only as long as the tab/session does; a reload is a
   clean slate. Zero data retention, zero setup, no behavior change for a
   single sitting.

## Decision

Progress lives entirely in `useState` inside `ProgressProvider`
(`src/components/progress/progress-context.tsx`), seeded from
`EMPTY_PROGRESS` (`src/lib/progress/store.ts`). No adapter reads or writes
`localStorage`, a cookie, or any server — the `ProgressStore` interface
from ADR-0003 is deliberately deleted rather than left as an unused seam,
since there is no longer a "swap in a real backend later" plan for it to
serve. The `useProgress()` hook's public shape is unchanged, so every
consumer (`complete-lesson-button.tsx`, `domain-progress-badge.tsx`,
`readiness-badge.tsx`, `practice-summary.tsx`, `mode-toggle.tsx`,
`quiz/question-card.tsx`) needed no edits.

## Consequences

- No data of any kind is stored about a learner — not per-browser, not
  per-account, not anywhere. Reloading the page, closing the tab, or
  visiting from another device all produce the same fresh state.
- `completedLessons`, `quizAttempts`, and `mode` all reset on reload. This
  is intentional, not a regression to fix later.
- `overallReadiness`/`domainReadiness` are now a within-session signal
  ("how am I doing on this pass") rather than a longitudinal one — they
  were never meant to be graded history, and this makes that explicit.
- ADR-0003's stated V0.2 follow-up ("DB-backed sync once auth exists") is
  foreclosed, not merely deferred — this ADR supersedes it. Prisma remains
  an unwired, documented-only dependency, but for a different reason than
  ADR-0003 gave: not "no account-bound feature needs it yet," but "this
  project doesn't retain learner data at all."
