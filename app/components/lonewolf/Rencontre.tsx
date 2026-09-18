"use client";

import IllustrationCredit from "./IllustrationCredit";
import { Backpack, Swords, ShieldAlert } from "lucide-react";
import type { AdventureState, StorySection } from "@/lib/lonewolf/types";
import { habileteCombat } from "@/lib/lonewolf/engine";
import CombatPortrait from "./CombatPortrait";

export default function Rencontre({
  section,
  state,
  onPrepare,
  onStart,
}: {
  section: StorySection;
  state: AdventureState;
  onPrepare: () => void;
  onStart: () => void;
}) {
  const enemy = section.combat;
  if (!enemy) return null;
  const { total } = habileteCombat(state, enemy);
  const quotient = total - enemy.habilete;
  return (
    <section className="space-y-6" aria-labelledby="rencontre-title">
      <header className="space-y-2">
        <p className="eyebrow flex items-center gap-2">
          <ShieldAlert size={16} />
          Rencontre · paragraphe {section.id}
        </p>
        <h1
          id="rencontre-title"
          className="font-serif text-3xl sm:text-4xl leading-tight"
        >
          {section.titre ?? enemy.nom}
        </h1>
        <p className="text-sm text-muted-foreground">
          Lisez la scène, vérifiez votre équipement, puis engagez le combat à
          votre rythme.
        </p>
      </header>
      {section.image && (
        <figure className="panel overflow-hidden">
          <img
            src={section.image}
            alt={section.imageAlt ?? section.titre ?? enemy.nom}
            width={480}
            height={800}
            className="w-full h-auto max-h-80 object-contain bg-[#101612]"
          />
          <IllustrationCredit src={section.image} />
        </figure>
      )}
      <div className="reading-paper">
        {section.texte.split("\n\n").map((p, i) => (
          <p key={i} className="font-serif">
            {p}
          </p>
        ))}
      </div>
      <div className="panel p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
        <div className="w-24 sm:w-36 shrink-0">
          <CombatPortrait src={enemy.image} name={enemy.nom} />
        </div>
        <div className="flex-1 space-y-3 min-w-0">
          <p className="eyebrow">Votre adversaire</p>
          <h2 className="font-serif text-2xl leading-tight">{enemy.nom}</h2>
          <p className="text-sm text-muted-foreground">
            Habileté{" "}
            <strong className="text-foreground">{enemy.habilete}</strong> ·
            Endurance{" "}
            <strong className="text-foreground">{enemy.endurance}</strong>
          </p>
          {enemy.immunisePsychique && (
            <p className="text-xs text-red-300">
              Immunisé à la Puissance Psychique
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Votre quotient d’attaque :{" "}
            <strong className="text-primary">
              {quotient > 0 ? "+" : ""}
              {quotient}
            </strong>{" "}
            ({total} − {enemy.habilete}). Plus ce nombre est élevé, plus le
            rapport de force vous est favorable ; il ne garantit pas la
            victoire.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={onPrepare} className="action-link action-secondary">
          <Backpack size={18} />
          Préparer mon équipement
        </button>
        <button onClick={onStart} className="action-link">
          <Swords size={18} />
          Engager le combat
        </button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Aucun assaut n’est joué automatiquement. Vous gardez la main sur chaque
        tour.
      </p>
    </section>
  );
}
