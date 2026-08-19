"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, Sparkles, Gift, Check } from "lucide-react";
import { useWalletStore } from "@/stores/walletStore";
import { invokeGrantDailyReward } from "@/lib/supabase/functions";

interface DailyRewardCardProps {
  streakDays: number;
  claimedToday: boolean;
}

/**
 * Récompense quotidienne — cliquable une fois par jour.
 * Toute la logique (idempotence, streak, crédit) est exécutée par
 * l'Edge Function `grant-daily-reward` + la fonction SQL atomique
 * `claim_daily_reward` (migration 004). Ce composant n'affiche que
 * la réponse du serveur.
 */
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

  // Récompense du jour (formule miroir de claim_daily_reward, affichage seul)
  const todayReward = claimed
    ? 0
    : 10 + (Math.min(streak + 1, 8) - 1) * 2;

  async function handleClaim() {
    if (loading || claimed) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await invokeGrantDailyReward();

      setStreak(res.streak_days);
      setClaimed(true);

      if (!res.already_claimed && res.reward_gems > 0) {
        setMessage(
          `+${res.reward_gems} 💎 et +${res.reward_coins} 🪙 ! À demain, Héros !`
        );
        if (res.gems !== null && res.gems !== undefined) {
          setWallet(res.gems, res.coins ?? 0);
        }
      } else {
        setMessage("Récompense déjà réclamée aujourd'hui.");
      }

      // Rafraîchir les données serveur (TopBar : gemmes + streak)
      router.refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Erreur lors de la réclamation."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[--hero-gold]/30 bg-gradient-to-br from-amber-500/10 via-card/80 to-background p-5 sm:p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[--hero-gold]/15 border border-[--hero-gold]/30 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-[--hero-gold]" />
          </div>
          <div>
            <h2 className="font-black text-sm sm:text-base flex items-center gap-2">
              Trésor quotidien
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[10px] font-bold">
                <Flame className="w-3 h-3" />
                {streak} j
              </span>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Revenez chaque jour : la récompense augmente avec votre streak.
            </p>
          </div>
        </div>

        {claimed ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[--hero-emerald]/15 border border-[--hero-emerald]/30 text-[--hero-emerald] text-xs font-bold shrink-0">
            <Check className="w-4 h-4" />
            Reçu !
          </div>
        ) : (
          <Button
            onClick={handleClaim}
            disabled={loading}
            className="font-bold text-xs gap-1.5 shrink-0 glow-gold bg-[--hero-gold] text-black hover:bg-[--hero-gold]/90"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Réclamer +{todayReward} 💎
              </>
            )}
          </Button>
        )}
      </div>

      {message && (
        <div className="px-3 py-2 rounded-xl bg-[--hero-emerald]/10 border border-[--hero-emerald]/25 text-[--hero-emerald] text-xs font-bold text-center">
          {message}
        </div>
      )}
    </div>
  );
}
