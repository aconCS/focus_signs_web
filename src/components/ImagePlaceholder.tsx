import { IrisMark } from "./IrisMark";

/**
 * Stand-in for real photography. `brief` tells whoever uploads the final
 * asset exactly what to shoot/crop — swap for a real <Image> once photos
 * are in hand.
 */
export function ImagePlaceholder({
  brief,
  ratio = "aspect-[4/3]",
  className = "",
}: {
  brief: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex ${ratio} flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-ink/20 bg-ink/6 p-6 text-center ${className}`}
    >
      <IrisMark className="size-7 text-ink/65" />
      <p className="max-w-[26ch] text-xs leading-relaxed text-ink/65">{brief}</p>
    </div>
  );
}
