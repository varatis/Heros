import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DailyRewardCard from "@/components/shared/DailyRewardCard";
import GuestRiskBanner from "@/components/auth/GuestRiskBanner";
import { isAnonymousUser } from "@/lib/auth/guest";
import {
  BookOpenText,
  Flame,
  Gem,
  Heart,
  LogOut,
  Package,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

export default async function CharacterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  const { calculateInventoryBonuses } = await import("@/lib/game-engine/stats");
  const gearBonuses = calculateInventoryBonuses(inventory);

  const baseStrength = 5 + (gearBonuses.strength || 0);
  const baseLuck = 5 + (gearBonuses.luck || 0);
  const baseHpMax = 10 + (gearBonuses.hp_max || 0);
  const username = profile?.username || "Héros Légendaire";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-3 sm:py-5">
      <section className="premium-card relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
        <div className="absolute -right-16 -top-16 size-60 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute -bottom-24 left-8 size-56 rounded-full bg-[--hero-emerald]/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative grid size-28 shrink-0 place-items-center rounded-[2rem] border-2 border-primary/45 bg-gradient-to-br from-primary/30 to-[--hero-gold]/15 text-5xl shadow-2xl">🧙‍♂️
              <span className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border border-[--hero-gold]/35 bg-background text-[--hero-gold]">
                <Trophy className="size-4" />
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-balance text-3xl font-black tracking-tight sm:text-5xl">
                    {username}
                  </h1>
                  <Badge className="border border-primary/30 bg-primary/15 text-xs font-black text-primary">
                    Niveau 1 · Aventurier
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Membre depuis le {new Date(profile?.created_at || Date.now()).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-3 py-1.5 text-xs font-black text-[--hero-gold]">
                  <Gem className="size-3.5" /> {wallet?.gems || 0} gemmes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-300">
                  <Flame className="size-3.5 fill-orange-500 text-orange-500" /> {profile?.streak_days || 0} jours
                </span>
                <Link href="/catalogue">
                  <Button variant="outline" size="sm" className="rounded-full border-primary/25 bg-background/25 text-xs font-bold">
                    <BookOpenText className="size-3.5" /> Lire
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-border/50 bg-background/28 p-2 backdrop-blur-md lg:grid-cols-1">
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-primary"><BookOpenText className="size-4" /><span className="text-xl font-black">{totalStoriesPlayed}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">quêtes</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-emerald]"><Trophy className="size-4" /><span className="text-xl font-black">{completedStories}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">achevées</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-gold]"><Package className="size-4" /><span className="text-xl font-black">{inventory.length}</span></div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">objets</p>
            </div>
          </div>
        </div>
      </section>

      {isAnonymousUser(user) && <GuestRiskBanner />}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={<Heart className="size-5 fill-red-400 text-red-400" />} label="PV Max" value={baseHpMax} hint={gearBonuses.hp_max ? `+${gearBonuses.hp_max} équipement` : "Base"} />
        <StatCard icon={<Sword className="size-5 text-amber-300" />} label="Force" value={baseStrength} hint={gearBonuses.strength ? `+${gearBonuses.strength} arme` : "Base"} />
        <StatCard icon={<Sparkles className="size-5 text-[--hero-gold]" />} label="Chance" value={baseLuck} hint={gearBonuses.luck ? `+${gearBonuses.luck} relique` : "Base"} />
      </section>

      <DailyRewardCard
        streakDays={profile?.streak_days || 0}
        claimedToday={
          profile?.streak_last_at
            ? new Date(profile.streak_last_at).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
            : false
        }
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Sacoche</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Inventaire du héros</h2>
            <p className="mt-1 text-sm text-muted-foreground">Objets utilisables pendant les histoires ou bonus passifs d’équipement.</p>
          </div>
          <span className="rounded-full border border-border/50 bg-muted/35 px-3 py-1 text-xs font-bold text-muted-foreground">
            {inventory.length} objet(s)
          </span>
        </div>

        {inventory.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {inventory.map((inv) => {
              const type = inv.items?.item_type;
              const emoji = type === "potion" ? "🧪" : type === "armor" ? "🛡️" : type === "weapon" ? "🗡️" : "✨";

              return (
                <Card key={inv.id} className="overflow-hidden rounded-[1.5rem] border-border/55 bg-card/55 p-0 shadow-lg">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-2xl shadow-inner">
                      {emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate text-sm font-black">{inv.items?.name}</h4>
                        <Badge variant="outline" className="text-[10px] font-black">x{inv.quantity}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{inv.items?.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-[1.5rem] border-dashed p-8 text-center">
            <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-muted/45 text-2xl">🎒</div>
            <p className="text-sm text-muted-foreground">
              Votre sacoche est vide. Visitez la boutique ou découvrez des trésors lors de vos aventures.
            </p>
          </div>
        )}
      </section>

      <div className="flex justify-end pt-2">
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="size-3.5" /> Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="glass-card rounded-[1.5rem] p-4 text-center">
      <div className="mx-auto mb-2 grid size-10 place-items-center rounded-2xl bg-muted/40">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div className="mt-1 text-[10px] text-muted-foreground/80">{hint}</div>
    </div>
  );
}
