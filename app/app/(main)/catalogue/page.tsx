import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpenText,
  ChevronRight,
  Clock,
  Crown,
  Gem,
  Lock,
  Shield,
  Sparkles,
  Star,
  Swords,
} from "lucide-react";

export default async function CataloguePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  let userProgress: Record<string, any> = {};
  if (user) {
    const { data: progressData } = await supabase
      .from("user_story_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressData) {
      userProgress = Object.fromEntries(
        progressData.map((p) => [p.story_id, p])
      );
    }
  }

  const storyList = stories || [];
  const inProgressStory = storyList
    .filter((story) => userProgress[story.id] && !userProgress[story.id].is_completed)
    .sort((a, b) => {
      const aDate = new Date(userProgress[a.id]?.last_played_at || 0).getTime();
      const bDate = new Date(userProgress[b.id]?.last_played_at || 0).getTime();
      return bDate - aDate;
    })[0];

  const completedCount = storyList.filter((story) => userProgress[story.id]?.is_completed).length;
  const premiumCount = storyList.filter((story) => !story.is_free).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-3 sm:py-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[linear-gradient(135deg,oklch(0.18_0.06_285/.96),oklch(0.12_0.035_285/.96)_46%,oklch(0.18_0.07_28/.88))] p-5 shadow-2xl sm:p-8">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 left-6 size-52 rounded-full bg-[--hero-gold]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,oklch(1_0_0/.12)_1px,transparent_0)] [background-size:22px_22px]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div className="space-y-5">
            <Badge className="w-fit border border-[--hero-gold]/35 bg-[--hero-gold]/10 px-3 py-1 text-[--hero-gold]">
              <Crown className="mr-1 size-3.5" /> Dark fantasy premium
            </Badge>

            {inProgressStory ? (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Dernière page ouverte
                </p>
                <h1 className="max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
                  Replongez dans <span className="gradient-hero">{inProgressStory.title}</span>
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {inProgressStory.tagline || inProgressStory.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-muted-foreground">
                  <span className="rounded-full border border-border/60 bg-background/35 px-3 py-1">
                    Progression {userProgress[inProgressStory.id]?.completion_pct || 0}%
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/35 px-3 py-1">
                    ~{inProgressStory.estimated_playtime_min || 15} min
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/35 px-3 py-1 capitalize">
                    {inProgressStory.genre}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Bibliothèque maudite
                </p>
                <h1 className="max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
                  Le plaisir d’un livre, <span className="gradient-hero">la tension d’un jeu</span>
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Lisez, choisissez, survivez. Chaque aventure mélange narration sombre, décisions décisives, inventaire, points de vie et fins à découvrir.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={inProgressStory ? `/story/${inProgressStory.id}/play` : storyList[0] ? `/story/${storyList[0].id}` : "#"}>
                <Button size="lg" className="h-11 w-full rounded-2xl px-5 font-black glow-purple sm:w-auto">
                  {inProgressStory ? "Reprendre l’aventure" : "Choisir un grimoire"}
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
              <Link href="/character">
                <Button variant="outline" size="lg" className="h-11 w-full rounded-2xl border-primary/25 bg-background/25 px-5 font-bold sm:w-auto">
                  Voir mon héros
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-border/50 bg-background/28 p-2 backdrop-blur-md lg:grid-cols-1">
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-gold]"><BookOpenText className="size-4" /><span className="text-xl font-black">{storyList.length}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">grimoires</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-emerald]"><Shield className="size-4" /><span className="text-xl font-black">{completedCount}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">terminés</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-primary"><Gem className="size-4" /><span className="text-xl font-black">{premiumCount}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">premium</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Catalogue</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Aventures disponibles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choisissez votre prochain livre-jeu dark fantasy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {storyList.map((story) => {
            const progress = userProgress[story.id];
            const isCompleted = progress?.is_completed;
            const hasStarted = !!progress;
            const isLocked = !story.is_free && !progress?.is_purchased;
            const progressPct = progress?.completion_pct || 0;

            return (
              <Card
                key={story.id}
                className="group overflow-hidden rounded-[1.75rem] border-border/55 bg-card/55 p-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10"
              >
                <div className="story-cover-bg relative h-56 overflow-hidden p-4">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,oklch(0.08_0.018_285/.88))]" />
                  <div className="absolute -right-12 top-8 size-32 rounded-full bg-primary/25 blur-3xl transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className="border border-white/10 bg-background/50 text-[10px] font-bold capitalize text-foreground backdrop-blur-md">
                        {story.genre}
                      </Badge>
                      {story.is_free ? (
                        <Badge className="border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[10px] font-black text-[--hero-emerald]">
                          Gratuit
                        </Badge>
                      ) : (
                        <Badge className="border border-[--hero-gold]/35 bg-[--hero-gold]/15 text-[10px] font-black text-[--hero-gold]">
                          {story.price_gems} 💎
                        </Badge>
                      )}
                    </div>
                    {isLocked && (
                      <div className="grid size-8 place-items-center rounded-full border border-[--hero-gold]/30 bg-background/55 text-[--hero-gold] backdrop-blur-md">
                        <Lock className="size-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-12 flex justify-center">
                    <div className="relative grid size-24 place-items-center rounded-[1.65rem] border border-primary/30 bg-background/35 shadow-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                      <div className="absolute inset-2 rounded-[1.25rem] border border-[--hero-gold]/20" />
                      <BookOpenText className="size-10 text-[--hero-gold] drop-shadow-[0_0_18px_var(--hero-gold)]" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2 text-[11px] font-bold text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/55 px-2.5 py-1 backdrop-blur-md">
                      <Clock className="size-3" /> ~{story.estimated_playtime_min || 15} min
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/55 px-2.5 py-1 text-amber-300 backdrop-blur-md">
                      <Star className="size-3 fill-amber-300" /> {story.difficulty}/5
                    </span>
                  </div>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <h3 className="line-clamp-2 flex-1 text-lg font-black leading-tight tracking-tight transition-colors group-hover:text-primary">
                        {story.title}
                      </h3>
                      {isCompleted && (
                        <Badge className="shrink-0 border border-[--hero-emerald]/30 bg-[--hero-emerald]/15 text-[10px] text-[--hero-emerald]">
                          Fini
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {story.tagline || story.description}
                    </p>
                  </div>

                  {hasStarted && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span>Lecture</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-[--hero-gold] stat-bar-fill"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {story.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-muted/50 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/story/${story.id}`} className="block">
                    <Button
                      variant={hasStarted ? "default" : "secondary"}
                      className="h-10 w-full rounded-2xl font-black"
                    >
                      {isLocked ? (
                        <><Lock className="size-4" /> Déverrouiller</>
                      ) : isCompleted ? (
                        <><Swords className="size-4" /> Rejouer</>
                      ) : hasStarted ? (
                        <><Sparkles className="size-4" /> Continuer</>
                      ) : (
                        <><BookOpenText className="size-4" /> Découvrir</>
                      )}
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
