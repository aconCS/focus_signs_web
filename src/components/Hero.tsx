"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IrisBlades } from "./IrisMark";
import { HeroSlideshow } from "./HeroSlideshow";
import { Link } from "@/i18n/navigation";
import { portfolioProjects } from "@/lib/portfolio";

/* Same source as the portfolio gallery, so the hero always shows current work
   without a second list to keep in sync. */
const heroPhotos = portfolioProjects.map((project) => project.photo);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const t = useTranslations("Home");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const blades = gsap.utils.toArray<SVGPathElement>(".iris-blade");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        gsap.set(blades, { transformOrigin: "50% 50%" });

        tl.from(blades, {
          scale: 0,
          rotate: -35,
          opacity: 0,
          duration: 0.8,
          stagger: { each: 0.025, from: "random" },
        })
          .from(
            ".hero-line",
            { yPercent: 110, duration: 0.9, stagger: 0.08 },
            "-=0.5"
          )
          .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
          .from(".hero-cta", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, "-=0.35")
          .from(".hero-badge", { opacity: 0, y: 8, duration: 0.4 }, "-=0.2");

        // The aperture no longer rotates. It settles into place with the rest
        // of the intro and then stops, so the hero costs nothing once the
        // timeline finishes. See the note on .iris-spin in globals.css.
      });

      // Reduced-motion: everything simply visible, no timeline needed —
      // elements have no initial hidden state outside the "from" tween.
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      /* 80% of the viewport, leaving the next section peeking above the fold
         as a scroll cue. `svh` rather than `vh` so mobile browser chrome does
         not eat into it. The negative top margin slides the hero under the
         sticky nav so the nav floats over the photos at the top of the page. */
      className="relative -mt-[4.5rem] flex min-h-[80svh] w-full items-center overflow-hidden bg-indigo text-white"
    >
      <HeroSlideshow photos={heroPhotos} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 -top-48 text-white/[0.08] contain-paint"
      >
        <IrisBlades className="iris-spin size-[760px]" />
      </div>

      {/* pt clears the transparent nav sitting over the hero */}
      <div className="shell relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-2xl text-[clamp(2.75rem,8.5vw,6.75rem)] font-display leading-[0.85] font-extrabold tracking-tight uppercase">
            <span className="block overflow-hidden">
              <span className="hero-line block">{t("heroLine1")}</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block text-acid">{t("heroLine2")}</span>
            </span>
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-6">
            <Link
              href="/contact"
              className="hero-cta rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              {t("ctaQuote")}
            </Link>
            <Link
              href="/portfolio"
              className="hero-cta border-b border-white/35 pb-0.5 text-sm font-semibold text-white transition-colors hover:border-white/70"
            >
              {t("ctaWork")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
