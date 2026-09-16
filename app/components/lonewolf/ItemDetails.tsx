"use client";
import ItemIcon from "./ItemIcon";
import { Backpack, Clock3, Sparkles, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  describeItem,
  healingAction,
  weaponAction,
  type ItemPhase,
} from "@/lib/lonewolf/item-help";
import { getItem } from "@/lib/lonewolf/rules";
import { enduranceMax } from "@/lib/lonewolf/engine";
import type { AdventureState, ItemDef } from "@/lib/lonewolf/types";

export function ItemEffectSummary({ item }: { item: ItemDef }) {
  const help = describeItem(item);
  return (
    <dl className="space-y-4 text-left text-sm leading-6">
      {[
        { label: "Effet", text: help.effect, icon: Sparkles },
        { label: "Quand l’utiliser", text: help.timing, icon: Clock3 },
        { label: "Rangement", text: help.storage, icon: Backpack },
      ].map(({ label, text, icon: Icon }) => (
        <div key={label} className="flex gap-3">
          <Icon className="size-4 shrink-0 text-primary mt-1" />
          <div>
            <dt className="font-semibold">{label}</dt>
            <dd className="text-muted-foreground">{text}</dd>
          </div>
        </div>
      ))}
      {help.note && (
        <div className="border-t border-border pt-3">
          <dt className="sr-only">À savoir</dt>
          <dd className="text-muted-foreground">{help.note}</dd>
        </div>
      )}
    </dl>
  );
}

export default function ItemDetails({
  itemId,
  state,
  phase,
  onClose,
  onHeal,
  onEquip,
}: {
  itemId: string | null;
  state: AdventureState;
  phase: ItemPhase;
  onClose: () => void;
  onHeal?: (id: string) => void;
  onEquip?: (id: string) => void;
}) {
  const item = itemId ? getItem(itemId) : undefined;
  if (!item) return null;
  const quantity = [
    ...state.mains,
    ...state.sac,
    ...state.objetsSpeciaux,
  ].filter((id) => id === item.id).length;
  const heal = healingAction(state, item.id, phase);
  const weapon = weaponAction(state, item.id, phase);
  const isHealing = !!item.effet?.consommable && !!item.effet.endurance;
  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="reader-dialog sm:max-w-lg">
        <div className="flex items-center gap-4 pr-9">
          <span
            aria-hidden="true"
            className="text-4xl rounded-2xl bg-primary/10 p-3"
          >
            <ItemIcon item={item} />
          </span>
          <div>
            <p className="eyebrow mb-2">{quantity} exemplaire(s)</p>
            <DialogTitle className="text-2xl leading-tight">
              {item.nom}
            </DialogTitle>
          </div>
        </div>
        <DialogDescription className="leading-6">
          {item.description}
        </DialogDescription>
        <ItemEffectSummary item={item} />
        {item.effet?.permanent && quantity > 0 && (
          <p className="flex items-start gap-2 bg-hero-emerald/10 p-3 rounded-xl text-hero-emerald text-sm">
            <Check className="size-4 shrink-0 mt-0.5" />
            Bonus déjà appliqué à votre héros
            {item.effet.endurance
              ? ` · maximum ${enduranceMax(state)} Endurance`
              : ""}
            .
          </p>
        )}
        {isHealing && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              {heal.allowed
                ? `Maintenant : ${state.enduranceActuelle} → ${state.enduranceActuelle + heal.gain} / ${enduranceMax(state)} Endurance. Un flacon sera consommé.`
                : heal.reason}
            </p>
            <button
              disabled={!onHeal || !heal.allowed}
              onClick={() => {
                onHeal?.(item.id);
                onClose();
              }}
              className="action-link w-full disabled:opacity-50"
            >
              Boire · récupérer {heal.gain} Endurance
            </button>
            {!onHeal && (
              <p className="text-xs text-muted-foreground">
                Consultez votre inventaire dans l’aventure pour utiliser un
                objet.
              </p>
            )}
          </div>
        )}
        {item.slot === "arme" && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              {weapon.allowed
                ? `Variation d’Habileté avec cette arme : ${weapon.delta >= 0 ? "+" : ""}${weapon.delta} (hors particularités de l’ennemi).`
                : weapon.reason}
            </p>
            <button
              disabled={!onEquip || !weapon.allowed}
              onClick={() => {
                onEquip?.(item.id);
                onClose();
              }}
              className="action-link w-full disabled:opacity-50"
            >
              {state.armeEnMain === item.id
                ? "Déjà en main"
                : "Prendre cette arme en main"}
            </button>
          </div>
        )}
        <button
          className="action-link action-secondary w-full"
          onClick={onClose}
        >
          Fermer la fiche
        </button>
      </DialogContent>
    </Dialog>
  );
}
