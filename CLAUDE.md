# Claude Architect Lab — project instructions

## What this project is

An exam-prep + architecture-teaching site for Anthropic's CCAR-F certification. Full context: [`README.md`](README.md), [`docs/roadmap.md`](docs/roadmap.md), [`architecture/adr/`](architecture/adr/).

## Build philosophy — read before adding a domain feature

Domains are implemented in the order studied, not all at once: **learn the concept → implement it → document it → write the scenario → write practice questions.** Don't scaffold Domain N's infrastructure (e.g. MCP servers, multi-agent orchestration) before that domain's lesson content exists — see `architecture/adr/0001-tech-stack.md` and `0002-content-model.md` for why.

## Content authorship rule

All quiz/scenario questions are **author-written, Claude-reviewed for technical accuracy** — never copied or derived from real exam questions. When asked to help with question content, review/critique/fact-check; don't generate final question text unprompted.

## Non-negotiables

- Never present this site as official Anthropic material. Every page that references the certification should make independence clear.
- No live Claude API calls from client-side code — Claude-powered features are server-side only (route handlers / server actions), per `architecture/adr/0001-tech-stack.md`.
- Quiz/lesson content lives in `content/` as structured data (frontmatter MDX for lessons, JSON validated against a Zod schema for questions) — not hardcoded in components.

## Stack quick reference

Next.js App Router + TypeScript + Tailwind · Prisma + Postgres (Supabase) · Vercel · Vitest. See ADRs for rationale before changing any of these.
