import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Store,
  Sparkles,
  Swords,
  Scroll,
  Library,
  Flame,
} from "lucide-react";
import { getLibrary, LIVRE_DECOUVERTE, canRead } from "@/lib/library";
import { LDVELH_COLLECTIONS } from "@/lib/ldvelh-collections";
import Reprendre from "@/components/lonewolf/Reprendre";

export const metadata = {
  title: "HeroBook — Les Livres dont Vous Êtes le Héros",
  description: "Portail dark fantasy des 19 bibliothèques LDVELH. Lisez les aventures dans la forêt nocturne et forgez votre légende.",
};

export default async function AccueilPage() {
  const { livres, owned, user } = await getLibrary();
  const book = livres.find((l) => l.slug === LIVRE_DECOUVERTE.slug);

  return (
    <main className="page-width space-y-12 py-6">
      {/* SECTION HÉROS IMMERSIVE : LE LECTEUR DANS LA FORÊT LA NUIT */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a110d] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Image d'arrière-plan avec fondu dark fantasy */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070c0a] via-[#070c0a]/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070c0a] via-transparent to-[#070c0a]/70 z-10" />

        <div className="relative z-20 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#dfbb78]/30 backdrop-blur-md text-[#dfbb78] text-xs font-semibold">
            <Sparkles size={13} className="text-[#dfbb78]" />
            <span className="tracking-widest uppercase text-[11px]">
              Expérience Dark Fantasy 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            La nuit tombe sur la sylve.{" "}
            <span className="text-[#dfbb78] italic font-normal">
              Votre aventure commence.
            </span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-serif italic">
            « Seul au pied de l&apos;arbre millénaire, les pages de cuir et de
            parchemin s&apos;illuminent d&apos;une douce lueur arcanique.
            Chaque décision que vous prendrez scellera le sort du royaume. »
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/catalogue"
              className="action-link h-12 px-7 text-sm font-bold shadow-[0_4px_25px_rgba(223,187,120,0.35)]"
            >
              <Library size={18} />
              <span>Ouvrir ma bibliothèque</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/onboarding"
              className="action-link action-secondary h-12 px-5 text-sm"
            >
              <Compass size={17} />
              <span>Créer mon héros & marque-page</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TOME EN VEDETTE : LOUP SOLITAIRE 01 (JOUABLE DIRECTEMENT) */}
      <section className="relative overflow-hidden rounded-3xl border border-[#dfbb78]/30 bg-[#0e1612]/90 p-7 sm:p-10 shadow-2xl grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div className="space-y-5">
          <p className="eyebrow flex items-center gap-2">
            <span className="w-5 h-px bg-[#dfbb78]" />
            Aventure Interactive Jouable · Loup Solitaire
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            Les Maîtres des Ténèbres
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Le monastère Kaï a été anéanti durant la nuit par les hordes de
            Kraans et de Giaks. Vous êtes le dernier des Seigneurs Kaï du
            Sommerlund. Trois cents kilomètres de forêts et de terres hostiles
            vous séparent du Roi.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#dfbb78]/15 border border-[#dfbb78]/30 text-[#dfbb78] font-semibold">
              Moteur Kaï interactif
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              Table de Hasard
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              Feuille d&apos;Aventure
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              Gratuit & accessible
            </span>
          </div>

          <div className="pt-2">
            {book && canRead(book, owned) ? (
              <Reprendre />
            ) : (
              <Link href="/jouer" className="action-link">
                <Swords size={18} />
                <span>Commencer l&apos;aventure</span>
                <ArrowRight size={17} />
              </Link>
            )}
          </div>
        </div>

        {/* Couverture originale */}
        <figure className="relative aspect-[3/4] max-h-[380px] mx-auto rounded-2xl overflow-hidden border border-white/15 bg-[#090f0c] shadow-2xl">
          <img
            src="/lonewolf/pdf/originals/p001-x4.png"
            alt="Couverture originale Les Maîtres des Ténèbres"
            className="w-full h-full object-contain p-3"
          />
        </figure>
      </section>

      {/* APERÇU DES 19 BIBLIOTHÈQUES DU PROJET */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow flex items-center gap-2">
              <span className="w-4 h-px bg-[#dfbb78]" />
              Le Panthéon des Livres dont Vous Êtes le Héros
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Les 19 Bibliothèques d&apos;Aventure
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="text-xs text-[#dfbb78] hover:underline font-semibold flex items-center gap-1.5"
          >
            <span>Explorer les 170 tomes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grille des séries principales */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LDVELH_COLLECTIONS.slice(0, 6).map((col) => (
            <Link
              key={col.id}
              href={`/catalogue?collection=${col.id}`}
              className="group p-5 rounded-2xl border border-white/[0.08] bg-[#0d1511]/80 hover:bg-[#121c16] hover:border-[#dfbb78]/40 transition-all flex flex-col justify-between gap-3 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.accent }}
                  />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#dfbb78]">
                    {col.totalBooks} tomes
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-[#dfbb78] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-muted-foreground">
                <span>{col.author}</span>
                <span className="text-[#dfbb78] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/catalogue"
            className="action-link action-secondary text-xs h-10 px-6 inline-flex"
          >
            <span>Voir les 19 séries (Sorcellerie, Loup Ardent, Quête du Graal...)</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* RITUEL D'INSCRIPTION & MARQUE-PAGE */}
      <section className="rounded-3xl p-6 sm:p-10 border border-[#dfbb78]/25 bg-gradient-to-r from-[#121d17] to-[#0c1410] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <p className="eyebrow">Votre Identité de Lecteur</p>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Nommez votre héros et choisissez votre marque-page
          </h3>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Un processus épuré et immersif : scellez votre nom, adoptez votre
            signet de légende (Ruban de sang, Plume de corbeau, Signet Kaï...)
            et plongez dans les récits.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="action-link h-11 px-6 shrink-0 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles size={15} />
          <span>Commencer le rituel</span>
        </Link>
      </section>
    </main>
  );
}

function ChevronRight({ size = 16 }: { size?: number }) {
  return <ArrowRight size={size} />;
}
