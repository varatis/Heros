"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Flame, Gem, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/stores/walletStore";

interface TopBarProps {
  gems: number;
  username: string;
  streakDays: number;
}

export default function TopBar({
  gems: initialGems,
  username,
  streakDays,
}: TopBarProps) {
  const { gems, isInitialized, setWallet } = useWalletStore();

  // Initialiser le store avec la valeur SSR si pas encore initialisé
  useEffect(() => {
    if (!isInitialized) {
      setWallet(initialGems);
    }
  }, [initialGems, isInitialized, setWallet]);

  const displayedGems = isInitialized ? gems : initialGems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 max-w-4xl mx-auto">
        {/* Logo / Brand */}
        <Link href="/catalogue" className="flex items-center gap-2 font-bold tracking-tight">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="gradient-hero text-lg font-black">HeroBook</span>
        </Link>

        {/* Status / Gamification pills */}
        <div className="flex items-center gap-2">
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streakDays} j</span>
          </div>

          {/* Gems Wallet button */}
          <Link
            href="/shop"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-bold transition-colors shadow-sm"
          >
            <Gem className="w-3.5 h-3.5 text-primary" />
            <span>{displayedGems.toLocaleString("fr-FR")}</span>
            <span className="text-[10px] text-primary/70 font-normal">+</span>
          </Link>

          {/* User profile avatar / pill */}
          <Link
            href="/character"
            className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full hover:bg-muted/50 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block max-w-[100px] truncate">
              {username}
            </span>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
              {username.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
