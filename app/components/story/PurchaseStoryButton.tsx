"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/stores/walletStore";
import PurchaseStorySheet, {
  type PurchaseStoryInfo,
} from "@/components/shop/PurchaseStorySheet";
import GemIcon from "@/components/shared/GemIcon";
import { cn } from "@/lib/utils";

interface PurchaseStoryButtonProps {
  storyId: string;
  priceGems: number;
  currentGems: number;
  size?: "default" | "lg";
  /** Métadonnées pour la feuille de confirmation (couverture, titre…). */
  story?: Omit<PurchaseStoryInfo, "id" | "priceGems"> & { id?: string };
  /** Lien boutique si solde insuffisant. `null` = déjà sur /shop. */
  shopHref?: string | null;
  className?: string;
  /** Libellé du CTA d’ouverture (avant la feuille). */
  label?: string;
}

/**
 * Ouvre une feuille de confirmation soignée, puis appelle le RPC
 * SECURITY DEFINER `purchase_story` (prix relu côté serveur).
 */
export default function PurchaseStoryButton({
  storyId,
  priceGems,
  currentGems: initialGems,
  size = "lg",
  story,
  shopHref = "/shop",
  className,
  label,
}: PurchaseStoryButtonProps) {
  const { gems, isInitialized } = useWalletStore();
  const [open, setOpen] = useState(false);

  const currentGems = isInitialized ? gems : initialGems;
  const isAffordable = currentGems >= priceGems;

  const storyInfo: PurchaseStoryInfo = {
    id: storyId,
    slug: story?.slug ?? "",
    title: story?.title ?? "Histoire",
    tagline: story?.tagline,
    genre: story?.genre,
    estimated_playtime_min: story?.estimated_playtime_min,
    priceGems,
  };

  return (
    <>
      <div className={cn("w-full space-y-1.5", className)}>
        <Button
          size={size}
          onClick={() => setOpen(true)}
          className={
            size === "lg"
              ? "h-12 w-full gap-2 rounded-xl text-sm font-semibold"
              : "h-10 w-full gap-2 rounded-xl text-sm font-semibold"
          }
        >
          {isAffordable ? (
            <GemIcon size="sm" title="" />
          ) : (
            <Lock className="size-4" />
          )}
          <span className="inline-flex items-center gap-1.5">
            {label ?? (
              <>
                Débloquer ·{" "}
                <span className="tabular-nums">{priceGems.toLocaleString("fr-FR")}</span>
              </>
            )}
          </span>
        </Button>
        {!isAffordable && (
          <p className="text-center text-[11px] text-muted-foreground">
            Solde insuffisant — vous pourrez recharger ensuite.
          </p>
        )}
      </div>

      <PurchaseStorySheet
        open={open}
        onOpenChange={setOpen}
        story={storyInfo}
        currentGems={currentGems}
        shopHref={shopHref}
      />
    </>
  );
}
