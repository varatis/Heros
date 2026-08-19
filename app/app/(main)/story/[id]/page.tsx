import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Star,
  ArrowLeft,
  Play,
  RotateCcw,
  Lock,
} from "lucide-react";
import PurchaseStoryButton from "@/components/story/PurchaseStoryButton";

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Récupérer les infos de l'histoire
  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) notFound();

  // Récupérer la progression de l'utilisateur sur cette histoire
  const { data: progress } = await supabase
    .from("user_story_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", id)
    .single();

  // Solde de gemmes (pour le bouton d'achat si l'histoire est payante)
  const { data: wallet } = await supabase
    .from("wallets")
    .select("gems")
    .eq("user_id", user.id)
    .single();

  const isCompleted = progress?.is_completed;
  const hasStarted = !!progress && !!progress.current_node_id;
  // Histoire payante non déverrouillée -> afficher le flux d'achat
  const isLocked = !story.is_free && !progress?.is_purchased;
  const currentGems = wallet?.gems ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Bouton retour */}
      <Link
        href="/catalogue"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux aventures
      </Link>

      {/* Hero card de l'histoire */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Couverture / Illustration */}
          <div className="w-full sm:w-48 h-60 rounded-2xl bg-gradient-to-br from-primary/30 via-muted/50 to-muted/80 border border-border flex flex-col items-center justify-center p-4 relative overflow-hidden shrink-0 shadow-lg">
            <div className="text-5xl">📖</div>
            <div className="absolute bottom-3 flex items-center gap-1 text-[11px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              <span>~{story.estimated_playtime_min} min</span>
            </div>
          </div>

          {/* Informations principales */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="capitalize text-xs font-semibold">
                {story.genre}
              </Badge>
              {story.is_free ? (
                <Badge className="bg-[--hero-emerald]/20 text-[--hero-emerald] border-[--hero-emerald]/30 text-xs font-bold">
                  GRATUIT
                </Badge>
              ) : (
                <Badge className="bg-[--hero-gold]/20 text-[--hero-gold] border-[--hero-gold]/30 text-xs font-bold">
                  {story.price_gems} 💎
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold ml-auto">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Difficulté {story.difficulty}/5</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {story.title}
              </h1>
              {story.tagline && (
                <p className="text-sm font-medium text-primary mt-1">
                  {story.tagline}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {story.description}
            </p>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {story.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] text-muted-foreground/90 bg-muted/60 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistiques d'exploration de l'utilisateur */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/40">
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {progress?.completion_pct || 0}%
            </div>
            <div className="text-[11px] text-muted-foreground">Progression</div>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[--hero-gold]">
              {progress?.endings_found?.length || 0} / {story.total_endings || 2}
            </div>
            <div className="text-[11px] text-muted-foreground">Fins Découvertes</div>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[--hero-emerald]">
              {isCompleted ? "Accompli" : hasStarted ? "En cours" : "Non débuté"}
            </div>
            <div className="text-[11px] text-muted-foreground">Statut</div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isLocked ? (
            <>
              <div className="flex-1">
                <PurchaseStoryButton
                  storyId={story.id}
                  priceGems={story.price_gems ?? 0}
                  currentGems={currentGems}
                />
              </div>
              <div className="flex items-center gap-2 justify-center text-[11px] text-muted-foreground font-medium">
                <Lock className="w-3.5 h-3.5" />
                Aventure verrouillée
              </div>
            </>
          ) : (
            <>
              <Link href={`/story/${story.id}/play`} className="flex-1">
                <Button size="lg" className="w-full font-bold gap-2 text-sm glow-purple">
                  <Play className="w-4 h-4 fill-current" />
                  {hasStarted && !isCompleted
                    ? "Reprendre la partie"
                    : "Commencer l'aventure"}
                </Button>
              </Link>

              {hasStarted && (
                <Link href={`/story/${story.id}/play?reset=true`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto font-medium gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Recommencer à zéro
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
