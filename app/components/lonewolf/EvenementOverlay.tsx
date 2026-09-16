"use client";
import ItemIcon from "./ItemIcon";

import { useState } from "react";
import { motion } from "framer-motion";
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
import type { GameEvent, KaiDisciplineId } from "@/lib/lonewolf/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ItemEffectSummary } from "./ItemDetails";
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
  const evenement = events[index];
  if (!evenement) return null;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onFini();
      }}
    >
      <DialogContent className="reader-dialog sm:max-w-lg">
        <DialogTitle className="font-serif text-xl pr-8">
          Votre aventure évolue
        </DialogTitle>
        <DialogDescription>
          Prenez le temps de lire · {index + 1} / {events.length}
        </DialogDescription>
        <Contenu evenement={evenement} />
        <button
          className="action-link w-full"
          onClick={() => {
            if (index + 1 < events.length) setIndex((i) => i + 1);
            else onFini();
          }}
        >
          {index + 1 < events.length ? "Voir la suite" : "Revenir à l’aventure"}
        </button>
      </DialogContent>
    </Dialog>
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
            <ItemIcon item={item} />
          </motion.div>
          <div className="space-y-1">
            <div
              className={`text-[10px] uppercase tracking-widest font-black ${
                perdu ? "text-red-400" : "text-[var(--hero-gold)]"
              }`}
            >
              {perdu ? "Objet non conservé" : "Objet découvert"}
            </div>
            <div className="text-lg font-black">
              {item.nom}
              {evenement.quantity > 1 ? ` × ${evenement.quantity}` : ""}
            </div>
            <p className="text-xs text-muted-foreground">
              {evenement.message ?? item.description}
            </p>
            <p className="text-[10px] text-muted-foreground/70 italic">
              {perdu
                ? "Cet objet n’a pas été conservé dans l’inventaire."
                : item.slot === "arme"
                  ? "Enregistré dans la case Armes (2 maximum)"
                  : item.slot === "special"
                    ? "Enregistré dans les Objets Spéciaux (hors Sac à Dos)"
                    : item.slot === "or"
                      ? "Ajouté à votre Bourse"
                      : "Enregistré dans le Sac à Dos (8 objets maximum)"}
            </p>
          </div>
          {!perdu && <ItemEffectSummary item={item} />}
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
          ton={
            evenement.ton === "malus"
              ? "danger"
              : evenement.ton === "chasse"
                ? "espoir"
                : "neutre"
          }
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
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 14,
              delay: 0.15,
            }}
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
