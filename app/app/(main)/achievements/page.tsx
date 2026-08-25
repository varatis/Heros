import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, Trophy } from "lucide-react";
import GemIcon from "@/components/shared/GemIcon";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("reward_gems", { ascending: true });

  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user.id);

  const unlockedMap = new Set((userAchievements || []).map((ua) => ua.achievement_id));
  const totalAchievements = achievements?.length || 0;
  const unlockedCount = unlockedMap.size;
  const completionPct = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;
  const earnedGems =
    achievements
      ?.filter((achievement) => unlockedMap.has(achievement.id))
      .reduce((sum, achievement) => sum + (achievement.reward_gems || 0), 0) || 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-3 sm:py-5">
      <section className="premium-card relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
        <div className="absolute -right-14 -top-20 size-60 rounded-full bg-[--hero-gold]/16 blur-3xl" />
        <div className="absolute -bottom-24 left-8 size-56 rounded-full bg-primary/16 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div className="space-y-4">
            <Badge className="w-fit border border-[--hero-gold]/35 bg-[--hero-gold]/10 px-3 py-1 text-[--hero-gold]">
              <Trophy className="mr-1 size-3.5" /> Panthéon des héros
            </Badge>
            <div className="space-y-2">
              <h1 className="text-balance text-3xl font-black tracking-tight sm:text-5xl">
                Hauts faits & <span className="gradient-hero">récompenses</span>
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Accomplissez des exploits de lecture, découvrez des fins secrètes et transformez votre bravoure en gemmes gratuites.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/50 bg-background/28 p-4 backdrop-blur-md">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-black text-[--hero-gold]">{completionPct}%</div>
                <p className="text-xs font-semibold text-muted-foreground">collection débloquée</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 text-xl font-black tabular-nums text-foreground">
                  <GemIcon size="sm" title="" />
                  +{earnedGems}
                </div>
                <p className="text-xs font-semibold text-muted-foreground">déjà gagnées</p>
              </div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-[--hero-gold] to-[--hero-emerald] stat-bar-fill"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-bold text-muted-foreground">
              {unlockedCount} sur {totalAchievements} succès déverrouillés
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Collection</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Trophées du grimoire</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {achievements?.map((achievement) => {
            const isUnlocked = unlockedMap.has(achievement.id);

            return (
              <Card
                key={achievement.id}
                className={`overflow-hidden rounded-[1.5rem] p-0 transition-all ${
                  isUnlocked
                    ? "border-[--hero-gold]/40 bg-card/70 shadow-xl glow-gold"
                    : "border-border/50 bg-card/35 opacity-75"
                }`}
              >
                <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className={`grid size-14 shrink-0 place-items-center rounded-2xl border text-2xl shadow-inner ${
                        isUnlocked
                          ? "border-[--hero-gold]/40 bg-[--hero-gold]/15 text-[--hero-gold]"
                          : "border-border/55 bg-muted/45 text-muted-foreground"
                      }`}
                    >
                      {isUnlocked ? <Trophy className="size-7" /> : <Lock className="size-6" />}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black leading-tight sm:text-base">{achievement.name}</h4>
                        {isUnlocked && (
                          <Badge className="border border-[--hero-emerald]/30 bg-[--hero-emerald]/15 text-[10px] font-black text-[--hero-emerald]">
                            <Sparkles className="mr-1 size-3" /> Débloqué
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-foreground">
                      <GemIcon size="xs" title="" /> +{achievement.reward_gems}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
