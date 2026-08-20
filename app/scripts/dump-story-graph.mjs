// Dump du graphe Loup Solitaire après toutes les migrations (outil d'audit).
// Usage : node scripts/dump-story-graph.mjs > /tmp/graph_final.json
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const HERE = dirname(fileURLToPath(import.meta.url));
const MIG = join(HERE, "..", "supabase", "migrations");

const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
await db.exec(`
  CREATE SCHEMA IF NOT EXISTS auth;
  CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text);
  CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
  LANGUAGE sql STABLE AS $fn$ SELECT NULL::uuid $fn$;
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN;
`);

for (const f of readdirSync(MIG).filter((x) => x.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(`${MIG}/${f}`, "utf8"));
}
await db.exec(`
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
`);

const story = await db.query(`SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres'`);
const storyId = story.rows[0].id;
const nodes = await db.query(
  `SELECT node_key, is_ending, ending_type, metadata FROM public.story_nodes WHERE story_id = '${storyId}'`,
);
const choices = await db.query(
  `SELECT sn.node_key AS src, tn.node_key AS tgt, c.display_order
   FROM public.story_choices c
   JOIN public.story_nodes sn ON sn.id = c.node_id
   JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = '${storyId}' ORDER BY sn.node_key, c.display_order`,
);
console.log(JSON.stringify({ nodes: nodes.rows, choices: choices.rows }));
await db.close();
