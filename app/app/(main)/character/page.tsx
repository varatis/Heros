import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DailyRewardCard from "@/components/shared/DailyRewardCard";
import GuestRiskBanner from "@/components/auth/GuestRiskBanner";
import SignOutButton from "@/components/auth/SignOutButton";
import SealStudio from "@/components/character/SealStudio";
import { isAnonymousUser } from "@/lib/auth/guest";
import { getSealFromAvatar } from "@/lib/seals";
import type { ReactNode } from "react";
import { BookOpenText, Flame, Gem, Package } from "lucide-react";

export default async function CharacterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isGuest = isAnonymousUser(user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: rawInv } = await supabase
    .from("user_inventory")
    .select("*")
    .eq("user_id", user.id);

  let inventory: any[] = [];
  if (rawInv && rawInv.length > 0) {
    const itemIds = rawInv.map((i) => i.item_id);
    const { data: itemsList } = await supabase
      .from("items")
      .select("*")
      .in("id", itemIds);

    const itemsMap = new Map((itemsList || []).map((it) => [it.id, it]));
    inventory = rawInv.map((inv) => ({
      ...inv,
      items: itemsMap.get(inv.item_id) || null,
    }));
  }

  const { data: progressList } = await supabase
    .from("user_story_progress")
    .select("*")
    .eq("user_id", user.id);

  const completedStories = progressList?.filter((p) => p.is_completed).length || 0;
  const totalStoriesPlayed = progressList?.length || 0;
  const username = profile?.username || "Lecteur";
  const seal = getSealFromAvatar(profile?.avatar_url);
  const memberSince = new Date(profile?.created_at || Date.now()).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-4 sm:py-6">
      <section className="space-y-6">
        <div className="flex items-start gap-5">
          <SealStudio currentId={seal.id} completedStories={completedStories} />

          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <div>
              <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                {username}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sceau {seal.name} · depuis {memberSince}
              </p>
              <p className="mt-1 text-sm italic text-muted-foreground/90">{seal.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Gem className="size-3.5 text-[--hero-gold]" />
                {wallet?.gems || 0} gemmes
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flame className="size-3.5 text-orange-400" />
                {profile?.streak_days || 0} jour{(profile?.streak_days || 0) > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Touchez le sceau pour le changer. Terminez des livres pour en débloquer d’autres —
          il apparaît aussi sur les ouvrages achevés.
        </p>
      </section>

      {isGuest && <GuestRiskBanner />}

      <section className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60">
        <StatCell
          icon={<BookOpenText className="size-3.5" />}
          value={totalStoriesPlayed}
          label="ouverts"
        />
        <StatCell
          icon={<BookOpenText className="size-3.5" />}
          value={completedStories}
          label="terminés"
        />
        <StatCell
          icon={<Package className="size-3.5" />}
          value={inventory.length}
          label="objets"
        />
      </section>

      <DailyRewardCard
        streakDays={profile?.streak_days || 0}
        claimedToday={
          profile?.streak_last_at
            ? new Date(profile.streak_last_at).toISOString().slice(0, 10) ===
              new Date().toISOString().slice(0, 10)
            : false
        }
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Sacoche</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Objets trouvés en aventure — une sacoche par histoire.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{inventory.length}</span>
        </div>

        {inventory.length > 0 ? (
          <div className="space-y-2">
            {inventory.map((inv) => {
              const type = inv.items?.item_type;
              const emoji =
                type === "potion" ? "🧪" : type === "armor" ? "🛡️" : type === "weapon" ? "🗡️" : "✨";

              return (
                <Card
                  key={inv.id}
                  className="overflow-hidden rounded-2xl border-border/55 bg-card/40 p-0 shadow-none"
                >
                  <CardContent className="flex items-center gap-4 p-3.5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted/50 text-xl">
                      {emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate text-sm font-semibold">{inv.items?.name}</h4>
                        <Badge variant="outline" className="text-[10px] font-medium">
                          ×{inv.quantity}
                        </Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {inv.items?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Vide pour l’instant. Elle se remplit au fil de chaque aventure —
              chaque livre a sa propre sacoche.
            </p>
            <Link href="/catalogue" className="mt-2 inline-block text-sm font-medium text-primary">
              Ouvrir un livre
            </Link>
          </div>
        )}
      </section>

      <div className="flex justify-end pt-2">
        <SignOutButton isGuest={isGuest} />
      </div>
    </div>
  );
}

function StatCell({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-background/70 px-3 py-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground">{icon}</div>
      <div className="mt-1 font-display text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
