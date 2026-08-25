// Harness de validation des migrations HeroBook sur un vrai Postgres (PGlite/WASM)
// Reproduit l'environnement Supabase : rôles anon/authenticated/service_role,
// schéma auth.users + auth.uid(), variable request.jwt.claims.
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Chemin des migrations : relatif au script (portable), pas codé en dur.
// scripts/test-migrations.mjs → app/supabase/migrations
const MIG = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "migrations");
const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond, extra });
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

// Préparer l'environnement type Supabase
await db.exec(`
  CREATE SCHEMA IF NOT EXISTS auth;
  CREATE TABLE auth.users (id uuid primary key, email text, is_anonymous boolean default false, raw_user_meta_data jsonb default '{}'::jsonb);
  CREATE OR REPLACE FUNCTION auth.uid()
  RETURNS uuid LANGUAGE sql STABLE AS $fn$
    SELECT (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
  $fn$;
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN;
`);

// ---------------------------------------------------------------
// 1. Exécuter les migrations de schéma et de contenu dans l'ordre
// ---------------------------------------------------------------
for (const f of ["001_initial_schema.sql", "002_fix_rls_and_policies.sql", "003_story_dragon_emeraude.sql"]) {
  try {
    await db.exec(readFileSync(`${MIG}/${f}`, "utf8"));
    console.log(`📦 migration ${f} : OK`);
  } catch (e) {
    console.error(`💥 migration ${f} : ${e.message}`);
    process.exit(1);
  }
}

// Répliquer les default privileges Supabase (GRANT ALL sur public aux rôles)
await db.exec(`
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
`);

try {
  await db.exec(readFileSync(`${MIG}/004_secure_monetization.sql`, "utf8"));
  console.log("📦 migration 004_secure_monetization.sql : OK");
} catch (e) {
  console.error(`💥 migration 004 : ${e.message}`);
  process.exit(1);
}

try {
  await db.exec(readFileSync(`${MIG}/005_story_purchase.sql`, "utf8"));
  console.log("📦 migration 005_story_purchase.sql : OK");
} catch (e) {
  console.error(`💥 migration 005 : ${e.message}`);
  process.exit(1);
}

try {
  await db.exec(readFileSync(`${MIG}/006_story_maitres_des_tenebres.sql`, "utf8"));
  console.log("📦 migration 006_story_maitres_des_tenebres.sql : OK");
} catch (e) {
  console.error(`💥 migration 006 : ${e.message}`);
  process.exit(1);
}

// Toutes les migrations >= 007, découvertes automatiquement et triées :
// une nouvelle migration est ainsi TOUJOURS couverte par les tests
// (auparavant la liste était codée en dur et les ajouts passaient à la trappe).
const LATE_MIGRATIONS = readdirSync(MIG)
  .filter((f) => f.endsWith(".sql") && Number(f.slice(0, 3)) >= 7)
  .sort();

for (const f of LATE_MIGRATIONS) {
  try {
    await db.exec(readFileSync(`${MIG}/${f}`, "utf8"));
    console.log(`📦 migration ${f} : OK`);
  } catch (e) {
    console.error(`💥 migration ${f} : ${e.message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------
// 2. Vérifier le contenu livre-jeu de la migration 006
// ---------------------------------------------------------------
const loup = await db.query(`
  SELECT id, is_free, price_gems, status, total_nodes, total_endings, author_note
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres'
`);
const loupStory = loup.rows[0];
const loupStoryId = loupStory?.id;
check(
  "Loup Solitaire: histoire publiée et gratuite",
  loupStory?.status === "published" && loupStory?.is_free === true && loupStory?.price_gems === null,
);
check(
  "Loup Solitaire: crédit Joe Dever présent",
  typeof loupStory?.author_note === "string" && loupStory.author_note.includes("Joe Dever"),
);
const loupNodes = await db.query(`SELECT COUNT(*)::int AS n FROM public.story_nodes WHERE story_id = '${loupStoryId}'`);
const loupSections = await db.query(`SELECT COUNT(*)::int AS n FROM public.story_nodes WHERE story_id = '${loupStoryId}' AND metadata->>'kind' = 'book_section'`);
const loupChoices = await db.query(`
  SELECT COUNT(*)::int AS n
  FROM public.story_choices c
  JOIN public.story_nodes n ON n.id = c.node_id
  WHERE n.story_id = '${loupStoryId}'
`);
check(
  "Loup Solitaire: 350 sections du PDF présentes",
  loupSections.rows[0]?.n === 350 && loupStory?.total_nodes === 350,
  `sections=${loupSections.rows[0]?.n}`,
);
check(
  "Loup Solitaire: rulebook + sections chargés",
  loupNodes.rows[0]?.n === 361,
  `noeuds=${loupNodes.rows[0]?.n}`,
);
check(
  "Loup Solitaire: renvois du livre-jeu nombreux",
  loupChoices.rows[0]?.n >= 490,
  `choix=${loupChoices.rows[0]?.n}`,
);
const loupStarts = await db.query(`SELECT COUNT(*)::int AS n FROM public.story_nodes WHERE story_id = '${loupStoryId}' AND is_start`);
check("Loup Solitaire: le rulebook est le point d'entrée", loupStarts.rows[0]?.n === 1);
const loupBrokenLinks = await db.query(`
  SELECT COUNT(*)::int AS n
  FROM public.story_choices c
  JOIN public.story_nodes source ON source.id = c.node_id
  LEFT JOIN public.story_nodes target ON target.id = c.target_node_id
  WHERE source.story_id = '${loupStoryId}'
    AND (c.target_node_id IS NULL OR target.story_id <> '${loupStoryId}')
`);
check("Loup Solitaire: tous les renvois ont une cible dans l'histoire", loupBrokenLinks.rows[0]?.n === 0);
const loupEndings = await db.query(`
  SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE ending_type = 'victory')::int AS victories,
         COUNT(*) FILTER (WHERE ending_type = 'death')::int AS deaths
  FROM public.story_nodes
  WHERE story_id = '${loupStoryId}' AND is_ending
`);
check(
  "Loup Solitaire: fins du PDF conservées",
  loupEndings.rows[0]?.total === 19 && loupStory?.total_endings === 19 && loupEndings.rows[0]?.victories === 1 && loupEndings.rows[0]?.deaths === 18,
  `fins=${loupEndings.rows[0]?.total}`,
);
const loupRules = await db.query(`SELECT content, rule_data FROM public.story_rulebooks WHERE story_id = '${loupStoryId}'`);
check(
  "Loup Solitaire: règles, disciplines et combat enregistrés",
  loupRules.rows.length === 1 && loupRules.rows[0].content.includes("Règles du jeu") && loupRules.rows[0].content.includes("Règles de combat") && Array.isArray(loupRules.rows[0].rule_data.disciplines) && loupRules.rows[0].rule_data.disciplines.length === 10 && loupRules.rows[0].rule_data.hazard_table_matrix?.length === 10 && loupRules.rows[0].rule_data.hit_table_source_page === 175,
);
const loupEffects = await db.query(`
  SELECT
    COUNT(*) FILTER (WHERE ce.effect_type = 'inventory_add')::int AS inventory_adds,
    COUNT(*) FILTER (WHERE ce.effect_type = 'inventory_require')::int AS inventory_requires,
    COUNT(*) FILTER (WHERE ce.effect_type = 'flag_set')::int AS flags_set,
    COUNT(*) FILTER (WHERE ce.effect_type = 'flag_require')::int AS flags_required
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes n ON n.id = c.node_id
  WHERE n.story_id = '${loupStoryId}'
`);
const loupEffectCounts = loupEffects.rows[0];
check(
  "Loup Solitaire: disciplines, équipement et prérequis serveur",
  loupEffectCounts?.inventory_adds >= 40 && loupEffectCounts?.inventory_requires >= 4 && loupEffectCounts?.flags_set >= 50 && loupEffectCounts?.flags_required >= 50,
  `objets=${loupEffectCounts?.inventory_adds} prérequis=${loupEffectCounts?.inventory_requires}`,
);
const loupPremium = await db.query(`
  SELECT COUNT(*)::int AS n
  FROM public.story_choices c
  JOIN public.story_nodes n ON n.id = c.node_id
  WHERE n.story_id = '${loupStoryId}' AND c.is_premium = TRUE AND c.price_gems > 0
`);
check("Loup Solitaire: histoire de test sans paywall", loupPremium.rows[0]?.n === 0);
const loupItems = await db.query(`SELECT COUNT(*)::int AS n FROM public.items WHERE story_id = '${loupStoryId}'`);
check("Loup Solitaire: objets et équipement du livre disponibles côté histoire", loupItems.rows[0]?.n >= 20, `objets=${loupItems.rows[0]?.n}`);

// ---------------------------------------------------------------
// 2bis. FIDÉLITÉ LIVRE (migration 010 — audit complet des 350 sections)
// ---------------------------------------------------------------
// 2bis.a. Les fins sont EXACTEMENT celles du livre (+ 2 fins système) :
// 16 morts papier + victoire §350 + section_021_mort + mort_epuisement.
const BOOK_ENDINGS = [
  "section_053", "section_054", "section_060", "section_108", "section_127",
  "section_154", "section_185", "section_219", "section_234", "section_259",
  "section_271", "section_286", "section_292", "section_306", "section_309",
  "section_327", "section_350", "section_021_mort", "mort_epuisement",
];
const endingsRows = await db.query(
  `SELECT node_key FROM public.story_nodes WHERE story_id = '${loupStoryId}' AND is_ending ORDER BY node_key`,
);
const endingKeys = endingsRows.rows.map((r) => r.node_key).sort();
check(
  "Fidélité: les fins sont exactement celles du livre",
  JSON.stringify(endingKeys) === JSON.stringify([...BOOK_ENDINGS].sort()),
  `${endingKeys.length} fins`,
);

// 2bis.b. Aucune section non-finale sans issue (choix ou règle de Hasard)
const deadEnds = await db.query(`
  SELECT n.node_key
  FROM public.story_nodes n
  WHERE n.story_id = '${loupStoryId}'
    AND n.metadata->>'kind' IN ('book_section', 'hazard_step')
    AND n.is_ending = FALSE
    AND NOT EXISTS (
      SELECT 1 FROM public.story_choices c WHERE c.node_id = n.id
    )
    AND COALESCE(jsonb_array_length(n.metadata->'hazard_consequences'), 0) = 0
`);
check(
  "Fidélité: aucune section vivante sans issue",
  deadEnds.rows.length === 0,
  deadEnds.rows.map((r) => r.node_key).join(",") || "aucun cul-de-sac",
);

// 2bis.c. Toutes les sections sont atteignables depuis la section 1,
// sauf §251 (injoignable aussi dans l'édition papier de référence).
const graphNodes = await db.query(
  `SELECT id, node_key, is_ending, metadata FROM public.story_nodes WHERE story_id = '${loupStoryId}'`,
);
const graphChoices = await db.query(
  `SELECT sn.node_key AS src, tn.node_key AS tgt
   FROM public.story_choices c
   JOIN public.story_nodes sn ON sn.id = c.node_id
   JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = '${loupStoryId}'`,
);
{
  const adj = new Map();
  for (const { src, tgt } of graphChoices.rows) {
    if (!adj.has(src)) adj.set(src, new Set());
    adj.get(src).add(tgt);
  }
  for (const n of graphNodes.rows) {
    // les fausses coupures autorisées : les fins n'ont pas de suite
    if (n.is_ending) continue;
    const rules = n.metadata?.hazard_consequences ?? [];
    for (const r of rules) {
      if (!r.target_node_key) continue;
      if (!adj.has(n.node_key)) adj.set(n.node_key, new Set());
      adj.get(n.node_key).add(r.target_node_key);
    }
  }
  const seen = new Set(["section_001"]);
  const queue = ["section_001"];
  while (queue.length) {
    const cur = queue.shift();
    for (const nxt of adj.get(cur) ?? []) {
      if (!seen.has(nxt)) {
        seen.add(nxt);
        queue.push(nxt);
      }
    }
  }
  const unreachable = graphNodes.rows
    .map((n) => n.node_key)
    .filter((k) => /^section_\d{3}$/.test(k) && !seen.has(k));
  check(
    "Fidélité: toutes les sections atteignables (sauf §251 du livre)",
    JSON.stringify(unreachable) === JSON.stringify(["section_251"]),
    `injoignables=${unreachable.join(",") || "aucune"}`,
  );
}

// 2bis.d. Tout choix « Rendez-vous au N » cible bien la section N
const mislabelled = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, c.text
  FROM public.story_choices c
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
    AND c.text ~ 'Rendez-vous au ([0-9]+)'
    AND tn.node_key <> 'section_' || lpad(substring(c.text from 'Rendez-vous au ([0-9]+)'), 3, '0')
`);
check(
  "Fidélité: les libellés de renvoi correspondent aux cibles",
  mislabelled.rows.length === 0,
  mislabelled.rows.map((r) => `${r.src}→${r.tgt}`).join(",") || "aucun écart",
);

// 2bis.e. Renvois du livre recréés (échantillon des 40+ renvois ajoutés)
const expectedEdges = [
  ["section_020", "section_272"], ["section_019", "section_272"],
  ["section_019", "section_119"], ["section_036", "section_140", "hazard"],
  ["section_039", "section_228"], ["section_047", "section_136"],
  ["section_047", "section_322"], ["section_056", "section_222"],
  ["section_052", "section_250"], ["section_112", "section_033"],
  ["section_112", "section_248"], ["section_124", "section_211"],
  ["section_124", "section_106"], ["section_150", "section_083"],
  ["section_173", "section_158"], ["section_199", "section_081"],
  ["section_208", "section_148"], ["section_208", "section_320"],
  ["section_225", "section_187"], ["section_225", "section_039"],
  ["section_229", "section_125"], ["section_229", "section_267"],
  ["section_272", "section_305"], ["section_300", "section_013"],
  ["section_336", "section_117"], ["section_345", "section_019"],
];
const edgesRows = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt
  FROM public.story_choices c
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
`);
const edgeSet = new Set(edgesRows.rows.map((r) => `${r.src}->${r.tgt}`));
const hazardTargets = new Set();
for (const n of graphNodes.rows) {
  for (const r of n.metadata?.hazard_consequences ?? []) {
    if (r.target_node_key) hazardTargets.add(`${n.node_key}->${r.target_node_key}`);
  }
}
const missingEdges = expectedEdges.filter(
  ([s, t, via]) => (via === "hazard" ? !hazardTargets.has(`${s}->${t}`) : !edgeSet.has(`${s}->${t}`)),
);
check(
  "Fidélité: les renvois du livre recréés existent tous",
  missingEdges.length === 0,
  missingEdges.map(([s, t]) => `${s}->${t}`).join(",") || "27/27 présents",
);

// 2bis.f. Les anciens « choix libres » de hasard ont disparu
const removedHazardChoices = [
  ["section_002", "section_343"], ["section_007", "section_108"],
  ["section_017", "section_053"], ["section_021", "section_312"],
  ["section_275", "section_345"], ["section_337", "section_219"],
  ["section_158", "section_106"], ["section_188", "section_303"],
];
const stillThere = removedHazardChoices.filter(([s, t]) => edgeSet.has(`${s}->${t}`));
check(
  "Fidélité: les faux choix libres de hasard sont supprimés",
  stillThere.length === 0,
  stillThere.map(([s, t]) => `${s}->${t}`).join(",") || "8/8 supprimés",
);

// 2bis.g. Les 21 sections à Hasard ont des règles complètes et ciblant des noeuds existants
const hazardNodes = graphNodes.rows.filter(
  (n) => (n.metadata?.hazard_consequences ?? []).length > 0,
);
const nodeKeySet = new Set(graphNodes.rows.map((n) => n.node_key));
const badHazard = hazardNodes.filter((n) =>
  (n.metadata.hazard_consequences ?? []).some(
    (r) => !r.target_node_key || !nodeKeySet.has(r.target_node_key),
  ),
);
check(
  "Fidélité: règles de Hasard présentes et valides (21 sections + 2 étapes §21)",
  hazardNodes.length === 23 && badHazard.length === 0,
  `noeuds_hasard=${hazardNodes.length}${badHazard.length ? " invalides=" + badHazard.map((n) => n.node_key).join(",") : ""}`,
);

// 2bis.h. Les 7 combats multi-ennemis du livre sont recréés
const multiCombat = ["section_112", "section_136", "section_138", "section_180", "section_253", "section_260", "section_336"];
const missingCombat = multiCombat.filter((k) => {
  const node = graphNodes.rows.find((n) => n.node_key === k);
  return (node?.metadata?.combatants?.length ?? 0) < 2;
});
check(
  "Fidélité: combats multi-ennemis recréés",
  missingCombat.length === 0,
  missingCombat.join(",") || "7/7 présents",
);

// 2bis.i. Fuites de combat et victoires rapides
const fleeExpect = {
  section_169: "section_023", section_180: "section_022",
  section_191: "section_234", section_220: "section_234",
  section_231: "section_007", section_339: "section_007",
};
const badFlee = Object.entries(fleeExpect).filter(([k, tgt]) => {
  const node = graphNodes.rows.find((n) => n.node_key === k);
  return node?.metadata?.combat?.flee?.target_node_key !== tgt;
});
const badFast = ["section_231", "section_339"].filter((k) => {
  const node = graphNodes.rows.find((n) => n.node_key === k);
  const vr = node?.metadata?.combat?.victory_rules;
  return !vr || vr.max_rounds !== 4 || !vr.flag_key;
});
check(
  "Fidélité: fuites et victoires rapides configurées",
  badFlee.length === 0 && badFast.length === 0,
  [...badFlee, ...badFast].join(",") || "6 fuites + 2 victoires rapides OK",
);

// 2bis.j. Conditions corrigées (§105 inversée, §334 doublée, victoires rapides)
const condRows = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, ce.effect_type, ce.flag_key, ce.flag_value,
         (SELECT slug FROM public.items i WHERE i.id = ce.item_id) AS item_slug
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
    AND (sn.node_key, tn.node_key) IN (
      ('section_105','section_298'), ('section_105','section_335'),
      ('section_334','section_048'), ('section_334','section_073'),
      ('section_173','section_158'),
      ('section_231','section_094'), ('section_231','section_203'),
      ('section_339','section_094'), ('section_339','section_203'))
`);
const condSet = condRows.rows.map((r) => {
  const isFlag = r.effect_type === "flag_require" || r.effect_type === "flag_set";
  return `${r.src}->${r.tgt}:${r.effect_type}:${r.flag_key ?? r.item_slug}=${isFlag ? r.flag_value : ""}`;
});
const mustHave = [
  "section_105->section_298:flag_require:discipline_communication_animale=true",
  "section_334->section_073:flag_require:discipline_camouflage=true",
  "section_173->section_158:inventory_require:cle-argent=",
  "section_231->section_094:flag_require:combat_rapide_231=true",
  "section_231->section_203:flag_require:combat_rapide_231=false",
  "section_339->section_094:flag_require:combat_rapide_339=true",
  "section_339->section_203:flag_require:combat_rapide_339=false",
];
const mustNotHave = [
  "section_105->section_335:flag_require:discipline_communication_animale=true", // condition inversée corrigée
  "section_334->section_048:flag_require:discipline_camouflage=true",            // double condition corrigée
];
if (!(mustHave.every((m) => condSet.includes(m)) && mustNotHave.every((m) => !condSet.includes(m)))) {
  console.log("    DEBUG condSet:", condSet.join(" | "));
}
check(
  "Fidélité: conditions de choix corrigées",
  mustHave.every((m) => condSet.includes(m)) && mustNotHave.every((m) => !condSet.includes(m)),
  `${condSet.length} effets contrôlés`,
);

// 2bis.k. La Clé d'Argent est obtenue à la section 124 (objet spécial)
const keyAdd = await db.query(`
  SELECT COUNT(*)::int AS n
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.items i ON i.id = ce.item_id
  WHERE sn.story_id = '${loupStoryId}' AND sn.node_key = 'section_124'
    AND ce.effect_type = 'inventory_add' AND i.slug = 'cle-argent'
`);
check(
  "Fidélité: la Clé d'Argent est attribuée à la section 124",
  keyAdd.rows[0]?.n >= 1,
  `octrois=${keyAdd.rows[0]?.n}`,
);

// ---------------------------------------------------------------
// 2ter. FIDÉLITÉ LIVRE PASSE 2 (migrations 011 + 012)
// Repas/faim, Couronnes, Sac à Dos, règles de combat spéciales,
// règles d'arrivée, verrous de conditions inversés (§§9/133/255/283/342)
// ---------------------------------------------------------------

// 2ter.a. L'enum connaît 'inventory_remove'
const enumRows = await db.query(`
  SELECT COUNT(*)::int AS n FROM pg_enum
  WHERE enumlabel = 'inventory_remove'
    AND enumtypid = 'choice_effect_type'::regtype
`);
check(
  "Fidélité²: effet 'inventory_remove' disponible",
  enumRows.rows[0]?.n === 1,
);

// 2ter.b. Nouveaux objets du livre (or, Laumspur, Sac à Dos)
const newItems = await db.query(`
  SELECT slug, is_stackable FROM public.items
  WHERE story_id = '${loupStoryId}' AND slug IN ('couronnes','laumspur','sac-a-dos')
`);
const itemMap = Object.fromEntries(newItems.rows.map((r) => [r.slug, r.is_stackable]));
check(
  "Fidélité²: objets couronnes/laumspur/sac-a-dos créés",
  itemMap.couronnes === true && itemMap.laumspur === true && itemMap["sac-a-dos"] === false,
  JSON.stringify(itemMap),
);

// 2ter.c. Les 5 verrous de conditions inversés sont levés
const lockRows = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, ce.effect_type, ce.flag_key,
         (SELECT slug FROM public.items i WHERE i.id = ce.item_id) AS item_slug
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
    AND (sn.node_key, tn.node_key) IN (
      ('section_009','section_292'), ('section_133','section_266'),
      ('section_255','section_082'), ('section_283','section_123'),
      ('section_342','section_123'))
    AND ce.effect_type IN ('flag_require','inventory_require')
`);
check(
  "Fidélité²: verrous inversés levés (§§9,133,255,283,342 post-combat libres)",
  lockRows.rows.length === 0,
  lockRows.rows.length > 0 ? JSON.stringify(lockRows.rows) : "aucun require résiduel",
);

// 2ter.c2. Verrous inversés, seconde famille : les sorties « sinon »
// des §§29/34/88/162/173/242/303 sont libres (livre : sinon → B)
const lockRows2 = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, ce.effect_type, ce.flag_key,
         (SELECT slug FROM public.items i WHERE i.id = ce.item_id) AS item_slug
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
    AND (sn.node_key, tn.node_key) IN (
      ('section_029','section_270'), ('section_034','section_328'),
      ('section_088','section_031'), ('section_162','section_127'),
      ('section_242','section_009'), ('section_303','section_072'),
      ('section_173','section_259'))
    AND ce.effect_type IN ('flag_require','inventory_require')
`);
check(
  "Fidélité²: sorties « sinon » libres (§§29,34,88,162,173,242,303)",
  lockRows2.rows.length === 0,
  lockRows2.rows.length > 0 ? JSON.stringify(lockRows2.rows) : "aucun require résiduel",
);
// ...et les branches disciplinées correspondantes exigent toujours la discipline
const stillCond = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, ce.flag_key
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}'
    AND (sn.node_key, tn.node_key) IN (
      ('section_088','section_216'), ('section_162','section_258'),
      ('section_242','section_166'), ('section_303','section_237'))
    AND ce.effect_type = 'flag_require'
`);
check(
  "Fidélité²: branches « si discipline » toujours conditionnées (§§88,162,242,303)",
  stillCond.rows.length === 4,
  `${stillCond.rows.length}/4 conditions conservées`,
);
// ...et la vraie condition du §9 (Pierre de Vordak → 236) subsiste
const stoneCond = await db.query(`
  SELECT COUNT(*)::int AS n
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  JOIN public.items i ON i.id = ce.item_id
  WHERE sn.story_id = '${loupStoryId}' AND sn.node_key = 'section_009'
    AND tn.node_key = 'section_236' AND ce.effect_type = 'inventory_require'
    AND i.slug = 'pierre-vordak'
`);
check(
  "Fidélité²: §9 → 236 exige bien la Pierre de Vordak",
  stoneCond.rows[0]?.n === 1,
);

// 2ter.d. Économie : achats §12 (10 Couronnes) et §46 (2 Couronnes)
const payRows = await db.query(`
  SELECT sn.node_key AS src, tn.node_key AS tgt, ce.effect_type, ce.stat_value
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  JOIN public.items i ON i.id = ce.item_id
  WHERE sn.story_id = '${loupStoryId}' AND i.slug = 'couronnes'
    AND (sn.node_key, tn.node_key) IN (('section_012','section_262'),('section_046','section_246'))
  ORDER BY sn.node_key, ce.effect_type
`);
const paySet = payRows.rows.map((r) => `${r.src}->${r.tgt}:${r.effect_type}:${r.stat_value}`);
check(
  "Fidélité²: achats en Couronnes (§12 = 10, §46 = 2, exigés et débités)",
  [
    "section_012->section_262:inventory_remove:10",
    "section_012->section_262:inventory_require:10",
    "section_046->section_246:inventory_remove:2",
    "section_046->section_246:inventory_require:2",
  ].every((m) => paySet.includes(m)),
  paySet.join(" | "),
);

// 2ter.e. Butins : or, repas, objets du livre
const lootRows = await db.query(`
  SELECT sn.node_key AS src, i.slug, ce.stat_value
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.items i ON i.id = ce.item_id
  WHERE sn.story_id = '${loupStoryId}' AND ce.effect_type = 'inventory_add'
    AND sn.node_key IN ('section_020','section_062','section_113','section_124',
                        'section_291','section_347','section_076','section_304')
`);
const lootSet = lootRows.rows.map((r) => `${r.src}:${r.slug}:${r.stat_value}`);
const lootMust = [
  "section_020:repas:2", "section_020:poignard:1",
  "section_062:couronnes:28", "section_062:repas:3",
  "section_124:couronnes:15",
  "section_291:couronnes:6",
  "section_347:torches:1", "section_347:briquet-amadou:1", "section_347:sabre:1",
  "section_076:pierre-vordak:1", "section_304:pierre-vordak:1",
];
const laumspurCount = lootRows.rows.filter((r) => r.src === "section_113" && r.slug === "laumspur" && r.stat_value === 2).length;
check(
  "Fidélité²: butins distribués (or, repas, torche/briquet, Pierre de Vordak)",
  lootMust.every((m) => lootSet.includes(m)) && laumspurCount === 2,
  `${lootSet.length} effets · laumspur sur ${laumspurCount}/2 sorties du §113`,
);

// 2ter.f. Règles d'arrivée (blessures, soin, repas, destruction pierre)
const arriveRows = await db.query(`
  SELECT node_key, metadata->'on_arrive' AS r
  FROM public.story_nodes
  WHERE story_id = '${loupStoryId}' AND metadata ? 'on_arrive'
`);
const arriveMap = Object.fromEntries(arriveRows.rows.map((r) => [r.node_key, r.r]));
const dmgExpect = {
  section_076: -2, section_119: -2, section_144: -2, section_146: -3,
  section_166: -4, section_203: -10, section_236: -6, section_276: -1,
  section_304: -2, section_308: -1, section_313: -1, section_320: -2,
  section_343: -2,
};
const dmgOk = Object.entries(dmgExpect).every(
  ([k, v]) => arriveMap[k]?.hp_delta === v,
);
const mealOk = ["section_037", "section_130", "section_147", "section_168", "section_184", "section_235", "section_300"]
  .every((k) => arriveMap[k]?.meal_required === true);
check(
  "Fidélité²: blessures narratives d'arrivée (13 sections)",
  dmgOk,
  `on_arrive sur ${arriveRows.rows.length} noeuds`,
);
check(
  "Fidélité²: repas obligatoires sur les 7 sections du livre",
  mealOk,
);
check(
  "Fidélité²: §212 soin complet · §236 (-6 END, -1 HAB, pierre détruite) · §184 butin avant repas",
  arriveMap.section_212?.hp_to_max === true &&
    arriveMap.section_236?.skill_delta === -1 &&
    (arriveMap.section_236?.remove_items ?? []).includes("pierre-vordak") &&
    (arriveMap.section_184?.add_items ?? []).some((a) => a.slug === "couronnes" && a.qty === 40) &&
    (arriveMap.section_184?.add_items ?? []).some((a) => a.slug === "repas" && a.qty === 4),
  JSON.stringify({ s212: arriveMap.section_212, s184: arriveMap.section_184 }),
);
check(
  "Fidélité²: §162 capture Drakkarims (perte Sac à Dos + Armes, or conservé)",
  arriveMap.section_162?.lose_backpack === true &&
    arriveMap.section_162?.lose_weapons === true,
  JSON.stringify(arriveMap.section_162),
);

// 2ter.g. §188 : la règle de hasard 0-6 détruit le Sac à Dos
const sack = await db.query(`
  SELECT metadata->'hazard_consequences' AS rules
  FROM public.story_nodes
  WHERE story_id = '${loupStoryId}' AND node_key = 'section_188'
`);
const sackRule = (sack.rows[0]?.rules ?? []).find((r) => r.min === 0);
check(
  "Fidélité²: §188 déchire le Sac à Dos (règle 0-6)",
  sackRule?.lose_backpack === true && sackRule?.max === 6,
);

// 2ter.h. Règles de combat spéciales (Vordaks, immunités, noir, surprise)
const combatRows = await db.query(`
  SELECT node_key, metadata->'combatants' AS cs
  FROM public.story_nodes
  WHERE story_id = '${loupStoryId}'
    AND node_key IN ('section_017','section_029','section_034','section_133',
                     'section_170','section_255','section_283','section_342','section_227')
`);
const cMap = Object.fromEntries(combatRows.rows.map((r) => [r.node_key, r.cs?.[0] ?? {}]));
const combatChecks = [
  ["section_017", cMap.section_017?.player_skill_penalty === 1],
  ["section_029", cMap.section_029?.psychic_assault === true],
  ["section_034", cMap.section_034?.psychic_assault === true],
  ["section_133", cMap.section_133?.mindblast_immune === true],
  ["section_170", cMap.section_170?.mindblast_immune === true && cMap.section_170?.no_torch_penalty === 3],
  ["section_255", cMap.section_255?.mindblast_immune === true],
  ["section_283", cMap.section_283?.surprise_bonus_round_1 === 2 && cMap.section_283?.psychic_assault_from_round === 2],
  ["section_342", cMap.section_342?.mindblast_immune === true && cMap.section_342?.psychic_assault === true],
].filter(([, ok]) => !ok);
check(
  "Fidélité²: règles de combat spéciales par ennemi",
  combatChecks.length === 0,
  combatChecks.length ? `manquantes: ${combatChecks.map(([k]) => k).join(",")}` : "9 sections vérifiées",
);

// 2ter.i. Vipère §227 : flag victoire sans blessure + conditions
const vipera = await db.query(`
  SELECT metadata->'combat'->>'flag_flawless' AS flag
  FROM public.story_nodes
  WHERE story_id = '${loupStoryId}' AND node_key = 'section_227'
`);
const viperaConds = await db.query(`
  SELECT tn.node_key AS tgt, ce.flag_value
  FROM public.choice_effects ce
  JOIN public.story_choices c ON c.id = ce.choice_id
  JOIN public.story_nodes sn ON sn.id = c.node_id
  JOIN public.story_nodes tn ON tn.id = c.target_node_id
  WHERE sn.story_id = '${loupStoryId}' AND sn.node_key = 'section_227'
    AND ce.effect_type = 'flag_require' AND ce.flag_key = 'combat_sans_degats_227'
`);
const viperaMap = Object.fromEntries(viperaConds.rows.map((r) => [r.tgt, r.flag_value]));
check(
  "Fidélité²: §227 victoire sans blessure (→348) / avec blessure (→271)",
  vipera.rows[0]?.flag === "combat_sans_degats_227" &&
    viperaMap.section_348 === true && viperaMap.section_271 === false,
  JSON.stringify(viperaMap),
);

// 2ter.j. Aucun noeud ne peut enfermer le joueur : chaque noeud vivant
// doté de choix offre soit une sortie inconditionnée (aucun require),
// soit une paire de flag_require complémentaires (true/false sur la
// même clé) — fini les impasses dépendantes d'une discipline ou d'un
// objet (§§9, 105, 133, 173, 255, 283, 342 ; paires §227/§231/§339).
const gateRows = await db.query(`
  SELECT sn.node_key AS src, c.id AS cid, ce.effect_type, ce.flag_key, ce.flag_value
  FROM public.story_choices c
  JOIN public.story_nodes sn ON sn.id = c.node_id
  LEFT JOIN public.choice_effects ce ON ce.choice_id = c.id
     AND ce.effect_type IN ('flag_require','inventory_require')
  WHERE sn.story_id = '${loupStoryId}' AND sn.is_ending = FALSE
    AND sn.node_key LIKE 'section\_%'
`);
const byNode = {};
for (const r of gateRows.rows) {
  (byNode[r.src] ??= {})[r.cid] ??= { hasRequire: false };
  if (r.effect_type) byNode[r.src][r.cid].hasRequire = true;
}
const flagValues = {};
for (const r of gateRows.rows) {
  if (r.effect_type === "flag_require") {
    (flagValues[r.src] ??= {})[r.flag_key] ??= new Set();
    flagValues[r.src][r.flag_key].add(r.flag_value);
  }
}
const trapped = [];
for (const [src, choices] of Object.entries(byNode)) {
  const list = Object.values(choices);
  if (list.some((ch) => !ch.hasRequire)) continue; // sortie libre OK
  // Tout est conditionné : il faut une paire complémentaire true/false
  const ok = Object.values(flagValues[src] ?? {}).some(
    (vals) => vals.has(true) && vals.has(false),
  );
  if (!ok) trapped.push(src);
}
check(
  "Fidélité²: pas d'impasse par conditions (sortie libre ou paire complémentaire)",
  trapped.length === 0,
  trapped.length
    ? `piégés: ${trapped.join(",")}`
    : `${Object.keys(byNode).length} noeuds contrôlés`,
);

// ---------------------------------------------------------------
// 3. Créer un utilisateur de test + wallet
// ---------------------------------------------------------------
const { rows: u } = await db.query(
  `INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'hero@test.fr') RETURNING id`,
);
const userId = u[0].id;
// le trigger handle_new_user crée déjà le profil
// wallet créé par le trigger (0 gemmes) — donner 50 gemmes pour les tests
await db.exec(`UPDATE public.wallets SET gems = 50 WHERE user_id = '${userId}'`);

const jwt = JSON.stringify({ sub: userId, role: "authenticated" });

// ---------------------------------------------------------------
// 3. RLS : le client ne peut plus toucher wallets/transactions/inventory
// ---------------------------------------------------------------
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
// NOTE: en Postgres, un UPDATE bloqué par RLS n'échoue pas : il affecte 0 ligne.
let updateWorked = false;
try {
  const up = await db.query(`UPDATE public.wallets SET gems = 999999 WHERE user_id = '${userId}' RETURNING gems`);
  updateWorked = (up.rows ?? []).length > 0;
} catch (e) { /* erreur RLS = encore mieux */ }
await db.exec(`RESET ROLE;`);
const still = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${userId}'`);
check("RLS: client ne peut plus UPDATE wallets", !updateWorked && still.rows[0].gems === 50, `gems inchangés=${still.rows[0].gems}`);
await db.exec(`SET ROLE authenticated;`);
try {
  await db.exec(`INSERT INTO public.transactions (user_id, type, gems_delta) VALUES ('${userId}', 'gem_purchase', 100000)`);
  check("RLS: client ne peut plus INSERT transactions", false, "l'INSERT a réussi !");
} catch (e) {
  check("RLS: client ne peut plus INSERT transactions", true);
}
try {
  await db.exec(`INSERT INTO public.user_inventory (user_id, item_id, quantity) VALUES ('${userId}', (SELECT id FROM public.items LIMIT 1), 100)`);
  check("RLS: client ne peut plus INSERT user_inventory", false, "l'INSERT a réussi !");
} catch (e) {
  check("RLS: client ne peut plus INSERT user_inventory", true);
}
// Le trigger de protection (migration 009) ne s'exerce que sur une ligne
// existante : on en crée une côté serveur avant l'attaque client.
await db.exec(`RESET ROLE;`);
await db.exec(`
  INSERT INTO public.user_story_progress (user_id, story_id, current_node_id, is_completed, endings_found)
  VALUES ('${userId}', '${loupStoryId}',
          (SELECT id FROM public.story_nodes WHERE story_id = '${loupStoryId}' AND is_start LIMIT 1),
          false, '{}')
  ON CONFLICT (user_id, story_id) DO NOTHING;
`);
await db.exec(`SET ROLE authenticated;`);
try {
  await db.exec(`UPDATE public.user_story_progress SET is_completed = true, endings_found = '{fake}' WHERE user_id = '${userId}' AND story_id = '${loupStoryId}'`);
  check("Colonnes: is_completed non inscriptible par le client", false, "l'UPDATE a réussi !");
} catch (e) {
  check("Colonnes: is_completed non inscriptible par le client", true);
}
const sel = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${userId}'`);
check("RLS: le client peut toujours LIRE son wallet", sel.rows.length === 1 && sel.rows[0].gems === 50, `rows=${sel.rows.length}`);

// ---------------------------------------------------------------
// 4. purchase_item (RPC authenticated) — débit, prix serveur
// ---------------------------------------------------------------
let r = await db.query(`SELECT public.purchase_item(p_item_id => (SELECT id FROM public.items WHERE slug = 'potion-vitalite')) AS res`);
const purch = r.rows[0].res;
check("purchase_item: achat réussi", purch?.gems === 20 && purch?.quantity === 1, `gems=${purch?.gems} qty=${purch?.quantity}`);
r = await db.query(`SELECT quantity FROM public.user_inventory WHERE user_id = '${userId}' AND item_id = (SELECT id FROM public.items WHERE slug = 'potion-vitalite')`);
check("purchase_item: objet dans l'inventaire (x1)", r.rows[0]?.quantity === 1);
r = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${userId}'`);
check("purchase_item: solde débité (50→20)", r.rows[0].gems === 20);
r = await db.query(`SELECT COUNT(*)::int AS n FROM public.transactions WHERE user_id = '${userId}' AND type = 'item_purchase'`);
check("purchase_item: transaction enregistrée", r.rows[0].n === 1);
// achat avec solde insuffisant
try {
  await db.query(`SELECT * FROM public.purchase_item(p_item_id => (SELECT id FROM public.items WHERE slug = 'amulette-chance'))`);
  check("purchase_item: solde insuffisant refusé", false, "aucune erreur levée");
} catch (e) {
  check("purchase_item: solde insuffisant refusé", e.message.includes("insufficient_funds"), e.message);
}

// ---------------------------------------------------------------
// 5. process_wallet_transaction (service_role) — atomicité + idempotence RC
// ---------------------------------------------------------------
await db.exec(`RESET ROLE;`); // postgres (≈ service_role pour les tests)
r = await db.query(`SELECT * FROM public.process_wallet_transaction(p_user_id => '${userId}', p_type => 'gem_purchase', p_gems_delta => 550, p_rc_txn_id => 'rc_test_1')`);
check("process_wallet_transaction: crédit pack", r.rows[0].gems === 570, `gems=${r.rows[0]?.gems}`);
try {
  await db.query(`SELECT * FROM public.process_wallet_transaction(p_user_id => '${userId}', p_type => 'gem_purchase', p_gems_delta => 550, p_rc_txn_id => 'rc_test_1')`);
  check("process_wallet_transaction: doublon webhook RC rejeté", false, "le doublon a été crédité !");
} catch (e) {
  check("process_wallet_transaction: doublon webhook RC rejeté", e.message.includes("duplicate_transaction"), e.message);
}
r = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${userId}'`);
check("process_wallet_transaction: pas de crédit sur doublon", r.rows[0].gems === 570);
try {
  await db.query(`SELECT * FROM public.process_wallet_transaction(p_user_id => '${userId}', p_type => 'gem_spend', p_gems_delta => -999999)`);
  check("process_wallet_transaction: débit > solde refusé", false);
} catch (e) {
  check("process_wallet_transaction: débit > solde refusé", e.message.includes("insufficient_funds"));
}

// ---------------------------------------------------------------
// 6. claim_daily_reward — streak + idempotence
// ---------------------------------------------------------------
r = await db.query(`SELECT public.claim_daily_reward(p_user_id => '${userId}') AS res`);
check("claim_daily_reward: 1er claim (streak 1)", r.rows[0].res.streak_days === 1 && r.rows[0].res.reward_gems === 10, `streak=${r.rows[0].res?.streak_days} gems=${r.rows[0].res?.reward_gems}`);
r = await db.query(`SELECT public.claim_daily_reward(p_user_id => '${userId}') AS res`);
check("claim_daily_reward: 2e claim le même jour refusé", r.rows[0].res.already_claimed === true && r.rows[0].res.reward_gems === 0);
// simuler hier : streak_day 2 attendu
await db.exec(`UPDATE public.profiles SET streak_last_at = current_date - 1 WHERE id = '${userId}'`);
r = await db.query(`SELECT public.claim_daily_reward(p_user_id => '${userId}') AS res`);
check("claim_daily_reward: streak consécutif = 2 (+12 💎)", r.rows[0].res.streak_days === 2 && r.rows[0].res.reward_gems === 12, `reward=${r.rows[0].res?.reward_gems}`);
// rupture de streak
await db.exec(`UPDATE public.profiles SET streak_last_at = current_date - 5 WHERE id = '${userId}'`);
r = await db.query(`SELECT public.claim_daily_reward(p_user_id => '${userId}') AS res`);
check("claim_daily_reward: rupture de streak → reset à 1", r.rows[0].res.streak_days === 1 && r.rows[0].res.reward_gems === 10);

// ---------------------------------------------------------------
// 7. apply_item_effect — potion dans l'inventaire
// ---------------------------------------------------------------
const storyId = (await db.query(`SELECT id FROM public.stories WHERE slug = 'la-foret-des-ombres'`)).rows[0].id;
await db.exec(`INSERT INTO public.character_stats (user_id, story_id, hp_current, hp_max) VALUES ('${userId}', '${storyId}', 8, 10)`);
r = await db.query(`SELECT public.apply_item_effect(p_user_id => '${userId}', p_item_id => (SELECT id FROM public.items WHERE slug = 'potion-vitalite'), p_story_id => '${storyId}') AS res`);
check("apply_item_effect: potion boit (8+5 plafonné à 10)", r.rows[0].res.healed === 2 && r.rows[0].res.hp_current === 10, `healed=${r.rows[0].res?.healed} hp=${r.rows[0].res?.hp_current}`);
r = await db.query(`SELECT quantity FROM public.user_inventory WHERE user_id = '${userId}' AND item_id = (SELECT id FROM public.items WHERE slug = 'potion-vitalite')`);
check("apply_item_effect: dernier exemplaire consommé (ligne supprimée)", r.rows.length === 0);
// objet non consommable (mis en inventaire au préalable pour isoler le test)
await db.exec(`INSERT INTO public.user_inventory (user_id, item_id, quantity, story_id) VALUES ('${userId}', (SELECT id FROM public.items WHERE slug = 'dague-ombre'), 1, NULL) ON CONFLICT (user_id, item_id) WHERE story_id IS NULL DO UPDATE SET quantity = 1`);
try {
  await db.query(`SELECT public.apply_item_effect(p_user_id => '${userId}', p_item_id => (SELECT id FROM public.items WHERE slug = 'dague-ombre'), p_story_id => '${storyId}')`);
  check("apply_item_effect: non-consommable refusé", false);
} catch (e) {
  check("apply_item_effect: non-consommable refusé", e.message.includes("item_not_consumable"), e.message);
}

// ---------------------------------------------------------------
// 7bis. use_consumable (migration 015) — fallback client des potions
//        Identité imposée par auth.uid(), même logique atomique.
// ---------------------------------------------------------------
await db.exec(`INSERT INTO public.user_inventory (user_id, item_id, quantity, story_id) VALUES ('${userId}', (SELECT id FROM public.items WHERE slug = 'potion-vitalite'), 2, NULL) ON CONFLICT (user_id, item_id) WHERE story_id IS NULL DO UPDATE SET quantity = 2`);
await db.exec(`UPDATE public.character_stats SET hp_current = 4 WHERE user_id = '${userId}' AND story_id = '${storyId}'`);
// appel avec le rôle authenticated + JWT (comme le client réel)
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
r = await db.query(`SELECT public.use_consumable(p_item_id => (SELECT id FROM public.items WHERE slug = 'potion-vitalite'), p_story_id => '${storyId}') AS res`);
check(
  "use_consumable: potion utilisable par le client (RPC authenticated)",
  r.rows[0].res.healed === 5 && r.rows[0].res.hp_current === 9,
  `healed=${r.rows[0].res?.healed} hp=${r.rows[0].res?.hp_current}`,
);
r = await db.query(`SELECT public.use_consumable(p_item_id => (SELECT id FROM public.items WHERE slug = 'potion-vitalite'), p_story_id => '${storyId}') AS res`);
check(
  "use_consumable: 2e dose plafonnée à hp_max",
  r.rows[0].res.healed === 1 && r.rows[0].res.hp_current === 10 && r.rows[0].res.quantity === 0,
  `healed=${r.rows[0].res?.healed} hp=${r.rows[0].res?.hp_current} qty=${r.rows[0].res?.quantity}`,
);
await db.exec(`RESET ROLE;`);

// ---------------------------------------------------------------
// 8. claim_achievements — conditions revalidées serveur
// ---------------------------------------------------------------
await db.exec(`INSERT INTO public.user_story_progress (user_id, story_id, is_completed, endings_found) VALUES ('${userId}', '${storyId}', true, ARRAY['victoire'])`);
r = await db.query(`SELECT public.claim_achievements(p_user_id => '${userId}') AS res`);
const names = (r.rows[0].res.unlocked ?? []).map((a) => a.name);
check("claim_achievements: débloque Premier Pas + Survivant", names.includes("Premier Pas") && names.includes("Survivant"), names.join(", "));
r = await db.query(`SELECT public.claim_achievements(p_user_id => '${userId}') AS res`);
check("claim_achievements: idempotent (rien de nouveau)", (r.rows[0].res.unlocked ?? []).length === 0);
r = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${userId}'`);
check("claim_achievements: gemmes créditées", r.rows[0].gems > 0, `gems=${r.rows[0].gems}`);

// ---------------------------------------------------------------
// 9. make-choice (préconditions SQL côté make-choice testées via RPC direct)
// ---------------------------------------------------------------
r = await db.query(`SELECT id, price_gems FROM public.story_choices LIMIT 1`);
check("story_choices lisibles pour make-choice", r.rows.length === 1);

// ---------------------------------------------------------------
// 10. purchase_story — achat d'histoire payante + déverrouillage
// ---------------------------------------------------------------
// (préparation en tant que postgres : histoire payante + 1 noeud + solde)
const paidRes = await db.query(`INSERT INTO public.stories (slug, title, genre, status, is_free, price_gems, published_at) VALUES ('test-aventure-payante', 'Test Payante', 'fantasy', 'published', false, 199, NOW()) RETURNING id`);
const paidStoryId = paidRes.rows[0].id;
await db.exec(`INSERT INTO public.story_nodes (story_id, node_key, content, is_start) VALUES ('${paidStoryId}', 'debut', 'Premier chapitre.', true)`);

// 10a. AVANT achat : les noeuds sont illisibles (RLS access control)
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
r = await db.query(`SELECT * FROM public.story_nodes WHERE story_id = '${paidStoryId}'`);
check("purchase_story: noeuds illisibles AVANT achat (RLS)", (r.rows ?? []).length === 0, `rows=${r.rows.length}`);
r = await db.query(`SELECT is_purchased FROM public.user_story_progress WHERE user_id = '${userId}' AND story_id = '${paidStoryId}'`);
check("purchase_story: pas de progression AVANT achat", (r.rows ?? []).length === 0);

// 10b. Solde insuffisant -> refusé
await db.exec(`RESET ROLE; UPDATE public.wallets SET gems = 5 WHERE user_id = '${userId}'`);
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
try {
  await db.query(`SELECT public.purchase_story(p_story_id => '${paidStoryId}')`);
  check("purchase_story: solde insuffisant refusé", false, "aucune erreur levée");
} catch (e) {
  check("purchase_story: solde insuffisant refusé", e.message.includes("insufficient_funds"), e.message);
}

// 10c. Achat réussi (199 débite 250 → 51)
await db.exec(`RESET ROLE; UPDATE public.wallets SET gems = 250 WHERE user_id = '${userId}'`);
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
r = await db.query(`SELECT public.purchase_story(p_story_id => '${paidStoryId}') AS res`);
check("purchase_story: achat réussi (débit 199)", r.rows[0].res.already_owned === false && r.rows[0].res.gems === 51, `gems=${r.rows[0].res?.gems}`);
r = await db.query(`SELECT is_purchased FROM public.user_story_progress WHERE user_id = '${userId}' AND story_id = '${paidStoryId}'`);
check("purchase_story: is_purchased = TRUE après achat", r.rows[0]?.is_purchased === true);
r = await db.query(`SELECT COUNT(*)::int AS n FROM public.transactions WHERE user_id = '${userId}' AND type = 'story_purchase' AND story_id = '${paidStoryId}'`);
check("purchase_story: transaction story_purchase enregistrée", r.rows[0].n === 1);

// 10d. Idempotence : re-achat -> already_owned, pas de re-débit
r = await db.query(`SELECT public.purchase_story(p_story_id => '${paidStoryId}') AS res`);
check("purchase_story: re-achat idempotent (already_owned)", r.rows[0].res.already_owned === true && r.rows[0].res.gems === 51, `gems=${r.rows[0].res?.gems}`);
r = await db.query(`SELECT COUNT(*)::int AS n FROM public.transactions WHERE user_id = '${userId}' AND type = 'story_purchase'`);
check("purchase_story: pas de double transaction", r.rows[0].n === 1);

// 10e. APRÈS achat : les noeuds deviennent lisibles (RLS déverrouillée)
r = await db.query(`SELECT * FROM public.story_nodes WHERE story_id = '${paidStoryId}'`);
check("purchase_story: noeuds lisibles APRÈS achat", (r.rows ?? []).length === 1, `rows=${r.rows.length}`);

// 10f. Le client ne peut toujours pas écrire is_purchased directement
try {
  await db.exec(`UPDATE public.user_story_progress SET is_purchased = false WHERE user_id = '${userId}' AND story_id = '${paidStoryId}'`);
  check("purchase_story: is_purchased non inscriptible côté client", false, "l'UPDATE a réussi !");
} catch (e) {
  check("purchase_story: is_purchased non inscriptible côté client", true);
}
await db.exec(`RESET ROLE;`);

// ---------------------------------------------------------------
// 11. ensure_profile_and_wallet + purge_anonymous_user (migration 016)
// ---------------------------------------------------------------
// 11a. Compte « fantôme » : auth.users sans profil ni wallet
const ghost = await db.query(
  `INSERT INTO auth.users (id, email, is_anonymous) VALUES (gen_random_uuid(), 'fantome@test.fr', true) RETURNING id`,
);
const ghostId = ghost.rows[0].id;
// Le trigger a créé profil + wallet : on les supprime pour simuler le fantôme.
await db.exec(`DELETE FROM public.profiles WHERE id = '${ghostId}'`);
const ghostJwt = JSON.stringify({ sub: ghostId, role: "authenticated" });
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${ghostJwt}', false);`);
r = await db.query(`SELECT public.ensure_profile_and_wallet() AS res`);
check("ensure_profile_and_wallet: profil + wallet (re)créés", r.rows[0].res.profile_created === true && r.rows[0].res.wallet_created === true, JSON.stringify(r.rows[0].res));
r = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${ghostId}'`);
check("ensure_profile_and_wallet: 50 gemmes de bienvenue", r.rows[0]?.gems === 50, `gems=${r.rows[0]?.gems}`);
r = await db.query(`SELECT public.ensure_profile_and_wallet() AS res`);
check("ensure_profile_and_wallet: idempotent (2e appel sans effet)", r.rows[0].res.profile_created === false && r.rows[0].res.wallet_created === false);
r = await db.query(`SELECT gems FROM public.wallets WHERE user_id = '${ghostId}'`);
check("ensure_profile_and_wallet: pas de double octroi de gemmes", r.rows[0]?.gems === 50, `gems=${r.rows[0]?.gems}`);

// 11b. purge_anonymous_user : supprime l'invité + cascade FK
r = await db.query(`SELECT public.purge_anonymous_user() AS res`);
check("purge_anonymous_user: invité supprimé", r.rows[0].res === true);
await db.exec(`RESET ROLE;`);
r = await db.query(`SELECT COUNT(*)::int AS n FROM auth.users WHERE id = '${ghostId}'`);
check("purge_anonymous_user: auth.users nettoyé", r.rows[0].n === 0);
r = await db.query(`SELECT COUNT(*)::int AS n FROM public.profiles WHERE id = '${ghostId}'`);
check("purge_anonymous_user: cascade profiles (et wallet)", r.rows[0].n === 0);

// 11c. purge_anonymous_user : refuse un compte permanent
await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claims', '${jwt}', false);`);
r = await db.query(`SELECT public.purge_anonymous_user() AS res`);
check("purge_anonymous_user: compte permanent protégé", r.rows[0].res === false);
await db.exec(`RESET ROLE;`);
r = await db.query(`SELECT COUNT(*)::int AS n FROM auth.users WHERE id = '${userId}'`);
check("purge_anonymous_user: compte permanent toujours là", r.rows[0].n === 1);

// ---------------------------------------------------------------
// Bilan
// ---------------------------------------------------------------
const failed = results.filter((x) => !x.ok);
console.log(`\n${failed.length === 0 ? "🎉" : "⚠️"} ${results.length - failed.length}/${results.length} tests OK`);
process.exit(failed.length === 0 ? 0 : 1);
