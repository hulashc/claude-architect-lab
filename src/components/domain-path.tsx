import Link from "next/link";
import { DOMAINS } from "@/lib/exam-blueprint";
import { DomainProgressBadge } from "@/components/domain-progress-badge";

/**
 * Visual sequence of the five exam domains — a connected step roadmap
 * (order 1→5, weight, built vs. coming-soon) replacing a flat numbered
 * list, so "what comes after what" is visible at a glance instead of
 * implied by a plain `<ol>`. This is sequencing, not gating: every domain
 * stays a live link regardless of build status (see the note rendered
 * above this component on /domains) — nothing here enforces completing
 * one domain before opening the next.
 *
 * Server component — DomainProgressBadge is already a client component
 * nested inside it, which composes fine without this file needing
 * "use client" itself.
 */
export function DomainPath() {
  const maxWeight = Math.max(...DOMAINS.map((d) => d.weight));

  return (
    <ol className="relative">
      {DOMAINS.map((domain, i) => (
        <li key={domain.id} className="relative flex gap-4 pb-8 last:pb-0">
          {i < DOMAINS.length - 1 && (
            <span
              aria-hidden
              className={
                "absolute left-[15px] top-8 h-full w-px " +
                (domain.available
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "border-l border-dashed border-zinc-300 bg-transparent dark:border-zinc-700")
              }
            />
          )}
          <span
            aria-hidden
            className={
              "relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold " +
              (domain.available
                ? "bg-indigo-600 text-white"
                : "border border-dashed border-zinc-300 text-zinc-400 dark:border-zinc-700 dark:text-zinc-600")
            }
          >
            {domain.number}
          </span>

          <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-semibold">{domain.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-500">
                  {domain.weight}%
                </span>
                {domain.available && <DomainProgressBadge domainId={domain.id} />}
              </div>
            </div>
            <div className="mb-3 h-1 max-w-[10rem] rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-1 rounded-full bg-indigo-500"
                style={{ width: `${(domain.weight / maxWeight) * 100}%` }}
              />
            </div>
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              {domain.summary}
            </p>
            {domain.available ? (
              <Link
                href={`/domains/${domain.id}`}
                className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Open the lesson →
              </Link>
            ) : (
              <Link
                href={`/domains/${domain.id}`}
                className="inline-block rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800"
              >
                Coming soon
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
