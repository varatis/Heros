import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestRiskBannerProps {
  compact?: boolean;
  className?: string;
}

/**
 * Bandeau « Mode invité » : l'invité joue avec un compte anonyme persistant
 * sur son appareil (Supabase anonymous), mais rien ne sera restauré si il
 * réinstalle l'app ou change de téléphone. CTA : lier un compte.
 */
export default function GuestRiskBanner({
  compact = false,
  className,
}: GuestRiskBannerProps) {
  if (compact) {
    return (
      <p
        className={cn("text-xs leading-5 text-muted-foreground", className)}
      >
        Mode invité — progression sur cet appareil seulement.{" "}
        <Link
          href="/login?mode=signup"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sécuriser mon compte
        </Link>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-emerald-900/40 bg-emerald-950/30 p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-emerald-200">Mode invité</p>
        <p className="text-xs leading-5 text-emerald-100/80">
          Votre progression, vos gemmes et vos succès sont sauvegardés sur
          cet appareil. Liez un compte (Apple, Google ou email) pour les
          retrouver partout.
        </p>
      </div>
      <Link href="/login?mode=signup" className="shrink-0">
        <Button className="h-11 w-full rounded-xl px-4 text-xs font-semibold sm:w-auto">
          Sécuriser mon compte
        </Button>
      </Link>
    </div>
  );
}
