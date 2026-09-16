"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { charger, effacer } from "@/lib/lonewolf/sauvegarde";

/**
 * Bandeau d'accueil : reprendre une partie sauvegardée ou en commencer une.
 * Détecte aussi les sauvegardes d'un ancien format (Supabase) et invite à
 * repartir sur une nouvelle Feuille d'Aventure.
 */
export default function Reprendre() {
  const [etat, setEtat] = useState<{
    paragraphe: string;
    endurance: number;
    habilete: number;
    visites: number;
  } | null>(null);

  useEffect(() => {
    const s = charger();
    if (!s) return;
    setEtat({
      paragraphe: s.state.paragraphe,
      endurance: s.state.enduranceActuelle,
      habilete: s.state.habileteBase,
      visites: s.state.visites.length,
    });
  }, []);

  if (!etat) {
    return (
      <Link href="/jouer">
        <Button size="lg" className="w-full sm:w-auto gap-2 font-black glow-purple">
          <Play className="w-4 h-4 fill-current" />
          Commencer l&apos;aventure
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2.5">
      <Link href="/jouer/aventure">
        <Button size="lg" className="w-full sm:w-auto gap-2 font-black glow-purple">
          <Play className="w-4 h-4 fill-current" />
          Reprendre au paragraphe {etat.paragraphe}
        </Button>
      </Link>
      <Link href="/jouer">
        <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
          <BookOpen className="w-4 h-4" />
          Nouvelle Feuille d&apos;Aventure
        </Button>
      </Link>
      <Button
        size="lg"
        variant="ghost"
        onClick={() => {
          effacer();
          setEtat(null);
        }}
        className="gap-2 text-muted-foreground"
      >
        <RotateCcw className="w-4 h-4" />
        Abandonner
      </Button>
    </div>
  );
}
