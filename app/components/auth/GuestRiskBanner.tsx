import Link from "next/link";
import { ShieldAlert, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestRiskBannerProps {
  compact?: boolean;
  className?: string;
}

/**
 * Bandeau « Mode invité » : explique simplement que l'invité peut
 * explorer et jouer aux livres gratuits, mais que rien n'est sauvegardé
 * durablement — la progression est liée au navigateur et effacée à la
 * déconnexion. CTA : créer un compte.
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
          <p className="text-sm font-black text-[--hero-gold]">Mode invité</p>
          <p className="text-xs leading-5 text-muted-foreground">
            {compact
              ? "Explorez librement les livres gratuits — mais rien n'est sauvegardé. Créez un compte pour garder votre progression."
              : "Vous explorez HeroBook sans compte : les livres gratuits sont entièrement jouables, mais votre héros, vos gemmes et vos succès ne sont liés qu'à ce navigateur et seront effacés à la déconnexion. Créez un compte pour les conserver définitivement."}
          </p>
        </div>
      </div>
      <Link href="/register" className="shrink-0">
        <Button className="h-10 w-full rounded-2xl px-4 text-xs font-black sm:w-auto">
          <UserPlus className="size-3.5" />
          Créer un compte
        </Button>
      </Link>
    </div>
  );
}
