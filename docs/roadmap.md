# Build roadmap

Phased. Each domain is built only after it's been studied — see `CLAUDE.md` build philosophy. This file is the single source of truth for what's shipped vs. planned; keep it current as work lands.

**Deviation from that philosophy, flagged explicitly:** all four remaining domains (V0.2–V0.5's content) were drafted by Claude in one pass, at the owner's explicit direction, rather than one at a time after the owner studied each — see the section below. This is a one-time, owner-directed departure from the sequential learn-then-build process, not a change to the process itself; new work after this should return to it.

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

## V0.2–V0.5 — content shipped, **pending the owner's review pass**

- [x] Domain 2 (Tool Design & MCP Integration) — lesson (`content/domains/02-tool-design-mcp/lesson.ts`) + 20 practice questions (`content/quizzes/domain-2.ts`)
- [x] Domain 3 (Claude Code Configuration & Workflows) — lesson (`content/domains/03-claude-code-configuration-workflows/lesson.ts`) + 20 practice questions (`content/quizzes/domain-3.ts`)
- [x] Domain 4 (Prompt Engineering & Structured Output) — lesson (`content/domains/04-prompt-engineering-structured-output/lesson.ts`) + 20 practice questions (`content/quizzes/domain-4.ts`)
- [x] Domain 5 (Context Management & Reliability) — lesson (`content/domains/05-context-management-reliability/lesson.ts`) + 20 practice questions (`content/quizzes/domain-5.ts`)
- [x] All four wired into `src/lib/content/index.ts`; `available: true` set for all five domains in `src/lib/exam-blueprint.ts`; `tests/unit/content.test.ts` generalized to loop over every registered domain instead of hardcoding Domain 1 — full suite (68 tests) passes, `tsc`/lint/build all clean.
- [ ] **Not done in this pass, deliberately out of scope**: the real MCP server (Domain 2), a live Claude API route (Domain 4), and an eval harness (Domain 4/5) that "Later phases" below originally tied to these domains. This was content only — see the owner's scope decision below.

Each domain followed the same template and schema as Domain 1 (concept → key terms → diagram → code → scenario → concept → diagram → concept → exam trap → mini lab), drafted by Claude at the owner's explicit direction. **This is unreviewed content** — same status as Domain 1's quiz bank before its review pass, just not yet reviewed. Specific judgment calls each domain's draft flagged for that review:

- **Domain 2**: the tools/resources/prompts "model-controlled / application-controlled / user-controlled" mapping is the single most load-bearing technical claim (underlies the terms block, a concept block, the exam trap, and several questions) — worth checking first against current MCP documentation. Authentication is described deliberately conceptually (API key vs. OAuth, not MCP's spec-level auth flow).
- **Domain 3**: permission-mode names are described generically ("a cautious mode," "an edit-accepting mode") rather than naming Claude Code's actual current mode identifiers, to avoid stating exact names that could drift from the product. The `settings.json` hook schema (`PreToolUse`/`PostToolUse`, `matcher`, `hooks: [{type: "command", command}]`) is written from direct knowledge and should still get a diff against current docs.
- **Domain 4**: the code block's retry-on-validation-failure approach (feeding a `tool_result` with `is_error: true` back to the model) uses a real Anthropic API field, but the retry-prompt phrasing itself is original composition, not a documented recipe.
- **Domain 5**: the retry-with-backoff code sample's retryable status-code list (including `529` for Anthropic's overloaded-error status) reflects best understanding of the API's error surface, not a compiled/run check. A couple of ASCII diagrams have minor box-drawing alignment issues (cosmetic only).

## Lesson template (established in Domain 1, reused for Domains 2–5)

Concept → key terms → architecture diagram → code example → real-world scenario → architecture decision → exam trap / misconception → practice questions → hands-on mini lab.

## Known follow-ups from V0.1

- The 20 Domain 1 questions and the lesson's rationales were drafted by Claude at the owner's explicit direction (not the default author-first workflow in `CLAUDE.md`) — the owner should read through them before calling them final. Flagged in a comment at the top of `content/quizzes/domain-1.ts`.
- The Domain 1 `terms` block (`content/domains/01-agentic-architecture-orchestration/lesson.ts`) was extracted mechanically from the lesson's own existing prose, at the owner's direction. **Reviewed and approved by the owner (2026-08-28)**, including the two terms whose definitions assemble fragments from more than one sentence rather than lifting a single one (*Agent loop*, *Multi-agent architecture*), and the deletion of the two lead-in sentences in the "Human-in-the-loop and stopping conditions" concept block that had become pure restatement.
- `docs/certification-blueprint.md` documents that the exam format/domain weights are corroborated by third-party sources but not independently verified against Anthropic's own Exam Guide PDF (gated behind Partner Academy sign-in). Revisit if that PDF becomes accessible.

## Later phases (not scoped in detail yet)

- **Infrastructure for Domains 2, 4, 5** — the real MCP server (`mcp/`, dogfooding Domain 2), a live Claude API route (Domain 4, first live Claude-powered feature in the app itself), and an eval harness (`evaluations/`, Domain 4/5). Deliberately not built in the same pass as the content itself (bigger, adds real runtime dependencies and a security surface); likely also when auth + a real DB (Prisma/Postgres, per ADR-0001) get wired in.
- **V1.0** — Full Architecture Decision Lab (multi-scenario, one per domain instead of just Domain 1's), Cheat Sheets, Study Planner, Mock exam mode. No cross-device progress sync — per ADR-0004, progress storage was reversed, not deferred; this stays off the roadmap unless that decision is revisited.

## Open decisions (deliberately deferred, not forgotten)

- DB schema for users/quiz-results, and auth provider — deferred until the MCP server/live API infra work above; **not** for progress, which per ADR-0004 is intentionally never stored, by choice rather than by timing.
- Content format: resolved — see ADR-0002's revision (typed blocks + Zod, not MDX).
