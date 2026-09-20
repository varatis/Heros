import Link from "next/link";
import { Library, Sparkles } from "lucide-react";
import Reprendre from "@/components/lonewolf/Reprendre";

export const metadata = {
  title: "HeroBook — Les Livres dont Vous Êtes le Héros",
  description:
    "Jouez à Loup Solitaire, le livre-jeu interactif : Disciplines Kaï, Table de Hasard et Feuille d'Aventure.",
};

export default function AccueilPage() {
  return (
    <main className="app-page">
      {/* ----- Héros immersif plein écran : on respire, on joue ----- */}
      <section className="relative flex min-h-[80dvh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a110d]">
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
            Livre-jeu interactif
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
    </main>
  );
}
