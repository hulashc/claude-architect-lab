import Link from "next/link";
import { DomainWeightBars } from "@/components/domain-weight-bars";
import { ReadinessBadge } from "@/components/readiness-badge";
import { EXAM_FORMAT } from "@/lib/exam-blueprint";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Independent exam prep — not affiliated with Anthropic
      </p>
      <h1 className="mb-5 text-4xl font-semibold tracking-tight">
        Learn Claude architecture by making architecture decisions.
      </h1>
      <p className="mb-8 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Most exam-prep sites explain what an agent is. This one gives you a
        requirements list, asks you to pick an architecture, and then shows
        you exactly why the option you picked was right, tempting, or
        over-engineered — the same judgment Anthropic&apos;s Claude Certified
        Architect – Foundations exam is built to test.
      </p>

      <div className="mb-10 flex flex-wrap gap-3">
        <Link
          href="/domains/agentic-architecture-orchestration"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Start Domain 1
        </Link>
        <Link
          href="/architecture-lab"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          Try the Architecture Decision Lab
        </Link>
        <Link
          href="/certification"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          See the exam blueprint
        </Link>
      </div>

      <ReadinessBadge />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          { q: "What do I need to learn?", a: "Five domains, weighted exactly like the real exam blueprint." },
          { q: "How does it work architecturally?", a: "Every concept ships with a real diagram and code, not just a definition." },
          { q: "Can I prove I understand it?", a: "Original scenario questions with per-option rationales, not just an answer key." },
        ].map((item) => (
          <div key={item.q} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="mb-1.5 font-semibold">{item.q}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Exam domain weights</h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {EXAM_FORMAT.questionCount} questions · {EXAM_FORMAT.minutes} min ·
            pass at {EXAM_FORMAT.passingScore}/{EXAM_FORMAT.maxScore}
          </span>
        </div>
        <DomainWeightBars />
      </div>
    </div>
  );
}
