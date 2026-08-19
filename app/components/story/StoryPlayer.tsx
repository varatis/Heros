"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Sword,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Skull,
  Award,
  ChevronRight,
  Loader2,
  BookmarkCheck,
  Package,
  Dices,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkAndUnlockAchievements } from "@/lib/game-engine/achievements";
import { useWalletStore } from "@/stores/walletStore";
import {
  applyEquipmentStats,
  calculateInventoryBonuses,
} from "@/lib/game-engine/stats";

interface StoryPlayerProps {
  storyId: string;
}

export default function StoryPlayer({ storyId }: StoryPlayerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReset = searchParams.get("reset") === "true";
  const supabase = createClient();
  const { addGems, setWallet, gems: currentWalletGems } = useWalletStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [choices, setChoices] = useState<any[]>([]);
  const [isFirstDiscovery, setIsFirstDiscovery] = useState(false);
  const [gemsAwarded, setGemsAwarded] = useState(0);
  const [inventory, setInventory] = useState<any[]>([]);
  const [equipmentBonuses, setEquipmentBonuses] = useState<Record<string, number>>({});
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [stats, setStats] = useState<{
    hp_current: number;
    hp_max: number;
    strength: number;
    agility: number;
    luck: number;
    narrative_flags: Record<string, any>;
  }>({
    hp_current: 10,
    hp_max: 10,
    strength: 5,
    agility: 5,
    luck: 5,
    narrative_flags: {},
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Initialisation du jeu
  useEffect(() => {
    async function initGame() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 1. Récupérer l'histoire
      const { data: storyData } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();
      setStory(storyData);

      // 2. Vérifier la progression existante
      const { data: progressData } = await supabase
        .from("user_story_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      // 3. Récupérer les stats existantes
      const { data: statsData } = await supabase
        .from("character_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      // 4. Récupérer l'inventaire du joueur avec fusion infaillible des items
      const { data: rawInv } = await supabase
        .from("user_inventory")
        .select("*")
        .eq("user_id", user.id);

      let userInv: any[] = [];
      if (rawInv && rawInv.length > 0) {
        const itemIds = rawInv.map((i) => i.item_id);
        const { data: itemsList } = await supabase
          .from("items")
          .select("*")
          .in("id", itemIds);

        const itemsMap = new Map((itemsList || []).map((it) => [it.id, it]));
        userInv = rawInv.map((inv) => ({
          ...inv,
          items: itemsMap.get(inv.item_id) || null,
        }));
      }

      setInventory(userInv);

      // Calculer les bonus cumulés de l'équipement
      const bonuses = calculateInventoryBonuses(userInv);
      setEquipmentBonuses(bonuses);

      let targetNodeId = null;

      if (progressData && progressData.current_node_id && !shouldReset) {
        targetNodeId = progressData.current_node_id;
      }

      if (statsData && !shouldReset) {
        // Appliquer les bonus d'équipement sur les stats sauvegardées
        const base = {
          hp_current: statsData.hp_current,
          hp_max: statsData.hp_max,
          strength: statsData.strength,
          agility: statsData.agility,
          luck: statsData.luck,
          charisma: statsData.charisma || 5,
        };
        const computed = applyEquipmentStats(base, userInv);

        setStats({
          hp_current: computed.hp_current,
          hp_max: computed.hp_max,
          strength: computed.strength,
          agility: computed.agility,
          luck: computed.luck,
          narrative_flags: (statsData.narrative_flags as Record<string, any>) || {},
        });
      } else {
        // Init stats de base du héros + bonus d'équipement
        const base = {
          hp_current: 10,
          hp_max: 10,
          strength: 5,
          agility: 5,
          luck: 5,
          charisma: 5,
        };
        const computed = applyEquipmentStats(base, userInv);

        const initialStats = {
          user_id: user.id,
          story_id: storyId,
          hp_current: computed.hp_current,
          hp_max: computed.hp_max,
          strength: computed.strength,
          agility: computed.agility,
          luck: computed.luck,
          charisma: computed.charisma,
          narrative_flags: {},
        };
        await supabase.from("character_stats").upsert(initialStats);
        setStats({
          hp_current: computed.hp_current,
          hp_max: computed.hp_max,
          strength: computed.strength,
          agility: computed.agility,
          luck: computed.luck,
          narrative_flags: {},
        });
      }

      // Si pas de noeud cible ou reset demandé, trouver le noeud de départ
      if (!targetNodeId) {
        // Chercher spécifiquement le noeud "debut" ou le 1er noeud marqué is_start
        const { data: startNodes } = await supabase
          .from("story_nodes")
          .select("*")
          .eq("story_id", storyId)
          .order("is_start", { ascending: false })
          .limit(1);

        const startNode = startNodes?.[0];

        if (startNode) {
          targetNodeId = startNode.id;
          // Créer ou reset la progression
          await supabase.from("user_story_progress").upsert({
            user_id: user.id,
            story_id: storyId,
            current_node_id: startNode.id,
            is_completed: false,
            completion_pct: 10,
            last_played_at: new Date().toISOString(),
          });
        }
      }

      if (targetNodeId) {
        await loadNode(targetNodeId);
      }
      setLoading(false);
    }

    initGame();
  }, [storyId, shouldReset]);

  // Charger un noeud et ses choix associés
  async function loadNode(nodeId: string) {
    const { data: node } = await supabase
      .from("story_nodes")
      .select("*")
      .eq("id", nodeId)
      .single();

    if (node) {
      setCurrentNode(node);
      const { data: choiceList } = await supabase
        .from("story_choices")
        .select("*, choice_effects(*)")
        .eq("node_id", nodeId)
        .order("display_order", { ascending: true });

      setChoices(choiceList || []);
    }
  }

  // Boire une potion / utiliser un objet de l'inventaire en jeu
  async function handleUseItem(invItem: any) {
    if (invItem.quantity <= 0) return;
    const item = invItem.items;
    if (!item) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Soigner si c'est une potion
    if (item.item_type === "potion") {
      const healAmount = 5;
      const newHp = Math.min(stats.hp_max, stats.hp_current + healAmount);
      const updatedStats = { ...stats, hp_current: newHp };
      setStats(updatedStats);

      // Mettre à jour stats en base
      await supabase
        .from("character_stats")
        .update({ hp_current: newHp })
        .eq("user_id", user.id)
        .eq("story_id", storyId);

      // Décrémenter l'inventaire
      if (invItem.quantity > 1) {
        await supabase
          .from("user_inventory")
          .update({ quantity: invItem.quantity - 1 })
          .eq("id", invItem.id);
        setInventory(
          inventory.map((i) =>
            i.id === invItem.id ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
      } else {
        await supabase.from("user_inventory").delete().eq("id", invItem.id);
        setInventory(inventory.filter((i) => i.id !== invItem.id));
      }

      setNotification(`🧪 +${healAmount} PV ! Potion consommée.`);
    }
  }

  // Effectuer un choix (avec support des jets de dés D20)
  async function handleChoice(choice: any) {
    if (!choice.target_node_id) return;
    setSaving(true);

    // Détection d'un test de dé si le texte du choix contient un test
    const isDiceCheck =
      choice.text.toLowerCase().includes("test") ||
      choice.flavor_text?.toLowerCase().includes("test");

    if (isDiceCheck) {
      setDiceRolling(true);
      const rolled = Math.floor(Math.random() * 20) + 1;
      setDiceResult(rolled);
      await new Promise((r) => setTimeout(r, 1200));
      setDiceRolling(false);
      setNotification(`🎲 Jet de dé D20 : Résultat ${rolled} !`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Enregistrer le choix dans l'historique
    await supabase.from("choice_history").insert({
      user_id: user.id,
      story_id: storyId,
      node_id: currentNode.id,
      choice_id: choice.id,
    });

    // 2. Traiter les effets éventuels du choix
    let updatedStats = { ...stats };
    if (choice.choice_effects && choice.choice_effects.length > 0) {
      choice.choice_effects.forEach((effect: any) => {
        if (effect.effect_type === "stat_modifier" && effect.stat_key) {
          const key = effect.stat_key as keyof typeof updatedStats;
          if (typeof updatedStats[key] === "number") {
            (updatedStats[key] as number) += effect.stat_value || 0;
            setNotification(
              `${effect.stat_value > 0 ? "+" : ""}${effect.stat_value} ${effect.stat_key.toUpperCase()}`
            );
          }
        }
      });

      // Mettre à jour les stats en base
      await supabase
        .from("character_stats")
        .update({
          hp_current: updatedStats.hp_current,
          strength: updatedStats.strength,
          agility: updatedStats.agility,
          luck: updatedStats.luck,
          narrative_flags: updatedStats.narrative_flags,
        })
        .eq("user_id", user.id)
        .eq("story_id", storyId);

      setStats(updatedStats);
    }

    // 3. Charger le noeud cible
    const { data: nextNode } = await supabase
      .from("story_nodes")
      .select("*")
      .eq("id", choice.target_node_id)
      .single();

    if (nextNode) {
      setCurrentNode(nextNode);

      const isEnding =
        nextNode.is_ending ||
        nextNode.node_key === "victoire" ||
        nextNode.node_key === "game_over";
      const isVictory =
        nextNode.ending_type === "victory" || nextNode.node_key === "victoire";

      // 4. Récupérer la progression existante pour vérifier les fins déjà trouvées (anti-exploit de gemmes)
      const { data: existingProgress } = await supabase
        .from("user_story_progress")
        .select("endings_found, is_completed")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      const oldEndings: string[] = existingProgress?.endings_found || [];
      const endingKey = nextNode.node_key || (isVictory ? "victoire" : "game_over");
      const isNewEnding = isEnding && !oldEndings.includes(endingKey);
      const updatedEndings = isEnding
        ? Array.from(new Set([...oldEndings, endingKey]))
        : oldEndings;

      // 5. Mettre à jour la progression du joueur
      await supabase
        .from("user_story_progress")
        .update({
          current_node_id: nextNode.id,
          is_completed: isEnding ? true : existingProgress?.is_completed || false,
          completion_pct: isEnding ? 100 : 50,
          endings_found: updatedEndings,
          completed_at: isEnding ? new Date().toISOString() : null,
          last_played_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("story_id", storyId);

      // 6. Si dénouement, attribuer les récompenses si fin inédite
      if (isEnding) {
        setIsFirstDiscovery(isNewEnding);

        if (isVictory && isNewEnding) {
          setGemsAwarded(20);
          // Créditer 20 gemmes de 1ère victoire
          const { data: wallet } = await supabase
            .from("wallets")
            .select("gems")
            .eq("user_id", user.id)
            .single();

          if (wallet) {
            await supabase
              .from("wallets")
              .update({ gems: wallet.gems + 20 })
              .eq("user_id", user.id);

            // Mettre à jour le store client immédiatement pour affichage en temps réel
            addGems(20);
          }

          // Enregistrer la transaction de récompense
          await supabase.from("transactions").insert({
            user_id: user.id,
            type: "gem_reward",
            status: "completed",
            gems_delta: 20,
            story_id: storyId,
            metadata: { reason: "first_victory", ending: endingKey },
          });

          setNotification("+20 💎 Récompense de 1ère victoire !");
        } else if (isVictory && !isNewEnding) {
          setGemsAwarded(0);
          setNotification("Fin déjà découverte (0 💎)");
        }

        // Vérifier et débloquer les succès (ex: "Premier Pas")
        const unlockedAchievements = await checkAndUnlockAchievements(
          supabase,
          user.id
        );

        if (unlockedAchievements.length > 0) {
          setTimeout(() => {
            setNotification(`Succès débloqué : ${unlockedAchievements.join(", ")} !`);
          }, 1500);
        }
      }

      // Charger les choix du prochain noeud
      const { data: nextChoices } = await supabase
        .from("story_choices")
        .select("*, choice_effects(*)")
        .eq("node_id", nextNode.id)
        .order("display_order", { ascending: true });

      setChoices(nextChoices || []);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Ouverture du grimoire...
        </p>
      </div>
    );
  }

  const isEnding =
    currentNode?.is_ending ||
    currentNode?.node_key === "victoire" ||
    currentNode?.node_key === "game_over";
  const isVictory =
    currentNode?.ending_type === "victory" || currentNode?.node_key === "victoire";

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Header HUD (Affichage discret des stats du joueur en lecture) */}
      <header className="flex items-center justify-between py-2 border-b border-border/40 mb-6">
        <Link
          href={`/story/${storyId}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quitter</span>
        </Link>

        {/* Stats du joueur : PV, Force & Gemmes réactives */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>
              {stats.hp_current} / {stats.hp_max} PV
            </span>
            {equipmentBonuses.hp_max ? (
              <span className="text-[10px] text-[--hero-emerald] font-normal">
                (+{equipmentBonuses.hp_max})
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Sword className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.strength} FOR</span>
            {equipmentBonuses.strength ? (
              <span className="text-[10px] text-[--hero-emerald] font-normal">
                (+{equipmentBonuses.strength})
              </span>
            ) : null}
          </div>

          {/* Solde de gemmes dynamique */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[--hero-gold]" />
            <span>{currentWalletGems} 💎</span>
          </div>

          {/* Bouton Sacoche d'inventaire */}
          <button
            onClick={() => setIsBagOpen(!isBagOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-bold text-xs transition-colors relative"
            title="Ouvrir la sacoche d'inventaire"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sacoche</span>
            {inventory.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[--hero-emerald] animate-pulse" />
            )}
          </button>
        </div>

        {/* Titre de l'histoire */}
        <span className="text-xs text-muted-foreground truncate max-w-[100px] font-serif italic hidden sm:inline">
          {story?.title}
        </span>
      </header>

      {/* Tiroir / Modale Sacoche Rapide en jeu */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 glass-card rounded-2xl p-4 border-2 border-primary/50 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  Votre Sacoche d&apos;Aventurier
                </h4>
              </div>
              <button
                onClick={() => setIsBagOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inventory.map((inv) => {
                  const isPotion = inv.items?.item_type === "potion";

                  return (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-xl bg-card/80 border border-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">
                          {isPotion ? "🧪" : "🗡️"}
                        </span>
                        <div className="truncate">
                          <div className="font-bold truncate">
                            {inv.items?.name} (x{inv.quantity})
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {inv.items?.description}
                          </div>
                        </div>
                      </div>

                      {isPotion && (
                        <Button
                          size="sm"
                          onClick={() => handleUseItem(inv)}
                          disabled={stats.hp_current >= stats.hp_max}
                          className="h-6 text-[10px] font-bold px-2 shrink-0 bg-[--hero-emerald] hover:bg-[--hero-emerald]/90 text-white"
                        >
                          Boire (+5 PV)
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Votre sacoche est vide. Achetez des potions à la boutique pour survivre aux combats difficiles !
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Overlay Jet de Dé D20 */}
      <AnimatePresence>
        {diceRolling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <div className="glass-card rounded-3xl p-8 text-center space-y-4 border-2 border-[--hero-gold] glow-gold max-w-xs">
              <Dices className="w-16 h-16 mx-auto text-[--hero-gold] animate-spin" />
              <div className="space-y-1">
                <h3 className="text-xl font-black gradient-hero">
                  Lancer de Dé en cours...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Le destin tranche votre bravoure !
                </p>
              </div>
              <div className="text-4xl font-black text-primary animate-pulse">
                🎲 {diceResult || "?"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification flottante temporaire de bonus/malus */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="self-center mb-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu narratif principal */}
      <main className="flex-1 flex flex-col justify-between space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode?.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Titre du chapitre / noeud */}
            {currentNode?.title && (
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-primary font-bold">
                  Chapitre
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                  {currentNode.title}
                </h2>
              </div>
            )}

            {/* Illustration éventuelle */}
            {currentNode?.illustration_url && (
              <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-border/80 relative shadow-md">
                <img
                  src={currentNode.illustration_url}
                  alt={currentNode.title || "Illustration"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Paragraphes narratifs (rendu typographique soigné style livre premium) */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-border/60 shadow-md">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90 font-serif whitespace-pre-line tracking-normal selection:bg-primary/30">
                {currentNode?.content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Section des Choix ou Écran de Fin */}
        <div className="pt-4 pb-8 space-y-4">
          {!isEnding ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[--hero-gold]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Que décidez-vous ?
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {choices.map((choice, index) => (
                  <Button
                    key={choice.id}
                    variant="outline"
                    disabled={saving}
                    onClick={() => handleChoice(choice)}
                    className="w-full h-auto py-3.5 px-4 rounded-xl border-border/80 hover:border-primary hover:bg-primary/10 transition-all duration-200 flex items-start justify-between text-left group"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary shrink-0">
                          {index + 1}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                      {choice.flavor_text && (
                        <p className="text-xs text-muted-foreground italic pl-7">
                          {choice.flavor_text}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            /* Écran de Dénouement / Fin d'histoire */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card rounded-2xl p-6 text-center space-y-5 border-2 border-primary/40 glow-purple"
            >
              <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary">
                {isVictory ? (
                  <Trophy className="w-10 h-10 text-[--hero-gold]" />
                ) : (
                  <Skull className="w-10 h-10 text-red-400" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black">
                  {isVictory ? "Victoire Glorieuse !" : "Fin de l'Aventure"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isVictory
                    ? isFirstDiscovery
                      ? "Félicitations ! Vous avez découvert cette fin pour la 1ère fois."
                      : "Vous avez une nouvelle fois triomphé de cette quête."
                    : "Votre bravoure restera gravée dans les mémoires."}
                </p>

                {/* Badge de récompense */}
                {isVictory && (
                  <div className="pt-1 flex justify-center">
                    {isFirstDiscovery ? (
                      <Badge className="bg-[--hero-emerald]/20 text-[--hero-emerald] border-[--hero-emerald]/40 text-xs px-3 py-1 font-bold gap-1 animate-bounce">
                        <Sparkles className="w-3.5 h-3.5" /> +20 💎 Ajoutées à votre trésor !
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs px-3 py-1">
                        ✓ Fin déjà explorée (0 💎)
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/story/${storyId}/play?reset=true`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Explorer d&apos;autres choix
                  </Button>
                </Link>

                <Link href="/catalogue" className="flex-1">
                  <Button className="w-full gap-2 font-bold glow-purple">
                    <Award className="w-4 h-4" />
                    Retour au catalogue
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
