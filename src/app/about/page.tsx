import type { Metadata } from "next";
import { DOMAINS } from "@/lib/exam-blueprint";

export const metadata: Metadata = {
  title: "About This Project",
  description:
    "Architecture, tech stack, build log, and source for Claude Architect Lab.",
};

const GITHUB_URL = "https://github.com/hulashc/claude-architect-lab";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">About This Project</h1>
      <p className="mb-12 text-zinc-600 dark:text-zinc-400">
        Claude Architect Lab is built the same way it teaches: learn a
        concept, implement it, document the decision, then write the
        scenario and questions. This page is that record.
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Architecture (current — V0.1)</h2>
        <div className="w-full overflow-x-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
          <pre className="font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
{`┌───────────────────────┐
│  Browser                 │
│  (Next.js client +        │
│   React Server Components)│
└───────────┬───────────┘
             ▼
┌───────────────────────┐
│  Next.js App Router        │
│  (this app)                 │
│                              │
│  content/ — lessons, quiz    │
│  banks, scenarios; typed and │
│  Zod-validated (tests/)       │
└───────────┬───────────┘
             ▼
┌───────────────────────┐
│  In-memory React state       │
│  (progress + mode —          │
│   session-only, nothing       │
│   stored; ADR-0004)            │
└───────────────────────┘

Planned, not built yet — added when the domain that
teaches it is actually studied:

┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Postgres          │ │ Claude API        │ │ MCP servers        │
│ (Supabase)          │ │ service              │ │                       │
│ — auth + synced      │ │ — Domain 4/5           │ │ — Domain 2 (Tool       │
│ progress, V0.2         │ │ features                │ │ Design & MCP)            │
└────────────────┘ └────────────────┘ └────────────────┘`}
          </pre>
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
          Full rationale for each decision — including why progress tracking
          stores nothing at all, not even locally — is in{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            architecture/adr/
          </code>{" "}
          in the repo.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Tech stack</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Next.js (App Router) + TypeScript",
            "Tailwind CSS v4",
            "Zod — content schema validation",
            "react-markdown — safe prose rendering, no arbitrary code execution",
            "Vitest — content + logic tests",
            "Prisma + Postgres/Supabase (planned, V0.2)",
            "Anthropic TypeScript SDK, server-side only (planned, V0.4+)",
            "Vercel (hosting)",
          ].map((item) => (
            <li
              key={item}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Build roadmap</h2>
        <ol className="space-y-2 text-sm">
          {DOMAINS.map((domain) => (
            <li key={domain.id} className="flex items-center gap-3">
              <span
                className={
                  "h-2 w-2 shrink-0 rounded-full " +
                  (domain.available ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")
                }
              />
              <span className={domain.available ? "" : "text-zinc-500 dark:text-zinc-500"}>
                Domain {domain.number}: {domain.title}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">
                {domain.available ? "— built" : "— not started"}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Source</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The full repository — including every ADR, the content schema, and
          the test suite that validates every question — is public on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Build log</h2>
        <article className="mb-4 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-500">
            V0.1 — Domain 1
          </p>
          <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Domain 1 (Agentic Architecture & Orchestration) established the
            lesson template every later domain reuses, and forced three real
            architecture calls on the project itself: the original MDX
            content plan turned out to be the wrong fit once the lesson
            template&apos;s blocks were actually written (see ADR-0002);
            progress tracking first shipped via localStorage instead of
            waiting on a database and auth provider (ADR-0003); and that
            decision was then reversed to store nothing about a learner at
            all — progress is now purely session-live, resetting on reload
            (ADR-0004). All three changed after starting to build, not
            before.
          </p>
        </article>
        <article className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="mb-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            V0.2–V0.5 — Domains 2–5 content, pending review
          </p>
          <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            A deliberate, flagged exception to this project&apos;s usual
            process: at the owner&apos;s explicit direction, Claude drafted
            all four remaining domains&apos; lessons and practice questions
            in one pass — 80 questions and four full lessons, matching
            Domain 1&apos;s template and schema exactly — rather than one
            domain at a time after being studied. It&apos;s live on the
            site now, passes every automated check (schema validation,
            structural invariants, type-check, lint, build), and Claude
            followed up with a fact-check pass against primary sources (MCP
            spec docs, Claude Code docs, Anthropic API docs) for the
            specific claims flagged after drafting — one inaccuracy turned
            up (a retry-code list in the Domain 5 code sample included
            status codes Anthropic&apos;s API doesn&apos;t actually
            document) and was corrected. That still isn&apos;t the same
            thing as the owner&apos;s own review, which hasn&apos;t
            happened yet. Until it does, treat Domains 2–5 the way
            you&apos;d treat a carefully self-checked but still unreviewed
            draft — see{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900">
              docs/roadmap.md
            </code>{" "}
            for the full fact-check results, broken down per domain.
          </p>
        </article>
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
          [Personal note for the project owner: add your own reflection here
          per domain — what surprised you, what you&apos;d do differently.
          That part is more credible coming from you than from a build log.]
        </p>
      </section>
    </div>
  );
}
