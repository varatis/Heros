// ============================================================
// HeroBook — `_shared/arrival.ts`
// ------------------------------------------------------------
// Règles « fidélité livre » de Loup Solitaire appliquées à
// l'arrivée sur un noeud, pilotées par story_nodes.metadata :
//
//   on_arrive: {
//     hp_delta?: number       blessures narratives (ex. §203 → -10)
//     skill_delta?: number    HABILETÉ permanente (ex. §236 → -1)
//     hp_to_max?: boolean     guérison complète (ex. §212)
//     meal_required?: boolean repas obligatoire (§37/130/147/168/184/235/300)
//     add_items?: [{slug, qty?}]  butin trouvé à l'arrivée (ex. §184)
//     remove_items?: [slug]   objets détruits (ex. pierre-vordak §236)
//     message?: string        message affiché au joueur
//   }
//
//   hazard rule: { lose_backpack: true }  (§188 : le Kraan déchire
//                le Sac à Dos, tout son contenu est perdu)
//
// Règles du livre appliquées ici :
//  - Repas : consomme 1 Repas ; sans Repas, -3 END, SAUF si le joueur
//    maîtrise la discipline Chasse (il chasse pour se nourrir) ;
//  - L'or (Couronnes) est plafonné à 50 (capacité de la bourse) ;
//  - La mort à END 0 est gérée par l'appelant (redirection vers le
//    noeud 'mort_epuisement' après application).
// ============================================================

import type { createAdminClient } from "./supabase.ts";

type Admin = ReturnType<typeof createAdminClient>;

export interface StatsRowMutable {
  hp_current: number;
  hp_max: number;
  strength: number;
  narrative_flags: Record<string, unknown> | null;
  [key: string]: unknown;
}

export const GOLD_SLUG = "couronnes";
export const GOLD_CAP = 50;
export const MEAL_SLUG = "repas";
export const STARVATION_PENALTY = 3;

// Objets rangés dans le Sac à Dos (tout le reste est porté sur soi :
// armes, Objets Spéciaux, armures).
export const BACKPACK_SLUGS = [
  "repas",
  "torches",
  "briquet-amadou",
  "laumspur",
  "sac-a-dos",
];

// ------------------------------------------------------------
// Normalisation des flags de disciplines (tolère le préfixe
// « discipline_ » et la variante d'écriture « six_cieme_sens »).
// ------------------------------------------------------------
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
// Inventaire : ajout d'une quantité (upsert), avec plafond d'or.
// Retourne le message d'effet (ou null si rien fait).
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

  const { data: existing } = await admin
    .from("user_inventory")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("item_id", itemId)
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
    await admin
      .from("user_inventory")
      .insert({ user_id: userId, item_id: itemId, quantity: newQty });
  }

  const qtyLabel = qty > 1 ? ` ×${qty}` : "";
  const capLabel = capped ? ` (bourse pleine : ${GOLD_CAP} max)` : "";
  void storyId;
  return {
    message: `🎁 ${name}${qtyLabel}${capLabel}`,
    itemSlug: slug,
  };
}

// ------------------------------------------------------------
// Inventaire : retrait d'une quantité (ligne supprimée à 0).
// ------------------------------------------------------------
export async function removeItemQuantity(
  admin: Admin,
  userId: string,
  itemId: string,
  qty: number,
): Promise<string | null> {
  if (qty <= 0) return null;
  const { data: existing } = await admin
    .from("user_inventory")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle();
  if (!existing || existing.quantity <= 0) return null;

  const remaining = existing.quantity - qty;
  if (remaining <= 0) {
    await admin.from("user_inventory").delete().eq("id", existing.id);
  } else {
    await admin
      .from("user_inventory")
      .update({ quantity: remaining })
      .eq("id", existing.id);
  }

  const { data: item } = await admin
    .from("items")
    .select("name")
    .eq("id", itemId)
    .maybeSingle();
  const name = (item?.name as string) ?? "Objet";
  return qty > 1 ? `💸 ${name} (-${qty})` : `💸 ${name} retiré`;
}

// ------------------------------------------------------------
// Destruction du Sac à Dos (règle de hasard, ex. §188) : le sac et
// tout son contenu courant sont perdus (armes et Objets Spéciaux
// conservés, comme dans le livre).
// ------------------------------------------------------------
export async function destroyBackpack(
  admin: Admin,
  userId: string,
  storyId: string,
): Promise<string[]> {
  const { data: rows } = await admin
    .from("user_inventory")
    .select("id, items!inner(slug, name)")
    .eq("user_id", userId)
    .in("items.slug", BACKPACK_SLUGS);
  if (!rows || rows.length === 0) {
    return [];
  }
  const lostNames: string[] = [];
  for (const row of rows as unknown as Array<{ id: string; items: { slug: string; name: string } }>) {
    lostNames.push(row.items.name);
    await admin.from("user_inventory").delete().eq("id", row.id);
  }
  void storyId;
  return [
    `🎒 Sac à Dos détruit : ${lostNames.join(", ")} perdu(s) !`,
  ];
}

// ------------------------------------------------------------
// Perte des armes (capture §162 : « ils vous prennent vos Armes »).
// ------------------------------------------------------------
export async function destroyWeapons(
  admin: Admin,
  userId: string,
  storyId: string,
): Promise<string[]> {
  const { data: rows } = await admin
    .from("user_inventory")
    .select("id, items!inner(name, item_type)")
    .eq("user_id", userId)
    .eq("items.item_type", "weapon");
  if (!rows || rows.length === 0) return [];
  const lostNames: string[] = [];
  for (const row of rows as unknown as Array<{ id: string; items: { name: string } }>) {
    lostNames.push(row.items.name);
    await admin.from("user_inventory").delete().eq("id", row.id);
  }
  void storyId;
  return [`⚔️ Armes perdues : ${lostNames.join(", ")}`];
}

export interface ArrivalRule {
  hp_delta?: number;
  skill_delta?: number;
  hp_to_max?: boolean;
  meal_required?: boolean;
  add_items?: Array<{ slug: string; qty?: number }>;
  remove_items?: string[];
  lose_backpack?: boolean;   // §162 (capture Drakkarims)
  lose_weapons?: boolean;    // §162
  message?: string;
}

// ------------------------------------------------------------
// Application des règles d'arrivée d'un noeud. `stats` est muté ;
// l'appelant persiste les changements et gère la mort (hp ≤ 0).
// ------------------------------------------------------------
export async function applyArrivalEffects(
  admin: Admin,
  userId: string,
  storyId: string,
  node: { node_key?: string | null; metadata?: unknown },
  stats: StatsRowMutable,
): Promise<string[]> {
  const messages: string[] = [];
  const metadata = (node?.metadata as Record<string, unknown> | null) ?? null;
  const rule = (metadata?.on_arrive ?? null) as ArrivalRule | null;
  const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;

  // ----------------------------------------------------------
  // Discipline Kaï de la GUÉRISON (règle du livre) :
  // « le Loup Solitaire regagne 1 point d'ENDURANCE à chaque
  //   section traversée sans combat », sans dépasser son total
  //   initial. Appliqué AVANT les blessures narratives de la
  //   section (on soigne la fatigue du trajet, pas la blessure
  //   que l'on va subir en arrivant).
  // ----------------------------------------------------------
  const nodeHasCombat = Array.isArray(metadata?.combatants) &&
    (metadata.combatants as unknown[]).length > 0;
  const isBookSection = metadata?.kind === "book_section";

  if (
    isBookSection && !nodeHasCombat &&
    hasNarrativeFlag(flags, "guerison") &&
    stats.hp_current > 0 && stats.hp_current < stats.hp_max
  ) {
    stats.hp_current += 1;
    messages.push("✨ Guérison : +1 END");
  }

  if (!rule) return messages;

  // 1. Butin trouvé en arrivant (avant le repas : §184 donne 4 Repas
  //    puis impose d'en prendre un).
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

  // 2. Repas obligatoire (§37, 130, 147, 168, 184, 235, 300)
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
        .gt("quantity", 0)
        .maybeSingle();
      if (inv) {
        await removeItemQuantity(admin, userId, mealItem.id as string, 1);
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
      stats.hp_current = Math.max(
        0,
        stats.hp_current - STARVATION_PENALTY,
      );
      messages.push(
        `🍖 Aucun Repas disponible : la faim vous coûte ${STARVATION_PENALTY} points d'ENDURANCE.`,
      );
    }
  }

  // 3. Blessures narratives
  if (typeof rule.hp_delta === "number" && rule.hp_delta !== 0) {
    stats.hp_current = Math.min(
      stats.hp_max,
      Math.max(0, stats.hp_current + rule.hp_delta),
    );
    messages.push(
      `${rule.hp_delta > 0 ? "+" : ""}${rule.hp_delta} END`,
    );
  }

  // 4. Perte/gain d'HABILETÉ permanente
  if (typeof rule.skill_delta === "number" && rule.skill_delta !== 0) {
    stats.strength = Math.max(1, stats.strength + rule.skill_delta);
    messages.push(
      `${rule.skill_delta > 0 ? "+" : ""}${rule.skill_delta} HABILETÉ (permanent)`,
    );
  }

  // 5. Guérison complète (§212)
  if (rule.hp_to_max) {
    const healed = stats.hp_max - stats.hp_current;
    stats.hp_current = stats.hp_max;
    if (healed > 0) {
      messages.push(`✨ Guérison complète : +${healed} END`);
    } else {
      messages.push("✨ Vous êtes déjà au maximum de votre ENDURANCE.");
    }
  }

  // 5bis. Capture/spoliation (§162) : perte du Sac à Dos et des armes
  if (rule.lose_backpack) {
    messages.push(...(await destroyBackpack(admin, userId, storyId)));
  }
  if (rule.lose_weapons) {
    messages.push(...(await destroyWeapons(admin, userId, storyId)));
  }

  // 6. Objets détruits (ex. Pierre de Vordak au §236)
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
        .maybeSingle();
      if (inv) {
        await admin.from("user_inventory").delete().eq("id", inv.id);
        messages.push(`🔥 ${item.name} est détruit(e).`);
      }
    }
  }

  // 7. Message narratif de la règle (affiché après les effets)
  if (rule.message) messages.push(rule.message);

  return messages;
}
