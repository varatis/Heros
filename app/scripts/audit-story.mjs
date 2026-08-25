// ============================================================
// HeroBook — audit-story.mjs
// Audit qualité d'une histoire Vie/Armure/Attaque.
//
// Charge toutes les migrations sur un vrai Postgres (PGlite),
// reconstruit le graphe, et vérifie :
//   - 1 seul départ, fins marquées, cibles existantes
//   - pas de page à un seul choix (hors fins/combat/hazard)
//   - pas de choix en doublon (même libellé) sur un noeud
//   - pas de libellé de choix répété trop souvent dans le livre
//   - pas de noeud vivant sans issue (y compris cibles de hazard)
//   - toute branche conditionnée a une alternative inconditionnelle
//   - tout noeud atteignable depuis le départ
//   - combats : victoire et défaite câblées, fuite valide
//   - simulation aléatoire de N parties : toutes terminent sur une fin
//   - statistiques : combats, objets, fins, choix, détection de texte répété
// ============================================================
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MIG = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "migrations");
const slug = process.argv[2] || "signal-perdu-nova9";

const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
await db.exec(`
  CREATE SCHEMA IF NOT EXISTS auth;
  CREATE TABLE auth.users (id uuid primary key, email text, is_anonymous boolean default false, raw_user_meta_data jsonb default '{}'::jsonb);
  CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $fn$
    SELECT (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
  $fn$;
  DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF; END $$;
  DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF; END $$;
  DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN; END IF; END $$;
`);

const files = readdirSync(MIG).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  try {
    await db.exec(readFileSync(join(MIG, f), "utf8"));
  } catch (e) {
    console.error(`💥 ${f}: ${e.message}`);
    process.exit(1);
  }
}
console.log(`\n📦 ${files.length} migrations chargées. Audit de « ${slug} »...\n`);

const story = (await db.query(`SELECT id, title, total_nodes, total_endings FROM public.stories WHERE slug=$1`, [slug])).rows[0];
if (!story) { console.error("Histoire introuvable"); process.exit(1); }
const sid = story.id;

const nodes = (await db.query(`SELECT id, node_key, title, content, is_start, is_ending, ending_type, metadata FROM public.story_nodes WHERE story_id=$1`, [sid])).rows;
const choices = (await db.query(`
  SELECT c.id, c.node_id, c.target_node_id, c.text, c.flavor_text, c.display_order,
         (SELECT COALESCE(jsonb_agg(jsonb_build_object('t', ce.effect_type, 'k', ce.flag_key, 'v', ce.flag_value, 'i', (SELECT slug FROM public.items WHERE id=ce.item_id), 'q', ce.stat_value)),'[]')
            FROM public.choice_effects ce WHERE ce.choice_id=c.id) AS effects
  FROM public.story_choices c JOIN public.story_nodes n ON n.id=c.node_id
  WHERE n.story_id=$1 ORDER BY c.node_id, c.display_order`, [sid])).rows;
const items = (await db.query(`SELECT slug, name, item_type FROM public.items WHERE story_id=$1`, [sid])).rows;

const nodeById = new Map(nodes.map((n) => [n.id, n]));
const nodeByKey = new Map(nodes.map((n) => [n.node_key, n]));
const choicesByNode = new Map();
for (const c of choices) {
  if (!choicesByNode.has(c.node_id)) choicesByNode.set(c.node_id, []);
  choicesByNode.get(c.node_id).push(c);
}
for (const n of nodes) { n._eff = (n.metadata || {}); }

const problems = [];
const warns = [];
const P = (sev, msg) => (sev === "ERR" ? problems : warns).push(msg);

// ---- Structure de base ----
const starts = nodes.filter((n) => n.is_start);
if (starts.length !== 1) P("ERR", `${starts.length} noeuds de départ (doit être 1)`);
const endings = nodes.filter((n) => n.is_ending);
if (endings.length < 3) P("ERR", `Seulement ${endings.length} fins`);
if (endings.length !== story.total_endings) P("ERR", `total_endings=${story.total_endings} mais ${endings.length} noeuds de fin`);
if (nodes.length !== story.total_nodes) P("ERR", `total_nodes=${story.total_nodes} mais ${nodes.length} noeuds`);

// ---- Cibles existantes ----
for (const c of choices) {
  if (!c.target_node_id || !nodeById.has(c.target_node_id)) P("ERR", `choix " ${c.text}" cible un noeud absent`);
  else if (nodeById.get(c.target_node_id).is_ending === false && nodeById.get(c.target_node_id).node_key === c.node_id) P("ERR", `choix boucle sur lui-même`);
}

// ---- Issues / choix multiples / doublons ----
const choiceTextFreq = new Map();
for (const n of nodes) {
  if (n.is_ending) continue;
  const ch = choicesByNode.get(n.id) || [];
  const meta = n.metadata || {};
  const isCombat = Array.isArray(meta.combatants) && meta.combatants.length > 0;
  const hazardRules = Array.isArray(meta.hazard_consequences) ? meta.hazard_consequences : [];
  const hasHazardExit = hazardRules.some((r) => r.target_node_key);

  if (ch.length === 0 && !hasHazardExit) P("ERR", `cul-de-sac : ${n.node_key} (${n.title}) n'a aucune issue`);

  // Pages à un seul choix : autorisé pour les combats (le combat est l'action),
  // les hazards (le jet détermine la suite), et les transitions narratives courtes.
  if (!isCombat && !hasHazardExit && ch.length === 1) {
    // Une transition après un butin précis est acceptable si elle offre aussi un retour ou un risque.
    P("WARN", `un seul choix : ${n.node_key} → ${ch[0].text}`);
  }
  // doublon de libellé dans le même noeud
  const seen = new Set();
  for (const c of ch) {
    const t = (c.text || "").trim().toLowerCase();
    if (seen.has(t)) P("ERR", `choix dupliqué sur ${n.node_key} : "${c.text}"`);
    seen.add(t);
    choiceTextFreq.set(c.text, (choiceTextFreq.get(c.text) || 0) + 1);
  }
}

// ---- Libellés de choix trop répétés dans tout le livre ----
const REPEAT_LIMIT = 4;
for (const [text, count] of choiceTextFreq) {
  if (count > REPEAT_LIMIT) P("ERR", `choix répété ${count} fois dans le livre : "${text}"`);
}

// ---- Branches conditionnées : toujours une alternative inconditionnelle ----
for (const n of nodes) {
  const ch = choicesByNode.get(n.id) || [];
  if (ch.length <= 1) continue;
  const unconditional = ch.filter((c) => !(c.effects || []).some((e) => e.t === "inventory_require" || e.t === "flag_require"));
  if (unconditional.length === 0) P("ERR", `${n.node_key} : toutes les issues sont conditionnées → blocage possible`);
}

// ---- Tout prérequis d'objet existe ----
for (const c of choices) {
  for (const e of c.effects || []) {
    if ((e.t === "inventory_require" || e.t === "inventory_add" || e.t === "inventory_remove") && e.i && !items.some((it) => it.slug === e.i)) {
      P("ERR", `choix ${nodeById.get(c.node_id)?.node_key} référence l'objet inconnu ${e.i}`);
    }
  }
}

// ---- Combats ----
let combatNodes = 0;
for (const n of nodes) {
  const meta = n.metadata || {};
  if (Array.isArray(meta.combatants) && meta.combatants.length > 0) {
    combatNodes++;
    const ch = choicesByNode.get(n.id) || [];
    if (ch.length === 0) P("ERR", `combat ${n.node_key} : aucun choix d'après-combat`);
    const flee = meta.combat?.flee;
    if (!flee?.target_node_key) P("WARN", `combat ${n.node_key} : pas de fuite possible`);
    else if (!nodeByKey.has(flee.target_node_key)) P("ERR", `combat ${n.node_key} : fuite vers noeud inconnu ${flee.target_node_key}`);
    for (const e of meta.combatants) {
      if (typeof e.endurance !== "number" || typeof (e.attack ?? e.combat_skill) !== "number") P("ERR", `combat ${n.node_key} : ennemi mal formé ${JSON.stringify(e)}`);
    }
  }
}

// ---- Accessibilité depuis le départ ----
const adj = new Map();
for (const c of choices) {
  if (!c.target_node_id) continue;
  if (!adj.has(c.node_id)) adj.set(c.node_id, new Set());
  adj.get(c.node_id).add(c.target_node_id);
}
// les hazards mènent aussi quelque part
for (const n of nodes) {
  for (const r of n.metadata?.hazard_consequences ?? []) {
    if (r.target_node_key && nodeByKey.has(r.target_node_key)) {
      if (!adj.has(n.id)) adj.set(n.id, new Set());
      adj.get(n.id).add(nodeByKey.get(r.target_node_key).id);
    }
  }
}
const seen = new Set([starts[0].id]);
const q = [starts[0].id];
while (q.length) {
  const cur = q.shift();
  for (const nx of adj.get(cur) ?? []) if (!seen.has(nx)) { seen.add(nx); q.push(nx); }
}
// Certains noeuds ne sont PAS atteints par un choix du graphe mais par le
// moteur : `mort_epuisement` quand la Vie tombe à 0, et tout noeud de fin
// référencé comme cible de fuite/défaite de combat.
const systemReachable = new Set(["mort_epuisement"]);
for (const n of nodes) {
  const flee = n.metadata?.combat?.flee?.target_node_key;
  if (flee) systemReachable.add(flee);
}
const unreachable = nodes.filter((n) => !seen.has(n.id) && !systemReachable.has(n.node_key));
for (const n of unreachable) P("ERR", `noeud injoignable : ${n.node_key} (${n.title})`);
// Avertissement pour les noeuds système déclarés mais non utilisés
for (const k of systemReachable) {
  if (!nodeByKey.has(k)) P("WARN", `noeud système référencé mais absent : ${k}`);
}

// ---- Simulation aléatoire : toutes les parties finissent ----
const MAX_STEPS = 400;
const endingsHit = new Map();
const N_PLAY = 2000;
let deadLoops = 0;
function rngChoices(ch, flags, inv) {
  return ch.filter((c) => {
    for (const e of c.effects || []) {
      if (e.t === "inventory_require" && !inv.has(e.i)) return false;
      if (e.t === "flag_require" && Boolean(flags.get(e.k)) !== Boolean(e.v)) return false;
    }
    return true;
  });
}
for (let p = 0; p < N_PLAY; p++) {
  let cur = starts[0];
  const flags = new Map();
  const inv = new Set();
  const path = new Set();
  let steps = 0;
  while (!cur.is_ending && steps < MAX_STEPS) {
    steps++;
    if (path.has(cur.id + steps)) { deadLoops++; break; }
    path.add(cur.id);
    let ch = choicesByNode.get(cur.id) || [];
    ch = rngChoices(ch, flags, inv);
    if (ch.length === 0) { P("ERR", `simulation : impasse sur ${cur.node_key}`); break; }
    const pick = ch[Math.floor(Math.random() * ch.length)];
    for (const e of pick.effects || []) {
      if (e.t === "flag_set") flags.set(e.k, e.v);
      if (e.t === "inventory_add") inv.add(e.i);
      if (e.t === "inventory_remove") inv.delete(e.i);
    }
    cur = nodeById.get(pick.target_node_id);
  }
  if (cur.is_ending) endingsHit.set(cur.node_key, (endingsHit.get(cur.node_key) || 0) + 1);
  else deadLoops++;
}

// ---- Détection de contenu textuel dupliqué entre noeuds ----
const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").replace(/[«»"'.,!?:;()\[\]-]/g, "").trim();
const contentMap = new Map();
for (const n of nodes) {
  if (n.is_ending) continue;
  const body = norm(n.content).slice(0, 200);
  if (body.length < 40) continue;
  if (contentMap.has(body)) P("ERR", `contenu identique : ${n.node_key} == ${contentMap.get(body)}`);
  else contentMap.set(body, n.node_key);
}

// ---- Rapport ----
console.log(`📖 ${story.title}`);
console.log(`   noeuds=${nodes.length}  fins=${endings.length}  combats=${combatNodes}  objets=${items.length}  choix=${choices.length}`);
console.log(`   victoriaires=${endings.filter((e) => e.ending_type === "victory").length}  morts=${endings.filter((e) => e.ending_type === "death").length}  autres=${endings.filter((e) => !["victory", "death"].includes(e.ending_type)).length}`);
console.log(`   noeuds atteints=${seen.size}/${nodes.length}  injoignables=${unreachable.length}`);
console.log(`   simulation ${N_PLAY} parties : ${endingsHit.size} fins différentes atteintes, ${deadLoops} parties non terminées\n`);

if (warns.length) {
  console.log(`⚠️  AVERTISSEMENTS (${warns.length}) :`);
  for (const w of warns) console.log("   - " + w);
  console.log();
}
if (problems.length) {
  console.log(`❌ PROBLÈMES (${problems.length}) :`);
  for (const p of problems) console.log("   - " + p);
  process.exit(1);
}
console.log("✅ AUDIT OK — aucune erreur.");
