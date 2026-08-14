"use client";

import { useEffect, useRef } from "react";

/**
 * Marks an element `data-offscreen="true"` while it is outside the viewport.
 *
 * CSS uses that to set `animation-play-state: paused`, so looping decoration
 * costs nothing once the user scrolls past it. Without this, every marquee and
 * the hero aperture keep compositing for the entire session.
 */
export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start paused only once we know; assume visible so nothing stalls if the
    // observer never fires.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          el.dataset.offscreen = entry.isIntersecting ? "false" : "true";
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
