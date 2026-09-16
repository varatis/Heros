"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Heart, Swords, Wind, FlaskConical, Skull } from "lucide-react";
import type { AdventureState, CombatLogEntry, EnemyDef } from "@/lib/lonewolf/types";
import { habileteCombat, enduranceMax } from "@/lib/lonewolf/engine";
import { getItem } from "@/lib/lonewolf/rules";
import { tirerNombre } from "@/lib/lonewolf/table-hasard";

interface Props {
  state: AdventureState;
  ennemi: EnemyDef;
  enduranceEnnemi: number;
  journal: CombatLogEntry[];
  termine: "victoire" | "fuite" | "mort" | null;
  bonusTemp?: number;
  onAssaut: (nombre: number) => void;
  onBoirePotion?: (itemId: string) => void;
  onFuir?: (vers: string) => void;
  /** Suite du récit une fois l'adversaire vaincu. */
  onContinuer?: () => void;
  suiteId?: string;
}

function FlecheDegats({ valeur, cote }: { valeur: number; cote: "gauche" | "droite" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: 1, y: -44, scale: 1.05 }}
      exit={{ opacity: 0, y: -70 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className={`absolute -top-2 ${
        cote === "gauche" ? "left-2" : "right-2"
      } text-2xl font-black drop-shadow-lg ${
        cote === "gauche" ? "text-red-400" : "text-[var(--hero-gold)]"
      }`}
    >
      −{valeur}
    </motion.div>
  );
}

export default function CombatArena({
  state,
  ennemi,
  enduranceEnnemi,
  journal,
  termine,
  onAssaut,
  onBoirePotion,
  onFuir,
  onContinuer,
  suiteId,
}: Props) {
  const [roulement, setRoulement] = useState(false);
  const [faceAffichee, setFaceAffichee] = useState<number | null>(null);
  const [secousse, setSecousse] = useState(false);
  const dernier = journal[journal.length - 1];
  const nbJournal = journal.length;

  const { total, details } = habileteCombat(state, ennemi);
  const quotient = total - ennemi.habilete;
  const maxPerso = enduranceMax(state);
  const pctPerso = Math.max(0, Math.min(100, (state.enduranceActuelle / maxPerso) * 100));
  const pctEnnemi = Math.max(
    0,
    Math.min(100, (enduranceEnnemi / ennemi.endurance) * 100)
  );

  const potions = state.sac.filter((id) =>
    ["potion-laumspur", "potion-guerison"].includes(id)
  );

  // Animations déclenchées par l'arrivée d'un nouvel assaut dans le journal.
  const refPrecedent = useRef(nbJournal);
  useEffect(() => {
    if (nbJournal === refPrecedent.current) return;
    refPrecedent.current = nbJournal;
    if (dernier && dernier.degatsJoueur > 0) {
      setSecousse(true);
      setTimeout(() => setSecousse(false), 420);
    }
  }, [nbJournal, dernier]);

  async function lancerAssaut() {
    if (roulement || termine) return;
    setRoulement(true);
    // Roulement visuel du chiffre, puis tirage à la Table de Hasard.
    for (let i = 0; i < 9; i++) {
      setFaceAffichee(Math.floor(Math.random() * 10));
      await new Promise((r) => setTimeout(r, 55 + i * 14));
    }
    const n = tirerNombre();
    setFaceAffichee(n);
    await new Promise((r) => setTimeout(r, 320));
    setRoulement(false);
    onAssaut(n);
  }

  const arme = state.armeEnMain ? getItem(state.armeEnMain) : null;

  return (
    <div className="space-y-4">
      {/* Arène */}
      <motion.div
        animate={
          secousse
            ? { x: [0, -9, 9, -6, 6, 0], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }
            : {}
        }
        transition={{ duration: 0.42 }}
        className="relative rounded-3xl overflow-hidden border-2 border-red-900/50 bg-gradient-to-b from-red-950/40 via-background to-black/60 p-4 sm:p-6"
      >
        {/* Halo d'ambiance */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-16 left-1/4 w-64 h-64 rounded-full bg-red-700/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Héros */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={
                dernier && dernier.degatsEnnemi > 0 && !roulement
                  ? { x: [0, 26, 0], rotate: [0, -8, 0] }
                  : {}
              }
              transition={{ duration: 0.45 }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--hero-gold)]/15 border-2 border-[var(--hero-gold)]/40 flex items-center justify-center text-3xl sm:text-4xl shadow-lg"
            >
              {arme?.emoji ?? "✊"}
              <span className="absolute -bottom-2 text-[9px] font-bold px-1.5 rounded-full bg-background/90 border border-border">
                VOUS
              </span>
            </motion.div>
            <div className="w-24 sm:w-32 space-y-1">
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-red-900/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  animate={{ width: `${pctPerso}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <div className="text-center text-[11px] font-bold tabular-nums text-red-300 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" />
                {state.enduranceActuelle} / {maxPerso}
              </div>
            </div>
            <AnimatePresence>
              {dernier && dernier.degatsJoueur > 0 && (
                <FlecheDegats
                  key={`j-${nbJournal}`}
                  valeur={dernier.degatsJoueur}
                  cote="gauche"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Centre : quotient & dé */}
          <div className="flex flex-col items-center gap-1.5 min-w-[5.5rem]">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
              QA
            </div>
            <div
              className={`text-lg sm:text-2xl font-black tabular-nums px-2 py-0.5 rounded-lg border ${
                quotient > 0
                  ? "text-[var(--hero-emerald)] border-[var(--hero-emerald)]/40 bg-[var(--hero-emerald)]/10"
                  : quotient < 0
                    ? "text-red-400 border-red-500/40 bg-red-500/10"
                    : "text-foreground border-border bg-muted/40"
              }`}
            >
              {quotient > 0 ? `+${quotient}` : quotient}
            </div>
            <motion.div
              key={faceAffichee ?? "vide"}
              initial={{ scale: 0.7, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black tabular-nums ${
                roulement
                  ? "border-[var(--hero-gold)] text-[var(--hero-gold)] animate-pulse"
                  : "border-primary/50 text-primary"
              }`}
            >
              {faceAffichee ?? "?"}
            </motion.div>
            <div className="text-[9px] text-muted-foreground">Table de Hasard</div>
          </div>

          {/* Ennemi */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={
                dernier && dernier.degatsJoueur > 0 && !roulement
                  ? { x: [0, -16, 0], scale: [1, 1.08, 1] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-950/40 border-2 flex items-center justify-center text-3xl sm:text-4xl shadow-lg ${
                termine === "victoire"
                  ? "border-border opacity-40 grayscale"
                  : "border-red-600/50"
              }`}
            >
              {ennemi.emoji ?? "👹"}
              <span className="absolute -bottom-2 text-[9px] font-bold px-1.5 rounded-full bg-background/90 border border-border max-w-[7rem] truncate">
                {ennemi.nom}
              </span>
            </motion.div>
            <div className="w-24 sm:w-32 space-y-1">
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-red-900/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                  animate={{ width: `${pctEnnemi}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <div className="text-center text-[11px] font-bold tabular-nums text-amber-300">
                {enduranceEnnemi} / {ennemi.endurance}
              </div>
            </div>
            <AnimatePresence>
              {dernier && dernier.degatsEnnemi > 0 && (
                <FlecheDegats
                  key={`e-${nbJournal}`}
                  valeur={dernier.degatsEnnemi}
                  cote="droite"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Détail du calcul d'Habileté */}
        <div className="relative mt-5 rounded-xl bg-background/60 border border-border/60 p-2.5">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
            Calcul de votre Habileté pour ce combat
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
            {details.map((d, i) => (
              <span key={i} className="flex items-center gap-1">
                {d.emoji && <span>{d.emoji}</span>}
                <span className="text-muted-foreground">{d.label}</span>
                <span
                  className={`font-bold tabular-nums ${
                    d.valeur > 0
                      ? "text-[var(--hero-emerald)]"
                      : d.valeur < 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {d.valeur > 0 ? `+${d.valeur}` : d.valeur}
                </span>
              </span>
            ))}
            <span className="font-black">
              = {total} contre {ennemi.habilete}
            </span>
          </div>
          {ennemi.description && (
            <p className="text-[11px] text-muted-foreground italic mt-1.5">
              {ennemi.description}
            </p>
          )}
        </div>

        {/* Bandeau de fin de combat */}
        <AnimatePresence>
          {termine === "victoire" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div className="text-center space-y-2">
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.6 }}
                  className="text-5xl"
                >
                  🏆
                </motion.div>
                <div className="text-2xl font-black gradient-hero">
                  VICTOIRE
                </div>
                <p className="text-xs text-muted-foreground">
                  {ennemi.nom} s&apos;effondre. Endurance restante :{" "}
                  <strong className="text-red-300">{state.enduranceActuelle}</strong>
                </p>
              </div>
            </motion.div>
          )}
          {termine === "mort" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-red-950/70 backdrop-blur-sm"
            >
              <div className="text-center space-y-2">
                <Skull className="w-12 h-12 mx-auto text-red-400" />
                <div className="text-2xl font-black text-red-300">
                  VOTRE ENDURANCE TOMBE À ZÉRO
                </div>
                <p className="text-xs text-red-200/80">
                  Votre aventure s&apos;achève ici.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Commandes */}
      {!termine && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={lancerAssaut}
              disabled={roulement}
              className="flex-1 min-w-[11rem] flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm hover:bg-primary/85 disabled:opacity-60 transition-colors glow-purple"
            >
              <Swords className="w-4 h-4" />
              {roulement ? "Le destin tranche…" : "Assaut suivant"}
            </motion.button>

            {ennemi.fuite?.map((f, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFuir?.(f.vers)}
                className="flex items-center gap-1.5 h-11 px-3 rounded-xl border border-border bg-muted/40 font-bold text-xs hover:bg-muted/70 transition-colors"
              >
                <Wind className="w-3.5 h-3.5" />
                {f.texte}
              </motion.button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
            <FlaskConical className="w-3 h-3" />
            Règle officielle : les Potions se boivent à l&apos;issue d&apos;un combat,
            jamais pendant les assauts.
          </p>
        </div>
      )}

      {/* Fin du combat : on soigne avant de repartir */}
      {termine === "victoire" && (
        <div className="flex flex-wrap gap-2">
          {potions.map((id, i) => {
            const it = getItem(id);
            if (!it) return null;
            const inutile = state.enduranceActuelle >= enduranceMax(state);
            return (
              <motion.button
                key={`${id}-${i}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBoirePotion?.(id)}
                disabled={!onBoirePotion || inutile}
                className="flex items-center gap-1.5 h-11 px-3 rounded-xl bg-[var(--hero-emerald)]/15 border border-[var(--hero-emerald)]/40 text-[var(--hero-emerald)] font-bold text-xs hover:bg-[var(--hero-emerald)]/25 disabled:opacity-40 transition-colors"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                {inutile
                  ? `${it.nom} (inutile)`
                  : `Boire ${it.nom.replace("Potion de ", "").replace("Potion d'", "")}`}
              </motion.button>
            );
          })}
          {onContinuer && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onContinuer}
              className="flex-1 min-w-[11rem] flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--hero-gold)] text-black font-black uppercase tracking-wider text-sm hover:brightness-110 transition-all"
            >
              Continuer
              {suiteId && <span className="font-bold">vers le {suiteId}</span>}
            </motion.button>
          )}
        </div>
      )}

      {/* Journal des assauts */}
      {journal.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-3 max-h-44 overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
            <Dices className="w-3 h-3" />
            Détail des combats
          </div>
          {journal.map((l) => (
            <div
              key={l.tour}
              className="text-[11px] flex items-center gap-2 tabular-nums"
            >
              <span className="text-muted-foreground w-14">Assaut {l.tour}</span>
              <span className="font-bold text-[var(--hero-gold)] w-6 text-center">
                {l.nombre}
              </span>
              <span className="text-muted-foreground">
                QA {l.quotient > 0 ? `+${l.quotient}` : l.quotient}
              </span>
              <span className="text-amber-300">
                {ennemi.nom} −{l.degatsEnnemi}
              </span>
              <span className="text-red-300">vous −{l.degatsJoueur}</span>
              {l.critique === "ennemi-tue" && (
                <span className="text-[var(--hero-emerald)] font-bold">
                  coup fatal !
                </span>
              )}
              {l.critique === "joueur-tue" && (
                <span className="text-red-500 font-bold">mortel…</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
