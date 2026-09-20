import { cn } from "@/lib/utils";

type GemIconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<GemIconSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-10",
};

const WRAP_SIZE: Record<GemIconSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

/**
 * Gemme HeroBook — SVG facetté premium (or/bleu glace).
 * Remplace l'emoji 💎 pour un rendu net sur tous les devices + dark fantasy.
 */
export default function GemIcon({
  size = "sm",
  className,
  title,
  variant = "ice",
}: {
  size?: GemIconSize;
  className?: string;
  /** String vide = décoratif (à côté d’un libellé déjà explicite). */
  title?: string;
  variant?: "ice" | "gold";
}) {
  const decorative = title === "";

  return (
    <span
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title ?? "Gemmes"}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center",
        WRAP_SIZE[size],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn("h-full w-full drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]", SIZE_CLASS[size])}
      >
        {/* Facettes supérieures */}
        <path
          d="M12 2.5 4.2 8.2 12 11.8 19.8 8.2 12 2.5Z"
          fill={variant === "gold" ? "#f5d78e" : "#a5e8ff"}
          stroke={variant === "gold" ? "#b8933a" : "#5bb5d6"}
          strokeWidth="0.7"
        />
        <path d="M4.2 8.2 12 11.8 8.8 21.2 4.2 8.2Z" fill={variant === "gold" ? "#e9c46a" : "#7dd3f0"} />
        <path d="M19.8 8.2 12 11.8 15.2 21.2 19.8 8.2Z" fill={variant === "gold" ? "#d4a843" : "#4fc0e8"} />
        <path d="M8.8 21.2 12 11.8 15.2 21.2H8.8Z" fill={variant === "gold" ? "#c89a2e" : "#2ea8d6"} />
        <path d="M12 11.8 8.8 21.2 4.2 8.2 12 11.8Z" fill={variant === "gold" ? "#f1d27a" : "#8fe0ff"} opacity={0.9} />
        {/* Éclat */}
        <path d="M9.2 5.2 10.6 7 9.8 5 12 2.5 9.2 5.2Z" fill="white" opacity={0.85} />
        <circle cx="12" cy="8.2" r="0.9" fill="white" opacity={0.6} />
      </svg>
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
