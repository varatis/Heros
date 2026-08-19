import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Sparkles, Star, Zap, ChevronRight, Lock } from "lucide-react";

export default async function CataloguePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Récupérer toutes les histoires publiées
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 2. Récupérer la progression de l'utilisateur
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

  // Trouver l'histoire en cours (la plus récemment jouée non terminée)
  const inProgressStory = stories?.find(
    (s) => userProgress[s.id] && !userProgress[s.id].is_completed
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Bannière Bienvenue / Continuer la lecture (inspiration Netflix / Duolingo) */}
      {inProgressStory ? (
        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-background to-background p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> En cours de lecture
              </div>
              <h2 className="text-2xl font-black">{inProgressStory.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                {inProgressStory.tagline || inProgressStory.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span>Progression : {userProgress[inProgressStory.id]?.completion_pct || 0}%</span>
                <span>•</span>
                <span>{inProgressStory.estimated_playtime_min} min</span>
              </div>
            </div>
            <Link href={`/story/${inProgressStory.id}/play`}>
              <Button size="lg" className="w-full md:w-auto font-bold gap-2 glow-purple">
                Reprendre l&apos;aventure <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-purple-900/30 via-background to-amber-900/20 p-6 md:p-8">
          <div className="max-w-xl space-y-3">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10">
              Bienvenue dans le multivers
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Prenez les rênes de votre <span className="gradient-hero">Destin</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explorez nos livres interactifs. Chaque décision teste votre bravoure, votre sagesse et débloque des fins inattendues.
            </p>
          </div>
        </section>
      )}

      {/* Catalogue des histoires */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Aventures Disponibles</h2>
            <p className="text-xs text-muted-foreground">Sélectionnez une quête pour commencer à jouer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories?.map((story) => {
            const progress = userProgress[story.id];
            const isCompleted = progress?.is_completed;
            const hasStarted = !!progress;

            return (
              <Card
                key={story.id}
                className="group overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between"
              >
                {/* Visual Header / Cover thumbnail */}
                <div className="relative h-44 bg-gradient-to-t from-background via-muted/40 to-muted/80 flex items-center justify-center p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-60 group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Genre & Price badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="capitalize text-[10px] font-semibold bg-background/80 backdrop-blur-md">
                      {story.genre}
                    </Badge>
                    {story.is_free ? (
                      <Badge className="bg-[--hero-emerald]/20 text-[--hero-emerald] border-[--hero-emerald]/30 text-[10px] font-bold">
                        GRATUIT
                      </Badge>
                    ) : (
                      <Badge className="bg-[--hero-gold]/20 text-[--hero-gold] border-[--hero-gold]/30 text-[10px] font-bold">
                        {story.price_gems} 💎
                      </Badge>
                    )}
                  </div>

                  {/* Difficulty stars */}
                  <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-md text-[10px] text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Diff. {story.difficulty}/5</span>
                  </div>

                  {/* Placeholder Book Icon / Illustration */}
                  <div className="text-center space-y-1 z-10">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      📖
                    </div>
                  </div>

                  {/* Duration footer on thumbnail */}
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-muted-foreground bg-background/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span>~{story.estimated_playtime_min || 15} min</span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {story.tagline || story.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {story.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <Link href={`/story/${story.id}`}>
                      <Button
                        variant={hasStarted ? "default" : "secondary"}
                        className="w-full font-bold gap-2 text-xs"
                      >
                        {isCompleted ? (
                          "Rejouer l'aventure"
                        ) : hasStarted ? (
                          "Continuer la quête"
                        ) : (
                          "Découvrir"
                        )}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
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
