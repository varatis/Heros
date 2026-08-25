"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookMarked, Gem, ShieldCheck, UserRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SecureAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `block` = achat réel (RevenueCat) — pas de contournement. */
  mode: "block" | "warn";
  onContinueAsGuest?: () => void;
}

export default function SecureAccountModal({
  open,
  onOpenChange,
  mode,
  onContinueAsGuest,
}: SecureAccountModalProps) {
  const isBlock = mode === "block";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[22.5rem] gap-0 overflow-hidden rounded-[1.75rem] border border-border/60 bg-popover p-0 sm:max-w-md",
          "shadow-[0_24px_80px_oklch(0.04_0.015_175/0.55)]"
        )}
        showCloseButton
      >
        <div className="relative overflow-hidden px-5 pb-1 pt-7 sm:px-6 sm:pt-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.83_0.14_80/0.14),transparent_70%)]" />

          <div className="relative text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[--hero-gold]/30 bg-[--hero-gold]/12 text-[--hero-gold]">
              {isBlock ? (
                <ShieldCheck className="size-7" strokeWidth={1.75} />
              ) : (
                <UserRound className="size-7" strokeWidth={1.75} />
              )}
            </div>

            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {isBlock ? "Compte requis" : "Mode invité"}
            </p>
            <DialogTitle className="mt-1.5 font-display text-2xl leading-tight text-balance">
              {isBlock ? "Liez vos achats à un compte" : "Gardez votre bibliothèque"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {isBlock
                ? "Les paiements App Store / Google Play ne sont pas disponibles en invité. Un compte protège gemmes et livres si l’appareil change."
                : "Sans compte, gemmes et livres restent liés à cette session. Créez un compte en 30 secondes pour ne rien perdre."}
            </DialogDescription>
          </div>
        </div>

        <ul className="mx-5 mt-4 space-y-2 rounded-2xl border border-border/50 bg-muted/25 px-3.5 py-3 sm:mx-6">
          <Benefit icon={<Gem className="size-3.5" />} label="Gemmes et achats sauvegardés" />
          <Benefit icon={<BookMarked className="size-3.5" />} label="Progression sur tous vos appareils" />
          <Benefit icon={<ShieldCheck className="size-3.5" />} label="Récupération si vous changez de téléphone" />
        </ul>

        <div className="mt-4 flex flex-col gap-2 border-t border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-12 w-full rounded-2xl text-sm font-semibold"
            )}
          >
            Créer un compte
          </Link>

          {!isBlock && onContinueAsGuest ? (
            <Button
              variant="outline"
              className="h-11 w-full rounded-2xl text-sm font-medium"
              onClick={onContinueAsGuest}
            >
              Continuer l’achat sans compte
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="h-10 w-full rounded-2xl text-sm text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Plus tard
            </Button>
          )}

          {!isBlock && (
            <p className="text-center text-[10px] leading-4 text-muted-foreground/75">
              Vous pourrez toujours sécuriser votre compte après l’achat.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Benefit({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-xs text-foreground/90">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[--hero-gold]/10 text-[--hero-gold]">
        {icon}
      </span>
      {label}
    </li>
  );
}
