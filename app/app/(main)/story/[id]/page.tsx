import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import PurchaseStoryButton from "@/components/story/PurchaseStoryButton";
import StoryCover from "@/components/story/StoryCover";
import BookCard from "@/components/story/BookCard";
import { catalogueHref, genreLabel, playtimeLabel } from "@/lib/stories";

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

  const { data: story } = await supabase.from("stories").select("*").eq("id", id).single();
  if (!story) notFound();

  const { data: progress } = await supabase
    .from("user_story_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", id)
    .maybeSingle();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("gems")
    .eq("user_id", user.id)
    .single();

  const isCompleted = Boolean(progress?.is_completed);
  const hasStarted = Boolean(progress?.current_node_id);
  const isLocked = !story.is_free && !progress?.is_purchased;
  const currentGems = wallet?.gems ?? 0;
  const progressPct = progress?.completion_pct || 0;
  const endingsFound = progress?.endings_found?.length || 0;
  const endingsTotal = story.total_endings || 2;

  const { data: sameTheme } = await supabase
    .from("stories")
    .select("id, slug, title, genre, is_free, price_gems, estimated_playtime_min")
    .eq("status", "published")
    .eq("genre", story.genre)
    .neq("id", story.id)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="mx-auto max-w-lg px-4 py-2 sm:py-4">
      <Link
        href="/catalogue"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground touch-manipulation"
      >
        <ArrowLeft className="size-4" />
        Bibliothèque
      </Link>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="book-cover relative w-36 overflow-hidden aspect-[2/3] sm:w-44">
          <StoryCover
            slug={story.slug}
            title={story.title}
            priority
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Link href={catalogueHref(story.genre)} className="hover:text-foreground">
            {genreLabel(story.genre)}
          </Link>
          <span className="mx-1.5 text-border">·</span>
          {playtimeLabel(story.estimated_playtime_min)}
          {story.difficulty ? (
            <>
              <span className="mx-1.5 text-border">·</span>
              {story.difficulty}/5
            </>
          ) : null}
        </p>

        <h1 className="mt-2 font-display text-3xl leading-tight text-balance sm:text-4xl">
          {story.title}
        </h1>
        {story.tagline && (
          <p className="mt-2 max-w-sm text-sm italic leading-6 text-muted-foreground">
            {story.tagline}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {isLocked ? (
          <PurchaseStoryButton
            storyId={story.id}
            priceGems={story.price_gems ?? 0}
            currentGems={currentGems}
            story={{
              slug: story.slug,
              title: story.title,
              tagline: story.tagline,
              genre: story.genre,
              estimated_playtime_min: story.estimated_playtime_min,
            }}
          />
        ) : (
          <Link href={`/story/${story.id}/play`} className="block">
            <Button size="lg" className="h-12 w-full rounded-xl text-sm font-semibold">
              <Play className="size-4 fill-current" />
              {hasStarted && !isCompleted
                ? "Continuer"
                : isCompleted
                  ? "Relire"
                  : "Ouvrir le livre"}
            </Button>
          </Link>
        )}

        {hasStarted && !isLocked && (
          <Link
            href={`/story/${story.id}/play?reset=true`}
            className="flex min-h-11 items-center justify-center gap-1.5 text-sm text-muted-foreground touch-manipulation"
          >
            <RotateCcw className="size-3.5" />
            Recommencer à zéro
          </Link>
        )}
      </div>

      {story.description && (
        <p className="mt-8 text-sm leading-7 text-muted-foreground">{story.description}</p>
      )}

      {story.tags && story.tags.length > 0 && (
        <p className="mt-4 text-xs leading-5 text-muted-foreground/80">
          {story.tags.join(" · ")}
        </p>
      )}

      {sameTheme && sameTheme.length > 0 && (
        <section className="mt-10 space-y-4 text-left">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl">Autres en {genreLabel(story.genre)}</h2>
            <Link
              href={catalogueHref(story.genre)}
              className="text-xs font-medium text-muted-foreground"
            >
              Voir le rayon
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {sameTheme.map((item) => (
              <BookCard key={item.id} story={item} />
            ))}
          </div>
        </section>
      )}

      {(hasStarted || isCompleted) && (
        <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 text-center">
          <div className="bg-background/70 px-2 py-3">
            <dt className="text-[11px] text-muted-foreground">Lu</dt>
            <dd className="mt-0.5 font-display text-xl tabular-nums">{progressPct}%</dd>
          </div>
          <div className="bg-background/70 px-2 py-3">
            <dt className="text-[11px] text-muted-foreground">Fins</dt>
            <dd className="mt-0.5 font-display text-xl tabular-nums">
              {endingsFound}/{endingsTotal}
            </dd>
          </div>
          <div className="bg-background/70 px-2 py-3">
            <dt className="text-[11px] text-muted-foreground">État</dt>
            <dd className="mt-0.5 font-display text-lg">
              {isCompleted ? "Terminé" : "En cours"}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}
