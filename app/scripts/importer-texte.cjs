#!/usr/bin/env node
/**
 * Importe le texte officiel des paragraphes dans l'application.
 *
 * Le graphe narratif (choix, combats, objets) est déjà en place : ce script ne
 * remplace que le TEXTE des paragraphes, dans
 * `content/lonewolf/ls01/textes-officiels.ts`.
 *
 * Format attendu du fichier d'entrée (une des deux formes) :
 *
 *   === 1 ===                  |   1.
 *   Texte du paragraphe…       |   Texte du paragraphe…
 *                              |
 *   === 2 ===                  |   2.
 *   Texte du paragraphe…       |   Texte du paragraphe…
 *
 * Utilisation :
 *   node scripts/importer-texte.cjs mes-textes.txt
 *   node scripts/importer-texte.cjs mes-textes.txt --verifier   (n'écrit rien)
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");

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
        } catch {}
      }
    }
    throw e;
  }
};

const racine = path.join(__dirname, "..");
const cible = path.join(racine, "content", "lonewolf", "ls01", "textes-officiels.ts");

const fichier = process.argv[2];
const verifier = process.argv.includes("--verifier");

if (!fichier) {
  console.error(
    "Usage : node scripts/importer-texte.cjs <fichier.txt> [--verifier]"
  );
  process.exit(1);
}

const brut = fs.readFileSync(path.resolve(fichier), "utf8").replace(/\r\n/g, "\n");

// --- 1. Découpage en paragraphes -----------------------------------------
const paragraphes = {};
const lignes = brut.split("\n");
let courant = null;
let tampon = [];

const finParagraphe = () => {
  if (courant !== null) {
    const texte = tampon.join("\n").trim();
    if (texte) paragraphes[courant] = texte;
  }
  tampon = [];
};

// « === 12 === », « ## 12 », « 12. » seul, ou « 12 » seul
const motifTitre = /^\s*(?:={2,}|#{1,4})?\s*\[?(\d{1,4})\]?\s*(?:={2,}|:)?\s*$/;
// « 12. Il était une fois… »
const motifEnLigne = /^\s*\[(\d{1,4})\]\s+(.*)$/;

for (const ligne of lignes) {
  const mTitre = ligne.match(motifTitre);
  const mEnLigne = ligne.match(motifEnLigne);
  if (mTitre) {
    finParagraphe();
    courant = mTitre[1];
    continue;
  }
  if (mEnLigne) {
    finParagraphe();
    courant = mEnLigne[1];
    tampon.push(mEnLigne[2]);
    continue;
  }
  if (courant !== null) tampon.push(ligne);
}
finParagraphe();

// --- 2. Contrôle face au graphe existant ---------------------------------
const { LS01_SECTIONS } = require(
  path.join(racine, "content", "lonewolf", "ls01", "index.ts")
);
const idsGraphe = new Set(LS01_SECTIONS.map((s) => String(s.id)));
const idsTexte = Object.keys(paragraphes);

const inconnus = idsTexte.filter((id) => !idsGraphe.has(id));
const manquants = [...idsGraphe].filter((id) => !paragraphes[id]);

console.log(`\nParagraphes lus       : ${idsTexte.length}`);
console.log(`Paragraphes du graphe : ${idsGraphe.size}`);
if (manquants.length) {
  console.log(`Sans texte fourni     : ${manquants.sort((a, b) => a - b).join(", ")}`);
}
if (inconnus.length) {
  console.log(`⚠ Hors graphe (ignorés pour le texte, conservés) : ${inconnus.join(", ")}`);
}

if (verifier) {
  console.log("\n--verifier : aucun fichier écrit.\n");
  process.exit(0);
}

// --- 3. Écriture du fichier TypeScript -----------------------------------
const echapper = (texte) =>
  texte
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

const corps = idsTexte
  .sort((a, b) => Number(a) - Number(b))
  .map((id) => `  "${id}": \`${echapper(paragraphes[id])}\`,`)
  .join("\n");

const contenu = `import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Textes officiels des paragraphes.
 * --------------------------------
 * Fichier généré par \`node scripts/importer-texte.cjs <fichier.txt>\`.
 * Ne pas éditer à la main : relancer le script après correction du fichier source.
 */
export const TEXTES_OFFICIELS: Record<string, string> = {
${corps}${corps ? "\n" : ""}};

/** Applique les textes importés (s'ils existent) sur les sections du graphe. */
export function avecTextes(sections: StorySection[]): StorySection[] {
  if (Object.keys(TEXTES_OFFICIELS).length === 0) return sections;
  return sections.map((s) => {
    const texte = TEXTES_OFFICIELS[s.id];
    return texte && texte.trim().length > 0 ? { ...s, texte } : s;
  });
}
`;

fs.writeFileSync(cible, contenu, "utf8");
console.log(`\n✅ Textes écrits dans ${path.relative(racine, cible)}\n`);
