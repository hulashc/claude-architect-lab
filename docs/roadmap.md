# Build roadmap

Phased. Each domain is built only after it's been studied — see `CLAUDE.md` build philosophy. This file is the single source of truth for what's shipped vs. planned; keep it current as work lands.

## V0.1 (current target)

- [x] Repo scaffold (Next.js/TS/Tailwind, folder structure, ADRs) — this commit
- [ ] Landing page
- [ ] Certification overview page (blueprint, format, roadmap)
- [ ] Five-domain roadmap page
- [ ] Domain 1 learning module (Agentic Architecture & Orchestration) — establishes the lesson template
- [ ] Three architecture diagrams (Domain 1)
- [ ] 20 practice questions (Domain 1), author-written
- [ ] One interactive scenario (Domain 1) — first pass at the Architecture Decision Lab pattern
- [ ] Progress tracking (requires: DB schema + auth decision — not yet made, see open decisions below)
- [ ] Public GitHub repo, README complete

## Lesson template (established in Domain 1, reused for Domains 2–5)

Concept → simple explanation → architecture diagram → code example → real-world scenario → architecture decision → exam trap / misconception → practice questions → hands-on mini lab.

## Later phases (not scoped in detail yet)

- **V0.2** — Domain 2 (Tool Design & MCP). First real MCP server (`mcp/`) gets built here, not before — e.g. a Documentation MCP or Quiz-content MCP, dogfooding what's taught.
- **V0.3** — Domain 3 (Claude Code Configuration & Workflows).
- **V0.4** — Domain 4 (Prompt Engineering & Structured Output). First live Claude API usage in the app itself likely lands here (e.g. a structured-output-graded scenario), plus `evaluations/` gets its first real eval harness.
- **V0.5** — Domain 5 (Context Management & Reliability).
- **V1.0** — Full Architecture Decision Lab (multi-scenario), Cheat Sheets, Study Planner, Mock exam mode.

## Open decisions (deliberately deferred, not forgotten)

- DB schema for users/progress/quiz-results — next task after this scaffold.
- Auth provider (likely Supabase Auth w/ GitHub OAuth, to reinforce the portfolio angle) — decide alongside DB schema.
- Content format for lessons (leaning MDX) and questions (leaning JSON + Zod schema) — proposed in `architecture/adr/0002-content-model.md`, not yet wired into the app.
- Exact page-by-page IA/wireframe for V0.1 — not started.
