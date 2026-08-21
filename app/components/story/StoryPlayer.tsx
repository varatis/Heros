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
  ScrollText,
  Swords,
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

// === Journal d'aventure ===
// Chaque événement de la partie (choix, combat, jet, objet, blessure...)
// est historisé pour que le joueur puisse relire ce qui s'est passé.
type JournalEntry = {
  id: string;
  kind:
    | "choice"      // décision prise par le joueur
    | "combat"      // assaut de combat
    | "dice"        // jet de la Table de Hasard / dé
    | "item"        // objet gagné / perdu / utilisé
    | "damage"      // blessure subie
    | "heal"        // soin reçu
    | "reward"      // gemmes / butin
    | "chapter"     // arrivée dans une nouvelle section
    | "info";       // note de règle, divers
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

// Un assaut de combat résolu, pour la narration round par round
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

  // === Journal d'aventure (fil chronologique de la partie) ===
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  // Illustration : masquée si le fichier est absent (onError)
  const [illustrationFailed, setIllustrationFailed] = useState(false);
  // Historique des assauts du combat en cours (narration round par round)
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);

  // === Combat Loup Solitaire (serveur) ===
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<any>(null);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [allEnemies, setAllEnemies] = useState<any[]>([]);
  const [combatResult, setCombatResult] = useState<ResolveCombatRoundResponse | null>(null);
  const [combatInProgress, setCombatInProgress] = useState(false);
  // Nombre d'assauts résolus du combat en cours (fidélité livre :
  // fuites et victoires rapides dépendent du compte d'assauts)
  const [combatRoundCount, setCombatRoundCount] = useState(0);
  // END en entrant dans le combat (§227 : victoire « sans blessure »)
  const [combatHpStart, setCombatHpStart] = useState<number | null>(null);
  // Signature des notes de règles déjà affichées (évite le spam)
  const [combatNotesSig, setCombatNotesSig] = useState("");

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

  // Ajoute une ou plusieurs entrées au journal d'aventure (fil chronologique).
  function logJournal(entries: Array<{ kind: JournalEntry["kind"]; message: string }>) {
    setJournal((prev) => {
      const stamped = entries.map((e, i) => ({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
        kind: e.kind,
        message: e.message,
        page: pageNumber,
      }));
      // On conserve les 120 derniers événements (mémoire bornée)
      return [...prev, ...stamped].slice(-120);
    });
  }

  // Mappe un FeedbackEvent (toast) vers une entrée de journal
  function feedbackToJournalKind(type: FeedbackEvent["type"], message: string): JournalEntry["kind"] {
    if (message.includes("END") || message.includes("PV")) {
      return message.includes("-") || message.toLowerCase().includes("perd") ? "damage" : "heal";
    }
    if (type === "danger") return "damage";
    if (type === "reward" || type === "premium") return "reward";
    if (type === "success") return "info";
    return "info";
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

        // Initialisation via Edge Function (contourne les RLS)
        let initSucceeded = false;
        try {
          const res = await invokeInitGame(storyId, {
            hp_current: computed.hp_current,
            hp_max: computed.hp_max,
            strength: computed.strength,
            agility: computed.agility,
            luck: computed.luck,
            charisma: computed.charisma,
          });
          setStats({
            hp_current: computed.hp_current,
            hp_max: computed.hp_max,
            strength: computed.strength,
            agility: computed.agility,
            luck: computed.luck,
            narrative_flags: (res.stats?.narrative_flags as Record<string, any>) || {},
          });
          if (res.node) {
            targetNodeId = res.node.id;
          }
          initSucceeded = true;
        } catch (err) {
          console.warn("init-game non disponible, fallback écriture directe:", err);
        }

        // Fallback : écriture directe si l'Edge Function n'est pas disponible
        if (!initSucceeded) {
          // Trouver le noeud de départ pour créer la progression
          let fallbackNodeId: string | null = null;
          try {
            const { data: fallbackNodes } = await supabase
              .from("story_nodes")
              .select("id")
              .eq("story_id", storyId)
              .order("is_start", { ascending: false })
              .limit(1);
            fallbackNodeId = fallbackNodes?.[0]?.id ?? null;
          } catch { /* ignore */ }

          try {
            await supabase.from("character_stats").upsert({
              user_id: user.id,
              story_id: storyId,
              hp_current: computed.hp_current,
              hp_max: computed.hp_max,
              strength: computed.strength,
              agility: computed.agility,
              luck: computed.luck,
              charisma: computed.charisma,
              narrative_flags: {},
            }, { onConflict: "user_id,story_id" });

            if (fallbackNodeId) {
              await supabase.from("user_story_progress").upsert({
                user_id: user.id,
                story_id: storyId,
                current_node_id: fallbackNodeId,
                completion_pct: 10,
                last_played_at: new Date().toISOString(),
              }, { onConflict: "user_id,story_id" });
            }
          } catch (writeErr) {
            // Si l'écriture directe échoue aussi (RLS pas encore migrée),
            // ce n'est pas bloquant — make-choice créera la ligne au 1er choix
            console.warn("Fallback écriture directe échoué (sera créé par make-choice):", writeErr);
          }

          setStats({
            hp_current: computed.hp_current,
            hp_max: computed.hp_max,
            strength: computed.strength,
            agility: computed.agility,
            luck: computed.luck,
            narrative_flags: {},
          });
        }
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
          // La progression est déjà créée par invokeInitGame ci-dessus.
          // Le client n'écrit plus sur user_story_progress (migration 004).
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
      setIllustrationFailed(false);
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
        setCombatRoundCount(0);
        setCombatHpStart(stats.hp_current);
        setCombatNotesSig("");
        setCombatLog([]);
        logJournal([
          {
            kind: "combat",
            message: `Combat engagé contre ${combatants
              .map((c: any) => c.name)
              .join(", ")} !`,
          },
        ]);
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
      logJournal([
        {
          kind: res.healed > 0 ? "heal" : "item",
          message:
            res.healed > 0
              ? `${item.name} consommée : +${res.healed} END.`
              : `${item.name} consommée (aucun effet, END au maximum).`,
        },
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
    logJournal([{ kind: "dice", message: `Équipement de départ — Table de Hasard : ${roll}.` }]);
  }

  // === Jet de Hasard narratif (pour Section 36, 2, etc.) ===
  const [hazardRollResult, setHazardRollResult] = useState<number | null>(null);
  const [isRollingHazard, setIsRollingHazard] = useState(false);

  async function rollNarrativeHazard() {
    if (isRollingHazard || !currentNode) return;

    setIsRollingHazard(true);
    await new Promise(r => setTimeout(r, 400));

    const roll = Math.floor(Math.random() * 10);
    setHazardRollResult(roll);
    setIsRollingHazard(false);

    pushFeedback([
      makeFeedback("info", `Table de Hasard : ${roll}`),
    ]);
    logJournal([{ kind: "dice", message: `Table de Hasard : vous tirez le ${roll}.` }]);

    // Déléguer au serveur : validation et conséquences via Edge Function
    let hazardHandled = false;
    try {
      const res = await invokeGameSetupAction({
        action: "hazard_roll",
        story_id: storyId,
        hazard_roll: roll,
        current_node_id: currentNode.id,
      });

      if (res.stats) {
        setStats(prev => ({
          ...prev,
          hp_current: res.stats!.hp_current,
          hp_max: res.stats!.hp_max,
          strength: res.stats!.strength,
          agility: res.stats!.agility,
          luck: res.stats!.luck,
          narrative_flags: (res.stats!.narrative_flags as Record<string, any>) || {},
        }));
      }

      // Le jet a pu détruire le Sac à Dos / consommer des objets (§188)
      if (effectsTouchInventory(res.effects_applied)) {
        await syncInventory();
      }

      if (res.node) {
        setTimeout(async () => {
          await loadNode(res.node!.id);
          setHazardRollResult(null);
        }, 1800);
      } else {
        setTimeout(() => setHazardRollResult(null), 1800);
      }

      if (res.effects_applied?.length > 0) {
        const hasDamage = res.effects_applied.some(
          (e: string) => e.includes("perte") || e.includes("-")
        );
        pushFeedback(
          res.effects_applied.map((e: string) =>
            makeFeedback(hasDamage ? "danger" : "success", e)
          )
        );
        logJournal(
          res.effects_applied.map((e: string) => ({
            kind: (hasDamage ? "damage" : "info") as JournalEntry["kind"],
            message: e,
          })),
        );
      }
      hazardHandled = true;
    } catch (err) {
      // Le serveur est la seule autorité sur les conséquences du jet
      // (les 21 sections à hasard ont toutes leurs `hazard_consequences`).
      // En cas d'échec réseau, on informe le joueur au lieu d'appliquer
      // une règle locale approximative.
      console.warn("hazard_roll indisponible:", err);
      pushFeedback([
        makeFeedback(
          "danger",
          "Le jet n'a pas pu être validé par le serveur. Réessayez.",
        ),
      ]);
    }

    if (!hazardHandled) {
      setTimeout(() => setHazardRollResult(null), 1800);
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

  // Map des slugs choisis par le joueur vers les slugs EXACTS de la base de données
  // Migration 008 : le slug officiel est désormais "sixieme_sens" (correction du
  // slug erroné "six_cieme_sens"). Le mappage convertit les anciennes variantes
  // vers le slug correct.
  const DISCIPLINE_SLUG_MAP: Record<string, string> = {
    "six_cieme_sens": "sixieme_sens",
    "sixième_sens": "sixieme_sens",
  };

  function getDatabaseSlug(playerSlug: string): string {
    return DISCIPLINE_SLUG_MAP[playerSlug] || playerSlug;
  }

  // Recherche robuste d'un item (par nom ou slug)
  async function findItemByNameOrSlug(nameOrSlug: string, storyId: string) {
    // 1. Recherche par nom (ilike)
    let { data } = await supabase
      .from("items")
      .select("id, name, slug")
      .ilike("name", `%${nameOrSlug}%`)
      .eq("story_id", storyId)
      .limit(1)
      .single();

    if (data) return data;

    // 2. Recherche par slug généré
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

  // Valider les 5 disciplines et avancer vers l'étape suivante (via serveur)
  async function confirmDisciplines() {
    if (selectedDisciplines.length !== MAX_DISCIPLINES) {
      pushFeedback([makeFeedback("danger", "Vous devez choisir exactement 5 disciplines.")]);
      return;
    }

    // Mise à jour locale immédiate (cosmétique)
    const newFlags: Record<string, boolean> = {};
    selectedDisciplines.forEach(slug => {
      const dbSlug = getDatabaseSlug(slug);
      // Les flag_key dans choice_effects utilisent "discipline_X"
      // (ex: "discipline_six_cieme_sens" pour Sixième Sens).
      // On préfixe pour correspondre à la convention DB.
      newFlags[`discipline_${dbSlug}`] = true;
    });

    setStats(prev => ({
      ...prev,
      narrative_flags: { ...prev.narrative_flags, ...newFlags },
    }));

    setHasConfirmedDisciplines(true);

    // Sauvegarde serveur via Edge Function (contourne les RLS)
    let disciplinesSaved = false;
    try {
      const res = await invokeGameSetupAction({
        action: "save_disciplines",
        story_id: storyId,
        disciplines: selectedDisciplines.map(getDatabaseSlug),
      });

      if (res.stats) {
        setStats(prev => ({
          ...prev,
          narrative_flags: (res.stats!.narrative_flags as Record<string, any>) || {},
        }));
      }

      if (res.node) {
        await loadNode(res.node.id);
      } else {
        // Fallback manuel si aucun noeud retourné
        const { data: equipmentNode } = await supabase
          .from("story_nodes")
          .select("*")
          .eq("story_id", storyId)
          .eq("metadata->>kind", "equipment_setup")
          .maybeSingle();

        if (equipmentNode) {
          await loadNode(equipmentNode.id);
        }
      }

      disciplinesSaved = true;
    } catch (err) {
      console.warn("game-setup-action non disponible, fallback écriture directe:", err);
    }

    // Fallback : écriture directe si l'Edge Function n'est pas disponible
    if (!disciplinesSaved) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("character_stats").upsert({
            user_id: user.id,
            story_id: storyId,
            narrative_flags: newFlags,
          }, { onConflict: "user_id,story_id" });
        }
      } catch (writeErr) {
        console.warn("Fallback écriture narrative_flags échoué:", writeErr);
      }

      // Avancer vers l'équipement ou section 1
      try {
        const { data: equipmentNode } = await supabase
          .from("story_nodes")
          .select("*")
          .eq("story_id", storyId)
          .eq("metadata->>kind", "equipment_setup")
          .maybeSingle();

        if (equipmentNode) {
          await loadNode(equipmentNode.id);
        } else {
          const { data: sectionOne } = await supabase
            .from("story_nodes")
            .select("*")
            .eq("story_id", storyId)
            .eq("node_key", "section_001")
            .maybeSingle();
          if (sectionOne) await loadNode(sectionOne.id);
        }
      } catch (navErr) {
        console.warn("Erreur navigation fallback:", navErr);
      }
    }

    pushFeedback([
      makeFeedback("success",
        `Vous avez choisi : ${selectedDisciplines.map(s => kaiDisciplines.find(d => d.slug === s)?.name).join(", ")}`
      ),
    ]);
  }

  // === Fonction de combat Loup Solitaire (résolution serveur) ===
  // L'ENDURANCE des ennemis est tenue par le SERVEUR
  // (`character_stats.combat_state`) : le client n'envoie plus que la
  // section. Corrige le bug qui renvoyait l'END initiale à chaque
  // assaut et rendait tout combat ingagnable.
  async function handleCombatRound(escape: boolean = false) {
    if (!currentEnemy || !currentNode || combatInProgress) return;

    setCombatInProgress(true);
    setCombatResult(null);

    try {
      const res = await invokeResolveCombatRound({
        story_id: storyId,
        current_node_id: currentNode.id,
        escape,
      });
      setCombatRoundCount(res.round ?? combatRoundCount + 1);

      setCombatResult(res);

      // Narration round par round : chaque assaut rejoint l'historique visible
      setCombatLog((prev) =>
        [
          ...prev,
          {
            round: res.round ?? prev.length + 1,
            attackQuotient: res.attack_quotient,
            hazardRoll: res.hazard_roll,
            playerLoss: res.player_loss,
            enemyLoss: res.enemy_loss,
            enemyName: res.enemy_name ?? currentEnemy?.name ?? "l'ennemi",
            escaped: escape,
          },
        ].slice(-12),
      );

      // Mise à jour des stats du joueur (ENDURANCE) et des flags que le
      // combat vient éventuellement de poser (§227, §231, §339).
      setStats((prev) => ({
        ...prev,
        hp_current: res.player_endurance,
        narrative_flags:
          (res.narrative_flags as Record<string, any>) ?? prev.narrative_flags,
      }));

      // ENDURANCE courante des ennemis : source de vérité serveur.
      if (res.enemies) {
        setAllEnemies(res.enemies);
        const idx = res.enemy_index ?? currentEnemyIndex;
        setCurrentEnemyIndex(idx);
        setCurrentEnemy(res.enemies[idx] ?? null);
      } else {
        setCurrentEnemy((prev: any) =>
          prev ? { ...prev, endurance: res.enemy_endurance } : prev,
        );
      }

      // Feedback clair
      const events: FeedbackEvent[] = [];

      // Règles spéciales du livre appliquées (Vordak psychique,
      // immunité à la Puissance Psychique, noir sans torche...) :
      // affichées une seule fois à leur première apparition.
      const notesSig = (res.combat_notes ?? []).join("|");
      if (res.combat_notes?.length && notesSig !== combatNotesSig) {
        for (const note of res.combat_notes) {
          events.push(makeFeedback("info", note));
        }
        setCombatNotesSig(notesSig);
      }

      // « T » du livre = tué sur le coup
      const lossLabel = (v: number | "K") =>
        v === "K" ? "TUÉ SUR LE COUP" : `${v} END`;

      if (escape) {
        events.push(
          makeFeedback("danger", `Fuite ! Vous perdez ${lossLabel(res.player_loss)}.`),
        );
      } else {
        if (res.player_loss === "K") {
          events.push(makeFeedback("danger", "Coup fatal : vous êtes tué sur le coup !"));
        } else if (res.player_loss > 0) {
          events.push(makeFeedback("danger", `Vous perdez ${res.player_loss} END.`));
        }
        if (res.enemy_loss === "K") {
          events.push(
            makeFeedback("success", `${res.enemy_name ?? "L'ennemi"} est tué sur le coup !`),
          );
        } else if (res.enemy_loss > 0) {
          events.push(
            makeFeedback(
              "success",
              `${res.enemy_name ?? "L'ennemi"} perd ${res.enemy_loss} END.`,
            ),
          );
        }
      }

      // Journalisation de l'assaut (fil d'aventure)
      const roundNum = res.round ?? combatRoundCount + 1;
      const journalRound: Array<{ kind: JournalEntry["kind"]; message: string }> = [
        {
          kind: "combat",
          message: `Assaut ${roundNum} contre ${res.enemy_name ?? currentEnemy?.name ?? "l'ennemi"} — vous ${
            res.player_loss === "K"
              ? "êtes tué sur le coup"
              : res.player_loss > 0
                ? `perdez ${res.player_loss} END`
                : "ne subissez rien"
          }, l'ennemi ${
            res.enemy_loss === "K"
              ? "est tué sur le coup"
              : res.enemy_loss > 0
                ? `perd ${res.enemy_loss} END`
                : "ne subit rien"
          }.`,
        },
      ];

      if (res.combat_ended) {
        if (res.winner === "player") {
          events.push(
            makeFeedback("success", "Victoire ! Tous les ennemis sont vaincus."),
          );
          journalRound.push({ kind: "combat", message: "Victoire ! Tous les ennemis sont vaincus." });
          logJournal(journalRound);
          setTimeout(() => {
            setIsCombatMode(false);
            setCurrentEnemy(null);
            setAllEnemies([]);
            setCurrentEnemyIndex(0);
            setCombatResult(null);
            // §17 : le livre fait tirer la Table de Hasard APRÈS le
            // combat. Sans rechargement, la section resterait sans
            // aucune issue affichée.
            if (currentNode?.id) void loadNode(currentNode.id);
          }, 2200);
        } else {
          // Défaite : Endurance 0 = mort = fin de partie (règle du livre).
          // Le serveur a déjà basculé la progression sur le noeud de mort.
          events.push(makeFeedback("danger", "Vous avez succombé au combat..."));
          journalRound.push({ kind: "damage", message: "Vous avez succombé au combat..." });
          logJournal(journalRound);
          if (res.death_node?.id) {
            setTimeout(() => {
              setIsCombatMode(false);
              void loadNode(res.death_node.id);
            }, 2200);
          }
        }
      } else {
        if (
          res.enemy_index !== undefined &&
          res.enemy_index !== currentEnemyIndex
        ) {
          events.push(
            makeFeedback("success", "Ennemi vaincu ! Au suivant..."),
          );
          journalRound.push({ kind: "combat", message: "Ennemi vaincu ! Au suivant..." });
        }
        logJournal(journalRound);
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

  // Fuite de combat (fidélité livre) : un dernier assaut subi sans frapper,
  // puis navigation vers la section de fuite définie par la section.
  async function handleFlee() {
    if (!currentEnemy || !currentNode || combatInProgress) return;
    const fleeMeta = (currentNode as any)?.metadata?.combat?.flee;
    if (!fleeMeta?.target_node_key) return;

    setCombatInProgress(true);
    setCombatResult(null);

    try {
      // Règle du livre : on mène d'abord l'assaut en cours (l'ennemi ne
      // perd rien, le Loup Solitaire encaisse), puis on s'enfuit.
      const res = await invokeResolveCombatRound({
        story_id: storyId,
        current_node_id: currentNode.id,
        escape: true,
      });
      setCombatRoundCount(res.round ?? combatRoundCount + 1);
      setStats((prev) => ({
        ...prev,
        hp_current: res.player_endurance,
        narrative_flags:
          (res.narrative_flags as Record<string, any>) ?? prev.narrative_flags,
      }));

      const events: FeedbackEvent[] = [
        makeFeedback(
          "danger",
          res.player_loss === "K"
            ? "Coup fatal en tentant de fuir !"
            : `Fuite ! Vous perdez ${res.player_loss} END.`,
        ),
      ];
      logJournal([
        {
          kind: "combat",
          message:
            res.player_loss === "K"
              ? "Fuite tragique : coup fatal en tournant le dos !"
              : `Vous fuyez le combat en encaissant ${res.player_loss} END.`,
        },
      ]);

      if (res.player_endurance <= 0) {
        events.push(makeFeedback("danger", "Vous avez succombé en fuyant..."));
        pushFeedback(events);
        if (res.death_node?.id) {
          setTimeout(() => {
            setIsCombatMode(false);
            void loadNode(res.death_node.id);
          }, 2200);
        }
        return;
      }

      const fleeRes = await invokeGameSetupAction({
        action: "combat_flee",
        story_id: storyId,
        current_node_id: currentNode.id,
      });

      // Effets d'arrivée de la section de fuite (repas, sac, objets)
      const arrivalExtra = (fleeRes.effects_applied ?? []).filter(
        (e: string) => e !== "Vous prenez la fuite !",
      );
      for (const e of arrivalExtra) events.push(makeFeedback("info", e));
      if (effectsTouchInventory(fleeRes.effects_applied)) {
        await syncInventory();
      }

      events.push(makeFeedback("info", "Vous prenez la fuite !"));
      pushFeedback(events);

      if (fleeRes.node?.id) {
        setTimeout(() => {
          setIsCombatMode(false);
          void loadNode(fleeRes.node.id);
        }, 1200);
      }
    } catch (err) {
      pushFeedback([
        makeFeedback(
          "danger",
          err instanceof Error ? err.message : "Fuite impossible."
        ),
      ]);
    } finally {
      setCombatInProgress(false);
    }
  }

  // --- Disponibilité des choix (mirroir des pré-conditions serveur) ---
  // Même normalisation que `make-choice` : les flag_key des données
  // utilisent « discipline_six_cieme_sens » et le client « sixieme_sens ».
  function normalizeFlagKeyClient(str: string): string {
    return str
      .toLowerCase()
      .replace(/^discipline_/, "")
      .replace("sixième", "sixieme")
      .replace("six_cieme", "sixieme")
      .replace(/[^a-z]/g, "");
  }

  // Détecte les effets serveur qui modifient l'inventaire (gain 🎁,
  // dépense 💸, repas 🍖, sac détruit 🎒, objet détruit 🔥) afin de
  // resynchroniser l'affichage de la sacoche.
  function effectsTouchInventory(effects?: string[] | null): boolean {
    return Boolean(
      effects?.some(
        (e) =>
          e.startsWith("🎁") ||
          e.startsWith("💸") ||
          e.startsWith("🍖") ||
          e.startsWith("🎒") ||
          e.startsWith("🔥"),
      ),
    );
  }

  // Un choix peut être verrouillé par une Discipline Kaï (flag_require)
  // ou par un objet (inventory_require). On affiche le choix grisé plutôt
  // que masqué : le livre mentionne explicitement ces conditions.
  function isChoiceAvailable(choice: any): boolean {
    const flags = (stats.narrative_flags ?? {}) as Record<string, any>;
    for (const fx of choice.choice_effects ?? []) {
      if (fx.effect_type === "flag_require" && fx.flag_key) {
        const want = normalizeFlagKeyClient(fx.flag_key);
        let cur = flags[fx.flag_key];
        if (cur === undefined) {
          for (const [key, value] of Object.entries(flags)) {
            if (normalizeFlagKeyClient(key) === want) {
              cur = value;
              break;
            }
          }
        }
        if (Boolean(cur) !== Boolean(fx.flag_value ?? true)) return false;
      } else if (fx.effect_type === "inventory_require" && fx.item_id) {
        // stat_value = quantité exigée (ex. 10 Couronnes §12 ; défaut 1)
        const needed = fx.stat_value ?? 1;
        const owned = inventory.some(
          (invItem) =>
            invItem.item_id === fx.item_id &&
            (invItem.quantity ?? 0) >= needed,
        );
        if (!owned) return false;
      }
    }
    return true;
  }

  // Effectuer un choix (avec support des jets de dés D20).
  // La totalité de la logique sensible (pré-conditions, débit premium,
  // historique, effets, progression, récompenses, succès) est validée et
  // écrite par l'Edge Function `make-choice` — le client se contente
  // d'afficher la réponse du serveur.
  async function handleChoice(choice: any) {
    if (!choice.target_node_id || saving) return;
    if (!isChoiceAvailable(choice)) return; // pré-condition non remplie
    setSaving(true);
    logJournal([{ kind: "choice", message: `Vous décidez : « ${choice.text} »` }]);

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
      setIllustrationFailed(false);
      setChoices(res.choices || []);
      if (res.node?.title) {
        logJournal([{ kind: "chapter", message: `${res.node.title}` }]);
      }

      // 2. Stats de base serveur + bonus d'équipement (affichage)
      const base = {
        hp_current: res.stats.hp_current,
        hp_max: res.stats.hp_max,
        strength: res.stats.strength,
        agility: res.stats.agility,
        luck: res.stats.luck,
        charisma: res.stats.charisma,
      };
      // Tout effet d'inventaire (gain 🎁, dépense 💸, repas 🍖,
      // sac détruit 🎒, objet détruit 🔥) force la resynchronisation.
      const inventoryChanged = effectsTouchInventory(res.effects_applied);
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
      // Historise tous les retours du choix dans le journal d'aventure
      logJournal(
        nextEvents
          .filter((e) => e.message !== "Le récit se poursuit.")
          .map((e) => ({
            kind: feedbackToJournalKind(e.type, e.message),
            message: e.message,
          })),
      );
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

  // === Fidélité livre-jeu (Loup Solitaire) ===
  // Fuite de combat : metadata.combat.flee = { target_node_key, min_rounds }
  const combatFleeMeta = (currentNode as any)?.metadata?.combat?.flee as
    | { target_node_key: string; min_rounds?: number }
    | undefined;
  // Jets de Hasard narratifs : pilotés UNIQUEMENT par
  // metadata.hazard_consequences (les 21 sections concernées sont
  // toutes équipées ; l'ancienne détection par texte était fragile et
  // pouvait afficher un dé sans logique associée).
  const hazardRulesMeta = (currentNode as any)?.metadata?.hazard_consequences as
    | any[]
    | undefined;
  const hasNarrativeHazard =
    storyUsesLoneWolfRules &&
    Array.isArray(hazardRulesMeta) &&
    hazardRulesMeta.length > 0;

  // ENDURANCE initiale de l'ennemi courant (pour la barre de vie) :
  // lue dans la section, alors que `currentEnemy.endurance` suit la
  // valeur courante renvoyée par le serveur.
  const combatEnemyMaxEndurance = (() => {
    const declared = (currentNode as any)?.metadata?.combatants as
      | Array<{ endurance: number }>
      | undefined;
    return declared?.[currentEnemyIndex]?.endurance ?? 0;
  })();
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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsJournalOpen(!isJournalOpen);
              if (!isJournalOpen) setIsBagOpen(false);
            }}
            className="relative flex min-h-10 items-center gap-1 rounded-full border border-[--hero-gold]/40 bg-[--hero-gold]/15 px-2.5 py-1 text-xs font-bold text-[--hero-gold] transition-colors hover:bg-[--hero-gold]/25"
            title="Ouvrir le journal d'aventure"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Journal</span>
            {journal.length > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[--hero-gold]/30 px-1 text-[9px] font-black tabular-nums">
                {journal.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setIsBagOpen(!isBagOpen);
              if (!isBagOpen) setIsJournalOpen(false);
            }}
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

      {/* Tiroir Journal d'aventure : fil chronologique des événements */}
      <AnimatePresence>
        {isJournalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            className="mb-4 glass-card rounded-2xl border-2 border-[--hero-gold]/40 p-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[--hero-gold]" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  Journal d&apos;aventure
                </h4>
              </div>
              <button
                onClick={() => setIsJournalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fermer le journal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {journal.length > 0 ? (
              <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {[...journal].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-2.5 rounded-xl border bg-background/40 px-3 py-2 text-xs leading-5 ${journalAccent(entry.kind)}`}
                  >
                    <span className="mt-0.5 text-sm leading-none">{journalIcon(entry.kind)}</span>
                    <span className="min-w-0 flex-1 text-foreground/85">{entry.message}</span>
                    <span className="shrink-0 rounded-full bg-muted/50 px-1.5 py-0.5 text-[9px] font-black text-muted-foreground">
                      p.{entry.page}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Votre légende commence à peine — chaque choix, combat et
                trouvaille sera consigné ici.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Illustration de la section (planches du livre restaurées et
                colorisées) — cadre façon gravure premium, masquée si absente */}
            {currentNode?.illustration_url && !illustrationFailed && (
              <motion.figure
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="relative overflow-hidden rounded-[1.4rem] border-2 border-[--hero-gold]/25 bg-black/30 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75)]">
                  <img
                    src={currentNode.illustration_url}
                    alt={currentNode.title || "Illustration"}
                    onError={() => setIllustrationFailed(true)}
                    className="w-full max-h-[26rem] object-cover object-top sm:max-h-[30rem]"
                  />
                  {/* Voile bas pour fondre l'image dans le thème sombre */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/85 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 rounded-[1.3rem] ring-1 ring-inset ring-white/10" />
                </div>
                <figcaption className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[--hero-gold]/70">
                  <span className="h-px w-8 bg-[--hero-gold]/40" />
                  Illustration originale restaurée
                  <span className="h-px w-8 bg-[--hero-gold]/40" />
                </figcaption>
              </motion.figure>
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

        {/* === Mode Jet de Hasard narratif (metadata.hazard_consequences) === */}
        {!isEquipmentSetup && !showDisciplineSelection && !isEnding && !isCombatMode && hasNarrativeHazard && (
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

                        // Déléguer au serveur : ajout des objets + avancement
                        let equipmentDone = false;
                        try {
                          const res = await invokeGameSetupAction({
                            action: "setup_equipment",
                            story_id: storyId,
                            equipment_roll: equipmentRoll!,
                          });

                          await syncInventory();

                          if (res.node) {
                            setEquipmentRoll(null);
                            await loadNode(res.node.id);
                          }

                          equipmentDone = true;
                        } catch (err) {
                          console.warn("game-setup-action non disponible, fallback local:", err);
                        }

                        // Fallback si Edge Function non disponible
                        if (!equipmentDone) {
                          try {
                            // Avancer directement vers section_001
                            setEquipmentRoll(null);
                            const { data: sectionOne } = await supabase
                              .from("story_nodes")
                              .select("*")
                              .eq("story_id", storyId)
                              .eq("node_key", "section_001")
                              .maybeSingle();
                            if (sectionOne) await loadNode(sectionOne.id);
                          } catch (navErr) {
                            console.warn("Erreur fallback équipement:", navErr);
                          }
                        }

                        pushFeedback([makeFeedback("success", "Objets ajoutés à la sacoche !")]);
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
          <div className="mb-6 overflow-hidden rounded-[1.6rem] border-2 border-red-500/40 bg-gradient-to-b from-red-950/35 to-red-950/10 shadow-[0_18px_50px_-20px_rgba(220,38,38,0.35)]">
            {/* Bandeau titre du duel */}
            <div className="flex items-center justify-center gap-2 border-b border-red-500/25 bg-red-950/40 px-4 py-2">
              <Swords className="size-4 text-red-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-red-300">
                Combat — Assaut {combatRoundCount + (combatResult?.combat_ended ? 0 : 1)}
              </span>
              {allEnemies.length > 1 && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-300">
                  Ennemi {currentEnemyIndex + 1}/{allEnemies.length}
                </span>
              )}
            </div>

            <div className="space-y-4 p-5">
              {/* Face à face : vous vs l'ennemi, avec jauges d'ENDURANCE */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Vous */}
                <div className="rounded-2xl border border-[--hero-emerald]/30 bg-black/30 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[--hero-emerald]">
                    Loup Solitaire
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-black tabular-nums text-white">{stats.hp_current}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">END</span>
                    <span className="ml-auto text-[10px] font-bold text-muted-foreground">
                      HAB {combatResult?.effective_player_skill ?? stats.strength}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[--hero-emerald] to-emerald-300 transition-all duration-700"
                      style={{
                        width: `${Math.max(0, Math.min(100, (stats.hp_current / Math.max(1, stats.hp_max)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid size-9 place-items-center rounded-full border border-red-500/40 bg-red-950/60 text-xs font-black text-red-300">
                  VS
                </div>

                {/* L'ennemi */}
                <div className="rounded-2xl border border-red-400/30 bg-black/30 p-3">
                  <div className="truncate text-[10px] font-black uppercase tracking-widest text-red-300">
                    {currentEnemy.name}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-black tabular-nums text-white">{currentEnemy.endurance}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">END</span>
                    <span className="ml-auto text-[10px] font-bold text-muted-foreground">
                      HAB {currentEnemy.combat_skill}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (currentEnemy.endurance / Math.max(1, combatEnemyMaxEndurance || currentEnemy.endurance)) * 100,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Résultat du dernier assaut, raconté clairement */}
              <AnimatePresence mode="wait">
                {combatResult && (
                  <motion.div
                    key={`${combatRoundCount}-${combatResult.hazard_roll}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/25 bg-black/35 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-300/80">
                      <span className="rounded-full bg-red-500/15 px-2.5 py-1">
                        Quotient d&apos;Attaque {combatResult.attack_quotient > 0 ? "+" : ""}
                        {combatResult.attack_quotient}
                      </span>
                      <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-purple-300/90">
                        🎲 Hasard : {combatResult.hazard_roll}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div
                        className={`rounded-xl p-3 ${
                          combatResult.player_loss === "K" || (combatResult.player_loss as number) > 0
                            ? "bg-red-500/15 text-red-300"
                            : "bg-emerald-500/10 text-[--hero-emerald]"
                        }`}
                      >
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-75">Vous</div>
                        <div className="mt-0.5 text-lg font-black">
                          {combatResult.player_loss === "K"
                            ? "☠️ Coup fatal"
                            : (combatResult.player_loss as number) > 0
                              ? `−${combatResult.player_loss} END`
                              : "Indemne"}
                        </div>
                      </div>
                      <div
                        className={`rounded-xl p-3 ${
                          combatResult.enemy_loss === "K" || (combatResult.enemy_loss as number) > 0
                            ? "bg-emerald-500/10 text-[--hero-emerald]"
                            : "bg-muted/25 text-muted-foreground"
                        }`}
                      >
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-75">
                          {combatResult.enemy_name ?? currentEnemy.name}
                        </div>
                        <div className="mt-0.5 text-lg font-black">
                          {combatResult.enemy_loss === "K"
                            ? "☠️ Tué sur le coup"
                            : (combatResult.enemy_loss as number) > 0
                              ? `−${combatResult.enemy_loss} END`
                              : "Esquive"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Historique des assauts du combat (narration round par round) */}
              {combatLog.length > 1 && (
                <div className="max-h-36 space-y-1 overflow-y-auto rounded-2xl border border-border/40 bg-black/25 p-3">
                  {[...combatLog].reverse().map((entry, idx) => (
                    <div
                      key={`${entry.round}-${idx}`}
                      className={`flex items-center gap-2 text-[11px] leading-5 ${idx === 0 ? "text-foreground/90" : "text-muted-foreground"}`}
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-[9px] font-black text-red-300">
                        {entry.round}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {entry.escaped
                          ? `Fuite — vous encaissez ${entry.playerLoss === "K" ? "un coup fatal" : `${entry.playerLoss} END`}`
                          : `Vous ${
                              entry.playerLoss === "K"
                                ? "subissez un coup fatal"
                                : entry.playerLoss > 0
                                  ? `perdez ${entry.playerLoss} END`
                                  : "esquivez"
                            } · ${entry.enemyName} ${
                              entry.enemyLoss === "K"
                                ? "est tué net"
                                : entry.enemyLoss > 0
                                  ? `perd ${entry.enemyLoss} END`
                                  : "pare le coup"
                            }`}
                      </span>
                      <span className="shrink-0 text-[9px] font-bold text-purple-300/70">🎲{entry.hazardRoll}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions de combat */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => handleCombatRound(false)}
                  disabled={combatInProgress || (combatResult?.combat_ended ?? false)}
                  className="h-12 flex-1 bg-red-600 text-base font-black hover:bg-red-700"
                >
                  {combatInProgress ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Assaut en cours...
                    </>
                  ) : (
                    <>
                      <Swords className="size-4" /> Attaquer
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => void handleFlee()}
                  disabled={
                    combatInProgress ||
                    (combatResult?.combat_ended ?? false) ||
                    !combatFleeMeta ||
                    combatRoundCount < (combatFleeMeta?.min_rounds ?? 0)
                  }
                  title={
                    combatFleeMeta
                      ? combatRoundCount < (combatFleeMeta.min_rounds ?? 0)
                        ? `Fuite possible après ${combatFleeMeta.min_rounds} assaut(s)`
                        : "Prendre la fuite (dernier assaut subi)"
                      : "La fuite n'est pas possible pour ce combat"
                  }
                  className="h-12 flex-1 border-red-500/60 text-base font-black text-red-400 hover:bg-red-950/30"
                >
                  {!combatFleeMeta
                    ? "Fuite impossible"
                    : combatRoundCount < (combatFleeMeta.min_rounds ?? 0)
                      ? `Fuir (après ${combatFleeMeta.min_rounds} assaut${(combatFleeMeta.min_rounds ?? 0) > 1 ? "s" : ""})`
                      : "Fuir"}
                </Button>
              </div>

              {/* Comment lire l'assaut ? Aide contextuelle repliée */}
              <details className="group rounded-xl border border-border/40 bg-black/20 px-3 py-2 text-[11px] text-muted-foreground">
                <summary className="cursor-pointer select-none font-bold text-red-300/80 group-open:mb-1.5">
                  Comment fonctionne un assaut ?
                </summary>
                Le Quotient d&apos;Attaque compare votre HABILETÉ à celle de
                l&apos;ennemi. À chaque assaut, un chiffre est tiré sur la Table
                de Hasard (0-9) : le croisement des deux détermine les pertes
                d&apos;ENDURANCE de chaque camp, exactement comme dans le livre.
              </details>

              {combatResult?.combat_ended && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl border-2 p-4 text-center text-sm font-black ${
                    combatResult.winner === "player"
                      ? "border-[--hero-emerald]/40 bg-emerald-950/30 text-[--hero-emerald]"
                      : "border-red-500/40 bg-red-950/40 text-red-300"
                  }`}
                >
                  {combatResult.winner === "player" ? (
                    <>🏆 Victoire ! L&apos;ennemi est vaincu — le récit reprend...</>
                  ) : (
                    <>☠️ Vous êtes tombé au combat...</>
                  )}
                </motion.div>
              )}
            </div>
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
                {choices.map((choice, index) => {
                  const available = isChoiceAvailable(choice);
                  return (
                    <Button
                      key={choice.id}
                      variant="outline"
                      disabled={saving || !available}
                      onClick={() => handleChoice(choice)}
                      className={`group h-auto min-h-12 w-full items-start justify-between whitespace-normal rounded-2xl border-border/70 bg-card/55 px-4 py-4 text-left shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:shadow-primary/10 disabled:hover:translate-y-0 ${
                        available ? "" : "opacity-55"
                      }`}
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
                        {!available && (
                          <p className="text-[11px] font-semibold text-amber-500/90 pl-7">
                            🔒 Condition non remplie
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </Button>
                  );
                })}
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
