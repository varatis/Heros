import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Gem, Shield, Sparkles, Store, WandSparkles } from "lucide-react";
import ShopClient from "@/components/shop/ShopClient";
import GuestRiskBanner from "@/components/auth/GuestRiskBanner";
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

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("is_available", true);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-3 sm:py-5">
      <section className="premium-card relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
        <div className="absolute -right-16 -top-20 size-60 rounded-full bg-[--hero-gold]/14 blur-3xl" />
        <div className="absolute -bottom-24 left-8 size-56 rounded-full bg-primary/18 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="w-fit border border-[--hero-gold]/35 bg-[--hero-gold]/10 px-3 py-1 text-[--hero-gold]">
              <Store className="mr-1 size-3.5" /> Échoppe de l’aventurier
            </Badge>
            <div className="space-y-2">
              <h1 className="text-balance text-3xl font-black tracking-tight sm:text-5xl">
                Préparez votre <span className="gradient-hero">prochaine expédition</span>
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Gemmes, potions et reliques servent à prolonger vos lectures, survivre aux choix difficiles et débloquer les grimoires premium.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-border/50 bg-background/28 p-2 backdrop-blur-md sm:min-w-[22rem]">
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-gold]">
                <Gem className="size-4" />
                <span className="text-xl font-black">{wallet?.gems?.toLocaleString("fr-FR") || 0}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">gemmes</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-4" />
                <span className="text-xl font-black">{gemPacks?.length || 0}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">coffres</p>
            </div>
            <div className="rounded-2xl bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-[--hero-emerald]">
                <Shield className="size-4" />
                <span className="text-xl font-black">{items?.length || 0}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">reliques</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-muted-foreground">
          <WandSparkles className="size-4 shrink-0 text-primary" />
          <span>Les achats réels seront protégés côté serveur ; en web/dev, l’app peut utiliser la simulation configurée.</span>
        </div>
      </section>

      {isAnonymousUser(user) && <GuestRiskBanner />}

      <ShopClient
        gemPacks={gemPacks || []}
        items={items || []}
        currentGems={wallet?.gems || 0}
        isGuest={isAnonymousUser(user)}
      />
    </div>
  );
}
