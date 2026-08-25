"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReaderSeal from "@/components/shared/ReaderSeal";
import {
  STARTER_SEALS,
  encodeSeal,
  getSeal,
  isPlaceholderUsername,
  type SealId,
} from "@/lib/seals";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"name" | "seal">("name");
  const [heroName, setHeroName] = useState("");
  const [selectedSeal, setSelectedSeal] = useState<SealId>("lantern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      setIsGuest(Boolean(user.is_anonymous));

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled && profile?.username && !isPlaceholderUsername(profile.username)) {
        setHeroName(profile.username);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const seal = getSeal(selectedSeal);

  async function handleFinish() {
    const name = heroName.trim().replace(/\s+/g, " ");
    if (name.length < 2) return;
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await supabase.rpc("ensure_profile_and_wallet");
    } catch {
      // Migration 016 absente — on tente l'update quand même.
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: name,
        avatar_url: encodeSeal(selectedSeal),
      })
      .eq("id", user.id);

    if (profileError) {
      const msg = profileError.message.toLowerCase();
      setError(
        msg.includes("unique") || msg.includes("duplicate")
          ? "Ce nom est déjà pris. Choisissez-en un autre."
          : "Impossible d’enregistrer le profil."
      );
      setLoading(false);
      return;
    }

    router.push("/catalogue");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md space-y-10">
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            HeroBook
          </p>
          <h1 className="font-display text-4xl leading-[1.1] text-pretty sm:text-5xl">
            {step === "name" ? "Comment vous appeler ?" : "Choisissez votre sceau."}
          </h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            {step === "name"
              ? "Un seul nom, pour tous les livres. Guerrier, détective ou voyageur — ça, c’est l’histoire qui le décide."
              : "Pas une classe. Un ex-libris : il vous suit partout, et marque les livres que vous terminez."}
          </p>
        </header>

        {isGuest && (
          <p className="border-l-2 border-[--hero-gold]/50 pl-3 text-xs leading-5 text-muted-foreground">
            Mode invité — ce profil disparaît à la déconnexion. Créez un compte
            plus tard pour le garder.
          </p>
        )}

        {step === "name" && (
          <div className="space-y-3">
            <label htmlFor="hero-name" className="sr-only">
              Nom
            </label>
            <Input
              id="hero-name"
              placeholder="Votre nom"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              maxLength={24}
              autoFocus
              autoComplete="nickname"
              className="h-14 rounded-xl border-border/70 bg-background/40 text-center font-display text-2xl"
            />
            <p className="text-center text-[11px] text-muted-foreground">
              {heroName.trim().length}/24
            </p>
          </div>
        )}

        {step === "seal" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ReaderSeal id={selectedSeal} size="lg" />
              <div className="min-w-0">
                <p className="font-display text-2xl leading-none">{heroName.trim() || "Vous"}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Sceau {seal.name} — {seal.tagline}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {STARTER_SEALS.map((item) => {
                const active = selectedSeal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`seal-${item.id}`}
                    onClick={() => setSelectedSeal(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition-colors",
                      active
                        ? "border-primary/50 bg-primary/8"
                        : "border-border/50 bg-background/20 hover:border-border"
                    )}
                  >
                    <ReaderSeal id={item.id} size="md" />
                    <span className="text-[11px] font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] leading-5 text-muted-foreground">
              D’autres sceaux se débloquent en terminant des livres.
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          {step === "seal" && (
            <Button
              variant="outline"
              onClick={() => setStep("name")}
              className="h-12 flex-1 rounded-xl"
              id="onboarding-back"
            >
              Retour
            </Button>
          )}

          {step === "name" && (
            <Button
              className="h-12 flex-1 rounded-xl text-sm font-semibold"
              disabled={heroName.trim().length < 2}
              onClick={() => setStep("seal")}
              id="onboarding-next-name"
            >
              Continuer
            </Button>
          )}

          {step === "seal" && (
            <Button
              className="h-12 flex-1 rounded-xl text-sm font-semibold"
              disabled={loading}
              onClick={handleFinish}
              id="onboarding-finish"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Entrer dans la bibliothèque"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
