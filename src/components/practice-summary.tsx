"use client";

import { useProgress } from "@/components/progress/progress-context";
import type { QuizQuestion } from "@/lib/content/schema";

export function PracticeSummary({ questions }: { questions: QuizQuestion[] }) {
  const { progress, hydrated } = useProgress();
  if (!hydrated) return null;

  const attempted = questions.filter((q) => q.id in progress.quizAttempts);
  const correct = attempted.filter((q) => progress.quizAttempts[q.id]);

  return (
    <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
      {attempted.length === 0
        ? `${questions.length} questions — none attempted yet.`
        : `${correct.length}/${attempted.length} correct so far (${attempted.length}/${questions.length} attempted).`}
    </p>
  );
}
