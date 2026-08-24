"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Flame, Gift, Loader2, Sparkles } from "lucide-react";
import { useWalletStore } from "@/stores/walletStore";
import { invokeGrantDailyReward } from "@/lib/supabase/functions";

interface DailyRewardCardProps {
  streakDays: number;
  claimedToday: boolean;
}

export default function DailyRewardCard({
  streakDays: initialStreak,
  claimedToday,
}: DailyRewardCardProps) {
  const router = useRouter();
  const setWallet = useWalletStore((s) => s.setWallet);
  const [streak, setStreak] = useState(initialStreak);
  const [claimed, setClaimed] = useState(claimedToday);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const todayReward = claimed ? 0 : 10 + (Math.min(streak + 1, 8) - 1) * 2;

  async function handleClaim() {
    if (loading || claimed) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await invokeGrantDailyReward();
      setStreak(res.streak_days);
      setClaimed(true);

      if (!res.already_claimed && res.reward_gems > 0) {
        setMessage(`+${res.reward_gems} 💎 et +${res.reward_coins} 🪙 ! À demain, Héros !`);
        if (res.gems !== null && res.gems !== undefined) {
          setWallet(res.gems, res.coins ?? 0);
        }
      } else {
        setMessage("Récompense déjà réclamée aujourd'hui.");
      }

      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur lors de la réclamation.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[--hero-gold]/35 bg-[--hero-gold]/12 shadow-inner">
            <Gift className="size-5 text-[--hero-gold]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-normal">Chaque jour</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                <Flame className="size-3 fill-orange-500 text-orange-500" />
                {streak} j
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Une petite récompense pour rouvrir le livre. La série augmente le gain.
            </p>
          </div>
        </div>

        {claimed ? (
          <div className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[--hero-emerald]/30 bg-[--hero-emerald]/15 px-4 py-2 text-xs font-black text-[--hero-emerald]">
            <Check className="size-4" /> Déjà reçu
          </div>
        ) : (
          <Button
            onClick={handleClaim}
            disabled={loading}
            className="h-10 shrink-0 rounded-xl bg-[--hero-gold] px-4 text-xs font-semibold text-black hover:bg-[--hero-gold]/90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="size-4" />
                Réclamer +{todayReward} 💎
              </>
            )}
          </Button>
        )}
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-[--hero-emerald]/25 bg-[--hero-emerald]/10 px-3 py-2 text-center text-xs font-medium text-[--hero-emerald]">
          {message}
        </div>
      )}
    </div>
  );
}
