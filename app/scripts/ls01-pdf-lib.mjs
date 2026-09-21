// ============================================================
// HeroBook — lib partagée des tests de fidélité LS01
// ------------------------------------------------------------
// Anti-hallucination : la SOURCE est le PDF (via pypdf). Tout
// test qui affirme une chose sur le livre doit passer par ici.
// ============================================================

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const SCRIPTS = dirname(fileURLToPath(import.meta.url));
export const MIG = join(SCRIPTS, "..", "supabase", "migrations");
export const SECTIONS_JSON = join(SCRIPTS, "_ls01_sections.json");

/** Régénère les sections depuis le PDF si besoin (pypdf, 175 pages). */
export function ensurePdfSections() {
  execFileSync("python3", [join(SCRIPTS, "ls01_pdf_sections.py")], {
    stdio: "pipe",
  });
  return JSON.parse(readFileSync(SECTIONS_JSON, "utf8"));
}

/**
 * Normalisation anti-OCR : apostrophes unifiées, diacritiques retirés,
 * casse, et retrait de TOUS les caractères non alphanumériques. Les
 * espaces parasites du Word 2007 (« rendez -vous », « prisonnie r »)
 * disparaissent avec.
 */
export function norm(s) {
  return String(s)
    .replace(/[’‘`´]/g, "'")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** « Attestation » : la phrase normalisée doit figurer dans le texte normalisé. */
export function attests(sectionText, phrase) {
  return norm(sectionText).includes(norm(phrase));
}

/** Toutes les phrases d'un message (séparées à la ponctuation forte). */
export function sentences(s) {
  return String(s)
    .split(/(?<=[.!?…])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// ------------------------------------------------------------
// Extraction des renvois « rendez-vous au N » du PDF
// (calibrée : 553 (source,cible) distincts sur les 350 sections,
//  seule §251 jamais citée — chiffres de l'audit, §2.4)
// ------------------------------------------------------------
const RENVOI_RE =
  /(?:(?:rendez|rends)(?:\s*-\s*vous|\s+vous)?|vous\s+rend(?:rez|ez|re|ant))(?:\s+(?:ensuite|alors|a\s+present|y|immediatement|aussitot|ainsi|pour\s+cela|dans\s+ce\s+cas|de\s+suite|maintenant|donc)){0,3}\s+a\s*u\s*(\d{1,3})/gi;

export function deaccent(s) {
  return String(s)
    .replace(/[’‘`´]/g, "'")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Paires {src, tgt} des renvois du livre (src/tgt en numéros de section). */
export function bookRenvois(sections) {
  const pairs = new Map();
  for (let n = 1; n <= 350; n++) {
    const raw = deaccent(sections[String(n)]).replace(/\n/g, " ");
    for (const m of raw.matchAll(RENVOI_RE)) {
      const tgt = Number(m[1]);
      if (tgt >= 1 && tgt <= 350) {
        const k = `${n}->${tgt}`;
        pairs.set(k, (pairs.get(k) ?? 0) + 1);
      }
    }
  }
  return pairs;
}

// ------------------------------------------------------------
// Disciplines Kaï : mots-clés tolérants à l'OCR
// ------------------------------------------------------------
export const DISCIPLINE_KEYS = {
  camouflage: /camouflage/i,
  chasse: /chasse/i,
  sixieme_sens: /sixi\s*e\s*me\s*sens|sixieme\s*sens/i,
  orientation: /orientation/i,
  guerison: /gu[eé]rison/i,
  maitrise_armes: /ma[iî]trise des armes/i,
  bouclier_psychique: /bouclier psychique/i,
  puissance_psychique: /puissance psychique/i,
  communication_animale: /communication animale/i,
  maitrise_psychique_matiere: /ma[iî]trise psychique de la mati[eè]re/i,
};

export function disciplineSlugOf(flagKey) {
  const bare = String(flagKey).replace(/^discipline_/, "");
  if (/six/i.test(bare)) return "sixieme_sens";
  return bare;
}

// ------------------------------------------------------------
// Établissement PGlite type Supabase + migrations dans l'ordre
// ------------------------------------------------------------
export async function loadDb({ PGlite, uuid_ossp, pgcrypto, with026Twice = false }) {
  const { readdirSync, readFileSync: rf } = await import("node:fs");
  const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE auth.users (id uuid primary key, email text, is_anonymous boolean default false, raw_user_meta_data jsonb default '{}'::jsonb);
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
    await db.exec(rf(join(MIG, f), "utf8"));
    if (with026Twice && f.startsWith("026")) {
      await db.exec(rf(join(MIG, f), "utf8")); // idempotence : rejouée telle quelle
    }
  }
  return db;
}

export async function loadStory(db, slug = "les-maitres-des-tenebres") {
  const story = (await db.query(`SELECT id FROM public.stories WHERE slug = $1`, [slug]))
    .rows[0];
  if (!story) throw new Error(`histoire ${slug} absente`);
  const nodes = (
    await db.query(
      `SELECT id, node_key, content, is_ending, ending_type, metadata
         FROM public.story_nodes WHERE story_id = $1`,
      [story.id],
    )
  ).rows;
  const byKey = new Map(nodes.map((n) => [n.node_key, n]));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const choices = (
    await db.query(
      `SELECT c.id, sn.node_key AS src, c.node_id, c.target_node_id,
              tn.node_key AS tgt, c.text, c.display_order
         FROM public.story_choices c
         JOIN public.story_nodes sn ON sn.id = c.node_id
         LEFT JOIN public.story_nodes tn ON tn.id = c.target_node_id
        WHERE sn.story_id = $1
        ORDER BY sn.node_key, c.display_order`,
      [story.id],
    )
  ).rows;
  const effects = (
    await db.query(
      `SELECT ce.choice_id, ce.effect_type, ce.stat_key, ce.stat_value,
              i.slug AS item_slug, i.item_type AS item_type, ce.flag_key, ce.flag_value
         FROM public.choice_effects ce
         JOIN public.story_choices c ON c.id = ce.choice_id
         JOIN public.story_nodes n ON n.id = c.node_id
         LEFT JOIN public.items i ON i.id = ce.item_id
        WHERE n.story_id = $1`,
      [story.id],
    )
  ).rows;
  const items = (
    await db.query(`SELECT slug, name, item_type FROM public.items`)
  ).rows;
  return { storyId: story.id, nodes, byKey, byId, choices, effects, items };
}

export const SECTION_KEY = (n) => `section_${String(n).padStart(3, "0")}`;
export const SECTION_NUM = (key) => {
  const m = /^section_(\d{3})$/.exec(key ?? "");
  return m ? Number(m[1]) : null;
};

export function effectsByChoice(effects) {
  const m = new Map();
  for (const e of effects) {
    if (!m.has(e.choice_id)) m.set(e.choice_id, []);
    m.get(e.choice_id).push(e);
  }
  return m;
}
