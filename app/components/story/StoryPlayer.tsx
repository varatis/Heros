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
  invokeResolveCombatRound,
  ResolveCombatRoundResponse,
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
  const [currentNode, setCurrentNode] = useState<any>(null); // contient metadata JSONB
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

  // === Combat Loup Solitaire (serveur) ===
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<any>(null);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [allEnemies, setAllEnemies] = useState<any[]>([]);
  const [combatResult, setCombatResult] = useState<ResolveCombatRoundResponse | null>(null);
  const [combatInProgress, setCombatInProgress] = useState(false);

  // === Équipement de départ (Table de Hasard) ===
  const [equipmentRoll, setEquipmentRoll] = useState<number | null>(null);
  const [isRollingEquipment, setIsRollingEquipment] = useState(false);

  // === Choix des Disciplines Kaï ===
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const MAX_DISCIPLINES = 5;
  const [hasConfirmedDisciplines, setHasConfirmedDisciplines] = useState(false);

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

      const usesLoneWolfRules = storyData?.slug === "les-maitres-des-tenebres";

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
        // Les règles originales utilisent deux tirages de la Table de Hasard :
        // HABILETÉ = 10 + premier tirage, ENDURANCE = 20 + second tirage.
        // Les colonnes historiques de HeroBook les représentent respectivement
        // par strength et hp_current / hp_max pour rester compatibles avec le
        // moteur et les effets déjà sécurisés côté serveur.
        const hazard = () => Math.floor(Math.random() * 10);
        const combatSkill = usesLoneWolfRules ? 10 + hazard() : 5;
        const endurance = usesLoneWolfRules ? 20 + hazard() : 10;
        const base = {
          hp_current: endurance,
          hp_max: endurance,
          strength: combatSkill,
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

      // === Détection automatique de combat Loup Solitaire ===
      // On calcule ici car storyUsesLoneWolfRules est déclaré plus bas
      const isLoneWolf = story?.slug === "les-maitres-des-tenebres";
      const combatants = (node as any).metadata?.combatants;
      if (isLoneWolf && combatants && combatants.length > 0) {
        // On entre automatiquement en mode combat si des ennemis sont présents
        setIsCombatMode(true);
        setAllEnemies(combatants);
        setCurrentEnemyIndex(0);
        setCurrentEnemy(combatants[0]);
        setCombatResult(null);
      } else {
        setIsCombatMode(false);
        setCurrentEnemy(null);
        setAllEnemies([]);
        setCurrentEnemyIndex(0);
        setCombatResult(null);
      }
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

  // === Fonctions spéciales Loup Solitaire ===

  // Lancer la Table de Hasard pour l'équipement
  async function rollEquipmentTable() {
    if (!isEquipmentSetup || isRollingEquipment) return;

    setIsRollingEquipment(true);

    // Animation de dé
    await new Promise(r => setTimeout(r, 600));

    const roll = Math.floor(Math.random() * 10); // 0-9
    setEquipmentRoll(roll);
    setIsRollingEquipment(false);

    pushFeedback([
      makeFeedback("info", `Table de Hasard : vous avez tiré le ${roll}`),
    ]);
  }

  // === Jet de Hasard narratif (pour Section 36, 2, etc.) ===
  const [hazardRollResult, setHazardRollResult] = useState<number | null>(null);
  const [isRollingHazard, setIsRollingHazard] = useState(false);

  async function rollNarrativeHazard() {
    if (isRollingHazard) return;

    setIsRollingHazard(true);
    await new Promise(r => setTimeout(r, 400));
    
    const roll = Math.floor(Math.random() * 10);
    setHazardRollResult(roll);
    setIsRollingHazard(false);

    pushFeedback([
      makeFeedback("info", `Table de Hasard : ${roll}`),
    ]);

    // Application automatique des conséquences si la section en a
    const content = currentNode?.content || "";
    
    // Section 36 : ≤ 4 → -2 END + section 140
    if (content.includes("Section 36") || content.includes("vieille tour de guet")) {
      if (roll <= 4) {
        // Perte d'ENDURANCE
        const newEnd = Math.max(0, stats.hp_current - 2);
        setStats(prev => ({ ...prev, hp_current: newEnd }));
        
        // Mise à jour en base
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("character_stats")
            .update({ hp_current: newEnd })
            .eq("user_id", user.id)
            .eq("story_id", storyId);
        }

        pushFeedback([makeFeedback("danger", "Vous tombez ! -2 ENDURANCE")]);

        // Aller à la section 140
        setTimeout(async () => {
          const { data: section140 } = await supabase
            .from("story_nodes")
            .select("*")
            .eq("story_id", storyId)
            .eq("node_key", "section_140")
            .single();
          
          if (section140) {
            await loadNode(section140.id);
          }
          setHazardRollResult(null);
        }, 1800);
      } else {
        pushFeedback([makeFeedback("success", "Vous ne tombez pas !")]);
        // Aller à la section 323
        setTimeout(async () => {
          const { data: section323 } = await supabase
            .from("story_nodes")
            .select("*")
            .eq("story_id", storyId)
            .eq("node_key", "section_323")
            .single();
          
          if (section323) {
            await loadNode(section323.id);
          }
          setHazardRollResult(null);
        }, 1800);
      }
    }
  }

  // Choisir une Discipline Kaï
  function toggleDiscipline(slug: string) {
    if (!isDisciplineSelectionNode) return;

    setSelectedDisciplines(prev => {
      if (prev.includes(slug)) {
        // Désélectionner
        return prev.filter(d => d !== slug);
      } else {
        if (prev.length >= MAX_DISCIPLINES) {
          pushFeedback([makeFeedback("danger", `Vous ne pouvez choisir que ${MAX_DISCIPLINES} disciplines.`)]);
          return prev;
        }
        return [...prev, slug];
      }
    });
  }

  // === Utilitaires Loup Solitaire ===

  // Normalise le slug d'une Discipline Kaï pour correspondre à la base
  function normalizeDisciplineSlug(slug: string): string {
    const map: Record<string, string> = {
      "sixieme_sens": "six_cieme_sens",
      "sixième_sens": "six_cieme_sens",
      "six_cieme_sens": "six_cieme_sens",
    };
    return map[slug.toLowerCase()] || slug;
  }

  // Recherche intelligente d'un item par nom ou slug
  async function findItemByNameOrSlug(nameOrSlug: string, storyId: string) {
    // 1. Essayer par slug exact
    let { data } = await supabase
      .from("items")
      .select("id, name, slug")
      .eq("slug", nameOrSlug.toLowerCase().replace(/\s+/g, '-'))
      .eq("story_id", storyId)
      .single();

    if (data) return data;

    // 2. Essayer par nom (ilike)
    ({ data } = await supabase
      .from("items")
      .select("id, name, slug")
      .ilike("name", `%${nameOrSlug}%`)
      .eq("story_id", storyId)
      .limit(1)
      .single());

    if (data) return data;

    // 3. Essayer par slug généré depuis le nom
    const generatedSlug = nameOrSlug.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    ({ data } = await supabase
      .from("items")
      .select("id, name, slug")
      .eq("slug", generatedSlug)
      .eq("story_id", storyId)
      .single());

    return data;
  }

  // Valider les 5 disciplines et avancer vers l'étape suivante
  async function confirmDisciplines() {
    if (selectedDisciplines.length !== MAX_DISCIPLINES) {
      pushFeedback([makeFeedback("danger", "Vous devez choisir exactement 5 disciplines.")]);
      return;
    }

    // Applique les flags localement + en base de données
    const newFlags: Record<string, boolean> = {};
    selectedDisciplines.forEach(slug => {
      const realSlug = normalizeDisciplineSlug(slug);
      newFlags[realSlug] = true;
    });

    setStats(prev => ({
      ...prev,
      narrative_flags: { ...prev.narrative_flags, ...newFlags },
    }));

    // Sauvegarde en base
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("character_stats").upsert({
          user_id: user.id,
          story_id: storyId,
          narrative_flags: newFlags,
        }, { onConflict: "user_id,story_id" });
      }
    } catch (err) {
      console.error("Erreur sauvegarde narrative_flags:", err);
    }

    pushFeedback([
      makeFeedback("success", `Vous avez choisi : ${selectedDisciplines.map(s => kaiDisciplines.find(d => d.slug === s)?.name).join(", ")}`),
    ]);

    setHasConfirmedDisciplines(true);

    // === Avancement FORCÉ : d'abord l'Équipement de départ ===
    try {
      // Chercher le nœud d'équipement de départ (equipment_setup)
      const { data: equipmentNode } = await supabase
        .from("story_nodes")
        .select("*")
        .eq("story_id", storyId)
        .eq("metadata->>kind", "equipment_setup")
        .single();

      if (equipmentNode) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_story_progress").upsert({
            user_id: user.id,
            story_id: storyId,
            current_node_id: equipmentNode.id,
            last_played_at: new Date().toISOString(),
          });
        }

        await loadNode(equipmentNode.id);
      } else {
        // Fallback : Section 1
        const { data: sectionOne } = await supabase
          .from("story_nodes")
          .select("*")
          .eq("story_id", storyId)
          .eq("node_key", "section_001")
          .single();

        if (sectionOne) {
          await loadNode(sectionOne.id);
        }
      }
    } catch (err) {
      console.error("Erreur avancement disciplines:", err);
    }
  }

  // === Fonction de combat Loup Solitaire (résolution serveur) ===
  async function handleCombatRound(escape: boolean = false) {
    if (!currentEnemy || !currentNode || combatInProgress) return;

    setCombatInProgress(true);
    setCombatResult(null);

    try {
      const res = await invokeResolveCombatRound({
        story_id: storyId,
        enemy: {
          name: currentEnemy.name,
          combat_skill: currentEnemy.combat_skill,
          endurance: currentEnemy.endurance,
        },
        escape,
        enemy_index: currentEnemyIndex,
        total_enemies: allEnemies.length,
      });

      setCombatResult(res);

      // Mise à jour des stats du joueur (ENDURANCE)
      setStats((prev) => ({
        ...prev,
        hp_current: res.player_endurance,
      }));

      // Feedback clair
      const events: FeedbackEvent[] = [];

      if (escape) {
        events.push(makeFeedback("danger", `Fuite ! Vous perdez ${res.player_loss} END.`));
      } else {
        if (res.player_loss > 0) {
          events.push(makeFeedback("danger", `Vous perdez ${res.player_loss} END.`));
        }
        if (res.enemy_loss > 0) {
          events.push(makeFeedback("success", `${currentEnemy.name} perd ${res.enemy_loss} END.`));
        }
      }

      if (res.combat_ended) {
        if (res.winner === "player") {
          // Victoire sur l'ennemi actuel
          const nextIndex = currentEnemyIndex + 1;

          if (nextIndex < allEnemies.length) {
            // Encore des ennemis → passe au suivant
            events.push(makeFeedback("success", `Victoire ! ${currentEnemy.name} est vaincu. Prochain ennemi...`));
            
            setTimeout(() => {
              setCurrentEnemyIndex(nextIndex);
              setCurrentEnemy(allEnemies[nextIndex]);
              setCombatResult(null);
            }, 1800);
          } else {
            // Dernier ennemi vaincu → fin du combat
            events.push(makeFeedback("success", `Victoire totale ! Tous les ennemis sont vaincus.`));
            setTimeout(() => {
              setIsCombatMode(false);
              setCurrentEnemy(null);
              setAllEnemies([]);
              setCurrentEnemyIndex(0);
              setCombatResult(null);
            }, 2200);
          }
        } else {
          events.push(makeFeedback("danger", "Vous avez succombé au combat..."));
        }
      } else {
        events.push(makeFeedback("info", `Quotient d'Attaque : ${res.attack_quotient} | Hasard : ${res.hazard_roll}`));
      }

      pushFeedback(events);
    } catch (err) {
      pushFeedback([
        makeFeedback(
          "danger",
          err instanceof Error ? err.message : "Erreur lors du combat."
        ),
      ]);
    } finally {
      setCombatInProgress(false);
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
  const storyUsesLoneWolfRules = story?.slug === "les-maitres-des-tenebres";
  const readingProgress = isEnding ? 100 : Math.min(92, 12 + pageNumber * 8);

  // === Modes spéciaux Loup Solitaire (très prioritaire) ===
  const nodeKind = (currentNode as any)?.metadata?.kind;
  const isEquipmentSetup = nodeKind === "equipment_setup";
  const isDisciplineSelectionNode = nodeKind === "discipline_selection" || nodeKind === "kai_disciplines";
  const showDisciplineSelection = isDisciplineSelectionNode && !hasConfirmedDisciplines;

  const isSpecialLoneWolfStep = isEquipmentSetup || isDisciplineSelectionNode;

  // Données pour les Disciplines Kaï
  const kaiDisciplines = [
    { slug: "camouflage", name: "Camouflage", desc: "Se fondre dans le paysage et passer inaperçu." },
    { slug: "chasse", name: "Chasse", desc: "Ne jamais mourir de faim et se déplacer sans bruit." },
    { slug: "sixieme_sens", name: "Sixième Sens", desc: "Sentir les dangers imminents et les intentions." },
    { slug: "orientation", name: "Orientation", desc: "Toujours choisir la bonne direction." },
    { slug: "guerison", name: "Guérison", desc: "Récupérer 1 END par paragraphe sans combat." },
    { slug: "maitrise_armes", name: "Maîtrise des armes", desc: "+2 HAB avec une arme choisie." },
    { slug: "bouclier_psychique", name: "Bouclier psychique", desc: "Résistance aux agressions mentales." },
    { slug: "puissance_psychique", name: "Puissance psychique", desc: "+2 HAB en attaque mentale." },
    { slug: "communication_animale", name: "Communication Animale", desc: "Parler avec les animaux." },
    { slug: "maitrise_psychique_matiere", name: "Maîtrise Psychique de la Matière", desc: "Manipuler la matière par la pensée." },
  ];

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

        {/* Stats du joueur : PV/Endurance, Force/Habileté & Gemmes réactives */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>
              {stats.hp_current}/{stats.hp_max}
              <span className="hidden sm:inline"> {storyUsesLoneWolfRules ? "END" : "PV"}</span>
            </span>
            {equipmentBonuses.hp_max ? (
              <span className="text-[10px] text-[--hero-emerald] font-normal">
                (+{equipmentBonuses.hp_max})
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Sword className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.strength}<span className="hidden sm:inline"> {storyUsesLoneWolfRules ? "HAB" : "FOR"}</span></span>
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
                          Boire (+{storyUsesLoneWolfRules ? 4 : 5} {storyUsesLoneWolfRules ? "END" : "PV"})
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

        {/* === Mode Jet de Hasard narratif (Section 36, 2, etc.) === */}
        {!isEquipmentSetup && !showDisciplineSelection && storyUsesLoneWolfRules && 
         (currentNode?.content?.includes("Utilisez la Table de Hasard pour obtenir un chiffre") || 
          currentNode?.content?.includes("Utilisez la Table de Hasard pour obtenir")) && (
          <div className="mb-6 rounded-2xl border-2 border-purple-500/40 bg-purple-950/20 p-6">
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-[3px] text-purple-400 font-black mb-1">TEST DE HASARD</div>
              <h3 className="text-2xl font-black text-purple-300">Lancer la Table de Hasard</h3>
            </div>

            {!hazardRollResult && (
              <div className="flex justify-center">
                <Button
                  onClick={rollNarrativeHazard}
                  disabled={isRollingHazard}
                  className="h-14 px-10 text-lg font-black bg-purple-600 hover:bg-purple-700"
                >
                  {isRollingHazard ? "Lancement..." : "🎲 Lancer la Table de Hasard"}
                </Button>
              </div>
            )}

            {hazardRollResult !== null && (
              <div className="text-center">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-purple-500/60 bg-black/40 px-8 py-4 mb-4">
                  <div className="text-6xl font-black text-purple-400 tabular-nums">{hazardRollResult}</div>
                  <div className="text-left">
                    <div className="text-xs text-purple-400/70">RÉSULTAT</div>
                    <div className="text-xl font-black text-white">Table de Hasard</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === Mode Équipement de départ (Table de Hasard) === */}
        {isEquipmentSetup && storyUsesLoneWolfRules && (
          <div className="mb-6 rounded-2xl border-2 border-amber-500/40 bg-amber-950/20 p-6">
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-[3px] text-amber-400 font-black mb-1">ÉTAPE 1</div>
              <h3 className="text-2xl font-black text-amber-300">Équipement de départ</h3>
              <p className="text-sm text-amber-400/80 mt-2 max-w-md mx-auto">
                Lancez la Table de Hasard pour découvrir l’objet supplémentaire que vous avez trouvé dans les ruines.
              </p>
            </div>

            {/* Bouton de lancer */}
            {!equipmentRoll && (
              <div className="flex justify-center">
                <Button
                  onClick={rollEquipmentTable}
                  disabled={isRollingEquipment}
                  className="h-14 px-10 text-lg font-black bg-amber-600 hover:bg-amber-700 flex items-center gap-3"
                >
                  {isRollingEquipment ? (
                    <>Lancement en cours...</>
                  ) : (
                    <>🎲 Lancer la Table de Hasard</>
                  )}
                </Button>
              </div>
            )}

            {/* Résultat du tirage */}
            {equipmentRoll !== null && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/60 bg-black/40 px-8 py-4">
                  <div className="text-6xl font-black text-amber-400 tabular-nums">{equipmentRoll}</div>
                  <div className="text-left">
                    <div className="text-xs text-amber-400/70">RÉSULTAT</div>
                    <div className="text-xl font-black text-white">Table de Hasard</div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des objets - seul le résultat est cliquable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {Object.entries((currentNode as any)?.metadata?.random_table || {}).map(([num, item]) => {
                const numInt = parseInt(num);
                const isSelected = equipmentRoll === numInt;
                const isDisabled = equipmentRoll !== null && !isSelected;

                return (
                  <Button
                    key={num}
                    variant={isSelected ? "default" : "outline"}
                    disabled={isDisabled}
                    onClick={async () => {
                      if (isSelected) {
                        pushFeedback([makeFeedback("success", `Vous prenez : ${item}`)]);

                        // === Ajout des objets de départ + objet aléatoire dans l'inventaire ===
                        try {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) return;

                          const itemsToAdd = [
                            "Hache",
                            "Sac à Dos", 
                            "Repas",
                            "Carte Géographique",
                          ];

                          const randomItemName = Object.values((currentNode as any)?.metadata?.random_table || {})[equipmentRoll!] as string;
                          if (randomItemName) {
                            itemsToAdd.push(randomItemName);
                          }

                          for (const itemName of itemsToAdd) {
                            const item = await findItemByNameOrSlug(itemName, storyId);
                            if (item) {
                              await supabase.from("user_inventory").upsert({
                                user_id: user.id,
                                item_id: item.id,
                                quantity: 1,
                              }, { onConflict: "user_id,item_id" });
                            } else {
                              console.warn(`Item not found in database: ${itemName}`);
                            }
                          }

                          await syncInventory();
                          pushFeedback([makeFeedback("success", "Objets ajoutés à la sacoche !")]);
                        } catch (err) {
                          console.error("Erreur ajout inventaire équipement:", err);
                        }

                        // === Avancement vers la section 1 ===
                        try {
                          setEquipmentRoll(null);

                          const { data: sectionOne } = await supabase
                            .from("story_nodes")
                            .select("*")
                            .eq("story_id", storyId)
                            .eq("node_key", "section_001")
                            .single();

                          if (sectionOne) {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                              await supabase.from("user_story_progress").upsert({
                                user_id: user.id,
                                story_id: storyId,
                                current_node_id: sectionOne.id,
                                last_played_at: new Date().toISOString(),
                              });
                            }
                            await loadNode(sectionOne.id);
                          }
                        } catch (err) {
                          console.error("Erreur avancement équipement:", err);
                        }
                      }
                    }}
                    className={`h-auto min-h-[52px] justify-start px-4 py-3 text-left transition-all ${
                      isSelected 
                        ? "bg-amber-600 border-amber-400 text-white" 
                        : isDisabled 
                          ? "opacity-40 cursor-not-allowed" 
                          : "hover:border-amber-500/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="font-mono text-lg w-8 text-center font-black text-amber-400">{num}</div>
                      <div className="flex-1 text-sm font-medium">{item as string}</div>
                      {isSelected && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">CHOISI</span>}
                    </div>
                  </Button>
                );
              })}
            </div>

            {equipmentRoll !== null && (
              <p className="text-center text-xs text-amber-400/70 mt-4">
                Cliquez sur l’objet correspondant à votre tirage pour le prendre.
              </p>
            )}
          </div>
        )}

        {/* === Mode Choix des Disciplines Kaï === */}
        {showDisciplineSelection && storyUsesLoneWolfRules && (
          <div className="mb-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-6">
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-[3px] text-emerald-400 font-black mb-1">ÉTAPE 2</div>
              <h3 className="text-2xl font-black text-emerald-300">Choisissez vos 5 Disciplines Kaï</h3>
              <p className="text-sm text-emerald-400/80 mt-1">Vous devez en sélectionner exactement 5.</p>
            </div>

            {/* Résumé visuel des choix */}
            <div className="mb-6 min-h-[60px] rounded-xl border border-emerald-500/30 bg-black/30 p-4">
              <div className="text-xs text-emerald-400/70 mb-2 font-bold">DISCIPLINES CHOISIES ({selectedDisciplines.length}/{MAX_DISCIPLINES})</div>
              {selectedDisciplines.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedDisciplines.map(slug => {
                    const disc = kaiDisciplines.find(d => d.slug === slug);
                    return (
                      <div 
                        key={slug}
                        onClick={() => toggleDiscipline(slug)}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                      >
                        {disc?.name}
                        <span className="text-emerald-300">×</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-emerald-400/60 italic">Aucune discipline sélectionnée</div>
              )}
            </div>

            {/* Grille des disciplines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kaiDisciplines.map((disc) => {
                const isSelected = selectedDisciplines.includes(disc.slug);
                const canSelect = selectedDisciplines.length < MAX_DISCIPLINES || isSelected;

                return (
                  <button
                    key={disc.slug}
                    onClick={() => toggleDiscipline(disc.slug)}
                    disabled={!canSelect && !isSelected}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected 
                        ? "border-emerald-400 bg-emerald-600/20 ring-1 ring-emerald-400" 
                        : canSelect 
                          ? "border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40" 
                          : "border-emerald-500/20 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-emerald-200 group-hover:text-white transition-colors">{disc.name}</div>
                        <div className="text-xs text-emerald-400/80 mt-1 leading-snug">{disc.desc}</div>
                      </div>
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition-all ${
                        isSelected 
                          ? "border-emerald-400 bg-emerald-500 text-white" 
                          : "border-emerald-500/60 text-emerald-400 group-hover:border-emerald-400"
                      }`}>
                        {isSelected ? "✓" : "+"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bouton de validation */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={confirmDisciplines}
                disabled={selectedDisciplines.length !== MAX_DISCIPLINES}
                className="h-12 px-10 text-base font-black bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                Valider mes {MAX_DISCIPLINES} Disciplines Kaï
              </Button>
            </div>
          </div>
        )}

        {/* === Mode Combat Loup Solitaire (serveur) === */}
        {isCombatMode && currentEnemy && storyUsesLoneWolfRules && (
          <div className="mb-6 rounded-2xl border-2 border-red-500/40 bg-red-950/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-red-400 font-black">COMBAT EN COURS</div>
                <div className="text-2xl font-black text-red-300">{currentEnemy.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-red-400">HAB / END</div>
                <div className="font-mono text-xl font-black text-red-400">
                  {currentEnemy.combat_skill} / {currentEnemy.endurance}
                </div>
              </div>
            </div>

            {/* Stats du round */}
            {combatResult && (
              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-black/30 p-3">
                  <div className="text-[10px] text-red-400">QUOTIENT D'ATTAQUE</div>
                  <div className="text-3xl font-black text-white">{combatResult.attack_quotient}</div>
                </div>
                <div className="rounded-xl bg-black/30 p-3">
                  <div className="text-[10px] text-red-400">JET DE HASARD</div>
                  <div className="text-3xl font-black text-white">{combatResult.hazard_roll}</div>
                </div>
              </div>
            )}

            {/* Actions de combat */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleCombatRound(false)}
                disabled={combatInProgress || (combatResult?.combat_ended ?? false)}
                className="flex-1 h-12 text-base font-black bg-red-600 hover:bg-red-700"
              >
                {combatInProgress ? "Résolution..." : "Attaquer"}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleCombatRound(true)}
                disabled={combatInProgress || (combatResult?.combat_ended ?? false)}
                className="flex-1 h-12 text-base font-black border-red-500/60 text-red-400 hover:bg-red-950/30"
              >
                Fuir (si autorisé)
              </Button>
            </div>

            {/* Indicateur multi-ennemis */}
            {allEnemies.length > 1 && (
              <div className="mt-3 text-center text-xs text-red-400">
                Ennemi {currentEnemyIndex + 1} / {allEnemies.length}
              </div>
            )}

            {combatResult?.combat_ended && (
              <div className="mt-4 text-center text-sm font-bold">
                {combatResult.winner === "player" ? (
                  <span className="text-emerald-400">Victoire ! L'ennemi est vaincu.</span>
                ) : (
                  <span className="text-red-400">Vous êtes tombé au combat...</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Section des Choix ou Écran de Fin — complètement caché pendant les étapes spéciales Loup Solitaire */}
        <div className="pt-4 pb-8 space-y-4">
          {!isEnding && !isCombatMode && !isSpecialLoneWolfStep ? (
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
          ) : isCombatMode ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Combat en cours — utilisez les boutons ci-dessus.
            </div>
          ) : isSpecialLoneWolfStep ? (
            // Pendant les étapes spéciales (équipement / disciplines), on n'affiche rien ici
            <div className="text-center py-4 text-xs text-muted-foreground">
              Suivez les instructions ci-dessus pour continuer.
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
