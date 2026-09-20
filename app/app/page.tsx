import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Library,
  Sparkles,
  Swords,
} from "lucide-react";
import Reprendre from "@/components/lonewolf/Reprendre";

export const metadata = {
  title: "HeroBook — Les Livres dont Vous Êtes le Héros",
  description:
    "Jouez à Loup Solitaire, le livre-jeu interactif : Disciplines Kaï, Table de Hasard et Feuille d'Aventure.",
};

export default function AccueilPage() {
  return (
    <main className="app-page space-y-10">
      {/* ----- Héros : un seul message, une seule action ----- */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a110d]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#070c0a] via-[#070c0a]/70 to-[#070c0a]/30"
          aria-hidden="true"
        />
        <div className="relative space-y-5 p-6 sm:p-10">
          <p className="pill pill-gold">
            <Sparkles size={13} />
            Livre-jeu interactif
          </p>
          <div className="max-w-xl space-y-3">
            <h1 className="font-serif text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              La nuit tombe sur la sylve.{" "}
              <span className="font-normal italic text-[#dfbb78]">
                Votre aventure commence.
              </span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-white/70">
              Dernier Seigneur Kaï du Sommerlund, rejoignez Holmgard à travers
              350 paragraphes de dangers, de magie et de combats.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Reprendre />
            <Link
              href="/catalogue"
              className="btn btn-secondary w-full sm:w-auto"
            >
              <Library size={18} />
              Explorer
            </Link>
          </div>
        </div>
      </section>

      {/* ----- Le livre jouable, en une carte ----- */}
      <section aria-labelledby="tome-vedette" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2
            id="tome-vedette"
            className="font-serif text-xl font-bold text-foreground sm:text-2xl"
          >
            À jouer maintenant
          </h2>
          <Link
            href="/regles"
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#dfbb78] hover:underline"
          >
            <BookOpen size={14} />
            Règles Kaï
          </Link>
        </div>
        <article className="card card-gold flex gap-4 p-4 sm:items-center sm:gap-6 sm:p-6">
          <div className="w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#090f0c] sm:w-32">
            <img
              src="/lonewolf/pdf/originals/p001-x4.png"
              alt="Couverture : Les Maîtres des Ténèbres"
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-2.5">
            <p className="pill pill-green">
              <Swords size={13} />
              Moteur Kaï complet
            </p>
            <h3 className="font-serif text-lg font-bold leading-snug text-white sm:text-2xl">
              Loup Solitaire 01 · Les Maîtres des Ténèbres
            </h3>
            <p className="hidden text-sm leading-relaxed text-muted-foreground sm:block">
              Le monastère Kaï a brûlé. Trois cents kilomètres de terres
              hostiles vous séparent du Roi — et seule votre Feuille
              d&apos;Aventure vous garde en vie.
            </p>
            <div className="pt-1">
              <Reprendre compact />
            </div>
          </div>
        </article>
      </section>

      {/* ----- Rituel du héros : une ligne, pas une section ----- */}
      <Link
        href="/onboarding"
        className="card group flex items-center gap-4 p-4 transition-colors hover:border-[#dfbb78]/40 sm:p-5"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#dfbb78]/30 bg-[#dfbb78]/10 text-xl">
          🛡️
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-foreground">
            Nommez votre héros
          </span>
          <span className="block truncate text-[13px] text-muted-foreground">
            Choisissez votre marque-page et scellez votre légende
          </span>
        </span>
        <ChevronRight
          size={20}
          className="shrink-0 text-[#dfbb78] transition-transform group-hover:translate-x-1"
        />
      </Link>
    </main>
  );
}
