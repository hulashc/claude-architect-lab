# CCAR-F exam blueprint

Source of truth: [Anthropic Academy](https://anthropic.skilljar.com/). This page mirrors the public blueprint so the site's structure and study-progress weighting stay in sync with it — it is not a copy of exam questions.

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

Study progress tracking (`content/domains/*/progress`) weights each domain's contribution to overall readiness by these percentages, not by question count — a learner who's finished Domain 1 is ~27% of the way through by weight even though it may hold more raw lessons than Domain 5.

## What each domain covers (working list — refine as lessons are built)

1. **Agentic Architecture & Orchestration** — agent loops, agent vs. deterministic workflow, single- vs. multi-agent, delegation/subagents, parallelization, human-in-the-loop, stopping conditions, reliability trade-offs.
2. **Tool Design & MCP Integration** — MCP clients/servers, tools vs. resources vs. prompts, tool schemas, permissions/boundaries, auth, error handling, safe MCP integration design.
3. **Claude Code Configuration & Workflows** — CLAUDE.md, project instructions, permissions, hooks, commands/skills, MCP inside Claude Code, context management, dev workflows.
4. **Prompt Engineering & Structured Output** — system/user prompts, few-shot, structured (XML/JSON/schema) prompting, tool-use prompting, validation, retries, separating deterministic app logic from model reasoning.
5. **Context Management & Reliability** — context windows, context engineering, summarization/compaction, retrieval, caching, error handling/retries, observability, evals, production reliability.

## Anthropic's recommended prep courses

AI Fluency, Claude 101, Building with the Claude API, Claude with Amazon Bedrock, Claude on Google Cloud, Introduction to MCP, Claude Code in Action — all via Anthropic Academy, linked from the site's Certification Overview page rather than duplicated here.
