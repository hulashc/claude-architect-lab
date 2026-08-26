# ADR-0002: Content model for lessons and questions

Status: Proposed (not yet wired into the app — revisit when Domain 1 content is actually built)
Date: 2026-08-26

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
