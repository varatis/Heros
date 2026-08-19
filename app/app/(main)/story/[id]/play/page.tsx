import { Suspense } from "react";
import { redirect } from "next/navigation";
import StoryPlayer from "@/components/story/StoryPlayer";
import { createClient } from "@/lib/supabase/server";
import { Loader2 } from "lucide-react";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Garde d'accès : une histoire payante non déverrouillée renvoie vers la
  // page de détail (flux d'achat). La donnée sensible is_purchased est écrite
  // uniquement par le serveur (RPC purchase_story) — ici on ne fait que lire.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: story } = await supabase
      .from("stories")
      .select("is_free")
      .eq("id", id)
      .single();
    const { data: progress } = await supabase
      .from("user_story_progress")
      .select("is_purchased")
      .eq("user_id", user.id)
      .eq("story_id", id)
      .maybeSingle();

    if (story && !story.is_free && !progress?.is_purchased) {
      redirect(`/story/${id}`);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <StoryPlayer storyId={id} />
    </Suspense>
  );
}
