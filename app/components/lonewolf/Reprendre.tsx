"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Play } from "lucide-react";
import { charger, effacer } from "@/lib/lonewolf/sauvegarde";

/**
 * Appel à l'action contextuel : reprend la partie sauvegardée
 * ou propose d'en commencer une. Une seule action principale.
 */
export default function Reprendre({ compact = false }: { compact?: boolean }) {
  const [etat, setEtat] = useState<{
    paragraphe: string;
    endurance: number;
    visites: number;
  } | null>(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    try {
      const s = charger();
      if (s) {
        setEtat({
          paragraphe: s.state.paragraphe,
          endurance: s.state.enduranceActuelle,
          visites: s.state.visites.length,
        });
      }
    } catch {
      /* Sans sauvegarde lisible, on propose une nouvelle partie. */
    }
    setPret(true);
  }, []);

  if (!pret) {
    return (
      <div
        className="btn btn-primary w-full animate-pulse opacity-60 sm:w-auto"
        aria-hidden="true"
      >
        Chargement…
      </div>
    );
  }

  if (!etat) {
    return (
      <Link href="/jouer" className="btn btn-primary w-full sm:w-auto">
        <Play size={18} />
        Commencer l&apos;aventure
      </Link>
    );
  }

  if (compact) {
    return (
      <Link href="/jouer/aventure" className="btn btn-primary btn-sm">
        <Play size={15} />
        Reprendre §{etat.paragraphe}
      </Link>
    );
  }

  return (
    <div className="card card-gold w-full p-4 sm:max-w-md sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#dfbb78]/40 bg-[#dfbb78]/10 text-[#dfbb78]">
          <Play size={19} className="fill-current" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-foreground">
            Partie en cours — §{etat.paragraphe}
          </p>
          <p className="stat-strip pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Heart size={13} className="text-emerald-400" />
              <strong>{etat.endurance}</strong> Endurance
            </span>
            <span className="dot" aria-hidden="true">
              •
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} />
              {etat.visites} lieu{etat.visites > 1 ? "x" : ""} exploré
              {etat.visites > 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3.5 flex flex-col gap-2">
        <Link href="/jouer/aventure" className="btn btn-primary btn-block">
          <Play size={18} />
          Reprendre l&apos;aventure
        </Link>
        <div className="flex items-center justify-center gap-1">
          <Link href="/jouer" className="btn-ghost btn !min-h-[40px] !text-[13px]">
            Nouvelle partie
          </Link>
          <span className="text-white/20" aria-hidden="true">
            •
          </span>
          <button
            type="button"
            onClick={() => {
              effacer();
              setEtat(null);
            }}
            className="btn-ghost btn !min-h-[40px] !text-[13px]"
          >
            Abandonner
          </button>
        </div>
      </div>
    </div>
  );
}
