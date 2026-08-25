import Link from "next/link";
import StoryCover from "@/components/story/StoryCover";
import { genreLabel } from "@/lib/stories";
import { ChevronRight } from "lucide-react";

export default function ContinueReading({
  storyId,
  slug,
  title,
  genre,
  tagline,
  progressPct,
}: {
  storyId: string;
  slug: string;
  title: string;
  genre: string;
  tagline?: string | null;
  progressPct: number;
}) {
  const pct = Math.min(100, Math.max(0, progressPct));

  return (
    <section className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Reprendre
      </p>
      <Link
        href={`/story/${storyId}/play`}
        className="group flex items-center gap-4 rounded-2xl outline-none touch-manipulation focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="book-cover relative w-[4.75rem] shrink-0 overflow-hidden aspect-[2/3] sm:w-24">
          <StoryCover
            slug={slug}
            title={title}
            priority
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h2 className="font-display text-xl leading-tight line-clamp-2 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {genreLabel(genre)}
            {tagline ? ` · ${tagline}` : ""}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-[--hero-gold]" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
          </div>
          <p className="mt-2 inline-flex items-center gap-0.5 text-sm font-medium text-primary">
            Continuer
            <ChevronRight className="size-4" />
          </p>
        </div>
      </Link>
    </section>
  );
}
