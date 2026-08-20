"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Gem,
  Heart,
  Loader2,
  Shield,
  Sparkles,
  Star,
  Sword,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/walletStore";
import { createClient } from "@/lib/supabase/client";
import {
  FunctionError,
  invokeSimulatedPurchase,
  rpcPurchaseItem,
} from "@/lib/supabase/functions";
import {
  canUseRevenueCat,
  initRevenueCat,
  purchaseProduct,
  RevenueCatError,
} from "@/lib/revenuecat/client";
import SecureAccountModal from "@/components/auth/SecureAccountModal";

interface ShopClientProps {
  gemPacks: any[];
  items: any[];
  currentGems: number;
  isGuest?: boolean;
}

export default function ShopClient({
  gemPacks,
  items,
  currentGems: initialGems,
  isGuest = false,
}: ShopClientProps) {
  const router = useRouter();
  const { gems, setWallet, isInitialized } = useWalletStore();
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountGate, setAccountGate] = useState<"block" | "warn" | null>(null);
  const [pendingPack, setPendingPack] = useState<any | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      setWallet(initialGems);
    }
  }, [initialGems, isInitialized, setWallet]);

  const displayedGems = isInitialized ? gems : initialGems;

  async function handleBuyPack(pack: any, { skipGuestGate = false } = {}) {
    const isRealPurchase = canUseRevenueCat() && Boolean(pack.revenuecat_product_id);

    if (isGuest && !skipGuestGate) {
      if (isRealPurchase) {
        setAccountGate("block");
        return;
      }
      setPendingPack(pack);
      setAccountGate("warn");
      return;
    }

    setLoadingPackId(pack.id);
    setErrorMessage(null);

    try {
      if (isRealPurchase) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setErrorMessage("Connectez-vous pour effectuer un achat.");
          setTimeout(() => setErrorMessage(null), 4000);
          return;
        }

        await initRevenueCat(user.id);
        await purchaseProduct(pack.revenuecat_product_id);

        setSuccessMessage("Achat confirmé ! Vos gemmes arrivent dans quelques instants…");
        setTimeout(() => setSuccessMessage(null), 5000);
        setTimeout(() => router.refresh(), 1500);
        return;
      }

      const res = await invokeSimulatedPurchase(pack.id);

      if (res.gems !== null && res.gems !== undefined) {
        setWallet(res.gems, res.coins ?? 0);
      }

      setSuccessMessage(`+${res.gems_granted} gemmes ajoutées à votre trésor !`);
      setTimeout(() => setSuccessMessage(null), 4000);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof RevenueCatError && err.code === "cancelled"
          ? "Achat annulé."
          : err instanceof FunctionError && err.code === "mock_purchases_disabled"
            ? "Les achats passent bientôt par RevenueCat — simulation désactivée sur ce projet."
            : err instanceof Error
              ? err.message
              : "Erreur lors de l'achat.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoadingPackId(null);
    }
  }

  async function handleBuyItem(item: any) {
    if (displayedGems < item.price_gems) {
      setErrorMessage("Gemmes insuffisantes pour cet objet !");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setLoadingItemId(item.id);
    setErrorMessage(null);

    try {
      const res = await rpcPurchaseItem(item.id);
      setWallet(res.gems, res.coins);
      setSuccessMessage(`${res.item_name} ajouté à votre inventaire ! (-${res.price_gems} 💎)`);
      setTimeout(() => setSuccessMessage(null), 4000);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("insufficient_funds")
          ? "Gemmes insuffisantes pour cet objet !"
          : err instanceof Error
            ? err.message
            : "Erreur lors de la transaction.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoadingItemId(null);
    }
  }

  return (
    <div className="space-y-8">
      <SecureAccountModal
        open={accountGate !== null}
        mode={accountGate ?? "warn"}
        onOpenChange={(open) => {
          if (!open) {
            setAccountGate(null);
            setPendingPack(null);
          }
        }}
        onContinueAsGuest={
          accountGate === "warn" && pendingPack
            ? () => {
                const pack = pendingPack;
                setAccountGate(null);
                setPendingPack(null);
                void handleBuyPack(pack, { skipGuestGate: true });
              }
            : undefined
        }
      />

      {(successMessage || errorMessage) && (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-center text-sm font-black shadow-xl",
            successMessage
              ? "border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[--hero-emerald] glow-emerald"
              : "border-destructive/35 bg-destructive/15 text-destructive"
          )}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[--hero-gold]">Coffres</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Packs de gemmes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Débloquez des histoires premium ou prenez les choix les plus risqués.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {gemPacks.map((pack) => {
            const isFeatured = pack.is_featured;
            const isLoading = loadingPackId === pack.id;

            return (
              <Card
                key={pack.id}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border-border/55 bg-card/55 p-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/45",
                  isFeatured && "border-primary/60 ring-1 ring-primary/35 glow-purple"
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.82_0.15_72/.14),transparent_15rem)] opacity-80" />
                {isFeatured && (
                  <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary-foreground">
                    <Star className="size-3 fill-current" /> Populaire
                  </div>
                )}

                <CardContent className="relative z-10 flex h-full flex-col justify-between space-y-5 p-5">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto grid size-16 place-items-center rounded-[1.4rem] border border-[--hero-gold]/25 bg-[--hero-gold]/10 text-3xl shadow-inner transition-transform group-hover:scale-105">
                      💎
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{pack.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Recharge instantanée du trésor</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-background/35 p-3 text-center">
                    <div className="text-3xl font-black text-[--hero-gold]">
                      {pack.gems_amount.toLocaleString("fr-FR")} 💎
                    </div>
                    {pack.bonus_gems > 0 && (
                      <Badge className="mt-2 border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[10px] font-black text-[--hero-emerald]">
                        <Check className="mr-1 size-3" /> +{pack.bonus_gems} bonus
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleBuyPack(pack)}
                    disabled={isLoading}
                    variant={isFeatured ? "default" : "secondary"}
                    className={cn("h-10 w-full rounded-2xl text-sm font-black", isFeatured && "glow-purple")}
                  >
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : `${pack.price_usd} €`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Survie</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Reliques & potions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Votre sacoche peut faire la différence entre une fin héroïque et une mort prématurée.</p>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const isLoading = loadingItemId === item.id;
              const isAffordable = displayedGems >= item.price_gems;

              const Icon =
                item.item_type === "potion"
                  ? Heart
                  : item.item_type === "weapon"
                    ? Sword
                    : item.item_type === "armor"
                      ? Shield
                      : Sparkles;
              const emoji =
                item.item_type === "potion"
                  ? "🧪"
                  : item.item_type === "weapon"
                    ? "🗡️"
                    : item.item_type === "armor"
                      ? "🛡️"
                      : "✨";

              return (
                <Card key={item.id} className="group overflow-hidden rounded-[1.5rem] border-border/55 bg-card/55 p-0 shadow-lg transition-all hover:border-primary/40">
                  <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-2xl shadow-inner">
                      <span>{emoji}</span>
                      <Icon className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background p-1 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate text-sm font-black sm:text-base">{item.name}</h4>
                        <Badge variant="outline" className="shrink-0 text-[10px] capitalize">
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[--hero-gold]/25 bg-[--hero-gold]/10 px-2.5 py-1 text-xs font-black text-[--hero-gold]">
                          <Gem className="size-3" /> {item.price_gems}
                        </span>
                        <Button
                          size="sm"
                          variant={isAffordable ? "default" : "secondary"}
                          disabled={isLoading || !isAffordable}
                          onClick={() => handleBuyItem(item)}
                          className="h-8 rounded-xl text-xs font-black"
                        >
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : isAffordable ? (
                            <><Zap className="size-3.5" /> Acheter</>
                          ) : (
                            "Insuffisant"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">Les marchands sont en route pour réapprovisionner l’échoppe...</p>
          </div>
        )}
      </section>
    </div>
  );
}
