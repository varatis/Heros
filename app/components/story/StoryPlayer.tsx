"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
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
import { markReadingDone } from "@/lib/streak";
import { haptic, hapticSuccess, hapticError } from "@/lib/haptics";
import { sfxChoice, sfxCoin, sfxDeath, sfxPageTurn, sfxSuccess } from "@/lib/sound";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import GemIcon from "@/components/shared/GemIcon";

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

  // Initialisation du jeu — play-first : auto guest si pas de session
  useEffect(() => {
    async function initGame() {
      setLoading(true);
      let {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        try {
          const { data, error } = await (supabase.auth as any).signInAnonymously();
          if (!error && data?.user) user = data.user;
          else {
            router.push("/login");
            return;
          }
        } catch {
          router.push("/login");
          return;
        }
      }

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

      // 4. Récupérer l'inventaire cloisonné par aventure (story_id) — fix fuite inter-histoire
      const { data: rawInv } = await (supabase as any)
        .from("user_inventory")
        .select("*")
        .eq("user_id", user.id)
        .eq("story_id", storyId);

      let userInv: any[] = [];
      if (rawInv && rawInv.length > 0) {
        const itemIds = (rawInv as any[]).map((i: any) => i.item_id);
        const { data: itemsList } = await supabase
          .from("items")
          .select("*")
          .in("id", itemIds);

        const itemsMap = new Map(((itemsList as any[]) || []).map((it: any) => [it.id, it]));
        userInv = (rawInv as any[]).map((inv: any) => ({
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

  // Effectuer un choix — détection robuste via metadata + haptics + braise
  async function handleChoice(choice: any) {
    if (!choice.target_node_id) return;
    setSaving(true);
    haptic("light");
    sfxChoice();

    // Détection D20 : 1) metadata.dice_required 2) fallback substring
    const metaRequiresDice = (choice.metadata as any)?.dice_required === true || (choice.metadata as any)?.requires_roll === true;
    const isDiceCheck =
      metaRequiresDice ||
      choice.text.toLowerCase().includes("test") ||
      choice.flavor_text?.toLowerCase().includes("test");

    if (isDiceCheck) {
      setDiceRolling(true);
      haptic("medium");
      const rolled = Math.floor(Math.random() * 20) + 1;
      setDiceResult(rolled);
      await new Promise((r) => setTimeout(r, 1200));
      setDiceRolling(false);
      setNotification(`🎲 Jet D20 : ${rolled} !`);
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

  // Braise Kaï : marquer lecture quand on charge un nouveau noeud non-ending + sfx
  useEffect(() => {
    if (currentNode && !currentNode.is_ending) {
      try { markReadingDone(); sfxPageTurn(); } catch {}
    }
  }, [currentNode?.id]);

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

  const hpPct = Math.max(0, Math.min(100, (stats.hp_current / Math.max(1, stats.hp_max)) * 100));
  const isGenericStory = story?.slug !== "les-maitres-des-tenebres" && story?.genre !== "fantasy";

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
      {/* Header HUD fin — 1 barre or, 7px, lecture d'abord */}
      <header className="flex items-center justify-between py-2.5 mb-3 gap-2">
        <Link
          href={`/story/${storyId}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-white/15 transition-colors"
          aria-label="Retour à la fiche du livre"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quitter</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 text-[#dfbb78]" aria-hidden="true" />
            <span className="truncate max-w-[120px] font-serif italic">{story?.title ?? "Grimoire"}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-[#dfbb78]/30 bg-[#dfbb78]/10 px-2.5 py-1 text-xs font-bold text-[#dfbb78]" aria-live="polite">
            <GemIcon size="xs" variant="ice" title="" />
            <span className="tabular-nums">{currentWalletGems}</span>
          </div>
          <button
            onClick={() => { haptic("light"); setIsBagOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
            aria-label={`Sacoche ${inventory.length} objets`}
            aria-expanded={isBagOpen}
            aria-controls="sheet-sacoche"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sacoche</span>
            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] tabular-nums">{inventory.length}</span>
          </button>
        </div>
      </header>

      {/* HUD fin lecture — Vie / Armure / Attaque */}
      <div className="reader-hud !rounded-2xl !static mb-4" role="status" aria-label="État du héros">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300"><Heart size={14} className="fill-red-500 text-red-500" /> {stats.hp_current}/{stats.hp_max}</span>
        <div className="hud-bar flex-1 max-w-[140px]" aria-hidden="true"><div className={hpPct < 35 ? "hud-fill hud-fill--danger" : "hud-fill"} style={{ width: `${hpPct}%` }} /></div>
        {isGenericStory ? (
          <>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-300"><Shield size={13} /> {equipmentBonuses.armor ?? 0}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300"><Sword size={13} /> {equipmentBonuses.attack ?? stats.strength}</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300"><Sword size={13} /> {stats.strength} FOR</span>
        )}
        <span className="text-[10px] text-muted-foreground hidden sm:inline">{hpPct < 35 ? "Blessé" : hpPct < 70 ? "Éprouvé" : "Vaillant"}</span>
      </div>

      {/* Sacoche — Sheet basse P0.4 (progressive disclosure) */}
      <Sheet open={isBagOpen} onOpenChange={setIsBagOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-white/10 bg-[#0c1410] p-0 max-h-[82dvh] overflow-hidden" aria-describedby="sheet-sacoche-desc">
          <SheetHeader className="p-4 pb-2 text-left border-b border-white/10">
            <SheetTitle className="flex items-center gap-2 text-base"><Package className="w-4 h-4 text-primary" /> Sacoche d&apos;Aventurier <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums">{inventory.length}</span></SheetTitle>
            <SheetDescription id="sheet-sacoche-desc" className="text-xs">Objets trouvés dans cette aventure uniquement. Le butin ne se vend pas — il se mérite.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "60dvh" }}>
            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {inventory.map((inv) => {
                  const isPotion = inv.items?.item_type === "potion";
                  return (
                    <div key={inv.id} className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-base">{isPotion ? "🧪" : "🗡️"}</span>
                        <div className="min-w-0">
                          <div className="font-bold truncate">{inv.items?.name} <span className="font-normal text-muted-foreground">×{inv.quantity}</span></div>
                          <div className="text-[11px] text-muted-foreground truncate">{inv.items?.description}</div>
                        </div>
                      </div>
                      {isPotion && (
                        <Button size="sm" onClick={() => { haptic("medium"); sfxCoin(); handleUseItem(inv); }} disabled={stats.hp_current >= stats.hp_max} className="h-8 text-xs font-bold px-3 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white">
                          Boire
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm text-muted-foreground">Sacoche vide.</p>
                <p className="text-xs text-muted-foreground/70">Fouillez les alcôves, ouvrez les coffres. Le Magnamund récompense les curieux.</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Animation Overlay Jet de Dé D20 */}
      <AnimatePresence>
        {diceRolling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <div className="glass-card rounded-3xl p-8 text-center space-y-4 border-2 border-[var(--hero-gold)] glow-gold max-w-xs">
              <Dices className="w-16 h-16 mx-auto text-[var(--hero-gold)] animate-spin" />
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

      {/* Notification — aria-live + haptics */}
      <AnimatePresence>
        {notification && (
          <motion.div
            role="status"
            aria-live="polite"
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

            {/* Parchemin texturé — le cœur heroic fantasy */}
            <div className="reading-paper reading-paper--corner reader-surface" data-reading-theme="paper">
              <p className="font-serif whitespace-pre-line selection:bg-[#dfbb78]/30">
                {currentNode?.content}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#d6cbb5]/60 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#9a8a6a]">§ {currentNode?.node_key ?? currentNode?.id?.slice(0,6)}</span>
                <button type="button" onClick={() => { try { if (navigator.share && currentNode?.content) navigator.share({ title: story?.title, text: String(currentNode.content).slice(0,200) }); else if (navigator.clipboard) { navigator.clipboard.writeText(String(currentNode.content).slice(0,280)); setNotification("Extrait copié — partage ton destin ✨"); } } catch {} haptic("light"); }} className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cbb5] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[#5a4a2a] hover:bg-white">
                  <Sparkles size={12} /> Partager
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Section des Choix ou Écran de Fin */}
        <div className="pt-4 pb-8 space-y-4">
          {!isEnding ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--hero-gold)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Que décidez-vous ?
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {choices.map((choice, index) => {
                  const isPrimary = index === 0;
                  return (
                  <Button
                    key={choice.id}
                    variant={isPrimary ? "default" : "outline"}
                    disabled={saving}
                    onClick={() => handleChoice(choice)}
                    className={
                      isPrimary
                        ? "w-full h-auto py-4 px-4 rounded-xl btn-primary--hero flex items-start justify-between text-left group shadow-lg"
                        : "w-full h-auto py-3.5 px-4 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#dfbb78]/30 flex items-start justify-between text-left group"
                    }
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span className={isPrimary ? "w-6 h-6 rounded-full bg-[#1c1507]/15 flex items-center justify-center text-[11px] font-extrabold shrink-0" : "w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0"}>
                          {index + 1}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                      {choice.flavor_text && (
                        <p className={isPrimary ? "text-xs opacity-80 pl-8 text-[#1c1507]/80" : "text-xs text-muted-foreground italic pl-7"}>
                          {choice.flavor_text}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={isPrimary ? "w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" : "w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"} />
                  </Button>
                )})}
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
                  <Trophy className="w-10 h-10 text-[var(--hero-gold)]" />
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
                      <Badge className="bg-[var(--hero-emerald)]/20 text-[var(--hero-emerald)] border-[var(--hero-emerald)]/40 text-xs px-3 py-1 font-bold gap-1 animate-bounce">
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
