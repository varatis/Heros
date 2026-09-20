import Link from "next/link";
import { BookOpen, Dices, Library, Shield, Sparkles, Swords } from "lucide-react";
import Reprendre from "@/components/lonewolf/Reprendre";

export const metadata = {
  title: "HeroBook — Les Livres dont Vous Êtes le Héros",
  description:
    "Jouez à Loup Solitaire, le livre-jeu interactif : Disciplines Kaï, Table de Hasard et Feuille d'Aventure.",
};

export default function AccueilPage() {
  return (
    <main className="app-page space-y-6">
      {/* ----- Héros immersif : 62dvh mobile, 72dvh desktop — on respire, on joue ----- */}
      <section className="hero-forest relative flex min-h-[62dvh] sm:min-h-[72dvh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a110d]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65"
          style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#070c0a] via-[#070c0a]/30 to-transparent"
          aria-hidden="true"
        />
        <div className="relative mt-auto space-y-5 p-6 pb-7 sm:p-10 sm:pb-9">
          <p className="pill pill-gold">
            <Sparkles size={13} />
            Livre-jeu interactif · 350 § · Table de Hasard officielle
          </p>
          <div className="max-w-xl space-y-3">
            <h1 className="font-serif text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl">
              La nuit tombe sur la sylve.{" "}
              <span className="font-normal italic text-[#dfbb78]">
                Votre aventure commence.
              </span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base">
              Dernier Seigneur Kaï du Sommerlund, rejoignez Holmgard à travers
              350 paragraphes de dangers, de magie et de combats.
            </p>
          </div>
          <div className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
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

      {/* ----- 3 promesses — Airbnb-style value props ----- */}
      <section className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Pourquoi Heros">
        <div className="card flex flex-col items-center gap-2 p-3 sm:p-4 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dfbb78]/10 border border-[#dfbb78]/20 text-[#dfbb78]"><BookOpen size={18} /></span>
          <p className="text-xs font-bold text-foreground leading-tight">Parchemin<br/><span className="font-normal text-muted-foreground">19px/1.9, 3 ambiances</span></p>
        </div>
        <div className="card flex flex-col items-center gap-2 p-3 sm:p-4 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Dices size={18} /></span>
          <p className="text-xs font-bold text-foreground leading-tight">Hasard<br/><span className="font-normal text-muted-foreground">Dé 0-9 fidèle Joe Dever</span></p>
        </div>
        <div className="card flex flex-col items-center gap-2 p-3 sm:p-4 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white"><Swords size={18} /></span>
          <p className="text-xs font-bold text-foreground leading-tight">Combat<br/><span className="font-normal text-muted-foreground">Vie/Armure/Attaque</span></p>
        </div>
      </section>

      {/* ----- Bento teaser : NOVA-9 + Succès ----- */}
      <section className="bento">
        <Link href="/catalogue?collection=scifi" className="bento-card bento-main group flex flex-col overflow-hidden">
          <div className="relative h-36 sm:h-48 overflow-hidden">
            <img src="/covers/signal-perdu-nova9.jpg" alt="NOVA-9 : Le Signal Perdu" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 pill pill-gold">Nouveau · SF</span>
          </div>
          <div className="p-4 space-y-1.5">
            <h3 className="font-serif text-lg font-bold">NOVA-9 : Le Signal Perdu</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">51 sections · 9 fins · 12 objets. Vaisseau à l&apos;abandon, IA EVA, conscience en dérive.</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#dfbb78]">Explorer <Shield size={14} /></span>
          </div>
        </Link>
        <Link href="/achievements" className="bento-card p-4 flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <p className="eyebrow">Progression</p>
            <h3 className="font-serif text-base font-bold">12 succès à débloquer</h3>
            <p className="text-xs text-muted-foreground">Médailles Kaï, fins secrètes, collection complète.</p>
          </div>
          <span className="btn btn-secondary btn-sm w-fit">Voir les succès</span>
        </Link>
        <Link href="/shop" className="tavern-sign p-4 flex items-center justify-between gap-3">
          <span>
            <span className="block text-sm font-bold">Taverne de Holmgard</span>
            <span className="block text-xs text-muted-foreground">3 packs de gemmes · Bonus taverne</span>
          </span>
          <span className="btn btn-primary btn-sm">Boutique</span>
        </Link>
      </section>
    </main>
  );
}
