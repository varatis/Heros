"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  Infinity,
  Loader2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import StoryCover from "@/components/story/StoryCover";
import GemIcon from "@/components/shared/GemIcon";
import { useWalletStore } from "@/stores/walletStore";
import { FunctionError, rpcPurchaseStory } from "@/lib/supabase/functions";
import { genreLabel, playtimeLabel } from "@/lib/stories";
import { cn } from "@/lib/utils";

export type PurchaseStoryInfo = {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  genre?: string | null;
  estimated_playtime_min?: number | null;
  priceGems: number;
};

type Phase = "confirm" | "success";

interface PurchaseStorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: PurchaseStoryInfo | null;
  currentGems: number;
  /** Lien boutique si gemmes insuffisantes (masqué si déjà sur /shop). */
  shopHref?: string | null;
}

export default function PurchaseStorySheet({
  open,
  onOpenChange,
  story,
  currentGems,
  shopHref = "/shop",
}: PurchaseStorySheetProps) {
  const router = useRouter();
  const { setWallet } = useWalletStore();
  const [phase, setPhase] = useState<Phase>("confirm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceAfter, setBalanceAfter] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("confirm");
      setLoading(false);
      setError(null);
      setBalanceAfter(null);
    }
  }, [open, story?.id]);

  if (!story) return null;

  const price = story.priceGems;
  const affordable = currentGems >= price;
  const remaining = currentGems - price;

  async function handleConfirm() {
    if (!story || !affordable || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await rpcPurchaseStory(story.id);
      setWallet(res.gems, res.coins);
      setBalanceAfter(res.gems);
      setPhase("success");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof FunctionError && err.code === "insufficient_funds"
          ? `Il vous faut ${price} gemmes pour ce livre.`
          : err instanceof Error
            ? err.message
            : "L’achat n’a pas pu aboutir.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

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
          <SuccessBody
            story={story}
            balanceAfter={balanceAfter ?? remaining}
            onClose={() => onOpenChange(false)}
            onOpenBook={() => {
              onOpenChange(false);
              router.push(`/story/${story.id}/play`);
            }}
          />
        ) : (
          <ConfirmBody
            story={story}
            currentGems={currentGems}
            price={price}
            remaining={remaining}
            affordable={affordable}
            loading={loading}
            error={error}
            shopHref={shopHref}
            onConfirm={handleConfirm}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmBody({
  story,
  currentGems,
  price,
  remaining,
  affordable,
  loading,
  error,
  shopHref,
  onConfirm,
  onCancel,
}: {
  story: PurchaseStoryInfo;
  currentGems: number;
  price: number;
  remaining: number;
  affordable: boolean;
  loading: boolean;
  error: string | null;
  shopHref: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="relative overflow-hidden px-5 pb-2 pt-6 sm:px-6 sm:pt-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.83_0.14_80/0.14),transparent_70%)]" />

        <div className="relative flex flex-col items-center text-center">
          <div className="book-cover relative w-[5.5rem] overflow-hidden aspect-[2/3] shadow-[0_12px_40px_oklch(0.04_0.02_175/0.55)] sm:w-24">
            <StoryCover
              slug={story.slug}
              title={story.title}
              priority
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Débloquer le livre
          </p>
          <DialogTitle className="mt-1.5 font-display text-2xl leading-tight text-balance">
            {story.title}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-xs text-muted-foreground">
            {[genreLabel(story.genre), playtimeLabel(story.estimated_playtime_min)]
              .filter(Boolean)
              .join(" · ")}
          </DialogDescription>
          {story.tagline && (
            <p className="mt-2 max-w-[18rem] text-xs italic leading-5 text-muted-foreground/90 line-clamp-2">
              {story.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 px-5 pb-2 sm:px-6">
        <ul className="grid gap-2 rounded-2xl border border-border/50 bg-muted/25 px-3.5 py-3">
          <Perk icon={<Infinity className="size-3.5" />} label="Accès à vie, sans abonnement" />
          <Perk icon={<RotateCcw className="size-3.5" />} label="Recommencer autant que vous voulez" />
          <Perk icon={<BookOpen className="size-3.5" />} label="Toutes les fins du récit" />
        </ul>

        <div className="rounded-2xl border border-border/50 bg-background/40 px-3.5 py-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Prix</span>
            <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-foreground">
              <GemIcon size="sm" title="" />
              {price.toLocaleString("fr-FR")}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Votre bourse</span>
            <span className="tabular-nums font-medium">{currentGems.toLocaleString("fr-FR")}</span>
          </div>
          <div className="my-2.5 h-px bg-border/50" />
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Après achat</span>
            <span
              className={cn(
                "tabular-nums font-semibold",
                affordable ? "text-foreground" : "text-destructive"
              )}
            >
              {affordable ? remaining.toLocaleString("fr-FR") : "—"}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-center text-xs font-medium text-destructive">{error}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
        {affordable ? (
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-12 w-full rounded-2xl text-sm font-semibold"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <GemIcon size="sm" title="" />
                Confirmer · {price.toLocaleString("fr-FR")} gemmes
              </>
            )}
          </Button>
        ) : (
          <>
            <div className="mb-1 flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-xs leading-5 text-destructive">
              <Lock className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Il vous manque {(price - currentGems).toLocaleString("fr-FR")} gemme
                {price - currentGems > 1 ? "s" : ""} pour ce livre.
              </span>
            </div>
            {shopHref ? (
              <Link
                href={shopHref}
                onClick={onCancel}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-12 w-full gap-2 rounded-2xl text-sm font-semibold"
                )}
              >
                <GemIcon size="sm" title="" />
                Obtenir des gemmes
              </Link>
            ) : (
              <Button
                onClick={onCancel}
                className="h-12 w-full rounded-2xl text-sm font-semibold"
              >
                <GemIcon size="sm" title="" />
                Choisir un pack de gemmes
              </Button>
            )}
          </>
        )}
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
          className="h-10 w-full rounded-2xl text-sm text-muted-foreground"
        >
          Annuler
        </Button>
      </div>
    </>
  );
}

function SuccessBody({
  story,
  balanceAfter,
  onClose,
  onOpenBook,
}: {
  story: PurchaseStoryInfo;
  balanceAfter: number;
  onClose: () => void;
  onOpenBook: () => void;
}) {
  return (
    <div className="px-5 pb-5 pt-8 text-center sm:px-6 sm:pb-6 sm:pt-9">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[--hero-emerald]">
        <Check className="size-7" strokeWidth={2.5} />
      </div>
      <DialogTitle className="mt-4 font-display text-2xl">Livre débloqué</DialogTitle>
      <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
        <span className="font-medium text-foreground">{story.title}</span> est maintenant dans
        votre bibliothèque — pour toujours.
      </DialogDescription>

      <div className="mx-auto mt-5 flex w-fit items-center gap-3">
        <div className="book-cover relative w-14 overflow-hidden aspect-[2/3]">
          <StoryCover
            slug={story.slug}
            title={story.title}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="text-left text-xs text-muted-foreground">
          <p>Solde restant</p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 font-semibold tabular-nums text-foreground">
            <GemIcon size="sm" title="" />
            {balanceAfter.toLocaleString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={onOpenBook} className="h-12 w-full rounded-2xl text-sm font-semibold">
          <BookOpen className="size-4" />
          Ouvrir le livre
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          className="h-10 w-full rounded-2xl text-sm text-muted-foreground"
        >
          Plus tard
        </Button>
      </div>
    </div>
  );
}

function Perk({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-xs text-foreground/90">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[--hero-gold]/10 text-[--hero-gold]">
        {icon}
      </span>
      {label}
    </li>
  );
}
