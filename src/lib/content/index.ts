import type { DomainId } from "@/lib/exam-blueprint";
import type { ArchitectureDecisionScenario, Lesson, QuizQuestion } from "@/lib/content/schema";
import { domain1Lesson } from "@content/domains/01-agentic-architecture-orchestration/lesson";
import { domain1Questions } from "@content/quizzes/domain-1";
import { domain2Lesson } from "@content/domains/02-tool-design-mcp/lesson";
import { domain2Questions } from "@content/quizzes/domain-2";
import { domain3Lesson } from "@content/domains/03-claude-code-configuration-workflows/lesson";
import { domain3Questions } from "@content/quizzes/domain-3";
import { domain4Lesson } from "@content/domains/04-prompt-engineering-structured-output/lesson";
import { domain4Questions } from "@content/quizzes/domain-4";
import { domain5Lesson } from "@content/domains/05-context-management-reliability/lesson";
import { domain5Questions } from "@content/quizzes/domain-5";
import { insuranceClaimsScenario } from "@content/architecture-lab/insurance-claims";

/** Registry of everything content/ currently holds, keyed by domain. Add an
 * entry here the moment a new domain's lesson/quiz bank lands — nothing else
 * in src/app should import from content/ directly.
 *
 * Domains 2–5 are Claude-drafted at the owner's direction, pending a human
 * review pass before being treated as final — same flag as Domain 1's quiz
 * bank; see each file's header comment and docs/roadmap.md. */
export const LESSONS: Partial<Record<DomainId, Lesson>> = {
  "agentic-architecture-orchestration": domain1Lesson,
  "tool-design-mcp": domain2Lesson,
  "claude-code-configuration-workflows": domain3Lesson,
  "prompt-engineering-structured-output": domain4Lesson,
  "context-management-reliability": domain5Lesson,
};

export const QUIZ_BANKS: Partial<Record<DomainId, QuizQuestion[]>> = {
  "agentic-architecture-orchestration": domain1Questions,
  "tool-design-mcp": domain2Questions,
  "claude-code-configuration-workflows": domain3Questions,
  "prompt-engineering-structured-output": domain4Questions,
  "context-management-reliability": domain5Questions,
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
