import type { Metadata } from "next";
import Link from "next/link";
import { ARCHITECTURE_LAB_SCENARIOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Architecture Lab",
  description:
    "Given a set of requirements, choose the right Claude architecture, then see exactly why each option was right, tempting, or over-engineered.",
};

export default function ArchitectureLabIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Architecture Lab</h1>
      <p className="mb-10 text-zinc-600 dark:text-zinc-400">
        A requirements list, a set of plausible architectures, and a real
        trade-off explanation for whichever one you pick — not just a
        correct/incorrect flag. This is the kind of scoping judgment the
        exam is built to test.
      </p>

      <ul className="space-y-4">
        {ARCHITECTURE_LAB_SCENARIOS.map((scenario) => (
          <li
            key={scenario.slug}
            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <p className="mb-2 font-semibold">{scenario.title}</p>
            <ul className="mb-3 list-disc space-y-0.5 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              {scenario.requirements.slice(0, 3).map((r) => (
                <li key={r}>{r}</li>
              ))}
              {scenario.requirements.length > 3 && (
                <li>+ {scenario.requirements.length - 3} more</li>
              )}
            </ul>
            <Link
              href={`/architecture-lab/${scenario.slug}`}
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Make the call →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
