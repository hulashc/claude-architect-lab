"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks which of the given anchor ids is "active" — the first one
 * currently intersecting the viewport, in document order. Powers the
 * lesson path rail's current-stage highlight.
 *
 * All state here is local (`useState`/`useRef`), nothing persisted — see
 * architecture/adr/0004-ephemeral-session-only-progress.md. Resets on
 * every reload/remount, same as the ephemeral "revealed option" state
 * already used by src/components/quiz/question-card.tsx.
 */
export function useActiveStage(anchorIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersecting = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || anchorIds.length === 0) {
      return;
    }

    intersecting.current = new Map();

    const elements = anchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersecting.current.set(entry.target.id, entry.isIntersecting);
        }
        const firstIntersecting = anchorIds.find((id) => intersecting.current.get(id));
        // Retain the previous active id when nothing intersects (e.g. a
        // tall diagram spans the whole viewport, or the gap between two
        // sections) rather than clearing — this is what stops the rail
        // flickering to nothing mid-scroll.
        if (firstIntersecting) setActiveId(firstIntersecting);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // Deps keyed on the joined value on purpose: anchorIds is a fresh
    // array every render, and re-creating the observer only needs to
    // happen when its contents actually change (e.g. a mode toggle
    // changes which blocks are visible).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorIds.join("|")]);

  return activeId;
}
