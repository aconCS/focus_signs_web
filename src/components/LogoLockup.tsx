import Image from "next/image";

/**
 * Composited from four separate transparent vector exports (F / aperture-O /
 * CUS / vertical SIGNS) per the Figma source — positions match the original
 * insets exactly. Do not swap for a flattened screenshot export: those bake
 * in an opaque white background.
 */
export function LogoLockup({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ aspectRatio: "300 / 73" }}>
      <span className="absolute" style={{ inset: "0% 84.61% 3.19% 0%" }}>
        <Image src="/brand/logomark-f.svg" alt="" fill className="object-contain" />
      </span>
      <span className="absolute" style={{ inset: "11.13% 63.01% 0% 14.83%" }}>
        <Image src="/brand/logomark-o.svg" alt="" fill className="object-contain" />
      </span>
      <span className="absolute" style={{ inset: "12.89% 9.02% 1.47% 39.74%" }}>
        <Image src="/brand/logomark-cus.svg" alt="" fill className="object-contain" />
      </span>
      <span className="absolute" style={{ inset: "11.46% 0% 3.19% 94.56%" }}>
        <Image src="/brand/logomark-signs.svg" alt="" fill className="object-contain" />
      </span>
    </span>
  );
}
