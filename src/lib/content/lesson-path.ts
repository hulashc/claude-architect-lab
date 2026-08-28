import type { LessonBlock } from "@/lib/content/schema";

/** The active learning mode a lesson is being read in — deliberately not
 * imported from src/lib/progress/store.ts, so the content model has no
 * dependency on the (ephemeral) progress module. See
 * src/components/mode-toggle.tsx. */
export type LearningMode = "certification" | "architect";

/** Human-readable label for each lesson-block kind, shown in the lesson
 * path rail. A Record keyed on the full block-type union means adding a
 * new block type without labeling it here is a compile error — the guard
 * that keeps the rail from silently omitting a section. */
export const STAGE_LABELS: Record<LessonBlock["type"], string> = {
  concept: "Concept",
  terms: "Key terms",
  diagram: "Diagram",
  code: "Code",
  scenario: "Scenario",
  examTrap: "Exam trap",
  miniLab: "Mini lab",
};

export interface VisibleBlock {
  block: LessonBlock;
  anchorId: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/** Every block on screen in a given mode, paired with a stable anchor id.
 * Anchors are indexed off the *full* blocks array (not the filtered
 * result), so a block's anchor doesn't change when the learner toggles
 * mode. This is the single source of truth both the lesson body
 * (LessonWithPath) and the path rail (LessonPath) read from, so the two
 * can never disagree about what's visible. */
export function visibleBlocks(
  blocks: LessonBlock[],
  mode: LearningMode,
): VisibleBlock[] {
  return blocks
    .map((block, index) => ({
      block,
      anchorId: `${index}-${slugify(block.title)}`,
    }))
    .filter(({ block }) => block.mode === "both" || block.mode === mode);
}

export interface LessonStage {
  anchorId: string;
  kind: LessonBlock["type"];
  kindLabel: string;
  title: string;
}

/** One rail entry per visible block, not collapsed runs — Domain 1's
 * concept blocks are non-adjacent and semantically distinct, so collapsing
 * consecutive same-type blocks would misrepresent the page. Derived
 * directly from visibleBlocks, so it can't drift from what's on screen. */
export function lessonStages(
  blocks: LessonBlock[],
  mode: LearningMode,
): LessonStage[] {
  return visibleBlocks(blocks, mode).map(({ block, anchorId }) => ({
    anchorId,
    kind: block.type,
    kindLabel: STAGE_LABELS[block.type],
    title: block.title,
  }));
}
