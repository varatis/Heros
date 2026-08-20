// Harness de validation des migrations HeroBook sur un vrai Postgres (PGlite/WASM)
// Reproduit l'environnement Supabase : rôles anon/authenticated/service_role,
// schéma auth.users + auth.uid(), variable request.jwt.claims.
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync } from "node:fs";
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
  CREATE TABLE auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
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
  loupNodes.rows[0]?.n === 357,
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
  loupEndings.rows[0]?.total === 42 && loupStory?.total_endings === 42 && loupEndings.rows[0]?.victories >= 1 && loupEndings.rows[0]?.deaths >= 40,
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
try {
  await db.exec(`UPDATE public.user_story_progress SET is_completed = true, endings_found = '{fake}' WHERE user_id = '${userId}'`);
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
await db.exec(`INSERT INTO public.user_inventory (user_id, item_id, quantity) VALUES ('${userId}', (SELECT id FROM public.items WHERE slug = 'dague-ombre'), 1) ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = 1`);
try {
  await db.query(`SELECT public.apply_item_effect(p_user_id => '${userId}', p_item_id => (SELECT id FROM public.items WHERE slug = 'dague-ombre'), p_story_id => '${storyId}')`);
  check("apply_item_effect: non-consommable refusé", false);
} catch (e) {
  check("apply_item_effect: non-consommable refusé", e.message.includes("item_not_consumable"), e.message);
}

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
// Bilan
// ---------------------------------------------------------------
const failed = results.filter((x) => !x.ok);
console.log(`\n${failed.length === 0 ? "🎉" : "⚠️"} ${results.length - failed.length}/${results.length} tests OK`);
process.exit(failed.length === 0 ? 0 : 1);
