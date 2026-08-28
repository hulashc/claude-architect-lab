"use client";

import { useProgress } from "@/components/progress/progress-context";

export function DomainProgressBadge({ domainId }: { domainId: string }) {
  const { domainReadiness, hydrated } = useProgress();
  if (!hydrated) return null;
  const pct = Math.round(domainReadiness(domainId) * 100);
  if (pct === 0) return null;
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
      {pct}% practiced
    </span>
  );
}
