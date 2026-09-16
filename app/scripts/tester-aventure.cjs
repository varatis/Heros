#!/usr/bin/env node
/**
 * Joue automatiquement N parties de Loup Solitaire 01 avec le moteur réel.
 * Sert de test de non-régression : graphe, combats, jets de hasard, fins.
 *
 *   node scripts/tester-aventure.cjs [nombreDeParties]
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
const { LS01 } = require(path.join(racine, "content", "lonewolf", "ls01", "index.ts"));
const engine = require(path.join(racine, "lib", "lonewolf", "engine.ts"));
const rules = require(path.join(racine, "lib", "lonewolf", "rules.ts"));

const DISCIPLINES = rules.DISCIPLINES.map((d) => d.id);
const alea = (n) => Math.floor(Math.random() * n);
const nombre = () => alea(10);

function melanger(t) {
  const c = [...t];
  for (let i = c.length - 1; i > 0; i--) {
    const j = alea(i + 1);
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function jouerUnePartie() {
  const disciplines = melanger(DISCIPLINES).slice(0, 5);
  const armeMaitrisee = disciplines.includes("maitrise-armes")
    ? rules.ARME_PAR_TIRAGE[String(nombre())]
    : undefined;

  let etat = engine.creerAventure({
    book: LS01,
    habileteBase: 10 + nombre(),
    enduranceBase: 20 + nombre(),
    disciplines,
    armeMaitrisee,
    tirageDepart: String(nombre()),
    orDepart: nombre() === 0 ? 10 : nombre() || 1,
  });

  let etapes = 0;
  let combats = 0;
  let paragraphe = "1";
  let fin = null;

  while (etapes < 400) {
    etapes++;
    const res = engine.chargerParagraphe(etat, LS01, paragraphe);
    etat = res.state;
    const section = res.section;

    if (etat.enduranceActuelle <= 0) {
      fin = { type: "mort", raison: "Endurance à zéro" };
      break;
    }
    if (section.fin) {
      fin = { type: section.fin, nom: section.nomFin, paragraphe };
      break;
    }

    // Combat éventuel
    if (section.combat) {
      combats++;
      let enduranceEnnemi = section.combat.endurance;
      let tour = 0;
      let issue = null;
      while (tour < 60) {
        tour++;
        const r = engine.resoudreAssaut(
          etat,
          section.combat,
          enduranceEnnemi,
          nombre(),
          tour
        );
        etat = r.state;
        enduranceEnnemi = r.enduranceEnnemi;
        if (r.termine) {
          issue = r.termine;
          break;
        }
      }
      if (issue !== "victoire") {
        fin =
          issue === "mort"
            ? { type: "mort", raison: `tué par ${section.combat.nom}` }
            : { type: "mort", raison: "combat sans fin" };
        break;
      }
    }

    // Jet de hasard imposé
    if (section.evenement?.branches) {
      const r = engine.resoudreEvenement(etat, section.evenement, nombre());
      etat = r.state;
      if (r.vers) {
        paragraphe = r.vers;
        continue;
      }
    }

    // Choix
    if (section.choix?.length) {
      const possibles = section.choix.filter((c) => {
        if (!c.requis) return true;
        try {
          return engine.requiert(etat, c.requis);
        } catch {
          return false;
        }
      });
      if (possibles.length === 0) {
        fin = { type: "blocage", paragraphe };
        break;
      }
      const choix = possibles[alea(possibles.length)];
      if (choix.effets) {
        const r = engine.appliquerEffets(etat, choix.effets);
        etat = r.state;
      }
      paragraphe = choix.vers;
      continue;
    }

    if (section.suite) {
      paragraphe = section.suite;
      continue;
    }

    fin = { type: "cul-de-sac", paragraphe };
    break;
  }

  if (!fin) fin = { type: "boucle", paragraphe };
  return { fin, etapes, combats, endurance: etat.enduranceActuelle };
}

const N = parseInt(process.argv[2] ?? "300", 10);
const stats = {};
const raisons = {};
let totalEtapes = 0;
let totalCombats = 0;
let victoires = 0;

for (let i = 0; i < N; i++) {
  const r = jouerUnePartie();
  const cle = r.fin.type;
  stats[cle] = (stats[cle] ?? 0) + 1;
  if (cle === "victoire") victoires++;
  if (cle !== "victoire" && r.fin.raison) {
    raisons[r.fin.raison] = (raisons[r.fin.raison] ?? 0) + 1;
  }
  totalEtapes += r.etapes;
  totalCombats += r.combats;
}

console.log(`\n${N} parties jouées automatiquement\n`);
console.log(`  victoires      : ${victoires} (${((victoires / N) * 100).toFixed(0)} %)`);
for (const [k, v] of Object.entries(stats)) {
  if (k !== "victoire") {
    console.log(`  ${k.padEnd(14)} : ${v}`);
  }
}
console.log(`  paragraphes/partie (moy.) : ${(totalEtapes / N).toFixed(1)}`);
console.log(`  combats/partie (moy.)     : ${(totalCombats / N).toFixed(1)}`);

const blocages = (stats["blocage"] ?? 0) + (stats["cul-de-sac"] ?? 0) + (stats["boucle"] ?? 0);
if (blocages > 0) {
  console.error("\n❌ Parties bloquées :", raisons);
  process.exit(1);
}
console.log("\n✅ Aucune partie bloquée : le graphe et le moteur tiennent.\n");
