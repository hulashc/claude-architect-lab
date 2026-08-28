"use client";

import { useProgress } from "@/components/progress/progress-context";

export function CompleteLessonButton({ domainId }: { domainId: string }) {
  const { progress, completeLesson } = useProgress();
  const done = progress.completedLessons.includes(domainId);

  return (
    <button
      type="button"
      onClick={() => completeLesson(domainId)}
      disabled={done}
      className={
        "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
        (done
          ? "cursor-default bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300")
      }
    >
      {done ? "Lesson marked complete ✓" : "Mark lesson complete"}
    </button>
  );
}
