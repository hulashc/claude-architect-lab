import type { Metadata } from "next";
import Link from "next/link";
import { DomainPath } from "@/components/domain-path";

export const metadata: Metadata = {
  title: "Learn",
  description: "The five exam domains, in the order they're built and studied.",
};

export default function DomainsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Learn</h1>
      <p className="mb-2 text-zinc-600 dark:text-zinc-400">
        Domain 1 established the lesson template the rest reuse, and was
        built and reviewed the slow way — one domain, studied first. Domains
        2–5&apos; lessons and practice questions are Claude-drafted at the
        owner&apos;s direction, pending a review pass; see the
        project&apos;s{" "}
        <Link href="/about" className="underline underline-offset-2">
          roadmap
        </Link>{" "}
        for exactly what that means per domain.
      </p>
      <p className="mb-10 text-sm text-zinc-500 dark:text-zinc-500">
        This is a sequence, not a gate: every domain is open, whether or not
        its content has been reviewed yet.
      </p>

      <DomainPath />
    </div>
  );
}
