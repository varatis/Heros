// ============================================================
// HeroBook — Edge Function `grant-daily-reward`
// ------------------------------------------------------------
// Récompense quotidienne + streak. La logique (idempotence jour,
// incrémentation/reset du streak, calcul de la récompense, crédit
// wallet + transaction) vit dans la fonction SQL `claim_daily_reward`
// (migration 004), exécutée en une transaction atomique.
//
// Entrée  : {} (JWT utilisateur)
// Sortie  : { already_claimed, streak_days, reward_gems,
//             reward_coins, gems, coins }
// Erreurs : 401 · 404 profile_not_found · 500 internal
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    const admin = createAdminClient();
    const user = await getUser(req, admin);
    if (!user) {
      return fail("unauthorized", "Authentification requise", 401);
    }

    const { data, error } = await admin.rpc("claim_daily_reward", {
      p_user_id: user.id,
    });

    if (error) {
      if (error.message.includes("profile_not_found")) {
        return fail("profile_not_found", "Profil introuvable", 404);
      }
      console.error("grant-daily-reward rpc error:", error.message);
      return fail("internal", "Erreur lors de la récompense quotidienne", 500);
    }

    return json(data);
  } catch (err) {
    console.error("grant-daily-reward unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});
