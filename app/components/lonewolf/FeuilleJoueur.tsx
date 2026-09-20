"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Backpack,
  ChevronRight,
  Coins,
  Heart,
  Play,
  ScrollText,
  Sparkles,
  Sword,
} from "lucide-react";
import { charger } from "@/lib/lonewolf/sauvegarde";
import { enduranceMax, habileteHorsCombat } from "@/lib/lonewolf/engine";
import { LIMITE_SAC } from "@/lib/lonewolf/rules";
import { livreParSlug } from "@/content/lonewolf/registre";
import FeuilleAventure from "@/components/lonewolf/FeuilleAventure";
import type { AdventureState } from "@/lib/lonewolf/types";

/**
 * Aventure du joueur : statut lisible d'un coup d'œil, reprise
 * immédiate, feuille complète repliée par défaut.
 */
export default function FeuilleJoueur() {
  const [etat, setEtat] = useState<AdventureState | null | undefined>(
    undefined,
  );

  useEffect(() => {
    try {
      setEtat(charger()?.state ?? null);
    } catch {
      setEtat(null);
    }
  }, []);

  if (etat === undefined) {
    return (
      <div className="card animate-pulse p-5" aria-hidden="true">
        <div className="h-5 w-40 rounded bg-white/10" />
        <div className="mt-3 h-2.5 w-full rounded-full bg-white/10" />
      </div>
    );
  }

  if (!etat) {
    return (
      <div className="card space-y-3 p-6 text-center sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#dfbb78]/30 bg-[#dfbb78]/10 text-[#dfbb78]">
          <ScrollText size={26} />
        </span>
        <h3 className="font-serif text-xl font-bold text-foreground">
          Aucune aventure en cours
        </h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          Votre Feuille d&apos;Aventure se remplit automatiquement dès que vous
          ouvrez le premier tome.
        </p>
        <Link
          href="/jouer?livre=loup-solitaire-01"
          className="btn btn-primary w-full sm:w-auto"
        >
          <Play size={18} />
          Commencer le Livre 1
        </Link>
      </div>
    );
  }

  const book = livreParSlug(etat.bookSlug);
  const max = enduranceMax(etat);
  const pct = Math.max(0, Math.min(100, (etat.enduranceActuelle / max) * 100));

  return (
    <div className="space-y-3">
      {/* ----- Statut d'un coup d'œil ----- */}
      <div className="card card-gold space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#dfbb78]/40 bg-[#dfbb78]/10 text-[#dfbb78]">
            <Play size={20} className="fill-current" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-[#dfbb78]">
              Livre {book.numero} · §{etat.paragraphe}
            </p>
            <h3 className="truncate font-serif text-lg font-bold leading-snug text-white">
              {book.titre}
            </h3>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
              <Heart size={14} />
              Endurance
            </span>
            <span className="font-bold tabular-nums text-emerald-300">
              {etat.enduranceActuelle}
              <span className="font-normal text-muted-foreground">
                {" "}
                / {max}
              </span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Endurance actuelle"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.max(0, Math.min(max, etat.enduranceActuelle))}
            className="h-2.5 overflow-hidden rounded-full bg-black/50"
          >
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat
            icon={<Sword size={15} />}
            value={`${habileteHorsCombat(etat)}`}
            label="Habileté"
          />
          <MiniStat
            icon={<Coins size={15} />}
            value={`${etat.couronnes}`}
            label="Pièces d'or"
          />
          <MiniStat
            icon={<Backpack size={15} />}
            value={`${etat.sac.length}/${LIMITE_SAC}`}
            label="Sac à dos"
          />
          <MiniStat
            icon={<Sparkles size={15} />}
            value={`${etat.disciplines.length}`}
            label="Disciplines"
          />
        </div>

        <div className="space-y-1.5 pt-1">
          <Link
            href="/jouer/aventure"
            className="btn btn-primary btn-block"
          >
            <Play size={18} />
            Reprendre au §{etat.paragraphe}
          </Link>
          <div className="text-center">
            <Link
              href={`/jouer?livre=${etat.bookSlug}`}
              className="btn btn-ghost btn-sm"
            >
              Recommencer une nouvelle feuille
            </Link>
          </div>
        </div>
      </div>

      {/* ----- Feuille complète, sur demande ----- */}
      <details className="card group">
        <summary className="flex cursor-pointer list-none items-center gap-2.5 p-4 text-[15px] font-bold text-foreground [&::-webkit-details-marker]:hidden">
          <ScrollText size={18} className="text-[#dfbb78]" />
          Feuille d&apos;aventure complète
          <ChevronRight
            size={18}
            className="ml-auto text-muted-foreground transition-transform group-open:rotate-90"
          />
        </summary>
        <div className="border-t border-white/[0.07] p-4 sm:p-5">
          <FeuilleAventure state={etat} />
        </div>
      </details>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="text-[#dfbb78]">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-bold tabular-nums text-foreground">
          {value}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {label}
        </span>
      </span>
    </div>
  );
}
