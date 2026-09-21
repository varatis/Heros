"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  Dices,
  FlaskConical,
  Heart,
  Skull,
  Swords,
  Wind,
} from "lucide-react";
import type {
  AdventureState,
  CombatLogEntry,
  EnemyDef,
} from "@/lib/lonewolf/types";
import { habileteCombat, enduranceMax } from "@/lib/lonewolf/engine";
import { getItem } from "@/lib/lonewolf/rules";
import CombatPortrait from "./CombatPortrait";
import {
  ENEMY_PORTRAITS,
} from "@/content/lonewolf/ls01/illustrations";
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

function FlecheDegats({ valeur, tone }: { valeur: number; tone: "heros" | "ennemi" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.7 }}
      animate={{ opacity: 1, y: -34, scale: 1.05 }}
      exit={{ opacity: 0, y: -52 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className={`pointer-events-none absolute right-3 top-0 z-10 text-2xl font-black drop-shadow-lg ${
        tone === "heros" ? "text-red-400" : "text-[#dfbb78]"
      }`}
      aria-hidden="true"
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
  const reducedMotion = useReducedMotion();
  const mounted = useRef(true);
  const rolling = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [roulement, setRoulement] = useState(false);
  const [faceAffichee, setFaceAffichee] = useState<number | null>(null);
  const [secousse, setSecousse] = useState(false);
  const dernier = journal[journal.length - 1];
  const nbJournal = journal.length;

  const { total, details } = habileteCombat(state, ennemi);
  const quotient = total - ennemi.habilete;
  const maxPerso = enduranceMax(state);
  const pctPerso = Math.max(
    0,
    Math.min(100, (state.enduranceActuelle / maxPerso) * 100),
  );
  const pctEnnemi = Math.max(
    0,
    Math.min(100, (enduranceEnnemi / ennemi.endurance) * 100),
  );

  const potions = state.sac.filter((id) =>
    ["potion-laumspur", "potion-guerison"].includes(id),
  );

  // Animations déclenchées par l'arrivée d'un nouvel assaut dans le journal.
  const refPrecedent = useRef(nbJournal);
  useEffect(() => {
    if (nbJournal === refPrecedent.current) return;
    refPrecedent.current = nbJournal;
    if (dernier && dernier.degatsJoueur > 0 && !reducedMotion) {
      setSecousse(true);
      const timer = setTimeout(() => setSecousse(false), 420);
      return () => clearTimeout(timer);
    }
  }, [nbJournal, dernier, reducedMotion]);

  async function lancerAssaut() {
    if (rolling.current || termine) return;
    rolling.current = true;
    setRoulement(true);
    if (!reducedMotion) {
      for (let i = 0; i < 6; i++) {
        if (!mounted.current) return;
        setFaceAffichee(Math.floor(Math.random() * 10));
        await new Promise((r) => setTimeout(r, 65 + i * 15));
      }
    }
    if (!mounted.current) return;
    const n = tirerNombre();
    setFaceAffichee(n);
    setRoulement(false);
    onAssaut(n);
    rolling.current = false;
  }

  const arme = state.armeEnMain ? getItem(state.armeEnMain) : null;

  return (
    <div className="space-y-4">
      {/* Bilan du dernier assaut (lecteurs d'écran + rappel visuel) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="card p-3.5 text-[13px] leading-relaxed sm:p-4 sm:text-sm"
      >
        {dernier ? (
          <>
            <span className="eyebrow mb-1 block">Assaut {dernier.tour}</span>
            Vous perdez{" "}
            <strong className="text-red-300">
              {dernier.degatsJoueur} Endurance
            </strong>{" "}
            · {ennemi.nom} perd{" "}
            <strong className="text-[#dfbb78]">
              {dernier.degatsEnnemi} Endurance
            </strong>
            .
            {termine === "victoire" && " Vous avez remporté le combat."}
            {termine === "mort" && " Votre aventure s’achève ici."}
          </>
        ) : (
          "Le combat est prêt. Touchez « Assaut » pour tirer votre premier nombre."
        )}
      </div>

      {/* Arène : adversaire, tirage, héros — empilés */}
      <motion.div
        animate={
          secousse
            ? {
                x: [0, -9, 9, -6, 6, 0],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
              }
            : {}
        }
        transition={{ duration: 0.42 }}
        className="relative overflow-hidden rounded-3xl border-2 border-red-900/50 bg-gradient-to-b from-red-950/40 via-background to-black/60 p-3.5 sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
          <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[#dfbb78]/15 blur-3xl" />
        </div>

        <div className="relative space-y-3">
          {/* Adversaire */}
          <div className="relative">
            <motion.div
              animate={
                dernier && dernier.degatsEnnemi > 0 && !roulement
                  ? { x: [0, 6, 0] }
                  : {}
              }
              transition={{ duration: 0.35 }}
              className={`flex gap-3 rounded-2xl border-2 bg-black/40 p-3 ${
                termine === "victoire"
                  ? "border-white/10 grayscale"
                  : "border-red-400/40"
              }`}
            >
              <div className="w-16 shrink-0 sm:w-20">
                <CombatPortrait
                  src={ennemi.image ?? ENEMY_PORTRAITS[ennemi.nom]?.src}
                  name={ennemi.nom}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate font-serif text-base font-bold leading-tight sm:text-lg">
                    {ennemi.nom}
                  </h3>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Hab.{" "}
                    <strong className="text-foreground">
                      {ennemi.habilete}
                    </strong>
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`Endurance de ${ennemi.nom}`}
                  aria-valuemin={0}
                  aria-valuemax={ennemi.endurance}
                  aria-valuenow={Math.max(
                    0,
                    Math.min(ennemi.endurance, enduranceEnnemi),
                  )}
                  className="h-2.5 overflow-hidden rounded-full bg-black/60"
                >
                  <motion.div
                    className="h-full rounded-full bg-red-400"
                    animate={{ width: `${pctEnnemi}%` }}
                  />
                </div>
                <p className="flex items-center gap-1.5 text-[13px] font-bold tabular-nums text-red-300">
                  <Heart size={14} />
                  {Math.max(0, enduranceEnnemi)} / {ennemi.endurance}
                  <span className="font-normal text-muted-foreground">
                    Endurance
                  </span>
                </p>
              </div>
            </motion.div>
            <AnimatePresence>
              {dernier && dernier.degatsEnnemi > 0 && (
                <FlecheDegats
                  key={`e-${nbJournal}`}
                  valeur={dernier.degatsEnnemi}
                  tone="ennemi"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Tirage + quotient */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-3.5 py-2.5">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Quotient
              </p>
              <p
                className={`text-xl font-black tabular-nums ${
                  quotient >= 0 ? "text-emerald-400" : "text-red-300"
                }`}
              >
                {quotient > 0 ? `+${quotient}` : quotient}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Dices size={18} className="text-[#dfbb78]" />
              <motion.span
                key={faceAffichee ?? "vide"}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfbb78]/50 text-xl font-black tabular-nums text-[#dfbb78]"
                aria-label={`Nombre tiré : ${faceAffichee ?? "en attente"}`}
              >
                {faceAffichee ?? "?"}
              </motion.span>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Assauts
              </p>
              <p className="text-xl font-black tabular-nums text-foreground">
                {nbJournal}
              </p>
            </div>
          </div>

          {/* Héros — épuré : imagination du lecteur, pas de portrait */}
          <div className="relative rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"><Heart size={15} /></span>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-300">Vous</p>
                <p className="text-[13px] font-bold tabular-nums text-foreground">{Math.max(0, state.enduranceActuelle)} / {maxPerso} <span className="font-normal text-muted-foreground">· {arme?.nom ?? "Mains nues"} · Hab. {total}</span></p>
              </div>
            </div>
            <div className="shrink-0 w-20 h-2 rounded-full bg-black/40 overflow-hidden" role="progressbar" aria-label="Endurance" aria-valuemin={0} aria-valuemax={maxPerso} aria-valuenow={Math.max(0, Math.min(maxPerso, state.enduranceActuelle))}>
              <motion.div className="h-full bg-emerald-400" animate={{ width: `${pctPerso}%` }} />
            </div>
            <AnimatePresence>
              {dernier && dernier.degatsJoueur > 0 && (
                <FlecheDegats key={`j-${nbJournal}`} valeur={dernier.degatsJoueur} tone="heros" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Détail du calcul : replié par défaut */}
        <details className="group relative mt-3 rounded-xl border border-white/10 bg-black/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-bold text-muted-foreground [&::-webkit-details-marker]:hidden">
            Détail de votre Habileté ({total} contre {ennemi.habilete})
            <ChevronRight
              size={15}
              className="transition-transform group-open:rotate-90"
            />
          </summary>
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-white/[0.07] px-3.5 py-2.5 text-xs">
            {details.map((d, i) => (
              <span key={i} className="flex items-center gap-1">
                {d.emoji && <span aria-hidden="true">{d.emoji}</span>}
                <span className="text-muted-foreground">{d.label}</span>
                <span
                  className={`font-bold tabular-nums ${
                    d.valeur > 0
                      ? "text-emerald-400"
                      : d.valeur < 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {d.valeur > 0 ? `+${d.valeur}` : d.valeur}
                </span>
              </span>
            ))}
          </div>
          {ennemi.description && (
            <p className="border-t border-white/[0.07] px-3.5 py-2.5 text-xs italic text-muted-foreground">
              {ennemi.description}
            </p>
          )}
        </details>

        {/* Bandeaux de fin */}
        <AnimatePresence>
          {termine === "victoire" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative mt-3 space-y-1.5 rounded-2xl border border-[#dfbb78]/40 bg-[#dfbb78]/10 p-5 text-center"
            >
              <div className="text-4xl" aria-hidden="true">
                🏆
              </div>
              <div className="text-2xl font-black tracking-wide text-[#dfbb78]">
                VICTOIRE
              </div>
              <p className="text-[13px] text-muted-foreground">
                {ennemi.nom} s&apos;effondre. Endurance restante :{" "}
                <strong className="text-red-300">
                  {state.enduranceActuelle}
                </strong>
              </p>
            </motion.div>
          )}
          {termine === "mort" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-red-950/75 backdrop-blur-sm"
            >
              <div className="space-y-2 px-6 text-center">
                <Skull size={44} className="mx-auto text-red-400" />
                <div className="text-xl font-black text-red-300">
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
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={lancerAssaut}
            disabled={roulement}
            className="btn btn-primary btn-block !min-h-[54px] text-base"
          >
            <Swords size={19} />
            {roulement ? "Le destin tranche…" : "Assaut"}
          </motion.button>
          {!!ennemi.fuite?.length && (
            <div className="flex flex-wrap gap-2">
              {ennemi.fuite.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onFuir?.(f.vers)}
                  className="btn btn-secondary btn-sm flex-1"
                >
                  <Wind size={15} />
                  {f.texte}
                </button>
              ))}
            </div>
          )}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FlaskConical size={13} />
            Les potions se boivent après le combat, jamais pendant.
          </p>
        </div>
      )}

      {/* Après la victoire : se soigner, puis repartir */}
      {termine === "victoire" && (
        <div className="space-y-2">
          {potions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {potions.map((id, i) => {
                const it = getItem(id);
                if (!it) return null;
                const inutile =
                  state.enduranceActuelle >= enduranceMax(state);
                return (
                  <button
                    key={`${id}-${i}`}
                    type="button"
                    onClick={() => onBoirePotion?.(id)}
                    disabled={!onBoirePotion || inutile}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 text-[13px] font-bold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-40"
                  >
                    <FlaskConical size={15} />
                    {inutile
                      ? "Endurance au maximum"
                      : `Boire · +${Math.min(it.effet?.endurance ?? 0, maxPerso - state.enduranceActuelle)} End.`}
                  </button>
                );
              })}
            </div>
          )}
          {onContinuer && (
            <button
              type="button"
              onClick={onContinuer}
              className="btn btn-primary btn-block !min-h-[54px]"
            >
              Continuer{suiteId ? ` vers le §${suiteId}` : ""}
            </button>
          )}
        </div>
      )}

      {/* Journal des assauts : replié par défaut */}
      {journal.length > 0 && (
        <details className="group card">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[13px] font-bold text-muted-foreground [&::-webkit-details-marker]:hidden">
            <Dices size={15} className="text-[#dfbb78]" />
            Détail des {journal.length} assaut{journal.length > 1 ? "s" : ""}
            <ChevronRight
              size={15}
              className="ml-auto transition-transform group-open:rotate-90"
            />
          </summary>
          <div className="max-h-44 space-y-1.5 overflow-y-auto border-t border-white/[0.07] px-4 py-3">
            {journal.map((l) => (
              <div
                key={l.tour}
                className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px] tabular-nums"
              >
                <span className="w-16 text-muted-foreground">
                  Assaut {l.tour}
                </span>
                <span className="w-6 text-center font-black text-[#dfbb78]">
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
                  <span className="font-bold text-emerald-400">
                    coup fatal !
                  </span>
                )}
                {l.critique === "joueur-tue" && (
                  <span className="font-bold text-red-500">mortel…</span>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
