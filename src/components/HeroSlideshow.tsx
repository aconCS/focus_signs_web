"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 6000;
const FADE_MS = 1200;

/**
 * Crossfading photo backdrop for the hero.
 *
 * Deliberately cheap, because this sits behind the most performance-sensitive
 * part of the page:
 *  - at most two <Image> layers are mounted, so decoded-image memory stays
 *    bounded no matter how many photos are in the set
 *  - the crossfade animates opacity only, and only for ~1.2s every 6s
 *  - the timer stops when the tab is hidden or the hero scrolls out of view
 *  - reduced-motion users get a single still frame and no timer at all
 */
export function HeroSlideshow({
  photos,
  className = "",
}: {
  photos: readonly string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photos.length < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let visible = true;
    let cleanup: number | undefined;

    const advance = () => {
      if (!visible || document.hidden) return;
      setIndex((current) => {
        setPrevious(current);
        // Drop the outgoing layer once the fade has finished, so we never
        // hold more than two decoded images.
        window.clearTimeout(cleanup);
        cleanup = window.setTimeout(() => setPrevious(null), FADE_MS + 100);
        return (current + 1) % photos.length;
      });
    };

    const timer = window.setInterval(advance, HOLD_MS);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting;
      },
      { rootMargin: "0px" },
    );
    if (root.current) observer.observe(root.current);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(cleanup);
      observer.disconnect();
    };
  }, [photos.length]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {previous !== null && (
        <Image
          src={photos[previous]}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Keyed so it remounts and replays the fade-in over the outgoing layer */}
      <Image
        key={index}
        src={photos[index]}
        alt=""
        fill
        sizes="100vw"
        priority={index === 0}
        className="hero-slide object-cover"
      />

      {/* Scrim. The hero runs white text over this, so it has to stay dark
          enough to clear AA on every frame of the slideshow.

          Both layers are indigo — the vignette uses a darker shade of the
          same hue (#1f1b49 is #393185 taken down in luminance, not mixed
          toward black) so it deepens the corners without tinting the brand
          colour. Offset right of centre so the falloff is heaviest on the
          left, behind the headline. */}
      <div className="absolute inset-0 bg-indigo/90" />
      <div className="absolute inset-0 bg-[radial-gradient(125%_105%_at_70%_45%,transparent_35%,rgba(31,27,73,0.45)_72%,rgba(31,27,73,0.7)_100%)]" />
    </div>
  );
}
