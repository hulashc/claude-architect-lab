"use client";

import type { LessonBlock } from "@/lib/content/schema";
import { lessonStages, visibleBlocks } from "@/lib/content/lesson-path";
import { LessonBlockView } from "@/components/lesson/lesson-blocks";
import { LessonPath } from "@/components/lesson/lesson-path";
import { useActiveStage } from "@/components/lesson/use-active-stage";
import { useProgress } from "@/components/progress/progress-context";

/**
 * Composition root: renders a lesson's blocks alongside a sticky path
 * rail that always shows the stage sequence ("what comes after what")
 * without turning the lesson into a click-through wizard — the page stays
 * a single scroll, the rail just tracks where you are in it.
 *
 * Desktop gets a sticky vertical rail; narrow viewports get a sticky
 * horizontal bar instead. Both variants are rendered and gated with
 * Tailwind responsive classes rather than a JS media query, so there's no
 * hydration mismatch between server and client.
 */
export function LessonWithPath({ blocks }: { blocks: LessonBlock[] }) {
  const { mode } = useProgress();
  const visible = visibleBlocks(blocks, mode);
  const stages = lessonStages(blocks, mode);
  const activeId = useActiveStage(visible.map((v) => v.anchorId));

  return (
    <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <div className="hidden lg:block">
        <div className="sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <LessonPath stages={stages} activeId={activeId} variant="rail" />
        </div>
      </div>

      <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-zinc-200 bg-white/80 px-6 py-2 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-black/80">
        <LessonPath stages={stages} activeId={activeId} variant="bar" />
      </div>

      <div className="max-w-3xl space-y-10">
        {visible.map(({ block, anchorId }) => (
          <div key={anchorId} id={anchorId} className="scroll-mt-24">
            <LessonBlockView block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}
