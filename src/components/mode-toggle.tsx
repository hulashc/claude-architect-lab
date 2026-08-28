"use client";

import { useProgress } from "@/components/progress/progress-context";

/**
 * Certification Mode vs. Architect Mode — the site's two-lens feature.
 * Filters which lesson blocks render; see src/lib/content/schema.ts
 * (BlockModeSchema) and src/components/lesson/lesson-blocks.tsx.
 */
export function ModeToggle() {
  const { mode, setMode } = useProgress();

  return (
    <div
      role="radiogroup"
      aria-label="Learning mode"
      className="inline-flex items-center rounded-full border border-zinc-300 bg-white p-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      {(
        [
          { value: "certification" as const, label: "Certification Mode" },
          { value: "architect" as const, label: "Architect Mode" },
        ]
      ).map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(option.value)}
            className={
              "rounded-full px-3 py-1.5 font-medium transition-colors " +
              (active
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100")
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
