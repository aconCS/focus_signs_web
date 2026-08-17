"use client";

import Image from "next/image";
import { usePauseOffscreen } from "./usePauseOffscreen";

/* No per-logo ratio: every mark now sits in an identical box and is fitted
   with object-contain, which is what keeps them all the same height. */
const logos = [
  { file: "mcdonald.svg", name: "McDonald's" },
  { file: "kfc.png", name: "KFC" },
  { file: "papantoniou.png", name: "Papantoniou" },
  { file: "aristo.png", name: "Aristo" },
  { file: "crocs.svg", name: "Crocs" },
  { file: "taco.png", name: "Taco Bell" },
  { file: "eu-foods.svg", name: "EU Foods" },
  { file: "cafe-nero.svg", name: "Caffè Nero" },
  { file: "keo.png", name: "KEO" },
] as const;

export function ClientLogos({ heading }: { heading?: string }) {
  const track = [...logos, ...logos];
  const strip = usePauseOffscreen<HTMLDivElement>();

  return (
    <div>
      {heading && (
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-ink/65 uppercase">
          {heading}
        </p>
      )}
      <div
        ref={strip}
        className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${heading ? "mt-8" : ""}`}
      >
        <div className="animate-logo-marquee flex w-max items-center gap-16">
          {track.map((logo, i) => (
            <div
              key={`${logo.file}-${i}`}
              /* Every logo gets the same box height and the same width budget.
                 object-contain then fits each mark inside it, so wide marks and
                 square marks read at a consistent optical size instead of each
                 being scaled by its own aspect ratio.

                 Shown in full colour: these are recognisable brands and the
                 recognition is the point. */
              className="relative h-16 w-40 shrink-0 md:h-20 md:w-48"
            >
              <Image
                src={`/logos/${logo.file}`}
                alt={logo.name}
                fill
                sizes="192px"
                loading="lazy"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
