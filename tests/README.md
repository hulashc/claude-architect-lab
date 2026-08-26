# tests/

Vitest for unit/logic tests — currently the plan is: content schema validation (every question in `content/quizzes/*.json` matches the Zod schema, has a rationale for every wrong option, has an exam-concept tag), plus ordinary unit tests for `src/lib`. Component/e2e testing (Playwright) can be added once there's enough UI to justify it — not needed for the current scaffold.

Run with `npm test`.
