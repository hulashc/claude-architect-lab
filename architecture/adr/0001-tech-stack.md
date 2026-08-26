# ADR-0001: Core tech stack and hosting

Status: Accepted
Date: 2026-08-26

## Context

Needed a stack for a content-heavy, progress-tracked learning site that will *later* grow a real Claude-powered backend (Domains 2, 4, 5), without over-building that backend before those domains are studied.

## Options considered

1. **Fully static site generator** (Astro/plain MDX, no backend) — simplest, cheapest, but can't do auth/progress tracking or later Claude API calls without bolting on a separate service.
2. **Next.js App Router, full-stack** — single codebase for pages, API routes, and later server-side Claude calls; server components keep secrets off the client by default.
3. **Separate frontend (SPA) + separate backend service** (e.g. Vite + Express/FastAPI) — clean separation, but doubles deployment/hosting surface and CI for a solo project at this stage.

## Decision

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. Persistence via Prisma + Postgres on Supabase. Claude-powered features, when they arrive, go through Next.js Route Handlers using the Anthropic TypeScript SDK server-side — never from the client.

Chosen because it's one deployable unit that can start as an almost-static content site (V0.1) and grow a real backend (later domains) without a rewrite or a second service to host.

## Consequences

- Progress tracking and auth need a DB from V0.1 (can't defer to "later" the way a purely static site could) — schema/auth choice is the next decision, tracked in `docs/roadmap.md`.
- No agent/MCP/Claude-API code ships in the app until the domain that teaches it is actually built — see ADR-0002 and `CLAUDE.md` build philosophy. Until then, `mcp/` and `evaluations/` stay placeholders.
- Vercel + Supabase are both free-tier-viable for a portfolio project; revisit if the site outgrows either.
