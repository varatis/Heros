// ============================================================
// HeroBook — Edge Function `apply-item-effect`
// ------------------------------------------------------------
// Consomme un objet de la sacoche en jeu et applique son effet
// sur les stats du run. Toute la logique vit dans la fonction SQL
// atomique `apply_item_effect` (migration 004) : vérification de
// possession, décrément d'inventaire et effet sur character_stats.
//
// Entrée  : { item_id: uuid, story_id: uuid }
// Sortie  : résultat de apply_item_effect (soins, stats, quantité)
// Erreurs : 400 · 401 · 404 item_not_owned/item_not_found
//           409 item_not_consumable · 500 internal
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

function mapRpcError(message: string): Response | null {
  if (message.includes("item_not_owned")) {
    return fail("item_not_owned", "Objet absent de votre sacoche", 404);
  }
  if (message.includes("item_not_found")) {
    return fail("item_not_found", "Objet introuvable", 404);
  }
  if (message.includes("item_not_consumable")) {
    return fail(
      "item_not_consumable",
      "Cet objet n'est pas consommable",
      409,
    );
  }
  return null;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    const admin = createAdminClient();
    const user = await getUser(req, admin);
    if (!user) {
      return fail("unauthorized", "Authentification requise", 401);
    }

    let body: { item_id?: string; story_id?: string };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }
    if (!body.item_id || !body.story_id) {
      return fail("bad_request", "Paramètres item_id et story_id requis", 400);
    }

    const { data, error } = await admin.rpc("apply_item_effect", {
      p_user_id: user.id,
      p_item_id: body.item_id,
      p_story_id: body.story_id,
    });

    if (error) {
      const mapped = mapRpcError(error.message);
      if (mapped) return mapped;
      console.error("apply-item-effect rpc error:", error.message);
      return fail("internal", "Erreur lors de l'application de l'objet", 500);
    }

    return json(data);
  } catch (err) {
    console.error("apply-item-effect unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});
