# Exam blueprint — Claude Certified Architect – Foundations

Source of truth: [Anthropic Academy](https://anthropic.skilljar.com/claude-certified-architect-foundations-certification/444989) (redirects to the Partner Academy). This page mirrors the public blueprint so the site's structure and study-progress weighting stay in sync with it — it is not a copy of exam questions.

**Sourcing note:** Anthropic's own certification page confirms the name and the $125 price directly, but the full exam format and domain weights below come from the project owner and are independently corroborated by several third-party prep resources (all converging on the same numbers) — the authoritative source is the Exam Guide PDF linked from Anthropic's certification page, which sits behind Partner Academy sign-in and wasn't directly accessible while writing this. If Anthropic revises the format, this file (and `src/lib/exam-blueprint.ts`, which mirrors it in code) needs a manual update — nothing here is fetched live.

**No official abbreviation:** Anthropic's page doesn't publish one. Third-party sites use both "CCA-F" and "CCAR-F" inconsistently. This project spells out the full name rather than picking one — see `src/lib/exam-blueprint.ts`.

**Eligibility:** Registration appears to run through Anthropic's Partner Academy platform, which some third-party sources describe as currently limited to employees of Anthropic Partner organizations (a company email may be required). Not independently confirmed — check Anthropic Academy for current access requirements before assuming anyone can register.

## Format

- 60 questions, 120 minutes
- $125
- Passing score: 720 / 1000

## Domain weights

| # | Domain | Weight |
|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27% |
| 2 | Tool Design & MCP Integration | 18% |
| 3 | Claude Code Configuration & Workflows | 20% |
| 4 | Prompt Engineering & Structured Output | 20% |
| 5 | Context Management & Reliability | 15% |

Study progress tracking (`src/lib/progress/store.ts`) weights each domain's contribution to overall readiness by these percentages, not by question count — a learner who's finished Domain 1 is at most ~27% of the way there by weight, even after acing every Domain 1 question, until Domains 2–5 exist.

## What each domain covers (working list — refine as lessons are built)

1. **Agentic Architecture & Orchestration** — agent loops, agent vs. deterministic workflow, single- vs. multi-agent, delegation/subagents, parallelization, human-in-the-loop, stopping conditions, reliability trade-offs.
2. **Tool Design & MCP Integration** — MCP clients/servers, tools vs. resources vs. prompts, tool schemas, permissions/boundaries, auth, error handling, safe MCP integration design.
3. **Claude Code Configuration & Workflows** — CLAUDE.md, project instructions, permissions, hooks, commands/skills, MCP inside Claude Code, context management, dev workflows.
4. **Prompt Engineering & Structured Output** — system/user prompts, few-shot, structured (XML/JSON/schema) prompting, tool-use prompting, validation, retries, separating deterministic app logic from model reasoning.
5. **Context Management & Reliability** — context windows, context engineering, summarization/compaction, retrieval, caching, error handling/retries, observability, evals, production reliability.

## Anthropic's recommended prep courses

AI Fluency, Claude 101, Building with the Claude API, Claude with Amazon Bedrock, Claude on Google Cloud, Introduction to MCP, Claude Code in Action — all via Anthropic Academy, linked from the site's Certification Overview page rather than duplicated here.
