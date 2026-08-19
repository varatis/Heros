import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

/**
 * Vérifie et débloque les succès éligibles pour l'utilisateur
 */
export async function checkAndUnlockAchievements(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  try {
    // 1. Récupérer tous les succès
    const { data: achievements } = await supabase
      .from("achievements")
      .select("*");

    if (!achievements) return [];

    // 2. Récupérer les succès déjà débloqués
    const { data: unlocked } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const unlockedIds = new Set((unlocked || []).map((u) => u.achievement_id));

    // 3. Récupérer la progression pour évaluer les conditions
    const { data: progressList } = await supabase
      .from("user_story_progress")
      .select("*")
      .eq("user_id", userId);

    const completedStoriesCount =
      progressList?.filter((p) => p.is_completed).length || 0;

    const newlyUnlocked: string[] = [];

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let eligible = false;

      if (
        achievement.condition_type === "stories_completed" &&
        completedStoriesCount >= achievement.condition_value
      ) {
        eligible = true;
      } else if (
        achievement.condition_type === "victories" &&
        completedStoriesCount >= achievement.condition_value
      ) {
        eligible = true;
      }

      if (eligible) {
        // Enregistrer le succès débloqué
        await supabase.from("user_achievements").insert({
          user_id: userId,
          achievement_id: achievement.id,
        });

        // Créditer les gemmes du succès
        if (achievement.reward_gems > 0) {
          const { data: wallet } = await supabase
            .from("wallets")
            .select("gems")
            .eq("user_id", userId)
            .single();

          if (wallet) {
            const newTotal = wallet.gems + achievement.reward_gems;
            await supabase
              .from("wallets")
              .update({ gems: newTotal })
              .eq("user_id", userId);

            // Mettre à jour le store client instantanément si exécuté dans le navigateur
            if (typeof window !== "undefined") {
              const { useWalletStore } = await import("@/stores/walletStore");
              useWalletStore.getState().addGems(achievement.reward_gems);
            }
          }
        }

        newlyUnlocked.push(achievement.name);
      }
    }

    return newlyUnlocked;
  } catch (err) {
    console.error("Erreur lors de la vérification des succès :", err);
    return [];
  }
}
