import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Reprendre from "@/components/lonewolf/Reprendre";
import { LS01 } from "@/content/lonewolf/ls01";
import {
  BookOpen,
  Dices,
  Heart,
  Play,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Loup Solitaire — Les Maîtres des Ténèbres",
  description:
    "Jouez au livre dont vous êtes le héros Loup Solitaire : Habileté, Endurance, Disciplines Kaï, combats assaut par assaut et Table de Hasard, avec les règles officielles de la série.",
};

export default function AccueilPage() {
  return (
    <div className="min-h-screen gradient-reading-bg">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* ---------- Bandeau ---------- */}
        <nav className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-base">
              🐺
            </span>
            <span className="font-black tracking-tight">HeroBook</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/regles">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ScrollText className="w-3.5 h-3.5" />
                Règles
              </Button>
            </Link>
            <Link href="/jouer">
              <Button size="sm" className="gap-1.5 text-xs font-bold">
                <Play className="w-3.5 h-3.5 fill-current" />
                Jouer
              </Button>
            </Link>
          </div>
        </nav>

        {/* ---------- Héros ---------- */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LS01.illustration}
            alt="Le monastère Kaï en flammes"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[--hero-gold]/20 text-[--hero-gold] border-[--hero-gold]/40 text-[10px] font-black uppercase tracking-widest">
                Livre 1
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary bg-primary/10 text-[10px] font-bold"
              >
                Règles officielles respectées
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
              Loup Solitaire
            </h1>
            <p className="text-sm sm:text-base font-bold text-[--hero-gold]">
              {LS01.titre}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {LS01.resume}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Reprendre />
              <Link href="/regles">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 font-bold"
                >
                  <BookOpen className="w-4 h-4" />
                  Comment jouer
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Les règles en bref ---------- */}
        <section className="space-y-3">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Un livre-jeu qui se joue au crayon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icone: Sword,
                titre: "Habileté 10-19",
                texte:
                  "Votre talent au combat. Elle décide du Quotient d'Attaque, donc de la puissance de chaque coup.",
                couleur: "text-amber-400",
              },
              {
                icone: Heart,
                titre: "Endurance 20-29",
                texte:
                  "Votre vie. Chaque assaut, chaque Repas manquant, chaque piège la fait baisser.",
                couleur: "text-red-400",
              },
              {
                icone: Dices,
                titre: "Table de Hasard",
                texte:
                  "Pas de dés : une grille de 0 à 9 que l'on pointe les yeux fermés. Absolument tout se résout avec elle.",
                couleur: "text-[--hero-gold]",
              },
              {
                icone: Shield,
                titre: "5 Disciplines Kaï",
                texte:
                  "Sixième Sens, Camouflage, Chasse… Vos pouvoirs, choisis une fois pour toutes, décideront de vos chemins.",
                couleur: "text-primary",
              },
            ].map((c) => (
              <div key={c.titre} className="glass-card rounded-2xl p-4 space-y-1.5">
                <c.icone className={`w-5 h-5 ${c.couleur}`} />
                <div className="font-bold text-sm">{c.titre}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.texte}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Ce que fait l'application ---------- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <h3 className="font-black text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[--hero-gold]" />
              Les vraies règles, appliquées à la lettre
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {[
                "Combats résolus assaut par assaut avec la Table des Coups Portés, y compris les « K » mortels.",
                "Quotient d'Attaque détaillé ligne par ligne : Disciplines, arme maîtrisée, Bouclier psychique, immunités…",
                "Sac à Dos limité à 8 objets, 2 armes, Bourse de 50 Pièces d'Or, chaque Repas compte pour un objet.",
                "Guérison Kaï : +1 Endurance par paragraphe sans combat — Chasse : aucun Repas à rayer.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-[--hero-emerald] mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-5 space-y-3">
            <h3 className="font-black text-sm flex items-center gap-2">
              <Dices className="w-4 h-4 text-primary" />
              La Feuille d&apos;Aventure se remplit seule
            </h3>
            <p className="text-xs text-muted-foreground">
              L&apos;application tient vos comptes : Habileté, Endurance, sac,
              bourse, objets spéciaux, potions… Chaque illustration, chaque combat,
              chaque découverte d&apos;objet est animée. Vous n&apos;avez plus qu&apos;à
              décider.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LS01.sections["1"]?.image && (
                <>
                  {[
                    "/lonewolf/monastere-en-feu.jpg",
                    "/lonewolf/banedon.jpg",
                    "/lonewolf/giaks-patrouille.jpg",
                    "/lonewolf/etoile-cristal.jpg",
                  ].map((src) => (
                    <div
                      key={src}
                      className="w-20 h-20 rounded-xl overflow-hidden border border-border/60"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="text-center text-[10px] text-muted-foreground pb-6">
          Loup Solitaire est une création de Joe Dever. Cette application est une
          adaptation jouable ; les textes des paragraphes sont écrits pour
          HeroBook.
        </footer>
      </div>
    </div>
  );
}
