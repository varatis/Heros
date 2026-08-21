// ============================================================
// HeroBook — Tests du MOTEUR de combat Loup Solitaire
// ------------------------------------------------------------
// Ces tests couvrent la zone que `test-migrations.mjs` ne voyait pas :
// la logique de résolution d'un assaut, la Table des coups portés du
// livre, la persistance de l'ENDURANCE des ennemis, et la jouabilité
// réelle des 38 combats de l'aventure.
//
// C'est exactement le trou de couverture qui laissait passer le bug
// « aucun combat n'est gagnable ».
//
//   node scripts/test-combat-engine.mjs
// ============================================================

import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  applyLoss,
  combatTableAsMatrix,
  INSTANT_KILL,
  quotientBandIndex,
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

// Générateur déterministe : tests reproductibles.
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const d10 = (rng) => Math.floor(rng() * 10);

console.log("\n=== 1. Table des coups portés — fidélité au livre ===\n");

// L'exemple canonique des règles (p. 20-21 du PDF) : c'est LA référence
// vérifiable noir sur blanc dans le livre.
{
  const r = resolveCombatRound(-3, 6);
  check(
    "Exemple du livre : Quotient -3, chiffre 6 → LS -3 / E -6",
    r.playerLoss === 3 && r.enemyLoss === 6,
    `LS=${r.playerLoss} E=${r.enemyLoss}`,
  );
}

// Exemple de la documentation officielle (Kai Combat) : ratio 0, jet 6.
{
  const r = resolveCombatRound(0, 6);
  check(
    "Quotient 0, chiffre 6 → LS -2 / E -8",
    r.playerLoss === 2 && r.enemyLoss === 8,
    `LS=${r.playerLoss} E=${r.enemyLoss}`,
  );
}

// Structure en bandes (13 colonnes) conforme à la table imprimée.
check(
  "Bandes de Quotient : -3 et -4 partagent une colonne",
  quotientBandIndex(-3) === quotientBandIndex(-4),
);
check(
  "Bandes de Quotient : +1 et +2 partagent une colonne",
  quotientBandIndex(1) === quotientBandIndex(2),
);
check(
  "Bande « 0 » isolée (ni avec -1, ni avec +1)",
  quotientBandIndex(0) !== quotientBandIndex(-1) &&
    quotientBandIndex(0) !== quotientBandIndex(1),
);
check(
  "Bande « +11 ou supérieur » saturante",
  quotientBandIndex(11) === quotientBandIndex(250),
);
check(
  "Bande « -11 ou inférieur » saturante",
  quotientBandIndex(-11) === quotientBandIndex(-250),
);

// Règle du livre : le chiffre 0 est le « coup critique » du joueur.
{
  let ok = true;
  for (let q = -20; q <= 20; q++) {
    if (resolveCombatRound(q, 0).playerLoss !== 0) ok = false;
  }
  check("Chiffre 0 → le Loup Solitaire ne perd jamais d'ENDURANCE", ok);
}

// Le « T » (tué sur le coup) existe des deux côtés de la table.
{
  const lsKilled = resolveCombatRound(-15, 1).playerLoss === INSTANT_KILL;
  const enemyKilled = resolveCombatRound(15, 8).enemyLoss === INSTANT_KILL;
  check("« T » (tué sur le coup) : le joueur peut mourir d'un coup", lsKilled);
  check("« T » (tué sur le coup) : l'ennemi peut mourir d'un coup", enemyKilled);
}

// Monotonie : plus le Quotient est favorable, plus l'ennemi souffre.
{
  const sample = [-20, -10, -8, -6, -4, -2, 0, 1, 3, 5, 7, 9, 20];
  let mono = true;
  for (const roll of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let prevE = -1;
    let prevLS = Infinity;
    for (const q of sample) {
      const { enemyLoss, playerLoss } = resolveCombatRound(q, roll);
      const e = enemyLoss === INSTANT_KILL ? 9999 : enemyLoss;
      const l = playerLoss === INSTANT_KILL ? 9999 : playerLoss;
      if (e < prevE) mono = false;
      if (l > prevLS && prevLS !== 9999) mono = false;
      prevE = e;
      prevLS = l;
    }
  }
  check("Monotonie : E croissant et LS décroissant avec le Quotient", mono);
}

// Non-régression explicite du placeholder MVP supprimé.
{
  let allEnemyLossZero = true;
  for (let q = -10; q <= 10; q++) {
    for (let r = 0; r < 10; r++) {
      const { enemyLoss } = resolveCombatRound(q, r);
      if (enemyLoss !== 0) allEnemyLossZero = false;
    }
  }
  check(
    "NON-RÉGRESSION : la table n'est plus le placeholder « enemy: 0 »",
    !allEnemyLossZero,
  );

  let playerFloorAlwaysTwo = true;
  for (let q = -10; q <= 10; q++) {
    for (let r = 0; r < 10; r++) {
      const { playerLoss } = resolveCombatRound(q, r);
      if (playerLoss !== 2 && playerLoss !== INSTANT_KILL) {
        playerFloorAlwaysTwo = false;
      }
    }
  }
  check(
    "NON-RÉGRESSION : le joueur ne perd plus « toujours 2 END »",
    !playerFloorAlwaysTwo,
  );
}

// applyLoss : « T » vide l'ENDURANCE, jamais de valeur négative.
check("applyLoss : « K » réduit l'ENDURANCE à 0", applyLoss(30, INSTANT_KILL) === 0);
check("applyLoss : jamais de valeur négative", applyLoss(3, 10) === 0);
check("applyLoss : soustraction normale", applyLoss(20, 6) === 14);

// La table sérialisée expose bien 10 lignes × 13 colonnes.
{
  const m = combatTableAsMatrix();
  const rows = Object.keys(m);
  check(
    "Table sérialisée : 10 chiffres × 13 bandes",
    rows.length === 10 && rows.every((r) => m[r].length === 13),
  );
}

console.log("\n=== 2. Boucle de combat — l'ENDURANCE de l'ennemi décroît ===\n");

/**
 * Simulation FIDÈLE de la boucle serveur `resolve-combat-round` v3 :
 * l'état des ennemis est conservé entre les assauts (comme
 * `character_stats.combat_state`).
 */
function simulateCombat({ skill, hp, enemies, rng, maxRounds = 500 }) {
  const state = enemies.map((e) => ({ ...e }));
  let playerHp = hp;
  let index = 0;
  let rounds = 0;
  const enemyHpTrace = [];

  while (rounds < maxRounds) {
    while (index < state.length && state[index].endurance <= 0) index++;
    if (index >= state.length) return { winner: "player", rounds, playerHp, enemyHpTrace };
    if (playerHp <= 0) return { winner: "enemy", rounds, playerHp, enemyHpTrace };

    rounds++;
    const enemy = state[index];
    const quotient = skill - enemy.combat_skill;
    const roll = d10(rng);
    const { enemyLoss, playerLoss } = resolveCombatRound(quotient, roll);
    enemy.endurance = applyLoss(enemy.endurance, enemyLoss);
    playerHp = applyLoss(playerHp, playerLoss);
    enemyHpTrace.push(enemy.endurance);
  }
  return { winner: "timeout", rounds, playerHp, enemyHpTrace };
}

// LE test de non-régression du bug B1.
{
  const rng = makeRng(12345);
  const trace = simulateCombat({
    skill: 15,
    hp: 25,
    enemies: [{ name: "VIPÈRE DES MARAIS", combat_skill: 16, endurance: 6 }],
    rng,
  }).enemyHpTrace;
  const decreases = trace.some((v, i) => i > 0 && v < trace[i - 1]) ||
    (trace.length > 0 && trace[0] < 6);
  check(
    "NON-RÉGRESSION B1 : l'ENDURANCE de l'ennemi décroît entre les assauts",
    decreases,
    `trace=[${trace.slice(0, 6).join(", ")}...]`,
  );
  const reachesZero = trace.some((v) => v === 0);
  check("La Vipère du §227 (END 6) finit par tomber à 0", reachesZero);
}

console.log("\n=== 3. Les 38 combats du livre sont gagnables ===\n");

// Chargement du graphe réel (toutes migrations appliquées).
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

const combatNodes = (
  await db.query(
    `SELECT node_key, metadata FROM public.story_nodes
     WHERE story_id = $1 AND jsonb_array_length(COALESCE(metadata->'combatants','[]'::jsonb)) > 0
     ORDER BY node_key`,
    [storyId],
  )
).rows;

check(
  "Sections de combat présentes dans l'aventure",
  combatNodes.length >= 28,
  `${combatNodes.length} sections`,
);

// Un joueur « moyen » du livre : HABILETÉ 15, ENDURANCE 25.
const N = 400;
let unwinnable = [];
let alwaysWon = [];
for (const node of combatNodes) {
  const enemies = node.metadata.combatants;
  let wins = 0;
  let timeouts = 0;
  for (let i = 0; i < N; i++) {
    const rng = makeRng(i * 7919 + node.node_key.length);
    const out = simulateCombat({ skill: 15, hp: 25, enemies, rng });
    if (out.winner === "player") wins++;
    if (out.winner === "timeout") timeouts++;
  }
  const rate = wins / N;
  if (rate === 0) unwinnable.push(`${node.node_key} (0%)`);
  if (rate === 1) alwaysWon.push(node.node_key);
  if (timeouts > 0) unwinnable.push(`${node.node_key} (timeout)`);
}

check(
  "NON-RÉGRESSION B1/B2 : AUCUN combat n'est ingagnable (HAB 15 / END 25)",
  unwinnable.length === 0,
  unwinnable.length ? unwinnable.join(", ") : `${combatNodes.length} combats OK`,
);

check(
  "Le jeu conserve un vrai risque (tous les combats ne sont pas gagnés à 100 %)",
  alwaysWon.length < combatNodes.length,
  `${alwaysWon.length}/${combatNodes.length} toujours gagnés`,
);

// Le Gourgaz (§255, HAB 20 / END 30) est le combat le plus dur du livre :
// il doit rester difficile mais possible.
{
  const gourgaz = combatNodes.find((n) => n.node_key === "section_255");
  if (gourgaz) {
    let wins = 0;
    for (let i = 0; i < 2000; i++) {
      const rng = makeRng(i * 104729 + 17);
      const out = simulateCombat({
        skill: 15,
        hp: 25,
        enemies: gourgaz.metadata.combatants,
        rng,
      });
      if (out.winner === "player") wins++;
    }
    const rate = wins / 2000;
    check(
      "§255 GOURGAZ (20/30) : difficile mais franchissable (5-80 %)",
      rate > 0.05 && rate < 0.8,
      `victoire ${(rate * 100).toFixed(1)} %`,
    );
  }
}

// Multi-ennemis : les ennemis sont affrontés l'un après l'autre.
{
  const multi = combatNodes.filter(
    (n) => n.metadata.combatants.length > 1,
  );
  check(
    "Sections à ennemis multiples présentes",
    multi.length >= 5,
    `${multi.length} sections`,
  );

  const rng = makeRng(999);
  const node = multi[0];
  const out = simulateCombat({
    skill: 18,
    hp: 28,
    enemies: node.metadata.combatants,
    rng,
  });
  check(
    `Multi-ennemis (${node.node_key}) : combat résolu sans blocage`,
    out.winner === "player" || out.winner === "enemy",
    `issue=${out.winner} en ${out.rounds} assauts`,
  );
}

console.log("\n=== 4. Schéma & données de la migration 013 ===\n");

{
  const col = await db.query(`
    SELECT data_type FROM information_schema.columns
    WHERE table_schema='public' AND table_name='character_stats'
      AND column_name='combat_state'
  `);
  check(
    "character_stats.combat_state existe (état de combat serveur)",
    col.rows.length === 1 && col.rows[0].data_type === "jsonb",
  );
}

{
  const rb = (
    await db.query(
      `SELECT rule_data->'combat_table' AS t FROM public.story_rulebooks WHERE story_id = $1`,
      [storyId],
    )
  ).rows[0]?.t;
  check(
    "Rulebook : la vraie Table des coups portés est stockée",
    rb && rb.cells && Object.keys(rb.cells).length === 10 &&
      rb.quotient_bands?.length === 13,
  );
  // La table en base doit coïncider avec celle du code (source unique).
  let matches = true;
  if (rb?.cells) {
    for (const roll of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const row = rb.cells[String(roll)];
      for (let band = 0; band < 13; band++) {
        const q = [-20, -10, -8, -6, -4, -2, 0, 1, 3, 5, 7, 9, 20][band];
        const { enemyLoss, playerLoss } = resolveCombatRound(q, roll);
        const [e, ls] = row[band];
        if (String(e) !== String(enemyLoss) || String(ls) !== String(playerLoss)) {
          matches = false;
        }
      }
    }
  }
  check("Rulebook : la table en base == la table du moteur", matches);
}

{
  const healing = (
    await db.query(
      `SELECT rule_data->'healing_rule' AS h FROM public.story_rulebooks WHERE story_id = $1`,
      [storyId],
    )
  ).rows[0]?.h;
  check(
    "Rulebook : règle de Guérison (+1 END/section) déclarée",
    healing?.hp_per_section === 1 &&
      healing?.discipline_flag === "discipline_guerison",
  );
}

{
  const s17 = (
    await db.query(
      `SELECT metadata FROM public.story_nodes WHERE story_id=$1 AND node_key='section_017'`,
      [storyId],
    )
  ).rows[0]?.metadata;
  check(
    "§17 : jet de Hasard marqué « après combat »",
    s17?.hazard_after_combat === true &&
      Array.isArray(s17?.combatants) && s17.combatants.length === 1 &&
      Array.isArray(s17?.hazard_consequences),
  );
}

{
  const s21 = (
    await db.query(
      `SELECT metadata FROM public.story_nodes WHERE story_id=$1 AND node_key='section_021'`,
      [storyId],
    )
  ).rows[0]?.metadata;
  const refs = s21?.references ?? [];
  check(
    "§21 : métadonnée `references` alignée sur la chaîne d'enlisement",
    refs.includes("section_021_enlisement") && refs.includes("section_189"),
    JSON.stringify(refs),
  );
}

console.log("\n=== 5. Contrat client/serveur (non-régression du bug B1) ===\n");

// Ces assertions verrouillent le contrat : c'est la divergence entre
// StoryPlayer.tsx et resolve-combat-round qui avait rendu tous les
// combats ingagnables sans qu'aucun test ne s'en aperçoive.
{
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const rc = readFileSync(
    join(root, "supabase/functions/resolve-combat-round/index.ts"),
    "utf8",
  );
  const sp = readFileSync(
    join(root, "components/story/StoryPlayer.tsx"),
    "utf8",
  );
  const gs = readFileSync(
    join(root, "supabase/functions/game-setup-action/index.ts"),
    "utf8",
  );
  const mc = readFileSync(
    join(root, "supabase/functions/make-choice/index.ts"),
    "utf8",
  );
  const ar = readFileSync(
    join(root, "supabase/functions/_shared/arrival.ts"),
    "utf8",
  );

  check(
    "Le serveur ne fait plus confiance à l'END d'ennemi envoyée par le client",
    !/body\.enemy\.endurance/.test(rc),
  );
  check(
    "Le serveur persiste l'état du combat (combat_state)",
    /combat_state/.test(rc),
  );
  check(
    "Le serveur utilise la Table des coups portés partagée",
    /combat-table\.ts/.test(rc) && !/const COMBAT_TABLE/.test(rc),
  );
  check(
    "Les ajustements maison hors livre ont disparu",
    !/hazardRoll >= 8/.test(rc) && !/function getEnemyLoss/.test(rc),
  );
  check(
    "Le client n'envoie plus l'ENDURANCE de l'ennemi",
    !/function enemyPayload/.test(sp) && !/endurance: e\.endurance/.test(sp),
  );
  check(
    "Le client recharge les flags narratifs après un combat",
    /res\.narrative_flags/.test(sp),
  );
  check(
    "Le fallback §36 codé en dur a été supprimé du client",
    !/vieille tour de guet/.test(sp),
  );
  check(
    "La fuite lit le nombre d'assauts côté serveur",
    /combat_state/.test(gs),
  );
  check(
    "Changer de section purge l'état de combat",
    /combat_state: null/.test(mc),
  );
  check(
    "La discipline Guérison est implémentée dans les règles d'arrivée",
    /Guérison : \+1 END/.test(ar),
  );
}

await db.close();

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${failed.length === 0 ? "🎉" : "💥"} ${results.length - failed.length}/${results.length} tests moteur OK`,
);
if (failed.length) {
  for (const f of failed) console.log(`   ❌ ${f.name}`);
  process.exit(1);
}
