#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (m, p) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(p, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    p,
  );
const { LS01 } = require("../content/lonewolf/ls01/index.ts");
const engine = require("../lib/lonewolf/engine.ts");
const { getItem } = require("../lib/lonewolf/rules.ts");
const {
  consumeHealingPotion,
  healingAction,
  weaponAction,
  describeItem,
} = require("../lib/lonewolf/item-help.ts");
const prefs = require("../lib/lonewolf/reading-preferences.ts");
const state = engine.creerAventure({
  book: LS01,
  habileteBase: 17,
  enduranceBase: 25,
  disciplines: [
    "chasse",
    "guerison",
    "camouflage",
    "orientation",
    "maitrise-armes",
  ],
  armeMaitrisee: "epee",
  tirageDepart: "1",
  orDepart: 5,
});
state.sac = ["potion-laumspur", "potion-laumspur", "potion-alether"];
state.enduranceActuelle = engine.enduranceMax(state) - 2;
for (const phase of ["lecture", "preparation", "combat"]) {
  assert.equal(
    consumeHealingPotion(state, "potion-laumspur", phase).used,
    false,
  );
}
const heal = consumeHealingPotion(state, "potion-laumspur", "apres-combat");
assert.equal(heal.gain, 2);
assert.equal(heal.state.enduranceActuelle, engine.enduranceMax(state));
assert.equal(heal.state.sac.filter((x) => x === "potion-laumspur").length, 1);
assert.equal(
  state.sac.filter((x) => x === "potion-laumspur").length,
  2,
  "original state unchanged",
);
assert.equal(
  consumeHealingPotion(heal.state, "potion-laumspur", "apres-combat").used,
  false,
  "full health never wastes potion",
);
for (const id of ["missing", "casque", "potion-alether"])
  assert.equal(consumeHealingPotion(state, id, "apres-combat").used, false);
assert.equal(
  consumeHealingPotion({ ...state, sac: [] }, "potion-laumspur", "apres-combat")
    .used,
  false,
);
assert.equal(
  consumeHealingPotion(
    { ...state, enduranceActuelle: 0 },
    "potion-laumspur",
    "apres-combat",
  ).used,
  false,
);
assert.equal(weaponAction(state, "epee", "combat").allowed, false);
assert.equal(weaponAction(state, "glaive", "preparation").allowed, false);
assert.equal(weaponAction(state, "epee", "preparation").delta, 2);
assert.match(describeItem(getItem("casque")).effect, /maximale/);
assert.match(describeItem(getItem("potion-alether")).timing, /non disponible/);
assert.match(describeItem(getItem("repas")).timing, /automatiquement/);
assert.match(describeItem(getItem("glaive-sommer")).effect, /pas activées/);
assert.deepEqual(prefs.parseReadingPreferences(null), prefs.DEFAULT_READING);
assert.deepEqual(
  prefs.parseReadingPreferences({ fontSize: 999, theme: "bad", spacious: 0 }),
  prefs.DEFAULT_READING,
);
assert.deepEqual(
  prefs.parseReadingPreferences({
    fontSize: 22,
    theme: "night",
    spacious: false,
  }),
  { fontSize: 22, theme: "night", spacious: false },
);
const almostFull = { ...state, sac: Array(7).fill("repas") };
const pickup = engine.appliquerEffets(almostFull, {
  objets: [{ id: "potion-laumspur", quantity: 2 }],
});
assert.equal(pickup.state.sac.length, 8);
assert.equal(pickup.events.find((e) => e.kind === "objet").quantity, 1);
assert.ok(
  pickup.events.some((e) => e.kind === "info" && e.texte.includes("restants")),
);
const full = engine.appliquerEffets(
  { ...state, sac: Array(8).fill("repas") },
  { objets: [{ id: "potion-laumspur" }] },
);
assert.equal(
  full.events.filter((e) => e.kind === "objet").length,
  0,
  "a refused item is not a discovery",
);
const data = new Map();
global.window = {
  localStorage: {
    setItem: (k, v) => data.set(k, v),
    getItem: (k) => data.get(k) ?? null,
    removeItem: (k) => data.delete(k),
  },
};
const saves = require("../lib/lonewolf/sauvegarde.ts");
const encounter = {
  paragraphe: "255",
  enemyName: "Gourgaz",
  engaged: true,
  combat: { enduranceEnnemi: 22, journal: [], termine: null, bonusTemp: 0 },
};
saves.sauvegarder(state, encounter);
assert.deepEqual(saves.charger().encounter, encounter);
saves.sauvegarder(state);
assert.equal(
  saves.charger().encounter,
  undefined,
  "new adventure removes old encounter",
);
saves.effacer();
assert.equal(saves.charger(), null);
delete global.window;
console.log(
  "✅ Effets, soins sécurisés, armes, réglages et sauvegarde de rencontre.",
);
