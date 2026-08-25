"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type GemIconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<GemIconSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-10",
};

/**
 * Cristal HeroBook — plus lisible que l’icône Lucide « Gem » (souvent trop fine
 * et peu contrastée sur fond dark). Dégradé or + facettes pour un rendu monétaire
 * clair à toutes les tailles.
 */
export default function GemIcon({
  size = "sm",
  className,
  title,
}: {
  size?: GemIconSize;
  className?: string;
  /** Passer une string vide pour purement décoratif (à côté d’un libellé). */
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const decorative = title === "";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? "presentation" : "img"}
      className={cn("shrink-0", SIZE_CLASS[size], className)}
    >
      {!decorative && <title>{title ?? "Gemmes"}</title>}
      <defs>
        <linearGradient
          id={`${uid}-body`}
          x1="6"
          y1="4"
          x2="26"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="38%" stopColor="#F0C14B" />
          <stop offset="72%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#A67C0A" />
        </linearGradient>
        <linearGradient
          id={`${uid}-shine`}
          x1="10"
          y1="6"
          x2="18"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-edge`}
          x1="16"
          y1="2"
          x2="16"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF3C4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7A5A08" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Halo bas — ancre visuelle sur fond sombre */}
      <ellipse cx="16" cy="28.2" rx="7.5" ry="1.6" fill="#D4A017" opacity="0.25" />

      {/* Corps */}
      <path d="M16 2.4 27.2 12.2 16 29.6 4.8 12.2 16 2.4Z" fill={`url(#${uid}-body)`} />
      <path
        d="M16 2.4 27.2 12.2 16 29.6 4.8 12.2 16 2.4Z"
        stroke={`url(#${uid}-edge)`}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />

      {/* Table haute claire */}
      <path d="M16 2.4 22.6 9.1H9.4L16 2.4Z" fill="#FFF6D0" opacity="0.58" />

      {/* Facettes */}
      <path d="M4.8 12.2 9.4 9.1 16 16.4 4.8 12.2Z" fill="#B8860B" opacity="0.38" />
      <path d="M27.2 12.2 22.6 9.1 16 16.4 27.2 12.2Z" fill="#FFF1B8" opacity="0.32" />
      <path d="M4.8 12.2 16 16.4 16 29.6 4.8 12.2Z" fill="#8B6914" opacity="0.3" />
      <path d="M27.2 12.2 16 16.4 16 29.6 27.2 12.2Z" fill="#E8C547" opacity="0.24" />

      {/* Ceinture + arêtes */}
      <path d="M4.8 12.2H27.2" stroke="#FFF6D0" strokeOpacity="0.4" strokeWidth="0.85" />
      <path
        d="M9.4 9.1 16 16.4 22.6 9.1"
        stroke="#5C4308"
        strokeOpacity="0.22"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Reflet */}
      <path d="M11.2 7.2 14.8 5.1 13.6 10.4 11.2 7.2Z" fill={`url(#${uid}-shine)`} />
    </svg>
  );
}

/** Pastille monétaire : icône + montant. */
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
        "inline-flex items-center gap-1.5 tabular-nums font-semibold text-[--hero-gold]",
        className
      )}
    >
      <GemIcon size={size} title="" className={iconClassName} />
      <span>{display}</span>
    </span>
  );
}
