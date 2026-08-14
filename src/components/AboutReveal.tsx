"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutReveal({ lead, rest }: { lead: string; rest: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = rest.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wordEls = gsap.utils.toArray<HTMLElement>(".about-word", ref.current);
        gsap.set(wordEls, { opacity: 0.3 });
        gsap.to(wordEls, {
          opacity: 1,
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "top 20%",
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <p
      ref={ref}
      className="text-[clamp(1.625rem,2.6vw,2.375rem)] font-extrabold leading-[1.3] tracking-tight text-ink"
    >
      <span>{lead} </span>
      {words.map((word, i) => (
        <span key={i} className="about-word opacity-30">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
