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
import { useWalletStore } from "@/stores/walletStore";
import {
  applyEquipmentStats,
  calculateInventoryBonuses,
} from "@/lib/game-engine/stats";
import {
  FunctionError,
  invokeApplyItemEffect,
  invokeMakeChoice,
} from "@/lib/supabase/functions";

interface StoryPlayerProps {
  storyId: string;
}

type FeedbackEvent = {
  id: string;
  type: "success" | "danger" | "reward" | "premium" | "info";
  message: string;
};

function makeFeedback(type: FeedbackEvent["type"], message: string): FeedbackEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    message,
  };
}

function feedbackClasses(type: FeedbackEvent["type"]) {
  switch (type) {
    case "success":
      return "border-[--hero-emerald]/35 bg-[--hero-emerald]/12 text-[--hero-emerald]";
    case "danger":
      return "border-red-400/35 bg-red-500/12 text-red-300";
    case "reward":
      return "border-[--hero-gold]/35 bg-[--hero-gold]/12 text-[--hero-gold]";
    case "premium":
      return "border-primary/40 bg-primary/14 text-primary";
    default:
      return "border-border/60 bg-muted/45 text-muted-foreground";
  }
}

export default function StoryPlayer({ storyId }: StoryPlayerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReset = searchParams.get("reset") === "true";
  const supabase = createClient();
  const { setWallet, gems: currentWalletGems } = useWalletStore();

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
  const [feedbackEvents, setFeedbackEvents] = useState<FeedbackEvent[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  function pushFeedback(events: FeedbackEvent[]) {
    setFeedbackEvents(events.slice(0, 4));
    if (events[0]) setNotification(events[0].message);
  }

  // Synchronise l'inventaire après une récompense serveur. Les objets
  // narratifs doivent apparaître dans la sacoche sans rechargement.
  async function syncInventory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setInventory([]);
      setEquipmentBonuses(calculateInventoryBonuses([]));
      return [];
    }

    const { data: rawInv } = await supabase
      .from("user_inventory")
      .select("*")
      .eq("user_id", user.id);

    let userInv: any[] = [];
    if (rawInv && rawInv.length > 0) {
      const itemIds = rawInv.map((inv) => inv.item_id);
      const { data: itemsList } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);
      const itemsMap = new Map((itemsList || []).map((item) => [item.id, item]));
      userInv = rawInv.map((inv) => ({
        ...inv,
        items: itemsMap.get(inv.item_id) || null,
      }));
    }

    setInventory(userInv);
    setEquipmentBonuses(calculateInventoryBonuses(userInv));
    return userInv;
  }

  useEffect(() => {
    if (feedbackEvents.length === 0) return;
    const timeout = window.setTimeout(() => setFeedbackEvents([]), 5200);
    return () => window.clearTimeout(timeout);
  }, [feedbackEvents]);

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
      const userInv = await syncInventory();

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
          // Création ou reset de la progression.
          // Note : is_completed / endings_found / completed_at ne sont plus
          // inscriptibles côté client (migration 004) — gérés par make-choice.
          await supabase.from("user_story_progress").upsert({
            user_id: user.id,
            story_id: storyId,
            current_node_id: startNode.id,
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
  // -> tout est validé et appliqué côté serveur (Edge Function
  //    `apply-item-effect` : possession, décrément, effet sur les stats)
  async function handleUseItem(invItem: any) {
    if (invItem.quantity <= 0) return;
    const item = invItem.items;
    if (!item || item.item_type !== "potion") return;

    setNotification(null);
    try {
      const res = await invokeApplyItemEffect(item.id, storyId);

      // Stats de base renvoyées par le serveur + bonus d'équipement (affichage)
      const base = {
        hp_current: res.hp_current,
        hp_max: res.hp_max,
        strength: res.strength,
        agility: res.agility,
        luck: res.luck,
        charisma: res.charisma,
      };
      const computed = applyEquipmentStats(base, inventory);
      setStats((s) => ({
        ...s,
        hp_current: computed.hp_current,
        hp_max: computed.hp_max,
        strength: computed.strength,
        agility: computed.agility,
        luck: computed.luck,
      }));

      // Mettre à jour la sacoche localement depuis la réponse serveur
      if (res.quantity <= 0) {
        setInventory((inv) => inv.filter((i) => i.id !== invItem.id));
      } else {
        setInventory((inv) =>
          inv.map((i) =>
            i.id === invItem.id ? { ...i, quantity: res.quantity } : i
          )
        );
      }

      pushFeedback([
        makeFeedback(
          "success",
          res.healed > 0
            ? `Potion consommée : +${res.healed} PV.`
            : "Potion consommée : vos PV étaient déjà au maximum."
        ),
      ]);
    } catch (err) {
      pushFeedback([
        makeFeedback(
          "danger",
          err instanceof Error ? err.message : "Impossible d'utiliser l'objet."
        ),
      ]);
    }
  }

  // Effectuer un choix (avec support des jets de dés D20).
  // La totalité de la logique sensible (pré-conditions, débit premium,
  // historique, effets, progression, récompenses, succès) est validée et
  // écrite par l'Edge Function `make-choice` — le client se contente
  // d'afficher la réponse du serveur.
  async function handleChoice(choice: any) {
    if (!choice.target_node_id || saving) return;
    setSaving(true);

    // Détection d'un test de dé si le texte du choix contient un test
    // (animation cosmétique : le résultat narratif vient du serveur)
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

    const previousStats = stats;
    const previousGems = currentWalletGems;

    try {
      const res = await invokeMakeChoice(choice.id);

      // 1. Noeud narratif + choix suivants (source de vérité serveur)
      setCurrentNode(res.node);
      setChoices(res.choices || []);

      // 2. Stats de base serveur + bonus d'équipement (affichage)
      const base = {
        hp_current: res.stats.hp_current,
        hp_max: res.stats.hp_max,
        strength: res.stats.strength,
        agility: res.stats.agility,
        luck: res.stats.luck,
        charisma: res.stats.charisma,
      };
      const inventoryChanged = res.effects_applied?.some(
        (effect) => effect === "🎁 Objet ajouté à la sacoche",
      );
      const renderedInventory = inventoryChanged
        ? await syncInventory()
        : inventory;
      const computed = applyEquipmentStats(base, renderedInventory);
      setStats({
        hp_current: computed.hp_current,
        hp_max: computed.hp_max,
        strength: computed.strength,
        agility: computed.agility,
        luck: computed.luck,
        narrative_flags:
          (res.stats.narrative_flags as Record<string, any>) || {},
      });

      // 3. Solde de gemmes mis à jour par le serveur
      if (res.wallet.gems !== null && res.wallet.gems !== undefined) {
        setWallet(res.wallet.gems);
      }

      const nextEvents: FeedbackEvent[] = [];
      const hpDelta = computed.hp_current - previousStats.hp_current;
      const strengthDelta = computed.strength - previousStats.strength;
      const luckDelta = computed.luck - previousStats.luck;
      const newGemBalance = res.wallet.gems ?? previousGems;
      const gemsDelta = newGemBalance - previousGems;

      if (choice.is_premium && choice.price_gems > 0) {
        nextEvents.push(
          makeFeedback("premium", `Choix premium utilisé : -${choice.price_gems} gemmes.`)
        );
      }
      if (hpDelta < 0) {
        nextEvents.push(makeFeedback("danger", `Blessure subie : ${hpDelta} PV.`));
      } else if (hpDelta > 0) {
        nextEvents.push(makeFeedback("success", `Soin reçu : +${hpDelta} PV.`));
      }
      if (strengthDelta !== 0) {
        nextEvents.push(
          makeFeedback(strengthDelta > 0 ? "success" : "danger", `Force ${strengthDelta > 0 ? "+" : ""}${strengthDelta}.`)
        );
      }
      if (luckDelta !== 0) {
        nextEvents.push(
          makeFeedback(luckDelta > 0 ? "success" : "danger", `Chance ${luckDelta > 0 ? "+" : ""}${luckDelta}.`)
        );
      }
      if (gemsDelta > 0 && !res.is_ending) {
        nextEvents.push(makeFeedback("reward", `Butin obtenu : +${gemsDelta} gemmes.`));
      } else if (gemsDelta < 0 && !(choice.is_premium && choice.price_gems > 0)) {
        nextEvents.push(makeFeedback("premium", `Trésor dépensé : ${gemsDelta} gemmes.`));
      }
      if (res.effects_applied?.length > 0) {
        nextEvents.push(
          ...res.effects_applied.slice(0, 3).map((effect) => makeFeedback("info", effect))
        );
      }

      // 4. Dénouement : récompenses & succès calculés côté serveur
      if (res.is_ending) {
        setIsFirstDiscovery(res.is_new_ending);
        setGemsAwarded(res.reward_gems);

        if (res.is_victory && res.is_new_ending) {
          nextEvents.push(makeFeedback("reward", `Victoire inédite : +${res.reward_gems} gemmes.`));
        } else if (res.is_victory && !res.is_new_ending) {
          nextEvents.push(makeFeedback("info", "Fin déjà découverte : 0 gemme."));
        } else {
          nextEvents.push(makeFeedback("danger", "Votre route s’achève ici… pour cette tentative."));
        }

        if (res.achievements_unlocked?.length > 0) {
          nextEvents.push(
            makeFeedback("reward", `Succès débloqué : ${res.achievements_unlocked.join(", ")} !`)
          );
        }
      }

      if (nextEvents.length === 0) {
        nextEvents.push(makeFeedback("info", "Le récit se poursuit."));
      }
      pushFeedback(nextEvents);
      setPageNumber((page) => (res.is_ending ? page + 1 : page + 1));
    } catch (err) {
      if (
        err instanceof FunctionError &&
        err.code === "insufficient_funds"
      ) {
        pushFeedback([makeFeedback("danger", "Gemmes insuffisantes pour ce choix premium.")]);
      } else if (
        err instanceof FunctionError &&
        err.code === "requirement_not_met"
      ) {
        pushFeedback([makeFeedback("danger", err.message)]);
      } else {
        pushFeedback([
          makeFeedback(
            "danger",
            err instanceof Error ? err.message : "Erreur lors du choix."
          ),
        ]);
      }
    } finally {
      setSaving(false);
    }
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
  const readingProgress = isEnding ? 100 : Math.min(92, 12 + pageNumber * 8);

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 py-3 sm:py-6">
      {/* Header HUD : 2 rangées pour éviter l'overflow horizontal mobile */}
      <header className="sticky top-3 z-30 mb-4 space-y-2 rounded-2xl border border-border/55 bg-background/72 px-2.5 py-2 shadow-2xl backdrop-blur-xl sm:mb-6 sm:px-3">
        <div className="flex items-center justify-between gap-2">
        <Link
          href={`/story/${storyId}`}
          className="inline-flex min-h-10 items-center gap-1 rounded-xl px-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quitter</span>
        </Link>
        <span className="min-w-0 truncate text-center text-xs font-serif italic text-muted-foreground">
          {story?.title}
        </span>
        <button
          onClick={() => setIsBagOpen(!isBagOpen)}
          className="relative flex min-h-10 items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/30"
          title="Ouvrir la sacoche d'inventaire"
        >
          <Package className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sacoche</span>
          {inventory.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-[--hero-emerald] animate-pulse" />
          )}
        </button>
        </div>

        {/* Stats du joueur : PV, Force & Gemmes réactives */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>
              {stats.hp_current}/{stats.hp_max}
              <span className="hidden sm:inline"> PV</span>
            </span>
            {equipmentBonuses.hp_max ? (
              <span className="text-[10px] text-[--hero-emerald] font-normal">
                (+{equipmentBonuses.hp_max})
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Sword className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.strength}<span className="hidden sm:inline"> FOR</span></span>
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
        </div>
      </header>

      <div className="mb-5 space-y-2 rounded-2xl border border-border/45 bg-background/35 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span>Page {pageNumber}</span>
          <span className="truncate text-right normal-case tracking-normal text-primary">{story?.title}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-[--hero-gold] to-[--hero-emerald] stat-bar-fill"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

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

      {/* Journal d'effets après un choix : PV, gemmes, objets, succès, premium */}
      <AnimatePresence>
        {feedbackEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 grid gap-2 sm:grid-cols-2"
          >
            {feedbackEvents.map((event) => (
              <div
                key={event.id}
                className={`rounded-2xl border px-3 py-2 text-xs font-black shadow-lg backdrop-blur-md ${feedbackClasses(event.type)}`}
              >
                {event.message}
              </div>
            ))}
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
              <div className="space-y-3 text-center">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                  <BookmarkCheck className="size-3.5" /> Chapitre · Page {pageNumber}
                </div>
                <h2 className="text-balance font-serif text-3xl font-black tracking-tight sm:text-4xl">
                  {currentNode.title}
                </h2>
                <div className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[--hero-gold]/60 to-transparent" />
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
            <div className="book-page relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9 space-y-5">
              <div className="pointer-events-none absolute inset-x-8 top-4 h-px bg-gradient-to-r from-transparent via-[--hero-gold]/25 to-transparent" />
              <p className="text-pretty whitespace-pre-line font-serif text-[1.05rem] leading-8 tracking-[0.01em] text-foreground/92 selection:bg-primary/30 sm:text-xl sm:leading-9">
                {currentNode?.content}
              </p>
              <div className="flex items-center justify-center gap-2 text-[--hero-gold]/60">
                <span className="h-px w-10 bg-current" />
                <Sparkles className="size-3.5" />
                <span className="h-px w-10 bg-current" />
              </div>
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
                    className="group h-auto min-h-12 w-full items-start justify-between whitespace-normal rounded-2xl border-border/70 bg-card/55 px-4 py-4 text-left shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:shadow-primary/10 disabled:hover:translate-y-0"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2 text-sm font-bold leading-5 transition-colors group-hover:text-primary">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border/60 bg-muted text-[10px] font-black text-muted-foreground transition-colors group-hover:border-primary/45 group-hover:bg-primary/20 group-hover:text-primary">
                          {index + 1}
                        </span>
                        <span>{choice.text}</span>
                        {choice.is_premium && choice.price_gems > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[10px] font-black shrink-0">
                            <Sparkles className="w-3 h-3 text-[--hero-gold]" />
                            {choice.price_gems} 💎
                          </span>
                        )}
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
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-[2rem] border-2 p-6 text-center shadow-2xl sm:p-8 ${
                isVictory
                  ? "border-[--hero-gold]/45 bg-[--hero-gold]/10 glow-gold"
                  : "border-red-400/35 bg-red-500/10"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.82_0.15_72/.12),transparent_16rem)]" />
              <div className="relative z-10 space-y-6">
                <div className="mx-auto grid size-20 place-items-center rounded-[1.6rem] border border-border/45 bg-background/45 shadow-inner backdrop-blur-md">
                  {isVictory ? (
                    <Trophy className="size-11 text-[--hero-gold]" />
                  ) : (
                    <Skull className="size-11 text-red-300" />
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-muted-foreground">
                    {isVictory ? "Dénouement héroïque" : "Dénouement tragique"}
                  </p>
                  <h3 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
                    {isVictory ? "Victoire glorieuse" : "Fin de l’aventure"}
                  </h3>
                  <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
                    {isVictory
                      ? isFirstDiscovery
                        ? "Vous venez d’inscrire une nouvelle fin dans votre grimoire. Votre héros ressort changé de cette page."
                        : "Vous connaissez déjà cette voie, mais chaque relecture affine votre légende."
                      : "Cette tentative s’achève dans l’ombre. Reprenez la plume, changez un choix, et forcez le destin."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/50 bg-background/35 p-2">
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-lg font-black text-red-300">{stats.hp_current}/{stats.hp_max}</div>
                    <div className="text-[10px] font-bold text-muted-foreground">PV</div>
                  </div>
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-lg font-black text-[--hero-gold]">{isVictory && isFirstDiscovery ? `+${gemsAwarded}` : "0"}</div>
                    <div className="text-[10px] font-bold text-muted-foreground">Gemmes</div>
                  </div>
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-lg font-black text-primary">{pageNumber}</div>
                    <div className="text-[10px] font-bold text-muted-foreground">Pages</div>
                  </div>
                </div>

                {isVictory && (
                  <div className="flex justify-center">
                    {isFirstDiscovery ? (
                      <Badge className="border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 px-3 py-1 text-xs font-black text-[--hero-emerald]">
                        <Sparkles className="mr-1 size-3.5" /> +{gemsAwarded} 💎 ajoutées au trésor
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="px-3 py-1 text-xs text-muted-foreground">
                        ✓ Fin déjà explorée
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link href={`/story/${storyId}/play?reset=true`} className="flex-1">
                    <Button variant="outline" className="h-10 w-full rounded-2xl font-bold">
                      <RotateCcw className="size-4" /> Explorer d’autres choix
                    </Button>
                  </Link>

                  <Link href="/catalogue" className="flex-1">
                    <Button className="h-10 w-full rounded-2xl font-black glow-purple">
                      <Award className="size-4" /> Retour au catalogue
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
