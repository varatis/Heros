// Inspection ciblée : choix + effets + métadonnées d'une liste de sections.
// Usage : node scripts/inspect-sections.mjs 12 46 20 ...
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const HERE = dirname(fileURLToPath(import.meta.url));
const MIG = join(HERE, "..", "supabase", "migrations");
const WANT = process.argv.slice(2).map((x) => parseInt(x, 10));

const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
await db.exec(`
  CREATE SCHEMA IF NOT EXISTS auth;
  CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text);
  CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $fn$ SELECT NULL::uuid $fn$;
  CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN;
`);
for (const f of readdirSync(MIG).filter((x) => x.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(`${MIG}/${f}`, "utf8"));
}

const story = await db.query(`SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres'`);
const sid = story.rows[0].id;

for (const n of WANT) {
  const key = `section_${String(n).padStart(3, "0")}`;
  const nodes = await db.query(
    `SELECT id, node_key, is_ending, ending_type, metadata FROM public.story_nodes WHERE story_id = $1 AND node_key = $2`,
    [sid, key],
  );
  if (!nodes.rows.length) { console.log(`\n### ${key} : INTROUVABLE`); continue; }
  const node = nodes.rows[0];
  console.log(`\n### ${key}  is_ending=${node.is_ending} type=${node.ending_type}`);
  console.log("metadata:", JSON.stringify(node.metadata));
  const choices = await db.query(
    `SELECT c.id, c.text, c.display_order, tn.node_key AS tgt
     FROM public.story_choices c JOIN public.story_nodes tn ON tn.id = c.target_node_id
     WHERE c.node_id = $1 ORDER BY c.display_order`, [node.id]);
  for (const c of choices.rows) {
    console.log(`  choix[${c.display_order}] -> ${c.tgt} : « ${c.text} »`);
    const fx = await db.query(
      `SELECT e.effect_type, e.stat_key, e.stat_value, e.flag_key, e.flag_value, i.slug AS item
       FROM public.choice_effects e LEFT JOIN public.items i ON i.id = e.item_id
       WHERE e.choice_id = $1`, [c.id]);
    for (const e of fx.rows) {
      console.log(`      effet: ${e.effect_type} stat=${e.stat_key}=${e.stat_value} flag=${e.flag_key}=${e.flag_value} item=${e.item}`);
    }
  }
}
await db.close();
