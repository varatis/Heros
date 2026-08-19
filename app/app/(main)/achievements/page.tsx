import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, Lock, Sparkles, Gem } from "lucide-react";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Récupérer tous les succès disponibles
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("reward_gems", { ascending: true });

  // 2. Récupérer les succès débloqués par l'utilisateur
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user.id);

  const unlockedMap = new Set(
    (userAchievements || []).map((ua) => ua.achievement_id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header Succès */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-amber-900/20 via-background to-primary/20 p-6 md:p-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" /> Panthéon des Héros
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Hauts Faits & Récompenses</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Accomplissez des exploits au cours de vos lectures pour débloquer des gemmes gratuites.
        </p>

        {/* Compteur déblocage */}
        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary">
          <span>
            {unlockedMap.size} sur {achievements?.length || 0} succès déverrouillés
          </span>
        </div>
      </section>

      {/* Liste des cartes de succès */}
      <div className="space-y-3">
        {achievements?.map((achievement) => {
          const isUnlocked = unlockedMap.has(achievement.id);

          return (
            <Card
              key={achievement.id}
              className={`border-border/60 transition-all ${
                isUnlocked
                  ? "bg-card/90 border-[--hero-gold]/40 glow-gold"
                  : "bg-card/40 opacity-70"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                      isUnlocked
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isUnlocked ? "🏆" : "🔒"}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base">
                        {achievement.name}
                      </h4>
                      {isUnlocked && (
                        <Badge className="bg-[--hero-emerald]/20 text-[--hero-emerald] border-[--hero-emerald]/30 text-[10px]">
                          Débloqué
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Récompense en gemmes */}
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                    <Gem className="w-3 h-3" />
                    <span>+{achievement.reward_gems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
