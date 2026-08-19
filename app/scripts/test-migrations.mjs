// Harness de validation des migrations HeroBook sur un vrai Postgres (PGlite/WASM)
// Reproduit l'environnement Supabase : rôles anon/authenticated/service_role,
// schéma auth.users + auth.uid(), variable request.jwt.claims.
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync } from "node:fs";

const MIG = "/home/user/Heros/app/supabase/migrations";
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
// 1. Exécuter les 4 migrations dans l'ordre
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

// ---------------------------------------------------------------
// 2. Créer un utilisateur de test + wallet
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
// Bilan
// ---------------------------------------------------------------
const failed = results.filter((x) => !x.ok);
console.log(`\n${failed.length === 0 ? "🎉" : "⚠️"} ${results.length - failed.length}/${results.length} tests OK`);
process.exit(failed.length === 0 ? 0 : 1);
