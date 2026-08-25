import { cn } from "@/lib/utils";

type GemIconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<GemIconSize, string> = {
  xs: "size-3.5 text-[0.875rem] leading-none",
  sm: "size-4 text-base leading-none",
  md: "size-5 text-lg leading-none",
  lg: "size-8 text-3xl leading-none",
  xl: "size-10 text-4xl leading-none",
};

/**
 * Gemme bleue HeroBook — le diamant 💎 classique, toujours visible
 * (emoji système, pas de SVG fragile). Taille contrôlée pour rester
 * nette en top bar, packs et CTAs.
 */
export default function GemIcon({
  size = "sm",
  className,
  title,
}: {
  size?: GemIconSize;
  className?: string;
  /** String vide = décoratif (à côté d’un libellé déjà explicite). */
  title?: string;
}) {
  const decorative = title === "";

  return (
    <span
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title ?? "Gemmes"}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center",
        SIZE_CLASS[size],
        className
      )}
    >
      💎
    </span>
  );
}

/** Pastille monétaire : gemme bleue + montant. */
export function GemAmount({
  amount,
  size = "sm",
  className,
  iconClassName,
}: {
  amount: number | string;
  size?: GemIconSize;
  className?: string;
  iconClassName?: string;
}) {
  const display =
    typeof amount === "number" ? amount.toLocaleString("fr-FR") : amount;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 tabular-nums font-semibold text-foreground",
        className
      )}
    >
      <GemIcon size={size} title="" className={iconClassName} />
      <span>{display}</span>
    </span>
  );
}
