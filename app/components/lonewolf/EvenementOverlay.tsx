"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Dices,
  FlaskConical,
  Heart,
  Sparkles,
  Sword,
  Utensils,
  Info,
} from "lucide-react";
import type {
  GameEvent,
  KaiDisciplineId,
} from "@/lib/lonewolf/types";
import { DISCIPLINE_BY_ID, getItem } from "@/lib/lonewolf/rules";

/**
 * File d'évènements animés : découverte d'objet, perte d'Endurance, jet à la
 * Table de Hasard, activation d'une Discipline Kaï… Chaque évènement s'affiche
 * l'un après l'autre et peut être passé d'un clic.
 */
export default function EvenementOverlay({
  events,
  onFini,
}: {
  events: GameEvent[];
  onFini: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [particules, setParticules] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);

  const evenement = events[index];

  // Défilement automatique, sauf pour les évènements qui demandent une lecture.
  useEffect(() => {
    if (!evenement) return;
    const duree =
      evenement.kind === "jet"
        ? 2200
        : evenement.kind === "info"
          ? 2600
          : 2000;
    const t = setTimeout(() => {
      if (index + 1 < events.length) setIndex((i) => i + 1);
      else onFini();
    }, duree);
    return () => clearTimeout(t);
  }, [index, evenement, events.length, onFini]);

  // Gerbe de particules pour les bonnes nouvelles.
  useEffect(() => {
    if (!evenement) return;
    if (evenement.kind === "objet" && !evenement.perdu) {
      const emoji = getItem(evenement.itemId)?.emoji ?? "✨";
      setParticules(
        Array.from({ length: 12 }).map((_, i) => ({
          id: i,
          x: Math.random() * 240 - 120,
          y: -60 - Math.random() * 80,
          emoji,
        }))
      );
      const t = setTimeout(() => setParticules([]), 1400);
      return () => clearTimeout(t);
    }
  }, [evenement]);

  if (!evenement) return null;

  const Cle = `${evenement.kind}-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        if (index + 1 < events.length) setIndex((i) => i + 1);
        else onFini();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md px-4 cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={Cle}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="relative max-w-sm w-full"
        >
          {/* Particules de découverte */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {particules.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.3 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute text-xl"
              >
                {p.emoji}
              </motion.span>
            ))}
          </div>

          <Contenu evenement={evenement} />
        </motion.div>
      </AnimatePresence>

      {events.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
          {events.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-primary"
                  : i < index
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Carte({
  children,
  ton = "neutre",
}: {
  children: React.ReactNode;
  ton?: "neutre" | "danger" | "espoir" | "or" | "mystere";
}) {
  const bordures = {
    neutre: "border-primary/40",
    danger: "border-red-500/50",
    espoir: "border-[var(--hero-emerald)]/50",
    or: "border-[var(--hero-gold)]/50",
    mystere: "border-violet-500/50",
  }[ton];
  return (
    <div
      className={`glass-card rounded-3xl p-5 sm:p-6 text-center space-y-3 border-2 ${bordures} shadow-2xl`}
    >
      {children}
    </div>
  );
}

function Contenu({ evenement }: { evenement: GameEvent }) {
  switch (evenement.kind) {
    case "objet": {
      const item = getItem(evenement.itemId);
      if (!item) return null;
      const perdu = evenement.perdu;
      return (
        <Carte ton={perdu ? "danger" : "or"}>
          <motion.div
            animate={
              perdu
                ? { rotate: [0, 12, -12, 0], opacity: [1, 0.4, 1] }
                : { scale: [0.7, 1.15, 1], rotate: [0, -8, 0] }
            }
            transition={{ duration: 0.7 }}
            className="text-5xl"
          >
            {item.emoji}
          </motion.div>
          <div className="space-y-1">
            <div
              className={`text-[10px] uppercase tracking-widest font-black ${
                perdu ? "text-red-400" : "text-[var(--hero-gold)]"
              }`}
            >
              {perdu ? "Objet perdu" : "Objet découvert"}
            </div>
            <div className="text-lg font-black">{item.nom}</div>
            <p className="text-xs text-muted-foreground">
              {evenement.message ?? item.description}
            </p>
            <p className="text-[10px] text-muted-foreground/70 italic">
              {item.slot === "arme"
                ? "Enregistré dans la case Armes (2 maximum)"
                : item.slot === "special"
                  ? "Enregistré dans les Objets Spéciaux (hors Sac à Dos)"
                  : item.slot === "or"
                    ? "Ajouté à votre Bourse"
                    : "Enregistré dans le Sac à Dos (8 objets maximum)"}
            </p>
          </div>
        </Carte>
      );
    }

    case "endurance": {
      const perte = evenement.delta < 0;
      return (
        <Carte ton={perte ? "danger" : "espoir"}>
          <motion.div
            animate={
              perte
                ? { scale: [1, 1.25, 1], x: [0, -6, 6, 0] }
                : { scale: [1, 1.15, 1] }
            }
            transition={{ duration: 0.6 }}
            className={`flex items-center justify-center gap-2 text-4xl font-black ${
              perte ? "text-red-400" : "text-[var(--hero-emerald)]"
            }`}
          >
            <Heart className="w-7 h-7" />
            {evenement.delta > 0 ? `+${evenement.delta}` : evenement.delta}
          </motion.div>
          <div className="text-sm font-bold">Points d&apos;Endurance</div>
          {evenement.raison && (
            <p className="text-xs text-muted-foreground">{evenement.raison}</p>
          )}
          <p className="text-[10px] text-muted-foreground/70 italic">
            Si votre Endurance tombe à zéro, votre mission s&apos;achève.
          </p>
        </Carte>
      );
    }

    case "habilete":
      return (
        <Carte ton="espoir">
          <Sword className="w-8 h-8 mx-auto text-amber-400" />
          <div className="text-2xl font-black">
            {evenement.delta > 0 ? `+${evenement.delta}` : evenement.delta}{" "}
            Habileté
          </div>
          <p className="text-xs text-muted-foreground">
            Votre Habileté est définitivement modifiée sur votre Feuille
            d&apos;Aventure.
          </p>
        </Carte>
      );

    case "or":
      return (
        <Carte ton="or">
          <Coins className="w-8 h-8 mx-auto text-[var(--hero-gold)]" />
          <div className="text-2xl font-black">
            {evenement.delta > 0 ? "+" : ""}
            {evenement.delta} Pièces d&apos;Or
          </div>
          <p className="text-xs text-muted-foreground">
            Votre Bourse en contient 50 au maximum.
          </p>
        </Carte>
      );

    case "repas": {
      const icone =
        evenement.ton === "chasse"
          ? "🏹"
          : evenement.ton === "ok"
            ? "🍖"
            : "😖";
      return (
        <Carte
          ton={evenement.ton === "malus" ? "danger" : evenement.ton === "chasse" ? "espoir" : "neutre"}
        >
          <div className="text-4xl">{icone}</div>
          <div className="text-sm font-bold">
            {evenement.ton === "malus" ? "Repas manquant" : "Repas"}
          </div>
          <p className="text-xs text-muted-foreground">{evenement.texte}</p>
        </Carte>
      );
    }

    case "discipline": {
      const def = DISCIPLINE_BY_ID[evenement.discipline as KaiDisciplineId];
      return (
        <Carte ton="mystere">
          <motion.div
            animate={{ scale: [0.8, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 0.8 }}
            className="text-4xl"
          >
            {def?.emoji ?? "✨"}
          </motion.div>
          <div className="text-sm font-black text-primary">
            {def?.nom ?? "Discipline Kaï"}
          </div>
          <p className="text-xs text-muted-foreground">{evenement.texte}</p>
        </Carte>
      );
    }

    case "jet":
      return (
        <Carte
          ton={
            evenement.ton === "danger"
              ? "danger"
              : evenement.ton === "espoir"
                ? "espoir"
                : "mystere"
          }
        >
          <Dices className="w-7 h-7 mx-auto text-[var(--hero-gold)]" />
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {evenement.texte}
          </div>
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.15 }}
            className="text-6xl font-black gradient-hero tabular-nums"
          >
            {evenement.nombre}
          </motion.div>
          <p className="text-[10px] text-muted-foreground">
            Nombre obtenu à la Table de Hasard
          </p>
        </Carte>
      );

    case "info":
      return (
        <Carte
          ton={
            evenement.ton === "danger"
              ? "danger"
              : evenement.ton === "espoir"
                ? "espoir"
                : evenement.ton === "joie"
                  ? "or"
                  : "neutre"
          }
        >
          <Info className="w-6 h-6 mx-auto text-primary" />
          <p className="text-sm">{evenement.texte}</p>
        </Carte>
      );

    case "mort":
      return (
        <Carte ton="danger">
          <div className="text-5xl">💀</div>
          <div className="text-xl font-black text-red-400">
            Votre aventure s&apos;achève
          </div>
          <p className="text-xs text-muted-foreground">{evenement.texte}</p>
        </Carte>
      );

    case "fin":
      return (
        <Carte ton={evenement.fin === "victoire" ? "or" : "danger"}>
          <motion.div
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.7 }}
            className="text-5xl"
          >
            {evenement.fin === "victoire" ? "🏆" : "💀"}
          </motion.div>
          <div className="text-lg font-black">
            {evenement.nom ??
              (evenement.fin === "victoire" ? "Victoire" : "Fin de l'aventure")}
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            Fin enregistrée dans votre galerie
          </div>
        </Carte>
      );

    default:
      return null;
  }
}

/** Icônes utilitaires réexportées pour les écrans de fin. */
export const ICONES_EVENEMENT = { Heart, Sword, Utensils, FlaskConical };
