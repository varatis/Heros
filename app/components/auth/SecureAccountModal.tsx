"use client";

import Link from "next/link";
import { ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
        className="max-w-md gap-5 rounded-[1.75rem] border border-[--hero-gold]/30 bg-popover p-5 sm:p-6"
        showCloseButton
      >
        <DialogHeader className="space-y-3">
          <div className="grid size-12 place-items-center rounded-2xl border border-[--hero-gold]/35 bg-[--hero-gold]/12 text-[--hero-gold]">
            <ShieldAlert className="size-6" />
          </div>
          <DialogTitle className="text-xl font-black tracking-tight">
            {isBlock ? "Compte requis pour payer" : "Sécurisez d’abord vos achats"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            {isBlock
              ? "Les paiements réels (App Store / Google Play) ne sont pas autorisés en mode invité. Sans compte, vous perdriez gemmes et achats si la session disparaît."
              : "Vous jouez en invité. Un achat de gemmes reste lié à cette session volatile. Créez un compte pour conserver votre trésor — ou continuez uniquement pour tester."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mx-0 mb-0 flex-col gap-2 rounded-none border-0 bg-transparent p-0 sm:flex-col">
          <Link href="/register" className="w-full">
            <Button className="h-11 w-full rounded-2xl font-black glow-purple">
              <Sparkles className="size-4" />
              Créer un compte pour sécuriser mes achats
            </Button>
          </Link>
          {!isBlock && onContinueAsGuest ? (
            <Button
              variant="outline"
              className="h-11 w-full rounded-2xl font-bold"
              onClick={onContinueAsGuest}
            >
              Continuer sans compte
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="h-10 w-full rounded-2xl text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Plus tard
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
