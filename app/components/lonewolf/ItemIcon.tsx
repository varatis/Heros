import {
  Axe,
  Sword,
  FlaskConical,
  Utensils,
  Shield,
  Map,
  KeyRound,
  Gem,
  ScrollText,
  Flame,
  Package,
  Coins,
  Star,
} from "lucide-react";
import { ITEM_ILLUSTRATIONS } from "@/content/lonewolf/ls01/illustrations";
import type { ItemDef } from "@/lib/lonewolf/types";
/** Vector icons stay legible on mobile platforms without an emoji font. */
export default function ItemIcon({
  item,
  className = "size-7",
}: {
  item: ItemDef;
  className?: string;
}) {
  const source = ITEM_ILLUSTRATIONS[item.id];
  if (source)
    return (
      <img
        src={source}
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        className={`${className} object-contain shrink-0 rounded-sm bg-[#e9e5db]`}
      />
    );
  const Icon =
    item.slot === "arme"
      ? item.id === "hache"
        ? Axe
        : Sword
      : item.tag?.startsWith("potion-")
        ? FlaskConical
        : item.id === "repas"
          ? Utensils
          : item.effet?.permanent
            ? Shield
            : item.id.startsWith("cle-")
              ? KeyRound
              : item.id === "gemme-vordak"
                ? Gem
                : item.id === "cristal-etoile"
                  ? Star
                  : item.id === "carte-sommerlund"
                    ? Map
                    : item.id === "message"
                      ? ScrollText
                      : item.id === "torche" || item.id === "briquet"
                        ? Flame
                        : item.slot === "or" || item.slot === "bourse"
                          ? Coins
                          : Package;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
