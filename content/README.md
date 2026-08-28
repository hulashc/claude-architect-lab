# content/

The site's actual pedagogical material — kept out of `src/` so it can be authored, reviewed, and diffed independently of application code. See `architecture/adr/0002-content-model.md` for the format decision.

- `domains/` — one folder per certification domain (`01-agentic-architecture/`, `02-tool-design-mcp/`, ...), each following the lesson template in `docs/roadmap.md`: concept → explanation → diagram → code example → scenario → architecture decision → exam trap → questions → mini lab.
- `quizzes/` — question banks as JSON, one file per domain, validated against a Zod schema (schema itself lives in `src/lib` once built).

## Authorship rule

By default, every question and scenario here is written by the project author, with Claude reviewing drafts for technical accuracy and tagging exam concepts — not generating final question text — and nothing here is copied or derived from the real exam. See `CLAUDE.md`.

Domains 2–5 are a flagged, owner-directed exception to that default: Claude drafted their lessons and quiz banks in full, at the owner's explicit direction, pending the owner's review pass — same status Domain 1's quiz bank had before its own review. See `docs/roadmap.md`'s "V0.2–V0.5" section for exactly what's unreviewed and why. All five domains are now populated.
