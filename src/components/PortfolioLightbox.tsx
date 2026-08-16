"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export function PortfolioLightbox({
  photos,
  title,
  closeLabel,
}: {
  photos: string[];
  title: string;
  closeLabel: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const prev = useCallback(
    () => setOpenAt((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setOpenAt((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openAt === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, close, prev, next]);

  return (
    <>
      {photos.length > 1 && (
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-ink"
        >
          +{photos.length - 1}
        </button>
      )}

      {openAt !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className="absolute top-5 right-5 text-3xl leading-none text-white/80 hover:text-white"
          >
            &times;
          </button>

          <div
            className="relative flex h-full w-full max-w-4xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={photos[openAt]}
                alt={title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                  ›
                </button>
                <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm text-white/70">
                  {openAt + 1} / {photos.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
