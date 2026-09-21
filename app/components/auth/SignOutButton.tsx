"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Loader2,
  LogOut,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

/**
 * Bouton de déconnexion (mobile-first) :
 *
 *  - Session permanente : simple signOut local → redirection /login.
 *  - Session invité : une boîte de dialogue stylée explique que la
 *    progression va être effacée, avec deux choix :
 *      · Sécuriser mon compte (renvoie vers /login?mode=signup pour
 *        lier email/OAuth et conserver l'UUID),
 *      · Se déconnecter quand même (purge l'utilisateur anonyme).
 *
 * Plus de window.confirm — dialog shadcn cohérent avec le design system.
 */
export default function SignOutButton({
  isGuest = false,
  className,
  iconOnly = false,
}: {
  isGuest?: boolean;
  className?: string;
  /** Icône seule (en-tête) : le libellé est masqué, accessibilité conservée. */
  iconOnly?: boolean;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function openConfirm() {
    if (loading) return;
    if (isGuest) {
      setConfirmOpen(true);
    } else {
      doSignOut(false);
    }
  }

  async function doSignOut(purgeGuest: boolean) {
    setLoading(true);
    try {
      if (isGuest && purgeGuest) {
        try {
          await supabase.rpc("purge_anonymous_user" as any);
        } catch {
          // RPC absente (migration 020 pas déployée) → on continue.
        }
      }
    } catch {
      /* ignore */
    }

    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      /* session déjà morte */
    }

    // Nettoyage du profil local si invité purgé
    if (isGuest && purgeGuest && typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("herobook_hero_profile");
      } catch {
        /* ignore */
      }
    }

    window.location.href = isGuest ? "/login?guest=closed" : "/login";
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={iconOnly ? "icon" : "sm"}
        onClick={openConfirm}
        disabled={loading}
        aria-label={iconOnly ? "Se déconnecter" : undefined}
        title={iconOnly ? "Se déconnecter" : undefined}
        className={cn(
          "gap-1.5 text-xs text-muted-foreground hover:text-destructive",
          iconOnly && "gap-0",
          className,
        )}
      >
        {loading ? (
          <Loader2
            className={cn("size-3.5 animate-spin", iconOnly && "size-[18px]")}
          />
        ) : (
          <LogOut className={cn("size-3.5", iconOnly && "size-[18px]")} />
        )}
        {iconOnly ? (
          <span className="sr-only">
            {loading ? "Déconnexion…" : "Se déconnecter"}
          </span>
        ) : (
          <span>{loading ? "Déconnexion…" : "Déconnexion"}</span>
        )}
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[22.5rem] gap-0 overflow-hidden rounded-[1.75rem] border border-border/60 bg-popover p-0">
          <div className="relative overflow-hidden px-5 pb-2 pt-7 sm:px-6 sm:pt-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.75_0.18_30/0.20),transparent_70%)]" />
            <div className="relative text-center space-y-3">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/12 text-amber-400">
                <AlertTriangle className="size-7" strokeWidth={1.75} />
              </div>
              <DialogTitle className="font-display text-xl leading-tight">
                Déconnexion invité
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                Votre progression (héros, gemmes, marques-pages, succès)
                n'est pas liée à un compte. Si vous vous déconnectez,
                elle sera <strong className="text-destructive">définitivement perdue</strong>.
              </DialogDescription>
            </div>
          </div>

          <ul className="mx-5 mt-4 space-y-2 rounded-2xl border border-border/50 bg-muted/25 px-3.5 py-3 sm:mx-6 text-xs text-foreground/90">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-emerald-400" />
              Sécurisez votre compte en 30 secondes pour tout garder.
            </li>
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
            <a
              href="/login?mode=signup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              <ShieldCheck className="size-4" />
              Sécuriser mon compte
            </a>
            <Button
              variant="destructive"
              className="h-11 w-full rounded-2xl text-sm font-medium"
              onClick={() => doSignOut(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="size-4" />
                  Se déconnecter quand même
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-full rounded-2xl text-sm text-muted-foreground"
              onClick={() => setConfirmOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
