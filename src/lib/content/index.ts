import type { DomainId } from "@/lib/exam-blueprint";
import type { ArchitectureDecisionScenario, Lesson } from "@/lib/content/schema";
import { domain1Lesson } from "@content/domains/01-agentic-architecture-orchestration/lesson";
import { domain1Questions } from "@content/quizzes/domain-1";
import { insuranceClaimsScenario } from "@content/architecture-lab/insurance-claims";

/** Registry of everything content/ currently holds, keyed by domain. Add an
 * entry here the moment a new domain's lesson/quiz bank lands — nothing else
 * in src/app should import from content/ directly. */
export const LESSONS: Partial<Record<DomainId, Lesson>> = {
  "agentic-architecture-orchestration": domain1Lesson,
};

export const QUIZ_BANKS: Partial<Record<DomainId, typeof domain1Questions>> = {
  "agentic-architecture-orchestration": domain1Questions,
};

export const ARCHITECTURE_LAB_SCENARIOS: ArchitectureDecisionScenario[] = [
  insuranceClaimsScenario,
];

export function getLesson(domainId: string): Lesson | undefined {
  return LESSONS[domainId as DomainId];
}

export function getQuizBank(domainId: string) {
  return QUIZ_BANKS[domainId as DomainId] ?? [];
}

export function getArchitectureLabScenario(slug: string) {
  return ARCHITECTURE_LAB_SCENARIOS.find((s) => s.slug === slug);
}
