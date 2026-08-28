import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARCHITECTURE_LAB_SCENARIOS, getArchitectureLabScenario } from "@/lib/content";
import { ArchitectureDecisionLab } from "@/components/architecture-lab/decision-lab";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARCHITECTURE_LAB_SCENARIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getArchitectureLabScenario(slug);
  return { title: scenario?.title ?? "Scenario not found" };
}

export default async function ArchitectureLabScenarioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const scenario = getArchitectureLabScenario(slug);
  if (!scenario) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/architecture-lab"
        className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
      >
        ← Architecture Lab
      </Link>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">{scenario.title}</h1>
      <ArchitectureDecisionLab scenario={scenario} />
    </div>
  );
}
