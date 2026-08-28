"use client";

import { useState } from "react";
import type {
  ArchitectureDecisionScenario,
  ArchitectureOption,
} from "@/lib/content/schema";
import { Markdown } from "@/components/markdown";

const VERDICT_STYLES: Record<
  ArchitectureOption["verdict"],
  { label: string; classes: string }
> = {
  best: {
    label: "Best fit",
    classes:
      "bg-emerald-600 text-white dark:bg-emerald-500",
  },
  workable: {
    label: "Workable",
    classes: "bg-amber-500 text-white dark:bg-amber-500",
  },
  "tempting-but-wrong": {
    label: "Tempting, but wrong",
    classes: "bg-rose-600 text-white dark:bg-rose-500",
  },
  "over-engineered": {
    label: "Over-engineered",
    classes: "bg-violet-600 text-white dark:bg-violet-500",
  },
};

export function ArchitectureDecisionLab({
  scenario,
}: {
  scenario: ArchitectureDecisionScenario;
}) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const revealed = chosenId !== null;
  const viewing = scenario.options.find((o) => o.id === viewingId);

  function choose(optionId: string) {
    setChosenId(optionId);
    setViewingId(optionId);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h3 className="mb-3 font-semibold">Requirements</h3>
        <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {scenario.requirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
        <p className="mb-4 font-medium">{scenario.prompt}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          {scenario.options.map((option) => {
            const isChosen = option.id === chosenId;
            const isViewing = option.id === viewingId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => (revealed ? setViewingId(option.id) : choose(option.id))}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  isViewing
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30"
                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{option.label}</span>
                  {isChosen && (
                    <span className="shrink-0 rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                      Your choice
                    </span>
                  )}
                </span>
                {revealed && (
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${VERDICT_STYLES[option.verdict].classes}`}
                  >
                    {VERDICT_STYLES[option.verdict].label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {revealed && viewing && (
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">{viewing.label}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${VERDICT_STYLES[viewing.verdict].classes}`}
            >
              {VERDICT_STYLES[viewing.verdict].label}
            </span>
          </div>
          <div className="mb-4 w-full overflow-x-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
            <pre className="font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
              {viewing.diagram}
            </pre>
          </div>
          <Markdown>{viewing.explanation}</Markdown>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            Tap another option above to compare its diagram and trade-offs.
          </p>
        </div>
      )}
    </div>
  );
}
