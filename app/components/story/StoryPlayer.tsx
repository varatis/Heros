"use client";

import { useState, useEffect, useRef } from "react";
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
  ScrollText,
  Swords,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GemIcon from "@/components/shared/GemIcon";
import { useWalletStore } from "@/stores/walletStore";
import {
  applyEquipmentStats,
  calculateInventoryBonuses,
} from "@/lib/game-engine/stats";
import {
  FunctionError,
  invokeApplyItemEffect,
  invokeInitGame,
  invokeGameSetupAction,
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

type JournalEntry = {
  id: string;
  kind:
    | "choice"
    | "combat"
    | "dice"
    | "item"
    | "damage"
    | "heal"
    | "reward"
    | "chapter"
    | "info";
  message: string;
  page: number;
};

function journalIcon(kind: JournalEntry["kind"]): string {
  switch (kind) {
    case "choice": return "🧭";
    case "combat": return "⚔️";
    case "dice": return "🎲";
    case "item": return "🎒";
    case "damage": return "💔";
    case "heal": return "💚";
    case "reward": return "💎";
    case "chapter": return "📖";
    default: return "✨";
  }
}

function journalAccent(kind: JournalEntry["kind"]): string {
  switch (kind) {
    case "combat": return "border-red-400/40 text-red-300";
    case "damage": return "border-red-400/40 text-red-300";
    case "heal": return "border-[--hero-emerald]/40 text-[--hero-emerald]";
    case "reward": return "border-[--hero-gold]/40 text-[--hero-gold]";
    case "dice": return "border-purple-400/40 text-purple-300";
    case "choice": return "border-primary/40 text-primary";
    case "chapter": return "border-border/60 text-foreground/80";
    default: return "border-border/60 text-muted-foreground";
  }
}

type CombatLogEntry = {
  round: number;
  attackQuotient: number;
  hazardRoll: number;
  playerLoss: number | "K";
  enemyLoss: number | "K";
  enemyName: string;
  escaped?: boolean;
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
    case "success": return "border-[--hero-emerald]/35 bg-[--hero-emerald]/12 text-[--hero-emerald]";
    case "danger": return "border-red-400/35 bg-red-500/12 text-red-300";
    case "reward": return "border-[--hero-gold]/35 bg-[--hero-gold]/12 text-[--hero-gold]";
    case "premium": return "border-primary/40 bg-primary/14 text-primary";
    default: return "border-border/60 bg-muted/45 text-muted-foreground";
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
    charisma: number;
    armor: number;
    attack_power: number;
    narrative_flags: Record<string, any>;
  }>({
    hp_current: 20,
    hp_max: 20,
    strength: 5,
    agility: 0,
    luck: 5,
    charisma: 5,
    armor: 0,
    attack_power: 5,
    narrative_flags: {},
  });
  const [feedbackEvents, setFeedbackEvents] = useState<FeedbackEvent[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hpDeltaFloat, setHpDeltaFloat] = useState<number | null>(null);
  const prevHpRef = useRef<number | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [illustrationFailed, setIllustrationFailed] = useState(false);
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<any>(null);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [allEnemies, setAllEnemies] = useState<any[]>([]);
  const [combatResult, setCombatResult] = useState<ResolveCombatRoundResponse | null>(null);
  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatRoundCount, setCombatRoundCount] = useState(0);
  const [combatHpStart, setCombatHpStart] = useState<number | null>(null);
  const [combatNotesSig, setCombatNotesSig] = useState("");
  const [equipmentRoll, setEquipmentRoll] = useState<number | null>(null);
  const [isRollingEquipment, setIsRollingEquipment] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const MAX_DISCIPLINES = 5;
  const [hasConfirmedDisciplines, setHasConfirmedDisciplines] = useState(false);
  const [hazardRollResult, setHazardRollResult] = useState<number | null>(null);
  const [isRollingHazard, setIsRollingHazard] = useState(false);

  function pushFeedback(events: FeedbackEvent[]) {
    setFeedbackEvents(events.slice(0, 4));
  }

  function logJournal(entries: Array<{ kind: JournalEntry["kind"]; message: string }>) {
    setJournal((prev) => {
      const stamped = entries.map((e, i) => ({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
        kind: e.kind,
        message: e.message,
        page: pageNumber,
      }));
      return [...prev, ...stamped].slice(-120);
    });
  }

  function feedbackToJournalKind(type: FeedbackEvent["type"], message: string): JournalEntry["kind"] {
    if (message.includes("Vie") || message.includes("END") || message.includes("PV")) {
      return message.includes("-") || message.toLowerCase().includes("perd") ? "damage" : "heal";
    }
    if (type === "danger") return "damage";
    if (type === "reward" || type === "premium") return "reward";
    if (type === "success") return "info";
    return "info";
  }

  async function syncInventory(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setInventory([]);
      setEquipmentBonuses(calculateInventoryBonuses([]));
      return [];
    }
    // Nouveau système : sacoche par aventure (story_id)
    const { data: rawInv } = await supabase
      .from("user_inventory")
      .select("*")
      .eq("user_id", user.id)
      .eq("story_id", storyId);

    let userInv: any[] = [];
    if (rawInv && rawInv.length > 0) {
      const itemIds = rawInv.map((inv) => inv.item_id);
      const { data: itemsList } = await supabase.from("items").select("*").in("id", itemIds);
      const itemsMap = new Map((itemsList || []).map((item) => [item.id, item]));
      userInv = rawInv.map((inv) => ({ ...inv, items: itemsMap.get(inv.item_id) || null }));
    }

    setInventory(userInv);
    setEquipmentBonuses(calculateInventoryBonuses(userInv));
    return userInv;
  }

  useEffect(() => {
    if (feedbackEvents.length === 0) return;
    const timeout = window.setTimeout(() => setFeedbackEvents([]), 6500);
    return () => window.clearTimeout(timeout);
  }, [feedbackEvents]);

  useEffect(() => {
    if (prevHpRef.current !== null && prevHpRef.current !== stats.hp_current) {
      const delta = stats.hp_current - prevHpRef.current;
      setHpDeltaFloat(delta);
      const t = window.setTimeout(() => setHpDeltaFloat(null), 2200);
      prevHpRef.current = stats.hp_current;
      return () => window.clearTimeout(t);
    }
    prevHpRef.current = stats.hp_current;
  }, [stats.hp_current]);

  useEffect(() => {
    async function initGame() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: storyData } = await supabase.from("stories").select("*").eq("id", storyId).single();
      setStory(storyData);

      const { data: progressData } = await supabase
        .from("user_story_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      const usesLoneWolfRules = storyData?.slug === "les-maitres-des-tenebres";

      const { data: statsData } = await supabase
        .from("character_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      const userInv = await syncInventory();

      let targetNodeId = null;
      if (progressData && progressData.current_node_id && !shouldReset) {
        targetNodeId = progressData.current_node_id;
      }

      if (statsData && !shouldReset) {
        const base = {
          hp_current: statsData.hp_current,
          hp_max: statsData.hp_max,
          strength: statsData.strength,
          agility: statsData.agility,
          luck: statsData.luck,
          charisma: statsData.charisma || 5,
          armor: (statsData as any).armor ?? statsData.agility ?? 0,
          attack_power: (statsData as any).attack_power ?? statsData.strength ?? 5,
        };
        const computed = applyEquipmentStats(base, userInv);
        setStats({
          hp_current: computed.hp_current,
          hp_max: computed.hp_max,
          strength: computed.strength,
          agility: computed.agility,
          luck: computed.luck,
          charisma: (computed as any).charisma ?? 5,
          armor: computed.armor ?? computed.agility,
          attack_power: computed.attack_power ?? computed.strength,
          narrative_flags: (statsData.narrative_flags as Record<string, any>) || {},
        });
      } else {
        // Nouveau système générique : Vie 20, Armure 0, Attaque 5, sacoche vide
        const hazard = () => Math.floor(Math.random() * 10);
        const combatSkill = usesLoneWolfRules ? 10 + hazard() : 5;
        const endurance = usesLoneWolfRules ? 20 + hazard() : 20;
        const base = usesLoneWolfRules
          ? { hp_current: endurance, hp_max: endurance, strength: combatSkill, agility: 0, luck: 5, charisma: 5, armor: 0, attack_power: combatSkill }
          : { hp_current: 20, hp_max: 20, strength: 5, agility: 0, luck: 5, charisma: 5, armor: 0, attack_power: 5 };
        const computed = applyEquipmentStats(base, shouldReset ? [] : userInv);

        let initSucceeded = false;
        try {
          const res = await invokeInitGame(storyId, {
            hp_current: computed.hp_current,
            hp_max: computed.hp_max,
            strength: computed.strength,
            agility: computed.agility,
            luck: computed.luck,
            charisma: (computed as any).charisma,
            armor: computed.armor,
            attack_power: computed.attack_power,
          }, shouldReset);
          setStats({
            hp_current: computed.hp_current,
            hp_max: computed.hp_max,
            strength: computed.strength,
            agility: computed.agility,
            luck: computed.luck,
            charisma: (computed as any).charisma ?? 5,
            armor: computed.armor ?? 0,
            attack_power: computed.attack_power ?? 5,
            narrative_flags: (res.stats?.narrative_flags as Record<string, any>) || {},
          });
          if (res.node) targetNodeId = res.node.id;
          initSucceeded = true;
          // Si reset, on vide localement aussi
          if (shouldReset) {
            setInventory([]);
            setEquipmentBonuses({});
          }
        } catch (err) {
          console.warn("init-game fallback:", err);
        }

        if (!initSucceeded) {
          let fallbackNodeId: string | null = null;
          try {
            const { data: fallbackNodes } = await supabase.from("story_nodes").select("id").eq("story_id", storyId).order("is_start", { ascending: false }).limit(1);
            fallbackNodeId = fallbackNodes?.[0]?.id ?? null;
          } catch {}
          try {
            if (shouldReset) {
              await supabase.from("user_inventory").delete().eq("user_id", user.id).eq("story_id", storyId);
            }
            await supabase.from("character_stats").upsert({
              user_id: user.id, story_id: storyId,
              hp_current: computed.hp_current, hp_max: computed.hp_max,
              strength: computed.strength, agility: computed.agility,
              armor: computed.armor, attack_power: computed.attack_power,
              luck: computed.luck, charisma: (computed as any).charisma,
              narrative_flags: {},
              combat_state: null,
            }, { onConflict: "user_id,story_id" });
            if (fallbackNodeId) {
              await supabase.from("user_story_progress").upsert({
                user_id: user.id, story_id: storyId,
                current_node_id: fallbackNodeId,
                completion_pct: 10,
                last_played_at: new Date().toISOString(),
                is_completed: false,
              }, { onConflict: "user_id,story_id" });
            }
          } catch (writeErr) {
            console.warn("Fallback écriture directe échoué:", writeErr);
          }
          setStats({
            hp_current: computed.hp_current, hp_max: computed.hp_max,
            strength: computed.strength, agility: computed.agility,
            luck: computed.luck, charisma: (computed as any).charisma ?? 5,
            armor: computed.armor ?? 0, attack_power: computed.attack_power ?? 5,
            narrative_flags: {},
          });
        }
      }

      if (!targetNodeId) {
        const { data: startNodes } = await supabase.from("story_nodes").select("*").eq("story_id", storyId).order("is_start", { ascending: false }).limit(1);
        const startNode = startNodes?.[0];
        if (startNode) targetNodeId = startNode.id;
      }

      if (targetNodeId) await loadNode(targetNodeId);
      setLoading(false);
    }
    initGame();
  }, [storyId, shouldReset]);

  async function loadNode(nodeId: string) {
    const { data: node } = await supabase.from("story_nodes").select("*").eq("id", nodeId).single();
    if (node) {
      setCurrentNode(node);
      setIllustrationFailed(false);
      const { data: choiceList } = await supabase.from("story_choices").select("*, choice_effects(*)").eq("node_id", nodeId).order("display_order", { ascending: true });
      setChoices(choiceList || []);

      const combatants = (node as any).metadata?.combatants;
      const hasCombat = combatants && combatants.length > 0;
      if (hasCombat) {
        setIsCombatMode(true);
        setAllEnemies(combatants);
        setCurrentEnemyIndex(0);
        setCurrentEnemy(combatants[0]);
        setCombatResult(null);
        setCombatRoundCount(0);
        setCombatHpStart(stats.hp_current);
        setCombatNotesSig("");
        setCombatLog([]);
        logJournal([{ kind: "combat", message: `Combat engagé contre ${combatants.map((c: any) => c.name).join(", ")} !` }]);
      } else {
        setIsCombatMode(false);
        setCurrentEnemy(null);
        setAllEnemies([]);
        setCurrentEnemyIndex(0);
        setCombatResult(null);
        setCombatRoundCount(0);
        setCombatHpStart(null);
        setCombatNotesSig("");
        setCombatLog([]);
      }
    }
  }

  function getItemHealAmount(item: any): number {
    if (!item) return 0;
    let bonus = item.stat_bonus;
    if (typeof bonus === "string") { try { bonus = JSON.parse(bonus); } catch { return 0; } }
    return Number(bonus?.hp ?? 0);
  }

  function isItemUsable(item: any): boolean {
    return Boolean(item && (item.is_consumable || item.item_type === "potion"));
  }

  async function applyPotionFallback(invItem: any): Promise<{ healed: number } | null> {
    try {
      const item = invItem.items;
      const { data, error } = await supabase.rpc("use_consumable", { p_item_id: item.id, p_story_id: storyId });
      if (error || !data) { console.warn("RPC use_consumable échouée:", error?.message); return null; }
      const res = data as any;
      const renderedInventory = res.quantity <= 0 ? inventory.filter((i) => i.id !== invItem.id) : inventory.map((i) => i.id === invItem.id ? { ...i, quantity: res.quantity } : i);
      setInventory(renderedInventory);
      setEquipmentBonuses(calculateInventoryBonuses(renderedInventory));
      const computed = applyEquipmentStats({
        hp_current: res.hp_current, hp_max: res.hp_max,
        strength: res.strength, agility: res.agility,
        luck: res.luck, charisma: res.charisma,
        armor: res.armor ?? res.agility, attack_power: res.attack_power ?? res.strength,
      }, renderedInventory);
      setStats((s) => ({ ...s, hp_current: computed.hp_current, hp_max: computed.hp_max, strength: computed.strength, agility: computed.agility, luck: computed.luck, armor: computed.armor ?? 0, attack_power: computed.attack_power ?? 5 }));
      return { healed: res.healed };
    } catch (err) { console.warn("Fallback potion échoué:", err); return null; }
  }

  async function handleUseItem(invItem: any) {
    if (invItem.quantity <= 0) return;
    const item = invItem.items;
    if (!isItemUsable(item)) {
      pushFeedback([makeFeedback("info", `${item?.name ?? "Cet objet"} n'est pas consommable — il agit passivement.`)]);
      return;
    }
    try {
      const res = await invokeApplyItemEffect(item.id, storyId);
      const base = {
        hp_current: res.hp_current, hp_max: res.hp_max,
        strength: res.strength, agility: res.agility,
        luck: res.luck, charisma: res.charisma,
        armor: (res as any).armor ?? res.agility, attack_power: (res as any).attack_power ?? res.strength,
      };
      const computed = applyEquipmentStats(base, inventory);
      setStats((s) => ({
        ...s,
        hp_current: computed.hp_current, hp_max: computed.hp_max,
        strength: computed.strength, agility: computed.agility,
        luck: computed.luck, armor: computed.armor ?? 0, attack_power: computed.attack_power ?? 5,
      }));
      if (res.quantity <= 0) setInventory((inv) => inv.filter((i) => i.id !== invItem.id));
      else setInventory((inv) => inv.map((i) => i.id === invItem.id ? { ...i, quantity: res.quantity } : i));
      pushFeedback([makeFeedback("success", res.healed > 0 ? `Consommé : +${res.healed} Vie.` : "Consommé : Vie déjà au max.")]);
      logJournal([{ kind: res.healed > 0 ? "heal" : "item", message: res.healed > 0 ? `${item.name} : +${res.healed} Vie.` : `${item.name} consommée (aucun effet).` }]);
    } catch (err) {
      console.warn("apply-item-effect fallback:", err);
      const fallback = await applyPotionFallback(invItem);
      if (fallback) {
        pushFeedback([makeFeedback("success", fallback.healed > 0 ? `${item.name} : +${fallback.healed} Vie.` : `${item.name} : déjà au max.`)]);
        logJournal([{ kind: fallback.healed > 0 ? "heal" : "item", message: fallback.healed > 0 ? `${item.name} : +${fallback.healed} Vie.` : `${item.name} (aucun effet).` }]);
        return;
      }
      pushFeedback([makeFeedback("danger", err instanceof Error ? err.message : "Impossible d'utiliser l'objet.")]);
    }
  }

  async function rollEquipmentTable() {
    if (!isEquipmentSetup || isRollingEquipment) return;
    setIsRollingEquipment(true);
    await new Promise(r => setTimeout(r, 600));
    const roll = Math.floor(Math.random() * 10);
    setEquipmentRoll(roll);
    setIsRollingEquipment(false);
    pushFeedback([makeFeedback("info", `Table de Hasard : ${roll}`)]);
    logJournal([{ kind: "dice", message: `Équipement — Table de Hasard : ${roll}.` }]);
  }

  async function rollNarrativeHazard() {
    if (isRollingHazard || !currentNode) return;
    setIsRollingHazard(true);
    await new Promise(r => setTimeout(r, 400));
    const roll = Math.floor(Math.random() * 10);
    setHazardRollResult(roll);
    setIsRollingHazard(false);
    pushFeedback([makeFeedback("info", `Table de Hasard : ${roll}`)]);
    logJournal([{ kind: "dice", message: `Table de Hasard : ${roll}.` }]);
    try {
      const res = await invokeGameSetupAction({ action: "hazard_roll", story_id: storyId, hazard_roll: roll, current_node_id: currentNode.id });
      if (res.stats) {
        setStats(prev => ({
          ...prev,
          hp_current: res.stats!.hp_current, hp_max: res.stats!.hp_max,
          strength: res.stats!.strength, agility: res.stats!.agility,
          armor: (res.stats as any).armor ?? res.stats!.agility,
          attack_power: (res.stats as any).attack_power ?? res.stats!.strength,
          luck: res.stats!.luck,
          narrative_flags: (res.stats!.narrative_flags as Record<string, any>) || {},
        }));
      }
      if (effectsTouchInventory(res.effects_applied)) await syncInventory();
      if (res.node) setTimeout(async () => { await loadNode(res.node!.id); setHazardRollResult(null); }, 1800);
      else setTimeout(() => setHazardRollResult(null), 1800);
      if (res.effects_applied?.length > 0) {
        const hasDamage = res.effects_applied.some((e: string) => e.includes("perte") || e.includes("-"));
        pushFeedback(res.effects_applied.map((e: string) => makeFeedback(hasDamage ? "danger" : "success", e)));
        logJournal(res.effects_applied.map((e: string) => ({ kind: (hasDamage ? "damage" : "info") as JournalEntry["kind"], message: e })));
      }
    } catch (err) {
      console.warn("hazard_roll indisponible:", err);
      pushFeedback([makeFeedback("danger", "Jet non validé par le serveur. Réessayez.")]);
      setTimeout(() => setHazardRollResult(null), 1800);
    }
  }

  function toggleDiscipline(slug: string) {
    if (!isDisciplineSelectionNode) return;
    setSelectedDisciplines(prev => {
      if (prev.includes(slug)) return prev.filter(d => d !== slug);
      else {
        if (prev.length >= MAX_DISCIPLINES) { pushFeedback([makeFeedback("danger", `Max ${MAX_DISCIPLINES} disciplines.`)]); return prev; }
        return [...prev, slug];
      }
    });
  }

  const DISCIPLINE_SLUG_MAP: Record<string, string> = { "six_cieme_sens": "sixieme_sens", "sixième_sens": "sixieme_sens" };
  function getDatabaseSlug(playerSlug: string): string { return DISCIPLINE_SLUG_MAP[playerSlug] || playerSlug; }

  async function confirmDisciplines() {
    if (selectedDisciplines.length !== MAX_DISCIPLINES) { pushFeedback([makeFeedback("danger", "5 disciplines requises.")]); return; }
    const newFlags: Record<string, boolean> = {};
    selectedDisciplines.forEach(slug => { newFlags[`discipline_${getDatabaseSlug(slug)}`] = true; });
    setStats(prev => ({ ...prev, narrative_flags: { ...prev.narrative_flags, ...newFlags } }));
    setHasConfirmedDisciplines(true);
    try {
      const res = await invokeGameSetupAction({ action: "save_disciplines", story_id: storyId, disciplines: selectedDisciplines.map(getDatabaseSlug) });
      if (res.stats) setStats(prev => ({ ...prev, narrative_flags: (res.stats!.narrative_flags as Record<string, any>) || {} }));
      if (res.node) await loadNode(res.node.id);
      else {
        const { data: equipmentNode } = await supabase.from("story_nodes").select("*").eq("story_id", storyId).eq("metadata->>kind", "equipment_setup").maybeSingle();
        if (equipmentNode) await loadNode(equipmentNode.id);
      }
    } catch (err) {
      console.warn("save_disciplines fallback:", err);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from("character_stats").upsert({ user_id: user.id, story_id: storyId, narrative_flags: newFlags }, { onConflict: "user_id,story_id" });
        const { data: equipmentNode } = await supabase.from("story_nodes").select("*").eq("story_id", storyId).eq("metadata->>kind", "equipment_setup").maybeSingle();
        if (equipmentNode) await loadNode(equipmentNode.id);
        else { const { data: sectionOne } = await supabase.from("story_nodes").select("*").eq("story_id", storyId).eq("node_key", "section_001").maybeSingle(); if (sectionOne) await loadNode(sectionOne.id); }
      } catch {}
    }
    pushFeedback([makeFeedback("success", `Disciplines : ${selectedDisciplines.map(s => kaiDisciplines.find(d => d.slug === s)?.name).join(", ")}`)]);
  }

  async function handleCombatRound(escape: boolean = false) {
    if (!currentEnemy || !currentNode || combatInProgress) return;
    setCombatInProgress(true);
    setCombatResult(null);
    try {
      const res = await invokeResolveCombatRound({ story_id: storyId, current_node_id: currentNode.id, escape });
      setCombatRoundCount(res.round ?? combatRoundCount + 1);
      setCombatResult(res);
      setCombatLog((prev) => [...prev, {
        round: res.round ?? prev.length + 1,
        attackQuotient: res.attack_quotient,
        hazardRoll: res.hazard_roll,
        playerLoss: res.player_loss,
        enemyLoss: res.enemy_loss,
        enemyName: res.enemy_name ?? currentEnemy?.name ?? "l'ennemi",
        escaped: escape,
      }].slice(-12));
      setStats((prev) => ({
        ...prev,
        hp_current: res.player_endurance,
        armor: (res as any).player_armor ?? prev.armor,
        attack_power: (res as any).player_attack ?? prev.attack_power,
        narrative_flags: (res.narrative_flags as Record<string, any>) ?? prev.narrative_flags,
      }));
      if (res.enemies) {
        setAllEnemies(res.enemies);
        const idx = res.enemy_index ?? currentEnemyIndex;
        setCurrentEnemyIndex(idx);
        setCurrentEnemy(res.enemies[idx] ?? null);
      } else {
        setCurrentEnemy((prev: any) => prev ? { ...prev, endurance: res.enemy_endurance } : prev);
      }
      const events: FeedbackEvent[] = [];
      const notesSig = (res.combat_notes ?? []).join("|");
      if (res.combat_notes?.length && notesSig !== combatNotesSig) {
        for (const note of res.combat_notes) events.push(makeFeedback("info", note));
        setCombatNotesSig(notesSig);
      }
      const lossLabel = (v: number | "K", isPlayer: boolean) => {
        if (v === "K") return "TUÉ SUR LE COUP";
        if (v === 0) return "0";
        return `${isPlayer ? "-" : "-"}${v} ${storyUsesLoneWolfRules ? "END" : "Vie"}`;
      };
      if (escape) events.push(makeFeedback("danger", `Fuite ! Vous perdez ${lossLabel(res.player_loss, true)}.`));
      else {
        if (res.player_loss === "K") events.push(makeFeedback("danger", "Coup fatal !"));
        else if ((res.player_loss as number) > 0) events.push(makeFeedback("danger", `Vous perdez ${res.player_loss} Vie.`));
        if (res.enemy_loss === "K") events.push(makeFeedback("success", `${res.enemy_name ?? "L'ennemi"} tué sur le coup !`));
        else if ((res.enemy_loss as number) > 0) events.push(makeFeedback("success", `${res.enemy_name ?? "L'ennemi"} perd ${res.enemy_loss} Vie.`));
      }
      const roundNum = res.round ?? combatRoundCount + 1;
      const journalRound: Array<{ kind: JournalEntry["kind"]; message: string }> = [{
        kind: "combat",
        message: `Assaut ${roundNum} vs ${res.enemy_name ?? currentEnemy?.name ?? "ennemi"} — vous ${res.player_loss === "K" ? "êtes tué" : res.player_loss > 0 ? `perdez ${res.player_loss} Vie` : "esquivez"}, ennemi ${res.enemy_loss === "K" ? "tué" : res.enemy_loss > 0 ? `perd ${res.enemy_loss} Vie` : "pare"}.`,
      }];
      if (res.combat_ended) {
        if (res.winner === "player") {
          events.push(makeFeedback("success", "Victoire !"));
          journalRound.push({ kind: "combat", message: "Victoire !" });
          logJournal(journalRound);
          setTimeout(() => { setIsCombatMode(false); setCurrentEnemy(null); setAllEnemies([]); setCurrentEnemyIndex(0); setCombatResult(null); if (currentNode?.id) void loadNode(currentNode.id); }, 2200);
        } else {
          events.push(makeFeedback("danger", "Vous avez succombé..."));
          journalRound.push({ kind: "damage", message: "Défaite..." });
          logJournal(journalRound);
          if (res.death_node?.id) setTimeout(() => { setIsCombatMode(false); void loadNode(res.death_node.id); }, 2200);
        }
      } else {
        if (res.enemy_index !== undefined && res.enemy_index !== currentEnemyIndex) {
          events.push(makeFeedback("success", "Ennemi vaincu ! Suivant..."));
          journalRound.push({ kind: "combat", message: "Ennemi vaincu !" });
        }
        logJournal(journalRound);
      }
      pushFeedback(events);
    } catch (err) {
      pushFeedback([makeFeedback("danger", err instanceof Error ? err.message : "Erreur combat.")]);
    } finally { setCombatInProgress(false); }
  }

  async function handleFlee() {
    if (!currentEnemy || !currentNode || combatInProgress) return;
    const fleeMeta = (currentNode as any)?.metadata?.combat?.flee;
    if (!fleeMeta?.target_node_key) return;
    setCombatInProgress(true);
    setCombatResult(null);
    try {
      const res = await invokeResolveCombatRound({ story_id: storyId, current_node_id: currentNode.id, escape: true });
      setCombatRoundCount(res.round ?? combatRoundCount + 1);
      setStats((prev) => ({ ...prev, hp_current: res.player_endurance, narrative_flags: (res.narrative_flags as Record<string, any>) ?? prev.narrative_flags }));
      const events: FeedbackEvent[] = [makeFeedback("danger", res.player_loss === "K" ? "Coup fatal en fuyant !" : `Fuite ! -${res.player_loss} Vie.`)];
      logJournal([{ kind: "combat", message: res.player_loss === "K" ? "Fuite tragique : coup fatal !" : `Fuite : -${res.player_loss} Vie.` }]);
      if (res.player_endurance <= 0) {
        events.push(makeFeedback("danger", "Mort en fuyant..."));
        pushFeedback(events);
        if (res.death_node?.id) setTimeout(() => { setIsCombatMode(false); void loadNode(res.death_node.id); }, 2200);
        return;
      }
      const fleeRes = await invokeGameSetupAction({ action: "combat_flee", story_id: storyId, current_node_id: currentNode.id });
      const arrivalExtra = (fleeRes.effects_applied ?? []).filter((e: string) => e !== "Vous prenez la fuite !");
      for (const e of arrivalExtra) events.push(makeFeedback("info", e));
      if (effectsTouchInventory(fleeRes.effects_applied)) await syncInventory();
      events.push(makeFeedback("info", "Vous fuyez !"));
      pushFeedback(events);
      if (fleeRes.node?.id) setTimeout(() => { setIsCombatMode(false); void loadNode(fleeRes.node.id); }, 1200);
    } catch (err) {
      pushFeedback([makeFeedback("danger", err instanceof Error ? err.message : "Fuite impossible.")]);
    } finally { setCombatInProgress(false); }
  }

  function normalizeFlagKeyClient(str: string): string {
    return str.toLowerCase().replace(/^discipline_/, "").replace("sixième", "sixieme").replace("six_cieme", "sixieme").replace(/[^a-z]/g, "");
  }

  function effectsTouchInventory(effects?: string[] | null): boolean {
    return Boolean(effects?.some((e) => e.startsWith("🎁") || e.startsWith("💸") || e.startsWith("🍖") || e.startsWith("🎒") || e.startsWith("🔥")));
  }

  function isChoiceAvailable(choice: any): boolean {
    const flags = (stats.narrative_flags ?? {}) as Record<string, any>;
    for (const fx of choice.choice_effects ?? []) {
      if (fx.effect_type === "flag_require" && fx.flag_key) {
        const want = normalizeFlagKeyClient(fx.flag_key);
        let cur = flags[fx.flag_key];
        if (cur === undefined) {
          for (const [key, value] of Object.entries(flags)) {
            if (normalizeFlagKeyClient(key) === want) { cur = value; break; }
          }
        }
        if (Boolean(cur) !== Boolean(fx.flag_value ?? true)) return false;
      } else if (fx.effect_type === "inventory_require" && fx.item_id) {
        const needed = fx.stat_value ?? 1;
        const owned = inventory.some((invItem) => invItem.item_id === fx.item_id && (invItem.quantity ?? 0) >= needed);
        if (!owned) return false;
      }
    }
    return true;
  }

  async function handleChoice(choice: any) {
    if (!choice.target_node_id || saving) return;
    if (!isChoiceAvailable(choice)) return;
    setSaving(true);
    logJournal([{ kind: "choice", message: `Vous décidez : « ${choice.text} »` }]);

    const isDiceCheck = choice.text.toLowerCase().includes("test") || choice.flavor_text?.toLowerCase().includes("test");
    if (isDiceCheck) {
      setDiceRolling(true);
      const rolled = Math.floor(Math.random() * 20) + 1;
      setDiceResult(rolled);
      await new Promise((r) => setTimeout(r, 1200));
      setDiceRolling(false);
    }

    const previousStats = stats;
    const previousGems = currentWalletGems;

    try {
      const res = await invokeMakeChoice(choice.id);
      setCurrentNode(res.node);
      setIllustrationFailed(false);
      setChoices(res.choices || []);
      if (res.node?.title) logJournal([{ kind: "chapter", message: `${res.node.title}` }]);

      const base = {
        hp_current: res.stats.hp_current, hp_max: res.stats.hp_max,
        strength: res.stats.strength, agility: res.stats.agility,
        luck: res.stats.luck, charisma: res.stats.charisma,
        armor: (res.stats as any).armor ?? res.stats.agility,
        attack_power: (res.stats as any).attack_power ?? res.stats.strength,
      };
      const inventoryChanged = effectsTouchInventory(res.effects_applied);
      const renderedInventory = inventoryChanged ? await syncInventory() : inventory;
      const computed = applyEquipmentStats(base, renderedInventory);
      setStats({
        hp_current: computed.hp_current, hp_max: computed.hp_max,
        strength: computed.strength, agility: computed.agility,
        luck: computed.luck, charisma: (computed as any).charisma ?? 5,
        armor: computed.armor ?? computed.agility,
        attack_power: computed.attack_power ?? computed.strength,
        narrative_flags: (res.stats.narrative_flags as Record<string, any>) || {},
      });

      if (res.wallet.gems !== null && res.wallet.gems !== undefined) setWallet(res.wallet.gems);

      const nextEvents: FeedbackEvent[] = [];
      const hpDelta = computed.hp_current - previousStats.hp_current;
      const attackDelta = (computed.attack_power ?? 0) - (previousStats.attack_power ?? 0);
      const armorDelta = (computed.armor ?? 0) - (previousStats.armor ?? 0);
      const newGemBalance = res.wallet.gems ?? previousGems;
      const gemsDelta = newGemBalance - previousGems;

      if (choice.is_premium && choice.price_gems > 0) nextEvents.push(makeFeedback("premium", `Premium : -${choice.price_gems} gemmes.`));
      if (hpDelta < 0) nextEvents.push(makeFeedback("danger", `Vie ${hpDelta}.`));
      else if (hpDelta > 0) nextEvents.push(makeFeedback("success", `Vie +${hpDelta}.`));
      if (armorDelta !== 0) nextEvents.push(makeFeedback(armorDelta > 0 ? "success" : "danger", `Armure ${armorDelta > 0 ? "+" : ""}${armorDelta}.`));
      if (attackDelta !== 0) nextEvents.push(makeFeedback(attackDelta > 0 ? "success" : "danger", `Attaque ${attackDelta > 0 ? "+" : ""}${attackDelta}.`));
      if (gemsDelta > 0 && !res.is_ending) nextEvents.push(makeFeedback("reward", `+${gemsDelta} gemmes.`));
      if (res.effects_applied?.length > 0) nextEvents.push(...res.effects_applied.slice(0, 3).map((effect) => makeFeedback("info", effect)));

      if (res.is_ending) {
        setIsFirstDiscovery(res.is_new_ending);
        setGemsAwarded(res.reward_gems);
        if (res.is_victory && res.is_new_ending) nextEvents.push(makeFeedback("reward", `Victoire : +${res.reward_gems} gemmes.`));
        else if (res.is_victory && !res.is_new_ending) nextEvents.push(makeFeedback("info", "Fin déjà découverte."));
        else nextEvents.push(makeFeedback("danger", "Votre route s'achève..."));
        if (res.achievements_unlocked?.length > 0) nextEvents.push(makeFeedback("reward", `Succès : ${res.achievements_unlocked.join(", ")} !`));
      }

      if (nextEvents.length === 0) nextEvents.push(makeFeedback("info", "Le récit se poursuit."));
      pushFeedback(nextEvents);
      logJournal(nextEvents.filter((e) => e.message !== "Le récit se poursuit.").map((e) => ({ kind: feedbackToJournalKind(e.type, e.message), message: e.message })));
      setPageNumber((page) => page + 1);
    } catch (err) {
      if (err instanceof FunctionError && err.code === "insufficient_funds") pushFeedback([makeFeedback("danger", "Gemmes insuffisantes.")]);
      else if (err instanceof FunctionError && err.code === "requirement_not_met") pushFeedback([makeFeedback("danger", err.message)]);
      else pushFeedback([makeFeedback("danger", err instanceof Error ? err.message : "Erreur lors du choix.")]);
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Ouverture du grimoire...</p>
      </div>
    );
  }

  const isEnding = currentNode?.is_ending;
  const isVictory = currentNode?.ending_type === "victory";
  const storyUsesLoneWolfRules = story?.slug === "les-maitres-des-tenebres";
  const isGenericSystem = !storyUsesLoneWolfRules;

  const combatFleeMeta = (currentNode as any)?.metadata?.combat?.flee as { target_node_key: string; min_rounds?: number } | undefined;
  const hazardRulesMeta = (currentNode as any)?.metadata?.hazard_consequences as any[] | undefined;
  const hasNarrativeHazard = storyUsesLoneWolfRules && Array.isArray(hazardRulesMeta) && hazardRulesMeta.length > 0;

  const combatEnemyMaxEndurance = (() => {
    const declared = (currentNode as any)?.metadata?.combatants as Array<{ endurance: number }> | undefined;
    return declared?.[currentEnemyIndex]?.endurance ?? 0;
  })();
  const readingProgress = isEnding ? 100 : Math.min(92, 12 + pageNumber * 8);

  const nodeKind = (currentNode as any)?.metadata?.kind;
  const isEquipmentSetup = nodeKind === "equipment_setup";
  const isDisciplineSelectionNode = nodeKind === "discipline_selection" || nodeKind === "kai_disciplines";
  const showDisciplineSelection = isDisciplineSelectionNode && !hasConfirmedDisciplines;
  const isSpecialLoneWolfStep = isEquipmentSetup || isDisciplineSelectionNode;

  const kaiDisciplines = [
    { slug: "camouflage", name: "Camouflage", desc: "Se fondre dans le paysage." },
    { slug: "chasse", name: "Chasse", desc: "Ne jamais mourir de faim." },
    { slug: "sixieme_sens", name: "Sixième Sens", desc: "Sentir les dangers." },
    { slug: "orientation", name: "Orientation", desc: "Toujours choisir la bonne direction." },
    { slug: "guerison", name: "Guérison", desc: "Récupérer 1 END par section sans combat." },
    { slug: "maitrise_armes", name: "Maîtrise des armes", desc: "+2 HAB avec une arme." },
    { slug: "bouclier_psychique", name: "Bouclier psychique", desc: "Résistance mentale." },
    { slug: "puissance_psychique", name: "Puissance psychique", desc: "+2 HAB mentale." },
    { slug: "communication_animale", name: "Communication Animale", desc: "Parler avec les animaux." },
    { slug: "maitrise_psychique_matiere", name: "Maîtrise Psychique de la Matière", desc: "Déplacer des objets." },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 py-3 sm:py-6">
      <header className="sticky top-3 z-30 mb-4 space-y-2 rounded-2xl border border-border/55 bg-background/72 px-2.5 py-2 shadow-2xl backdrop-blur-xl sm:mb-6 sm:px-3">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/story/${storyId}`} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Quitter</span>
          </Link>
          <span className="min-w-0 truncate text-center text-xs font-serif italic text-muted-foreground">{story?.title}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => { setIsJournalOpen(!isJournalOpen); if (!isJournalOpen) setIsBagOpen(false); }} className="relative flex min-h-10 items-center gap-1 rounded-full border border-[--hero-gold]/40 bg-[--hero-gold]/15 px-2.5 py-1 text-xs font-bold text-[--hero-gold] hover:bg-[--hero-gold]/25">
              <ScrollText className="w-3.5 h-3.5" /><span className="hidden sm:inline">Journal</span>
              {journal.length > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[--hero-gold]/30 px-1 text-[9px] font-black tabular-nums">{journal.length}</span>}
            </button>
            <button onClick={() => { setIsBagOpen(!isBagOpen); if (!isBagOpen) setIsJournalOpen(false); }} className="relative flex min-h-10 items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/30">
              <Package className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sacoche</span>
              {inventory.length > 0 && <span className="h-2 w-2 rounded-full bg-[--hero-emerald] animate-pulse" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <div className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs">
            <AnimatePresence>
              {hpDeltaFloat !== null && (
                <motion.span initial={{ opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: -22, scale: 1.15 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.9, ease: "easeOut" }} className={`pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 whitespace-nowrap text-sm font-black drop-shadow-lg ${hpDeltaFloat > 0 ? "text-[--hero-emerald]" : "text-red-400"}`}>
                  {hpDeltaFloat > 0 ? `+${hpDeltaFloat}` : hpDeltaFloat} Vie
                </motion.span>
              )}
            </AnimatePresence>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>{stats.hp_current}/{stats.hp_max} <span className="hidden sm:inline">Vie</span></span>
            {equipmentBonuses.hp_max ? <span className="text-[10px] text-[--hero-emerald] font-normal">(+{equipmentBonuses.hp_max})</span> : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 font-bold text-xs">
            <Shield className="w-3.5 h-3.5 text-sky-300" />
            <span>{isGenericSystem ? stats.armor : stats.agility}<span className="hidden sm:inline"> {isGenericSystem ? "Armure" : "HAB"}</span></span>
            {equipmentBonuses.armor || equipmentBonuses.agility ? <span className="text-[10px] text-[--hero-emerald] font-normal">(+{equipmentBonuses.armor || equipmentBonuses.agility})</span> : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Sword className="w-3.5 h-3.5 text-amber-400" />
            <span>{isGenericSystem ? stats.attack_power : stats.strength}<span className="hidden sm:inline"> {isGenericSystem ? "Attaque" : "FOR"}</span></span>
            {equipmentBonuses.attack_power || equipmentBonuses.attack || equipmentBonuses.strength ? <span className="text-[10px] text-[--hero-emerald] font-normal">(+{equipmentBonuses.attack_power || equipmentBonuses.attack || equipmentBonuses.strength})</span> : null}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
            <GemIcon size="xs" title="" /><span className="tabular-nums">{currentWalletGems}</span>
          </div>
        </div>
      </header>

      <div className="mb-5 space-y-2 rounded-2xl border border-border/45 bg-background/35 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span>Page {pageNumber}</span><span className="truncate text-right normal-case tracking-normal text-primary">{story?.title}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
          <div className="h-full rounded-full bg-gradient-to-r from-primary via-[--hero-gold] to-[--hero-emerald]" style={{ width: `${readingProgress}%` }} />
        </div>
      </div>

      <AnimatePresence>
        {isJournalOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.97, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -6 }} className="mb-4 glass-card rounded-2xl border-2 border-[--hero-gold]/40 p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2"><ScrollText className="w-4 h-4 text-[--hero-gold]" /><h4 className="font-bold text-xs uppercase tracking-wider">Journal d&apos;aventure</h4></div>
              <button onClick={() => setIsJournalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            {journal.length > 0 ? (
              <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {[...journal].reverse().map((entry) => (
                  <div key={entry.id} className={`flex items-start gap-2.5 rounded-xl border bg-background/40 px-3 py-2 text-xs leading-5 ${journalAccent(entry.kind)}`}>
                    <span className="mt-0.5 text-sm leading-none">{journalIcon(entry.kind)}</span>
                    <span className="min-w-0 flex-1 text-foreground/85">{entry.message}</span>
                    <span className="shrink-0 rounded-full bg-muted/50 px-1.5 py-0.5 text-[9px] font-black text-muted-foreground">p.{entry.page}</span>
                  </div>
                ))}
              </div>
            ) : <p className="py-4 text-center text-xs text-muted-foreground">Votre légende commence — chaque choix sera consigné ici.</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBagOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-4 glass-card rounded-2xl p-4 border-2 border-primary/50 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /><h4 className="font-bold text-xs uppercase tracking-wider">Sacoche — {story?.title}</h4></div>
              <button onClick={() => setIsBagOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground">Sacoche vide au début de chaque aventure. Elle se remplit pendant l&apos;exploration et reste liée à cette histoire. Changez d&apos;aventure → sacoche vide pour la nouvelle. Revenez → vous retrouvez vos objets.</p>
            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inventory.map((inv) => {
                  const usable = isItemUsable(inv.items);
                  const healAmount = getItemHealAmount(inv.items);
                  const isFullHp = stats.hp_current >= stats.hp_max;
                  const itemIcon = inv.items?.item_type === "potion" ? "🧪" : inv.items?.item_type === "weapon" ? "🔫" : inv.items?.item_type === "armor" ? "🛡️" : "📦";
                  return (
                    <div key={inv.id} className="p-2.5 rounded-xl bg-card/80 border border-border/60 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{itemIcon}</span>
                        <div className="truncate">
                          <div className="font-bold truncate">{inv.items?.name} (x{inv.quantity})</div>
                          <div className="text-[10px] text-muted-foreground truncate">{inv.items?.description}</div>
                          {inv.items?.stat_bonus && (
                            <div className="text-[9px] text-[--hero-emerald] font-bold">
                              {(() => {
                                let b = inv.items.stat_bonus;
                                if (typeof b === "string") try { b = JSON.parse(b); } catch { return ""; }
                                const parts = [];
                                if (b.armor) parts.push(`+${b.armor} Armure`);
                                if (b.attack || b.attack_power) parts.push(`+${b.attack || b.attack_power} Attaque`);
                                if (b.hp) parts.push(`+${b.hp} Vie`);
                                if (b.hp_max) parts.push(`+${b.hp_max} Vie max`);
                                return parts.join(" · ");
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                      {usable && (
                        <Button size="sm" onClick={() => handleUseItem(inv)} disabled={isFullHp && healAmount > 0} className="h-7 text-[10px] font-bold px-2.5 shrink-0 bg-[--hero-emerald] hover:bg-[--hero-emerald]/90 text-white disabled:opacity-45">
                          {healAmount > 0 ? `Utiliser (+${healAmount} Vie)` : "Utiliser"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-muted-foreground text-center py-4">Sacoche vide — explorez pour la remplir.</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {diceRolling && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="glass-card rounded-3xl p-8 text-center space-y-4 border-2 border-[--hero-gold] max-w-xs">
              <Dices className="w-16 h-16 mx-auto text-[--hero-gold] animate-spin" />
              <div className="space-y-1"><h3 className="text-xl font-black">Lancer de dé...</h3><p className="text-xs text-muted-foreground">Le destin tranche !</p></div>
              <div className="text-4xl font-black text-primary animate-pulse">🎲 {diceResult || "?"}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackEvents.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} className="sticky top-2 z-40 mb-4">
            <div className="glass-card space-y-1.5 rounded-2xl border-2 border-[--hero-gold]/30 p-3 shadow-2xl">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[--hero-gold]/80">✦ Ce qui vient de se passer</span>
                <button onClick={() => setFeedbackEvents([])} className="grid size-5 place-items-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground"><X className="size-3" /></button>
              </div>
              {feedbackEvents.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px] font-bold shadow-md ${feedbackClasses(event.type)}`}>
                  <span className="text-base leading-none">{event.type === "danger" ? "💔" : event.type === "success" ? "✅" : event.type === "reward" ? "💎" : event.type === "premium" ? "✨" : "📜"}</span>
                  <span className="min-w-0 flex-1 leading-snug">{event.message}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col justify-between space-y-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentNode?.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: "easeOut" }} className="space-y-6">
            {currentNode?.title && (
              <div className="space-y-3 text-center">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                  <BookmarkCheck className="size-3.5" /> Chapitre · Page {pageNumber}
                </div>
                <h2 className="text-balance font-serif text-3xl font-black tracking-tight sm:text-4xl">{currentNode.title}</h2>
                <div className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[--hero-gold]/60 to-transparent" />
              </div>
            )}
            {currentNode?.illustration_url && !illustrationFailed && (
              <motion.figure initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative mx-auto w-full max-w-md">
                <div className="relative overflow-hidden rounded-[1.4rem] border-2 border-[--hero-gold]/25 bg-black/30">
                  <img src={currentNode.illustration_url} alt={currentNode.title || "Illustration"} onError={() => setIllustrationFailed(true)} className="w-full max-h-[26rem] object-cover object-top sm:max-h-[30rem]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/85 to-transparent" />
                </div>
                <figcaption className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[--hero-gold]/70">
                  <span className="h-px w-8 bg-[--hero-gold]/40" />Illustration<span className="h-px w-8 bg-[--hero-gold]/40" />
                </figcaption>
              </motion.figure>
            )}
            <div className="book-page relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9 space-y-5">
              <div className="pointer-events-none absolute inset-x-8 top-4 h-px bg-gradient-to-r from-transparent via-[--hero-gold]/25 to-transparent" />
              <p className="text-pretty whitespace-pre-line font-serif text-[1.05rem] leading-8 tracking-[0.01em] text-foreground/92 sm:text-xl sm:leading-9">{currentNode?.content}</p>
              <div className="flex items-center justify-center gap-2 text-[--hero-gold]/60"><span className="h-px w-10 bg-current" /><Sparkles className="size-3.5" /><span className="h-px w-10 bg-current" /></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {!isEquipmentSetup && !showDisciplineSelection && !isEnding && !isCombatMode && hasNarrativeHazard && (
          <div className="mb-6 overflow-hidden rounded-2xl border-2 border-purple-500/40 bg-purple-950/20">
            <div className="p-6">
              <div className="text-center mb-6"><div className="text-xs uppercase tracking-[3px] text-purple-400 font-black mb-1">TEST DE HASARD</div><h3 className="text-2xl font-black text-purple-300">Table de Hasard</h3></div>
              {!hazardRollResult && <div className="flex justify-center"><Button onClick={rollNarrativeHazard} disabled={isRollingHazard} className="h-14 px-10 text-lg font-black bg-purple-600 hover:bg-purple-700">{isRollingHazard ? "Lancement..." : "🎲 Lancer"}</Button></div>}
              {hazardRollResult !== null && <div className="text-center"><div className="inline-flex items-center gap-3 rounded-2xl border border-purple-500/60 bg-black/40 px-8 py-4 mb-4"><div className="text-6xl font-black text-purple-400 tabular-nums">{hazardRollResult}</div><div className="text-left"><div className="text-xs text-purple-400/70">RÉSULTAT</div><div className="text-xl font-black text-white">Hasard</div></div></div></div>}
            </div>
          </div>
        )}

        {isEquipmentSetup && storyUsesLoneWolfRules && (
          <div className="mb-6 overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-amber-950/20">
            <div className="p-6">
              <div className="text-center mb-6"><div className="text-xs uppercase tracking-[3px] text-amber-400 font-black mb-1">ÉTAPE 1</div><h3 className="text-2xl font-black text-amber-300">Équipement de départ</h3><p className="text-sm text-amber-400/80 mt-2 max-w-md mx-auto">Tirez la Table de Hasard pour votre objet supplémentaire.</p></div>
              {!equipmentRoll && <div className="flex justify-center"><Button onClick={rollEquipmentTable} disabled={isRollingEquipment} className="h-14 px-10 text-lg font-black bg-amber-600 hover:bg-amber-700">{isRollingEquipment ? "Lancement..." : "🎲 Lancer la Table"}</Button></div>}
              {equipmentRoll !== null && <div className="text-center mb-6"><div className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/60 bg-black/40 px-8 py-4"><div className="text-6xl font-black text-amber-400 tabular-nums">{equipmentRoll}</div><div className="text-left"><div className="text-xs text-amber-400/70">RÉSULTAT</div><div className="text-xl font-black text-white">Hasard</div></div></div></div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {Object.entries((currentNode as any)?.metadata?.random_table || {}).map(([num, item]) => {
                  const numInt = parseInt(num);
                  const isSelected = equipmentRoll === numInt;
                  const isDisabled = equipmentRoll !== null && !isSelected;
                  return (
                    <Button key={num} variant={isSelected ? "default" : "outline"} disabled={isDisabled} onClick={async () => {
                      if (isSelected) {
                        pushFeedback([makeFeedback("success", `Vous prenez : ${item}`)]);
                        try { const res = await invokeGameSetupAction({ action: "setup_equipment", story_id: storyId, equipment_roll: equipmentRoll! }); await syncInventory(); if (res.node) { setEquipmentRoll(null); await loadNode(res.node.id); } } catch (err) { console.warn(err); try { setEquipmentRoll(null); const { data: sectionOne } = await supabase.from("story_nodes").select("*").eq("story_id", storyId).eq("node_key", "section_001").maybeSingle(); if (sectionOne) await loadNode(sectionOne.id); } catch {} }
                        pushFeedback([makeFeedback("success", "Objets ajoutés !")]);
                      }
                    }} className={`h-auto min-h-[52px] justify-start px-4 py-3 text-left ${isSelected ? "bg-amber-600 border-amber-400 text-white" : isDisabled ? "opacity-40" : "hover:border-amber-500/60"}`}>
                      <div className="flex items-center gap-3 w-full"><div className="font-mono text-lg w-8 text-center font-black text-amber-400">{num}</div><div className="flex-1 text-sm font-medium">{item as string}</div>{isSelected && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">CHOISI</span>}</div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showDisciplineSelection && storyUsesLoneWolfRules && (
          <div className="mb-6 overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20">
            <div className="p-6">
              <div className="text-center mb-6"><div className="text-xs uppercase tracking-[3px] text-emerald-400 font-black mb-1">ÉTAPE 2</div><h3 className="text-2xl font-black text-emerald-300">5 Disciplines Kaï</h3></div>
              <div className="mb-6 min-h-[60px] rounded-xl border border-emerald-500/30 bg-black/30 p-4">
                <div className="text-xs text-emerald-400/70 mb-2 font-bold">CHOISIES ({selectedDisciplines.length}/{MAX_DISCIPLINES})</div>
                {selectedDisciplines.length > 0 ? <div className="flex flex-wrap gap-2">{selectedDisciplines.map(slug => { const disc = kaiDisciplines.find(d => d.slug === slug); return <div key={slug} onClick={() => toggleDiscipline(slug)} className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700">{disc?.name}<span className="text-emerald-300">×</span></div>; })}</div> : <div className="text-sm text-emerald-400/60 italic">Aucune</div>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kaiDisciplines.map((disc) => {
                  const isSelected = selectedDisciplines.includes(disc.slug);
                  const canSelect = selectedDisciplines.length < MAX_DISCIPLINES || isSelected;
                  return (
                    <button key={disc.slug} onClick={() => toggleDiscipline(disc.slug)} disabled={!canSelect && !isSelected} className={`group rounded-2xl border p-4 text-left ${isSelected ? "border-emerald-400 bg-emerald-600/20 ring-1 ring-emerald-400" : canSelect ? "border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40" : "border-emerald-500/20 opacity-50"}`}>
                      <div className="flex items-start justify-between gap-3"><div><div className="font-bold text-emerald-200">{disc.name}</div><div className="text-xs text-emerald-400/80 mt-1 leading-snug">{disc.desc}</div></div><div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${isSelected ? "border-emerald-400 bg-emerald-500 text-white" : "border-emerald-500/60 text-emerald-400"}`}>{isSelected ? "✓" : "+"}</div></div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center"><Button onClick={confirmDisciplines} disabled={selectedDisciplines.length !== MAX_DISCIPLINES} className="h-12 px-10 text-base font-black bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">Valider mes {MAX_DISCIPLINES} Disciplines</Button></div>
            </div>
          </div>
        )}

        {isCombatMode && currentEnemy && (
          <div className="mb-6 overflow-hidden rounded-[1.6rem] border-2 border-red-500/40 bg-gradient-to-b from-red-950/35 to-red-950/10">
            <div className="flex items-center justify-center gap-2 border-b border-red-500/25 bg-red-950/40 px-4 py-2">
              <Swords className="size-4 text-red-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-red-300">Combat — Assaut {combatRoundCount + (combatResult?.combat_ended ? 0 : 1)} {isGenericSystem ? "· Vie/Armure/Attaque" : ""}</span>
              {allEnemies.length > 1 && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-300">Ennemi {currentEnemyIndex + 1}/{allEnemies.length}</span>}
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-2xl border border-[--hero-emerald]/30 bg-black/30 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[--hero-emerald]">{storyUsesLoneWolfRules ? "Loup Solitaire" : "Vous"}</div>
                  <div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-black tabular-nums text-white">{stats.hp_current}</span><span className="text-[10px] font-bold text-muted-foreground">Vie</span><span className="ml-auto text-[10px] font-bold text-muted-foreground">{isGenericSystem ? `ATQ ${stats.attack_power} | ARM ${stats.armor}` : `HAB ${combatResult?.effective_player_skill ?? stats.strength}`}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50"><div className="h-full rounded-full bg-gradient-to-r from-[--hero-emerald] to-emerald-300 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, (stats.hp_current / Math.max(1, stats.hp_max)) * 100))}%` }} /></div>
                </div>
                <div className="grid size-9 place-items-center rounded-full border border-red-500/40 bg-red-950/60 text-xs font-black text-red-300">VS</div>
                <div className="rounded-2xl border border-red-400/30 bg-black/30 p-3">
                  <div className="truncate text-[10px] font-black uppercase tracking-widest text-red-300">{currentEnemy.name}</div>
                  <div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-black tabular-nums text-white">{currentEnemy.endurance}</span><span className="text-[10px] font-bold text-muted-foreground">Vie</span><span className="ml-auto text-[10px] font-bold text-muted-foreground">{isGenericSystem ? `ATQ ${(currentEnemy as any).attack ?? currentEnemy.combat_skill} | ARM ${(currentEnemy as any).armor ?? 0}` : `HAB ${currentEnemy.combat_skill}`}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, (currentEnemy.endurance / Math.max(1, combatEnemyMaxEndurance || currentEnemy.endurance)) * 100))}%` }} /></div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {combatResult && (
                  <motion.div key={`${combatRoundCount}-${combatResult.hazard_roll}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-500/25 bg-black/35 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-300/80">
                      <span className="rounded-full bg-red-500/15 px-2.5 py-1">{isGenericSystem ? `ATQ ${stats.attack_power} vs ARM ${(currentEnemy as any).armor ?? 0}` : `Quotient ${combatResult.attack_quotient > 0 ? "+" : ""}${combatResult.attack_quotient}`}</span>
                      <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-purple-300/90">🎲 Hasard : {combatResult.hazard_roll}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className={`rounded-xl p-3 ${combatResult.player_loss === "K" || (combatResult.player_loss as number) > 0 ? "bg-red-500/15 text-red-300" : "bg-emerald-500/10 text-[--hero-emerald]"}`}>
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-75">Vous</div>
                        <div className="mt-0.5 text-lg font-black">{combatResult.player_loss === "K" ? "☠️ Fatal" : (combatResult.player_loss as number) > 0 ? `−${combatResult.player_loss} Vie` : "Indemne"}</div>
                      </div>
                      <div className={`rounded-xl p-3 ${combatResult.enemy_loss === "K" || (combatResult.enemy_loss as number) > 0 ? "bg-emerald-500/10 text-[--hero-emerald]" : "bg-muted/25 text-muted-foreground"}`}>
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-75">{combatResult.enemy_name ?? currentEnemy.name}</div>
                        <div className="mt-0.5 text-lg font-black">{combatResult.enemy_loss === "K" ? "☠️ Tué" : (combatResult.enemy_loss as number) > 0 ? `−${combatResult.enemy_loss} Vie` : "Esquive"}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {combatLog.length > 1 && (
                <div className="max-h-36 space-y-1 overflow-y-auto rounded-2xl border border-border/40 bg-black/25 p-3">
                  {[...combatLog].reverse().map((entry, idx) => (
                    <div key={`${entry.round}-${idx}`} className={`flex items-center gap-2 text-[11px] leading-5 ${idx === 0 ? "text-foreground/90" : "text-muted-foreground"}`}>
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-[9px] font-black text-red-300">{entry.round}</span>
                      <span className="min-w-0 flex-1 truncate">{entry.escaped ? `Fuite — -${entry.playerLoss} Vie` : `Vous ${entry.playerLoss === "K" ? "tué" : entry.playerLoss > 0 ? `-${entry.playerLoss} Vie` : "esquivez"} · ${entry.enemyName} ${entry.enemyLoss === "K" ? "tué" : entry.enemyLoss > 0 ? `-${entry.enemyLoss} Vie` : "pare"}`}</span>
                      <span className="shrink-0 text-[9px] font-bold text-purple-300/70">🎲{entry.hazardRoll}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => handleCombatRound(false)} disabled={combatInProgress || (combatResult?.combat_ended ?? false)} className="h-12 flex-1 bg-red-600 text-base font-black hover:bg-red-700">
                  {combatInProgress ? <><Loader2 className="size-4 animate-spin" /> Assaut...</> : <><Swords className="size-4" /> Attaquer ({stats.attack_power} ATQ)</>}
                </Button>
                <Button variant="outline" onClick={() => void handleFlee()} disabled={combatInProgress || (combatResult?.combat_ended ?? false) || !combatFleeMeta || combatRoundCount < (combatFleeMeta?.min_rounds ?? 0)} className="h-12 flex-1 border-red-500/60 text-base font-black text-red-400 hover:bg-red-950/30">
                  {!combatFleeMeta ? "Fuite impossible" : combatRoundCount < (combatFleeMeta.min_rounds ?? 0) ? `Fuir (après ${combatFleeMeta.min_rounds})` : "Fuir"}
                </Button>
              </div>

              <details className="group rounded-xl border border-border/40 bg-black/20 px-3 py-2 text-[11px] text-muted-foreground">
                <summary className="cursor-pointer select-none font-bold text-red-300/80 group-open:mb-1.5">{isGenericSystem ? "Comment fonctionne le combat Vie/Armure/Attaque ?" : "Comment fonctionne un assaut ?"}</summary>
                {isGenericSystem ? "Dégâts infligés = Votre Attaque - Armure ennemie + jet (0-2). Dégâts reçus = Attaque ennemie - Votre Armure + jet (0-1). Critique sur 9 ou 0. Minimum 1 dégât infligé, 0 reçu si Armure élevée." : "Quotient = HAB joueur - HAB ennemi. Jet 0-9 + Table des coups portés = pertes END de chaque camp."}
              </details>

              {combatResult?.combat_ended && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl border-2 p-4 text-center text-sm font-black ${combatResult.winner === "player" ? "border-[--hero-emerald]/40 bg-emerald-950/30 text-[--hero-emerald]" : "border-red-500/40 bg-red-950/40 text-red-300"}`}>
                  {combatResult.winner === "player" ? <>🏆 Victoire !</> : <>☠️ Défaite...</>}
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 pb-8 space-y-4">
          {!isEnding && !isCombatMode && !isSpecialLoneWolfStep ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[--hero-gold]" /><h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Que décidez-vous ?</h3></div>
              <div className="grid grid-cols-1 gap-2.5">
                {choices.map((choice, index) => {
                  const available = isChoiceAvailable(choice);
                  return (
                    <Button key={choice.id} variant="outline" disabled={saving || !available} onClick={() => handleChoice(choice)} className={`group h-auto min-h-12 w-full items-start justify-between whitespace-normal rounded-2xl border-border/70 bg-card/55 px-4 py-4 text-left shadow-lg hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 disabled:hover:translate-y-0 ${available ? "" : "opacity-55"}`}>
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-2 text-sm font-bold leading-5 group-hover:text-primary">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border/60 bg-muted text-[10px] font-black text-muted-foreground group-hover:border-primary/45 group-hover:bg-primary/20 group-hover:text-primary">{index + 1}</span>
                          <span>{choice.text}</span>
                          {choice.is_premium && choice.price_gems > 0 && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[--hero-gold]/35 bg-[--hero-gold]/12 text-[--hero-gold] text-[10px] font-black shrink-0"><GemIcon size="xs" title="" />{choice.price_gems}</span>}
                        </div>
                        {choice.flavor_text && <p className="text-xs text-muted-foreground italic pl-7">{choice.flavor_text}</p>}
                        {!available && <p className="text-[11px] font-semibold text-amber-500/90 pl-7">🔒 Condition non remplie — vérifiez votre sacoche.</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : isCombatMode ? <div className="text-center py-8 text-muted-foreground text-sm">Combat en cours — attaquez ou fuyez.</div> : isSpecialLoneWolfStep ? <div className="text-center py-4 text-xs text-muted-foreground">Suivez les instructions ci-dessus.</div> : (
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }} className={`relative overflow-hidden rounded-[2rem] border-2 text-center shadow-2xl ${isVictory ? "border-[--hero-gold]/45 bg-[--hero-gold]/10" : "border-red-400/35 bg-red-500/10"}`}>
              <div className="relative h-44 w-full overflow-hidden sm:h-56">
                <img src={isVictory ? "/illustrations/ui/victory.jpg" : "/illustrations/ui/defeat.jpg"} alt={isVictory ? "Victoire" : "Défaite"} onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              </div>
              <div className="relative z-10 space-y-6 p-6 pt-4 sm:p-8 sm:pt-5">
                <div className="mx-auto -mt-12 grid size-20 place-items-center rounded-[1.6rem] border border-border/45 bg-background/80 shadow-inner backdrop-blur-md sm:-mt-14">{isVictory ? <Trophy className="size-11 text-[--hero-gold]" /> : <Skull className="size-11 text-red-300" />}</div>
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-muted-foreground">{isVictory ? "Dénouement héroïque" : "Dénouement tragique"}</p>
                  <h3 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">{currentNode?.title || (isVictory ? "Victoire" : "Fin")}</h3>
                  <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">{isVictory ? isFirstDiscovery ? "Nouvelle fin inscrite dans votre grimoire. Votre sacoche reste liée à cette aventure." : "Fin déjà connue, mais votre progression reste." : "Cette tentative s'achève. Votre sacoche reste ici, pour votre prochain passage."}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/50 bg-background/35 p-2">
                  <div className="rounded-xl bg-muted/35 p-3"><div className="text-lg font-black text-red-300">{stats.hp_current}/{stats.hp_max}</div><div className="text-[10px] font-bold text-muted-foreground">Vie</div></div>
                  <div className="rounded-xl bg-muted/35 p-3"><div className="text-lg font-black text-sky-300">{stats.armor}</div><div className="text-[10px] font-bold text-muted-foreground">Armure</div></div>
                  <div className="rounded-xl bg-muted/35 p-3"><div className="text-lg font-black text-amber-300">{stats.attack_power}</div><div className="text-[10px] font-bold text-muted-foreground">Attaque</div></div>
                </div>
                {isVictory && (
                  <div className="flex justify-center">
                    {isFirstDiscovery ? <Badge className="inline-flex items-center gap-1 border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 px-3 py-1 text-xs font-black text-[--hero-emerald]"><GemIcon size="xs" title="" /> +{gemsAwarded}</Badge> : <Badge variant="outline" className="px-3 py-1 text-xs text-muted-foreground">✓ Fin déjà explorée</Badge>}
                  </div>
                )}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link href={`/story/${storyId}/play?reset=true`} className="flex-1"><Button variant="outline" className="h-10 w-full rounded-2xl font-bold"><RotateCcw className="size-4" /> Recommencer (sacoche vide)</Button></Link>
                  <Link href="/catalogue" className="flex-1"><Button className="h-10 w-full rounded-2xl font-black"><Award className="size-4" /> Catalogue</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
