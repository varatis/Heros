import { createClient } from "@/lib/supabase/server";
import GuestRiskBanner from "@/components/auth/GuestRiskBanner";
import { isAnonymousUser } from "@/lib/auth/guest";
import BookCard from "@/components/story/BookCard";
import ContinueReading from "@/components/story/ContinueReading";
import { parseSealId } from "@/lib/seals";

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
  let readerSealId: ReturnType<typeof parseSealId> = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    readerSealId = parseSealId(profile?.avatar_url);

    const { data: progressData } = await supabase
      .from("user_story_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressData) {
      userProgress = Object.fromEntries(progressData.map((p) => [p.story_id, p]));
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

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-2 sm:py-4">
      {isAnonymousUser(user) && <GuestRiskBanner compact />}

      {inProgressStory && (
        <ContinueReading
          storyId={inProgressStory.id}
          slug={inProgressStory.slug}
          title={inProgressStory.title}
          genre={inProgressStory.genre}
          tagline={inProgressStory.tagline}
          progressPct={userProgress[inProgressStory.id]?.completion_pct || 0}
        />
      )}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-display text-2xl sm:text-3xl">
            {inProgressStory ? "Bibliothèque" : "Votre bibliothèque"}
          </h1>
          <span className="text-xs tabular-nums text-muted-foreground">
            {storyList.length} livre{storyList.length > 1 ? "s" : ""}
          </span>
        </div>

        {storyList.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Aucun livre pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5">
            {storyList.map((story, index) => (
              <BookCard
                key={story.id}
                story={story}
                progress={userProgress[story.id] ?? null}
                sealId={readerSealId}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
