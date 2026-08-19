import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

/**
 * Débloque les succès éligibles pour l'utilisateur.
 *
 * ⚠️ Depuis la migration 004, le client ne peut plus écrire dans
 * user_achievements ni créditer le wallet : tout passe par la fonction
 * SQL `claim_achievements` (SECURITY DEFINER) qui REVALIDE les
 * conditions côté serveur (histoires terminées, fins découvertes,
 * objets possédés) avant de créditer les récompenses.
 *
 * `make-choice` appelle cette même fonction côté serveur à chaque fin
 * d'histoire — ce helper sert aux appels client hors lecture (profil,
 * boutique, futur onboarding).
 */
export async function checkAndUnlockAchievements(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc("claim_achievements", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Erreur lors de la vérification des succès :", error.message);
      return [];
    }

    if (!data) return [];
    const result = data as {
      unlocked?: { name: string }[];
      gems?: number | null;
      coins?: number | null;
    };

    // Synchroniser le wallet local avec le solde renvoyé par le serveur
    if (typeof result.gems === "number" && typeof window !== "undefined") {
      const { useWalletStore } = await import("@/stores/walletStore");
      useWalletStore.getState().setWallet(result.gems, result.coins ?? 0);
    }

    return (result.unlocked ?? []).map((a) => a.name);
  } catch (err) {
    console.error("Erreur lors de la vérification des succès :", err);
    return [];
  }
}
