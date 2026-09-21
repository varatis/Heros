#!/usr/bin/env node
/**
 * Génère les scripts SQL du contenu (paragraphes, choix, combats) à partir des
 * données TypeScript de `content/lonewolf/`.
 *
 *   node scripts/generer-sql-contenu.cjs            # génère LS01 à LS04
 *   node scripts/generer-sql-contenu.cjs ls01       # LS01 seulement
 *   node scripts/generer-sql-contenu.cjs ls02       # LS02 seulement
 *
 *   → supabase/seed/006_contenu_ls01.sql
 *   → supabase/seed/007_contenu_ls02.sql  (catalogue lw_livres + paragraphes et étapes techniques)
 *
 * Le contenu reste embarqué dans l'application (fonctionne hors-ligne), mais ce
 * script te permet de le stocker également dans Supabase si tu préfères servir
 * les paragraphes depuis la base.
 *
 * NB : lw_sections.livre_slug référence lw_livres(slug) — le fichier LS02
 * commence donc par l'upsert de la fiche catalogue du livre.
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");

/* --- Petit chargeur TypeScript (transpilation à la volée) --- */
require.extensions[".ts"] = function (module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const resoudreOrigine = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...reste) {
  try {
    return resoudreOrigine.call(this, request, parent, ...reste);
  } catch (e) {
    if (request.startsWith(".") || request.startsWith("/")) {
      for (const ext of [".ts", ".tsx", ".js"]) {
        try {
          return resoudreOrigine.call(this, request + ext, parent, ...reste);
        } catch {
          /* on essaie l'extension suivante */
        }
      }
      throw e;
    }
    throw e;
  }
};

/* --- Chargement des livres --- */
const racine = path.join(__dirname, "..");
const { LS01 } = require(path.join(racine, "content", "lonewolf", "ls01", "index.ts"));
const { LS02 } = require(path.join(racine, "content", "lonewolf", "ls02", "index.ts"));
let LS03 = null;
try {
  LS03 = require(path.join(racine, "content", "lonewolf", "ls03", "index.ts")).LS03;
} catch (e) {
  console.warn("⚠️ LS03 non chargé :", e.message);
}
let LS04 = null;
try {
  ({ LS04 } = require(path.join(racine, "content", "lonewolf", "ls04", "index.ts")));
} catch (e) {
  console.warn("⚠️ LS04 non disponible :", e.message);
}

const FILTRE = process.argv.slice(2).find(a => !a.startsWith("--")); // ls01 | ls02 | ls03 | ls04 | undefined (tout)

/* --- Utilitaires SQL --- */
const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;
const json = (v) => (v === undefined ? "NULL" : `${q(JSON.stringify(v))}::jsonb`);
const num = (v) => (v === null || v === undefined ? "NULL" : String(v));

/** Nombre de paragraphes « officiels » du livre (hors sous-sections a/b/c). */
const nbParagraphes = (livre) =>
  Object.keys(livre.sections).filter((id) => /^\d+$/.test(id)).length;

/** Fiche catalogue lw_livres pour un livre (idempotent). */
function lignesCatalogue(livre) {
  return [
    `INSERT INTO public.lw_livres`,
    `  (slug, numero, titre, sous_titre, resume, auteur, illustration, arme_depart,`,
    `   or_depart_min, or_depart_max, nb_paragraphes, is_free, status)`,
    `VALUES (`,
    `  ${q(livre.slug)},`,
    `  ${num(livre.numero)},`,
    `  ${q(livre.titre)},`,
    `  ${q(livre.sousTitre)},`,
    `  ${q(livre.resume)},`,
    `  ${q(livre.auteur)},`,
    `  ${q(livre.illustration)},`,
    `  ${q(livre.armeDepart ?? null)},`,
    `  ${num(livre.orDepartMin)},`,
    `  ${num(livre.orDepartMax)},`,
    `  ${num(nbParagraphes(livre))},`,
    `  TRUE,`,
    `  'published'`,
    `)`,
    `ON CONFLICT (slug) DO UPDATE SET`,
    `  numero         = EXCLUDED.numero,`,
    `  titre          = EXCLUDED.titre,`,
    `  sous_titre     = EXCLUDED.sous_titre,`,
    `  resume         = EXCLUDED.resume,`,
    `  auteur         = EXCLUDED.auteur,`,
    `  illustration   = EXCLUDED.illustration,`,
    `  arme_depart    = EXCLUDED.arme_depart,`,
    `  or_depart_min  = EXCLUDED.or_depart_min,`,
    `  or_depart_max  = EXCLUDED.or_depart_max,`,
    `  nb_paragraphes = EXCLUDED.nb_paragraphes,`,
    `  status         = EXCLUDED.status,`,
    `  updated_at     = NOW();`,
  ].join("\n");
}

/** Sections lw_sections pour un livre. */
function lignesSections(livre) {
  const out = [
    `DELETE FROM public.lw_sections WHERE livre_slug = ${q(livre.slug)};`,
    "",
  ];
  let compteur = 0;
  for (const section of Object.values(livre.sections)) {
    const valeurs = [
      q(livre.slug),
      q(section.id),
      q(section.titre),
      q(section.image),
      q(section.texte),
      q(section.suite),
      json(section.choix),
      json(section.combat),
      json(section.evenement),
      json(section.effets),
      q(section.fin),
      q(section.nomFin),
    ].join(", ");
    out.push(
      `INSERT INTO public.lw_sections (livre_slug, numero, titre, image, texte, suite, choix, combat, evenement, effets, fin, nom_fin) VALUES (${valeurs});`
    );
    compteur++;
  }
  out.push("");
  out.push(`-- Contrôle :`);
  out.push(
    `-- SELECT COUNT(*) FROM public.lw_sections WHERE livre_slug = ${q(livre.slug)}; -- attendu : ${compteur}`
  );
  return { lignes: out, compteur };
}

function generer(livre, nomFichier, titreLivre, avecCatalogue) {
  const lignes = [];
  lignes.push(
    "-- ============================================================================",
    `--  HEROBOOK — Contenu ${titreLivre} (généré automatiquement)`,
    "--  Ne pas modifier à la main : régénérer avec",
    "--      node scripts/generer-sql-contenu.cjs",
    "--  À exécuter dans Supabase → SQL Editor (après les migrations 004+).",
    "-- ============================================================================",
    "",
    "BEGIN;",
    ""
  );
  if (avecCatalogue) {
    lignes.push("-- 1. Fiche catalogue du livre (lw_sections y fait référence).", "");
    lignes.push(lignesCatalogue(livre), "");
  }
  lignes.push("-- Paragraphes", "");
  const { lignes: lignesS, compteur } = lignesSections(livre);
  lignes.push(...lignesS);
  if (livre.slug === "loup-solitaire-02") {
    const source = require("../../content/stories/ls02-source-verifiee.json");
    lignes.splice(1, 0, `-- Source PDF SHA-256 : ${source.sha256}`,
      "-- 350 paragraphes intégraux + étapes techniques de combats séquentiels.",
      "-- Remplace UNIQUEMENT loup-solitaire-02 ; ne supprime aucune sauvegarde.",
      "-- Déployer aussi le moteur livré avec ce SQL. Les anciennes parties LS02 sont incompatibles.",
      "-- Voir AUDIT_LS02.md : couverture, conventions et limites de vérification.");
    lignes.push(`
-- Assertions exécutables : une erreur annule toute la transaction.
DO $ls02$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.lw_sections WHERE livre_slug = 'loup-solitaire-02';
  IF n <> ${compteur} THEN RAISE EXCEPTION 'LS02 : % lignes, attendu ${compteur}', n; END IF;
  IF EXISTS (SELECT 1 FROM generate_series(1,350) AS p(n)
    WHERE NOT EXISTS (SELECT 1 FROM public.lw_sections s
      WHERE s.livre_slug = 'loup-solitaire-02' AND s.numero = p.n::text))
    THEN RAISE EXCEPTION 'LS02 : paragraphe officiel manquant'; END IF;
  IF EXISTS (
    WITH sorties AS (
      SELECT s.numero, s.suite AS cible FROM public.lw_sections s WHERE s.livre_slug = 'loup-solitaire-02'
      UNION ALL SELECT s.numero, c->>'vers' FROM public.lw_sections s,
        LATERAL jsonb_array_elements(COALESCE(s.choix,'[]'::jsonb)) c WHERE s.livre_slug = 'loup-solitaire-02'
      UNION ALL SELECT s.numero, c->>'vers' FROM public.lw_sections s,
        LATERAL jsonb_array_elements(COALESCE(s.combat->'fuite','[]'::jsonb)) c WHERE s.livre_slug = 'loup-solitaire-02'
      UNION ALL SELECT s.numero, s.combat->>'defaiteVers' FROM public.lw_sections s WHERE s.livre_slug = 'loup-solitaire-02'
      UNION ALL SELECT s.numero, b.value->>'vers' FROM public.lw_sections s,
        LATERAL jsonb_each(COALESCE(s.evenement->'branches','{}'::jsonb)) b WHERE s.livre_slug = 'loup-solitaire-02'
    ) SELECT 1 FROM sorties x WHERE x.cible IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.lw_sections s WHERE s.livre_slug = 'loup-solitaire-02' AND s.numero = x.cible)
  ) THEN RAISE EXCEPTION 'LS02 : renvoi cassé'; END IF;
END
$ls02$;
`);
  }
  lignes.push("COMMIT;", "");

  const dossier = path.join(racine, "supabase", "seed");
  const sortie = path.join(dossier, nomFichier);
  const text = lignes.join("\n") + "\n";
  const sorties = [sortie];
  const copies = {
    "loup-solitaire-02": "02_loup_solitaire_02_fidele_350.sql",
    "loup-solitaire-03": "03_loup_solitaire_03_fidele_350.sql",
  };
  if (copies[livre.slug]) sorties.push(path.join(racine, "../clean_sql", copies[livre.slug]));
  for (const filename of sorties) {
    if (process.argv.includes("--check")) {
      if (fs.readFileSync(filename,"utf8") !== text) throw new Error(`${filename} désynchronisé`);
    } else {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      fs.writeFileSync(filename, text, "utf8");
    }
  }
  console.log(
    `✅ ${compteur} sections ${process.argv.includes("--check") ? "vérifiées" : "écrites"} dans ${path.relative(racine, sortie)}`
  );
}

/* LS01 : fichier historique, sans upsert catalogue (géré par la migration 005). */
if (!FILTRE || FILTRE === "ls01") {
  generer(LS01, "006_contenu_ls01.sql", "Loup Solitaire 01", false);
}
/* LS02 : la fiche catalogue n'existe dans aucune migration → on l'insère ici. */
if (!FILTRE || FILTRE === "ls02") {
  generer(LS02, "007_contenu_ls02.sql", "Loup Solitaire 02 — La Traversée Infernale", true);
}
if (LS03 && (!FILTRE || FILTRE === "ls03")) {
  generer(LS03, "008_contenu_ls03.sql", "Loup Solitaire 03 — Les Grottes de Kalte", true);
}
if (LS04 && (!FILTRE || FILTRE === "ls04")) {
  generer(LS04, "009_contenu_ls04.sql", "Loup Solitaire 04 — Le Gouffre Maudit", true);
}
