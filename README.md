# Claude Architect Lab

An independent learning platform for Anthropic's **Claude Certified Architect – Foundations** exam, built by learning each domain and implementing it as a working feature — in that order. The repo doubles as a record of that progression: concept → implementation → documentation → scenario → practice questions.

(Third-party prep resources abbreviate this exam both "CCA-F" and "CCAR-F" — Anthropic's own certification page doesn't publish an official short form, so this project spells out the full name. See `docs/certification-blueprint.md`.)

> **Not affiliated with or endorsed by Anthropic.** This is an independent study project. For the official credential, syllabus, and practice material, see [Anthropic Academy](https://anthropic.skilljar.com/) — the source of truth. All practice questions and scenarios on this site are original and written by the project author (Claude-reviewed for technical accuracy); none are reproduced from the real exam.

## What this is

Most exam-prep sites explain concepts. This one asks you to make an architecture decision, then shows you what you got right or wrong and why — modeled on how Anthropic describes the exam itself: scoping and designing Claude solutions, not reciting definitions.

Two ways to read every topic:
- **Certification Mode** — what you need to know to pass the exam.
- **Architect Mode** — how the concept is actually used in production.

## Domains (official blueprint weights)

| Domain | Weight |
|---|---|
| 1. Agentic Architecture & Orchestration | 27% |
| 2. Tool Design & MCP Integration | 18% |
| 3. Claude Code Configuration & Workflows | 20% |
| 4. Prompt Engineering & Structured Output | 20% |
| 5. Context Management & Reliability | 15% |

See [`docs/certification-blueprint.md`](docs/certification-blueprint.md) for exam format details and [`docs/roadmap.md`](docs/roadmap.md) for the phased build plan.

## Repository layout

```
architecture/   ADRs and diagram sources documenting decisions made *building this project*
docs/           Certification blueprint notes, study roadmap, build roadmap
content/        Lesson content and quiz/scenario question banks (author-owned, structured)
src/            Next.js application (app router, components, lib, server)
examples/       Standalone runnable code snippets referenced from lessons
evaluations/    Eval harnesses for Claude-powered features (added from Domain 4/5 onward)
mcp/            MCP servers used by the site (added from Domain 2 onward — not built yet)
tests/          Unit and integration tests
```

## Status

V0.1 shipped — Domain 1 (Agentic Architecture & Orchestration) is fully built and reviewed, live at **https://claude-architect-lab-rho.vercel.app**. Domains 2–5's lessons and practice questions are also live, but **Claude-drafted at the owner's direction and pending review** — a flagged, one-time exception to this project's usual author-first process (see `content/README.md` and `docs/roadmap.md`'s "V0.2–V0.5" section). Infrastructure tied to specific domains (a real MCP server, a live Claude API route, an eval harness) isn't built yet. See [`docs/roadmap.md`](docs/roadmap.md) for the full picture.

## Stack

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. Progress is session-only, in-memory state — nothing is persisted (see ADR-0004). Prisma + Postgres (Supabase) is a documented, not-yet-wired dependency for later domains. Claude-powered features (later domains) use the Anthropic TypeScript SDK server-side — the app is not static. Rationale for each choice is in [`architecture/adr/`](architecture/adr/).

## Running locally

```bash
npm install
npm run dev
```
