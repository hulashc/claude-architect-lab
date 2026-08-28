import { describe, expect, it } from "vitest";
import {
  STAGE_LABELS,
  lessonStages,
  visibleBlocks,
} from "@/lib/content/lesson-path";
import { domain1Lesson } from "@content/domains/01-agentic-architecture-orchestration/lesson";

const MODES = ["certification", "architect"] as const;

describe("lesson-path", () => {
  it("every stage label is a non-empty string (guards a missing STAGE_LABELS entry)", () => {
    for (const label of Object.values(STAGE_LABELS)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });

  for (const mode of MODES) {
    it(`visibleBlocks and lessonStages never disagree on count (${mode} mode)`, () => {
      const visible = visibleBlocks(domain1Lesson.blocks, mode);
      const stages = lessonStages(domain1Lesson.blocks, mode);
      expect(stages).toHaveLength(visible.length);
    });

    it(`anchor ids are unique within a lesson (${mode} mode)`, () => {
      const visible = visibleBlocks(domain1Lesson.blocks, mode);
      const ids = visible.map((v) => v.anchorId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  }

  it("excludes the other mode's blocks and always includes 'both' blocks", () => {
    const certification = visibleBlocks(domain1Lesson.blocks, "certification");
    const architect = visibleBlocks(domain1Lesson.blocks, "architect");

    const certOnlyBlock = domain1Lesson.blocks.find((b) => b.mode === "certification");
    const architectOnlyBlock = domain1Lesson.blocks.find((b) => b.mode === "architect");
    expect(certOnlyBlock).toBeDefined();
    expect(architectOnlyBlock).toBeDefined();

    expect(certification.some(({ block }) => block === architectOnlyBlock)).toBe(false);
    expect(architect.some(({ block }) => block === certOnlyBlock)).toBe(false);

    const bothCount = domain1Lesson.blocks.filter((b) => b.mode === "both").length;
    expect(certification.filter(({ block }) => block.mode === "both")).toHaveLength(
      bothCount,
    );
  });

  it("anchor ids for 'both' blocks are stable across a mode toggle", () => {
    const certification = visibleBlocks(domain1Lesson.blocks, "certification");
    const architect = visibleBlocks(domain1Lesson.blocks, "architect");

    const certBothAnchors = new Map(
      certification.filter(({ block }) => block.mode === "both").map((v) => [v.block, v.anchorId]),
    );
    for (const { block, anchorId } of architect) {
      if (block.mode === "both") {
        expect(certBothAnchors.get(block)).toBe(anchorId);
      }
    }
  });
});
