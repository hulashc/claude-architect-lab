# ADR-0002: Content model for lessons and questions

Status: Accepted (revised) — superseded the original MDX proposal below when Domain 1 content was actually built
Date: 2026-08-26 (revised 2026-08-26)

## Revision

The lesson template (concept → diagram → code → scenario → decision → exam
trap → questions → mini lab) turned out to be block-structured, not
prose-flowing — MDX's main advantage (embedding JSX in the middle of long
prose) wasn't the actual need. Landed on: a discriminated union of typed
lesson blocks (`src/lib/content/schema.ts`), each validated by Zod, with
markdown strings only inside blocks that are genuinely prose (concept
explanations, exam traps), rendered via `react-markdown` — safe (no
arbitrary code execution from content, unlike MDX) and fully type-checked at
build time. Diagrams, scenarios, and quiz questions are typed data consumed
by dedicated components instead of JSX embedded in content. Quiz questions
stay JSON-shaped as originally planned. This keeps one content system for
both lessons and questions instead of two (MDX + JSON), and content bugs
(missing rationale, two "correct" options) are Zod/test failures instead of
rendering-time surprises.

## Context

Lessons (concept/diagram/scenario/exam-trap prose) and quiz/scenario questions (structured, gradeable, taggable by domain+exam-concept) have different shapes and different validation needs. Need a format for each that lives in `content/`, not hardcoded in components, and that a non-technical future editing pass could still work with.

## Options considered

1. **Everything in a headless CMS** — nicest editing UX, but adds an external service and account before there's any content to justify it.
2. **Everything as JSON** — one format, but prose lessons in JSON strings are unpleasant to write and diff.
3. **MDX for lessons, JSON (Zod-validated) for questions** — lets lesson prose stay readable Markdown with embeddable diagram/quiz components, while questions get a strict schema (domain, weight, options, correct answer, per-option rationale, "exam concept" tag) that can be unit-tested for shape and cross-checked for "no duplicate correct-answer letter bias" etc.

## Decision

MDX for lesson content, JSON validated against a Zod schema for quiz/scenario questions. Both live under `content/`. Zod schema for questions gets a corresponding Vitest suite in `tests/` that fails the build if a question is malformed or under-specified (missing rationale for a wrong option, no exam-concept tag, etc.) — this is also a small in-repo demonstration of Domain 4's "structured output validation" concept applied to the site's own content pipeline.

## Consequences

- Question authorship stays author-written-Claude-reviewed (per `CLAUDE.md`) rather than freeform component code, which also makes "review 20 questions for accuracy" a tractable, separate task from building the page that renders them.
- Not yet implemented — no `@next/mdx` or content loader is installed. This ADR fixes the *shape* of the decision now so the folder structure (`content/domains/`, `content/quizzes/`) is right from V0.1, without pulling in the MDX toolchain before there's a lesson to render.
