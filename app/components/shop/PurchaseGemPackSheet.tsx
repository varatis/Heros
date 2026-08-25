"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import GemIcon from "@/components/shared/GemIcon";
import { cn } from "@/lib/utils";

export type ShopGemPack = {
  id: string;
  name: string;
  gems_amount: number;
  bonus_gems: number;
  price_usd: number;
  revenuecat_product_id: string | null;
  is_featured: boolean;
  sort_order?: number;
};

type Phase = "confirm" | "success";

interface PurchaseGemPackSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pack: ShopGemPack | null;
  currentGems: number;
  /** Prix moyen d’un livre premium pour l’équivalent « ≈ X livres ». */
  avgStoryPrice?: number | null;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void | Promise<void>;
  /** Nombre de gemmes créditée après succès (si connu). */
  gemsGranted?: number | null;
}

function formatEuro(value: number) {
  return `${Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} €`;
}

export default function PurchaseGemPackSheet({
  open,
  onOpenChange,
  pack,
  currentGems,
  avgStoryPrice = null,
  loading = false,
  error = null,
  onConfirm,
  gemsGranted = null,
}: PurchaseGemPackSheetProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("confirm");
      setLocalError(null);
    }
  }, [open, pack?.id]);

  // Passage en succès quand le parent signale gemsGranted après achat.
  useEffect(() => {
    if (open && gemsGranted != null && gemsGranted > 0) {
      setPhase("success");
    }
  }, [open, gemsGranted]);

  const totalGems = pack ? pack.gems_amount + (pack.bonus_gems || 0) : 0;
  const balanceAfter = currentGems + (gemsGranted ?? totalGems);

  const bookEquivalent = useMemo(() => {
    if (!avgStoryPrice || avgStoryPrice <= 0 || !pack) return null;
    const n = Math.floor(totalGems / avgStoryPrice);
    return n >= 1 ? n : null;
  }, [avgStoryPrice, pack, totalGems]);

  if (!pack) return null;

  async function handleConfirm() {
    setLocalError(null);
    try {
      await onConfirm();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Achat impossible.");
    }
  }

  const displayError = localError || error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={phase === "confirm"}
        className={cn(
          "max-w-[22.5rem] gap-0 overflow-hidden rounded-[1.75rem] border border-border/60 bg-popover p-0 sm:max-w-md",
          "shadow-[0_24px_80px_oklch(0.04_0.015_175/0.55)]"
        )}
      >
        {phase === "success" ? (
          <div className="px-5 pb-5 pt-8 text-center sm:px-6 sm:pb-6 sm:pt-9">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[--hero-emerald]">
              <Check className="size-7" strokeWidth={2.5} />
            </div>
            <DialogTitle className="mt-4 font-display text-2xl">Bourse rechargée</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">
                +{(gemsGranted ?? totalGems).toLocaleString("fr-FR")} gemmes
              </span>{" "}
              ajoutées. Vous pouvez débloquer un livre tout de suite.
            </DialogDescription>

            <div className="mx-auto mt-5 w-full max-w-[16rem] rounded-2xl border border-border/50 bg-muted/25 px-4 py-3 text-left text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Nouveau solde</span>
                <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-foreground">
                  <GemIcon size="sm" title="" />
                  {balanceAfter.toLocaleString("fr-FR")}
                </span>
              </div>
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 h-12 w-full rounded-2xl text-sm font-semibold"
            >
              Continuer
            </Button>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden px-5 pb-1 pt-7 sm:px-6 sm:pt-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.83_0.14_80/0.16),transparent_72%)]" />

              <div className="relative text-center">
                {pack.is_featured && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Star className="size-2.5 fill-current text-[--hero-gold]" />
                    Le plus choisi
                  </span>
                )}

                <div className="mx-auto grid place-items-center">
                  <GemIcon size="xl" title="" />
                </div>

                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Recharger la bourse
                </p>
                <DialogTitle className="mt-2 flex items-center justify-center gap-2 font-display text-3xl tabular-nums leading-none tracking-tight text-foreground">
                  <GemIcon size="md" title="" />
                  {totalGems.toLocaleString("fr-FR")}
                  <span className="text-lg font-medium text-muted-foreground">gemmes</span>
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                  {pack.name}
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-3 px-5 pb-2 pt-4 sm:px-6">
              <div className="rounded-2xl border border-border/50 bg-background/40 px-3.5 py-3 text-sm">
                <Row
                  label="Pack"
                  value={`${pack.gems_amount.toLocaleString("fr-FR")} gemmes`}
                />
                {pack.bonus_gems > 0 && (
                  <Row
                    label="Bonus offert"
                    value={`+${pack.bonus_gems.toLocaleString("fr-FR")}`}
                    accent
                  />
                )}
                <div className="my-2.5 h-px bg-border/50" />
                <Row label="Total crédité" value={totalGems.toLocaleString("fr-FR")} strong />
                <Row
                  label="Solde après"
                  value={(currentGems + totalGems).toLocaleString("fr-FR")}
                />
              </div>

              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="size-3.5 shrink-0 text-[--hero-gold]" />
                  Paiement unique · pas d’abonnement
                </li>
                {bookEquivalent != null && (
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-[--hero-emerald]" />
                    Environ {bookEquivalent} livre{bookEquivalent > 1 ? "s" : ""} premium
                  </li>
                )}
                {pack.bonus_gems > 0 && (
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-[--hero-emerald]" />
                    {Math.round((pack.bonus_gems / pack.gems_amount) * 100)} % de gemmes en plus
                  </li>
                )}
              </ul>

              {displayError && (
                <p className="text-center text-xs font-medium text-destructive">{displayError}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
              <Button
                onClick={() => void handleConfirm()}
                disabled={loading}
                className="h-12 w-full rounded-2xl text-sm font-semibold"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>Payer {formatEuro(pack.price_usd)}</>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="h-10 w-full rounded-2xl text-sm text-muted-foreground"
              >
                Annuler
              </Button>
              <p className="text-center text-[10px] leading-4 text-muted-foreground/75">
                Achat sécurisé. Les gemmes sont créditées sur votre compte HeroBook.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          accent && "font-semibold text-[--hero-emerald]",
          strong && "font-semibold text-foreground",
          !accent && !strong && "font-medium"
        )}
      >
        {value}
      </span>
    </div>
  );
}
