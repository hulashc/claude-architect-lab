# Build roadmap

Phased. Each domain is built only after it's been studied — see `CLAUDE.md` build philosophy. This file is the single source of truth for what's shipped vs. planned; keep it current as work lands.

## V0.1 — shipped

- [x] Repo scaffold (Next.js/TS/Tailwind, folder structure, ADRs)
- [x] Landing page
- [x] Certification overview page (blueprint, format, domain weights, eligibility caveat)
- [x] Five-domain roadmap page (`/domains`)
- [x] Domain 1 learning module (Agentic Architecture & Orchestration) — establishes the lesson template, incl. Certification Mode / Architect Mode toggle
- [x] Three architecture diagrams (Domain 1: agent loop, single agent + tool routing, multi-agent delegation)
- [x] 20 practice questions (Domain 1) — Claude-drafted at the owner's direction, **pending the owner's review pass** before treating as final; see `content/quizzes/domain-1.ts`
- [x] One interactive scenario — the Architecture Decision Lab (`/architecture-lab`), plus a second embedded scenario inside the Domain 1 lesson
- [x] Progress tracking — **session-only, in-memory** (ADR-0004, superseding the original localStorage-backed ADR-0003); nothing about a learner is stored anywhere, and progress resets on reload by design
- [x] Content validation test suite (`tests/unit/content.test.ts`) — schema + invariant checks on every question, scenario, and lesson (incl. the new `terms` block type)
- [x] `terms` content block type — compact term/definition pairs, rendered as a definition list, deliberately not routed through markdown (kept short by construction)
- [x] Sticky lesson path rail (`LessonWithPath`) — the lesson stays a single scrollable page, but a sticky rail (sidebar on desktop, top bar on mobile) always shows the stage sequence and highlights where the learner currently is
- [x] `/domains` sequence roadmap (`DomainPath`) — the five domains as a connected step path instead of a flat list, plus prev/next-domain links at the bottom of each lesson page; still no prerequisite gating, every domain stays clickable
- [x] Public GitHub repo — https://github.com/hulashc/claude-architect-lab
- [x] Deployed on Vercel — https://claude-architect-lab-rho.vercel.app, auto-deploying from `master`

## Lesson template (established in Domain 1, reused for Domains 2–5)

Concept → key terms → architecture diagram → code example → real-world scenario → architecture decision → exam trap / misconception → practice questions → hands-on mini lab.

## Known follow-ups from V0.1

- The 20 Domain 1 questions and the lesson's rationales were drafted by Claude at the owner's explicit direction (not the default author-first workflow in `CLAUDE.md`) — the owner should read through them before calling them final. Flagged in a comment at the top of `content/quizzes/domain-1.ts`.
- The Domain 1 `terms` block (`content/domains/01-agentic-architecture-orchestration/lesson.ts`) was extracted mechanically from the lesson's own existing prose, at the owner's direction. **Reviewed and approved by the owner (2026-08-28)**, including the two terms whose definitions assemble fragments from more than one sentence rather than lifting a single one (*Agent loop*, *Multi-agent architecture*), and the deletion of the two lead-in sentences in the "Human-in-the-loop and stopping conditions" concept block that had become pure restatement.
- `docs/certification-blueprint.md` documents that the exam format/domain weights are corroborated by third-party sources but not independently verified against Anthropic's own Exam Guide PDF (gated behind Partner Academy sign-in). Revisit if that PDF becomes accessible.

## Later phases (not scoped in detail yet)

- **V0.2** — Domain 2 (Tool Design & MCP). First real MCP server (`mcp/`) gets built here, not before — e.g. a Documentation MCP or Quiz-content MCP, dogfooding what's taught. Likely also when auth + a real DB (Prisma/Postgres, per ADR-0001) get wired in, since Domain 2's MCP work benefits from a persistent backend anyway.
- **V0.3** — Domain 3 (Claude Code Configuration & Workflows).
- **V0.4** — Domain 4 (Prompt Engineering & Structured Output). First live Claude API usage in the app itself likely lands here (e.g. a structured-output-graded scenario), plus `evaluations/` gets its first real eval harness.
- **V0.5** — Domain 5 (Context Management & Reliability).
- **V1.0** — Full Architecture Decision Lab (multi-scenario), Cheat Sheets, Study Planner, Mock exam mode. No cross-device progress sync — per ADR-0004, progress storage was reversed, not deferred; this stays off the roadmap unless that decision is revisited.

## Open decisions (deliberately deferred, not forgotten)

- DB schema for users/quiz-results, and auth provider — deferred until Domain 2 (see above); **not** for progress, which per ADR-0004 is intentionally never stored, by choice rather than by timing.
- Content format: resolved — see ADR-0002's revision (typed blocks + Zod, not MDX).
