"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Dices,
  Heart,
  RotateCcw,
  ScrollText,
  Sparkles,
  Sword,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ARME_PAR_TIRAGE,
  DISCIPLINES,
  NOM_ARME,
  getItem,
} from "@/lib/lonewolf/rules";
import type {
  KaiDisciplineId,
  StoryBook,
  WeaponId,
} from "@/lib/lonewolf/types";
import { creerAventure, enduranceMax, habileteHorsCombat } from "@/lib/lonewolf/engine";
import { sauvegarder } from "@/lib/lonewolf/sauvegarde";
import { tirerNombre } from "@/lib/lonewolf/table-hasard";
import { LISTE_LIVRES, livreParSlug } from "@/content/lonewolf/registre";
import FeuilleAventure from "./FeuilleAventure";

type Etape =
  | "livre"
  | "intro"
  | "tirage"
  | "disciplines"
  | "equipement"
  | "recap";

/** Amorce narrative affichée à l'étape « Règles », propre à chaque tome. */
const INTROS: Record<string, string> = {
  "loup-solitaire-01":
    "Vous êtes un initié du monastère Kaï. Cette nuit, le Roi-Sorcier a lancé ses armées sur le Sommerlund et le monastère brûle. Vous êtes le seul survivant — et le seul à pouvoir prévenir le Roi. Trois cents kilomètres vous séparent de Holmgard.",
  "loup-solitaire-02":
    "Holmgard est assiégée. Porteur du Sceau d'Hammardal, vous quittez la capitale pour Durenor : convaincre le Roi Alin IV de briser le siège. Mer, diligence, tunnel de Tarnalin… et les serviteurs des Maîtres des Ténèbres guettent chaque étape de la traversée.",
};

/** Paquetage affiché à l'étape « Équipement ». */
const PAQUETAGES: Record<string, string> = {
  "loup-solitaire-01":
    "Vous emportez la Hache des novices, un Repas, la Carte du Sommerlund et quelques Pièces d'Or. Dans la salle d'armes, un dernier objet vous attend — la Table de Hasard en décide.",
  "loup-solitaire-02":
    "Aucune arme au départ : vous ne recevez que le Sceau d'Hammardal, la Carte du Durenor et une bourse de 10 à 19 Pièces d'Or. Deux objets de la liste officielle (Épée, Sabre, 2 Repas, Cotte de Mailles, Masse, Potion de Guérison, Bâton, Lance, Glaive, Bouclier) sont à choisir librement à l’Arsenal.",
};

const PAQUETAGE_OBJETS: Record<
  string,
  { e: string; t: string }[]
> = {
  "loup-solitaire-01": [
    { e: "🪓", t: "Hache (arme)" },
    { e: "🍖", t: "1 Repas" },
    { e: "🗺️", t: "Carte du Sommerlund" },
    { e: "🪙", t: "1 à 10 Pièces d'Or" },
  ],
  "loup-solitaire-02": [
    { e: "💍", t: "Sceau d'Hammardal" },
    { e: "🗺️", t: "Carte du Durenor" },
    { e: "🎒", t: "2 objets au choix" },
    { e: "🪙", t: "10 à 19 Pièces d'Or" },
  ],
};

export default function CreationHeros() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-reading-bg">
          <div
            className="max-w-3xl mx-auto px-4 pt-10 space-y-4"
            aria-hidden="true"
          >
            <div className="h-8 w-44 animate-pulse rounded-lg bg-white/5" />
            <div className="h-2 w-full animate-pulse rounded bg-white/5" />
            <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
          </div>
        </div>
      }
    >
      <CreationContenu />
    </Suspense>
  );
}

function CreationContenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Entrée directe depuis un livre choisi (?livre=…) : on saute le choix.
  const livreDemande = searchParams.get("livre");
  const livreValide = LISTE_LIVRES.some((l) => l.slug === livreDemande)
    ? (livreDemande as string)
    : null;
  const [etape, setEtape] = useState<Etape>(livreValide ? "intro" : "livre");
  const [livreImpose, setLivreImpose] = useState(!!livreValide);
  const [bookSlug, setBookSlug] = useState<string>(
    livreValide ?? "loup-solitaire-01",
  );
  const book = livreParSlug(bookSlug);
  const [roulement, setRoulement] = useState(false);
  const [faceAffichee, setFaceAffichee] = useState<number | null>(null);

  const [habilete, setHabilete] = useState<number | null>(null);
  const [endurance, setEndurance] = useState<number | null>(null);
  const [messageTirage, setMessageTirage] = useState<string | null>(null);

  const [disciplines, setDisciplines] = useState<KaiDisciplineId[]>([]);
  const [armeMaitrisee, setArmeMaitrisee] = useState<WeaponId | null>(null);
  const [tirageArme, setTirageArme] = useState<number | null>(null);

  const [tirageObjet, setTirageObjet] = useState<number | null>(null);
  const [tirageObjet2, setTirageObjet2] = useState<number | null>(null);
  const [orDepart, setOrDepart] = useState<number | null>(null);

  async function animerTirage(): Promise<number> {
    setRoulement(true);
    for (let i = 0; i < 6; i++) {
      setFaceAffichee(Math.floor(Math.random() * 10));
      await new Promise((r) => setTimeout(r, 40 + i * 8));
    }
    const n = tirerNombre();
    setFaceAffichee(n);
    await new Promise((r) => setTimeout(r, 120));
    setRoulement(false);
    return n;
  }

  async function tirerCaracteristiques() {
    const h = await animerTirage();
    setHabilete(10 + h);
    setMessageTirage(`Habileté : 10 + ${h} = ${10 + h}.`);

    const e = await animerTirage();
    setEndurance(20 + e);
    setMessageTirage(
      `Habileté : 10 + ${h} = ${10 + h} · Endurance : 20 + ${e} = ${20 + e}.`
    );
  }

  function basculerDiscipline(id: KaiDisciplineId) {
    setDisciplines((d) => {
      if (d.includes(id)) return d.filter((x) => x !== id);
      if (d.length >= 5) return d;
      return [...d, id];
    });
  }

  async function tirerArme() {
    const n = await animerTirage();
    setTirageArme(n);
    setArmeMaitrisee(ARME_PAR_TIRAGE[String(n)]);
  }

  async function tirerEquipement() {
    if (book.numero === 2) {
      setOrDepart(book.orDepartMin + await animerTirage());
      return;
    }
    const n = await animerTirage();
    setTirageObjet(n);
    if ((book.tiragesEquipement ?? 1) >= 2) {
      const n2 = await animerTirage();
      setTirageObjet2(n2);
    } else {
      setTirageObjet2(null);
    }
    const o = await animerTirage();
    // Tome 1 : 1 à 10 Pièces d'Or · Tome 2 : 10 à 19 Pièces d'Or.
    setOrDepart(
      book.numero === 2 ? book.orDepartMin + o : o === 0 ? 10 : o,
    );
  }

  function choisirLivre(slug: string) {
    setLivreImpose(false);
    setBookSlug(slug);
    // Réinitialise les choix si l'on change de livre après coup.
    setTirageObjet(null);
    setTirageObjet2(null);
    setOrDepart(null);
    setArmeMaitrisee(null);
    setTirageArme(null);
    setEtape("intro");
  }

  function terminer() {
    if (habilete === null || endurance === null || !orDepart) return;
    const state = creerAventure({
      book,
      habileteBase: habilete,
      enduranceBase: endurance,
      disciplines,
      armeMaitrisee:
        disciplines.includes("maitrise-armes") && armeMaitrisee
          ? armeMaitrisee
          : undefined,
      tirageDepart: tirageObjet !== null ? String(tirageObjet) : undefined,
      tirageDepart2:
        tirageObjet2 !== null ? String(tirageObjet2) : undefined,
      orDepart,
    });
    sauvegarder(state);
    router.push("/jouer/aventure");
  }

  const totalFaible =
    habilete !== null && endurance !== null && habilete + endurance < 25;
  const armeMaitriseeNom = armeMaitrisee ? NOM_ARME[armeMaitrisee] : null;
  const gainsObjet =
    tirageObjet !== null ? (book.tirageDepart[String(tirageObjet)] ?? []) : [];
  const gainsObjet2 =
    tirageObjet2 !== null ? (book.tirageDepart[String(tirageObjet2)] ?? []) : [];

  /* --------------------------------------------------------------- */

  const etapes: { id: Etape; label: string }[] = [
    ...(livreImpose ? [] : [{ id: "livre" as Etape, label: "Livre" }]),
    { id: "intro", label: "Histoire" },
    { id: "tirage", label: "Caractéristiques" },
    { id: "disciplines", label: "Disciplines" },
    { id: "equipement", label: "Équipement" },
    { id: "recap", label: "Feuille d'Aventure" },
  ];
  const indexEtape = etapes.findIndex((e) => e.id === etape);

  return (
    <div className="min-h-screen gradient-reading-bg">
      <div className="max-w-3xl mx-auto px-4 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))] space-y-6">
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
            <Link href="/regles" className="btn btn-secondary btn-sm">
              <BookOpen className="w-4 h-4" />
              Règles
            </Link>
          </div>

          <div className="space-y-1.5">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs font-black uppercase tracking-widest"
            >
              Livre {book.numero} · Loup Solitaire
            </Badge>
            <h1 className="text-[1.7rem] sm:text-3xl font-black tracking-tight">
              Votre <span className="gradient-hero">Feuille d&apos;Aventure</span>
            </h1>
          </div>

          {/* Progression : barre + retour */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              {indexEtape > 0 ? (
                <button
                  type="button"
                  onClick={() => setEtape(etapes[indexEtape - 1].id)}
                  className="inline-flex min-h-[36px] items-center gap-1 text-[13px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
              ) : (
                <span />
              )}
              <span className="text-xs font-bold text-[#dfbb78]">
                Étape {indexEtape + 1}/{etapes.length} ·{" "}
                {etapes[indexEtape].label}
              </span>
            </div>
            <div
              className="steps-track"
              role="progressbar"
              aria-label="Progression de la création du héros"
              aria-valuemin={1}
              aria-valuemax={etapes.length}
              aria-valuenow={indexEtape + 1}
            >
              <div
                className="steps-fill"
                style={{
                  width: `${((indexEtape + 1) / etapes.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* ---------------- CHOIX DU LIVRE ---------------- */}
          {etape === "livre" && (
            <motion.section
              key="livre"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="card p-4 sm:p-5 space-y-1">
                <h2 className="font-black flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Choisissez votre tome
                </h2>
                <p className="text-[13px] text-muted-foreground">
                  Une seule sauvegarde : en commencer une nouvelle effacera la
                  partie en cours.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {LISTE_LIVRES.map((l) => (
                  <motion.button
                    key={l.slug}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => choisirLivre(l.slug)}
                    className="row-card !items-start text-left"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={l.illustration}
                      alt=""
                      aria-hidden="true"
                      className="w-14 shrink-0 aspect-[3/4] rounded-lg object-cover bg-[#101612]"
                    />
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="block text-[11px] font-black uppercase tracking-widest text-[#dfbb78]">
                        Livre {l.numero}
                      </span>
                      <span className="block font-serif text-[15px] font-bold leading-snug text-foreground">
                        {l.titre}
                      </span>
                      <span className="block text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {l.resume}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ---------------- INTRO ---------------- */}
          {etape === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-3xl overflow-hidden border border-border/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.illustration}
                  alt={`Couverture : ${book.titre}`}
                  className="w-full h-auto max-h-96 object-contain bg-[#101612]"
                />
                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-black">{book.titre}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {INTROS[book.slug]}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { emoji: "🎲", t: "Table de Hasard", d: "Aucun dé nécessaire, tout se résout avec la grille de 0 à 9." },
                      { emoji: "⚔️", t: "Vrais combats", d: "Quotient d'Attaque et Table des Coups Portés, assaut par assaut." },
                      { emoji: "🎒", t: "Encombrement", d: "8 objets, 2 armes, 50 Pièces d'Or : choisissez bien." },
                    ].map((c) => (
                      <div
                        key={c.t}
                        className="rounded-xl bg-muted/40 border border-border/50 p-2.5 space-y-1 text-center"
                      >
                        <div className="text-lg">{c.emoji}</div>
                        <div className="font-bold text-xs leading-tight">{c.t}</div>
                        <div className="hidden sm:block text-[11px] text-muted-foreground leading-snug">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setEtape("tirage")}
                className="w-full gap-2 font-bold glow-purple min-h-[52px] text-[15px]"
              >
                Déterminer mes caractéristiques
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLivreImpose(false);
                    setEtape("livre");
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Choisir un autre tome
                </button>
              </div>
            </motion.section>
          )}

          {/* ---------------- TIRAGE ---------------- */}
          {etape === "tirage" && (
            <motion.section
              key="tirage"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-3xl p-5 space-y-4 text-center">
                <Dices className="w-8 h-8 mx-auto text-[var(--hero-gold)]" />
                <h2 className="font-black">La Table de Hasard décide</h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Dans le livre, vous fermiez les yeux et posiez votre crayon sur
                  la grille. Votre <strong>Habileté</strong> vaut 10 + le premier
                  chiffre désigné, votre <strong>Endurance</strong> 20 + le second.
                </p>

                <motion.div
                  key={faceAffichee ?? "vide"}
                  animate={{ scale: roulement ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.2 }}
                  className={`mx-auto w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl font-black tabular-nums ${
                    roulement
                      ? "border-[var(--hero-gold)] text-[var(--hero-gold)]"
                      : "border-primary/50 text-primary"
                  }`}
                >
                  {faceAffichee ?? "?"}
                </motion.div>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-amber-400 font-black flex items-center justify-center gap-1">
                      <Sword className="w-3 h-3" /> Habileté
                    </div>
                    <div className="text-3xl font-black tabular-nums text-amber-300">
                      {habilete ?? "–"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/25 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-red-400 font-black flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3" /> Endurance
                    </div>
                    <div className="text-3xl font-black tabular-nums text-red-300">
                      {endurance ?? "–"}
                    </div>
                  </div>
                </div>

                {messageTirage && (
                  <p className="text-xs text-muted-foreground">{messageTirage}</p>
                )}

                {totalFaible && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-[11px] text-red-300">
                    Total inférieur à 25 : la règle officielle vous autorise à
                    refaire les deux tirages. Un héros aussi faible risque fort de
                    mourir avant Holmgard.
                  </div>
                )}

                <div className="flex flex-col gap-2 justify-center max-w-sm mx-auto">
                  {habilete === null ? (
                    <Button
                      onClick={tirerCaracteristiques}
                      disabled={roulement}
                      className="gap-2 font-bold w-full min-h-[52px] text-[15px]"
                    >
                      <Dices className="w-4 h-4" />
                      Lancer la Table de Hasard
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setEtape("disciplines")}
                      disabled={roulement}
                      className="gap-2 font-bold w-full min-h-[52px] text-[15px] btn-primary--hero"
                    >
                      Continuer
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                  {habilete !== null && (
                    <p className="text-[11px] text-center text-muted-foreground">Tirage définitif — impossible de relancer.</p>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* ---------------- DISCIPLINES ---------------- */}
          {etape === "disciplines" && (
            <motion.section
              key="disciplines"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-3xl p-5 space-y-2">
                <h2 className="font-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Choisissez vos cinq Disciplines Kaï
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez exactement <strong>5</strong> Disciplines sur les 10
                  proposées. Certaines options de l&apos;aventure ne s&apos;ouvriront
                  qu&apos;à ceux qui les possèdent.
                </p>
                <div className="text-[11px] font-bold text-primary">
                  {disciplines.length}/5 sélectionnées
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DISCIPLINES.map((d) => {
                  const actif = disciplines.includes(d.id);
                  const bloque = !actif && disciplines.length >= 5;
                  return (
                    <motion.button
                      key={d.id}
                      whileHover={bloque ? {} : { y: -2 }}
                      whileTap={bloque ? {} : { scale: 0.98 }}
                      onClick={() => !bloque && basculerDiscipline(d.id)}
                      className={`text-left rounded-2xl border p-3.5 space-y-1.5 transition-colors ${
                        actif
                          ? "border-primary bg-primary/15"
                          : bloque
                            ? "border-border/40 bg-muted/20 opacity-50"
                            : "border-border/70 bg-card/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{d.emoji}</span>
                        <span className="font-bold text-sm flex-1">{d.nom}</span>
                        {actif && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {d.description}
                      </p>
                      <p className="text-[10px] text-[var(--hero-emerald)] font-medium">
                        {d.mecanique}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Tirage de la Maîtrise des Armes */}
              {disciplines.includes("maitrise-armes") && (
                <div className="glass-card rounded-2xl p-4 space-y-3 text-center border-2 border-amber-500/40">
                  <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <Sword className="w-3.5 h-3.5" />
                    Maîtrise des Armes : quelle arme vous a-t-on enseignée ?
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tirez un chiffre : 0 = Poignard · 1 = Lance · 2 = Masse d&apos;Armes
                    · 3 = Sabre · 4 = Marteau de Guerre · 5 = Épée · 6 = Hache · 7 =
                    Épée · 8 = Bâton · 9 = Glaive.
                  </p>
                  <div className="text-3xl font-black tabular-nums text-[var(--hero-gold)]">
                    {tirageArme ?? "?"}
                  </div>
                  {armeMaitriseeNom && (
                    <div className="text-sm font-bold">
                      Maîtrise : {armeMaitriseeNom} (+2 Habileté avec cette arme)
                    </div>
                  )}
                  {tirageArme === null ? (
                    <Button
                      size="sm"
                      onClick={tirerArme}
                      disabled={roulement}
                      className="gap-2 min-h-[44px] font-bold"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      Tirer mon arme
                    </Button>
                  ) : (
                    <p className="text-[11px] text-center text-muted-foreground">Tirage définitif — impossible de relancer.</p>
                  )}
                </div>
              )}

              <Button
                size="lg"
                onClick={() => setEtape("equipement")}
                disabled={
                  disciplines.length !== 5 ||
                  (disciplines.includes("maitrise-armes") && !armeMaitrisee)
                }
                className="w-full gap-2 font-bold glow-purple min-h-[52px] text-[15px]"
              >
                Passer à l&apos;équipement
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.section>
          )}

          {/* ---------------- ÉQUIPEMENT ---------------- */}
          {etape === "equipement" && (
            <motion.section
              key="equipement"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h2 className="font-black">Votre paquetage de départ</h2>
                <p className="text-xs text-muted-foreground">
                  {PAQUETAGES[book.slug]}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAQUETAGE_OBJETS[book.slug].map((o) => (
                    <div
                      key={o.t}
                      className="rounded-xl bg-muted/40 border border-border/50 p-2.5 text-center space-y-1"
                    >
                      <div className="text-xl">{o.e}</div>
                      <div className="text-[11px] font-semibold">{o.t}</div>
                    </div>
                  ))}
                </div>
              </div>

              {book.numero === 2 ? <div className="glass-card rounded-2xl p-5 space-y-4">
                <h3 className="font-bold">Choisissez deux objets de l’Arsenal</h3>
                <p className="text-sm">Le PDF vous laisse choisir l’équipement ; seule la bourse est tirée au hasard.</p>
                {[0,1].map(i => <label key={i} className="block">Objet {i+1}
                  <select className="ml-2 p-2 rounded bg-white text-black" value={(i===0?tirageObjet:tirageObjet2) ?? ""}
                    onChange={e => (i===0?setTirageObjet:setTirageObjet2)(e.target.value===""?null:Number(e.target.value))}>
                    <option value="">Choisir…</option>
                    {Object.entries(book.tirageDepart).map(([key,grants]) => <option key={key} value={key} disabled={Number(key)===(i===0?tirageObjet2:tirageObjet)}>
                      {grants.map(g=>`${getItem(g.id)?.nom ?? g.id}${g.quantity ? ` ×${g.quantity}` : ""}`).join(" · ")}
                    </option>)}
                  </select>
                </label>)}
                {orDepart === null ? <Button onClick={tirerEquipement} disabled={roulement}>Tirer la bourse (10–19 PO)</Button> : <p>Bourse : {orDepart} PO</p>}
              </div> : (
              <div className="glass-card rounded-2xl p-5 space-y-4 text-center border-2 border-[var(--hero-gold)]/40">
                <div className="text-xs font-bold text-[var(--hero-gold)]">
                  {book.numero === 2
                    ? "Deux objets à choisir (Table de Hasard) — et vos Pièces d'Or"
                    : "Tirage de l'objet du monastère (et de vos Pièces d'Or)"}
                </div>
                <div className="text-4xl font-black tabular-nums gradient-hero">
                  {tirageObjet ?? "?"}
                  {(book.tiragesEquipement ?? 1) >= 2 &&
                    (tirageObjet2 !== null ? ` · ${tirageObjet2}` : " · ?")}
                </div>
                {tirageObjet !== null && (
                  <div className="grid gap-2 text-left max-w-sm mx-auto w-full">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfbb78]/15 border border-[#dfbb78]/30 text-lg">🎒</span>
                      <span className="flex-1">
                        <span className="block text-xs font-bold text-muted-foreground">Tirage {tirageObjet}</span>
                        <span className="block text-sm font-bold text-foreground">{gainsObjet.length > 0 ? gainsObjet.map((g) => { const def = getItem(g.id); const q = g.quantity && g.quantity > 1 ? ` ×${g.quantity}` : ""; return `${def?.emoji ?? "✨"} ${def?.nom ?? g.id}${q}`; }).join(" · ") : "Aucun objet"}</span>
                      </span>
                    </div>
                    {(book.tiragesEquipement ?? 1) >= 2 && tirageObjet2 !== null && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfbb78]/15 border border-[#dfbb78]/30 text-lg">🎒</span>
                        <span className="flex-1">
                          <span className="block text-xs font-bold text-muted-foreground">Tirage {tirageObjet2}</span>
                          <span className="block text-sm font-bold text-foreground">{gainsObjet2.length > 0 ? gainsObjet2.map((g) => { const def = getItem(g.id); const q = g.quantity && g.quantity > 1 ? ` ×${g.quantity}` : ""; return `${def?.emoji ?? "✨"} ${def?.nom ?? g.id}${q}`; }).join(" · ") : "Aucun objet"}</span>
                        </span>
                      </div>
                    )}
                    {orDepart !== null && (
                      <div className="rounded-2xl border border-[#dfbb78]/20 bg-[#dfbb78]/10 p-3 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfbb78]/20 border border-[#dfbb78]/30 text-lg">🪙</span>
                        <span className="flex-1 text-left">
                          <span className="block text-xs font-bold text-[#dfbb78]">Bourse</span>
                          <span className="block text-sm font-bold text-foreground">{orDepart} Pièces d'Or</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {tirageObjet === null ? (
                  <Button
                    onClick={tirerEquipement}
                    disabled={roulement}
                    className="gap-2 min-h-[48px] font-bold w-full sm:w-auto"
                  >
                    <Dices className="w-4 h-4" />
                    Tirer mon équipement
                  </Button>
                ) : (
                  <p className="text-[11px] text-center text-muted-foreground">Tirage définitif — impossible de relancer.</p>
                )}
              </div>
              )}

              <Button
                size="lg"
                onClick={() => setEtape("recap")}
                disabled={tirageObjet === null || orDepart === null || (book.numero === 2 && (tirageObjet2 === null || tirageObjet === tirageObjet2))}
                className="w-full gap-2 font-bold glow-purple min-h-[52px] text-[15px]"
              >
                Voir ma Feuille d&apos;Aventure
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.section>
          )}

          {/* ---------------- RÉCAP ---------------- */}
          {etape === "recap" && habilete !== null && endurance !== null && (
            <motion.section
              key="recap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-3xl p-5 space-y-4 border-2 border-[var(--hero-gold)]/40">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-[var(--hero-gold)]" />
                  <h2 className="font-black">Feuille d&apos;Aventure</h2>
                </div>

                {/* Aperçu construit sur l'état réel du moteur */}
                <ApercuFeuille
                  book={book}
                  habilete={habilete}
                  endurance={endurance}
                  disciplines={disciplines}
                  armeMaitrisee={armeMaitrisee}
                  tirageObjet={tirageObjet}
                  tirageObjet2={tirageObjet2}
                  orDepart={orDepart ?? book.orDepartMin}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={terminer}
                  className="w-full gap-2 font-black glow-purple min-h-[56px] text-[16px] btn-primary--hero"
                >
                  <BookOpen className="w-4 h-4" />
                  Commencer l&apos;aventure
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">Tirages définitifs — votre légende commence.</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Aperçu d'une Feuille d'Aventure avant le départ, calculée par le moteur. */
function ApercuFeuille({
  book,
  habilete,
  endurance,
  disciplines,
  armeMaitrisee,
  tirageObjet,
  tirageObjet2,
  orDepart,
}: {
  book: StoryBook;
  habilete: number;
  endurance: number;
  disciplines: KaiDisciplineId[];
  armeMaitrisee: WeaponId | null;
  tirageObjet: number | null;
  tirageObjet2: number | null;
  orDepart: number;
}) {
  const state = creerAventure({
    book,
    habileteBase: habilete,
    enduranceBase: endurance,
    disciplines,
    armeMaitrisee:
      disciplines.includes("maitrise-armes") && armeMaitrisee
        ? armeMaitrisee
        : undefined,
    tirageDepart: tirageObjet !== null ? String(tirageObjet) : undefined,
    tirageDepart2: tirageObjet2 !== null ? String(tirageObjet2) : undefined,
    orDepart,
  });

  return (
    <div className="space-y-3">
      <FeuilleAventure state={state} />
      <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-2">
        Habileté totale hors combat :{" "}
        <strong className="text-amber-300">{habileteHorsCombat(state)}</strong> ·
        Endurance maximale :{" "}
        <strong className="text-red-300">{enduranceMax(state)}</strong>
      </div>
    </div>
  );
}
