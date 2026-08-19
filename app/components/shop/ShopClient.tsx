"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gem,
  Sparkles,
  Zap,
  Shield,
  Heart,
  Check,
  Star,
  Loader2,
  Sword,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/walletStore";
import {
  FunctionError,
  invokeSimulatedPurchase,
  rpcPurchaseItem,
} from "@/lib/supabase/functions";

interface ShopClientProps {
  gemPacks: any[];
  items: any[];
  currentGems: number;
}

export default function ShopClient({
  gemPacks,
  items,
  currentGems: initialGems,
}: ShopClientProps) {
  const router = useRouter();
  const { gems, setWallet, isInitialized } = useWalletStore();
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialiser si nécessaire
  if (!isInitialized) {
    setWallet(initialGems);
  }

  // Achat d'un pack de gemmes — validé côté serveur par l'Edge Function
  // `validate-purchase` (simulation jusqu'à l'intégration du SDK RevenueCat,
  // qui prendra le relais via le même endpoint en webhook signé).
  async function handleBuyPack(pack: any) {
    setLoadingPackId(pack.id);
    setErrorMessage(null);

    try {
      const res = await invokeSimulatedPurchase(pack.id);

      // Solde renvoyé par le serveur (source de vérité)
      if (res.gems !== null && res.gems !== undefined) {
        setWallet(res.gems, res.coins ?? 0);
      }

      setSuccessMessage(
        `+${res.gems_granted} gemmes ajoutées à votre trésor !`,
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof FunctionError && err.code === "mock_purchases_disabled"
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

  // Achat d'un objet magique — RPC SECURITY DEFINER `purchase_item` :
  // prix & disponibilité validés serveur, débit + octroi atomiques.
  async function handleBuyItem(item: any) {
    if (gems < item.price_gems) {
      setErrorMessage("Gemmes insuffisantes pour cet objet !");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setLoadingItemId(item.id);
    setErrorMessage(null);

    try {
      const res = await rpcPurchaseItem(item.id);

      // Soldes renvoyés par le serveur (source de vérité)
      setWallet(res.gems, res.coins);

      setSuccessMessage(
        `${res.item_name} ajouté à votre inventaire ! (-${res.price_gems} 💎)`,
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error &&
        err.message.includes("insufficient_funds")
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
      {/* Toast / Message de succès ou erreur */}
      {successMessage && (
        <div className="p-3 rounded-2xl bg-[--hero-emerald]/20 border border-[--hero-emerald]/40 text-[--hero-emerald] text-xs font-bold text-center animate-bounce">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-destructive/20 border border-destructive/40 text-destructive text-xs font-bold text-center">
          {errorMessage}
        </div>
      )}

      {/* 1. Coffres & Packs de Gemmes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[--hero-gold]" />
          <h2 className="text-lg font-bold">Packs de Gemmes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gemPacks.map((pack) => {
            const isFeatured = pack.is_featured;
            const isLoading = loadingPackId === pack.id;

            return (
              <Card
                key={pack.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-border/60 bg-card/60 transition-all duration-200 hover:border-primary/50 hover:shadow-lg flex flex-col justify-between",
                  isFeatured && "border-primary ring-1 ring-primary/40 glow-purple"
                )}
              >
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-xl tracking-wider">
                    Populaire
                  </div>
                )}

                <CardContent className="p-5 space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center text-2xl shadow-inner">
                      💎
                    </div>
                    <h3 className="font-bold text-base">{pack.name}</h3>
                  </div>

                  <div className="text-center space-y-0.5 py-1">
                    <div className="text-2xl font-black text-primary">
                      {pack.gems_amount.toLocaleString("fr-FR")} 💎
                    </div>
                    {pack.bonus_gems > 0 && (
                      <Badge className="bg-[--hero-emerald]/20 text-[--hero-emerald] border-[--hero-emerald]/30 text-[10px] font-bold">
                        +{pack.bonus_gems} Bonus
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleBuyPack(pack)}
                    disabled={isLoading}
                    variant={isFeatured ? "default" : "secondary"}
                    className={cn(
                      "w-full font-bold text-xs gap-1.5",
                      isFeatured && "glow-purple"
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      `${pack.price_usd} €`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 2. Équipements & Potions de Survie */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-bold">Reliques & Potions</h2>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => {
              const isLoading = loadingItemId === item.id;
              const isAffordable = gems >= item.price_gems;

              const emoji =
                item.item_type === "potion"
                  ? "🧪"
                  : item.item_type === "weapon"
                  ? "🗡️"
                  : item.item_type === "armor"
                  ? "🛡️"
                  : "✨";

              return (
                <Card key={item.id} className="border-border/60 bg-card/60">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm truncate">
                          {item.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-primary">
                          {item.price_gems} 💎
                        </span>
                        <Button
                          size="sm"
                          variant={isAffordable ? "default" : "secondary"}
                          disabled={isLoading || !isAffordable}
                          onClick={() => handleBuyItem(item)}
                          className="text-xs h-7 gap-1 font-bold"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isAffordable ? (
                            "Acheter"
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
          <div className="glass-card rounded-2xl p-6 text-center space-y-2 border-dashed">
            <p className="text-xs text-muted-foreground">
              Les marchands sont en route pour réapprovisionner l&apos;échoppe...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
