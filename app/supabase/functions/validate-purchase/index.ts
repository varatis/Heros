// ============================================================
// HeroBook — Edge Function `validate-purchase`
// ------------------------------------------------------------
// Point d'entrée unique des achats à valeur réelle.
//
// Mode 1 — Webhook RevenueCat (server-to-server, verify_jwt=false) :
//   Authentification par signature `X-Signature` (HMAC-SHA1 du corps
//   brut avec REVENUECAT_WEBHOOK_SECRET) ou `Authorization: Bearer
//   <secret>`. Événements crédités : INITIAL_PURCHASE,
//   NON_RENEWING_PURCHASE, RESTORED. Idempotent via
//   transactions.revenuecat_transaction_id (unique).
//
// Mode 2 — Simulation locale/dev :
//   { simulate: true, pack_id } + JWT utilisateur, autorisé
//   uniquement si le secret ALLOW_MOCK_PURCHASES="true".
//   Sert de pont avant l'intégration du SDK RevenueCat, en attendant
//   que les vrais webhooks prennent le relais. Désactivé en prod.
//
// Erreurs : 400 · 401 invalid_signature/unauthorized · 403
//           mock_purchases_disabled · 404 pack_not_found · 500
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import {
  isUuid,
  verifyRevenueCatSignature,
} from "../_shared/revenuecat.ts";

const CREDITABLE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "NON_RENEWING_PURCHASE",
  "RESTORED",
]);

interface RcEvent {
  type?: string;
  app_user_id?: string;
  product_id?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  price?: number;
  currency?: string;
  store?: string;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  let rawBody = "";
  let parsed: { simulate?: boolean; pack_id?: string; event?: RcEvent };

  try {
    rawBody = await req.text();
    parsed = JSON.parse(rawBody);
  } catch {
    return fail("bad_request", "Corps JSON invalide", 400);
  }

  try {
    // ========================================================
    // Mode simulation (dev) — remplace l'ancien faux flux client
    // ========================================================
    if (parsed.simulate === true) {
      return await handleSimulatedPurchase(req, parsed);
    }

    // ========================================================
    // Mode webhook RevenueCat
    // ========================================================
    return await handleRevenueCatWebhook(req, rawBody, parsed);
  } catch (err) {
    console.error("validate-purchase unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});

// ------------------------------------------------------------
// Simulation locale : JWT + ALLOW_MOCK_PURCHASES requis
// ------------------------------------------------------------
async function handleSimulatedPurchase(
  req: Request,
  body: { pack_id?: string },
): Promise<Response> {
  if (Deno.env.get("ALLOW_MOCK_PURCHASES") !== "true") {
    return fail(
      "mock_purchases_disabled",
      "Achats simulés désactivés — passez par RevenueCat",
      403,
    );
  }

  const admin = createAdminClient();
  const user = await getUser(req, admin);
  if (!user) {
    return fail("unauthorized", "Authentification requise", 401);
  }
  if (!body.pack_id) {
    return fail("bad_request", "Paramètre pack_id manquant", 400);
  }

  const { data: pack } = await admin
    .from("gem_packs")
    .select("*")
    .eq("id", body.pack_id)
    .eq("is_available", true)
    .single();
  if (!pack) {
    return fail("pack_not_found", "Pack de gemmes introuvable", 404);
  }

  const gemsGranted = pack.gems_amount + (pack.bonus_gems ?? 0);

  const { data: walletData, error } = await admin.rpc(
    "process_wallet_transaction",
    {
      p_user_id: user.id,
      p_type: "gem_purchase",
      p_gems_delta: gemsGranted,
      p_amount_usd: pack.price_usd,
      p_rc_txn_id: `mock_${user.id}_${crypto.randomUUID()}`,
      p_store_product_id: pack.revenuecat_product_id,
      p_platform: "web",
      p_metadata: { reason: "mock_purchase", simulated: true },
    },
  );

  if (error) {
    console.error("validate-purchase mock error:", error.message);
    return fail("internal", "Erreur lors du crédit du pack", 500);
  }

  return json({
    simulated: true,
    gems_granted: gemsGranted,
    gems: walletData?.[0]?.gems ?? null,
    coins: walletData?.[0]?.coins ?? null,
  });
}

// ------------------------------------------------------------
// Webhook RevenueCat : signature → mapping produit → crédit
// ------------------------------------------------------------
async function handleRevenueCatWebhook(
  req: Request,
  rawBody: string,
  parsed: { event?: RcEvent },
): Promise<Response> {
  const secret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
  if (!secret) {
    console.error("REVENUECAT_WEBHOOK_SECRET non configuré");
    return fail(
      "webhook_not_configured",
      "Webhook RevenueCat non configuré",
      500,
    );
  }

  const signature = req.headers.get("X-Signature");
  const bearerOk = (req.headers.get("Authorization") ?? "") ===
    `Bearer ${secret}`;
  const signatureOk = await verifyRevenueCatSignature(
    rawBody,
    signature,
    secret,
  );

  if (!bearerOk && !signatureOk) {
    return fail("invalid_signature", "Signature webhook invalide", 401);
  }

  const event = parsed.event;
  if (!event || !event.type) {
    // Ping / format inattendu : accusé de réception sans action
    return json({ status: "ignored" });
  }

  if (!CREDITABLE_EVENTS.has(event.type)) {
    // RENEWAL, CANCELLATION, EXPIRATION... : pas de crédit de gemmes
    return json({ status: "ignored", type: event.type });
  }

  // app_user_id = notre user.id (UUID du profil Supabase)
  const appUserId = event.app_user_id;
  if (!isUuid(appUserId)) {
    // Utilisateur anonyme RC non encore mappé : on n'échoue pas
    // (sinon RC rejouerait le webhook en boucle), on accuse réception.
    return json({ status: "user_not_mapped" });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", appUserId)
    .maybeSingle();
  if (!profile) {
    return json({ status: "user_not_mapped" });
  }

  const productId = event.product_id;
  if (!productId) {
    return json({ status: "unknown_product", product_id: null });
  }

  // 1) Pack de gemmes ?
  const { data: pack } = await admin
    .from("gem_packs")
    .select("*")
    .eq("revenuecat_product_id", productId)
    .eq("is_available", true)
    .maybeSingle();

  // 2) Sinon, objet de boutique vendu via RevenueCat ?
  let item: { id: string; name: string } | null = null;
  if (!pack) {
    const { data: itemRow } = await admin
      .from("items")
      .select("id, name")
      .eq("revenuecat_product_id", productId)
      .eq("is_available", true)
      .maybeSingle();
    item = itemRow ?? null;
  }

  // 3) Sinon, histoire payante vendue directement via RevenueCat (IAP) ?
  let story: { id: string; title: string; price_usd: number | null } | null =
    null;
  if (!pack && !item) {
    const { data: storyRow } = await admin
      .from("stories")
      .select("id, title, price_usd")
      .eq("revenuecat_product_id", productId)
      .eq("status", "published")
      .eq("is_free", false)
      .maybeSingle();
    story = storyRow ?? null;
  }

  if (!pack && !item && !story) {
    return json({ status: "unknown_product", product_id: productId });
  }

  const rcTxnId = event.transaction_id ??
    `${event.original_transaction_id ?? "rc"}:${productId}:${event.type}`;

  if (pack) {
    const gemsGranted = pack.gems_amount + (pack.bonus_gems ?? 0);
    const { data: walletData, error } = await admin.rpc(
      "process_wallet_transaction",
      {
        p_user_id: appUserId,
        p_type: "gem_purchase",
        p_gems_delta: gemsGranted,
        p_amount_usd: event.price ?? pack.price_usd,
        p_rc_txn_id: rcTxnId,
        p_store_product_id: productId,
        p_platform: event.store ?? "revenuecat",
        p_metadata: {
          reason: "revenuecat_webhook",
          event_type: event.type,
          product_id: productId,
          currency: event.currency ?? null,
        },
      },
    );

    if (error) {
      if (error.message.includes("duplicate_transaction")) {
        return json({ status: "duplicate", product_id: productId });
      }
      console.error("validate-purchase webhook pack error:", error.message);
      return fail("internal", "Erreur de crédit webhook", 500); // RC retentera
    }

    return json({
      status: "credited",
      product_id: productId,
      gems_granted: gemsGranted,
      gems: walletData?.[0]?.gems ?? null,
    });
  }

  // Achat d'objet (items) : transaction + octroi d'inventaire
  if (item) {
    const { error } = await admin.rpc("process_wallet_transaction", {
      p_user_id: appUserId,
      p_type: "item_purchase",
      p_gems_delta: 0,
      p_item_id: item.id,
      p_rc_txn_id: rcTxnId,
      p_store_product_id: productId,
      p_platform: event.store ?? "revenuecat",
      p_metadata: {
        reason: "revenuecat_webhook",
        event_type: event.type,
        product_id: productId,
      },
    });

    if (error) {
      if (error.message.includes("duplicate_transaction")) {
        return json({ status: "duplicate", product_id: productId });
      }
      console.error("validate-purchase webhook item error:", error.message);
      return fail("internal", "Erreur de crédit webhook", 500);
    }

    const { data: existingInv } = await admin
      .from("user_inventory")
      .select("id, quantity")
      .eq("user_id", appUserId)
      .eq("item_id", item.id)
      .maybeSingle();
    if (existingInv) {
      await admin
        .from("user_inventory")
        .update({ quantity: existingInv.quantity + 1 })
        .eq("id", existingInv.id);
    } else {
      await admin
        .from("user_inventory")
        .insert({ user_id: appUserId, item_id: item.id, quantity: 1 });
    }

    return json({ status: "credited", product_id: productId, item: item.id });
  }

  // Achat d'histoire payante (IAP) : transaction + déverrouillage
  // is_purchased (colonne sensible — réservée au serveur).
  const { error } = await admin.rpc("process_wallet_transaction", {
    p_user_id: appUserId,
    p_type: "story_purchase",
    p_gems_delta: 0,
    p_amount_usd: event.price ?? story!.price_usd,
    p_story_id: story!.id,
    p_rc_txn_id: rcTxnId,
    p_store_product_id: productId,
    p_platform: event.store ?? "revenuecat",
    p_metadata: {
      reason: "revenuecat_webhook",
      event_type: event.type,
      product_id: productId,
    },
  });

  if (error) {
    if (error.message.includes("duplicate_transaction")) {
      return json({ status: "duplicate", product_id: productId });
    }
    console.error("validate-purchase webhook story error:", error.message);
    return fail("internal", "Erreur de crédit webhook", 500);
  }

  // Déverrouillage (upsert : crée la ligne de progression si absente)
  await admin.from("user_story_progress").upsert(
    { user_id: appUserId, story_id: story!.id, is_purchased: true },
    { onConflict: "user_id,story_id" },
  );

  return json({ status: "credited", product_id: productId, story: story!.id });
}
