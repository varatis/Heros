// ============================================================
// HeroBook — `_shared/arrival.ts` — v2 : Vie / Armure / Attaque
// ------------------------------------------------------------
// Règles d'arrivée pilotées par story_nodes.metadata :
//
//   on_arrive: {
//     hp_delta?: number
//     armor_delta?: number
//     attack_delta?: number
//     skill_delta?: number      (compat Loup Solitaire)
//     hp_to_max?: boolean
//     meal_required?: boolean   (Loup Solitaire)
//     add_items?: [{slug, qty?}]
//     remove_items?: [slug]
//     lose_backpack?: boolean
//     lose_weapons?: boolean
//     choose_loss?: {kind: "backpack_item"|"weapon", fallback?: "weapon",
//                    optional?: boolean}   (perte désignée par le joueur,
//                    §§144/277 — l'appelant fournit designatedLossItemId)
//     message?: string
//   }
//
// Nouveau système générique (toutes les nouvelles histoires) :
//   Vie     = hp_current / hp_max
//   Armure  = armor  (réduit dégâts reçus)
//   Attaque = attack_power (augmente dégâts infligés)
//   Sacoche vide au début, remplie pendant l'aventure,
//   cloisonnée par story_id (voir migration 021).
//
// Loup Solitaire conserve ses règles via strength/agility.
// ============================================================

import type { createAdminClient } from "./supabase.ts";

type Admin = ReturnType<typeof createAdminClient>;

export interface StatsRowMutable {
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
  armor: number;
  attack_power: number;
  narrative_flags: Record<string, unknown> | null;
  [key: string]: unknown;
}

export const GOLD_SLUG = "couronnes";
export const GOLD_CAP = 50;
export const MEAL_SLUG = "repas";
export const STARVATION_PENALTY = 3;

export const BACKPACK_SLUGS = [
  "repas",
  "torches",
  "briquet-amadou",
  "laumspur",
  "sac-a-dos",
  "cellule-energie",
  "kit-medical",
  "ration-survie",
];

// Contenu du Sac à Dos (le Sac lui-même n'est pas « contenu dans » le Sac) :
// ce que le voleur du §144 peut dérober « parmi les objets contenus dans
// votre Sac à Dos ».
export const BACKPACK_CONTENT_SLUGS = BACKPACK_SLUGS.filter(
  (s) => s !== "sac-a-dos",
);

function normalizeFlagKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/^discipline_/, "")
    .replace("sixième", "sixieme")
    .replace("six_cieme", "sixieme")
    .replace(/[^a-z]/g, "");
}

export function hasNarrativeFlag(
  flags: Record<string, unknown> | null | undefined,
  wanted: string,
): boolean {
  if (!flags) return false;
  const want = normalizeFlagKey(wanted);
  for (const [key, value] of Object.entries(flags)) {
    if (normalizeFlagKey(key) === want) return Boolean(value);
  }
  return false;
}

// ------------------------------------------------------------
// Inventaire par aventure (story_id)
// ------------------------------------------------------------
export async function addItemQuantity(
  admin: Admin,
  userId: string,
  itemId: string,
  qty: number,
  storyId: string,
): Promise<{ message: string | null; itemSlug: string | null }> {
  if (qty <= 0) return { message: null, itemSlug: null };

  const { data: item } = await admin
    .from("items")
    .select("slug, name")
    .eq("id", itemId)
    .maybeSingle();
  const slug = (item?.slug as string) ?? null;
  const name = (item?.name as string) ?? "Objet";

  // Recherche dans la sacoche de CETTE aventure
  const { data: existing } = await admin
    .from("user_inventory")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("story_id", storyId)
    .maybeSingle();

  let newQty = (existing?.quantity ?? 0) + qty;
  let capped = false;
  if (slug === GOLD_SLUG && newQty > GOLD_CAP) {
    newQty = GOLD_CAP;
    capped = true;
  }

  if (existing) {
    await admin
      .from("user_inventory")
      .update({ quantity: newQty })
      .eq("id", existing.id);
  } else {
    await admin.from("user_inventory").insert({
      user_id: userId,
      item_id: itemId,
      quantity: newQty,
      story_id: storyId,
    });
  }

  const qtyLabel = qty > 1 ? ` ×${qty}` : "";
  const capLabel = capped ? ` (bourse pleine : ${GOLD_CAP} max)` : "";
  return {
    message: `🎁 ${name}${qtyLabel}${capLabel}`,
    itemSlug: slug,
  };
}

export async function removeItemQuantity(
  admin: Admin,
  userId: string,
  itemId: string,
  qty: number,
  storyId?: string,
): Promise<string | null> {
  if (qty <= 0) return null;

  let query = admin
    .from("user_inventory")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (storyId) {
    query = query.eq("story_id", storyId);
  }

  const { data: existing } = await query.maybeSingle();
  if (!existing || existing.quantity <= 0) {
    // Fallback global si pas trouvé en story (compat)
    if (storyId) {
      const { data: fallback } = await admin
        .from("user_inventory")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .is("story_id", null)
        .maybeSingle();
      if (!fallback) return null;
      const remaining = fallback.quantity - qty;
      if (remaining <= 0) {
        await admin.from("user_inventory").delete().eq("id", fallback.id);
      } else {
        await admin
          .from("user_inventory")
          .update({ quantity: remaining })
          .eq("id", fallback.id);
      }
    } else {
      return null;
    }
  } else {
    const remaining = existing.quantity - qty;
    if (remaining <= 0) {
      await admin.from("user_inventory").delete().eq("id", existing.id);
    } else {
      await admin
        .from("user_inventory")
        .update({ quantity: remaining })
        .eq("id", existing.id);
    }
  }

  const { data: item } = await admin
    .from("items")
    .select("name")
    .eq("id", itemId)
    .maybeSingle();
  const name = (item?.name as string) ?? "Objet";
  return qty > 1 ? `💸 ${name} (-${qty})` : `💸 ${name} retiré`;
}

export async function destroyBackpack(
  admin: Admin,
  userId: string,
  storyId: string,
): Promise<string[]> {
  const { data: rows } = await admin
    .from("user_inventory")
    .select("id, items!inner(slug, name)")
    .eq("user_id", userId)
    .eq("story_id", storyId)
    .in("items.slug", BACKPACK_SLUGS);
  if (!rows || rows.length === 0) return [];
  const lostNames: string[] = [];
  for (const row of rows as unknown as Array<{
    id: string;
    items: { slug: string; name: string };
  }>) {
    lostNames.push(row.items.name);
    await admin.from("user_inventory").delete().eq("id", row.id);
  }
  return [`🎒 Sac à Dos détruit : ${lostNames.join(", ")} perdu(s) !`];
}

export async function destroyWeapons(
  admin: Admin,
  userId: string,
  storyId: string,
): Promise<string[]> {
  const { data: rows } = await admin
    .from("user_inventory")
    .select("id, items!inner(name, item_type)")
    .eq("user_id", userId)
    .eq("story_id", storyId)
    .eq("items.item_type", "weapon");
  if (!rows || rows.length === 0) return [];
  const lostNames: string[] = [];
  for (const row of rows as unknown as Array<{
    id: string;
    items: { name: string };
  }>) {
    lostNames.push(row.items.name);
    await admin.from("user_inventory").delete().eq("id", row.id);
  }
  return [`⚔️ Armes perdues : ${lostNames.join(", ")}`];
}

export interface ChooseLossRule {
  /** `backpack_item` = objet CONTENU dans le Sac à Dos (§144), `weapon` = Arme (§277) */
  kind: "backpack_item" | "weapon";
  /** §144 : « Si vous n'avez plus de Sac à Dos, c'est une arme qu'on vous dérobe » */
  fallback?: "weapon";
  /** §277 : aucune perte si le héros n'a plus d'Arme */
  optional?: boolean;
}

export interface ArrivalRule {
  hp_delta?: number;
  armor_delta?: number;
  attack_delta?: number;
  skill_delta?: number;
  hp_to_max?: boolean;
  meal_required?: boolean;
  add_items?: Array<{ slug: string; qty?: number }>;
  remove_items?: string[];
  lose_backpack?: boolean;
  lose_weapons?: boolean;
  choose_loss?: ChooseLossRule;
  message?: string;
}

/** Objet désignable par le joueur pour une perte au choix (R4/R5). */
export interface DesignationCandidate {
  item_id: string;
  slug: string;
  name: string;
  quantity: number;
  item_type: string;
}

/**
 * Liste les objets qu'un joueur peut désigner pour `choose_loss`
 * (§144 : contenu du Sac à Dos, repli sur une Arme ; §277 : une Arme).
 * Retourne aussi la liste vide quand il n'y a rien à perdre.
 */
export async function listChooseLossCandidates(
  admin: Admin,
  userId: string,
  storyId: string,
  rule: ChooseLossRule,
): Promise<DesignationCandidate[]> {
  const listKind = async (
    kind: "backpack_item" | "weapon",
  ): Promise<DesignationCandidate[]> => {
    let query = admin
      .from("user_inventory")
      .select("item_id, quantity, items!inner(slug, name, item_type)")
      .eq("user_id", userId)
      .eq("story_id", storyId)
      .gt("quantity", 0);
    if (kind === "weapon") {
      query = query.eq("items.item_type", "weapon");
    } else {
      query = query.in("items.slug", BACKPACK_CONTENT_SLUGS);
    }
    const { data: rows } = await query;
    return ((rows ?? []) as unknown as Array<{
      item_id: string;
      quantity: number;
      items: { slug: string; name: string; item_type: string };
    }>).map((r) => ({
      item_id: r.item_id,
      slug: r.items.slug,
      name: r.items.name,
      quantity: r.quantity,
      item_type: r.items.item_type,
    }));
  };

  let candidates = await listKind(rule.kind);
  if (candidates.length === 0 && rule.fallback === "weapon" && rule.kind !== "weapon") {
    candidates = await listKind("weapon");
  }
  return candidates;
}

/**
 * Applique une perte désignée par le joueur (« c'est vous qui choisissez ce
 * qu'on vous a volé », « vous pouvez choisir laquelle »). Le jour où aucune
 * désignation n'est fournie alors que des candidats existent, la perte n'est
 * PAS appliquée (l'appelant doit avoir requis la désignation en amont).
 */
export async function applyDesignatedLoss(
  admin: Admin,
  userId: string,
  storyId: string,
  rule: ChooseLossRule,
  designatedItemId: string | null | undefined,
  candidates: DesignationCandidate[],
): Promise<string[]> {
  if (candidates.length === 0) {
    return rule.kind === "weapon" && rule.optional
      ? ["🗡️ Votre Arme est brisée, mais vous n'en possédez plus : rien à rayer."]
      : ["👜 Rien à voler : votre Sac à Dos est vide."];
  }
  const chosen =
    candidates.find((c) => c.item_id === designatedItemId) ?? null;
  if (!chosen) {
    return ["⚠️ Perte au choix non résolue (désignation manquante)."];
  }
  const msg = await removeItemQuantity(admin, userId, chosen.item_id, 1, storyId);
  const label =
    rule.kind === "weapon"
      ? `💔 Votre ${chosen.name} est brisée : rayez-la de votre Feuille d'Aventure.`
      : `👜 On vous vole votre ${chosen.name} (c'est vous qui choisissez ce qu'on vous a volé).`;
  return [label, ...(msg ? [msg] : [])];
}

export async function applyArrivalEffects(
  admin: Admin,
  userId: string,
  storyId: string,
  node: { node_key?: string | null; metadata?: unknown },
  stats: StatsRowMutable,
  opts?: { designatedLossItemId?: string | null },
): Promise<string[]> {
  const messages: string[] = [];
  const metadata = (node?.metadata as Record<string, unknown> | null) ?? null;
  const rule = (metadata?.on_arrive ?? null) as ArrivalRule | null;
  const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;

  // Guérison Kaï (Loup Solitaire uniquement)
  const nodeHasCombat =
    Array.isArray(metadata?.combatants) &&
    (metadata.combatants as unknown[]).length > 0;
  const isBookSection = metadata?.kind === "book_section";

  if (
    isBookSection &&
    !nodeHasCombat &&
    hasNarrativeFlag(flags, "guerison") &&
    stats.hp_current > 0 &&
    stats.hp_current < stats.hp_max
  ) {
    stats.hp_current += 1;
    messages.push("✨ Guérison : +1 END");
  }

  if (!rule) return messages;

  // 1. Butin à l'arrivée
  for (const grant of rule.add_items ?? []) {
    const { data: item } = await admin
      .from("items")
      .select("id")
      .eq("slug", grant.slug)
      .eq("story_id", storyId)
      .maybeSingle();
    if (item) {
      const res = await addItemQuantity(
        admin,
        userId,
        item.id as string,
        grant.qty ?? 1,
        storyId,
      );
      if (res.message) messages.push(res.message);
    }
  }

  // 2. Repas obligatoire (Loup Solitaire)
  if (rule.meal_required) {
    const { data: mealItem } = await admin
      .from("items")
      .select("id")
      .eq("slug", MEAL_SLUG)
      .eq("story_id", storyId)
      .maybeSingle();
    let consumed = false;
    if (mealItem) {
      const { data: inv } = await admin
        .from("user_inventory")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("item_id", mealItem.id as string)
        .eq("story_id", storyId)
        .gt("quantity", 0)
        .maybeSingle();
      if (inv) {
        await removeItemQuantity(
          admin,
          userId,
          mealItem.id as string,
          1,
          storyId,
        );
        consumed = true;
      }
    }
    if (consumed) {
      messages.push("🍖 Vous prenez un Repas (-1 Repas).");
    } else if (hasNarrativeFlag(flags, "chasse")) {
      messages.push(
        "🏹 Votre discipline de Chasse vous dispense de prendre un Repas.",
      );
    } else {
      stats.hp_current = Math.max(0, stats.hp_current - STARVATION_PENALTY);
      messages.push(
        `🍖 Aucun Repas disponible : la faim vous coûte ${STARVATION_PENALTY} points d'ENDURANCE.`,
      );
    }
  }

  // 3. Deltas génériques Vie / Armure / Attaque
  if (typeof rule.hp_delta === "number" && rule.hp_delta !== 0) {
    stats.hp_current = Math.min(
      stats.hp_max,
      Math.max(0, stats.hp_current + rule.hp_delta),
    );
    const label = rule.hp_delta > 0 ? `+${rule.hp_delta} Vie` : `${rule.hp_delta} Vie`;
    messages.push(label);
  }
  if (typeof rule.armor_delta === "number" && rule.armor_delta !== 0) {
    stats.armor = Math.max(0, (stats.armor ?? 0) + rule.armor_delta);
    // Sync agility pour compat UI ancienne
    stats.agility = stats.armor;
    messages.push(
      `${rule.armor_delta > 0 ? "+" : ""}${rule.armor_delta} Armure`,
    );
  }
  if (typeof rule.attack_delta === "number" && rule.attack_delta !== 0) {
    stats.attack_power = Math.max(
      0,
      (stats.attack_power ?? 0) + rule.attack_delta,
    );
    stats.strength = stats.attack_power;
    messages.push(
      `${rule.attack_delta > 0 ? "+" : ""}${rule.attack_delta} Attaque`,
    );
  }
  if (typeof rule.skill_delta === "number" && rule.skill_delta !== 0) {
    stats.strength = Math.max(1, stats.strength + rule.skill_delta);
    messages.push(
      `${rule.skill_delta > 0 ? "+" : ""}${rule.skill_delta} HABILETÉ (permanent)`,
    );
  }

  // 4. Guérison complète
  if (rule.hp_to_max) {
    const healed = stats.hp_max - stats.hp_current;
    stats.hp_current = stats.hp_max;
    if (healed > 0) {
      messages.push(`✨ Guérison complète : +${healed} Vie`);
    } else {
      messages.push("✨ Vous êtes déjà au maximum de votre Vie.");
    }
  }

  if (rule.lose_backpack) {
    messages.push(...(await destroyBackpack(admin, userId, storyId)));
  }
  if (rule.lose_weapons) {
    messages.push(...(await destroyWeapons(admin, userId, storyId)));
  }

  for (const slug of rule.remove_items ?? []) {
    const { data: item } = await admin
      .from("items")
      .select("id, name")
      .eq("slug", slug)
      .eq("story_id", storyId)
      .maybeSingle();
    if (item) {
      const { data: inv } = await admin
        .from("user_inventory")
        .select("id")
        .eq("user_id", userId)
        .eq("item_id", item.id as string)
        .eq("story_id", storyId)
        .maybeSingle();
      if (inv) {
        await admin.from("user_inventory").delete().eq("id", inv.id);
        messages.push(`🔥 ${item.name} est détruit(e).`);
      }
    }
  }

  // 5. Perte désignée par le joueur (§144 vol, §277 arme brisée)
  if (rule.choose_loss) {
    const candidates = await listChooseLossCandidates(
      admin,
      userId,
      storyId,
      rule.choose_loss,
    );
    messages.push(
      ...(await applyDesignatedLoss(
        admin,
        userId,
        storyId,
        rule.choose_loss,
        opts?.designatedLossItemId,
        candidates,
      )),
    );
  }

  if (rule.message) messages.push(rule.message);

  return messages;
}
