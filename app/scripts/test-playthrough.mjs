// ============================================================
// HeroBook — Test de PARTIES COMPLÈTES « Les Maîtres des Ténèbres »
// ------------------------------------------------------------
// Rejoue des milliers de parties de bout en bout sur le graphe réel
// (toutes migrations appliquées), en appliquant les mêmes règles que
// les Edge Functions : combat (Table des coups portés + état persistant),
// jets de Hasard, repas, blessures d'arrivée, Guérison, conditions de
// choix, morts à ENDURANCE 0.
//
// Objectif : garantir qu'aucune partie ne se termine « à tort »
// (blocage, impasse, fin de partie injustifiée) et que la victoire
// reste atteignable — le symptôme d'origine signalé par le joueur.
//
//   node scripts/test-playthrough.mjs
// ============================================================

import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  applyLoss,
  resolveCombatRound,
} from "../supabase/functions/_shared/combat-table.ts";

const MIG = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "supabase",
  "migrations",
);

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ------------------------------------------------------------
// Chargement du graphe réel
// ------------------------------------------------------------
const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
await db.exec(`
  CREATE SCHEMA IF NOT EXISTS auth;
  CREATE TABLE auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
  CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $fn$
    SELECT (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid $fn$;
  CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN;
`);
for (const f of readdirSync(MIG).filter((x) => x.endsWith(".sql")).sort()) {
  if (f.startsWith("004")) {
    await db.exec(`
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
    `);
  }
  await db.exec(readFileSync(join(MIG, f), "utf8"));
}

const storyId = (
  await db.query(
    `SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres'`,
  )
).rows[0].id;

const nodeRows = (
  await db.query(
    `SELECT id, node_key, is_ending, ending_type, metadata
     FROM public.story_nodes WHERE story_id = $1`,
    [storyId],
  )
).rows;
const nodes = new Map(nodeRows.map((n) => [n.node_key, n]));
const nodeById = new Map(nodeRows.map((n) => [n.id, n]));

const choiceRows = (
  await db.query(
    `SELECT c.id, sn.node_key AS src, tn.node_key AS tgt, c.text, c.display_order
     FROM public.story_choices c
     JOIN public.story_nodes sn ON sn.id = c.node_id
     LEFT JOIN public.story_nodes tn ON tn.id = c.target_node_id
     WHERE sn.story_id = $1 ORDER BY sn.node_key, c.display_order`,
    [storyId],
  )
).rows;

const effectRows = (
  await db.query(
    `SELECT ce.choice_id, ce.effect_type, ce.stat_key, ce.stat_value,
            i.slug AS item_slug, ce.flag_key, ce.flag_value
     FROM public.choice_effects ce
     JOIN public.story_choices c ON c.id = ce.choice_id
     JOIN public.story_nodes n ON n.id = c.node_id
     LEFT JOIN public.items i ON i.id = ce.item_id
     WHERE n.story_id = $1`,
    [storyId],
  )
).rows;

const choicesBySrc = new Map();
for (const c of choiceRows) {
  if (!choicesBySrc.has(c.src)) choicesBySrc.set(c.src, []);
  choicesBySrc.get(c.src).push(c);
}
const effectsByChoice = new Map();
for (const e of effectRows) {
  if (!effectsByChoice.has(e.choice_id)) effectsByChoice.set(e.choice_id, []);
  effectsByChoice.get(e.choice_id).push(e);
}

const DISCIPLINES = [
  "camouflage", "chasse", "sixieme_sens", "orientation", "guerison",
  "maitrise_armes", "bouclier_psychique", "puissance_psychique",
  "communication_animale", "maitrise_psychique_matiere",
];

const normFlag = (s) =>
  String(s).toLowerCase()
    .replace(/^discipline_/, "")
    .replace("sixième", "sixieme")
    .replace("six_cieme", "sixieme")
    .replace(/[^a-z]/g, "");

const START_KEY = "section_001";

/**
 * Rejoue une partie complète en appliquant les règles du moteur.
 * `strategy` choisit parmi les choix disponibles.
 */
function playthrough({ rng, strategy = "random", maxSteps = 1500 }) {
  const d10 = () => Math.floor(rng() * 10);
  let skill = 10 + d10();
  const hpMax = 20 + d10();
  let hp = hpMax;

  // 5 disciplines Kaï, comme au début du livre
  const pool = [...DISCIPLINES];
  const picks = [];
  for (let i = 0; i < 5; i++) {
    picks.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  const flags = new Map(picks.map((d) => [normFlag(d), true]));
  const inventory = new Map([["repas", 2], ["couronnes", 12]]);

  let key = START_KEY;
  const visited = [];
  let steps = 0;

  const hasFlag = (k) => Boolean(flags.get(normFlag(k)));

  while (steps++ < maxSteps) {
    const node = nodes.get(key);
    if (!node) return { outcome: "missing_node", key, steps, visited };
    visited.push(key);

    const md = node.metadata ?? {};

    // --- Fin de partie ---
    if (node.is_ending) {
      return {
        outcome: node.ending_type === "victory" ? "victory" : "death",
        key,
        steps,
        visited,
        hp,
      };
    }

    // --- Règles d'ARRIVÉE (_shared/arrival.ts) ---
    const combatants = md.combatants ?? [];
    const hasCombat = combatants.length > 0;

    // Guérison : +1 END par section sans combat
    if (
      md.kind === "book_section" && !hasCombat && hasFlag("guerison") &&
      hp > 0 && hp < hpMax
    ) {
      hp += 1;
    }

    const oa = md.on_arrive ?? null;
    if (oa) {
      for (const g of oa.add_items ?? []) {
        inventory.set(g.slug, (inventory.get(g.slug) ?? 0) + (g.qty ?? 1));
      }
      if (oa.meal_required) {
        if ((inventory.get("repas") ?? 0) > 0) {
          inventory.set("repas", inventory.get("repas") - 1);
        } else if (!hasFlag("chasse")) {
          hp = Math.max(0, hp - 3);
        }
      }
      if (typeof oa.hp_delta === "number") {
        hp = Math.min(hpMax, Math.max(0, hp + oa.hp_delta));
      }
      if (typeof oa.skill_delta === "number") {
        skill = Math.max(1, skill + oa.skill_delta);
      }
      if (oa.hp_to_max) hp = hpMax;
      for (const slug of oa.remove_items ?? []) inventory.delete(slug);
      if (oa.lose_backpack) {
        for (const s of ["repas", "torches", "briquet-amadou", "laumspur", "sac-a-dos"]) {
          inventory.delete(s);
        }
      }
    }
    if (hp <= 0) return { outcome: "death", key: "mort_epuisement", steps, visited, hp };

    // --- COMBAT (resolve-combat-round, stateful) ---
    if (hasCombat) {
      const state = combatants.map((e) => ({ ...e }));
      let idx = 0;
      let round = 0;
      const hpAtStart = hp;
      const fleeMeta = md.combat?.flee;
      let fled = false;

      while (true) {
        while (idx < state.length && state[idx].endurance <= 0) idx++;
        if (idx >= state.length) break; // tous vaincus
        if (hp <= 0) break;
        if (round > 800) {
          return { outcome: "combat_infinite", key, steps, visited };
        }

        // Fuite : seulement si le livre l'autorise, et parfois
        if (
          fleeMeta?.target_node_key && strategy === "flee_when_possible" &&
          round >= (fleeMeta.min_rounds ?? 0) && round > 0
        ) {
          const q0 = skill - state[idx].combat_skill;
          const { playerLoss } = resolveCombatRound(q0, Math.floor(rng() * 10));
          hp = applyLoss(hp, playerLoss);
          fled = true;
          break;
        }

        round++;
        const enemy = state[idx];
        let effSkill = skill;
        if (hasFlag("puissance_psychique") && !enemy.mindblast_immune) effSkill += 2;
        if (hasFlag("maitrise_armes")) effSkill += 2;
        if (enemy.player_skill_penalty) effSkill -= enemy.player_skill_penalty;
        if (round === 1 && enemy.surprise_bonus_round_1) {
          effSkill += enemy.surprise_bonus_round_1;
        }
        if (enemy.psychic_assault && !hasFlag("bouclier_psychique")) {
          if (round >= (enemy.psychic_assault_from_round ?? 1)) effSkill -= 2;
        }
        if (enemy.no_torch_penalty && !(inventory.get("torches") > 0)) {
          effSkill -= enemy.no_torch_penalty;
        }

        const { enemyLoss, playerLoss } = resolveCombatRound(
          effSkill - enemy.combat_skill,
          Math.floor(rng() * 10),
        );
        enemy.endurance = applyLoss(enemy.endurance, enemyLoss);
        hp = applyLoss(hp, playerLoss);
      }

      if (hp <= 0) {
        return { outcome: "death", key: "mort_epuisement", steps, visited, hp };
      }

      if (fled) {
        key = fleeMeta.target_node_key;
        continue;
      }

      // Victoire : flags de fin de combat
      const vr = md.combat?.victory_rules;
      if (vr?.flag_key) {
        flags.set(normFlag(vr.flag_key), round <= (vr.max_rounds ?? 0));
      }
      const flawless = md.combat?.flag_flawless;
      if (flawless) flags.set(normFlag(flawless), hp >= hpAtStart);
    }

    // --- JET DE HASARD (game-setup-action) ---
    const hz = md.hazard_consequences;
    if (Array.isArray(hz) && hz.length > 0) {
      const roll = Math.floor(rng() * 10);
      const rule = hz.find(
        (r) => roll >= (r.min ?? 0) && roll <= (r.max ?? 9),
      );
      if (!rule) {
        return { outcome: "hazard_gap", key, steps, visited, roll };
      }
      if (rule.hp_delta) hp = Math.min(hpMax, Math.max(0, hp + rule.hp_delta));
      if (rule.lose_backpack) {
        for (const s of ["repas", "torches", "briquet-amadou", "laumspur", "sac-a-dos"]) {
          inventory.delete(s);
        }
      }
      if (hp <= 0) {
        return { outcome: "death", key: "mort_epuisement", steps, visited, hp };
      }
      if (rule.target_node_key) {
        key = rule.target_node_key;
        continue;
      }
    }

    // --- CHOIX (make-choice) ---
    const all = choicesBySrc.get(key) ?? [];
    const available = all.filter((c) => {
      for (const e of effectsByChoice.get(c.id) ?? []) {
        if (e.effect_type === "flag_require") {
          const expected = e.flag_value === null ? true : e.flag_value;
          if (Boolean(hasFlag(e.flag_key)) !== Boolean(expected)) return false;
        }
        if (e.effect_type === "inventory_require") {
          const need = e.stat_value ?? 1;
          if ((inventory.get(e.item_slug) ?? 0) < need) return false;
        }
      }
      return true;
    });

    if (available.length === 0) {
      return {
        outcome: all.length === 0 ? "dead_end" : "blocked",
        key,
        steps,
        visited,
      };
    }

    const chosen = available[Math.floor(rng() * available.length)];
    for (const e of effectsByChoice.get(chosen.id) ?? []) {
      if (e.effect_type === "flag_set") {
        flags.set(normFlag(e.flag_key), e.flag_value === null ? true : e.flag_value);
      }
      if (e.effect_type === "inventory_add") {
        const qty = e.stat_value ?? 1;
        const cur = inventory.get(e.item_slug) ?? 0;
        inventory.set(
          e.item_slug,
          e.item_slug === "couronnes" ? Math.min(50, cur + qty) : cur + qty,
        );
      }
      if (e.effect_type === "inventory_remove") {
        const qty = e.stat_value ?? 1;
        inventory.set(e.item_slug, Math.max(0, (inventory.get(e.item_slug) ?? 0) - qty));
      }
      if (e.effect_type === "stat_modifier" && e.stat_key === "hp_current") {
        hp = Math.min(hpMax, Math.max(0, hp + (e.stat_value ?? 0)));
      }
    }
    if (hp <= 0) {
      return { outcome: "death", key: "mort_epuisement", steps, visited, hp };
    }
    key = chosen.tgt;
  }
  return { outcome: "loop", key, steps, visited };
}

console.log("\n=== 1. Aucune partie ne se termine « à tort » ===\n");

const N = 6000;
const tally = {};
const badRuns = [];
const endingCounts = {};
let victories = 0;
let maxSteps = 0;

for (let i = 0; i < N; i++) {
  const out = playthrough({ rng: makeRng(i * 2654435761 + 12345) });
  tally[out.outcome] = (tally[out.outcome] ?? 0) + 1;
  maxSteps = Math.max(maxSteps, out.steps);
  if (out.outcome === "victory") victories++;
  if (out.outcome === "victory" || out.outcome === "death") {
    endingCounts[out.key] = (endingCounts[out.key] ?? 0) + 1;
  } else if (badRuns.length < 8) {
    badRuns.push(out);
  }
}

const anomalies = ["dead_end", "blocked", "loop", "missing_node", "hazard_gap", "combat_infinite"]
  .reduce((n, k) => n + (tally[k] ?? 0), 0);

check(
  `Aucune anomalie sur ${N} parties (blocage / impasse / boucle / trou de hasard)`,
  anomalies === 0,
  anomalies
    ? JSON.stringify(badRuns.map((b) => `${b.outcome}@${b.key}`))
    : Object.entries(tally).map(([k, v]) => `${k}=${v}`).join(" "),
);

check(
  "Toute partie se termine par une VRAIE fin du livre (victoire ou mort)",
  (tally.victory ?? 0) + (tally.death ?? 0) === N,
);

const victoryRate = victories / N;
check(
  "La victoire (§350) est atteignable en jeu aléatoire",
  victories > 0,
  `${victories} victoires (${(victoryRate * 100).toFixed(2)} %)`,
);

check(
  "NON-RÉGRESSION : la mort au combat n'est plus l'issue dominante",
  (endingCounts["mort_epuisement"] ?? 0) / N < 0.5,
  `mort_epuisement = ${(((endingCounts["mort_epuisement"] ?? 0) / N) * 100).toFixed(1)} %`,
);

// Les fins atteintes doivent toutes être des fins déclarées du livre.
{
  const declaredEndings = new Set(
    nodeRows.filter((n) => n.is_ending).map((n) => n.node_key),
  );
  const reached = Object.keys(endingCounts);
  check(
    "Toutes les fins atteintes sont des fins déclarées",
    reached.every((k) => declaredEndings.has(k)),
    `${reached.length} fins distinctes atteintes`,
  );
}

console.log("\n=== 2. Robustesse : stratégies de jeu variées ===\n");

for (const strategy of ["random", "flee_when_possible"]) {
  const t = {};
  for (let i = 0; i < 1500; i++) {
    const out = playthrough({ rng: makeRng(i * 40503 + 7), strategy });
    t[out.outcome] = (t[out.outcome] ?? 0) + 1;
  }
  const bad = ["dead_end", "blocked", "loop", "missing_node", "hazard_gap", "combat_infinite"]
    .reduce((n, k) => n + (t[k] ?? 0), 0);
  check(
    `Stratégie « ${strategy} » : aucune anomalie`,
    bad === 0,
    Object.entries(t).map(([k, v]) => `${k}=${v}`).join(" "),
  );
}

console.log("\n=== 3. Robustesse : chaque discipline, seule et en groupe ===\n");

// Un joueur qui ne maîtrise QUE certaines disciplines ne doit jamais
// se retrouver coincé (c'était le bug des « verrous inversés »).
function playWithFixedDisciplines(disciplines, seed) {
  const rng = makeRng(seed);
  const d10 = () => Math.floor(rng() * 10);
  let hp = 20 + d10();
  const hpMax = hp;
  let skill = 10 + d10();
  const flags = new Map(disciplines.map((d) => [normFlag(d), true]));
  const inventory = new Map([["repas", 2], ["couronnes", 12]]);
  const hasFlag = (k) => Boolean(flags.get(normFlag(k)));
  let key = START_KEY;
  let steps = 0;

  while (steps++ < 1500) {
    const node = nodes.get(key);
    if (!node) return { outcome: "missing_node", key };
    if (node.is_ending) return { outcome: "ending", key };
    const md = node.metadata ?? {};

    if (md.on_arrive?.meal_required) {
      if ((inventory.get("repas") ?? 0) > 0) {
        inventory.set("repas", inventory.get("repas") - 1);
      }
    }
    // Combat : on suppose la victoire (on teste la topologie, pas la létalité)
    const hz = md.hazard_consequences;
    if (Array.isArray(hz) && hz.length > 0) {
      const roll = Math.floor(rng() * 10);
      const rule = hz.find((r) => roll >= (r.min ?? 0) && roll <= (r.max ?? 9));
      if (!rule) return { outcome: "hazard_gap", key };
      if (rule.target_node_key) {
        key = rule.target_node_key;
        continue;
      }
    }
    const all = choicesBySrc.get(key) ?? [];
    const available = all.filter((c) => {
      for (const e of effectsByChoice.get(c.id) ?? []) {
        if (e.effect_type === "flag_require") {
          const expected = e.flag_value === null ? true : e.flag_value;
          if (Boolean(hasFlag(e.flag_key)) !== Boolean(expected)) return false;
        }
        if (e.effect_type === "inventory_require") {
          if ((inventory.get(e.item_slug) ?? 0) < (e.stat_value ?? 1)) return false;
        }
      }
      return true;
    });
    if (available.length === 0) {
      return { outcome: all.length === 0 ? "dead_end" : "blocked", key };
    }
    const chosen = available[Math.floor(rng() * available.length)];
    for (const e of effectsByChoice.get(chosen.id) ?? []) {
      if (e.effect_type === "flag_set") {
        flags.set(normFlag(e.flag_key), e.flag_value === null ? true : e.flag_value);
      }
      if (e.effect_type === "inventory_add") {
        inventory.set(
          e.item_slug,
          (inventory.get(e.item_slug) ?? 0) + (e.stat_value ?? 1),
        );
      }
    }
    key = chosen.tgt;
    void skill; void hp; void hpMax;
  }
  return { outcome: "loop", key };
}

// Cas extrême : AUCUNE discipline (le pire scénario de blocage).
{
  const bad = [];
  for (let i = 0; i < 800; i++) {
    const r = playWithFixedDisciplines([], i * 131 + 3);
    if (r.outcome !== "ending") bad.push(`${r.outcome}@${r.key}`);
  }
  check(
    "Sans AUCUNE discipline : jamais de blocage",
    bad.length === 0,
    bad.length ? [...new Set(bad)].slice(0, 5).join(", ") : "800 parties OK",
  );
}

// Chaque discipline prise seule.
{
  const failures = [];
  for (const d of DISCIPLINES) {
    for (let i = 0; i < 200; i++) {
      const r = playWithFixedDisciplines([d], i * 977 + d.length);
      if (r.outcome !== "ending") failures.push(`${d}:${r.outcome}@${r.key}`);
    }
  }
  check(
    "Chaque discipline prise seule : jamais de blocage",
    failures.length === 0,
    failures.length ? [...new Set(failures)].slice(0, 5).join(", ") : "10 disciplines OK",
  );
}

// Toutes les disciplines à la fois (l'autre extrême).
{
  const bad = [];
  for (let i = 0; i < 800; i++) {
    const r = playWithFixedDisciplines(DISCIPLINES, i * 7919 + 11);
    if (r.outcome !== "ending") bad.push(`${r.outcome}@${r.key}`);
  }
  check(
    "Avec TOUTES les disciplines : jamais de blocage",
    bad.length === 0,
    bad.length ? [...new Set(bad)].slice(0, 5).join(", ") : "800 parties OK",
  );
}

console.log("\n=== 4. Accessibilité du graphe ===\n");

// BFS depuis le début en ignorant les conditions : toute section doit
// être joignable (sauf le §251, absent du livre papier lui aussi).
{
  const seen = new Set([START_KEY]);
  const queue = [START_KEY];
  while (queue.length) {
    const k = queue.shift();
    const node = nodes.get(k);
    if (!node) continue;
    const md = node.metadata ?? {};
    const targets = [
      ...(choicesBySrc.get(k) ?? []).map((c) => c.tgt),
      ...((md.hazard_consequences ?? []).map((h) => h.target_node_key)),
      md.combat?.flee?.target_node_key,
    ].filter(Boolean);
    for (const t of targets) {
      if (!seen.has(t)) {
        seen.add(t);
        queue.push(t);
      }
    }
  }
  const sections = nodeRows
    .filter((n) => n.metadata?.kind === "book_section")
    .map((n) => n.node_key);
  const unreachable = sections.filter((s) => !seen.has(s));
  check(
    "Toutes les sections sont joignables (sauf §251, absent du livre papier)",
    unreachable.length === 1 && unreachable[0] === "section_251",
    unreachable.length ? unreachable.join(", ") : "aucune injoignable",
  );
}

// Toute section non-fin possède au moins une sortie.
{
  const stuck = nodeRows
    .filter((n) => !n.is_ending)
    .filter((n) => {
      const md = n.metadata ?? {};
      const hasChoice = (choicesBySrc.get(n.node_key) ?? []).length > 0;
      const hasHazard = (md.hazard_consequences ?? []).length > 0;
      return !hasChoice && !hasHazard;
    })
    .map((n) => n.node_key);
  check(
    "Aucune section non-fin sans issue",
    stuck.length === 0,
    stuck.length ? stuck.join(", ") : `${nodeRows.length} nœuds contrôlés`,
  );
}

// Les plages de hasard couvrent bien 0-9 sans trou ni recouvrement.
{
  const broken = [];
  for (const n of nodeRows) {
    const hz = n.metadata?.hazard_consequences;
    if (!Array.isArray(hz) || hz.length === 0) continue;
    const covered = new Array(10).fill(0);
    for (const r of hz) {
      for (let v = r.min ?? 0; v <= (r.max ?? 9); v++) covered[v]++;
    }
    if (covered.some((c) => c !== 1)) broken.push(n.node_key);
  }
  check(
    "Chaque table de Hasard couvre exactement les chiffres 0-9",
    broken.length === 0,
    broken.length ? broken.join(", ") : "21 sections vérifiées",
  );
}

await db.close();

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${failed.length === 0 ? "🎉" : "💥"} ${results.length - failed.length}/${results.length} tests de parties OK`,
);
if (failed.length) {
  for (const f of failed) console.log(`   ❌ ${f.name}`);
  process.exit(1);
}
