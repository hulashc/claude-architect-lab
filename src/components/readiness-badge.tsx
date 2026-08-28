"use client";

import { useProgress } from "@/components/progress/progress-context";

/** Overall weighted readiness — 0% until you answer practice questions,
 * capped near 27% until Domains 2–5 exist. That cap is deliberate: see
 * docs/certification-blueprint.md. */
export function ReadinessBadge() {
  const { overallReadiness, hydrated } = useProgress();
  const pct = Math.round(overallReadiness * 100);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-800">
      <span className="text-zinc-500 dark:text-zinc-500">Your progress:</span>
      <span className="font-semibold tabular-nums">{hydrated ? `${pct}%` : "…"}</span>
      <span className="text-zinc-500 dark:text-zinc-500">weighted overall</span>
    </div>
  );
}
