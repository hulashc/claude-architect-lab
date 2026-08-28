import { z } from "zod";

/**
 * Content model — see architecture/adr/0002-content-model.md.
 *
 * Decision (revised from the original MDX proposal): lessons are sequences of
 * *typed blocks*, not free-flowing prose. The lesson template
 * (concept → diagram → code → scenario → decision → exam trap → questions →
 * mini lab) is already block-structured, so a discriminated union validated
 * by Zod gives us the same authoring ergonomics as MDX for the prose blocks
 * (markdown strings, rendered via react-markdown — safe, no arbitrary code
 * execution from content) while keeping diagrams/scenarios/questions as
 * real typed data instead of JSX embedded in content files. One content
 * system, fully type-checked, testable with tests/unit/content.test.ts.
 */

// ---------------------------------------------------------------------------
// Quiz / scenario questions
// ---------------------------------------------------------------------------

export const QuizOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  correct: z.boolean(),
  /** Why this option is right, tempting-but-wrong, or over-engineered. Always
   * required — the rationale is the point, not just the correct letter. */
  rationale: z.string().min(1),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  domainId: z.string().min(1),
  /** The specific exam concept this question probes, shown after the
   * learner answers — e.g. "Agentic orchestration + bounded tool access". */
  examConcept: z.string().min(1),
  /** Longer scenario setup shown above the question, markdown. */
  scenario: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(QuizOptionSchema).min(3).max(5),
  difficulty: z.enum(["foundational", "applied", "exam-style"]),
});

export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

/** Structural rules a schema alone can't express: exactly one correct option,
 * every option has a real (non-placeholder) rationale. Enforced in
 * tests/unit/content.test.ts, not at parse time, so a bad question fails CI
 * with a clear message rather than a Zod path error. */
export function validateQuizQuestionInvariants(q: QuizQuestion): string[] {
  const problems: string[] = [];
  const correctCount = q.options.filter((o) => o.correct).length;
  if (correctCount !== 1) {
    problems.push(
      `question ${q.id}: expected exactly 1 correct option, found ${correctCount}`,
    );
  }
  for (const o of q.options) {
    if (o.rationale.trim().length < 10) {
      problems.push(
        `question ${q.id}: option ${o.id} rationale is too short to be a real explanation`,
      );
    }
  }
  const ids = new Set(q.options.map((o) => o.id));
  if (ids.size !== q.options.length) {
    problems.push(`question ${q.id}: option ids are not unique`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Architecture Decision Lab scenarios
// ---------------------------------------------------------------------------

export const ArchitectureOptionVerdictSchema = z.enum([
  "best",
  "workable",
  "tempting-but-wrong",
  "over-engineered",
]);

export const ArchitectureOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  verdict: ArchitectureOptionVerdictSchema,
  /** ASCII architecture diagram shown after the learner picks this option. */
  diagram: z.string().min(1),
  explanation: z.string().min(1),
});

export const ArchitectureDecisionScenarioSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  domainId: z.string().min(1),
  requirements: z.array(z.string().min(1)).min(3),
  prompt: z.string().min(1),
  options: z.array(ArchitectureOptionSchema).min(3).max(6),
});

export type ArchitectureOption = z.infer<typeof ArchitectureOptionSchema>;
export type ArchitectureDecisionScenario = z.infer<
  typeof ArchitectureDecisionScenarioSchema
>;

export function validateArchitectureScenarioInvariants(
  s: ArchitectureDecisionScenario,
): string[] {
  const problems: string[] = [];
  const bestCount = s.options.filter((o) => o.verdict === "best").length;
  if (bestCount !== 1) {
    problems.push(
      `scenario ${s.slug}: expected exactly 1 "best" option, found ${bestCount}`,
    );
  }
  const ids = new Set(s.options.map((o) => o.id));
  if (ids.size !== s.options.length) {
    problems.push(`scenario ${s.slug}: option ids are not unique`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Lesson content blocks
// ---------------------------------------------------------------------------

/** Which learning mode a block belongs to. "both" (the default) means the
 * block is foundational and shown regardless of mode; "certification" /
 * "architect" tag the blocks that differ by framing — see
 * src/components/mode/mode-context.tsx. */
export const BlockModeSchema = z.enum(["both", "certification", "architect"]);

const baseBlock = {
  mode: BlockModeSchema.default("both"),
};

export const ConceptBlockSchema = z.object({
  type: z.literal("concept"),
  title: z.string().min(1),
  /** Markdown, rendered via react-markdown. */
  body: z.string().min(1),
  ...baseBlock,
});

export const DiagramBlockSchema = z.object({
  type: z.literal("diagram"),
  title: z.string().min(1),
  ascii: z.string().min(1),
  caption: z.string().optional(),
  ...baseBlock,
});

export const CodeBlockSchema = z.object({
  type: z.literal("code"),
  title: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
  caption: z.string().optional(),
  ...baseBlock,
});

export const ScenarioBlockSchema = z.object({
  type: z.literal("scenario"),
  title: z.string().min(1),
  intro: z.string().min(1),
  question: QuizQuestionSchema,
  ...baseBlock,
});

export const ExamTrapBlockSchema = z.object({
  type: z.literal("examTrap"),
  title: z.string().min(1),
  body: z.string().min(1),
  ...baseBlock,
});

export const MiniLabBlockSchema = z.object({
  type: z.literal("miniLab"),
  title: z.string().min(1),
  body: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  ...baseBlock,
});

export const TermSchema = z.object({
  term: z.string().min(1).max(60),
  /** Plain text, not markdown — deliberately not rendered through
   * react-markdown (see lesson-blocks.tsx). A definition that needs
   * formatting is a definition that's too long; it belongs in a concept
   * block instead. Kept short on purpose so a terms block reads as a
   * reference, not a paragraph. */
  definition: z.string().min(20).max(320),
});

export const TermsBlockSchema = z.object({
  type: z.literal("terms"),
  title: z.string().min(1),
  terms: z.array(TermSchema).min(1).max(12),
  ...baseBlock,
});

export type Term = z.infer<typeof TermSchema>;

export const LessonBlockSchema = z.discriminatedUnion("type", [
  ConceptBlockSchema,
  DiagramBlockSchema,
  CodeBlockSchema,
  ScenarioBlockSchema,
  ExamTrapBlockSchema,
  MiniLabBlockSchema,
  TermsBlockSchema,
]);

export type LessonBlock = z.infer<typeof LessonBlockSchema>;

export const LessonSchema = z.object({
  domainId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  blocks: z.array(LessonBlockSchema).min(1),
  /** ids into the domain's quiz bank, for the "Practice" link at the end of
   * the lesson — kept separate from scenario blocks embedded mid-lesson. */
  practiceQuestionIds: z.array(z.string().min(1)),
});

export type Lesson = z.infer<typeof LessonSchema>;

/** Structural rules about a lesson's `terms` blocks that a schema alone
 * can't express: a term should be unlabeled once, not several times, and a
 * definition should actually define rather than just restate its term.
 * Enforced in tests/unit/content.test.ts, same convention as
 * validateQuizQuestionInvariants. */
export function validateLessonInvariants(lesson: Lesson): string[] {
  const problems: string[] = [];
  const seen = new Map<string, number>(); // normalized term -> count across the lesson

  for (const block of lesson.blocks) {
    if (block.type !== "terms") continue;

    const withinBlock = new Set<string>();
    for (const { term, definition } of block.terms) {
      const key = term.trim().toLowerCase();

      if (withinBlock.has(key)) {
        problems.push(
          `lesson ${lesson.domainId}: term "${term}" appears more than once in terms block "${block.title}"`,
        );
      }
      withinBlock.add(key);
      seen.set(key, (seen.get(key) ?? 0) + 1);

      const normalizedDefinition = definition.trim().toLowerCase();
      if (
        normalizedDefinition === key ||
        normalizedDefinition.startsWith(key) &&
          normalizedDefinition.length < key.length + 5
      ) {
        problems.push(
          `lesson ${lesson.domainId}: definition for "${term}" just restates the term`,
        );
      }
    }
  }

  for (const [key, count] of seen) {
    if (count > 1) {
      problems.push(
        `lesson ${lesson.domainId}: term "${key}" is defined in more than one terms block`,
      );
    }
  }

  return problems;
}
