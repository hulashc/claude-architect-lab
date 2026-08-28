# ADR-0003: Progress tracking ships before auth/DB, via localStorage

Status: Superseded by ADR-0004
Date: 2026-08-26

## Context

`docs/roadmap.md` originally gated "Progress tracking" on a DB schema +
auth-provider decision (see ADR-0001 consequences). Both require an external
account (Supabase project, OAuth app) that only the project owner can create —
work that shouldn't block V0.1 from being a fully working, zero-setup demo for
anyone who clones the repo or visits the deployed site.

## Options considered

1. **Wait for DB + auth before shipping progress tracking** — original plan;
   blocks V0.1 on external account setup that has nothing to do with the
   content itself.
2. **Fake it with a local SQLite datasource** — works without an account, but
   contradicts ADR-0001's Postgres decision and means a second schema to
   maintain, or a schema switch, for no real benefit.
3. **localStorage-backed progress now; DB-backed sync added when auth lands** —
   works immediately for any visitor with zero setup, and is itself a
   legitimate production pattern (local-first, syncs when authenticated)
   rather than a throwaway shortcut.

## Decision

Progress (completed lessons, quiz attempts/scores, mode preference) is
tracked client-side via `localStorage` for V0.1, behind a small
`ProgressStore` interface (`src/lib/progress/store.ts`) so a DB-backed
implementation can be swapped in later without changing any component that
reads progress. Weighting of "overall readiness" uses the domain weights in
`src/lib/exam-blueprint.ts`.

## Consequences

- V0.1 needs no `DATABASE_URL`, no Supabase project, and no OAuth app to be
  fully functional end to end, including on a fresh Vercel deploy.
- Progress is per-browser, not per-account — resets if storage is cleared,
  doesn't follow the learner across devices. Acceptable for V0.1; revisit
  when auth is added (tracked as V0.2 in `docs/roadmap.md`).
- Prisma stays a documented future dependency (`prisma/schema.prisma`) rather
  than wired-up infrastructure until there's an actual account-bound feature
  (auth) that needs it — avoids standing up a DB for a feature that doesn't
  yet require one.
