# content/

The site's actual pedagogical material — kept out of `src/` so it can be authored, reviewed, and diffed independently of application code. See `architecture/adr/0002-content-model.md` for the format decision.

- `domains/` — one folder per certification domain (`01-agentic-architecture/`, `02-tool-design-mcp/`, ...), each following the lesson template in `docs/roadmap.md`: concept → explanation → diagram → code example → scenario → architecture decision → exam trap → questions → mini lab.
- `quizzes/` — question banks as JSON, one file per domain, validated against a Zod schema (schema itself lives in `src/lib` once built).

## Authorship rule

Every question and scenario here is written by the project author. Claude's role is reviewing drafts for technical accuracy and tagging exam concepts — not generating final question text — and nothing here is copied or derived from the real CCAR-F exam. See `CLAUDE.md`.

Nothing is populated yet — Domain 1 content is the first real content to land here (see `docs/roadmap.md`).
