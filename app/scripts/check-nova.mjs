import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const MIG = join(__dirname, "..", "supabase", "migrations");
const db = new PGlite();
await db.exec(`CREATE SCHEMA IF NOT EXISTS auth; CREATE TABLE auth.users (id uuid primary key); CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$; CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;`);
for (const f of readdirSync(MIG).filter(f=>f.endsWith('.sql')).sort()) {
  try { await db.exec(readFileSync(join(MIG,f),'utf8')); console.log(f, "OK"); } catch(e){ console.error(f, e.message.slice(0,800)); break; }
}
const rows = await db.query(`SELECT node_key, title, illustration_url, is_ending FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'nova9-andromede') ORDER BY node_key LIMIT 50`);
console.log(rows.rows.slice(0,20));
const ill = await db.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE illustration_url IS NOT NULL) as with_ill FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'nova9-andromede')`);
console.log("S2 illustrations", ill.rows[0]);
const s1ill = await db.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE illustration_url IS NOT NULL) as with_ill FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'signal-perdu-nova9')`);
console.log("S1 illustrations", s1ill.rows[0]);
const choices = await db.query(`SELECT COUNT(*) as c FROM story_choices WHERE node_id IN (SELECT id FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'nova9-andromede'))`);
console.log("S2 choices", choices.rows[0]);
const dead = await db.query(`SELECT node_key FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'nova9-andromede') AND is_ending=false AND NOT EXISTS (SELECT 1 FROM story_choices WHERE node_id = story_nodes.id) LIMIT 20`);
console.log("dead ends", dead.rows);
const sampleContent = await db.query(`SELECT node_key, LEFT(content,200) as snippet FROM story_nodes WHERE story_id = (SELECT id FROM stories WHERE slug = 'nova9-andromede') AND node_key IN ('section_001','section_050','section_150','section_231','section_310')`);
console.log(sampleContent.rows);
