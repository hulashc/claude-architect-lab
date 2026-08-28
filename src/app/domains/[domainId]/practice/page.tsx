import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOMAINS, getDomain } from "@/lib/exam-blueprint";
import { getQuizBank } from "@/lib/content";
import { QuestionCard } from "@/components/quiz/question-card";
import { PracticeSummary } from "@/components/practice-summary";

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
  return { title: domain ? `Practice — ${domain.shortTitle}` : "Practice" };
}

export default async function PracticePage({ params }: { params: Promise<Params> }) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  if (!domain) notFound();

  const questions = getQuizBank(domainId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/domains/${domain.id}`}
        className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
      >
        ← Back to lesson
      </Link>

      <h1 className="mb-2 text-3xl font-semibold tracking-tight">
        Practice — {domain.title}
      </h1>

      {questions.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No practice questions for this domain yet.
        </p>
      ) : (
        <>
          <PracticeSummary questions={questions} />
          <div className="space-y-6">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
