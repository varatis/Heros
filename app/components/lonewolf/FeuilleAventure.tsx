"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Sword,
  Sparkles,
  Backpack,
  Coins,
  Shield,
  Utensils,
  Package,
  Star,
} from "lucide-react";
import type { AdventureState } from "@/lib/lonewolf/types";
import {
  enduranceMax,
  habileteHorsCombat,
  nombreRepas,
} from "@/lib/lonewolf/engine";
import { getItem, LIMITE_SAC } from "@/lib/lonewolf/rules";
import { DISCIPLINE_BY_ID } from "@/lib/lonewolf/rules";

/**
 * Feuille d'Aventure : le document de jeu tel qu'il existe dans le livre,
 * mais rempli automatiquement par le moteur.
 */
export default function FeuilleAventure({
  state,
  onBoirePotion,
  onChangerArme,
  compact = false,
}: {
  state: AdventureState;
  onBoirePotion?: (itemId: string) => void;
  onChangerArme?: (itemId: string) => void;
  compact?: boolean;
}) {
  const maxEndurance = enduranceMax(state);
  const pctEndurance = Math.max(
    0,
    Math.min(100, (state.enduranceActuelle / maxEndurance) * 100)
  );
  const repas = nombreRepas(state);
  const potions = state.sac.filter((id) =>
    ["potion-laumspur", "potion-guerison", "potion-alether"].includes(id)
  );

  return (
    <div className={`space-y-3 ${compact ? "text-xs" : "text-sm"}`}>
      {/* Habileté & Endurance */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-2.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-400 font-bold">
            <Sword className="w-3 h-3" />
            Habileté
          </div>
          <div className="text-2xl font-black tabular-nums text-amber-300">
            {habileteHorsCombat(state)}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {state.habileteBase} de base
            {state.habileteMod !== 0 &&
              ` ${state.habileteMod > 0 ? "+" : ""}${state.habileteMod}`}
          </div>
        </div>

        <div className="rounded-xl bg-red-500/10 border border-red-500/25 p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-red-400 font-bold">
            <Heart className="w-3 h-3" />
            Endurance
          </div>
          <div className="text-2xl font-black tabular-nums text-red-300">
            {state.enduranceActuelle}
            <span className="text-sm text-muted-foreground font-bold">
              /{maxEndurance}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                pctEndurance > 50
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : pctEndurance > 25
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-red-600 to-red-400"
              }`}
              animate={{ width: `${pctEndurance}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Disciplines */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Disciplines Kaï
        </div>
        <div className="flex flex-wrap gap-1.5">
          {state.disciplines.map((d) => {
            const def = DISCIPLINE_BY_ID[d];
            return (
              <span
                key={d}
                title={`${def.nom} — ${def.mecanique}`}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold"
              >
                {def.emoji} {def.nomCourt}
              </span>
            );
          })}
        </div>
      </div>

      {/* Armes */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
          <Sword className="w-3 h-3" />
          Armes (2 maximum)
        </div>
        {state.mains.length === 0 ? (
          <p className="text-[11px] text-red-400">
            Aucune arme : vous combattrez à mains nues (−4 Habileté).
          </p>
        ) : (
          <div className="space-y-1">
            {state.mains.map((id) => {
              const it = getItem(id);
              const enMain = state.armeEnMain === id;
              if (!it) return null;
              return (
                <button
                  key={id}
                  onClick={() => onChangerArme?.(id)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg border text-left transition-colors ${
                    enMain
                      ? "bg-amber-500/15 border-amber-500/40"
                      : "bg-muted/40 border-border/60 hover:border-amber-500/30"
                  }`}
                >
                  <span>{it.emoji}</span>
                  <span className="flex-1 text-[11px] font-semibold">
                    {it.nom}
                  </span>
                  {enMain && (
                    <span className="text-[9px] font-bold text-amber-400 uppercase">
                      en main
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sac à dos */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
          <Backpack className="w-3 h-3" />
          Sac à Dos ({state.sac.length}/{LIMITE_SAC})
        </div>
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: LIMITE_SAC }).map((_, i) => {
            const id = state.sac[i];
            const it = id ? getItem(id) : null;
            return (
              <div
                key={i}
                title={it ? `${it.nom} — ${it.description}` : "Emplacement vide"}
                className={`aspect-square rounded-md border flex items-center justify-center text-sm ${
                  it
                    ? "bg-[var(--hero-emerald)]/10 border-[var(--hero-emerald)]/30"
                    : "bg-muted/20 border-border/40 border-dashed"
                }`}
              >
                {it?.emoji ?? ""}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
          <span className="flex items-center gap-1">
            <Utensils className="w-3 h-3" /> {repas} Repas
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" /> {potions.length} Potion
            {potions.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Consommer une potion */}
        {potions.length > 0 && onBoirePotion && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {potions.map((id, i) => {
              const it = getItem(id);
              if (!it) return null;
              return (
                <button
                  key={`${id}-${i}`}
                  onClick={() => onBoirePotion(id)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[var(--hero-emerald)]/15 border border-[var(--hero-emerald)]/40 text-[var(--hero-emerald)] font-bold hover:bg-[var(--hero-emerald)]/25 transition-colors"
                >
                  {it.emoji} Boire {it.nom.replace("Potion de ", "").replace("Potion d'", "")}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bourse & Objets spéciaux */}
      <div className="grid grid-cols-1 gap-2">
        <div className="rounded-xl bg-[var(--hero-gold)]/10 border border-[var(--hero-gold)]/25 px-2.5 py-2 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-[var(--hero-gold)]" />
          <span className="text-[11px] font-bold text-[var(--hero-gold)]">
            {state.couronnes} Pièces d&apos;Or
          </span>
          <span className="text-[10px] text-muted-foreground">(max 50)</span>
        </div>

        {state.objetsSpeciaux.length > 0 && (
          <div className="rounded-xl bg-primary/10 border border-primary/25 px-2.5 py-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary font-bold">
              <Star className="w-3 h-3" />
              Objets Spéciaux
            </div>
            <div className="flex flex-wrap gap-1">
              {state.objetsSpeciaux.map((id, i) => {
                const it = getItem(id);
                if (!it) return null;
                return (
                  <span
                    key={`${id}-${i}`}
                    title={it.description}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border/60"
                  >
                    {it.emoji} {it.nom}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {state.drapeaux &&
          Object.keys(state.drapeaux).length > 0 && (
            <div className="rounded-xl bg-muted/30 border border-border/50 px-2.5 py-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                <Shield className="w-3 h-3" />
                Notes d&apos;aventure
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(state.drapeaux).map((d) => (
                  <span
                    key={d}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50"
                  >
                    {d.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
