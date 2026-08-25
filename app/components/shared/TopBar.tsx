"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { useWalletStore } from "@/stores/walletStore";
import ReaderSeal from "@/components/shared/ReaderSeal";
import GemIcon from "@/components/shared/GemIcon";
import { parseSealId } from "@/lib/seals";

interface TopBarProps {
  gems: number;
  username: string;
  streakDays: number;
  isGuest?: boolean;
  avatarUrl?: string | null;
}

export default function TopBar({
  gems: initialGems,
  username,
  streakDays,
  isGuest = false,
  avatarUrl = null,
}: TopBarProps) {
  const { gems, isInitialized, setWallet } = useWalletStore();

  useEffect(() => {
    if (!isInitialized) {
      setWallet(initialGems);
    }
  }, [initialGems, isInitialized, setWallet]);

  const displayedGems = isInitialized ? gems : initialGems;
  const sealId = parseSealId(avatarUrl);
  const initial = username?.charAt(0)?.toUpperCase() || "H";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 px-safe pt-safe backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:h-14">
        <Link href="/catalogue" className="min-w-0 touch-manipulation">
          <span className="font-display text-xl leading-none tracking-tight">HeroBook</span>
        </Link>

        <div className="flex items-center gap-1">
          {streakDays > 0 && (
            <span className="hidden items-center gap-1 px-2 text-xs text-muted-foreground sm:inline-flex">
              <Flame className="size-3.5 text-orange-400" />
              {streakDays}
            </span>
          )}

          <Link
            href="/shop"
            aria-label={`${displayedGems.toLocaleString("fr-FR")} gemmes — ouvrir la boutique`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-2.5 text-xs font-semibold text-[--hero-gold] touch-manipulation"
          >
            <GemIcon size="sm" title="" />
            <span className="tabular-nums">{displayedGems.toLocaleString("fr-FR")}</span>
          </Link>

          {isGuest && (
            <Link
              href="/register"
              className="hidden px-2 text-[11px] font-medium text-muted-foreground sm:inline"
            >
              Compte
            </Link>
          )}

          <Link
            href="/character"
            aria-label={isGuest ? "Profil invité" : `Profil de ${username}`}
            className="grid size-11 place-items-center touch-manipulation"
          >
            {sealId ? (
              <ReaderSeal id={sealId} size="xs" />
            ) : (
              <span className="grid size-7 place-items-center rounded-full bg-muted text-[11px] font-medium">
                {initial}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
