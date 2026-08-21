"use client";

import { useState } from "react";
import { BookOpenText } from "lucide-react";

/**
 * Couverture illustrée d'une histoire.
 * Cherche `/covers/<slug>.jpg` (illustrations peintes, servies statiquement).
 * Si le fichier n'existe pas (nouvelle histoire sans couverture), on retombe
 * proprement sur le fond décoratif thème + icône livre — jamais d'image cassée.
 */
export default function StoryCover({
  slug,
  title,
  className = "",
}: {
  slug?: string | null;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = slug ? `/covers/${slug}.jpg` : null;

  if (!src || failed) {
    return (
      <div
        className={`story-cover-bg relative grid place-items-center overflow-hidden ${className}`}
      >
        <div className="absolute inset-3 rounded-[1.1rem] border border-[--hero-gold]/15" />
        <BookOpenText className="size-10 text-[--hero-gold] drop-shadow-[0_0_18px_var(--hero-gold)]" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={`Couverture — ${title}`}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {/* Voile bas pour fondre la couverture dans la carte sombre */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
