"use client";

import IllustrationCredit from "./IllustrationCredit";
import BookmarkVisual from "@/components/shared/BookmarkVisual";
import { getLocalHeroProfile } from "@/lib/hero-profile";
import type { Bookmark } from "@/lib/bookmarks";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  ArrowLeft,
  Settings2,
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
} from "@/lib/lonewolf/engine";
import {
  consumeHealingPotion,
  weaponAction,
  type ItemPhase,
} from "@/lib/lonewolf/item-help";
import {
  DEFAULT_READING,
  READING_KEY,
  parseReadingPreferences,
  type ReadingPreferences,
} from "@/lib/lonewolf/reading-preferences";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReadingSettings from "./ReadingSettings";
import Rencontre from "./Rencontre";
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
import { livreParSlug } from "@/content/lonewolf/registre";

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
  const [mort, setMort] = useState(false);
  const [combatEngage, setCombatEngage] = useState(false);
  const [reading, setReading] = useState(DEFAULT_READING);
  const [userBookmark, setUserBookmark] = useState<Bookmark | null>(null);
  const [outils, setOutils] = useState<
    "aucun" | "feuille" | "table" | "lecture"
  >("aucun");

  useEffect(() => {
    setUserBookmark(getLocalHeroProfile().bookmark);
  }, []);
  const readingStyle = {
    "--reading-size": `${reading.fontSize}px`,
    "--reading-leading": reading.spacious ? "1.95" : "1.65",
  } as CSSProperties;
  const itemPhase: ItemPhase =
    combat?.termine === "victoire"
      ? "apres-combat"
      : section?.combat
        ? combatEngage
          ? "combat"
          : "preparation"
        : "lecture";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READING_KEY);
      if (raw) setReading(parseReadingPreferences(JSON.parse(raw)));
    } catch {
      /* Private browsing / invalid old value: keep defaults. */
    }
  }, []);
  function changeReading(value: ReadingPreferences) {
    setReading(value);
    try {
      localStorage.setItem(READING_KEY, JSON.stringify(value));
    } catch {
      /* Reading still works without persistence. */
    }
  }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [section?.id]);
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
    const livre = livreParSlug(s.bookSlug);
    const sec = livre.sections[s.paragraphe];
    if (sec) {
      setSection(sec);
      if (sec.combat) {
        const saved = sauvegarde.encounter;
        const valid =
          saved &&
          saved.paragraphe === sec.id &&
          saved.enemyName === sec.combat.nom &&
          saved.combat &&
          Array.isArray(saved.combat.journal) &&
          Number.isFinite(saved.combat.enduranceEnnemi) &&
          saved.combat.enduranceEnnemi >= 0 &&
          saved.combat.enduranceEnnemi <= sec.combat.endurance &&
          [null, "victoire", "fuite", "mort"].includes(saved.combat.termine);
        if (valid) {
          setCombat(saved.combat);
          setCombatEngage(
            saved.engaged ||
              saved.combat.journal.length > 0 ||
              !!saved.combat.termine,
          );
        } else
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
      sauvegarder(
        etat,
        section?.combat && combat
          ? {
              paragraphe: section.id,
              enemyName: section.combat.nom,
              engaged: combatEngage,
              combat,
            }
          : undefined,
      );
      enregistrerVisites(etat.visites);
    }
  }, [etat, section, combat, combatEngage]);

  const queueEvenements = useCallback((nouveaux: GameEvent[]) => {
    if (nouveaux.length) setEvenements((e) => [...e, ...nouveaux]);
  }, []);

  /* ---------------- Navigation ---------------- */
  const allerA = useCallback(
    (id: string, base?: AdventureState) => {
      const depart = base ?? etatRef.current;
      if (!depart) return;
      const res = chargerParagraphe(depart, livreParSlug(depart.bookSlug), id);
      const nouveau = res.state;
      setEtat(nouveau);
      etatRef.current = nouveau;
      setSection(res.section);
      setCombatEngage(false);
      setJetEnAttente(
        res.section.evenement?.branches ? res.section.evenement : null,
      );
      setCombat(
        res.section.combat
          ? {
              enduranceEnnemi: res.section.combat.endurance,
              journal: [],
              termine: null,
              bonusTemp: 0,
            }
          : null,
      );
      queueEvenements(res.events);
      if (res.mort || nouveau.enduranceActuelle <= 0) setMort(true);
    },
    [queueEvenements],
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
      combat.journal.length + 1,
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
    }
  }

  /* ---------------- Actions d’inventaire validées ---------------- */
  function boirePotion(itemId: string) {
    const current = etatRef.current;
    if (!current) return;
    const result = consumeHealingPotion(current, itemId, itemPhase);
    if (!result.used) return;
    setEtat(result.state);
    etatRef.current = result.state;
    setOutils("aucun");
    queueEvenements([
      {
        kind: "info",
        texte: `${getItem(itemId)?.nom} consommée : +${result.gain} Endurance. Un flacon a été retiré du sac.`,
        ton: "espoir",
      },
    ]);
  }

  function changerArme(itemId: string) {
    const current = etatRef.current;
    if (!current || !weaponAction(current, itemId, itemPhase).allowed) return;
    const suivant = { ...current, armeEnMain: itemId };
    setEtat(suivant);
    etatRef.current = suivant;
  }

  /* ---------------- Recommencer ---------------- */
  function recommencer() {
    effacer();
    router.push("/jouer");
  }

  const habilete = useMemo(() => (etat ? habileteHorsCombat(etat) : 0), [etat]);

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
    <MotionConfig reducedMotion="user">
      <div
        className="reader-surface min-h-screen bg-background"
        data-reading-theme={reading.theme}
        style={readingStyle}
      >
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Link href="/catalogue" className="reader-tool border-0 px-0">
                <ArrowLeft />
                Bibliothèque
              </Link>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Loup Solitaire · Livre 01 · § {section.id}
              </p>
              <div className="flex gap-3 text-sm tabular-nums">
                <span
                  className="inline-flex items-center gap-1.5 text-hero-emerald"
                  aria-label={`Endurance ${etat.enduranceActuelle} sur ${enduranceMax(etat)}`}
                >
                  <Heart size={16} />
                  {etat.enduranceActuelle}/{enduranceMax(etat)}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-primary"
                  aria-label={`Habileté hors combat ${habilete}`}
                >
                  <Sword size={16} />
                  {habilete}
                </span>
              </div>
            </div>
            <nav
              className="grid grid-cols-3 gap-2"
              aria-label="Outils de l’aventure"
            >
              <button
                className="reader-tool"
                aria-haspopup="dialog"
                aria-expanded={outils === "feuille"}
                onClick={() => setOutils("feuille")}
              >
                <Package />
                Sac & héros
              </button>
              <button
                className="reader-tool"
                aria-haspopup="dialog"
                aria-expanded={outils === "lecture"}
                onClick={() => setOutils("lecture")}
              >
                <Settings2 />
                Lecture
              </button>
              <button
                className="reader-tool"
                aria-haspopup="dialog"
                aria-expanded={outils === "table"}
                onClick={() => setOutils("table")}
              >
                <Dices />
                Hasard
              </button>
            </nav>
          </div>
        </header>
        <Dialog
          open={outils !== "aucun"}
          onOpenChange={(open) => {
            if (!open) setOutils("aucun");
          }}
        >
          <DialogContent
            className="reader-dialog reader-surface sm:max-w-xl"
            data-reading-theme={reading.theme}
            style={readingStyle}
          >
            <DialogTitle className="font-serif text-2xl pr-8">
              {outils === "feuille"
                ? "Sac & héros"
                : outils === "lecture"
                  ? "Votre confort de lecture"
                  : "Table de Hasard"}
            </DialogTitle>
            <DialogDescription>
              {outils === "feuille"
                ? "Vos objets, leurs effets et votre progression."
                : outils === "lecture"
                  ? "Installez-vous, le récit s’adapte à vous."
                  : "Une aide aux règles. Les assauts utilisent leur propre tirage."}
            </DialogDescription>
            {outils === "feuille" && (
              <FeuilleAventure
                state={etat}
                phase={itemPhase}
                onBoirePotion={boirePotion}
                onChangerArme={changerArme}
              />
            )}
            {outils === "lecture" && (
              <ReadingSettings value={reading} onChange={changeReading} />
            )}
            {outils === "table" && <TableHasard compact />}
            <button
              className="action-link action-secondary w-full"
              onClick={() => setOutils("aucun")}
            >
              Revenir au récit
            </button>
          </DialogContent>
        </Dialog>

        <p role="status" aria-live="polite" className="sr-only">
          Paragraphe {section.id} · {section.titre}
        </p>
        {/* ---------- Corps ---------- */}
        <main
          id="aventure-paragraphe"
          className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6 pb-24"
        >
          {enCombat && !combatEngage && !mort && (
            <Rencontre
              section={section}
              state={etat}
              onPrepare={() => setOutils("feuille")}
              onStart={() => {
                setCombatEngage(true);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            />
          )}
          {/* Le contexte reste visible pendant le combat. */}
          {enCombat && combatEngage && section.combat && combat && (
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
              <details className="panel p-4">
                <summary className="cursor-pointer text-sm font-semibold text-primary">
                  La scène · {section.titre ?? `Paragraphe ${section.id}`}
                </summary>
                <div className="pt-4 space-y-4">
                  {section.image && (
                    <Illustration
                      key={section.image}
                      src={section.image}
                      alt={
                        section.imageAlt ??
                        section.titre ??
                        "Illustration de la scène"
                      }
                    />
                  )}
                  <div className="reading-paper">
                    {section.texte.split("\n\n").map((texte, i) => (
                      <p key={i} className="font-serif mb-3 last:mb-0">
                        {texte}
                      </p>
                    ))}
                  </div>
                </div>
              </details>
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
                  section.suite
                    ? () => allerA(section.suite as string)
                    : undefined
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
                    alt={section.imageAlt ?? section.titre ?? "Illustration"}
                  />
                )}

                {/* Texte */}
                <div className="reading-paper relative overflow-visible">
                  {userBookmark && (
                    <div className="absolute -top-3 right-6 z-20 pointer-events-none drop-shadow-md hidden sm:block">
                      <BookmarkVisual
                        bookmark={userBookmark}
                        size="sm"
                        showTassel={false}
                      />
                    </div>
                  )}
                  {section.titre && (
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3 font-serif">
                      {section.titre}
                    </h2>
                  )}
                  <div className="space-y-3.5">
                    {section.texte.split("\n\n").map((p, i) => (
                      <motion.p
                        key={i}

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
                    className="glass-card rounded-2xl p-5 border-2 border-[var(--hero-gold)]/40 space-y-3 text-center"
                  >
                    <Dices className="w-7 h-7 mx-auto text-[var(--hero-gold)]" />
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
                        ),
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
                              ? "border-border/40 bg-muted/20 cursor-not-allowed"
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
                              <span className="block text-xs text-muted-foreground leading-5">
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
                        ? "border-[var(--hero-gold)]/60 glow-gold"
                        : "border-red-600/50"
                    }`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {section.fin === "victoire" ? (
                        <Trophy className="w-14 h-14 mx-auto text-[var(--hero-gold)]" />
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
                      Paragraphes visités : {etat.visites.length} · Objets
                      spéciaux récoltés : {etat.objetsSpeciaux.length} · Fin
                      enregistrée dans votre galerie.
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
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Aides d'affichage                                                   */
/* ------------------------------------------------------------------ */

/** Preserve the full illustration: no crop, colour filter or gradient overlay. */
function Illustration({ src, alt }: { src: string; alt: string }) {
  const [erreur, setErreur] = useState(false);
  if (erreur)
    return (
      <div className="panel p-6 text-sm text-muted-foreground">
        Illustration indisponible · {alt}
      </div>
    );
  return (
    <figure className="panel overflow-hidden bg-[#101612] p-3">
      <img
        src={src}
        alt={alt}
        onError={() => setErreur(true)}
        className="w-full h-auto max-h-[600px] object-contain rounded-lg"
      />
      <figcaption className="text-xs text-muted-foreground text-center pt-3 pb-1">
        {alt}
      </figcaption>
      <IllustrationCredit src={src} />
    </figure>
  );
}

function verifier(
  etat: AdventureState,
  requis: NonNullable<StorySection["choix"]>[number]["requis"],
): boolean {
  if (!requis) return true;
  if (requis.discipline && !etat.disciplines.includes(requis.discipline))
    return false;
  if (
    requis.disciplineParmi &&
    !requis.disciplineParmi.some((d) => etat.disciplines.includes(d))
  )
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
  requis: NonNullable<StorySection["choix"]>[number]["requis"],
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
    morceaux.push(
      `Discipline : ${noms[requis.discipline] ?? requis.discipline}`,
    );
  }
  if (requis.disciplineParmi) {
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
    morceaux.push(
      `Discipline : ${requis.disciplineParmi
        .map((d) => noms[d] ?? d)
        .join(" ou ")}`,
    );
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
