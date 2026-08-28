import type { Metadata } from "next";
import Link from "next/link";
import { DomainWeightBars } from "@/components/domain-weight-bars";
import { DOMAINS, EXAM_FORMAT } from "@/lib/exam-blueprint";

export const metadata: Metadata = {
  title: "Certification Overview",
  description:
    "What the Claude Certified Architect – Foundations exam is, its format, the official domain weights, and how this site's study roadmap maps onto them.",
};

const RECOMMENDED_COURSES = [
  "AI Fluency",
  "Claude 101",
  "Building with the Claude API",
  "Claude with Amazon Bedrock",
  "Claude on Google Cloud",
  "Introduction to MCP",
  "Claude Code in Action",
];

export default function CertificationPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">
        Certification Overview
      </h1>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">
        A summary of Anthropic&apos;s Claude Certified Architect – Foundations
        exam, kept in sync with{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
          src/lib/exam-blueprint.ts
        </code>
        . This page is a study aid, not the exam — for registration, current
        eligibility requirements, and the authoritative syllabus, see{" "}
        <a
          href="https://anthropic.skilljar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Anthropic Academy
        </a>
        .
      </p>
      <p className="mb-10 text-sm text-zinc-500 dark:text-zinc-500">
        Anthropic&apos;s own certification page doesn&apos;t publish a short
        abbreviation for the exam — third-party prep resources use both
        &ldquo;CCA-F&rdquo; and &ldquo;CCAR-F,&rdquo; inconsistently, so this
        site spells out the full name rather than picking one.
      </p>

      <p className="mb-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        Registration currently runs through Anthropic&apos;s Partner Academy
        platform — access may be limited (a partner-organization email may be
        required). Check{" "}
        <a
          href="https://anthropic.skilljar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Anthropic Academy
        </a>{" "}
        for current eligibility before assuming open registration.
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Exam format</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Questions", value: EXAM_FORMAT.questionCount },
            { label: "Minutes", value: EXAM_FORMAT.minutes },
            { label: "Price", value: `$${EXAM_FORMAT.priceUsd}` },
            { label: "Passing score", value: `${EXAM_FORMAT.passingScore}/${EXAM_FORMAT.maxScore}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-500">{stat.label}</dt>
              <dd className="text-xl font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Domain weights</h2>
        <DomainWeightBars />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">The five domains</h2>
        <ul className="space-y-4">
          {DOMAINS.map((domain) => (
            <li key={domain.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="font-medium">
                  {domain.number}. {domain.title}
                </p>
                <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-500">
                  {domain.weight}%
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{domain.summary}</p>
              {domain.available ? (
                <Link
                  href={`/domains/${domain.id}`}
                  className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Open the lesson →
                </Link>
              ) : (
                <span className="mt-2 inline-block text-sm text-zinc-400 dark:text-zinc-600">
                  Coming soon
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Anthropic&apos;s recommended prep</h2>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          Anthropic Academy recommends these courses to prepare for the exam.
          This site is a companion for practicing architecture judgment, not
          a replacement for them.
        </p>
        <ul className="flex flex-wrap gap-2">
          {RECOMMENDED_COURSES.map((course) => (
            <li
              key={course}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
