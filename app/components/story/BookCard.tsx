import Link from "next/link";
import StoryCover from "@/components/story/StoryCover";
import ReaderSeal from "@/components/shared/ReaderSeal";
import { genreLabel, playtimeLabel } from "@/lib/stories";
import type { SealId } from "@/lib/seals";
import { Lock } from "lucide-react";

export type BookCardStory = {
  id: string;
  slug: string;
  title: string;
  genre: string;
  is_free: boolean;
  price_gems: number | null;
  estimated_playtime_min: number | null;
};

export type BookCardProgress = {
  is_completed?: boolean;
  is_purchased?: boolean;
  completion_pct?: number;
} | null;

export default function BookCard({
  story,
  progress,
  sealId,
  priority = false,
}: {
  story: BookCardStory;
  progress?: BookCardProgress;
  sealId?: SealId | null;
  priority?: boolean;
}) {
  const isCompleted = Boolean(progress?.is_completed);
  const isLocked = !story.is_free && !progress?.is_purchased;
  const progressPct = Math.min(100, Math.max(0, progress?.completion_pct || 0));
  const showProgress = Boolean(progress) && !isCompleted && progressPct > 0;

  return (
    <Link
      href={`/story/${story.id}`}
      className="group block touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="book-cover relative aspect-[2/3] overflow-hidden">
        <StoryCover
          slug={story.slug}
          title={story.title}
          priority={priority}
          className="absolute inset-0 h-full w-full"
        />

        {isLocked && (
          <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-background/75 text-foreground backdrop-blur-sm">
            <Lock className="size-3.5" aria-hidden />
            <span className="sr-only">Verrouillé</span>
          </span>
        )}

        {isCompleted && sealId && (
          <span className="absolute bottom-2 right-2">
            <ReaderSeal id={sealId} size="xs" />
          </span>
        )}

        {showProgress && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
            <div
              className="h-full bg-[--hero-gold]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-0.5">
        <h3 className="font-display text-[15px] leading-snug line-clamp-2">
          {story.title}
        </h3>
        <p className="text-[11px] leading-4 text-muted-foreground">
          {genreLabel(story.genre)}
          <span className="mx-1 text-border">·</span>
          {playtimeLabel(story.estimated_playtime_min)}
          {isLocked && story.price_gems != null && (
            <>
              <span className="mx-1 text-border">·</span>
              {story.price_gems} 💎
            </>
          )}
          {isCompleted && (
            <>
              <span className="mx-1 text-border">·</span>
              Lu
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
