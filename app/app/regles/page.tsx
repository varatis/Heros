import Link from "next/link";
import type { Metadata } from "next";
import TableHasard from "@/components/lonewolf/TableHasard";
import TableCoupsPortes from "@/components/lonewolf/TableCoupsPortes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DISCIPLINES, ITEMS } from "@/lib/lonewolf/rules";
import {
  ArrowLeft,
  BookOpen,
  Backpack,
  Coins,
  Dices,
  Heart,
  Play,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
  Skull,
  Utensils,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Règles du jeu — Loup Solitaire",
  description:
    "Toutes les règles pour jouer au livre dont vous êtes le héros Loup Solitaire : Habileté, Endurance, Disciplines Kaï, équipement, Table de Hasard et Table des Coups Portés.",
};

const SOMMAIRE = [
  { id: "principe", label: "Le principe" },
  { id: "feuille", label: "La Feuille d'Aventure" },
  { id: "caracteristiques", label: "Habileté & Endurance" },
  { id: "table-hasard", label: "La Table de Hasard" },
  { id: "disciplines", label: "Les Disciplines Kaï" },
  { id: "equipement", label: "L'équipement" },
  { id: "nourriture", label: "La nourriture" },
  { id: "potions", label: "Les potions" },
  { id: "combat", label: "Le combat" },
  { id: "table-combat", label: "Table des Coups Portés" },
  { id: "mort", label: "Mourir & recommencer" },
  { id: "conseils", label: "Conseils" },
  { id: "application", label: "Dans l'application" },
];

function Titre({
  id,
  icone: Icone,
  children,
}: {
  id: string;
  icone: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 pt-4"
    >
      <span className="inline-flex w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center shrink-0">
        <Icone className="w-4.5 h-4.5 text-primary" />
      </span>
      {children}
    </h2>
  );
}

function Carte({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 space-y-3 leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
}

function Regle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 text-sm">
      <span className="text-[var(--hero-gold)] mt-1">◆</span>
      <p className="flex-1">{children}</p>
    </div>
  );
}

export default function ReglesPage() {
  const armes = ITEMS.filter((i) => i.slot === "arme");
  const sacs = ITEMS.filter((i) => i.slot === "sac");
  const speciaux = ITEMS.filter((i) => i.slot === "special");

  return (
    <div className="min-h-screen gradient-reading-bg">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* En-tête */}
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
            <Link href="/jouer">
              <Button size="sm" className="gap-2 font-bold glow-purple">
                <Play className="w-3.5 h-3.5 fill-current" />
                Jouer le livre 1
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-[var(--hero-gold)]/40 text-[var(--hero-gold)] bg-[var(--hero-gold)]/10 text-[11px] font-bold"
            >
              <ScrollText className="w-3 h-3 mr-1" />
              Les règles officielles de la série
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Comment jouer à <span className="gradient-hero">Loup Solitaire</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Loup Solitaire ne se joue pas comme les autres livres dont vous êtes
              le héros : il n&apos;y a pas de dés. Deux caractéristiques — votre{" "}
              <strong className="text-foreground">Habileté</strong> et votre{" "}
              <strong className="text-foreground">Endurance</strong> — se croisent
              avec une <strong className="text-foreground">Table de Hasard</strong>{" "}
              et une{" "}
              <strong className="text-foreground">Table des Coups Portés</strong>.
              Voici l&apos;intégralité des règles, exactement comme dans le livre.
            </p>
          </div>

          {/* Sommaire */}
          <nav className="glass-card rounded-2xl p-3 flex flex-wrap gap-1.5">
            {SOMMAIRE.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </header>

        {/* 1. Principe */}
        <section className="space-y-3">
          <Titre id="principe" icone={BookOpen}>
            Le principe du livre-jeu
          </Titre>
          <Carte>
            <p className="text-sm">
              Vous êtes le héros. Le récit est découpé en{" "}
              <strong>paragraphes numérotés</strong>. À la fin de chaque
              paragraphe, le texte vous propose un ou plusieurs choix : « si vous
              voulez faire ceci, rendez-vous au <strong>44</strong> ». Vous ne
              lisez jamais le livre dans l&apos;ordre : c&apos;est votre décision
              qui décide de la suite, et une seule aventure ne vous fera jamais
              traverser qu&apos;une petite partie des paragraphes.
            </p>
            <p className="text-sm">
              Vous devrez aussi <strong>gérer des ressources</strong> : des points
              d&apos;Endurance (votre vie), des objets à transporter, de la
              nourriture, de l&apos;or… et l&apos;encombrement vous tuera aussi
              sûrement qu&apos;une lame giak.
            </p>
          </Carte>
        </section>

        {/* 2. Feuille d'Aventure */}
        <section className="space-y-3">
          <Titre id="feuille" icone={ScrollText}>
            Votre Feuille d&apos;Aventure
          </Titre>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icone: Sword,
                titre: "Habileté",
                texte:
                  "Votre talent de combattant. Entre 10 et 19 au départ. Elle augmente avec les Disciplines et les objets.",
                couleur: "text-amber-400",
              },
              {
                icone: Heart,
                titre: "Endurance",
                texte:
                  "Votre vie. Entre 20 et 29 au départ. On la perd au combat et en cas de Repas manquant.",
                couleur: "text-red-400",
              },
              {
                icone: Sparkles,
                titre: "5 Disciplines Kaï",
                texte:
                  "Les pouvoirs appris au monastère. Choisies une fois pour toutes au début de l'aventure.",
                couleur: "text-primary",
              },
              {
                icone: Backpack,
                titre: "Équipement",
                texte:
                  "2 armes, 8 objets de Sac à Dos, 50 Pièces d'Or, et les Objets Spéciaux hors sac.",
                couleur: "text-[var(--hero-emerald)]",
              },
            ].map((c) => (
              <div
                key={c.titre}
                className="glass-card rounded-2xl p-4 space-y-1.5"
              >
                <c.icone className={`w-5 h-5 ${c.couleur}`} />
                <div className="font-bold text-sm">{c.titre}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.texte}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Caractéristiques */}
        <section className="space-y-3">
          <Titre id="caracteristiques" icone={Dices}>
            Déterminer votre Habileté et votre Endurance
          </Titre>
          <Carte>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-bold text-sm flex items-center gap-2">
                  <Sword className="w-4 h-4 text-amber-400" />
                  HABILETÉ = 10 + le premier chiffre tiré
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous obtenez donc entre 10 et 19 points. C&apos;est la
                  caractéristique qui décide de l&apos;issue des combats : plus
                  elle est haute, mieux cela vaut.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  ENDURANCE = 20 + le second chiffre tiré
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous obtenez entre 20 et 29 points. Votre Endurance ne pourra
                  jamais dépasser ce total de départ : soignez-vous avant
                  d&apos;être à bout.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 text-xs">
              <strong>Attention :</strong> si vous désignez un 0, cela vaut zéro
              point. Un Héros qui commence avec Habileté 10 et Endurance 20 est un
              personnage très faible — la règle officielle autorise à recommencer
              le tirage si le total des deux caractéristiques est inférieur à 25
              (à la convenance du joueur).
            </div>
          </Carte>
        </section>

        {/* 4. Table de Hasard */}
        <section className="space-y-3">
          <Titre id="table-hasard" icone={Dices}>
            La Table de Hasard
          </Titre>
          <Carte>
            <p className="text-sm">
              Toute la série repose sur elle. C&apos;est une grille de cent cases
              contenant les chiffres de 0 à 9. Pour obtenir un « nombre
              aléatoire », vous fermiez les yeux et posiez la mine de votre crayon
              sur une case : le chiffre désigné était votre résultat.
            </p>
            <p className="text-sm">
              Cette table sert à <strong>tout</strong> : déterminer vos
              caractéristiques, résoudre chaque assaut d&apos;un combat, savoir si
              un danger vous surprend, quel objet vous découvrez…
            </p>
          </Carte>
          <TableHasard />
        </section>

        {/* 5. Disciplines */}
        <section className="space-y-3">
          <Titre id="disciplines" icone={Sparkles}>
            Les Disciplines Kaï
          </Titre>
          <Carte>
            <p className="text-sm">
              Votre entraînement au monastère vous a fait maîtriser{" "}
              <strong>cinq</strong> des dix Disciplines Kaï. Choisissez-les avec
              soin : dans certains paragraphes, une seule Discipline vous sauvera
              la vie, et certaines options de choix resteront invisibles sans
              elle. Il est impossible d&apos;être bon en tout.
            </p>
          </Carte>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DISCIPLINES.map((d) => (
              <div
                key={d.id}
                className="glass-card rounded-2xl p-4 space-y-2.5 hover:border-primary/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{d.emoji}</span>
                  <h3 className="font-bold text-sm">{d.nom}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {d.description}
                </p>
                <div className="rounded-lg bg-[var(--hero-emerald)]/10 border border-[var(--hero-emerald)]/30 px-2.5 py-1.5 text-[11px] text-[var(--hero-emerald)] font-medium">
                  {d.mecanique}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Équipement */}
        <section className="space-y-3">
          <Titre id="equipement" icone={Backpack}>
            Votre équipement
          </Titre>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Carte className="space-y-2">
              <div className="font-bold text-sm flex items-center gap-2">
                <Sword className="w-4 h-4 text-amber-400" />
                Les Armes — 2 maximum
              </div>
              <p className="text-xs text-muted-foreground">
                Vous ne pouvez porter que <strong>deux armes</strong> à la fois, et
                n&apos;en utiliser qu&apos;une par combat. La Maîtrise des Armes
                accorde +2 d&apos;Habileté avec l&apos;arme apprise.
              </p>
              <p className="text-xs text-red-400/90">
                Si vous devez combattre <strong>sans arme</strong>, vous perdez 4
                points d&apos;Habileté.
              </p>
            </Carte>

            <Carte className="space-y-2">
              <div className="font-bold text-sm flex items-center gap-2">
                <Backpack className="w-4 h-4 text-[var(--hero-emerald)]" />
                Le Sac à Dos — 8 objets
              </div>
              <p className="text-xs text-muted-foreground">
                Tout ce qui n&apos;est ni une arme ni un Objet Spécial va dans le
                Sac à Dos : potions, corde, torche, et{" "}
                <strong>chaque Repas compte pour un objet</strong>. Un huitième
                objet trouvé alors que le sac est plein doit être abandonné (ou
                remplacé).
              </p>
            </Carte>

            <Carte className="space-y-2">
              <div className="font-bold text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-[var(--hero-gold)]" />
                La Bourse — 50 Pièces d&apos;Or
              </div>
              <p className="text-xs text-muted-foreground">
                Les Pièces d&apos;Or se rangent dans la Bourse, qui ne peut en
                contenir que <strong>cinquante</strong>. Elles servent à payer un
                passage, un repas ou une chambre — et parfois à sauver votre vie.
              </p>
            </Carte>
          </div>

          <Carte className="space-y-3">
            <div className="font-bold text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Les Objets Spéciaux
            </div>
            <p className="text-xs text-muted-foreground">
              Ils ne prennent pas de place dans le Sac à Dos et ne comptent pas
              dans les huit objets : le nombre de vos Objets Spéciaux est illimité.
              Certains donnent des bonus permanents (un casque +2 Endurance, une
              cotte de mailles +4 Endurance, un bouclier +2 Habileté au combat).
            </p>
            <div className="flex flex-wrap gap-1.5">
              {speciaux.map((s) => (
                <span
                  key={s.id}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 border border-border/60"
                  title={s.description}
                >
                  {s.emoji} {s.nom}
                </span>
              ))}
            </div>
          </Carte>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Carte className="space-y-2">
              <div className="font-bold text-sm">Armes du royaume du Sommerlund</div>
              <div className="flex flex-wrap gap-1.5">
                {armes.map((a) => (
                  <span
                    key={a.id}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300"
                  >
                    {a.emoji} {a.nom}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                La Maîtrise des Armes se tire à la Table de Hasard : 0 = Poignard,
                1 = Lance, 2 = Masse d&apos;Armes, 3 = Sabre, 4 = Marteau de Guerre,
                5 = Épée, 6 = Hache, 7 = Épée, 8 = Bâton, 9 = Glaive.
              </p>
            </Carte>

            <Carte className="space-y-2">
              <div className="font-bold text-sm">Objets de Sac à Dos</div>
              <div className="flex flex-wrap gap-1.5">
                {sacs.map((a) => (
                  <span
                    key={a.id}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--hero-emerald)]/10 border border-[var(--hero-emerald)]/30 text-[var(--hero-emerald)]"
                  >
                    {a.emoji} {a.nom}
                  </span>
                ))}
              </div>
            </Carte>
          </div>
        </section>

        {/* 7. Nourriture */}
        <section className="space-y-3">
          <Titre id="nourriture" icone={Utensils}>
            La nourriture et les Repas
          </Titre>
          <Carte>
            <Regle>
              Au cours de l&apos;aventure, le texte vous demandera régulièrement de{" "}
              <strong>manger un Repas</strong> : rayez alors un Repas de votre Sac
              à Dos.
            </Regle>
            <Regle>
              Si vous ne pouvez pas manger — plus aucun Repas dans le sac — vous
              perdez <strong className="text-red-400">3 points d&apos;Endurance</strong>.
            </Regle>
            <Regle>
              Si vous possédez la Discipline de la{" "}
              <strong>Chasse</strong>, vous n&apos;avez jamais besoin de rayer un
              Repas : vous trouvez toujours de quoi vous nourrir, sauf dans un
              désert, une terre stérile ou des souterrains sans vie.
            </Regle>
            <Regle>
              La Discipline de la <strong>Guérison</strong> ne compense{" "}
              <em>jamais</em> les dégâts d&apos;un Repas manquant : elle soigne les
              blessures, pas la faim.
            </Regle>
          </Carte>
        </section>

        {/* 8. Potions */}
        <section className="space-y-3">
          <Titre id="potions" icone={Sparkles}>
            Les potions
          </Titre>
          <Carte>
            <p className="text-sm">
              Une potion occupe une place dans votre Sac à Dos et ne se boit
              qu&apos;aux moments autorisés par le texte — très souvent{" "}
              <strong>à l&apos;issue d&apos;un combat</strong>. Chaque fiole
              contient une seule dose.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                {
                  nom: "Potion de Laumspur",
                  emoji: "🧪",
                  effet: "+4 Endurance",
                  texte: "La décoction de laumspur, l'herbe des guérisseurs sommerlendiens.",
                },
                {
                  nom: "Potion de Guérison",
                  emoji: "⚗️",
                  effet: "+4 Endurance",
                  texte: "Un flacon ambré préparé par les apothicaires du royaume.",
                },
                {
                  nom: "Potion d'Alether",
                  emoji: "🍶",
                  effet: "+2 Habileté (un combat)",
                  texte: "Le breuvage des guerriers : buvez-le juste avant d'affronter trop fort pour vous.",
                },
              ].map((p) => (
                <div
                  key={p.nom}
                  className="rounded-xl bg-muted/40 border border-border/60 p-3 space-y-1"
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>{p.emoji}</span>
                    {p.nom}
                  </div>
                  <div className="text-[11px] font-bold text-[var(--hero-emerald)]">
                    {p.effet}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{p.texte}</p>
                </div>
              ))}
            </div>
          </Carte>
        </section>

        {/* 9. Combat */}
        <section className="space-y-3">
          <Titre id="combat" icone={Sword}>
            Le combat, assaut par assaut
          </Titre>
          <Carte className="space-y-3">
            <p className="text-sm">
              Quand le texte vous impose un combat, il vous donne l&apos;
              <strong>Habileté</strong> et l&apos;<strong>Endurance</strong> de
              l&apos;adversaire. Le but est de réduire son Endurance à zéro avant
              qu&apos;il ne réduise la vôtre. La séquence est toujours la même :
            </p>
            <ol className="space-y-2.5 text-sm">
              {[
                <>
                  <strong>Ajoutez</strong> à votre Habileté les points
                  supplémentaires donnés par vos Disciplines (Puissance Psychique
                  +2, Maîtrise des Armes +2) et par vos Objets Spéciaux (Bouclier
                  +2…).
                </>,
                <>
                  <strong>Soustrayez</strong> l&apos;Habileté de l&apos;adversaire
                  de ce total : le résultat est votre{" "}
                  <strong>Quotient d&apos;Attaque</strong>. Il peut être négatif.
                </>,
                <>
                  <strong>Tirez un nombre</strong> (0 à 9) à la Table de Hasard.
                </>,
                <>
                  <strong>Croisez</strong> le Quotient d&apos;Attaque et ce nombre
                  sur la <strong>Table des Coups Portés</strong> : la case indique
                  les points d&apos;Endurance perdus par chacun.
                </>,
                <>
                  <strong>Répétez</strong> les assauts jusqu&apos;à ce que l&apos;un
                  des deux combattants tombe à zéro.
                </>,
              ].map((li, i) => (
                <li key={i} className="flex gap-3">
                  <span className="inline-flex w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary items-center justify-center text-xs font-black shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm">{li}</span>
                </li>
              ))}
            </ol>
          </Carte>

          <Carte className="space-y-3 border-[var(--hero-gold)]/40">
            <div className="font-bold text-sm text-[var(--hero-gold)]">
              Exemple officiel, chiffre par chiffre
            </div>
            <p className="text-xs text-muted-foreground">
              Loup Solitaire a une Habileté de 15 et une Endurance de 23. Il possède
              la Puissance Psychique (+2) et la Maîtrise du Bâton ; il combat cette
              fois avec une hache, donc sans bonus de Maîtrise. Il affronte un
              Kraan, Habileté 16, Endurance 24.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-muted/40 p-2.5">
                15 + 2 (Puissance Psychique) = <strong>17</strong>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                17 − 16 = <strong>Quotient d&apos;Attaque +1</strong>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-separate border-spacing-1">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-bold">Assaut</th>
                    <th className="font-bold">Hasard</th>
                    <th className="font-bold">Kraan</th>
                    <th className="font-bold">Vous</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [1, 6, "24 − 9 = 15", "23 − 2 = 21"],
                    [2, 5, "15 − 8 = 7", "21 − 2 = 19"],
                    [3, 1, "7 − 4 = 3", "19 − 5 = 14"],
                    [4, 7, "3 − 10 = −7 → mort", "14 − 1 = 13"],
                  ].map((l) => (
                    <tr key={l[0]} className="text-center tabular-nums">
                      <td className="text-left text-muted-foreground">
                        Assaut {l[0]}
                      </td>
                      <td className="font-black text-[var(--hero-gold)]">{l[1]}</td>
                      <td>{l[2]}</td>
                      <td>{l[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Le Kraan tombe au quatrième assaut : le combat est gagné, votre
              Endurance est passée de 23 à 13. Vous pouvez alors boire une Potion
              de Laumspur pour reprendre 4 points.
            </p>
          </Carte>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Carte className="space-y-2">
              <div className="font-bold text-sm">Règles particulières</div>
              <Regle>
                <strong>Fuir :</strong> certains paragraphes vous autorisent à
                rompre le combat. Vous abandonnez alors la lutte avant d&apos;être
                mort — et le texte vous indique où aller.
              </Regle>
              <Regle>
                <strong>Combattre à plusieurs :</strong> si vous affrontez
                plusieurs adversaires à la fois, on additionne leurs Habiletés et
                leurs Endurances en un seul bloc (comme le fait le livre pour deux
                Giaks ou une meute de loups).
              </Regle>
              <Regle>
                <strong>Immunité psychique :</strong> certaines créatures sont
                insensibles à la Puissance Psychique : votre bonus de +2 est alors
                perdu. D&apos;autres attaquent votre esprit et vous infligent un
                malus d&apos;Habileté, sauf si vous possédez le Bouclier
                Psychique.
              </Regle>
            </Carte>

            <Carte className="space-y-2">
              <div className="font-bold text-sm">Encombrement et armes brisées</div>
              <Regle>
                Le Sac à Dos est limité à <strong>8 objets</strong>, les armes à{" "}
                <strong>2</strong>. Un objet de trop doit être abandonné.
              </Regle>
              <Regle>
                Si le texte vous annonce qu&apos;une arme est brisée ou volée,
                rayez-la de votre Feuille d&apos;Aventure — mais seuls deux armes
                peuvent être perdues de cette façon.
              </Regle>
              <Regle>
                Perdre son Sac à Dos, c&apos;est perdre tous ses Repas, ses potions
                et ses cordes d&apos;un seul coup. Certaines créatures du
                Roi-Sorcier ne s&apos;en privent pas.
              </Regle>
            </Carte>
          </div>
        </section>

        {/* 10. Table des coups portés */}
        <section className="space-y-3">
          <Titre id="table-combat" icone={Sword}>
            La Table des Coups Portés
          </Titre>
          <Carte>
            <p className="text-sm">
              C&apos;est le cœur du système de combat. En haut, les Quotients
              d&apos;Attaque ; sur le côté, le nombre tiré à la Table de Hasard.
              Chaque case contient deux nombres :{" "}
              <strong className="text-[var(--hero-emerald)]">
                les points perdus par l&apos;adversaire
              </strong>{" "}
              puis{" "}
              <strong className="text-red-400">ceux que vous perdez</strong>. Le
              tableau n&apos;est pas symétrique : à Quotient d&apos;Attaque 0,
              Loup Solitaire a déjà l&apos;avantage — c&apos;est ce qui lui permet
              d&apos;abattre des monstres bien plus forts que lui.
            </p>
          </Carte>
          <TableCoupsPortes />
        </section>

        {/* 11. Mourir */}
        <section className="space-y-3">
          <Titre id="mort" icone={Skull}>
            Mourir &amp; recommencer
          </Titre>
          <Carte>
            <Regle>
              Si votre Endurance tombe à <strong>zéro</strong>, votre mission
              s&apos;achève : vous êtes mort, et l&apos;aventure se termine là.
            </Regle>
            <Regle>
              Certaines cases de la Table des Coups Portés portent un{" "}
              <strong className="text-red-400">K</strong> : le coup est mortel,
              immédiatement, quel que soit le nombre de points qu&apos;il vous
              restait.
            </Regle>
            <Regle>
              Un livre dont vous êtes le héros se recommence souvent. Notez la fin
              que vous avez découverte, puis repartez du paragraphe 1 avec une
              nouvelle Feuille d&apos;Aventure : d&apos;autres chemins, et
              d&apos;autres fins, vous attendent.
            </Regle>
          </Carte>
        </section>

        {/* 12. Conseils */}
        <section className="space-y-3">
          <Titre id="conseils" icone={Lightbulb}>
            Conseils de survie
          </Titre>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                titre: "Le Sixième Sens et le Camouflage sauvent des vies",
                texte:
                  "Ce sont les deux Disciplines qui évitent le plus de combats. Éviter un combat vaut toujours mieux que le gagner de justesse.",
              },
              {
                titre: "Gardez toujours un Repas",
                texte:
                  "Un Repas en moins, c'est 3 points d'Endurance qui ne reviendront pas. La Chasse transforme cette contrainte en simple formalité.",
              },
              {
                titre: "Ne gardez pas vos potions pour plus tard",
                texte:
                  "Un héros mort avec trois potions dans le sac n'a rien gagné. Buvez-les dès que le texte le permet.",
              },
              {
                titre: "Lisez bien les choix",
                texte:
                  "Certains choix ne s'affichent que si vous possédez la bonne Discipline, l'objet adéquat — ou une gemme que vous auriez mieux fait de jeter.",
              },
            ].map((c) => (
              <Carte key={c.titre} className="space-y-1.5">
                <div className="font-bold text-sm">{c.titre}</div>
                <p className="text-xs text-muted-foreground">{c.texte}</p>
              </Carte>
            ))}
          </div>
        </section>

        {/* 13. Dans l'application */}
        <section className="space-y-3 pb-8">
          <Titre id="application" icone={BookOpen}>
            Comment ces règles sont appliquées ici
          </Titre>
          <Carte>
            <Regle>
              La <strong>Table de Hasard est numérique</strong> : elle est générée
              pour votre partie, et vous pouvez soit pointer une case vous-même,
              soit laisser le hasard choisir.
            </Regle>
            <Regle>
              La <strong>Feuille d&apos;Aventure se remplit toute seule</strong> :
              Habileté, Endurance, Sac à Dos, Bourse et Objets Spéciaux sont mis à
              jour à chaque paragraphe, avec les limites officielles (8 objets,
              2 armes, 50 Pièces d&apos;Or).
            </Regle>
            <Regle>
              Les <strong>combats sont résolus assaut par assaut</strong> avec la
              vraie Table des Coups Portés, y compris les « K » mortels, les
              immunités psychiques et les potions bues après le combat.
            </Regle>
            <Regle>
              La <strong>Guérison Kaï</strong> rend bien 1 point d&apos;Endurance
              par paragraphe traversé sans combat, et jamais au-delà de votre total
              de départ.
            </Regle>
          </Carte>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/jouer" className="flex-1">
              <Button size="lg" className="w-full font-bold gap-2 glow-purple">
                <Play className="w-4 h-4 fill-current" />
                Créer ma Feuille d&apos;Aventure
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button size="lg" variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
