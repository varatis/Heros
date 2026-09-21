const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const projectRoot = '/home/user/Heros/app';

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) {
    request = path.join(projectRoot, request.slice(2));
  }
  return origResolve.call(this, request, ...rest);
};

require.extensions['.ts'] = function (module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
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

const { LS02 } = require(path.join(projectRoot, 'content/lonewolf/ls02/index.ts'));
const engine = require(path.join(projectRoot, 'lib/lonewolf/engine.ts'));
const rules = require(path.join(projectRoot, 'lib/lonewolf/rules.ts'));

function rand(seed) {
  let s = seed;
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const DISCIPLINE_IDS = ['camouflage','chasse','sixieme-sens','sens-loup','puissance-psychique','bouclier-psychique','guerison','communication-animale','maitrise-arme'];

let errors = [];
let stats = { runs: 0, maxSteps: 0, endings: {}, crashes: 0 };

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

function playOne(runIdx) {
  const rnd = rand(runIdx * 7919 + 13);
  // Random disciplines (pick 5 of 9, LW rules use 5 for book 2 onward but let's just grab some)
  const shuffled = [...DISCIPLINE_IDS].sort(() => rnd() - 0.5);
  const disciplines = shuffled.slice(0, 5);

  let state;
  try {
    state = engine.creerAventure({
      book: LS02,
      habileteBase: 10 + Math.floor(rnd() * 5),
      enduranceBase: 20 + Math.floor(rnd() * 10),
      disciplines,
      orDepart: 10 + Math.floor(rnd() * 10),
      tirageDepart: String(Math.floor(rnd() * 10)),
      tirageDepart2: String(Math.floor(rnd() * 10)),
    });
  } catch (e) {
    errors.push({ run: runIdx, phase: 'creerAventure', error: e.message, stack: e.stack });
    stats.crashes++;
    return;
  }

  let section = LS02.sections[state.paragraphe];
  let steps = 0;
  const maxSteps = 2000;
  const visitedThisRun = new Set();

  while (steps < maxSteps) {
    steps++;
    if (!section) {
      errors.push({ run: runIdx, phase: 'section-lookup', error: `Section introuvable: ${state.paragraphe}`, step: steps });
      stats.crashes++;
      return;
    }

    if (section.fin) {
      stats.endings[section.fin] = (stats.endings[section.fin] || 0) + 1;
      return steps;
    }

    // Handle event (jet-hasard-table)
    if (section.evenement && section.evenement.branches) {
      const nombre = Math.floor(rnd() * 10);
      try {
        const res = engine.resoudreEvenement(state, section.evenement, nombre);
        state = res.state;
        if (res.mort) {
          stats.endings['mort-evenement'] = (stats.endings['mort-evenement'] || 0) + 1;
          return steps;
        }
        if (res.vers) {
          const loadRes = engine.chargerParagraphe(state, LS02, res.vers);
          state = loadRes.state;
          section = loadRes.section;
          if (loadRes.mort) {
            stats.endings['mort-charge'] = (stats.endings['mort-charge'] || 0) + 1;
            return steps;
          }
          continue;
        } else if (section.choix && section.choix.length > 0) {
          // Comportement réel de l'UI (JeuAventure.tsx) : si l'évènement n'a
          // pas de "vers" (ex. §308, §116 : le jet ne fait qu'appliquer un
          // gain/perte d'or), le joueur reste sur la section et choisit parmi
          // les boutons `choix` (rejouer / partir...). Ce n'est pas une erreur.
          // On simule ce choix comme pour une section normale (cf. plus bas).
        } else {
          errors.push({ run: runIdx, phase: 'evenement-no-target', error: `§${section.id}: aucune branche pour nombre=${nombre}`, step: steps });
          stats.crashes++;
          return;
        }
      } catch (e) {
        errors.push({ run: runIdx, phase: 'resoudreEvenement', section: section.id, error: e.message, stack: e.stack });
        stats.crashes++;
        return;
      }
    }

    // Handle combat
    if (section.combat) {
      const ennemi = section.combat;
      let enduranceEnnemi = ennemi.endurance;
      let tour = 0;
      let combatOver = false;
      let fled = false;
      while (!combatOver && tour < 100) {
        tour++;
        // Random chance to flee if possible (10% chance per assault, after assault 1)
        if (ennemi.fuite && ennemi.fuite.length && tour > 1 && rnd() < 0.15) {
          const f = pick(ennemi.fuite, rnd);
          fled = true;
          try {
            const loadRes = engine.chargerParagraphe(state, LS02, f.vers);
            state = loadRes.state;
            section = loadRes.section;
            if (loadRes.mort) {
              stats.endings['mort-fuite'] = (stats.endings['mort-fuite'] || 0) + 1;
              return steps;
            }
          } catch (e) {
            errors.push({ run: runIdx, phase: 'fuite-charge', section: ennemi.nom, target: f.vers, error: e.message, stack: e.stack });
            stats.crashes++;
            return;
          }
          break;
        }
        const nombre = Math.floor(rnd() * 10);
        try {
          const res = engine.resoudreAssaut(state, ennemi, enduranceEnnemi, nombre, tour);
          state = res.state;
          enduranceEnnemi = res.enduranceEnnemi;
          if (state.enduranceActuelle <= 0) {
            stats.endings['mort-combat'] = (stats.endings['mort-combat'] || 0) + 1;
            return steps;
          }
          if (enduranceEnnemi <= 0) {
            combatOver = true;
          }
        } catch (e) {
          errors.push({ run: runIdx, phase: 'resoudreAssaut', section: section.id, ennemi: ennemi.nom, error: e.message, stack: e.stack });
          stats.crashes++;
          return;
        }
      }
      if (fled) continue;
      if (!combatOver) {
        errors.push({ run: runIdx, phase: 'combat-timeout', section: section.id, ennemi: ennemi.nom, step: steps });
        stats.crashes++;
        return;
      }
      // victory -> go to suite (or choix if present, handled below)
      if (section.suite && !section.choix) {
        try {
          const loadRes = engine.chargerParagraphe(state, LS02, section.suite);
          state = loadRes.state;
          section = loadRes.section;
          if (loadRes.mort) {
            stats.endings['mort-suite'] = (stats.endings['mort-suite'] || 0) + 1;
            return steps;
          }
        } catch (e) {
          errors.push({ run: runIdx, phase: 'suite-apres-combat', section: section.id, target: section.suite, error: e.message, stack: e.stack });
          stats.crashes++;
          return;
        }
        continue;
      }
      // fallthrough to choix handling below if section.choix present
    }

    // Handle choix
    if (section.choix && section.choix.length) {
      const eligibles = section.choix.filter(c => engine.requiert(state, c.requis));
      const options = eligibles.length ? eligibles : section.choix;
      const choix = pick(options, rnd);
      if (choix.effets) {
        try {
          const res = engine.appliquerEffets(state, choix.effets, { section });
          state = res.state;
          if (res.mort) {
            stats.endings['mort-choix-effet'] = (stats.endings['mort-choix-effet'] || 0) + 1;
            return steps;
          }
        } catch (e) {
          errors.push({ run: runIdx, phase: 'appliquerEffets-choix', section: section.id, error: e.message, stack: e.stack });
          stats.crashes++;
          return;
        }
      }
      if (!choix.vers) {
        errors.push({ run: runIdx, phase: 'choix-sans-vers', section: section.id, choix: choix.texte, step: steps });
        stats.crashes++;
        return;
      }
      try {
        const loadRes = engine.chargerParagraphe(state, LS02, choix.vers);
        state = loadRes.state;
        section = loadRes.section;
        if (loadRes.mort) {
          stats.endings['mort-choix'] = (stats.endings['mort-choix'] || 0) + 1;
          return steps;
        }
      } catch (e) {
        errors.push({ run: runIdx, phase: 'charger-apres-choix', section: section.id, target: choix.vers, error: e.message, stack: e.stack });
        stats.crashes++;
        return;
      }
      continue;
    }

    // Handle suite (no choix, no combat already handled)
    if (section.suite) {
      try {
        const loadRes = engine.chargerParagraphe(state, LS02, section.suite);
        state = loadRes.state;
        section = loadRes.section;
        if (loadRes.mort) {
          stats.endings['mort-suite2'] = (stats.endings['mort-suite2'] || 0) + 1;
          return steps;
        }
      } catch (e) {
        errors.push({ run: runIdx, phase: 'charger-suite', section: section.id, target: section.suite, error: e.message, stack: e.stack });
        stats.crashes++;
        return;
      }
      continue;
    }

    // Dead end: no fin, no choix, no suite, no combat
    errors.push({ run: runIdx, phase: 'dead-end', section: section.id, step: steps });
    stats.crashes++;
    return;
  }
  if (steps >= maxSteps) {
    errors.push({ run: runIdx, phase: 'max-steps-exceeded', section: section ? section.id : '?', step: steps });
    stats.crashes++;
  }
}

const N = 500;
for (let i = 0; i < N; i++) {
  stats.runs++;
  const steps = playOne(i);
  if (steps) stats.maxSteps = Math.max(stats.maxSteps, steps);
}

console.log('=== Fuzz playthrough results ===');
console.log('Runs:', stats.runs);
console.log('Crashes/issues:', stats.crashes);
console.log('Max steps in a run:', stats.maxSteps);
console.log('Endings distribution:', JSON.stringify(stats.endings, null, 2));
console.log();
console.log('First 30 errors:');
for (const e of errors.slice(0, 30)) {
  console.log(JSON.stringify(e));
}
