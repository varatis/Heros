import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestRiskBannerProps {
  compact?: boolean;
  className?: string;
}

/**
 * Bandeau « Mode invité » : l'invité peut explorer les livres gratuits,
 * mais rien n'est sauvegardé. CTA : créer un compte.
 */
export default function GuestRiskBanner({
  compact = false,
  className,
}: GuestRiskBannerProps) {
  if (compact) {
    return (
      <p
        className={cn(
          "text-xs leading-5 text-muted-foreground",
          className
        )}
      >
        Mode invité — rien n’est sauvegardé.{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-2 hover:underline">
          Créer un compte
        </Link>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">Mode invité</p>
        <p className="text-xs leading-5 text-muted-foreground">
          Les livres gratuits sont jouables, mais votre nom, vos gemmes et
          vos succès disparaîtront à la déconnexion. Créez un compte pour
          les garder.
        </p>
      </div>
      <Link href="/register" className="shrink-0">
        <Button className="h-11 w-full rounded-xl px-4 text-xs font-semibold sm:w-auto">
          Créer un compte
        </Button>
      </Link>
    </div>
  );
}
