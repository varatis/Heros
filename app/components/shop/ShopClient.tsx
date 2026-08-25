"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/walletStore";
import { createClient } from "@/lib/supabase/client";
import {
  FunctionError,
  invokeSimulatedPurchase,
} from "@/lib/supabase/functions";
import {
  canUseRevenueCat,
  initRevenueCat,
  purchaseProduct,
  RevenueCatError,
} from "@/lib/revenuecat/client";
import SecureAccountModal from "@/components/auth/SecureAccountModal";
import StoryCover from "@/components/story/StoryCover";
import PurchaseStoryButton from "@/components/story/PurchaseStoryButton";
import PurchaseGemPackSheet, {
  type ShopGemPack,
} from "@/components/shop/PurchaseGemPackSheet";
import GemIcon from "@/components/shared/GemIcon";
import { genreLabel, playtimeLabel } from "@/lib/stories";

export type { ShopGemPack };

export type ShopStory = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  genre: string;
  is_free: boolean;
  price_gems: number | null;
  estimated_playtime_min: number | null;
  is_purchased: boolean;
};

interface ShopClientProps {
  gemPacks: ShopGemPack[];
  stories: ShopStory[];
  currentGems: number;
  isGuest?: boolean;
}

function formatEuro(value: number) {
  return `${Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} €`;
}

export default function ShopClient({
  gemPacks,
  stories,
  currentGems: initialGems,
  isGuest = false,
}: ShopClientProps) {
  const router = useRouter();
  const { gems, setWallet, isInitialized } = useWalletStore();
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountGate, setAccountGate] = useState<"block" | "warn" | null>(null);
  const [pendingPack, setPendingPack] = useState<ShopGemPack | null>(null);
  const [selectedPack, setSelectedPack] = useState<ShopGemPack | null>(null);
  const [packSheetOpen, setPackSheetOpen] = useState(false);
  const [gemsGranted, setGemsGranted] = useState<number | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      setWallet(initialGems);
    }
  }, [initialGems, isInitialized, setWallet]);

  const displayedGems = isInitialized ? gems : initialGems;

  const lockedStories = stories.filter((s) => !s.is_free && !s.is_purchased);
  const ownedPremium = stories.filter((s) => !s.is_free && s.is_purchased);
  const freeStories = stories.filter((s) => s.is_free);

  const avgStoryPrice = useMemo(() => {
    const prices = lockedStories
      .map((s) => s.price_gems)
      .filter((p): p is number => typeof p === "number" && p > 0);
    if (prices.length === 0) {
      const owned = stories
        .filter((s) => !s.is_free && s.price_gems)
        .map((s) => s.price_gems as number);
      if (owned.length === 0) return 150;
      return Math.round(owned.reduce((a, b) => a + b, 0) / owned.length);
    }
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }, [lockedStories, stories]);

  function openPackSheet(pack: ShopGemPack) {
    setSelectedPack(pack);
    setGemsGranted(null);
    setErrorMessage(null);
    setPackSheetOpen(true);
  }

  async function handleBuyPack(pack: ShopGemPack, { skipGuestGate = false } = {}) {
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
          return;
        }

        await initRevenueCat(user.id);
        await purchaseProduct(pack.revenuecat_product_id!);

        const granted = pack.gems_amount + (pack.bonus_gems || 0);
        setGemsGranted(granted);
        setTimeout(() => router.refresh(), 1200);
        return;
      }

      const res = await invokeSimulatedPurchase(pack.id);

      if (res.gems !== null && res.gems !== undefined) {
        setWallet(res.gems, res.coins ?? 0);
      }

      setGemsGranted(res.gems_granted ?? pack.gems_amount + (pack.bonus_gems || 0));
      router.refresh();
    } catch (err) {
      const message =
        err instanceof RevenueCatError && err.code === "cancelled"
          ? "Achat annulé."
          : err instanceof FunctionError && err.code === "mock_purchases_disabled"
            ? "Les achats passent bientôt par le store — simulation désactivée ici."
            : err instanceof Error
              ? err.message
              : "Erreur lors de l'achat.";
      setErrorMessage(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setLoadingPackId(null);
    }
  }

  return (
    <div className="space-y-10">
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
                void handleBuyPack(pack, { skipGuestGate: true }).catch(() => {
                  /* error déjà posée */
                });
              }
            : undefined
        }
      />

      <PurchaseGemPackSheet
        open={packSheetOpen}
        onOpenChange={(open) => {
          setPackSheetOpen(open);
          if (!open) {
            setSelectedPack(null);
            setGemsGranted(null);
            setErrorMessage(null);
          }
        }}
        pack={selectedPack}
        currentGems={displayedGems}
        avgStoryPrice={avgStoryPrice}
        loading={selectedPack ? loadingPackId === selectedPack.id : false}
        error={errorMessage}
        gemsGranted={gemsGranted}
        onConfirm={async () => {
          if (!selectedPack) return;
          await handleBuyPack(selectedPack);
        }}
      />

      {/* ——— Histoires à débloquer ——— */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Bibliothèque
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">Livres premium</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Un achat, accès à vie — recommencez et explorez toutes les fins.
            </p>
          </div>
          {lockedStories.length > 0 && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {lockedStories.length}
            </span>
          )}
        </div>

        {lockedStories.length > 0 ? (
          <ul className="space-y-3">
            {lockedStories.map((story) => (
              <li key={story.id}>
                <article className="flex gap-4 rounded-2xl border border-border/55 bg-card/40 p-3 sm:p-4">
                  <Link
                    href={`/story/${story.id}`}
                    className="book-cover relative w-[4.5rem] shrink-0 overflow-hidden aspect-[2/3] touch-manipulation sm:w-20"
                  >
                    <StoryCover
                      slug={story.slug}
                      title={story.title}
                      className="absolute inset-0 h-full w-full"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
                    <div className="min-w-0">
                      <Link href={`/story/${story.id}`} className="touch-manipulation">
                        <h3 className="font-display text-lg leading-snug line-clamp-2 sm:text-xl">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {genreLabel(story.genre)}
                        <span className="mx-1 text-border">·</span>
                        {playtimeLabel(story.estimated_playtime_min)}
                      </p>
                      {story.tagline && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground/90">
                          {story.tagline}
                        </p>
                      )}
                    </div>

                    <div className="w-full max-w-xs">
                      <PurchaseStoryButton
                        storyId={story.id}
                        priceGems={story.price_gems ?? 0}
                        currentGems={displayedGems}
                        size="default"
                        shopHref={null}
                        story={{
                          slug: story.slug,
                          title: story.title,
                          tagline: story.tagline,
                          genre: story.genre,
                          estimated_playtime_min: story.estimated_playtime_min,
                        }}
                      />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {ownedPremium.length > 0
                ? "Tous les livres premium sont déjà dans votre bibliothèque."
                : "Aucun livre payant pour le moment — les prochains titres arriveront ici."}
            </p>
            <Link
              href="/catalogue"
              className="mt-2 inline-block text-sm font-medium text-primary touch-manipulation"
            >
              Voir la bibliothèque
            </Link>
          </div>
        )}

        {ownedPremium.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {ownedPremium.length} livre{ownedPremium.length > 1 ? "s" : ""} premium débloqué
            {ownedPremium.length > 1 ? "s" : ""}
            {freeStories.length > 0 && (
              <>
                {" "}
                · {freeStories.length} gratuit{freeStories.length > 1 ? "s" : ""}
              </>
            )}
            .
          </p>
        )}
      </section>

      {/* ——— Packs de gemmes ——— */}
      <section className="space-y-4" id="gemmes">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Bourse
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">Gemmes</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Rechargez pour débloquer des histoires. Paiement unique, sans abonnement.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gemPacks.map((pack) => {
            const isFeatured = pack.is_featured;
            const isLoading = loadingPackId === pack.id;
            const totalGems = pack.gems_amount + (pack.bonus_gems || 0);

            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => openPackSheet(pack)}
                disabled={isLoading}
                className={cn(
                  "group relative flex flex-col rounded-2xl border bg-card/40 p-3.5 text-left transition-colors touch-manipulation sm:p-4",
                  "hover:border-[--hero-gold]/40 hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:opacity-60",
                  isFeatured
                    ? "col-span-2 border-[--hero-gold]/45 sm:col-span-1"
                    : "border-border/55"
                )}
              >
                {isFeatured && (
                  <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-full border border-[--hero-gold]/35 bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--hero-gold]">
                    <Star className="size-2.5 fill-current" />
                    Populaire
                  </span>
                )}

                <div className="flex items-center gap-2 text-[--hero-gold]">
                  <GemIcon size="md" title="" className="shrink-0 drop-shadow-[0_0_8px_oklch(0.83_0.14_80/0.45)]" />
                  <span className="font-display text-2xl tabular-nums leading-none">
                    {totalGems.toLocaleString("fr-FR")}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium leading-snug text-foreground/90">
                  {pack.name}
                </p>

                {pack.bonus_gems > 0 ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[--hero-emerald]">
                    <Check className="size-3" />
                    dont +{pack.bonus_gems} offertes
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">Pack de base</p>
                )}

                <span
                  className={cn(
                    "mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold",
                    isFeatured
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    formatEuro(pack.price_usd)
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {gemPacks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/70 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Les packs de gemmes arrivent bientôt.
            </p>
          </div>
        )}
      </section>

      <p className="pb-2 text-center text-[11px] leading-5 text-muted-foreground/80">
        Les objets se trouvent dans chaque aventure. Ici, on n’achète que des livres et des
        gemmes.
      </p>
    </div>
  );
}
