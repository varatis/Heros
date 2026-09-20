"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStreak, isAtRisk, isBroken, type StreakData } from "@/lib/streak";

export default function StreakFlame({ compact = false }: { compact?: boolean }) {
  const [streak, setStreak] = useState<StreakData>(() => getStreak());

  useEffect(() => {
    setStreak(getStreak());
    const onUpdate = () => setStreak(getStreak());
    window.addEventListener("herobook_streak_updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    const id = setInterval(onUpdate, 60_000); // refresh atRisk state
    return () => {
      window.removeEventListener("herobook_streak_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
      clearInterval(id);
    };
  }, []);

  const atRisk = isAtRisk(streak);
  const broken = isBroken(streak) && streak.current > 0;
  const show = streak.current > 0 || atRisk;

  if (!show && streak.current === 0 && !compact) {
    // Empty state still shows 0 with muted
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5"
        aria-label="Braise Kaï : 0 jour"
        title="Commence ta série : lis un paragraphe aujourd'hui"
      >
        <Flame size={16} className="text-white/30" />
        <span className="text-xs font-bold tabular-nums text-muted-foreground">0</span>
      </div>
    );
  }

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold tabular-nums",
          atRisk
            ? "border-orange-400/40 bg-orange-500/15 text-orange-300"
            : broken
              ? "border-white/10 bg-white/5 text-muted-foreground"
              : "border-[#dfbb78]/30 bg-[#dfbb78]/10 text-[#dfbb78]"
        )}
        aria-label={`Braise ${streak.current} jours`}
      >
        <Flame size={14} className={cn(atRisk ? "braise-flame--urgent" : "braise-flame")} />
        {streak.current}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
        atRisk
          ? "border-orange-400/50 bg-orange-500/15 braise-glow"
          : broken
            ? "border-white/10 bg-white/[0.04]"
            : "border-[#dfbb78]/30 bg-[#dfbb78]/10"
      )}
      aria-label={`Braise Kaï : ${streak.current} jours, record ${streak.best}`}
      title={atRisk ? "Ta braise vacille — lis un paragraphe avant minuit !" : `Série : ${streak.current} jours · Record ${streak.best}`}
    >
      <span className={cn("grid h-7 w-7 place-items-center rounded-full", atRisk ? "bg-orange-500/20" : "bg-[#dfbb78]/15")}>
        <Flame size={16} className={cn(atRisk ? "text-orange-400 braise-flame--urgent" : broken ? "text-white/40" : "text-[#dfbb78] braise-flame")} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-[13px] font-extrabold tabular-nums", atRisk ? "text-orange-300" : broken ? "text-muted-foreground" : "text-[#dfbb78]")}>
          {streak.current} <span className="font-semibold text-[11px]">{streak.current > 1 ? "jours" : "jour"}</span>
        </span>
        {!compact && <span className="text-[10px] leading-none text-muted-foreground/80">Braise Kaï · rec. {streak.best}</span>}
      </span>
      {streak.freezes > 0 && (
        <span className="ml-1 hidden items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70 sm:inline-flex" title={`${streak.freezes} talisman(s) de gel`}>
          ❄️ {streak.freezes}
        </span>
      )}
    </div>
  );
}
