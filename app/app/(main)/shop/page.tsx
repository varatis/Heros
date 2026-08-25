import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ShopClient from "@/components/shop/ShopClient";
import GuestRiskBanner from "@/components/auth/GuestRiskBanner";
import GemIcon from "@/components/shared/GemIcon";
import { isAnonymousUser } from "@/lib/auth/guest";

export default async function ShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: gemPacks } = await supabase
    .from("gem_packs")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  // Boutique = achat d'histoires (+ recharges gemmes). Pas d'objets / potions :
  // chaque aventure a sa propre sacoche remplie en jouant.
  const { data: stories } = await supabase
    .from("stories")
    .select(
      "id, slug, title, tagline, genre, is_free, price_gems, estimated_playtime_min, status"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const { data: progressData } = await supabase
    .from("user_story_progress")
    .select("story_id, is_purchased")
    .eq("user_id", user.id);

  const purchasedIds = new Set(
    (progressData || []).filter((p) => p.is_purchased).map((p) => p.story_id)
  );

  const shopStories = (stories || []).map((story) => ({
    id: story.id,
    slug: story.slug,
    title: story.title,
    tagline: story.tagline,
    genre: story.genre,
    is_free: story.is_free,
    price_gems: story.price_gems,
    estimated_playtime_min: story.estimated_playtime_min,
    is_purchased: purchasedIds.has(story.id),
  }));

  const lockedCount = shopStories.filter((s) => !s.is_free && !s.is_purchased).length;
  const gems = wallet?.gems ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-7 px-4 py-2 sm:py-4">
      <header className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">Boutique</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Achetez des histoires et rechargez vos gemmes.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5">
              <GemIcon size="md" title="" />
              <span className="font-display text-xl tabular-nums leading-none text-foreground">
                {gems.toLocaleString("fr-FR")}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {lockedCount > 0
                ? `${lockedCount} livre${lockedCount > 1 ? "s" : ""} à débloquer`
                : "votre bourse"}
            </p>
          </div>
        </div>
      </header>

      {isAnonymousUser(user) && <GuestRiskBanner compact />}

      <ShopClient
        gemPacks={gemPacks || []}
        stories={shopStories}
        currentGems={gems}
        isGuest={isAnonymousUser(user)}
      />
    </div>
  );
}
