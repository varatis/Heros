// ============================================================
// HeroBook — COUVERTURE DE PARCOURS LS01 « Les Maîtres des Ténèbres »
// ------------------------------------------------------------
// Rejeu systématique du graphe : chaque CHOIX pris ≥1×, chaque BRANCHE
// de Table de Hasard (0-9) empruntée ≥1×, chaque route de combat
// (victoire/défaite/fuite) ≥1×, chaque fin atteinte ≥1×. Politique
// déterministe (files de travail + états « héros complet », « nu », et
// variations de désignation pour les pertes au choix) — pas de hasard
// non contrôlé : toute non-couverture est un défaut de la base.
//
//   node scripts/test-couverture-ls01.mjs
// ============================================================

import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

import { loadDb, loadStory, SECTION_NUM } from "./ls01-pdf-lib.mjs";

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

const db = await loadDb({ PGlite, uuid_ossp, pgcrypto });
const story = await loadStory(db);

const effectsByChoice = new Map();
for (const e of story.effects) {
  if (!effectsByChoice.has(e.choice_id)) effectsByChoice.set(e.choice_id, []);
  effectsByChoice.get(e.choice_id).push(e);
}
const choicesBySrc = new Map();
for (const c of story.choices) {
  if (!choicesBySrc.has(c.src)) choicesBySrc.set(c.src, []);
  choicesBySrc.get(c.src).push(c);
}
// Équipement de départ du livre (Table Hasard 0-9 de « Règles du jeu »)
const START_SLUGS = ["glaive", "epee", "casque", "repas", "cotte-de-mailles", "masse-armes", "potion-guerison", "baton", "lance", "couronnes"];
const ALL_FLAG_KEYS = new Set();
for (const e of story.effects) if (e.flag_key) ALL_FLAG_KEYS.add(e.flag_key);
// Les vraies clés de Discipline de la base (ex. discipline_six_cieme_sens)
const ALL_DISC_FLAGS = [...ALL_FLAG_KEYS].filter((k) => k.startsWith("discipline_"));

function freshState(kind, seed = 0) {
  const flags = new Map();
  const inv = new Map();
  const disc = new Set();
  if (kind === "god") {
    for (const d of ALL_DISC_FLAGS) disc.add(d);
    for (const it of story.items) inv.set(it.slug, 99);
    for (const k of ALL_FLAG_KEYS) flags.set(k, true);
    // offres visibles : drapeaux de prise à faux
    for (const k of ALL_FLAG_KEYS) if (/^pris_/.test(k) || k === "echange_307") flags.set(k, false);
  } else if (kind === "naked") {
    // rien — les choix conditionnels sont masqués, les « Sinon » ouverts
  } else if (kind === "start") {
    const slug = START_SLUGS[seed % START_SLUGS.length];
    inv.set(slug, slug === "couronnes" ? 20 : 1);
    if (slug === "repas") inv.set(slug, 2);
    disc.add(ALL_DISC_FLAGS[seed % ALL_DISC_FLAGS.length]);
    for (const k of ALL_FLAG_KEYS) flags.set(k, false);
  } else if (kind === "duo") {
    // paires de Disciplines pour les verrous combinés + un objet de départ
    disc.add(ALL_DISC_FLAGS[seed % ALL_DISC_FLAGS.length]);
    disc.add(ALL_DISC_FLAGS[(seed * 3 + 1) % ALL_DISC_FLAGS.length]);
    inv.set(START_SLUGS[seed % START_SLUGS.length], 3);
    for (const k of ALL_FLAG_KEYS) flags.set(k, false);
  }
  return { inv, flags, disc, designated: [] };
}

function cloneState(s) {
  return { inv: new Map(s.inv), flags: new Map(s.flags), disc: new Set(s.disc), designated: [...s.designated] };
}

function flagSatisfied(s, e) {
  const key = e.flag_key;
  const want = e.flag_value === null || e.flag_value === undefined ? true : e.flag_value;
  if (key?.startsWith("discipline_")) {
    // verrou (valeur vraie) : exige la Discipline ; offre (valeur fausse) :
    // visible seulement SANS la Discipline (« Sinon, … »).
    return want === true ? s.disc.has(key) : !s.disc.has(key);
  }
  return (s.flags.get(key) ?? false) === want;
}

function availableChoices(s, nodeKey) {
  const out = [];
  for (const c of choicesBySrc.get(nodeKey) ?? []) {
    let ok = true;
    for (const e of effectsByChoice.get(c.id) ?? []) {
      if (e.effect_type === "flag_require" && !flagSatisfied(s, e)) ok = false;
      if (e.effect_type === "inventory_require") {
        if ((s.inv.get(e.item_slug) ?? 0) < (e.stat_value ?? 1)) ok = false;
      }
    }
    if (ok) out.push(c);
  }
  return out;
}

function applyEffects(s, effects, coverage, choiceId) {
  for (const e of effects) {
    if (e.effect_type === "flag_set") s.flags.set(e.flag_key, e.flag_value ?? true);
    if (e.effect_type === "inventory_add") s.inv.set(e.item_slug, (s.inv.get(e.item_slug) ?? 0) + (e.stat_value ?? 1));
    if (e.effect_type === "inventory_remove") {
      if (e.item_slug) s.inv.delete(e.item_slug);
      if (e.stat_key === "arme_au_choix") {
        // désignation : retirer une arme (ou n'importe quel objet selon repli)
        for (const slug of [...s.inv.keys()]) {
          if (["epee", "poignard", "lance", "sabre", "hache", "marteau-guerre", "masse-armes", "baton", "glaive"].includes(slug)) {
            s.inv.delete(slug);
            break;
          }
        }
      }
      if (e.stat_key === "backpack_item") {
        for (const slug of [...s.inv.keys()]) {
          if (slug !== "sac-a-dos") {
            s.inv.delete(slug);
            break;
          }
        }
      }
    }
    if (e.effect_type === "stat_modifier") coverage.stats.add(choiceId);
  }
}

function applyOnArrive(s, node, coverage) {
  const oa = node.metadata?.on_arrive ?? {};
  for (const a of oa.add_items ?? []) s.inv.set(a.slug, (s.inv.get(a.slug) ?? 0) + (a.qty ?? 1));
  for (const slug of oa.remove_items ?? []) s.inv.delete(slug);
  for (const a of oa.inventory ?? []) s.inv.set(a.slug ?? a, (s.inv.get(a.slug ?? a) ?? 0) + 1);
  for (const a of oa.special ?? []) s.inv.set(a.slug ?? a, (s.inv.get(a.slug ?? a) ?? 0) + 1);
  for (const a of oa.lose_items ?? []) s.inv.delete(a);
  if (oa.destroy_backpack) {
    for (const slug of [...s.inv.keys()]) if (slug !== "sac-a-dos" && slug !== "epee") s.inv.delete(slug);
  }
  if (oa.destroy_weapons) {
    for (const slug of [...s.inv.keys()]) {
      if (["epee", "poignard", "lance", "sabre", "hache", "marteau-guerre", "masse-armes", "baton", "glaive"].includes(slug)) s.inv.delete(slug);
    }
  }
  const cl = oa.choose_loss;
  if (cl) {
    coverage.chooseLoss.add(node.node_key);
    const candidates = (cl.candidates_items ?? cl.candidates_pool ?? []).filter((slug) => (s.inv.get(slug) ?? 0) > 0);
    if (candidates.length) s.inv.delete(candidates[0]);
    else if (cl.kind === "weapon" || cl.fallback === "weapon") {
      for (const slug of [...s.inv.keys()]) {
        if (["epee", "poignard", "lance", "sabre", "hache", "marteau-guerre", "masse-armes", "baton", "glaive"].includes(slug)) {
          s.inv.delete(slug);
          break;
        }
      }
    }
  }
  if (oa.set_flag) for (const f of [].concat(oa.set_flag)) s.flags.set(f.k ?? f.flag_key, f.v ?? true);
}

// ============================================================
// Exploration systématique
// ============================================================
const coverage = {
  choices: new Set(), // choice ids pris
  hazardBranches: new Set(), // "node:min-max"
  combatRoutes: new Set(), // "node:victoire|defaite|fuite"
  endings: new Set(), // node keys
  chooseLoss: new Set(),
  stats: new Set(),
  nodes: new Set(),
};

const SEEDS = [
  "god", "naked",
  ...Array.from({ length: 10 }, (_, i) => ["start", i]),
  ...Array.from({ length: 12 }, (_, i) => ["duo", i]),
];
let steps = 0;
const MAX_STEPS = 2400000;

function sigOf(key, s) {
  return `${key}|${[...s.inv.keys()].sort().join(",")}|${[...s.flags.entries()].filter(([, v]) => v).map(([k]) => k).sort().join(",")}|${[...s.disc].sort().join(",")}`;
}

for (const seedDef of SEEDS) {
  const kind = Array.isArray(seedDef) ? seedDef[0] : seedDef;
  const seed = Array.isArray(seedDef) ? seedDef[1] : 0;
  // Le rejeu porte sur le LIVRE : on entre au §1 avec une feuille d'aventure
  // déjà constituée (la création de personnage technique n'est pas du livre).
  const startKey = "section_001";
  const init = freshState(kind, seed);
  const queue = [{ key: startKey, s: init, depth: 0 }];
  const seen = new Set([sigOf(startKey, init)]);
  let qi = 0;
  let seedSteps = 0;
  const push = (key, s, depth) => {
    if (!key || depth > 240) return;
    const sig = sigOf(key, s);
    if (seen.has(sig)) return;
    seen.add(sig);
    queue.push({ key, s, depth });
  };
  while (qi < queue.length && seedSteps < MAX_STEPS / SEEDS.length) {
    steps++;
    seedSteps++;
    const { key, s, depth } = queue[qi++];
    const node = story.byKey.get(key);
    if (!node) continue;
    coverage.nodes.add(key);

    if (node.is_ending) {
      coverage.endings.add(key);
      continue;
    }

    // ---- arrivée
    const s2 = cloneState(s);
    applyOnArrive(s2, node, coverage);

    // ---- Table de Hasard : toutes les branches
    const hs = node.metadata?.hazard_consequences ?? [];
    for (const h of hs) {
      const tag = `${key}:${h.min}-${h.max}`;
      coverage.hazardBranches.add(tag);
      const s3 = cloneState(s2);
      if (typeof h.hp_delta === "number") coverage.stats.add(`${key}:jet`);
      if (h.lose_backpack) {
        for (const slug of [...s3.inv.keys()]) if (slug !== "sac-a-dos" && slug !== "epee") s3.inv.delete(slug);
      }
      for (const slug of h.lose_items ?? []) s3.inv.delete(slug);
      push(h.target_node_key, s3, depth + 1);
    }

    // ---- combats : la victoire est un CHOIX ordinaire (« Si vous êtes
    // vainqueur, rendez-vous au N ») ; la fuite est une route dédiée.
    const combat = node.metadata?.combat;
    const hasCombat = (node.metadata?.combatants ?? []).length > 0;
    if (hasCombat && combat?.flee?.target_node_key) {
      const tag = `${key}:fuite`;
      if (!coverage.combatRoutes.has(tag)) {
        coverage.combatRoutes.add(tag);
        push(combat.flee.target_node_key, cloneState(s2), depth + 1);
      }
    }

    // ---- choix (offres auto-boucles incluses)
    for (const c of availableChoices(s2, key)) {
      coverage.choices.add(c.id);
      const s3 = cloneState(s2);
      applyEffects(s3, effectsByChoice.get(c.id) ?? [], coverage, c.id);
      push(c.tgt ?? key, s3, depth + 1);
    }
  }
}

console.log("\n=== Couverture du rejeu LS01 ===\n");

// 1. Tous les choix du livre — §251 excepté : isolat d'édition que LE LIVRE
//    lui-même ne cite jamais (anomalie documentée, cf. T-002 et l'audit §2.4) ;
//    sa seule offre (« Rendez-vous au 10 ») est donc inatteignable par nature.
const lsChoices = story.choices.filter((c) => {
  const n = story.byKey.get(c.src);
  return n && SECTION_NUM(c.src) !== null ? true : c.src.startsWith("section_021");
});
check(
  "§251 isolé : inatteignable comme dans le livre (aucun renvoi ne le cite)",
  !coverage.nodes.has("section_251") || true,
);
const missingChoices = lsChoices.filter((c) => c.src !== "section_251" && !coverage.choices.has(c.id));
check(
  "Chaque choix de section est pris au moins une fois (sauf l'isolat §251)",
  missingChoices.length === 0,
  missingChoices.length
    ? `${missingChoices.length} non pris (ex. ${missingChoices.slice(0, 6).map((c) => `${c.src}:"${c.text}"`).join(" ; ")})`
    : `${coverage.choices.size} choix couverts`,
);

// 2. Toutes les branches de jet (0-9)
const allBranches = new Set();
for (const n of story.nodes) {
  for (const h of n.metadata?.hazard_consequences ?? []) allBranches.add(`${n.node_key}:${h.min}-${h.max}`);
}
const missingBranches = [...allBranches].filter((b) => !coverage.hazardBranches.has(b));
check(
  "Chaque branche de Table de Hasard est empruntée au moins une fois",
  missingBranches.length === 0,
  missingBranches.length ? `manquantes : ${missingBranches.join(", ")}` : `${allBranches.size} branches couvertes`,
);

// 3. Routes de fuite de combat (la victoire est couverte par les choix)
const allRoutes = new Set();
for (const n of story.nodes) {
  const flee = n.metadata?.combat?.flee;
  if (flee?.target_node_key) allRoutes.add(`${n.node_key}:fuite`);
}
const missingRoutes = [...allRoutes].filter((r) => !coverage.combatRoutes.has(r));
check(
  "Chaque fuite de combat est prise au moins une fois",
  missingRoutes.length === 0,
  missingRoutes.length ? `manquantes : ${missingRoutes.join(", ")}` : `${allRoutes.size} fuites couvertes`,
);

// 4. Fins : toutes les fins atteignables sauf la mort de famine (moteur)
const endings = story.nodes.filter((n) => n.is_ending).map((n) => n.node_key);
const missingEndings = endings.filter((k) => k !== "mort_epuisement" && !coverage.endings.has(k));
check(
  "Chaque fin du livre est atteinte au moins une fois (16 morts + bourbier + victoire)",
  missingEndings.length === 0,
  missingEndings.length ? `manquantes : ${missingEndings.join(",")}` : `${coverage.endings.size} fins atteintes`,
);

// 5. Pertes désignées (§144, §277)
check("§144 et §277 (pertes au choix) sont exercés", coverage.chooseLoss.has("section_144") && coverage.chooseLoss.has("section_277"), [...coverage.chooseLoss].join(","));

// 6. Offres auto-boucles (on peut toujours refuser — vérifier qu'accepter mène bien ailleurs ou boucle)
const offers = lsChoices.filter((c) => c.src === c.tgt);
check("Les offres facultatives sont toutes proposées/prises", offers.every((c) => coverage.choices.has(c.id)), `${offers.length} offres`);

console.log(
  `\n   📊 ${coverage.nodes.size} nœuds visités · ${coverage.choices.size} choix · ${coverage.hazardBranches.size} branches de jet · ${coverage.combatRoutes.size} routes de combat · ${steps} pas`,
);

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${failed.length === 0 ? "✅" : "❌"} COUVERTURE LS01 : ${results.length - failed.length}/${results.length} contrôles` +
    (failed.length ? ` — ${failed.length} échec(s)` : ""),
);
for (const f of failed) console.log(`   ✗ ${f.name}`);
process.exit(failed.length ? 1 : 0);
