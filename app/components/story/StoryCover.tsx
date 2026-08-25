"use client";

import { useState } from "react";
import { BookOpenText } from "lucide-react";

/**
 * Couverture illustrée d'une histoire.
 * Cherche `/covers/<slug>.jpg` (illustrations peintes, servies statiquement).
 * Si le fichier n'existe pas, fond décoratif + icône — jamais d'image cassée.
 */
export default function StoryCover({
  slug,
  title,
  className = "",
  priority = false,
}: {
  slug?: string | null;
  title: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = slug ? `/covers/${slug}.jpg` : null;

  if (!src || failed) {
    return (
      <div
        className={`story-cover-bg relative grid place-items-center overflow-hidden ${className}`}
      >
        <BookOpenText className="size-8 text-[--hero-gold]/80" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={`Couverture — ${title}`}
        onError={() => setFailed(true)}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
