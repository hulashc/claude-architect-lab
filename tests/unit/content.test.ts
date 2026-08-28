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
import { LESSONS, QUIZ_BANKS } from "@/lib/content";
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

/** Every domain with a lesson/quiz bank registered goes through the same
 * checks — one loop, so a new domain landing in src/lib/content/index.ts
 * is covered automatically instead of needing its own copy-pasted
 * describe block. */
for (const [domainId, questions] of Object.entries(QUIZ_BANKS)) {
  describe(`${domainId} quiz bank`, () => {
    it("has exactly 20 questions", () => {
      expect(questions).toHaveLength(20);
    });

    it("every question matches the schema", () => {
      for (const q of questions!) {
        expect(() => QuizQuestionSchema.parse(q)).not.toThrow();
      }
    });

    it("every question satisfies structural invariants (one correct option, real rationales, unique option ids)", () => {
      const problems = questions!.flatMap(validateQuizQuestionInvariants);
      expect(problems).toEqual([]);
    });

    it("has unique question ids, all tagged with this domain", () => {
      const ids = questions!.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const q of questions!) {
        expect(q.domainId).toBe(domainId);
      }
    });
  });
}

for (const [domainId, lesson] of Object.entries(LESSONS)) {
  describe(`${domainId} lesson`, () => {
    it("matches the lesson schema", () => {
      expect(() => LessonSchema.parse(lesson)).not.toThrow();
    });

    it("every practiceQuestionId resolves to a real question in this domain's quiz bank", () => {
      const knownIds = new Set((QUIZ_BANKS[domainId as keyof typeof QUIZ_BANKS] ?? []).map((q) => q.id));
      for (const id of lesson!.practiceQuestionIds) {
        expect(knownIds.has(id)).toBe(true);
      }
    });

    it("the embedded scenario block's question satisfies quiz invariants too", () => {
      const scenarioBlock = lesson!.blocks.find((b) => b.type === "scenario");
      expect(scenarioBlock).toBeDefined();
      if (scenarioBlock?.type === "scenario") {
        expect(validateQuizQuestionInvariants(scenarioBlock.question)).toEqual([]);
      }
    });

    it("has at least one certification-mode and one architect-mode block, proving the mode split is real", () => {
      const modes = lesson!.blocks.map((b) => b.mode);
      expect(modes).toContain("certification");
      expect(modes).toContain("architect");
    });

    it("has at least one terms block", () => {
      expect(lesson!.blocks.some((b) => b.type === "terms")).toBe(true);
    });

    it("satisfies lesson-level invariants (no duplicate/self-restating terms)", () => {
      expect(validateLessonInvariants(lesson!)).toEqual([]);
    });

    it("every term definition is plain text, not markdown", () => {
      for (const block of lesson!.blocks) {
        if (block.type !== "terms") continue;
        for (const { definition } of block.terms) {
          expect(definition).not.toMatch(/\*\*/);
          expect(definition).not.toMatch(/`/);
          expect(definition).not.toMatch(/\]\(/);
        }
      }
    });
  });
}

describe("validateLessonInvariants", () => {
  it("catches a duplicate term across terms blocks", () => {
    const anyLesson = Object.values(LESSONS)[0] as Lesson;
    const lessonWithDuplicateTerm: Lesson = {
      ...anyLesson,
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
