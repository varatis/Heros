import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestRiskBannerProps {
  compact?: boolean;
  className?: string;
}

/**
 * Rappel visuel : un invité peut perdre gemmes, succès et achats
 * s'il perd sa session. CTA vers /register (conversion du compte anonyme).
 */
export default function GuestRiskBanner({
  compact = false,
  className,
}: GuestRiskBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-[--hero-gold]/35 bg-[--hero-gold]/10 p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[--hero-gold]/30 bg-background/40 text-[--hero-gold]">
          <ShieldAlert className="size-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-black text-[--hero-gold]">Session invité</p>
          <p className="text-xs leading-5 text-muted-foreground">
            {compact
              ? "Créez un compte pour ne pas perdre gemmes, progrès et achats."
              : "Vous pouvez jouer gratuitement. En revanche, gemmes, succès et achats réels sont liés à cette session : un compte les sécurise définitivement."}
          </p>
        </div>
      </div>
      <Link href="/register" className="shrink-0">
        <Button className="h-10 w-full rounded-2xl px-4 text-xs font-black sm:w-auto">
          Créer un compte pour sécuriser mes achats
        </Button>
      </Link>
    </div>
  );
}
