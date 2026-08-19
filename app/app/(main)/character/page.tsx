import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DailyRewardCard from "@/components/shared/DailyRewardCard";
import {
  User,
  Shield,
  Sword,
  Sparkles,
  Heart,
  Flame,
  Gem,
  Package,
  Trophy,
  History,
  LogOut,
} from "lucide-react";

export default async function CharacterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Récupérer le profil et wallet
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

  // Récupérer l'inventaire avec fusion infaillible
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

  // Récupérer les stats globales de lecture
  const { data: progressList } = await supabase
    .from("user_story_progress")
    .select("*")
    .eq("user_id", user.id);

  const completedStories = progressList?.filter((p) => p.is_completed).length || 0;
  const totalStoriesPlayed = progressList?.length || 0;

  // Calculer les bonus de l'équipement
  const { calculateInventoryBonuses } = await import("@/lib/game-engine/stats");
  const gearBonuses = calculateInventoryBonuses(inventory);

  const baseStrength = 5 + (gearBonuses.strength || 0);
  const baseLuck = 5 + (gearBonuses.luck || 0);
  const baseHpMax = 10 + (gearBonuses.hp_max || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Carte d'identité du héros */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/80 to-background p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-4xl shadow-inner glow-purple shrink-0">
            🧙‍♂️
          </div>

          {/* Profil */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {profile?.username || "Héros Légendaire"}
              </h1>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Niveau 1 · Aventurier
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Membre depuis le{" "}
              {new Date(profile?.created_at || Date.now()).toLocaleDateString("fr-FR")}
            </p>

            {/* Ressources (Gemmes & Pièces) */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Gem className="w-3.5 h-3.5" />
                <span>{wallet?.gems || 0} Gemmes</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{profile?.streak_days || 0} jours de streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panneau de Caractéristiques du Héros (Stats de combat) */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/40">
          <div className="glass-card rounded-xl p-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-red-400 font-bold text-base">
              <Heart className="w-4 h-4 fill-red-400" />
              <span>{baseHpMax} PV Max</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {gearBonuses.hp_max ? `(+${gearBonuses.hp_max} équipement)` : "Base"}
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base">
              <Sword className="w-4 h-4" />
              <span>{baseStrength} Force</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {gearBonuses.strength ? `(+${gearBonuses.strength} arme)` : "Base"}
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[--hero-gold] font-bold text-base">
              <Sparkles className="w-4 h-4" />
              <span>{baseLuck} Chance</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {gearBonuses.luck ? `(+${gearBonuses.luck} relique)` : "Base"}
            </div>
          </div>
        </div>

        {/* Statistiques d'accomplissement */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/40 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{totalStoriesPlayed}</div>
            <div className="text-[11px] text-muted-foreground">Quêtes engagées</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[--hero-emerald]">{completedStories}</div>
            <div className="text-[11px] text-muted-foreground">Quêtes achevées</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[--hero-gold]">{inventory?.length || 0}</div>
            <div className="text-[11px] text-muted-foreground">Objets magiques</div>
          </div>
        </div>
      </div>

      {/* Récompense quotidienne (streak) — validée par grant-daily-reward */}
      <DailyRewardCard
        streakDays={profile?.streak_days || 0}
        claimedToday={
          profile?.streak_last_at
            ? new Date(profile.streak_last_at).toISOString().slice(0, 10) ===
              new Date().toISOString().slice(0, 10)
            : false
        }
      />

      {/* Inventaire du Héros */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold">Sacoche d&apos;Inventaire</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {inventory?.length || 0} objet(s)
          </span>
        </div>

        {inventory && inventory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inventory.map((inv) => (
              <Card key={inv.id} className="border-border/60 bg-card/60">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                    🗡️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm truncate">{inv.items?.name}</h4>
                      <Badge variant="outline" className="text-[10px]">
                        x{inv.quantity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {inv.items?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center space-y-2 border-dashed">
            <p className="text-sm text-muted-foreground">
              Votre sacoche est vide. Visitez la boutique ou découvrez des trésors lors de vos aventures !
            </p>
          </div>
        )}
      </section>

      {/* Déconnexion */}
      <div className="pt-4 flex justify-end">
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );
}
