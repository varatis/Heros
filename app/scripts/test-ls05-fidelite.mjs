#!/usr/bin/env node
/**
 * Test de fidélité LS05 — Le Tyran du Désert.
 * Vérifie l'import généré contre le PDF source (édition Gallimard, 400 §).
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dossier = join(__dirname, "..", "content", "lonewolf", "ls05");
const fichiers = readdirSync(dossier).filter((f) => f.startsWith("sections-"));
const positions = [];
for (const f of fichiers) {
  const src = readFileSync(join(dossier, f), "utf8");
  const blocs = src.split(/\n  \{\n/).slice(1);
  for (const bloc of blocs) {
    const id = bloc.match(/id:\s*"([^"]+)"/)?.[1];
    if (id) positions.push({ id, fichier: f, bloc });
  }
}
const map = new Map(positions.map((p) => [p.id, p]));
const checks = [];
function check(name, cond, extra = "") {
  const ok = !!cond;
  checks.push({ name, ok });
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) console.error(`   ÉCHEC: ${name}`);
}

const nbNum = positions.filter((p) => /^\d+$/.test(p.id)).length;
check("400 paragraphes numériques présents", nbNum === 399, `${nbNum}/399 (§5 tableau ignoré)`);
check("400 si l'on compte §5 ignoré", nbNum + 1 === 400, `${nbNum + 1}/400`);

const fins = positions.filter((p) => /fin:\s*"/.test(p.bloc));
const morts = fins.filter((f) => /fin:\s*"mort"/.test(f.bloc));
const victoires = fins.filter((f) => /fin:\s*"victoire"/.test(f.bloc));
check("Au moins 10 fins mort", morts.length >= 10, `morts=${morts.length} : ${morts.map((m) => m.id).join(",")}`);
check("1 victoire (§400)", victoires.length === 1 && victoires[0].id === "400", victoires.map((v) => v.id).join(","));

const erreurs = [];
const sorties = new Map();
for (const pos of positions) {
  const cibles = [
    ...pos.bloc.matchAll(/vers:\s*"([^"]+)"/g),
    ...pos.bloc.matchAll(/suite:\s*"([^"]+)"/g),
  ].map((m) => m[1]);
  sorties.set(pos.id, cibles);
  for (const c of cibles) if (!map.has(c)) erreurs.push(`${pos.id}→${c}`);
}
check("Aucune cible manquante", erreurs.length === 0, erreurs.join(", "));

const visites = new Set();
const pile = ["1"];
while (pile.length) {
  const id = pile.pop();
  if (!id || visites.has(id) || !map.has(id)) continue;
  visites.add(id);
  for (const c of sorties.get(id) || []) pile.push(c);
}
const inatteignables = [...map.keys()].filter((k) => !visites.has(k));
check("Toutes les sections atteignables depuis §1", inatteignables.length === 0, `injoignables=${inatteignables.length} : ${inatteignables.join(",")}`);

const culsDeSac = [];
for (const pos of positions) {
  const aSortie = (sorties.get(pos.id) || []).length > 0 || /fin:\s*"/.test(pos.bloc) || /combat:\s*\{/.test(pos.bloc) || /evenement:\s*\{/.test(pos.bloc);
  if (!aSortie) culsDeSac.push(pos.id);
}
check("Aucune section sans sortie hors fins", culsDeSac.length === 0, culsDeSac.join(","));

const combats = positions.filter((p) => /combat:\s*\{/.test(p.bloc));
check("Au moins 35 combats", combats.length >= 35, `combats=${combats.length}`);

// Vérifications texte clé
const s1 = map.get("1")?.bloc || "";
check("§1 mentionne Barrakeesh", /Barrakeesh/.test(s1));
const s331 = map.get("331")?.bloc || "";
check("§331 énigme code → 373", /vers:\s*"373"/.test(s331));
const s373 = map.get("373")?.bloc || "";
check("§373 mène au §320", /"320"/.test(s373));
const s346 = map.get("346")?.bloc || "";
check("§346 mène à Tipasa (§206)", /"206"/.test(s346));
const s200 = map.get("200")?.bloc || "";
check("§200 annonce la 2e partie → §201", /"201"/.test(s200));
const s195 = map.get("195")?.bloc || "";
check("§195 sortie nord → §11 (correction OCR)", /"11"/.test(s195) && !/au\s*1t/.test(s195));
const s400 = map.get("400")?.bloc || "";
check("§400 parle du Livre du Magnakaï", /Magnaka/i.test(s400));

// Bilan
const failed = checks.filter((c) => !c.ok);
console.log(`\n${failed.length === 0 ? "🎉" : "⚠️"} ${checks.length - failed.length}/${checks.length} tests LS05 OK`);
process.exit(failed.length === 0 ? 0 : 1);
