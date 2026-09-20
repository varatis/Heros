import Link from "next/link";
import { BookOpen, Check, ChevronRight, Lock, Sparkles } from "lucide-react";
import type { LDVELHBook } from "@/lib/ldvelh-collections";
import { cn } from "@/lib/utils";

/** Statut d'accès d'un tome pour le lecteur. */
export type BookAccess = "jouable" | "grimoire" | "verrouille";

/**
 * Ligne de livre compacte (mobile-first) partagée par
 * la bibliothèque et la boutique. Sur bureau, elle s'affiche
 * en carte dans une grille.
 */
export default function BookRow({
  livre,
  access,
  action,
  layout = "row",
}: {
  livre: LDVELHBook;
  access: BookAccess;
  /** Bouton d'action affiché en bas à droite de la carte. */
  action: React.ReactNode;
  layout?: "row" | "card";
}) {
  if (layout === "card") {
    return (
      <article
        className={cn(
          "group card flex flex-col overflow-hidden transition-colors hover:border-white/20",
          access === "jouable" && "card-gold",
        )}
      >
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-white/[0.06] bg-[#080d0a]">
          {livre.couverture ? (
            <img
              src={livre.couverture}
              alt={livre.titre}
              loading="lazy"
              className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <BookOpen size={32} className="text-[#dfbb78]/50" />
          )}
          <span className="absolute left-2.5 top-2.5 rounded-md border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[11px] text-white/90 backdrop-blur-md">
            T.{String(livre.numero).padStart(2, "0")}
          </span>
          <span className="absolute right-2.5 top-2.5">
            <AccessPill access={access} />
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#dfbb78]">
              {livre.collectionName}
            </p>
            <h4 className="line-clamp-1 font-serif text-base font-bold text-foreground">
              {livre.titre}
            </h4>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
              {livre.resume}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="truncate text-xs text-muted-foreground">
              {livre.author}
            </span>
            {action}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="row-card">
      <div className="h-[72px] w-[52px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#080d0a]">
        {livre.couverture ? (
          <img
            src={livre.couverture}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#dfbb78]/60">
            <BookOpen size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[11px] font-bold uppercase tracking-widest text-[#dfbb78]">
            {livre.collectionName} · T.{String(livre.numero).padStart(2, "0")}
          </p>
        </div>
        <h4 className="truncate font-serif text-[15px] font-bold leading-snug text-foreground">
          {livre.titre}
        </h4>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <AccessPill access={access} compact />
          {action}
        </div>
      </div>
    </article>
  );
}

function AccessPill({
  access,
  compact = false,
}: {
  access: BookAccess;
  compact?: boolean;
}) {
  if (access === "jouable") {
    return (
      <span className="pill pill-green">
        <Sparkles size={13} />
        Jouable
      </span>
    );
  }
  if (access === "grimoire") {
    return (
      <span className="pill">
        <Check size={13} />
        {compact ? "Acquis" : "Dans votre grimoire"}
      </span>
    );
  }
  return (
    <span className="pill">
      <Lock size={13} />
      Boutique
    </span>
  );
}

/** Lien « voir en boutique » utilisé par la bibliothèque. */
export function ShopLink({ collectionId }: { collectionId: string }) {
  return (
    <Link
      href={`/shop?collection=${collectionId}`}
      className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-[#dfbb78] hover:underline"
    >
      Boutique
      <ChevronRight size={15} />
    </Link>
  );
}
