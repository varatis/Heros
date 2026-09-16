"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Dices,
  Heart,
  Package,
  RotateCcw,
  ScrollText,
  Sparkles,
  Skull,
  Sword,
  Trophy,
  X,
} from "lucide-react";
import type {
  AdventureState,
  CombatLogEntry,
  GameEvent,
  RandomEvent,
  StorySection,
} from "@/lib/lonewolf/types";
import {
  appliquerEffets,
  chargerParagraphe,
  enduranceMax,
  habileteCombat,
  habileteHorsCombat,
  nombreRepas,
  resoudreAssaut,
  resoudreEvenement,
  retirerObjet,
} from "@/lib/lonewolf/engine";
import { getItem } from "@/lib/lonewolf/rules";
import { tirerNombre } from "@/lib/lonewolf/table-hasard";
import {
  charger,
  effacer,
  enregistrerVisites,
  sauvegarder,
} from "@/lib/lonewolf/sauvegarde";
import CombatArena from "./CombatArena";
import EvenementOverlay from "./EvenementOverlay";
import FeuilleAventure from "./FeuilleAventure";
import TableHasard from "./TableHasard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LS01 } from "@/content/lonewolf/ls01";

const LIVRE = LS01;

export default function JeuAventure() {
  const router = useRouter();
  const [etat, setEtat] = useState<AdventureState | null>(null);
  const [section, setSection] = useState<StorySection | null>(null);
  const [evenements, setEvenements] = useState<GameEvent[]>([]);
  const [jetEnAttente, setJetEnAttente] = useState<RandomEvent | null>(null);
  const [combat, setCombat] = useState<{
    enduranceEnnemi: number;
    journal: CombatLogEntry[];
    termine: "victoire" | "fuite" | "mort" | null;
    bonusTemp: number;
  } | null>(null);
  const [tiroir, setTiroir] = useState<"aucun" | "feuille" | "table">("aucun");
  const [mort, setMort] = useState(false);
  const etatRef = useRef<AdventureState | null>(null);

  /* ---------------- Chargement de la partie ---------------- */
  useEffect(() => {
    const sauvegarde = charger();
    if (!sauvegarde) {
      router.replace("/jouer");
      return;
    }
    const s = sauvegarde.state;
    setEtat(s);
    etatRef.current = s;
    const sec = LIVRE.sections[s.paragraphe];
    if (sec) {
      setSection(sec);
      if (sec.combat) {
        setCombat({
          enduranceEnnemi: sec.combat.endurance,
          journal: [],
          termine: null,
          bonusTemp: 0,
        });
      }
      if (sec.evenement?.branches) setJetEnAttente(sec.evenement);
    }
    if (s.enduranceActuelle <= 0) setMort(true);
  }, [router]);

  /* ---------------- Sauvegarde automatique ---------------- */
  useEffect(() => {
    if (etat) {
      sauvegarder(etat);
      enregistrerVisites(etat.visites);
    }
  }, [etat]);

  const queueEvenements = useCallback((nouveaux: GameEvent[]) => {
    if (nouveaux.length) setEvenements((e) => [...e, ...nouveaux]);
  }, []);

  /* ---------------- Navigation ---------------- */
  const allerA = useCallback(
    (id: string, base?: AdventureState) => {
      const depart = base ?? etatRef.current;
      if (!depart) return;
      const res = chargerParagraphe(depart, LIVRE, id);
      const nouveau = res.state;
      setEtat(nouveau);
      etatRef.current = nouveau;
      setSection(res.section);
      setJetEnAttente(res.section.evenement?.branches ? res.section.evenement : null);
      setCombat(
        res.section.combat
          ? {
              enduranceEnnemi: res.section.combat.endurance,
              journal: [],
              termine: null,
              bonusTemp: 0,
            }
          : null
      );
      queueEvenements(res.events);
      if (res.mort || nouveau.enduranceActuelle <= 0) setMort(true);
    },
    [queueEvenements]
  );

  /* ---------------- Choix du lecteur ---------------- */
  function choisir(choiceIndex: number) {
    if (!etat || !section?.choix) return;
    const choice = section.choix[choiceIndex];
    if (!choice) return;

    let base = etat;
    if (choice.effets) {
      const res = appliquerEffets(base, choice.effets);
      base = res.state;
      queueEvenements(res.events);
    }
    allerA(choice.vers, base);
  }

  /* ---------------- Jets de la Table de Hasard ---------------- */
  function resoudreJet() {
    if (!etat || !jetEnAttente) return;
    const nombre = tirerNombre();
    const res = resoudreEvenement(etat, jetEnAttente, nombre);
    setEtat(res.state);
    etatRef.current = res.state;
    setJetEnAttente(null);
    queueEvenements(res.events);
    if (res.mort || res.state.enduranceActuelle <= 0) setMort(true);
    if (res.vers) {
      // On laisse les évènements s'afficher avant de tourner la page.
      window.setTimeout(() => allerA(res.vers as string, res.state), 900);
    }
  }

  /* ---------------- Combat ---------------- */
  function assaut(nombre: number) {
    if (!etat || !section?.combat || !combat || combat.termine) return;
    const res = resoudreAssaut(
      etat,
      section.combat,
      combat.enduranceEnnemi,
      nombre,
      combat.journal.length + 1
    );
    setEtat(res.state);
    etatRef.current = res.state;
    setCombat({
      ...combat,
      enduranceEnnemi: res.enduranceEnnemi,
      journal: [...combat.journal, res.log],
      termine: res.termine,
    });

    if (res.termine === "mort") {
      queueEvenements([
        {
          kind: "mort",
          texte: `${section.combat.nom} vous a terrassé sur la route de Holmgard.`,
        },
      ]);
      window.setTimeout(() => setMort(true), 1600);
    } else if (res.termine === "victoire") {
      queueEvenements([
        {
          kind: "info",
          texte: `Vous terrassez ${section.combat.nom} ! Vous pouvez boire une potion avant de poursuivre.`,
          ton: "joie",
        },
      ]);
    } else if (res.log.degatsJoueur > 0) {
      queueEvenements([
        { kind: "endurance", delta: -res.log.degatsJoueur, raison: "Combat" },
      ]);
    }
  }

  /* ---------------- Potions ---------------- */
  function boirePotion(itemId: string) {
    if (!etat) return;
    const def = getItem(itemId);
    if (!def?.effet?.endurance) return;
    const suivant = structuredClone(etat);
    const max = enduranceMax(suivant);
    const gagne = Math.min(
      def.effet.endurance,
      max - suivant.enduranceActuelle
    );
    suivant.enduranceActuelle += gagne;
    retirerObjet(suivant, itemId);
    setEtat(suivant);
    etatRef.current = suivant;
    queueEvenements([
      {
        kind: "objet",
        itemId,
        quantity: 1,
        message: `Vous buvez ${def.nom}.`,
      },
      ...(gagne > 0
        ? [
            {
              kind: "endurance" as const,
              delta: gagne,
              raison: def.nom,
            },
          ]
        : []),
    ]);
  }

  function changerArme(itemId: string) {
    if (!etat) return;
    const suivant = { ...etat, armeEnMain: itemId };
    setEtat(suivant);
    etatRef.current = suivant;
  }

  /* ---------------- Recommencer ---------------- */
  function recommencer() {
    effacer();
    router.push("/jouer");
  }

  const habilete = useMemo(
    () => (etat ? habileteHorsCombat(etat) : 0),
    [etat]
  );

  if (!etat || !section) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <ScrollText className="w-8 h-8 animate-pulse text-primary" />
        <p className="text-sm text-muted-foreground">
          Ouverture du grimoire de Loup Solitaire…
        </p>
      </div>
    );
  }

  const estFin = !!section.fin || mort;
  const enCombat = !!section.combat && combat;

  return (
    <div className="min-h-screen gradient-reading-bg">
      {/* ---------- Bandeau supérieur ---------- */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-3 py-2 flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quitter</span>
          </Link>

          <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-300 font-bold text-[11px]">
              <Heart className="w-3 h-3" />
              <span className="tabular-nums">
                {etat.enduranceActuelle}/{enduranceMax(etat)}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-bold text-[11px]">
              <Sword className="w-3 h-3" />
              <span className="tabular-nums">{habilete}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-[--hero-gold]/10 border border-[--hero-gold]/25 text-[--hero-gold] font-bold text-[11px]">
              🪙 <span className="tabular-nums">{etat.couronnes}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-[--hero-emerald]/10 border border-[--hero-emerald]/25 text-[--hero-emerald] font-bold text-[11px]">
              🍖 <span className="tabular-nums">{nombreRepas(etat)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setTiroir(tiroir === "table" ? "aucun" : "table")}
              className="w-8 h-8 rounded-full bg-primary/15 hover:bg-primary/25 border border-primary/30 flex items-center justify-center transition-colors"
              title="Table de Hasard"
            >
              <Dices className="w-3.5 h-3.5 text-primary" />
            </button>
            <button
              onClick={() => setTiroir(tiroir === "feuille" ? "aucun" : "feuille")}
              className="w-8 h-8 rounded-full bg-primary/15 hover:bg-primary/25 border border-primary/30 flex items-center justify-center transition-colors relative"
              title="Feuille d'Aventure"
            >
              <Package className="w-3.5 h-3.5 text-primary" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[--hero-emerald] animate-pulse" />
            </button>
          </div>
        </div>

        <div className="h-0.5 bg-muted/40">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-[--hero-gold] to-[--hero-emerald]"
            animate={{
              width: `${Math.min(
                100,
                (etat.visites.filter((v) => LIVRE.sections[v]).length /
                  Object.keys(LIVRE.sections).length) *
                  100
              )}%`,
            }}
          />
        </div>
      </header>

      {/* ---------- Tiroirs ---------- */}
      <AnimatePresence>
        {tiroir !== "aucun" && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="sticky top-[3.25rem] z-20 max-w-3xl mx-auto px-3 pt-3"
          >
            <div className="glass-card rounded-2xl p-4 border-2 border-primary/40 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  {tiroir === "feuille" ? (
                    <>
                      <ScrollText className="w-3.5 h-3.5 text-primary" /> Feuille
                      d&apos;Aventure
                    </>
                  ) : (
                    <>
                      <Dices className="w-3.5 h-3.5 text-primary" /> Table de Hasard
                    </>
                  )}
                </h3>
                <button
                  onClick={() => setTiroir("aucun")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {tiroir === "feuille" ? (
                <FeuilleAventure
                  state={etat}
                  onBoirePotion={boirePotion}
                  onChangerArme={changerArme}
                />
              ) : (
                <TableHasard compact />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Corps ---------- */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Combat en cours : on remplace la lecture */}
        {enCombat && section.combat && combat && (
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/15 text-red-300 border-red-500/30 text-[10px] font-black uppercase tracking-widest">
                <Sword className="w-3 h-3 mr-1" />
                Combat — paragraphe {section.id}
              </Badge>
            </div>
            <CombatArena
              state={etat}
              ennemi={section.combat}
              enduranceEnnemi={combat.enduranceEnnemi}
              journal={combat.journal}
              termine={combat.termine}
              onAssaut={assaut}
              onBoirePotion={boirePotion}
              onFuir={(vers) => allerA(vers)}
              onContinuer={
                section.suite ? () => allerA(section.suite as string) : undefined
              }
              suiteId={section.suite}
            />
          </motion.section>
        )}

        {/* L'écran de mort */}
        {mort && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-6 sm:p-8 text-center space-y-4 border-2 border-red-600/50"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <Skull className="w-14 h-14 mx-auto text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-black text-red-400">
              Votre aventure s&apos;achève ici
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {section.fin === "mort"
                ? section.texte.slice(0, 260) + "…"
                : "Votre Endurance est tombée à zéro. Le dernier Seigneur Kaï du Sommerlund repose sur la route de Holmgard."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={recommencer}
                className="flex-1 gap-2 font-bold glow-purple"
              >
                <RotateCcw className="w-4 h-4" />
                Recommencer une Feuille d&apos;Aventure
              </Button>
              <Link href="/regles" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <BookOpen className="w-4 h-4" />
                  Relire les règles
                </Button>
              </Link>
            </div>
          </motion.section>
        )}

        {/* Le paragraphe */}
        {!enCombat && !mort && (
          <AnimatePresence mode="wait">
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32 }}
              className="space-y-5"
            >
              {/* En-tête du paragraphe */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                  <Sparkles className="w-3 h-3" />
                  Paragraphe {section.id}
                </span>
                {section.titre && (
                  <span className="text-[10px] text-muted-foreground truncate">
                    {section.titre}
                  </span>
                )}
              </div>

              {/* Illustration */}
              {section.image && (
                <Illustration
                  key={section.image}
                  src={section.image}
                  alt={section.titre ?? "Illustration"}
                />
              )}

              {/* Texte */}
              <div className="glass-card rounded-3xl p-5 sm:p-7 border border-border/60 shadow-lg">
                {section.titre && (
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3 font-serif">
                    {section.titre}
                  </h2>
                )}
                <div className="space-y-3.5">
                  {section.texte.split("\n\n").map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.09 }}
                      className="text-[15px] sm:text-base leading-relaxed text-foreground/90 font-serif"
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* Jet de hasard à résoudre */}
              {jetEnAttente && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-5 border-2 border-[--hero-gold]/40 space-y-3 text-center"
                >
                  <Dices className="w-7 h-7 mx-auto text-[--hero-gold]" />
                  <div className="font-black text-sm">
                    {jetEnAttente.titre ?? "Lancez la Table de Hasard"}
                  </div>
                  {jetEnAttente.texte && (
                    <p className="text-xs text-muted-foreground">
                      {jetEnAttente.texte}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground">
                    {Object.entries(jetEnAttente.branches ?? {}).map(
                      ([cle, b]) => (
                        <span
                          key={cle}
                          className="px-2 py-0.5 rounded-full bg-muted/50 border border-border/60"
                        >
                          {cle} → {b.texte?.slice(0, 46)}…
                        </span>
                      )
                    )}
                  </div>
                  <Button
                    onClick={resoudreJet}
                    className="gap-2 font-black uppercase tracking-wider glow-gold"
                  >
                    <Dices className="w-4 h-4" />
                    Lancer la Table de Hasard
                  </Button>
                </motion.div>
              )}

              {/* Choix */}
              {!section.fin && !jetEnAttente && (
                <div className="space-y-2.5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    Que décidez-vous ?
                  </div>
                  {section.choix?.map((choice, i) => {
                    const bloque = choice.requis
                      ? !verifier(etat, choice.requis)
                      : false;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        whileHover={bloque ? {} : { x: 4 }}
                        onClick={() => !bloque && choisir(i)}
                        disabled={bloque}
                        className={`w-full text-left rounded-2xl border p-3.5 flex items-start gap-3 transition-colors ${
                          bloque
                            ? "border-border/40 bg-muted/20 opacity-50 cursor-not-allowed"
                            : "border-border/70 bg-card/50 hover:border-primary/60 hover:bg-primary/10"
                        }`}
                      >
                        <span
                          className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                            bloque
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 space-y-1">
                          <span className="block text-sm font-semibold">
                            {choice.texte}
                          </span>
                          {choice.requis && (
                            <span className="block text-[10px] text-muted-foreground italic">
                              {decrireRequis(choice.requis)}
                            </span>
                          )}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 mt-1 shrink-0 ${
                            bloque ? "text-muted-foreground" : "text-primary"
                          }`}
                        />
                      </motion.button>
                    );
                  })}

                  {/* Suite linéaire sans choix */}
                  {(!section.choix || section.choix.length === 0) &&
                    section.suite && (
                      <Button
                        onClick={() => allerA(section.suite as string)}
                        size="lg"
                        className="w-full gap-2 font-bold"
                      >
                        Continuer vers le {section.suite}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                </div>
              )}

              {/* Écran de fin */}
              {section.fin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`glass-card rounded-3xl p-6 sm:p-8 text-center space-y-4 border-2 ${
                    section.fin === "victoire"
                      ? "border-[--hero-gold]/60 glow-gold"
                      : "border-red-600/50"
                  }`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {section.fin === "victoire" ? (
                      <Trophy className="w-14 h-14 mx-auto text-[--hero-gold]" />
                    ) : (
                      <Skull className="w-14 h-14 mx-auto text-red-500" />
                    )}
                  </motion.div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                      {section.fin === "victoire"
                        ? "Fin atteinte"
                        : "Fin tragique"}
                    </div>
                    <h3 className="text-2xl font-black gradient-hero">
                      {section.nomFin ?? "Fin de l'aventure"}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paragraphes visités : {etat.visites.length} · Objets spéciaux
                    récoltés : {etat.objetsSpeciaux.length} · Fin enregistrée dans
                    votre galerie.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Button
                      onClick={recommencer}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Nouvelle Feuille d&apos;Aventure
                    </Button>
                    <Link href="/regles" className="flex-1">
                      <Button className="w-full gap-2 font-bold">
                        <BookOpen className="w-4 h-4" />
                        Relire les règles
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.article>
          </AnimatePresence>
        )}
      </main>

      {/* ---------- File d'évènements animés ---------- */}
      <AnimatePresence>
        {evenements.length > 0 && (
          <EvenementOverlay
            events={evenements}
            onFini={() => setEvenements([])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aides d'affichage                                                   */
/* ------------------------------------------------------------------ */

/**
 * Illustrations peintes du paragraphe. Chaque scène a sa propre palette
 * (forêt, monastère en flammes, marais, ville…). Si la peinture n'est pas
 * encore livrée, on affiche un décor coloré équivalent : la page reste belle,
 * jamais trouée.
 */
const AMBIANCES: { motif: RegExp; fond: string; halo: string; emoji: string }[] = [
  { motif: /monastere|salle-armes|cour-des-morts/i, fond: "from-orange-950 via-red-900/70 to-slate-950", halo: "rgba(251,146,60,0.35)", emoji: "🔥" },
  { motif: /foret|fryelund|chene|cabane/i, fond: "from-emerald-950 via-green-900/60 to-slate-950", halo: "rgba(52,211,153,0.30)", emoji: "🌲" },
  { motif: /holmgard|porte|salle-du-roi|finale/i, fond: "from-indigo-950 via-violet-900/60 to-slate-950", halo: "rgba(167,139,250,0.35)", emoji: "🏰" },
  { motif: /marais|tunnel|crypte|cimetiere/i, fond: "from-slate-950 via-cyan-950/70 to-slate-950", halo: "rgba(34,211,238,0.28)", emoji: "🌫️" },
  { motif: /kraan|giak|gourgaz|loups|embuscade|combat/i, fond: "from-red-950 via-rose-900/60 to-slate-950", halo: "rgba(248,113,113,0.32)", emoji: "⚔️" },
  { motif: /etoile|cristal|banedon|route/i, fond: "from-amber-950 via-yellow-900/50 to-slate-950", halo: "rgba(250,204,21,0.32)", emoji: "✨" },
];

function ambianceDe(src: string) {
  return (
    AMBIANCES.find((a) => a.motif.test(src)) ?? {
      motif: /./,
      fond: "from-slate-900 via-slate-800/60 to-slate-950",
      halo: "rgba(148,163,184,0.28)",
      emoji: "🐺",
    }
  );
}

/** Illustration du paragraphe, avec repli coloré si le fichier n'existe pas. */
function Illustration({ src, alt }: { src: string; alt: string }) {
  const [erreur, setErreur] = useState(false);
  const ambiance = ambianceDe(src);

  if (erreur) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden border border-border/70 shadow-xl bg-gradient-to-br ${ambiance.fond}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 80% at 50% 30%, ${ambiance.halo}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_80%,white,transparent_35%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl drop-shadow-lg">{ambiance.emoji}</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 font-bold px-4 text-center">
            {alt}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-border/70 shadow-xl bg-gradient-to-br ${ambiance.fond}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setErreur(true)}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </motion.div>
  );
}

function verifier(
  etat: AdventureState,
  requis: NonNullable<StorySection["choix"]>[number]["requis"]
): boolean {
  if (!requis) return true;
  if (requis.discipline && !etat.disciplines.includes(requis.discipline))
    return false;
  if (requis.arme && !etat.mains.includes(requis.arme)) return false;
  if (requis.sac && !etat.sac.includes(requis.sac)) return false;
  if (requis.special && !etat.objetsSpeciaux.includes(requis.special))
    return false;
  if (requis.objet) {
    const def = getItem(requis.objet);
    if (!def) return false;
    const present =
      etat.mains.includes(requis.objet) ||
      etat.sac.includes(requis.objet) ||
      etat.objetsSpeciaux.includes(requis.objet);
    if (!present) return false;
  }
  if (requis.or !== undefined && etat.couronnes < requis.or) return false;
  if (requis.repas !== undefined && nombreRepas(etat) < requis.repas)
    return false;
  if (requis.drapeau && !etat.drapeaux[requis.drapeau]) return false;
  return true;
}

function decrireRequis(
  requis: NonNullable<StorySection["choix"]>[number]["requis"]
): string {
  if (!requis) return "";
  const morceaux: string[] = [];
  if (requis.discipline) {
    const noms: Record<string, string> = {
      camouflage: "Camouflage",
      chasse: "Chasse",
      "sixieme-sens": "Sixième Sens",
      orientation: "Orientation",
      guerison: "Guérison",
      "maitrise-armes": "Maîtrise des Armes",
      "bouclier-psychique": "Bouclier Psychique",
      "puissance-psychique": "Puissance Psychique",
      "communication-animale": "Communication Animale",
      "maitrise-matiere": "Maîtrise psychique de la Matière",
    };
    morceaux.push(`Discipline : ${noms[requis.discipline] ?? requis.discipline}`);
  }
  if (requis.objet) {
    const def = getItem(requis.objet);
    morceaux.push(`Objet : ${def?.nom ?? requis.objet}`);
  }
  if (requis.special) {
    const def = getItem(requis.special);
    morceaux.push(`Objet spécial : ${def?.nom ?? requis.special}`);
  }
  if (requis.sac) {
    const def = getItem(requis.sac);
    morceaux.push(`Sac à dos : ${def?.nom ?? requis.sac}`);
  }
  if (requis.or !== undefined) morceaux.push(`${requis.or} Pièces d'Or`);
  return morceaux.join(" · ");
}
