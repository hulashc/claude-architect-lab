import { describe, expect, it } from "vitest";
import {
  ArchitectureDecisionScenarioSchema,
  LessonSchema,
  QuizQuestionSchema,
  validateArchitectureScenarioInvariants,
  validateLessonInvariants,
  validateQuizQuestionInvariants,
  type Lesson,
} from "@/lib/content/schema";
import { domain1Lesson } from "@content/domains/01-agentic-architecture-orchestration/lesson";
import { domain1Questions } from "@content/quizzes/domain-1";
import { insuranceClaimsScenario } from "@content/architecture-lab/insurance-claims";
import { DOMAINS, TOTAL_WEIGHT } from "@/lib/exam-blueprint";

describe("exam blueprint", () => {
  it("domain weights sum to 100", () => {
    expect(TOTAL_WEIGHT).toBe(100);
  });

  it("has a unique, sequential domain number for each domain", () => {
    const numbers = DOMAINS.map((d) => d.number).sort();
    expect(numbers).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("domain 1 quiz bank", () => {
  it("has exactly 20 questions", () => {
    expect(domain1Questions.length).toBe(20);
  });

  it("every question matches the schema", () => {
    for (const q of domain1Questions) {
      expect(() => QuizQuestionSchema.parse(q)).not.toThrow();
    }
  });

  it("every question satisfies structural invariants (one correct option, real rationales, unique option ids)", () => {
    const problems = domain1Questions.flatMap(validateQuizQuestionInvariants);
    expect(problems).toEqual([]);
  });

  it("has unique question ids", () => {
    const ids = domain1Questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("domain 1 lesson", () => {
  it("matches the lesson schema", () => {
    expect(() => LessonSchema.parse(domain1Lesson)).not.toThrow();
  });

  it("every practiceQuestionId resolves to a real question in the quiz bank", () => {
    const knownIds = new Set(domain1Questions.map((q) => q.id));
    for (const id of domain1Lesson.practiceQuestionIds) {
      expect(knownIds.has(id)).toBe(true);
    }
  });

  it("the embedded scenario block's question satisfies quiz invariants too", () => {
    const scenarioBlock = domain1Lesson.blocks.find((b) => b.type === "scenario");
    expect(scenarioBlock).toBeDefined();
    if (scenarioBlock?.type === "scenario") {
      expect(validateQuizQuestionInvariants(scenarioBlock.question)).toEqual([]);
    }
  });

  it("has at least one certification-mode and one architect-mode block, proving the mode split is real", () => {
    const modes = domain1Lesson.blocks.map((b) => b.mode);
    expect(modes).toContain("certification");
    expect(modes).toContain("architect");
  });

  it("has at least one terms block", () => {
    expect(domain1Lesson.blocks.some((b) => b.type === "terms")).toBe(true);
  });

  it("satisfies lesson-level invariants (no duplicate/self-restating terms)", () => {
    expect(validateLessonInvariants(domain1Lesson)).toEqual([]);
  });

  it("every term definition is plain text, not markdown", () => {
    for (const block of domain1Lesson.blocks) {
      if (block.type !== "terms") continue;
      for (const { definition } of block.terms) {
        expect(definition).not.toMatch(/\*\*/);
        expect(definition).not.toMatch(/`/);
        expect(definition).not.toMatch(/\]\(/);
      }
    }
  });

  it("catches a duplicate term across terms blocks", () => {
    const lessonWithDuplicateTerm: Lesson = {
      ...domain1Lesson,
      blocks: [
        {
          type: "terms",
          title: "Terms A",
          mode: "both",
          terms: [{ term: "Agent", definition: "A repeated term for this test." }],
        },
        {
          type: "terms",
          title: "Terms B",
          mode: "both",
          terms: [{ term: "Agent", definition: "The same term defined again." }],
        },
      ],
    };
    const problems = validateLessonInvariants(lessonWithDuplicateTerm);
    expect(problems).toHaveLength(1);
  });
});

describe("architecture decision lab", () => {
  it("the insurance claims scenario matches the schema", () => {
    expect(() =>
      ArchitectureDecisionScenarioSchema.parse(insuranceClaimsScenario),
    ).not.toThrow();
  });

  it("has exactly one 'best' option and unique option ids", () => {
    expect(validateArchitectureScenarioInvariants(insuranceClaimsScenario)).toEqual(
      [],
    );
  });
});
