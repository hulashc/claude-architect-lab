"use client";

import type { LessonBlock } from "@/lib/content/schema";
import { Markdown } from "@/components/markdown";
import { QuestionCard } from "@/components/quiz/question-card";

/** Renders a single lesson block. Mode-filtering and layout now live in
 * src/components/lesson/lesson-with-path.tsx (the sticky path rail needs
 * the same "what's visible" list this used to compute privately) — this
 * component is just the per-block-type view, reused by both the lesson
 * page and, in principle, anything else that needs to render one block. */
export function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "concept":
      return (
        <section>
          {block.mode !== "both" && <ModeTag mode={block.mode} />}
          <h2 className="mb-3 text-xl font-semibold">{block.title}</h2>
          <Markdown>{block.body}</Markdown>
        </section>
      );

    case "diagram":
      return (
        <section>
          <h2 className="mb-3 text-xl font-semibold">{block.title}</h2>
          <div className="w-full overflow-x-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
            <pre className="font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
              {block.ascii}
            </pre>
          </div>
          {block.caption && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              {block.caption}
            </p>
          )}
        </section>
      );

    case "code":
      return (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{block.title}</h2>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {block.language}
            </span>
          </div>
          <div className="w-full overflow-x-auto rounded-lg bg-zinc-950 p-4">
            <pre className="font-mono text-xs leading-relaxed text-zinc-100">
              <code>{block.code}</code>
            </pre>
          </div>
          {block.caption && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              {block.caption}
            </p>
          )}
        </section>
      );

    case "scenario":
      return (
        <section>
          <h2 className="mb-3 text-xl font-semibold">{block.title}</h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">{block.intro}</p>
          <QuestionCard question={block.question} />
        </section>
      );

    case "examTrap":
      return (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              Exam trap
            </span>
            <h2 className="font-semibold">{block.title}</h2>
          </div>
          <Markdown>{block.body}</Markdown>
        </section>
      );

    case "terms":
      return (
        <section className="rounded-xl border border-zinc-300 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/50">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-zinc-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-zinc-500">
              Key terms
            </span>
            <h2 className="font-semibold">{block.title}</h2>
          </div>
          <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {block.terms.map(({ term, definition }) => (
              <div
                key={term}
                className="grid gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(9rem,14rem)_minmax(0,1fr)]"
              >
                <dt className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {term}
                </dt>
                <dd className="text-sm text-zinc-600 dark:text-zinc-400">
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      );

    case "miniLab":
      return (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
              Mini lab
            </span>
            <h2 className="font-semibold">{block.title}</h2>
          </div>
          <Markdown>{block.body}</Markdown>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {block.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      );

    default:
      return null;
  }
}

function ModeTag({ mode }: { mode: "certification" | "architect" }) {
  const label = mode === "certification" ? "Certification Mode" : "Architect Mode";
  return (
    <span className="mb-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {label}
    </span>
  );
}
