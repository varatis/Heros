#!/usr/bin/env node
/**
 * Génère le script SQL du contenu (paragraphes, choix, combats) à partir des
 * données TypeScript de `content/lonewolf/`.
 *
 *   node scripts/generer-sql-contenu.cjs
 *   → supabase/seed/006_contenu_ls01.sql
 *
 * Le contenu reste embarqué dans l'application (fonctionne hors-ligne), mais ce
 * script te permet de le stocker également dans Supabase si tu préfères servir
 * les paragraphes depuis la base.
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
    }
    throw e;
  }
};

/* --- Chargement du livre --- */
const racine = path.join(__dirname, "..");
const { LS01 } = require(path.join(racine, "content", "lonewolf", "ls01", "index.ts"));

/* --- Utilitaires SQL --- */
const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;
const json = (v) => (v === undefined ? "NULL" : `${q(JSON.stringify(v))}::jsonb`);
const num = (v) => (v === null || v === undefined ? "NULL" : String(v));

const lignes = [];
lignes.push("-- ============================================================================");
lignes.push("--  HEROBOOK — Contenu Loup Solitaire 01 (généré automatiquement)");
lignes.push("--  Ne pas modifier à la main : régénérer avec");
lignes.push("--      node scripts/generer-sql-contenu.cjs");
lignes.push("-- ============================================================================");
lignes.push("");
lignes.push("BEGIN;");
lignes.push("");
lignes.push(`DELETE FROM public.lw_sections WHERE livre_slug = ${q(LS01.slug)};`);
lignes.push("");

for (const section of Object.values(LS01.sections)) {
  const valeurs = [
    q(LS01.slug),
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
  lignes.push(
    `INSERT INTO public.lw_sections (livre_slug, numero, titre, image, texte, suite, choix, combat, evenement, effets, fin, nom_fin) VALUES (${valeurs});`
  );
}

lignes.push("");
lignes.push("COMMIT;");
lignes.push("");
lignes.push("-- Contrôle :");
lignes.push(`-- SELECT COUNT(*) FROM public.lw_sections WHERE livre_slug = ${q(LS01.slug)};`);

const dossier = path.join(racine, "supabase", "seed");
fs.mkdirSync(dossier, { recursive: true });
const sortie = path.join(dossier, "006_contenu_ls01.sql");
fs.writeFileSync(sortie, lignes.join("\n") + "\n", "utf8");

console.log(
  `✅ ${Object.keys(LS01.sections).length} paragraphes écrits dans ${path.relative(racine, sortie)}`
);
