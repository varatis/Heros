"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpenText, Flame, Gem, Sparkles } from "lucide-react";
import { useWalletStore } from "@/stores/walletStore";

interface TopBarProps {
  gems: number;
  username: string;
  streakDays: number;
  isGuest?: boolean;
}

export default function TopBar({
  gems: initialGems,
  username,
  streakDays,
  isGuest = false,
}: TopBarProps) {
  const { gems, isInitialized, setWallet } = useWalletStore();

  useEffect(() => {
    if (!isInitialized) {
      setWallet(initialGems);
    }
  }, [initialGems, isInitialized, setWallet]);

  const displayedGems = isInitialized ? gems : initialGems;
  const initial = username?.charAt(0)?.toUpperCase() || "H";

  return (
    <header className="sticky top-0 z-40 w-full px-safe pt-safe">
      <div className="mx-auto max-w-5xl px-3 pt-2 sm:px-4">
        <div className="premium-card flex h-14 items-center justify-between rounded-2xl px-3 shadow-2xl backdrop-blur-xl sm:h-16 sm:px-4">
          <Link href="/catalogue" className="flex min-w-0 items-center gap-2.5">
            <div className="relative grid size-10 shrink-0 place-items-center rounded-2xl border border-primary/35 bg-primary/15 text-primary shadow-inner">
              <BookOpenText className="size-5" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[--hero-gold] shadow-[0_0_18px_var(--hero-gold)]" />
            </div>
            <div className="min-w-0 leading-none">
              <div className="gradient-hero text-lg font-black tracking-tight sm:text-xl">
                HeroBook
              </div>
              <div className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Grimoires interactifs
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1.5 text-xs font-bold text-orange-300 sm:flex">
              <Flame className="size-3.5 fill-orange-500 text-orange-500" />
              <span>{streakDays} j</span>
            </div>

            <Link
              href="/shop"
              aria-label="Ouvrir la boutique de gemmes"
              className="group flex items-center gap-1.5 rounded-full border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-2.5 py-1.5 text-xs font-black text-[--hero-gold] transition-all hover:-translate-y-0.5 hover:border-[--hero-gold]/50 hover:bg-[--hero-gold]/15 sm:px-3"
            >
              <Gem className="size-3.5 transition-transform group-hover:rotate-12" />
              <span>{displayedGems.toLocaleString("fr-FR")}</span>
              <Sparkles className="hidden size-3 text-primary sm:block" />
            </Link>

            {isGuest && (
              <Link
                href="/register"
                className="hidden rounded-full border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[--hero-gold] sm:inline-flex"
              >
                Invité
              </Link>
            )}

            <Link
              href={isGuest ? "/register" : "/character"}
              className="group flex items-center gap-2 rounded-full border border-border/55 bg-muted/35 py-1 pl-2 pr-1 transition-colors hover:bg-muted/55"
            >
              <span className="hidden max-w-[110px] truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground sm:inline-block">
                {isGuest ? "Invité" : username}
              </span>
              <div className="grid size-8 place-items-center rounded-full border border-primary/40 bg-gradient-to-br from-primary/35 to-[--hero-gold]/20 text-xs font-black text-primary-foreground shadow-inner">
                {initial}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
