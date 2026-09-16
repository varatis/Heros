import type { AdventureState, ItemDef } from "./types";
import { getItem } from "./rules";
import { enduranceMax, habileteCombat, possede, retirerObjet } from "./engine";

export type ItemPhase = "lecture" | "preparation" | "combat" | "apres-combat";
export interface ItemHelp {
  effect: string;
  timing: string;
  storage: string;
  note?: string;
}

/** Explains implemented effects, not extra bonuses inferred from flavour text. */
export function describeItem(item: ItemDef): ItemHelp {
  const storage =
    item.slot === "arme"
      ? "Armes · 2 emplacements"
      : item.slot === "sac"
        ? "Sac à dos · 1 place par exemplaire, 8 au maximum"
        : item.slot === "special"
          ? "Objets spéciaux · ne prend pas de place dans le sac"
          : "Bourse · 50 pièces d’or au maximum";
  if (item.slot === "arme")
    return {
      storage,
      effect: "Évite le malus de −4 Habileté du combat à mains nues.",
      timing: "À sélectionner avant le premier assaut.",
      note: "La Maîtrise des Armes ajoute +2 si cette arme est votre spécialité. Les descriptions ne donnent pas d’autres bonus de dégâts.",
    };
  if (item.effet?.permanent)
    return {
      storage,
      effect: [
        item.effet.endurance
          ? `+${item.effet.endurance} Endurance maximale`
          : "",
        item.effet.habilete ? `+${item.effet.habilete} Habileté` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      timing: "Bonus automatique tant que vous possédez l’objet.",
      note: item.effet.endurance
        ? "Augmente le maximum, sans soigner automatiquement les blessures déjà subies."
        : "Déjà inclus dans l’Habileté affichée : ne l’ajoutez pas une deuxième fois.",
    };
  if (item.effet?.consommable && item.effet.endurance)
    return {
      storage,
      effect: `Récupère jusqu’à ${item.effet.endurance} points d’Endurance, sans dépasser votre maximum.`,
      timing: "Après un combat remporté, avant de poursuivre le récit.",
      note: "Une utilisation consomme un flacon. Aucun flacon n’est utilisé si vous êtes déjà au maximum.",
    };
  if (item.id === "potion-alether")
    return {
      storage,
      effect: "+2 Habileté pour un seul combat (effet prévu).",
      timing: "Activation non disponible dans le moteur actuel.",
      note: "Conservée dans le sac. Aucun bonus n’est appliqué et aucun bouton de consommation n’est proposé.",
    };
  if (item.id === "repas")
    return {
      storage,
      effect:
        "Évite la perte de 3 points d’Endurance lorsqu’un repas est exigé.",
      timing: "Consommé automatiquement par le récit, seulement si nécessaire.",
      note: "La Discipline de la Chasse peut éviter cette consommation lorsque le paragraphe le permet. Un repas ne soigne pas.",
    };
  if (item.slot === "or" || item.slot === "bourse")
    return {
      storage,
      effect: `Ajoute ${item.valeurOr ?? 1} pièce(s) d’or, dans la limite de la bourse.`,
      timing: "Ajout automatique lors de la découverte.",
    };
  if (["glaive-sommer", "lance-magique"].includes(item.id))
    return {
      storage,
      effect:
        "Les propriétés d’arme décrites ne sont pas activées dans le moteur actuel.",
      timing: "Objet conservé, sans bonus de combat appliqué.",
      note: "La description narrative ne doit pas être confondue avec un effet déjà calculé.",
    };
  return {
    storage,
    effect: "Objet utile aux choix du récit, sans bonus chiffré automatique.",
    timing: "Les choix qui le nécessitent indiquent son nom.",
    note:
      item.id === "torche"
        ? "Peut annuler le malus du Gluatre quand le combat le prévoit. Elle ne donne pas un bonus général d’Habileté."
        : "Pas de consommation libre depuis le sac. L’objet intervient lorsque le paragraphe le demande.",
  };
}

export function healingAction(
  state: AdventureState,
  itemId: string,
  phase: ItemPhase,
) {
  const item = getItem(itemId);
  const gain = Math.max(
    0,
    Math.min(
      item?.effet?.endurance ?? 0,
      enduranceMax(state) - state.enduranceActuelle,
    ),
  );
  const reason =
    !item?.effet?.consommable || !item.effet.endurance
      ? "Cet objet n’est pas une potion de soin."
      : !state.sac.includes(itemId)
        ? "Vous ne possédez plus ce flacon."
        : state.enduranceActuelle <= 0
          ? "Votre aventure est terminée."
          : phase !== "apres-combat"
            ? "Utilisable après une victoire, avant de continuer."
            : gain === 0
              ? "Votre Endurance est déjà au maximum."
              : null;
  return { allowed: reason === null, reason, gain };
}

/** Validate again at execution time; stale UI cannot consume a missing item. */
export function consumeHealingPotion(
  state: AdventureState,
  itemId: string,
  phase: ItemPhase,
) {
  const action = healingAction(state, itemId, phase);
  if (!action.allowed) return { state, gain: 0, used: false };
  const next = structuredClone(state);
  retirerObjet(next, itemId);
  next.enduranceActuelle += action.gain;
  return { state: next, gain: action.gain, used: true };
}

export function weaponAction(
  state: AdventureState,
  itemId: string,
  phase: ItemPhase,
) {
  const item = getItem(itemId);
  const allowed =
    !!item &&
    item.slot === "arme" &&
    possede(state, itemId) &&
    phase !== "combat" &&
    state.enduranceActuelle > 0 &&
    state.armeEnMain !== itemId;
  const next = { ...state, armeEnMain: itemId };
  return {
    allowed,
    delta: allowed
      ? habileteCombat(next).total - habileteCombat(state).total
      : 0,
    reason:
      phase === "combat"
        ? "Changement d’arme verrouillé pendant le combat."
        : state.armeEnMain === itemId
          ? "Cette arme est déjà en main."
          : "",
  };
}
