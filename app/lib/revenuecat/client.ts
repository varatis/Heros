// ============================================================
// HeroBook — SDK RevenueCat (côté client, natif Capacitor)
// ------------------------------------------------------------
// Intègre les achats in-app (Google Play Billing / Apple IAP) sur
// les builds natifs Android/iOS via @revenuecat/purchases-capacitor.
//
// ⚠️ Lien critique avec le backend : on identifie l'utilisateur avec
//    appUserID = user.id (UUID Supabase). C'est EXACTEMENT l'id que le
//    webhook `validate-purchase` attend pour créditer les gemmes et
//    déverrouiller les histoires. Ne jamais utiliser un id aléatoire ici.
//
// Le crédit serveur (gemmes / is_purchased) n'est JAMAIS fait côté
// client : il arrive par le webhook signé HMAC-SHA1, après l'achat.
// ============================================================

import { Capacitor } from "@capacitor/core";
import type { PurchasesPlugin } from "@revenuecat/purchases-capacitor";

type PurchasesModule = typeof import("@revenuecat/purchases-capacitor");

const API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY ?? "";

let modulePromise: Promise<PurchasesModule> | null = null;
let configuredForUserId: string | null = null;

export class RevenueCatError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "RevenueCatError";
  }
}

/** Vrai si la clé publique SDK est fournie (sinon on reste en simulation). */
export function isRevenueCatConfigured(): boolean {
  return API_KEY.length > 0;
}

/** Vrai sur un appareil natif (Android/iOS) embarqué dans Capacitor. */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/** Vrai si on peut lancer un vrai achat natif RevenueCat. */
export function canUseRevenueCat(): boolean {
  return isRevenueCatConfigured() && isNativePlatform();
}

function getModule(): Promise<PurchasesModule> {
  if (!modulePromise) {
    // Chargement à la demande : le plugin natif n'est importé que si besoin.
    modulePromise = import("@revenuecat/purchases-capacitor");
  }
  return modulePromise;
}

async function getPurchases(): Promise<PurchasesPlugin> {
  return (await getModule()).Purchases;
}

/**
 * Configure le SDK avec l'identité Supabase (appUserID = user.id).
 * Idempotent : re-configure uniquement si l'utilisateur change.
 */
export async function initRevenueCat(userId: string): Promise<void> {
  if (!isRevenueCatConfigured()) return;
  if (configuredForUserId === userId) return;

  const Purchases = await getPurchases();
  await Purchases.configure({ apiKey: API_KEY, appUserID: userId });
  configuredForUserId = userId;
}

/**
 * Lance un achat natif pour un product_id (pack de gemmes, histoire, objet).
 * Résout avec l'identifiant du produit acheté ; lève `RevenueCatError` sur
 * annulation (`cancelled`) ou échec (`purchase_failed`).
 *
 * Le crédit serveur arrive ensuite via le webhook validate-purchase.
 */
export async function purchaseProduct(
  productId: string,
): Promise<{ productIdentifier: string }> {
  if (!isRevenueCatConfigured()) {
    throw new RevenueCatError(
      "not_configured",
      "RevenueCat non configuré (clé SDK absente).",
    );
  }

  const { Purchases, PRODUCT_CATEGORY } = await getModule();

  const { products } = await Purchases.getProducts({
    productIdentifiers: [productId],
    type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
  });
  if (!products || products.length === 0) {
    throw new RevenueCatError(
      "product_not_found",
      `Produit ${productId} introuvable dans le store.`,
    );
  }

  try {
    const result = await Purchases.purchaseStoreProduct({
      product: products[0],
    });
    return { productIdentifier: result.productIdentifier };
  } catch (err) {
    const e = err as {
      userCancelled?: boolean | null;
      message?: string;
    };
    if (e?.userCancelled === true) {
      throw new RevenueCatError("cancelled", "Achat annulé.");
    }
    throw new RevenueCatError(
      "purchase_failed",
      e?.message ?? "Échec de l'achat.",
    );
  }
}

/** Restaure les achats antérieurs (réinstallation, changement d'appareil). */
export async function restorePurchases(): Promise<void> {
  if (!isRevenueCatConfigured()) return;
  const Purchases = await getPurchases();
  await Purchases.restorePurchases();
}
