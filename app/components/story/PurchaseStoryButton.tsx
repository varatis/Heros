"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Gem } from "lucide-react";
import { useWalletStore } from "@/stores/walletStore";
import { FunctionError, rpcPurchaseStory } from "@/lib/supabase/functions";

interface PurchaseStoryButtonProps {
  storyId: string;
  priceGems: number;
  currentGems: number;
  size?: "default" | "lg";
}

/**
 * Bouton d'achat d'une histoire payante.
 *
 * Le prix est relu côté serveur (jamais depuis le client) ; le débit de
 * gemmes + l'écriture de `is_purchased` sont faits atomiquement par le RPC
 * SECURITY DEFINER `purchase_story` (migration 005).
 */
export default function PurchaseStoryButton({
  storyId,
  priceGems,
  currentGems,
  size = "lg",
}: PurchaseStoryButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAffordable = currentGems >= priceGems;
  const onShopPage = pathname?.startsWith("/shop");

  async function handlePurchase() {
    setLoading(true);
    setError(null);

    try {
      const res = await rpcPurchaseStory(storyId);

      // Soldes renvoyés par le serveur (source de vérité)
      setWallet(res.gems, res.coins);

      // refresh le composant serveur (progression + bouton "Jouer")
      router.refresh();
    } catch (err) {
      const message =
        err instanceof FunctionError && err.code === "insufficient_funds"
          ? `Gemmes insuffisantes — il vous faut ${priceGems} 💎.`
          : err instanceof Error
            ? err.message
            : "Erreur lors de l'achat.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 w-full">
      <Button
        size={size}
        onClick={handlePurchase}
        disabled={loading || !isAffordable}
        className={
          size === "lg"
            ? "h-12 w-full rounded-xl gap-2 text-sm font-semibold"
            : "h-10 w-full rounded-xl gap-2 text-sm font-semibold"
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAffordable ? (
          <Gem className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {loading
          ? "Achat en cours…"
          : isAffordable
            ? `Débloquer · ${priceGems} 💎`
            : `${priceGems} 💎 requis`}
      </Button>

      {error && (
        <p className="text-xs font-medium text-destructive text-center">
          {error}
        </p>
      )}

      {!isAffordable &&
        (onShopPage ? (
          <p className="text-center text-[11px] text-muted-foreground">
            Rechargez des gemmes plus bas sur cette page.
          </p>
        ) : (
          <p className="text-center text-[11px] text-muted-foreground">
            <Link href="/shop" className="font-medium text-primary underline-offset-2 hover:underline">
              Obtenir des gemmes
            </Link>
          </p>
        ))}
    </div>
  );
}
