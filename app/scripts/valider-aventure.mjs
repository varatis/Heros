#!/usr/bin/env node
/**
 * Vérifie la cohérence du graphe narratif d'un livre Loup Solitaire.
 *
 * Usage : node scripts/valider-aventure.mjs
 *
 * Contrôle :
 *  1. chaque « vers » et « suite » pointe vers un paragraphe existant ;
 *  2. chaque paragraphe est atteignable depuis le paragraphe 1 ;
 *  3. les paragraphes non-terminaux proposent au moins une sortie ;
 *  4. les objets et disciplines cités existent bien dans le catalogue ;
 *  5. il existe au moins une fin « victoire » et une fin « mort ».
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ici = dirname(fileURLToPath(import.meta.url));
const dossier = join(ici, "..", "content", "lonewolf", "ls01");

const fichiers = readdirSync(dossier).filter((f) => f.startsWith("sections-"));
const positions = [];
const objetsConnus = new Set();
const disciplinesConnues = new Set();

for (const f of fichiers) {
  const src = readFileSync(join(dossier, f), "utf8");
  const blocs = src.split(/\n  \{\n/).slice(1);
  for (const bloc of blocs) {
    const id = bloc.match(/id:\s*"([^"]+)"/)?.[1];
    if (id) positions.push({ id, fichier: f, bloc });
  }
}

const rules = readFileSync(join(ici, "..", "lib", "lonewolf", "rules.ts"), "utf8");
for (const m of rules.matchAll(/id:\s*"([a-z0-9-]+)",/g)) objetsConnus.add(m[1]);

const positionsParId = new Map(positions.map((p) => [p.id, p]));
const erreurs = [];
const sorties = new Map();

function cible(section, texte) {
  if (!positionsParId.has(texte)) {
    erreurs.push(`Paragraphe ${section.id} (${section.fichier}) → "${texte}" inexistant`);
  }
}

for (const pos of positions) {
  const bloc = pos.bloc;
  const cibles = [
    ...bloc.matchAll(/vers:\s*"([^"]+)"/g),
    ...bloc.matchAll(/suite:\s*"([^"]+)"/g),
  ].map((m) => m[1]);
  sorties.set(pos.id, cibles.filter((c, i, arr) => arr.indexOf(c) === i));
  for (const c of cibles) cible(pos, c);

  // Objets référencés
  for (const m of bloc.matchAll(/\{\s*id:\s*"([a-z0-9-]+)"/g)) {
    if (!objetsConnus.has(m[1])) {
      erreurs.push(`Paragraphe ${pos.id} : objet inconnu "${m[1]}"`);
    }
  }
  // Disciplines référencées
  for (const m of bloc.matchAll(/discipline:\s*"([a-z-]+)"/g)) {
    disciplinesConnues.add(m[1]);
  }
}

// Atteignabilité depuis "1"
const vus = new Set();
const pile = ["1"];
while (pile.length) {
  const id = pile.pop();
  if (!id || vus.has(id) || !positionsParId.has(id)) continue;
  vus.add(id);
  for (const c of sorties.get(id) ?? []) pile.push(c);
}
for (const pos of positions) {
  if (!vus.has(pos.id)) erreurs.push(`Paragraphe ${pos.id} jamais atteint depuis le 1`);
}

// Sorties manquantes
for (const pos of positions) {
  const estTerminal = /fin:\s*"/.test(pos.bloc);
  const aCombatSansSuite =
    /combat:\s*\{/.test(pos.bloc) && !/suite:\s*"/.test(pos.bloc);
  if (!estTerminal && !aCombatSansSuite && (sorties.get(pos.id) ?? []).length === 0) {
    erreurs.push(`Paragraphe ${pos.id} : aucune sortie (cul-de-sac)`);
  }
}

const fins = positions.filter((p) => /fin:\s*"/.test(p.bloc));
const victoires = finsparType("victoire");
function finsparType(t) {
  return fins.filter((f) => new RegExp(`fin:\\s*"${t}"`).test(f.bloc));
}

console.log(`Paragraphes      : ${positions.length}`);
console.log(`Atteignables     : ${vus.size}`);
console.log(`Fins victoire    : ${victoires.map((f) => f.id).join(", ") || "aucune"}`);
console.log(`Fins mort        : ${finsparType("mort").map((f) => f.id).join(", ") || "aucune"}`);
console.log(`Disciplines vues : ${[...disciplinesConnues].sort().join(", ")}`);

if (victoires.length === 0) erreurs.push("Aucune fin victoire");
if (finsparType("mort").length === 0) erreurs.push("Aucune fin mort");

if (erreurs.length) {
  console.error("\n❌ " + erreurs.length + " problème(s) :");
  for (const e of erreurs) console.error("  - " + e);
  process.exit(1);
}
console.log("\n✅ Graphe narratif valide.");
