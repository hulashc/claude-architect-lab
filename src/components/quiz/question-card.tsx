"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/content/schema";
import { Markdown } from "@/components/markdown";
import { useProgress } from "@/components/progress/progress-context";

/**
 * Renders one question, reveals every option's rationale on answer — not
 * just "correct" and "your answer" — so a tempting-but-wrong option and an
 * over-engineered option both get explained, not just marked wrong.
 */
export function QuestionCard({ question }: { question: QuizQuestion }) {
  const { answerQuestion } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const revealed = selectedId !== null;
  const correctOption = question.options.find((o) => o.correct);

  function select(optionId: string) {
    if (revealed) return;
    setSelectedId(optionId);
    const option = question.options.find((o) => o.id === optionId);
    answerQuestion(question.id, Boolean(option?.correct));
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        <Markdown>{question.scenario}</Markdown>
      </div>
      <p className="mb-4 font-medium">{question.prompt}</p>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = option.id === selectedId;
          const isCorrect = option.correct;

          let stateClasses =
            "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600";
          if (revealed && isCorrect) {
            stateClasses =
              "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30";
          } else if (revealed && isSelected && !isCorrect) {
            stateClasses =
              "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/30";
          } else if (revealed) {
            stateClasses = "border-zinc-200 dark:border-zinc-800 opacity-70";
          }

          return (
            <div key={option.id}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => select(option.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${stateClasses}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>{option.label}</span>
                  {revealed && isCorrect && (
                    <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                      Correct
                    </span>
                  )}
                  {revealed && isSelected && !isCorrect && (
                    <span className="shrink-0 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-medium text-white">
                      Your answer
                    </span>
                  )}
                </span>
              </button>
              {revealed && (
                <p className="mt-1.5 px-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {option.rationale}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          <span>
            Exam concept: <span className="font-medium">{question.examConcept}</span>
          </span>
          {selectedId !== correctOption?.id && (
            <span>
              Your answer:{" "}
              <span className="font-medium">
                {question.options.find((o) => o.id === selectedId)?.id.toUpperCase()}
              </span>{" "}
              · Correct answer:{" "}
              <span className="font-medium">{correctOption?.id.toUpperCase()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
