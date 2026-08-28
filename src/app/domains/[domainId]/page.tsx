import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOMAINS, getDomain } from "@/lib/exam-blueprint";
import { getLesson } from "@/lib/content";
import { ModeToggle } from "@/components/mode-toggle";
import { LessonWithPath } from "@/components/lesson/lesson-with-path";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

type Params = { domainId: string };

export function generateStaticParams(): Params[] {
  return DOMAINS.map((d) => ({ domainId: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  return { title: domain?.title ?? "Domain not found" };
}

export default async function DomainPage({ params }: { params: Promise<Params> }) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  if (!domain) notFound();

  const lesson = getLesson(domainId);

  const prevDomain = DOMAINS.find((d) => d.number === domain.number - 1);
  const nextDomain = DOMAINS.find((d) => d.number === domain.number + 1);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <Link
          href="/domains"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
        >
          ← All domains
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Domain {domain.number} · {domain.weight}% of the exam
          </span>
        </div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">{domain.title}</h1>
      </div>

      {!lesson ? (
        <div className="max-w-3xl rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">{domain.summary}</p>
          <p className="mb-4 text-sm font-medium">Topics this lesson will cover:</p>
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {domain.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Not built yet — this domain is studied and implemented in order.
            See the roadmap on the{" "}
            <Link href="/about" className="underline underline-offset-2">
              About This Project
            </Link>{" "}
            page.
          </p>
        </div>
      ) : (
        <>
          <div className="max-w-3xl">
            <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
              {lesson.summary}
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-3">
              <ModeToggle />
            </div>
          </div>

          <LessonWithPath blocks={lesson.blocks} />

          <div className="mt-12 flex max-w-3xl flex-wrap items-center gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <Link
              href={`/domains/${domain.id}/practice`}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Practice — {lesson.practiceQuestionIds.length} questions
            </Link>
            <CompleteLessonButton domainId={domain.id} />
          </div>
        </>
      )}

      <nav className="mt-8 flex max-w-3xl items-center justify-between border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800">
        {prevDomain ? (
          <Link
            href={`/domains/${prevDomain.id}`}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Domain {prevDomain.number}: {prevDomain.shortTitle}
          </Link>
        ) : (
          <span />
        )}
        {nextDomain ? (
          <Link
            href={`/domains/${nextDomain.id}`}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Domain {nextDomain.number}: {nextDomain.shortTitle} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
