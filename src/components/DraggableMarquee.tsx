"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Auto-scrolling strip that the user can also grab and drag.
 *
 * The track is duplicated by the caller, so scrolling wraps seamlessly at the
 * halfway point. Auto-advance runs off rAF and writes `scrollLeft` — cheap,
 * and it stops entirely while off-screen, while dragging, and on hover.
 */
export function DraggableMarquee({
  children,
  speed = 0.5,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  /** Pixels per frame at 60fps. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let visible = true;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    // The caller renders the row twice; one half is the loop length.
    const half = () => el.scrollWidth / 2;

    // Start the reversed row at the midpoint so it can travel backwards.
    if (reverse) el.scrollLeft = half();

    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
    };

    const tick = () => {
      if (visible && !paused && !dragging && !reduced.matches) {
        el.scrollLeft += reverse ? -speed : speed;
        wrap();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      // Ignore secondary buttons so right-click menus still work.
      if (event.button !== 0) return;
      dragging = true;
      moved = 0;
      startX = event.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(event.pointerId);
      el.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startScroll - dx;
      wrap();
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture?.(event.pointerId);
      el.style.cursor = "grab";
    };

    // A drag that travelled more than a few pixels should not also open the
    // link the pointer happens to be resting on.
    const onClickCapture = (event: MouseEvent) => {
      if (moved > 5) {
        event.preventDefault();
        event.stopPropagation();
      }
      moved = 0;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [speed, reverse]);

  return (
    <div
      ref={viewport}
      /* `overflow-x-auto` keeps it usable with a trackpad, keyboard and
         touch; the scrollbar itself is hidden because the strip loops. */
      className={`cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
