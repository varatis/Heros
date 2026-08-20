"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronRight, Sword, Shield, Zap, Heart, Star, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Classes de personnage disponibles
const CHARACTER_CLASSES = [
  {
    id: "warrior",
    name: "Guerrier",
    emoji: "⚔️",
    description: "Force brute et endurance légendaire.",
    stats: { hp: 15, strength: 8, agility: 4, luck: 3, charisma: 4 },
    color: "--hero-crimson",
    icon: Sword,
  },
  {
    id: "ranger",
    name: "Rôdeur",
    emoji: "🏹",
    description: "Agile et précis, maître de l'ombre.",
    stats: { hp: 10, strength: 5, agility: 9, luck: 6, charisma: 4 },
    color: "--hero-emerald",
    icon: Zap,
  },
  {
    id: "mage",
    name: "Mage",
    emoji: "🔮",
    description: "Puissance arcanique et sagesse ancienne.",
    stats: { hp: 8, strength: 3, agility: 5, luck: 7, charisma: 7 },
    color: "--hero-purple",
    icon: Wand2,
  },
  {
    id: "paladin",
    name: "Paladin",
    emoji: "🛡️",
    description: "Foi inébranlable et lame sacrée.",
    stats: { hp: 12, strength: 6, agility: 4, luck: 5, charisma: 8 },
    color: "--hero-gold",
    icon: Shield,
  },
] as const;

type CharacterClass = typeof CHARACTER_CLASSES[number];

// Avatars (emojis pour l'instant, remplacés par des illustrations plus tard)
const AVATARS = ["🧙", "⚔️", "🏹", "🛡️", "👑", "🐉", "⚡", "🌙", "🔥", "💎"];

const STAT_ICONS: Record<string, typeof Heart> = {
  hp: Heart,
  strength: Sword,
  agility: Zap,
  luck: Star,
  charisma: Shield,
};
const STAT_LABELS: Record<string, string> = {
  hp: "PV",
  strength: "Force",
  agility: "Agilité",
  luck: "Chance",
  charisma: "Charisme",
};

function StatBar({ label, value, max = 15, icon: Icon, color }: {
  label: string; value: number; max?: number; icon: typeof Heart; color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: `var(${color})` }} />
      <span className="text-xs text-muted-foreground w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full stat-bar-fill"
          style={{
            width: `${(value / max) * 100}%`,
            backgroundColor: `var(${color})`,
          }}
        />
      </div>
      <span className="text-xs font-mono w-4 text-right">{value}</span>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"class" | "name" | "avatar">("class");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [heroName, setHeroName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = step === "class" ? 33 : step === "name" ? 66 : 100;

  async function handleFinish() {
    if (!selectedClass || !heroName.trim()) return;
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Mettre à jour le profil avec le nom du héros et l'avatar
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: heroName.trim(),
        avatar_url: null, // sera une vraie URL plus tard
      })
      .eq("id", user.id);

    if (profileError) {
      setError("Erreur lors de la création du profil.");
      setLoading(false);
      return;
    }

    router.push("/catalogue");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="fixed inset-0 gradient-reading-bg pointer-events-none" />
      <div className="pointer-events-none fixed -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-28 left-4 size-72 rounded-full bg-[--hero-gold]/10 blur-3xl" />

      <div className="relative w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-primary">
            Création du personnage
          </p>
          <h1 className="text-balance text-3xl font-black tracking-tight sm:text-5xl">
            {step === "class" && "Choisissez votre classe"}
            {step === "name" && "Donnez un nom à votre héros"}
            {step === "avatar" && "Choisissez votre avatar"}
          </h1>
        </div>

        {/* Barre de progression */}
        <div className="h-2 overflow-hidden rounded-full border border-border/50 bg-muted/60 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-[--hero-gold] to-[--hero-emerald] stat-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Étape 1 — Classe */}
        {step === "class" && (
          <div className="grid grid-cols-2 gap-3">
            {CHARACTER_CLASSES.map((cls) => {
              const isSelected = selectedClass?.id === cls.id;
              const Icon = cls.icon;
              return (
                <button
                  key={cls.id}
                  id={`class-${cls.id}`}
                  onClick={() => setSelectedClass(cls)}
                  className={cn(
                    "premium-card rounded-[1.5rem] p-4 text-left space-y-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50",
                    isSelected && "ring-2 ring-primary border-primary/50 scale-[1.02] glow-purple"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cls.emoji}</span>
                    <Icon className="w-4 h-4" style={{ color: `var(${cls.color})` }} />
                  </div>
                  <div>
                    <div className="font-semibold">{cls.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cls.description}</div>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(cls.stats).slice(0, 3).map(([key, val]) => {
                      const Icon2 = STAT_ICONS[key] ?? Heart;
                      return (
                        <StatBar
                          key={key}
                          label={STAT_LABELS[key]}
                          value={val}
                          icon={Icon2}
                          color={cls.color}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Étape 2 — Nom */}
        {step === "name" && selectedClass && (
          <div className="premium-card rounded-[1.75rem] p-6 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <span className="text-4xl">{selectedClass.emoji}</span>
              <div>
                <div className="font-bold text-lg">{selectedClass.name}</div>
                <div className="text-sm text-muted-foreground">{selectedClass.description}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hero-name" className="text-sm font-medium">
                Nom du héros
              </label>
              <Input
                id="hero-name"
                placeholder="Entrez votre nom légendaire…"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                maxLength={20}
                autoFocus
                className="h-12 rounded-2xl text-center text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground text-center">
                {heroName.length}/20 caractères
              </p>
            </div>

            {/* Stats complètes */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Statistiques de départ
              </p>
              {Object.entries(selectedClass.stats).map(([key, val]) => {
                const Icon = STAT_ICONS[key] ?? Heart;
                return (
                  <StatBar
                    key={key}
                    label={STAT_LABELS[key]}
                    value={val}
                    icon={Icon}
                    color={selectedClass.color}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Étape 3 — Avatar */}
        {step === "avatar" && (
          <div className="premium-card rounded-[1.75rem] p-6 space-y-6">
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  id={`avatar-${avatar}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={cn(
                    "h-14 w-full rounded-2xl border-2 text-3xl transition-all hover:scale-110",
                    selectedAvatar === avatar
                      ? "border-primary bg-primary/15 scale-110 glow-purple"
                      : "border-border/60 bg-muted/30"
                  )}
                >
                  {avatar}
                </button>
              ))}
            </div>

            {/* Aperçu du personnage */}
            <div className="rounded-2xl border border-border/60 bg-background/35 p-4 flex items-center gap-4">
              <div className="text-5xl">{selectedAvatar}</div>
              <div>
                <div className="font-bold text-lg">{heroName || "Votre héros"}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedClass?.name} · 50 💎 de bienvenue
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step !== "class" && (
            <Button
              variant="outline"
              onClick={() => setStep(step === "name" ? "class" : "name")}
              className="h-11 flex-1 rounded-2xl font-bold"
              id="onboarding-back"
            >
              Retour
            </Button>
          )}

          {step === "class" && (
            <Button
              className="h-11 flex-1 gap-2 rounded-2xl font-black"
              disabled={!selectedClass}
              onClick={() => setStep("name")}
              id="onboarding-next-class"
            >
              Continuer <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {step === "name" && (
            <Button
              className="h-11 flex-1 gap-2 rounded-2xl font-black"
              disabled={heroName.trim().length < 2}
              onClick={() => setStep("avatar")}
              id="onboarding-next-name"
            >
              Continuer <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {step === "avatar" && (
            <Button
              className="h-11 flex-1 gap-2 rounded-2xl font-black"
              disabled={loading}
              onClick={handleFinish}
              id="onboarding-finish"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Commencer l&apos;aventure ! ✨</>
              )}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
