"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { BOOKMARKS, Bookmark, getRandomHeroName } from "@/lib/bookmarks";
import { saveLocalHeroProfile, getLocalHeroProfile } from "@/lib/hero-profile";
import BookmarkVisual from "@/components/shared/BookmarkVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Dices,
  BookOpen,
  Check,
  Shield,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"name" | "bookmark">("name");
  const [heroName, setHeroName] = useState("");
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark>(BOOKMARKS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si un profil existe déjà en mémoire, pré-remplir
    const saved = getLocalHeroProfile();
    if (saved.heroName && saved.heroName !== "Loup Solitaire") {
      setHeroName(saved.heroName);
    } else {
      setHeroName("Vaelin Ombresort");
    }
    const foundBookmark = BOOKMARKS.find((b) => b.id === saved.bookmarkId);
    if (foundBookmark) {
      setSelectedBookmark(foundBookmark);
    }
  }, []);

  function handleRollRandomName() {
    const random = getRandomHeroName();
    setHeroName(random);
  }

  async function handleFinish() {
    const finalName = heroName.trim();
    if (!finalName) {
      setError("Veuillez donner un nom à votre héros.");
      return;
    }

    setLoading(true);
    setError(null);

    // Sauvegarde locale universelle (fonctionne immédiatement même hors ligne)
    saveLocalHeroProfile(finalName, selectedBookmark.id);

    // Si Supabase est connecté, mettre à jour le profil de l'utilisateur
    if (supabaseConfigured) {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase
            .from("profiles")
            .update({
              username: finalName,
              avatar_url: selectedBookmark.id,
            })
            .eq("id", user.id);

          await supabase.auth.updateUser({
            data: {
              username: finalName,
              bookmark_id: selectedBookmark.id,
            },
          });
        }
      } catch (err) {
        console.warn("Mise à jour Supabase profil ignorée:", err);
      }
    }

    // Rediriger vers la bibliothèque avec animation fluide
    setTimeout(() => {
      router.push("/catalogue");
      router.refresh();
    }, 300);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 py-8 overflow-hidden">
      {/* Fond sombre nocturne de forêt féerique & mature */}
      <div className="absolute inset-0 bg-[#060907] -z-30" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 -z-20 scale-105"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060907]/75 to-[#050806] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-[#060907]/90 -z-10" />

      <div className="relative w-full max-w-2xl space-y-6 z-10">
        {/* Barre de rituel & étapes */}
        <div className="flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-2 text-[#dfbb78]">
            <BookOpen className="w-4 h-4" />
            <span className="font-serif tracking-widest uppercase text-[11px]">
              Rituel d&apos;Intronisation
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground text-[11px]">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full transition-colors",
                step === "name"
                  ? "bg-[#dfbb78] text-[#1b1509] font-bold"
                  : "bg-white/10 text-white/60"
              )}
            >
              1. Le Nom
            </span>
            <span className="text-white/30">―</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full transition-colors",
                step === "bookmark"
                  ? "bg-[#dfbb78] text-[#1b1509] font-bold"
                  : "bg-white/10 text-white/60"
              )}
            >
              2. Le Marque-Page
            </span>
          </div>
        </div>

        {/* ÉTAPE 1 : CHOISIR LE NOM DU HÉROS */}
        {step === "name" && (
          <section className="rounded-3xl p-6 sm:p-9 backdrop-blur-2xl bg-[#0c130f]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-7 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#dfbb78] font-semibold">
                Étape 1 sur 2
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow">
                Nommez votre héros
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Ce patronyme sera gravé sur votre feuille d&apos;aventure,
                dans les chroniques du monastère et au fil de chaque décision.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label
                  htmlFor="hero-name-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center"
                >
                  Identité du protagoniste
                </label>
                <div className="relative max-w-md mx-auto">
                  <Input
                    id="hero-name-input"
                    type="text"
                    placeholder="Ex: Aldric de Sommerlund"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    maxLength={28}
                    autoFocus
                    className="h-14 text-center font-serif text-xl sm:text-2xl bg-[#121c17] border-white/15 text-[#dfbb78] placeholder:text-muted-foreground/40 rounded-2xl focus:border-[#dfbb78] focus:ring-[#dfbb78]/20 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleRollRandomName}
                    title="Générer un nom aléatoire"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#dfbb78] transition-all hover:rotate-12 active:scale-95 cursor-pointer"
                  >
                    <Dices className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center max-w-md mx-auto px-2 text-[11px] text-muted-foreground">
                  <span>{heroName.length}/28 caractères</span>
                  <button
                    type="button"
                    onClick={handleRollRandomName}
                    className="text-[#dfbb78] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Inspirer un nom de légende
                  </button>
                </div>
              </div>

              {/* Aperçu de la plaque de parchemin */}
              <div className="max-w-md mx-auto p-4 rounded-2xl border border-[#dfbb78]/25 bg-gradient-to-b from-[#18231c]/80 to-[#0e1612]/90 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#dfbb78]/15 border border-[#dfbb78]/30 flex items-center justify-center text-2xl shrink-0">
                  🛡️
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Feuille d&apos;Aventure · Lecteur Kaï
                  </p>
                  <p className="font-serif text-lg font-bold text-foreground truncate">
                    {heroName.trim() || "Votre Héros"}
                  </p>
                  <p className="text-xs text-[#dfbb78]/90">
                    Défenseur du Sommerlund & Voyageur des 19 Royaumes
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  if (!heroName.trim()) {
                    setError("Veuillez renseigner un nom.");
                    return;
                  }
                  setError(null);
                  setStep("bookmark");
                }}
                disabled={!heroName.trim()}
                className="w-full h-12 bg-gradient-to-r from-[#dfbb78] via-[#e5c78f] to-[#cfab65] text-[#1b1509] font-bold text-sm tracking-wide rounded-xl shadow-[0_4px_20px_rgba(223,187,120,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Choisir mon marque-page</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </section>
        )}

        {/* ÉTAPE 2 : CHOISIR LE MARQUE-PAGE */}
        {step === "bookmark" && (
          <section className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#0c130f]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[#dfbb78] font-semibold">
                Étape 2 sur 2
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white drop-shadow">
                Choisissez votre marque-page
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Ce signet vous accompagnera d&apos;un paragraphe à l&apos;autre,
                gardant la trace de vos victoires et de vos replis dans la nuit.
              </p>
            </div>

            {/* Grille tactile des 6 marque-pages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {BOOKMARKS.map((b) => {
                const isSelected = selectedBookmark.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBookmark(b)}
                    className={cn(
                      "group relative p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col items-center justify-between cursor-pointer overflow-hidden",
                      isSelected
                        ? "bg-[#18231c] border-[#dfbb78] ring-2 ring-[#dfbb78]/40 shadow-[0_0_20px_rgba(223,187,120,0.25)] scale-[1.02]"
                        : "bg-[#101713]/80 border-white/10 hover:border-white/25 hover:bg-[#141d18]"
                    )}
                  >
                    {/* Indicateur de coche si sélectionné */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#dfbb78] text-[#1b1509] flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Visuel du marque-page */}
                    <div className="py-2">
                      <BookmarkVisual
                        bookmark={b}
                        size="sm"
                        selected={isSelected}
                        showTassel={false}
                      />
                    </div>

                    {/* Nom et rareté */}
                    <div className="w-full text-center mt-2 space-y-0.5">
                      <p className="font-serif text-xs font-bold text-foreground group-hover:text-[#dfbb78] transition-colors leading-tight">
                        {b.name}
                      </p>
                      <p
                        className="text-[10px] font-mono tracking-wider"
                        style={{ color: b.accentColor }}
                      >
                        {b.rarity}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fiche détaillée du marque-page choisi */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#121c17]/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-[#dfbb78] flex items-center gap-2">
                  <span>{selectedBookmark.iconEmoji}</span>
                  <span>{selectedBookmark.name}</span>
                </span>
                <span
                  className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-white/10"
                  style={{
                    backgroundColor: `${selectedBookmark.accentColor}20`,
                    color: selectedBookmark.accentColor,
                  }}
                >
                  {selectedBookmark.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedBookmark.lore}
              </p>
              <p
                className="text-xs italic font-serif pt-1"
                style={{ color: selectedBookmark.accentColor }}
              >
                {selectedBookmark.tagline}
              </p>
            </div>

            {/* Récapitulatif final */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#dfbb78]" />
                <span>
                  Héros : <strong className="text-foreground">{heroName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#dfbb78]" />
                <span>
                  Signet : <strong className="text-foreground">{selectedBookmark.name}</strong>
                </span>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            {/* Boutons retour / valider */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("name")}
                className="h-12 px-5 border-white/15 bg-white/5 hover:bg-white/10 text-foreground rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour</span>
              </Button>

              <Button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-[#dfbb78] via-[#e5c78f] to-[#cfab65] text-[#1b1509] font-bold text-sm tracking-wide rounded-xl shadow-[0_4px_25px_rgba(223,187,120,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1b1509]" />
                    <span>Scellage de votre tome...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Ouvrir ma bibliothèque</span>
                    <Sparkles className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
