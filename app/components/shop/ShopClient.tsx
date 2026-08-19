"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();
  const { gems, setWallet, addGems, deductGems, isInitialized } = useWalletStore();
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialiser si nécessaire
  if (!isInitialized) {
    setWallet(initialGems);
  }

  // Simulation d'achat de pack de gemmes (Google Play / RevenueCat Flow)
  async function handleBuyPack(pack: any) {
    setLoadingPackId(pack.id);
    setErrorMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const totalGained = pack.gems_amount + (pack.bonus_gems || 0);

    // 1. Mettre à jour le solde
    const { data: updatedWallet, error: walletError } = await supabase
      .from("wallets")
      .update({ gems: gems + totalGained })
      .eq("user_id", user.id)
      .select()
      .single();

    if (walletError) {
      setErrorMessage("Erreur lors de l'achat : " + walletError.message);
      setLoadingPackId(null);
      return;
    }

    // Mettre à jour le store en temps réel
    addGems(totalGained);

    // 2. Enregistrer la transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "gem_purchase",
      status: "completed",
      amount_usd: pack.price_usd,
      gems_delta: totalGained,
      revenuecat_transaction_id: `mock_${Date.now()}`,
      store_product_id: pack.revenuecat_product_id,
      platform: "web",
    });

    setSuccessMessage(`+${totalGained} gemmes ajoutées à votre trésor !`);
    setTimeout(() => setSuccessMessage(null), 4000);
    setLoadingPackId(null);
  }

  // Achat d'un objet magique avec des gemmes
  async function handleBuyItem(item: any) {
    if (gems < item.price_gems) {
      setErrorMessage("Gemmes insuffisantes pour cet objet !");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setLoadingItemId(item.id);
    setErrorMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Débiter les gemmes
    const newGems = gems - item.price_gems;
    const { error: walletError } = await supabase
      .from("wallets")
      .update({ gems: newGems })
      .eq("user_id", user.id);

    if (walletError) {
      setErrorMessage("Erreur lors de la transaction : " + walletError.message);
      setLoadingItemId(null);
      return;
    }

    // Déduire du store en temps réel
    deductGems(item.price_gems);

    // 2. Vérifier si l'utilisateur possède déjà cet objet dans son inventaire
    const { data: existingInv } = await supabase
      .from("user_inventory")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("item_id", item.id)
      .maybeSingle();

    if (existingInv) {
      // Incrémenter la quantité
      await supabase
        .from("user_inventory")
        .update({ quantity: existingInv.quantity + 1 })
        .eq("id", existingInv.id);
    } else {
      // Insérer nouvel item dans l'inventaire
      await supabase.from("user_inventory").insert({
        user_id: user.id,
        item_id: item.id,
        quantity: 1,
      });
    }

    // 3. Enregistrer la transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "item_purchase",
      status: "completed",
      gems_delta: -item.price_gems,
      item_id: item.id,
    });

    setSuccessMessage(`${item.name} ajouté à votre inventaire ! (-${item.price_gems} 💎)`);
    setTimeout(() => setSuccessMessage(null), 4000);
    setLoadingItemId(null);
    router.refresh();
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
