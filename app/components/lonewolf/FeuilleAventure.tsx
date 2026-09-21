"use client";
import ItemIcon from "./ItemIcon";
import { useState } from "react";
import {
  Backpack,
  Coins,
  Heart,
  Sparkles,
  Sword,
  Star,
  ChevronRight,
} from "lucide-react";
import type { AdventureState } from "@/lib/lonewolf/types";
import {
  enduranceMax,
  habileteHorsCombat,
  nombreRepas,
} from "@/lib/lonewolf/engine";
import { getItem, LIMITE_SAC, DISCIPLINE_BY_ID } from "@/lib/lonewolf/rules";
import { describeItem, type ItemPhase } from "@/lib/lonewolf/item-help";
import ItemDetails from "./ItemDetails";

export default function FeuilleAventure({
  state,
  onBoirePotion,
  onChangerArme,
  onAbandonnerObjet,
  compact = false,
  phase = "lecture",
}: {
  state: AdventureState;
  onBoirePotion?: (id: string) => void;
  onChangerArme?: (id: string) => void;
  onAbandonnerObjet?: (id: string) => void;
  compact?: boolean;
  phase?: ItemPhase;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const max = enduranceMax(state);
  function items(ids: string[]) {
    const groups = Array.from(new Set(ids));
    return (
      <div className="space-y-2">
        {groups.map((id) => {
          const item = getItem(id);
          if (!item) return null;
          const count = ids.filter((x) => x === id).length;
          const active =
            item.slot === "arme"
              ? state.armeEnMain === id
              : item.effet?.permanent;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              aria-label={`Examiner ${item.nom}`}
              className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 min-h-16 hover:border-primary/60 transition-colors ${active ? "border-primary/40 bg-primary/5" : "border-border bg-background/40"}`}
            >
              <span
                aria-hidden="true"
                className="text-2xl bg-muted/40 rounded-lg p-2 shrink-0"
              >
                <ItemIcon item={item} />
              </span>
              <span className="flex-1 min-w-0 space-y-1">
                <span className="block text-sm font-semibold">
                  {item.nom}
                  {count > 1 && (
                    <span className="text-primary ml-2">× {count}</span>
                  )}
                </span>
                {!compact && (
                  <span className="block text-xs text-muted-foreground leading-5">
                    {describeItem(item).effect}
                  </span>
                )}
                <span className="text-xs text-primary block">
                  {active
                    ? item.slot === "arme"
                      ? "En main · voir les effets"
                      : "Bonus actif · voir les effets"
                    : "Voir l’effet et les conditions"}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-3" />
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="panel p-4">
          <p className="text-xs text-primary flex items-center gap-2">
            <Sword size={15} />
            Habileté
          </p>
          <p className="font-serif text-3xl mt-2">
            {habileteHorsCombat(state)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Base {state.habileteBase} · avant les effets propres au combat
          </p>
        </div>
        <div className="panel p-4">
          <p className="text-xs text-hero-emerald flex items-center gap-2">
            <Heart size={15} />
            Endurance
          </p>
          <p className="font-serif text-3xl mt-2">
            {state.enduranceActuelle}
            <span className="text-lg text-muted-foreground"> / {max}</span>
          </p>
          <div
            role="progressbar"
            aria-label="Endurance"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.max(0, Math.min(max, state.enduranceActuelle))}
            className="h-2 mt-3 rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full bg-hero-emerald"
              style={{
                width: `${Math.max(0, Math.min(100, (state.enduranceActuelle / max) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-6">
        Touchez un objet pour comprendre son effet, ses conditions d’utilisation
        et son impact sur votre héros.
      </p>
      <section className="space-y-3">
        <h3 className="font-serif text-xl flex items-center gap-2">
          <Sword size={18} className="text-primary" />
          Vos armes{" "}
          <span className="text-sm text-muted-foreground">
            {state.mains.length}/2
          </span>
        </h3>
        {state.mains.length ? (
          items(state.mains)
        ) : (
          <p className="panel p-4 text-sm text-red-300">
            {state.objetsSpeciaux.includes("glaive-sommer") || state.objetsSpeciaux.includes("lance-magique")
              ? "Votre arme spéciale évite le malus de combat à mains nues."
              : "À mains nues : −4 Habileté en combat."}
          </p>
        )}
        {phase === "combat" && (
          <p className="text-xs text-muted-foreground">
            Le changement d’arme est verrouillé pendant le combat.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <div className="flex justify-between gap-3 items-center">
          <h3 className="font-serif text-xl flex gap-2 items-center">
            <Backpack size={18} className="text-primary" />
            Sac à dos
          </h3>
          <span className="text-sm text-muted-foreground">
            {state.sac.length}/{LIMITE_SAC} places
          </span>
        </div>
        {state.sac.length ? (
          items(state.sac)
        ) : (
          <p className="panel border-dashed p-5 text-sm text-muted-foreground">
            Votre sac est vide. Les objets ramassés apparaîtront ici.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {nombreRepas(state)} repas ·{" "}
          {Math.max(0, LIMITE_SAC - state.sac.length)} place(s) libre(s). Les
          doublons occupent chacun une place.
        </p>
      </section>
      <section className="space-y-3">
        <h3 className="font-serif text-xl flex gap-2 items-center">
          <Star size={18} className="text-primary" />
          Objets spéciaux
        </h3>
        {state.objetsSpeciaux.length ? (
          items(state.objetsSpeciaux)
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun objet spécial pour le moment.
          </p>
        )}
      </section>
      <div className="panel p-4 flex gap-3 items-center">
        <Coins className="text-primary size-5" />
        <div>
          <p className="text-sm font-semibold">{state.couronnes} pièces d’or</p>
          <p className="text-xs text-muted-foreground">
            Bourse · 50 au maximum
          </p>
        </div>
      </div>
      <section className="space-y-3">
        <h3 className="font-serif text-xl flex gap-2 items-center">
          <Sparkles size={18} className="text-primary" />
          Disciplines Kaï
        </h3>
        {state.disciplines.map((id) => {
          const d = DISCIPLINE_BY_ID[id];
          return (
            <details key={id} className="panel px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold min-h-6">
                {d.emoji} {d.nom}
              </summary>
              <p className="text-sm text-muted-foreground leading-6 mt-3">
                {d.mecanique}
              </p>
            </details>
          );
        })}
      </section>
      {Object.entries(state.drapeaux).some(([, v]) => v) && (
        <details className="panel p-4">
          <summary className="text-sm font-semibold cursor-pointer">
            Notes d’aventure
          </summary>
          <ul className="list-disc ml-5 text-sm text-muted-foreground mt-3 space-y-2">
            {Object.entries(state.drapeaux)
              .filter(([, v]) => v)
              .map(([key]) => (
                <li key={key}>{key.replaceAll("_", " ")}</li>
              ))}
          </ul>
        </details>
      )}
      <ItemDetails
        itemId={selected}
        state={state}
        phase={phase}
        onClose={() => setSelected(null)}
        onHeal={onBoirePotion}
        onDiscard={onAbandonnerObjet}
        onEquip={onChangerArme}
      />
    </div>
  );
}
