import { DOMAINS } from "@/lib/exam-blueprint";

/**
 * Single-series magnitude comparison (5 domains, one weight each) — one
 * accent hue, direct labels, no legend needed. Domain order (1–5) is kept
 * rather than sorted by weight, so it stays consistent with the numbered
 * domain list everywhere else on the site.
 */
export function DomainWeightBars() {
  const max = Math.max(...DOMAINS.map((d) => d.weight));

  return (
    <div className="w-full overflow-x-auto">
      <ul className="min-w-[22rem] space-y-3">
        {DOMAINS.map((domain) => (
          <li key={domain.id} className="flex items-center gap-3 text-sm">
            <span className="w-44 shrink-0 text-zinc-700 dark:text-zinc-300">
              {domain.number}. {domain.shortTitle}
            </span>
            <span className="h-2.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <span
                className="block h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                style={{ width: `${(domain.weight / max) * 100}%` }}
              />
            </span>
            <span className="w-10 shrink-0 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {domain.weight}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
