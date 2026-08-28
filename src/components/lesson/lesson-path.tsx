"use client";

import type { LessonStage } from "@/lib/content/lesson-path";

interface LessonPathProps {
  stages: LessonStage[];
  activeId: string | null;
  variant: "rail" | "bar";
}

/**
 * Presentational only — takes the stage list and active id it's given, no
 * data fetching or scroll tracking of its own (that lives in
 * use-active-stage.ts / lesson-with-path.tsx). Renders as plain
 * `<a href="#anchor">` entries, so the path still works with JS disabled
 * or before hydration.
 */
export function LessonPath({ stages, activeId, variant }: LessonPathProps) {
  if (variant === "bar") {
    return (
      <nav aria-label="Lesson stages" className="flex gap-2 overflow-x-auto">
        {stages.map((stage) => {
          const active = stage.anchorId === activeId;
          return (
            <a
              key={stage.anchorId}
              href={`#${stage.anchorId}`}
              aria-current={active ? "step" : undefined}
              className={
                "shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium " +
                (active
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-500")
              }
            >
              {stage.title}
            </a>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Lesson stages">
      <ol>
        {stages.map((stage, i) => {
          const active = stage.anchorId === activeId;
          return (
            <li key={stage.anchorId} className="relative flex gap-3 pb-4 last:pb-0">
              {i < stages.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[6.5px] top-4 h-full w-px bg-zinc-200 dark:bg-zinc-800"
                />
              )}
              <span
                aria-hidden
                className={
                  "relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 " +
                  (active
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950")
                }
              />
              <a
                href={`#${stage.anchorId}`}
                aria-current={active ? "step" : undefined}
                className="text-sm leading-tight"
              >
                <span className="mb-0.5 block text-[11px] font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-600">
                  {stage.kindLabel}
                </span>
                <span
                  className={
                    active
                      ? "font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-500"
                  }
                >
                  {stage.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
