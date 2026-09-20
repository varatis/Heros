"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollText, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { charger } from "@/lib/lonewolf/sauvegarde";
import FeuilleAventure from "@/components/lonewolf/FeuilleAventure";
import type { AdventureState } from "@/lib/lonewolf/types";

/**
 * Feuille d'Aventure du joueur : lit la partie sauvegardée localement
 * (le jeu doit fonctionner même sans connexion) et l'affiche en détail.
 */
export default function FeuilleJoueur() {
  const [etat, setEtat] = useState<AdventureState | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setEtat(charger()?.state ?? null);
  }, []);

  if (etat === undefined) {
    return (
      <p className="text-xs text-muted-foreground animate-pulse">
        Lecture de votre Feuille d&apos;Aventure…
      </p>
    );
  }

  if (!etat) {
    return (
      <div className="glass-card rounded-2xl p-5 space-y-3 text-center">
        <ScrollText className="w-7 h-7 mx-auto text-primary" />
        <p className="text-sm font-bold">Aucune aventure en cours</p>
        <p className="text-xs text-muted-foreground">
          Votre Feuille d&apos;Aventure se remplit automatiquement dès que vous
          commencez le livre 1 des Maîtres des Ténèbres.
        </p>
        <Link href="/jouer">
          <Button className="gap-2 font-bold">
            <Play className="w-4 h-4 fill-current" />
            Commencer l&apos;aventure
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="glass-card rounded-2xl p-4">
        <FeuilleAventure state={etat} />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/jouer/aventure" className="flex-1">
          <Button className="w-full gap-2 font-bold">
            <Play className="w-4 h-4 fill-current" />
            Reprendre au paragraphe {etat.paragraphe}
          </Button>
        </Link>
        <Link href={`/jouer?livre=${etat.bookSlug}`}>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </Button>
        </Link>
      </div>
    </div>
  );
}
