// ============================================================
// HeroBook — Client d'appel des Edge Functions & RPC sécurisés
// ------------------------------------------------------------
// Règle d'or : le client ne fait JAMAIS d'écriture directe sur
// wallets / transactions / user_inventory / user_achievements.
// Tout passe par ces helpers (Edge Functions + RPC SECURITY DEFINER).
// Voir docs/EDGE_FUNCTIONS.md et supabase/migrations/004.
// ============================================================

import { FunctionsHttpError } from "@supabase/supabase-js";
import { createClient } from "./client";

// ------------------------------------------------------------
// Types des réponses (contract Edge Functions)
// ------------------------------------------------------------

export interface ServerStats {
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
  narrative_flags: Record<string, unknown> | null;
}

export interface MakeChoiceResponse {
  node: any;
  choices: any[];
  stats: ServerStats;
  wallet: { gems: number | null };
  effects_applied: string[];
  is_ending: boolean;
  is_victory: boolean;
  is_new_ending: boolean;
  reward_gems: number;
  achievements_unlocked: string[];
}

export interface ApplyItemEffectResponse {
  item_name: string;
  quantity: number;
  healed: number;
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
}

export interface DailyRewardResponse {
  already_claimed: boolean;
  streak_days: number;
  reward_gems: number;
  reward_coins: number;
  gems: number | null;
  coins: number | null;
}

export interface SimulatedPurchaseResponse {
  simulated: boolean;
  gems_granted: number;
  gems: number | null;
  coins: number | null;
}

export interface PurchaseItemResponse {
  item_name: string;
  item_id: string;
  quantity: number;
  price_gems: number;
  gems: number;
  coins: number;
}

export class FunctionError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

// ------------------------------------------------------------
// Invocation générique avec extraction propre des messages d'erreur
// ------------------------------------------------------------

async function invokeFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke<T>(name, { body });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = await error.context.json();
        throw new FunctionError(
          payload?.error ?? "function_error",
          payload?.message ?? error.message,
        );
      } catch (e) {
        if (e instanceof FunctionError) throw e;
        throw new FunctionError("function_error", error.message);
      }
    }
    throw new FunctionError("network_error", error.message);
  }

  return data as T;
}

// ------------------------------------------------------------
// Edge Functions
// ------------------------------------------------------------

/** Valide un choix narratif côté serveur (premium inclus). */
export function invokeMakeChoice(choiceId: string) {
  return invokeFunction<MakeChoiceResponse>("make-choice", {
    choice_id: choiceId,
  });
}

/** Consomme un objet de la sacoche et applique son effet. */
export function invokeApplyItemEffect(itemId: string, storyId: string) {
  return invokeFunction<ApplyItemEffectResponse>("apply-item-effect", {
    item_id: itemId,
    story_id: storyId,
  });
}

/** Réclame la récompense quotidienne (streak). */
export function invokeGrantDailyReward() {
  return invokeFunction<DailyRewardResponse>("grant-daily-reward", {});
}

/**
 * Achat simulé d'un pack de gemmes (dev uniquement).
 * Refusé par le serveur si ALLOW_MOCK_PURCHASES != "true".
 */
export function invokeSimulatedPurchase(packId: string) {
  return invokeFunction<SimulatedPurchaseResponse>("validate-purchase", {
    simulate: true,
    pack_id: packId,
  });
}

// ------------------------------------------------------------
// RPC SECURITY DEFINER (migration 004)
// ------------------------------------------------------------

/** Achat d'un objet de boutique avec des gemmes (débit + octroi atomiques). */
export async function rpcPurchaseItem(
  itemId: string,
): Promise<PurchaseItemResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("purchase_item", {
    p_item_id: itemId,
  });
  if (error) throw new FunctionError(error.code ?? "rpc_error", error.message);
  return data as unknown as PurchaseItemResponse;
}

/** Débloque les succès éligibles (conditions revalidées côté serveur). */
export async function rpcClaimAchievements(userId: string): Promise<{
  unlocked: { name: string; slug: string; reward_gems: number }[];
  gems: number | null;
  coins: number | null;
  gems_gained: number;
  coins_gained: number;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("claim_achievements", {
    p_user_id: userId,
  });
  if (error) throw new FunctionError(error.code ?? "rpc_error", error.message);
  return data as unknown as {
    unlocked: { name: string; slug: string; reward_gems: number }[];
    gems: number | null;
    coins: number | null;
    gems_gained: number;
    coins_gained: number;
  };
}
