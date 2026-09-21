// ============================================================
// HeroBook — ATTESTATIONS PDF ↔ BASE « Les Maîtres des Ténèbres »
// ------------------------------------------------------------
// Anti-hallucination : chaque affirmation de jeu portée par la base
// (combats, verrous, butins, pertes, messages, renvois) est prouvée
// dans le texte du PDF (pypdf, 175 pages), phrase par phrase. Toute
// valeur inventée — ou tout oubli du livre — fait échouer le test.
//
//   node scripts/test-attestations-ls01.mjs
// ============================================================

import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

import {
  attests,
  bookRenvois,
  deaccent,
  disciplineSlugOf,
  ensurePdfSections,
  loadDb,
  loadStory,
  norm,
  SECTION_KEY,
  SECTION_NUM,
  sentences,
} from "./ls01-pdf-lib.mjs";

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

console.log("\n=== 0. Extraction PDF (source de vérité) ===\n");
const sections = ensurePdfSections();
check("350 sections extraites du PDF", Object.keys(sections).length === 350);
const renvois = bookRenvois(sections);
check(
  "Calibration : 553 renvois « rendez-vous au N » (chiffre de l'audit §2.4)",
  renvois.size === 553,
  `${renvois.size} paires (source,cible)`,
);
const cited = new Set([...renvois.keys()].map((k) => Number(k.split("->")[1])));
const uncited = [];
for (let n = 1; n <= 350; n++) if (n !== 1 && !cited.has(n)) uncited.push(n);
check(
  "Calibration : seule §251 n'est jamais citée (anomalie d'édition)",
  JSON.stringify(uncited) === JSON.stringify([251]),
  `jamais citées : ${uncited.join(",")}`,
);
const noRefSections = [];
for (let n = 1; n <= 350; n++) {
  if (![...renvois.keys()].some((k) => k.startsWith(`${n}->`))) noRefSections.push(n);
}
const DEATH_SECTIONS = [
  53, 54, 60, 108, 127, 154, 185, 219, 234, 259, 271, 286, 292, 306, 309, 327,
];
check(
  "Calibration : seules les 16 morts + §350 sont sans renvoi sortant",
  JSON.stringify(noRefSections.sort((a, b) => a - b)) ===
    JSON.stringify([...DEATH_SECTIONS, 350].sort((a, b) => a - b)),
  noRefSections.join(","),
);

console.log("\n=== 1. Base + migrations Supabase conservées (PGlite) ===\n");
const db = await loadDb({ PGlite, uuid_ossp, pgcrypto });
const story = await loadStory(db);
check(
  "Base chargée : 350 sections + nœuds techniques",
  story.nodes.filter((n) => SECTION_NUM(n.node_key) !== null).length === 350,
  `${story.nodes.length} nœuds`,
);

// ============================================================
// 2. RENVOIS : chaque « rendez-vous au N » du livre est implémenté
//    (choix, Table de Hasard, fuite) et réciproquement.
// ============================================================
console.log("\n=== 2. Renvois du livre ↔ implémentations ===\n");

const implementedPairs = new Map(); // "src->tgt" -> familles
const addPair = (src, tgt, family) => {
  if (!src || !tgt) return;
  const k = `${SECTION_NUM(src)}->${SECTION_NUM(tgt)}`;
  if (!implementedPairs.has(k)) implementedPairs.set(k, new Set());
  implementedPairs.get(k).add(family);
};
for (const c of story.choices) {
  // offres auto-boucles et flux techniques : ce ne sont pas des renvois du livre
  if (c.src === c.tgt) continue;
  if (SECTION_NUM(c.src) === null || SECTION_NUM(c.tgt) === null) continue;
  addPair(c.src, c.tgt, "choix");
}
for (const n of story.nodes) {
  const md = n.metadata ?? {};
  for (const h of md.hazard_consequences ?? []) {
    if (!h.target_node_key) continue;
    // chaîne technique du §21 : la cible finale reste le §189/§312 du livre
    if (n.node_key === "section_021" && h.target_node_key === "section_021_enlisement") {
      addPair("section_021", "section_189", "hasard"); // « vous vous rendez au 189 » de la branche enlisée
      continue;
    }
    if (n.node_key.startsWith("section_021_")) {
      if (SECTION_NUM(h.target_node_key) !== null) {
        addPair("section_021", h.target_node_key, "hasard");
      }
      continue;
    }
    addPair(n.node_key, h.target_node_key, "hasard");
  }
  const flee = md.combat?.flee;
  if (flee?.target_node_key) addPair(n.node_key, flee.target_node_key, "fuite");
}

const bookKeys = new Set(renvois.keys());
const implKeys = new Set(implementedPairs.keys());
const missing = [...bookKeys].filter((k) => !implKeys.has(k)).sort();
const extra = [...implKeys].filter((k) => !bookKeys.has(k)).sort();
check(
  "Tous les 553 renvois du livre sont implémentés (choix/hasard/fuite)",
  missing.length === 0,
  missing.length ? `manquants : ${missing.join(", ")}` : "0 manquant",
);
check(
  "Aucun renvoi implémenté absent du livre",
  extra.length === 0,
  extra.length ? `en trop : ${extra.join(", ")}` : "0 surnuméraire",
);

// ============================================================
// 3. COMBATS : les 29 tableaux du livre, valeur par valeur
// ============================================================
console.log("\n=== 3. Les 29 combats du livre (annexe C) ===\n");

// [section, [[nom en base, HAB, END]…]] — valeurs relues dans le PDF
const BOOK_COMBATS = [
  [17, [["KRAAN", 16, 24]]],
  [29, [["VORDAK", 17, 25]]],
  [34, [["VORDAK", 17, 25]]],
  [43, [["OURS NOIR", 16, 10]]],
  [55, [["GLOK", 9, 9]]],
  [63, [["VIEIL HOMME FOU", 11, 10]]],
  [72, [["GLOK + LOUP MAUDIT", 15, 24]]],
  [112, [["GLOK", 13, 10], ["GLOK", 12, 10]]],
  [133, [["SERPENT AILÉ", 16, 18]]],
  [136, [["GLOK", 13, 10], ["GLOK", 12, 10]]],
  [138, [["GLOK", 13, 10], ["GLOK", 12, 10]]],
  [169, [["MONSTRES DES CRYPTES", 16, 16]]],
  [170, [["GLUÂTRE DES PROFONDEURS", 17, 7]]],
  [180, [["CHEF DES SOLDATS", 15, 22], ["SOLDAT", 13, 20], ["SOLDAT", 12, 20]]],
  [191, [["GARDE DU CORPS", 11, 21]]],
  [208, [["GLOKS", 15, 13]]],
  [220, [["GARDE DU CORPS", 11, 20]]],
  [227, [["VIPÈRE DES MARAIS", 16, 6]]],
  [229, [["KRAAN", 16, 25]]],
  [231, [["VOLEUR AU POIGNARD", 13, 20]]],
  [246, [["DRAKKARIM", 15, 23]]],
  [253, [["LOUP MAUDIT", 13, 24], ["LOUP MAUDIT", 14, 23], ["LOUP MAUDIT", 14, 22], ["LOUP MAUDIT", 15, 21]]],
  [255, [["GOURGAZ", 20, 30]]],
  [260, [["GLOK", 11, 18], ["GLOK", 12, 17]]],
  [283, [["VORDAK", 17, 25]]],
  [336, [["GLOK", 14, 11], ["GLOK", 13, 11]]],
  [339, [["VOLEUR", 13, 20]]],
  [340, [["GLOK + LOUP MAUDIT", 14, 24]]],
  [342, [["VORDAK", 18, 26]]],
];

function attestStat(sectionNum, name, skill, end) {
  const flat = norm(sections[String(sectionNum)]);
  const nameN = norm(name);
  // Formats tolérés : « NOM HABILETE: 14 ENDURANCE : 24 » (espaces parasites
  // absorbés par norm) et lignes « Premier GLOK 13 10 ».
  const a = new RegExp(`${nameN}.{0,30}habilete${skill}endurance${end}`);
  const b = new RegExp(`${nameN}[a-z]{0,15}${skill}[0-9]{0,2}${end}`);
  return a.test(flat) || b.test(flat);
}

  for (const [n, enemies] of BOOK_COMBATS) {
  const node = story.byKey.get(SECTION_KEY(n));
  const dbEnemies = node?.metadata?.combatants ?? [];
  const sameDb =
    dbEnemies.length === enemies.length &&
    enemies.every((e, i) =>
      dbEnemies[i] &&
      (dbEnemies[i].name ?? "").toUpperCase().includes(e[0].split(" ")[0]) &&
      dbEnemies[i].combat_skill === e[1] &&
      dbEnemies[i].endurance === e[2],
    );
  check(`§${n} : combattants en base = livre (${enemies.map((e) => `${e[0]} ${e[1]}/${e[2]}`).join(", ")})`, sameDb);

  for (const [name, skill, end] of enemies) {
    check(
      `§${n} : le PDF atteste ${name} ${skill}/${end}`,
      attestStat(n, name, skill, end),
    );
  }
}

// ============================================================
// 4. RÈGLES DE COMBAT SPÉCIALES (bonus/malus/immunités)
// ============================================================
console.log("\n=== 4. Modificateurs et règles spéciales attestés par le PDF ===\n");

const BOOK_RULES = [
  // [section, description, propriété attendue en base (ou null), phrase du PDF]
  [17, "-1 HAB (Kraan)", { player_skill_penalty: 1 }, "Réduisez d'un point votre total d'HABILETÉ"],
  [55, "+4 HAB (surprise)", { player_skill_bonus: 4 }, "ajouter 4 points à votre total d'HABILETÉ"],
  [136, "+1 HAB (position élevée)", { player_skill_bonus: 1 }, "ajouterez un point d'HABILETÉ"],
  [229, "-1 HAB (poussière)", { player_skill_penalty: 1 }, "réduire de 1 point votre total d'HABILETÉ"],
  [260, "-4 HAB (mains nues)", { player_skill_penalty: 4 }, "diminué de 4 points"],
  [283, "+2 HAB 1er assaut", { surprise_bonus_round_1: 2 }, "ajouter 2 points à votre total d'HABILETÉ lors du premier assaut"],
  [29, "assaut psychique Vordak", { psychic_assault: true }, "sa force mentale vous fera perdre 2 points d'HABILETÉ"],
  [34, "assaut psychique Vordak", { psychic_assault: true }, "vous devrez réduire de 2 points votre total d'HABILETÉ"],
  [283, "psychique dès l'assaut 2", { psychic_assault: true }, "Dès le deuxième assaut"],
  [342, "psychique + insensible", { psychic_assault: true, mindblast_immune: true }, "force de sa Puissance Psychique"],
  [133, "insensible Puissance Psychique", { mindblast_immune: true }, "insensible à la Discipline Kaï de la Puissance Psychique"],
  [255, "insensible Puissance Psychique", { mindblast_immune: true }, "Ce monstre est insensible à la Discipline Kaï de la Puissance Psychique"],
  [170, "insensible + -3 HAB sans torche", { mindblast_immune: true, no_torch_penalty: 3 }, "insensible aux Disciplines Kai de la Puissance Psychique"],
];

for (const [n, label, expected, phrase] of BOOK_RULES) {
  const pdfOk = attests(sections[String(n)], phrase);
  check(`§${n} : ${label} — phrase du PDF « ${phrase} »`, pdfOk);
  const node = story.byKey.get(SECTION_KEY(n));
  const enemies = node?.metadata?.combatants ?? [];
  const dbOk = enemies.some((e) =>
    Object.entries(expected).every(([k, v]) => e[k] === v),
  );
  check(`§${n} : ${label} — encodé en base`, dbOk);
}

// Torche du §170 : la pénalité ne s'applique qu'« en combat dans le noir »
check(
  "§170 : le PDF relie la pénalité à l'absence de lumière",
  attests(sections["170"], "Torche et d'un Briquet d'Amadou"),
);

// ============================================================
// 5. FUITES DE COMBAT (7) — cible et assauts obligatoires
// ============================================================
console.log("\n=== 5. Fuites du livre ===\n");

const BOOK_FLEES = [
  [43, 106, 3, "Si vous souhaitez vous échapper après avoir livré ces trois assauts obligatoires"],
  [169, 23, 1, "Après avoir livré le premier assaut (obligatoire)"],
  [180, 22, 0, "Si vous souhaitez prendre la fuite, rendez-vous au 22"],
  [191, 234, 0, "Si vous souhaitez prendre la fuite au cours du combat, vous pourrez sauter de la roulotte en vous rendant au 234"],
  [220, 234, 0, "Si vous souhaitez prendre la fuite au cours du combat, vous pouvez sauter de la roulotte en vous rendant au 234"],
  [231, 7, 2, "Vous avez le droit de prendre la fuite après avoir livré deux assauts au moins"],
  [339, 7, 0, "Vous avez le droit de prendre la fuite à tout moment en quittant la boutique pour rejoindre la grand-rue"],
];
for (const [n, tgt, minRounds, phrase] of BOOK_FLEES) {
  check(`§${n} : fuite du PDF attestée (« ${phrase} »)`, attests(sections[String(n)], phrase));
  const flee = story.byKey.get(SECTION_KEY(n))?.metadata?.combat?.flee;
  check(
    `§${n} : fuite en base → §${tgt} après ${minRounds} assaut(s)`,
    flee?.target_node_key === SECTION_KEY(tgt) && (flee?.min_rounds ?? 0) === minRounds,
    JSON.stringify(flee ?? null),
  );
}

// ============================================================
// 6. PERTES / GAINS DE LA FEUILLE D'AVENTURE (annexe F)
// ============================================================
console.log("\n=== 6. Gains automatiques (R1) ===\n");

const BOOK_GAINS = [
  [33, "couronnes", 3, "un petit sac qui contient 3 Pièces d'Or", "Vous les empochez"],
  [62, "couronnes", 28, "vous trouvez 28 Pièces d'Or", null],
  [62, "repas", 3, "provisions équivalant à trois Repas", null],
  [76, "pierre-vordak", 1, "vous la laissez tomber dans une poche de votre tunique", null],
  [94, "couronnes", 16, "12 Pièces d'Or dans la bourse du Voleur et 4 autres", null],
  [113, "laumspur", 2, "l'équivalent de 2 doses", "vous rangez dans votre Sac à Dos"],
  [124, "couronnes", 15, "vous trouvez 15 Pièces d'Or et une Clé d'Argent", null],
  [137, "pierre-vordak", 20, "Vous ramassez ces vingt Pierres", "inscrire ces Pierres Précieuses"],
  [161, "cle-or", 1, "notez-la sur votre Feuille d'Aventure", "Vous prenez la Clé"],
  [199, "repas", 1, "suffisamment de fruits pour vous faire un Repas", "Notez-le"],
  [269, "couronnes", 10, "vous offre 10 Pièces d'Or en guise de récompense", null],
  [291, "couronnes", 6, "vous découvrez dans leurs vêtements 6 Couronnes", "Vous pouvez garder l'Or"],
  [304, "pierre-vordak", 1, "vous la glissez dans votre Sac à Dos", null],
  [307, "repas", 1, "l'équivalent d'un Repas", "notez-le sur votre Feuille"],
  [349, "etoile-cristal", 1, "inscrire ce pendentif à l'Etoile de Cristal", null],
];
for (const [n, slug, qty, phrase, phrase2] of BOOK_GAINS) {
  const t = sections[String(n)];
  check(
    `§${n} : gain ${slug} ×${qty} attesté (« ${phrase} »)`,
    attests(t, phrase) && (!phrase2 || attests(t, phrase2)),
  );
  const adds = story.byKey.get(SECTION_KEY(n))?.metadata?.on_arrive?.add_items ?? [];
  check(
    `§${n} : on_arrive.add_items contient ${slug} ×${qty}`,
    adds.some((a) => a.slug === slug && (a.qty ?? 1) === qty),
    JSON.stringify(adds),
  );
}

console.log("\n=== 7. Offres facultatives, exclusif, échange (R2/R3/R4) ===\n");

const BOOK_OFFERS = [
  [15, "epee", "Vous pouvez prendre cette épée si vous le désirez"],
  [20, "sac-a-dos", "vous trouvez un Sac à Dos, de la Nourriture (l'équivalent de 2 Repas) et un Poignard"],
  [20, "repas", "Si vous souhaitez emporter l'un ou l'autre de ces objets (ou tous les trois)"],
  [20, "poignard", "Si vous souhaitez emporter l'un ou l'autre de ces objets (ou tous les trois)"],
  [62, "epee", "vous pouvez en emporter une si vous le souhaitez"],
  [124, "cle-argent", "Si vous souhaitez conserver la Clé"],
  [148, "marteau-guerre", "Vous pouvez le prendre si vous le désirez"],
  [164, "relique-potion-alether", "Vous pouvez conserver cette fiole"],
  [184, "couronnes", "Si vous souhaitez conserver l'une ou l'autre de ces trouvailles (ou toutes ensemble)"],
  [184, "epee", "vous découvrez 40 Pièces d'Or, une Epée et une quantité de nourriture équivalant à 4 Repas"],
  [184, "repas", "équivalant à 4 Repas"],
  [193, "parchemin", "un rouleau de Parchemin glissé dans la ceinture du Glok"],
  [197, "sabre", "un sabre et de 6 Pièces d'Or que vous pouvez vous approprier si tel est votre désir"],
  [197, "couronnes", "6 Pièces d'Or que vous pouvez vous approprier"],
  [243, "masse-armes", "une Masse d'Armes est posée à côté de lui"],
  [255, "epee", "L'épée du Prince repose à vos pieds"],
  [263, "couronnes", "vous trouvez 3 Pièces d'Or que vous pouvez prendre si vous le souhaitez"],
  [267, "message", "un Message écrit sur une peau d'animal"],
  [267, "poignard", "Vous pouvez conserver ce Message et ce Poignard si vous le désirez"],
  [290, "baton", "un Bâton enveloppé de cuir"],
  [291, "poignard", "prendre au choix le Poignard ou l'une des Lances"],
  [291, "lance", "prendre au choix le Poignard ou l'une des Lances"],
  [305, "lance", "une Lance de Glok"],
  [307, "marteau-guerre", "Prenez ce Marteau si vous le désirez"],
  [315, "savon-parfume", "un petit Sac de Velours qui contient 6 Pièces d'Or et un morceau de Savon Parfumé"],
  [315, "couronnes", "Vous pouvez prendre le Savon et l'Or"],
  [319, "couronnes", "vous trouvez 20 Pièces d'Or. Vous pouvez prendre ces Pièces et le Poignard si vous le désirez"],
  [319, "poignard", "Vous pouvez prendre ces Pièces et le Poignard si vous le désirez"],
  [346, "lance", "vous pouvez la prendre si vous le désirez"],
  [347, "sabre", "un Sabre et un Briquet à Amadou"],
  [347, "briquet-amadou", "Vous pouvez les prendre ainsi qu'une des Torches"],
  [347, "torches", "Vous pouvez les prendre ainsi qu'une des Torches"],
];
for (const [n, slug, phrase] of BOOK_OFFERS) {
  check(`§${n} : offre ${slug} attestée (« ${phrase} »)`, attests(sections[String(n)], phrase));
  // Offre = choix qui AJOUTE l'objet (auto-boucle ou échange vers §213)
  const offers = story.choices.filter((c) => c.src === SECTION_KEY(n));
  const ok = offers.some((o) =>
    (story.effects.filter((e) => e.choice_id === o.id)).some(
      (e) => e.effect_type === "inventory_add" && e.item_slug === slug,
    ),
  );
  check(`§${n} : offre ${slug} encodée`, ok, `choix=${offers.length}`);
}

check(
  "§307 : condition d'échange du PDF (« qu'à la condition de l'échanger contre une autre Arme »)",
  attests(sections["307"], "qu'à la condition de l'échanger contre une autre Arme que vous possédez déjà"),
);
check(
  "§291 : exclusion mutuelle du PDF (« prendre au choix »)",
  attests(sections["291"], "Vous pouvez garder l'Or et prendre au choix le Poignard ou l'une des Lances"),
);
{
  const ex = story.choices.filter((c) => c.src === "section_291" && c.src === c.tgt);
  const flags = ex.flatMap((c) =>
    story.effects.filter((e) => e.choice_id === c.id && e.effect_type === "flag_set"),
  );
  check(
    "§291 : deux choix exclusifs par le drapeau commun pris_291",
    ex.length === 2 && flags.length === 2 && flags.every((f) => f.flag_key === "pris_291"),
  );
  const exch = story.choices.find((c) => c.src === "section_307" && c.text.includes("Échanger"));
  const exchEffects = story.effects.filter((e) => e.choice_id === exch?.id);
  check(
    "§307 : échange encodé (arme_au_choix désignée + Marteau de Guerre)",
    Boolean(exch) &&
      exchEffects.some((e) => e.effect_type === "inventory_remove" && e.stat_key === "arme_au_choix") &&
      exchEffects.some((e) => e.effect_type === "inventory_add" && e.item_slug === "marteau-guerre"),
  );
  // L'échange n'est PAS une auto-boucle (il mène au §213) : vérifier aussi
  // que prendre le Marteau SANS échange n'existe pas (condition du livre).
  const freeTake = (story.choices.filter((c) => c.src === "section_307" && c.src === c.tgt))
    .flatMap((c) => story.effects.filter((e) => e.choice_id === c.id));
  check(
    "§307 : aucun « prendre le Marteau » sans contrepartie",
    !freeTake.some((e) => e.effect_type === "inventory_add" && e.item_slug === "marteau-guerre"),
  );
}

console.log("\n=== 8. Pertes désignées par le joueur (R5) ===\n");
check(
  "§144 : « c'est vous qui choisissez ce qu'on vous a volé » (PDF)",
  attests(sections["144"], "c'est vous qui choisissez ce qu'on vous a volé"),
);
check(
  "§144 : repli Arme si plus de Sac à Dos (PDF)",
  attests(sections["144"], "Si vous n'avez plus de Sac à Dos, c'est une arme qu'on vous dérobe"),
);
check(
  "§277 : « vous pouvez choisir laquelle » l'arme brisée (PDF)",
  attests(sections["277"], "seule l'une d'elles est cassée et vous pouvez choisir laquelle"),
);
{
  const l144 = story.byKey.get("section_144")?.metadata?.on_arrive?.choose_loss;
  const l277 = story.byKey.get("section_277")?.metadata?.on_arrive?.choose_loss;
  check(
    "§144 : choose_loss {backpack_item, repli weapon} en base",
    l144?.kind === "backpack_item" && l144?.fallback === "weapon",
    JSON.stringify(l144 ?? null),
  );
  check(
    "§277 : choose_loss {weapon, optional} en base",
    l277?.kind === "weapon" && l277?.optional === true,
    JSON.stringify(l277 ?? null),
  );
}

// ============================================================
// 9. VERROUS DE DISCIPLINE : liste exacte du livre (C8)
// ============================================================
console.log("\n=== 9. Verrous de Discipline (les 29 clauses du livre) ===\n");

// [section, cible, discipline, clause d'acquisition textuelle]
const BOOK_LOCKS = [
  [1, 141, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [4, 218, "sixieme_sens", "Si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [18, 114, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
  [19, 69, "orientation", "si vous maîtrisez la Discipline Kaï de l'Orientation"],
  [23, 151, "maitrise_psychique_matiere", "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière"],
  [37, 282, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
  [46, 296, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [52, 225, "communication_animale", "maîtrisez la Discipline Kaï de la Communication animale"],
  [70, 8, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [71, 65, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [83, 45, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [88, 216, "guerison", "Si vous maîtrisez la Discipline Kaï de la Guérison"],
  [91, 198, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [105, 298, "communication_animale", "Si vous maîtrisez la Discipline Kai de la Communication Animale"],
  [125, 301, "orientation", "si vous maîtrisez la Discipline Kaï de l'Orientation"],
  [128, 297, "chasse", "Si vous maîtrisez la Discipline Kaï de la Chasse"],
  [167, 178, "sixieme_sens", "si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [172, 114, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
  [211, 244, "sixieme_sens", "Si vous maîtrisez la Discipline Kaï du Sixième Sens"],
  [222, 67, "orientation", "si vous maîtrisez la Discipline Kaï du Sens de l'Orientation"],
  [235, 254, "orientation", "si vous maîtrisez la Discipline Kaï de l'Orientation"],
  [242, 166, "bouclier_psychique", "Si vous maîtrisez la Discipline Kaï du Bouclier Psychique"],
  [272, 134, "orientation", "Si vous maîtrisez la Discipline Kaï de l'Orientation"],
  [303, 237, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
  [308, 122, "communication_animale", "Si vous maîtrisez la Discipline Kaï de la Communication Animale"],
  [311, 324, "camouflage", "si vous maîtrisez la Discipline Kaï du Camouflage"],
  [334, 48, "sixieme_sens", "vous maîtrisez la Discipline Kaï du Sixième Sens et que vous souhaitez en faire usage"],
  [334, 73, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
  [341, 310, "orientation", "si vous maîtrisez la Discipline Kaï de l'Orientation"],
  // Verrous réels que l'annexe « verrous » de l'audit oubliait (preuves PDF) :
  [162, 258, "maitrise_psychique_matiere", "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière"],
  [175, 182, "camouflage", "si vous maîtrisez la Discipline Kaï du Camouflage"],
  [200, 168, "camouflage", "Si vous maîtrisez la Discipline Kaï du Camouflage"],
];

for (const [n, tgt, disc, phrase] of BOOK_LOCKS) {
  check(`§${n}→§${tgt} : clause ${disc} du PDF (« ${phrase} »)`, attests(sections[String(n)], phrase));
}

{
  // Ensemble des verrous de Discipline réellement posés en base
  const effByChoice = new Map();
  for (const e of story.effects) {
    if (!effByChoice.has(e.choice_id)) effByChoice.set(e.choice_id, []);
    effByChoice.get(e.choice_id).push(e);
  }
  const dbLocks = new Set();
  for (const c of story.choices) {
    for (const e of effByChoice.get(c.id) ?? []) {
      if (
        e.effect_type === "flag_require" &&
        e.flag_key?.startsWith("discipline_") &&
        e.flag_value !== false
      ) {
        dbLocks.add(
          `${SECTION_NUM(c.src)}->${SECTION_NUM(c.tgt)}:${disciplineSlugOf(e.flag_key)}`,
        );
      }
    }
  }
  const expected = new Set(BOOK_LOCKS.map(([n, t, d]) => `${n}->${t}:${d}`));
  const missingLocks = [...expected].filter((k) => !dbLocks.has(k)).sort();
  const extraLocks = [...dbLocks].filter((k) => !expected.has(k)).sort();
  check(
    "Base : exactement les 32 verrous de Discipline du livre (ni plus, ni moins)",
    missingLocks.length === 0 && extraLocks.length === 0,
    `manquants=[${missingLocks.join(", ")}] en trop=[${extraLocks.join(", ")}]`,
  );
  // Vérif. croisée : aucune clause « si vous maîtrisez/possédez » oubliée
  // (verbes tolérés : « rendez-vous au », « en vous rendant au », « vous
  // rendrez alors au », « Rendez-vous pour cela au » — variantes d'édition).
  let clausesOubliees = 0;
  for (let n = 1; n <= 350; n++) {
    const raw = deaccent(sections[String(n)]).replace(/\n/g, " ");
    for (const m of raw.matchAll(
      /si(?:,? enfin,?)?\s+vous\s+(?:maitrisez|possedez|avez)\s+(?:la\s+)?discipline\s+kai[^.]{0,120}?rend[a-zà-ÿ\s\-]{0,40}?au\s*u?\s*(\d{1,3})/gi,
    )) {
      const k = `${n}->${Number(m[1])}`;
      const has = BOOK_LOCKS.some(([a, b]) => `${a}->${b}` === k);
      if (!has) {
        console.log(`   ⚠️ clause non encadrée : §${k} — « ${m[0].slice(0, 100)}… »`);
        clausesOubliees++;
      }
    }
  }
  check(
    "Aucune clause d'acquisition « si vous maîtrisez/possédez » hors des 32 verrous",
    clausesOubliees === 0,
    `${clausesOubliees} clause(s) non encadrée(s)`,
  );
}

// ============================================================
// 10. CONDITIONS D'OBJET
// ============================================================
console.log("\n=== 10. Conditions d'objet ===\n");

const BOOK_OBJECT_LOCKS = [
  [9, 236, "pierre-vordak", 1, "Si vous possédez une Pierre de Vordak"],
  [12, 262, "couronnes", 10, "exige 10 Couronnes"],
  [46, 246, "couronnes", 2, "pour la somme de 2 Couronnes"],
  [23, 326, "cle-or", 1, "si vous avez une Clé d'Or"],
  [173, 158, "cle-argent", 1, "Si vous possédez une Clé d'Argent"],
  // Verrou de SÉCURITÉ ajouté par C9 (non textuel) : la Clé vient d'être
  // attribuée à l'arrivée sur §161 ; le verrou garantit qu'on ne sort pas
  // sans elle. Aucune clause conditionnelle dans le livre — assumé.
  [161, 209, "cle-or", 1, null],
];
for (const [n, tgt, slug, qty, phrase] of BOOK_OBJECT_LOCKS) {
  if (phrase) {
    check(`§${n}→§${tgt} : condition ${slug} ×${qty} du PDF (« ${phrase} »)`, attests(sections[String(n)], phrase));
  } else {
    check(`§${n}→§${tgt} : verrou de sécurité C9 assumé (hors texte, documenté)`, true);
  }
}
{
  const effByChoice = new Map();
  for (const e of story.effects) {
    if (!effByChoice.has(e.choice_id)) effByChoice.set(e.choice_id, []);
    effByChoice.get(e.choice_id).push(e);
  }
  const dbRequires = new Set();
  for (const c of story.choices) {
    for (const e of effByChoice.get(c.id) ?? []) {
      if (e.effect_type === "inventory_require") {
        dbRequires.add(`${SECTION_NUM(c.src)}->${SECTION_NUM(c.tgt)}:${e.item_slug}:${e.stat_value ?? 1}`);
      }
    }
  }
  const expected = new Set(BOOK_OBJECT_LOCKS.map(([n, t, s, q]) => `${n}->${t}:${s}:${q}`));
  const miss = [...expected].filter((k) => !dbRequires.has(k)).sort();
  const extra = [...dbRequires].filter((k) => !expected.has(k)).sort();
  check(
    "Base : exactement les conditions d'objet ci-dessus",
    miss.length === 0 && extra.length === 0,
    `manquantes=[${miss.join(", ")}] en trop=[${extra.join(", ")}]`,
  );
}

// ============================================================
// 11. REPAS OBLIGATOIRES (7 sections — T-021)
// ============================================================
console.log("\n=== 11. Repas obligatoires ===\n");
for (const n of [37, 130, 147, 168, 184, 235, 300]) {
  check(
    `§${n} : le PDF impose un Repas`,
    attests(sections[String(n)], "prendre un Repas"),
  );
  check(
    `§${n} : meal_required en base`,
    story.byKey.get(SECTION_KEY(n))?.metadata?.on_arrive?.meal_required === true,
  );
}

// ============================================================
// 12. MESSAGES D'EFFET : phrases littérales du livre (C13)
// ============================================================
console.log("\n=== 12. Messages d'effet — phrase par phrase dans le PDF ===\n");
{
  let messageCount = 0;
  for (const n of story.nodes) {
    // Les nœuds techniques du §21 partagent la prose du §21
    const num = SECTION_NUM(n.node_key) ?? (n.node_key.startsWith("section_021") ? 21 : null);
    if (num === null) continue;
    const msgs = [];
    const oa = n.metadata?.on_arrive;
    if (oa?.message) msgs.push(["on_arrive", oa.message]);
    for (const h of n.metadata?.hazard_consequences ?? []) {
      if (h.message) msgs.push(["hasard", h.message]);
    }
    for (const [where, msg] of msgs) {
      messageCount++;
      for (const s of sentences(msg)) {
        check(
          `§${num} (${where}${n.node_key !== SECTION_KEY(num) ? `/${n.node_key}` : ""}) : « ${s} » retrouvée dans le PDF`,
          attests(sections[String(num)], s),
        );
      }
    }
  }
  check(
    "32 messages d'effet au total (16 d'arrivée + 16 de Table de Hasard, pas une paraphrase)",
    messageCount === 32,
    `${messageCount} messages`,
  );
}

// ============================================================
// 13. PERTES D'ENDURANCE DU LIVRE (jets + arrivées) — valeurs
// ============================================================
console.log("\n=== 13. Pertes du livre ===\n");
check(
  "§2 : le PDF ne met AUCUNE perte sur le jet (la perte est aux §343/§276)",
  attests(sections["2"], "Si vous tirez entre 0 et 4, rendez-vous au 343") &&
    !attests(sections["2"], "perdez"),
);
check("§343 : -2 END du PDF", attests(sections["343"], "Vous perdez 2 points d'ENDURANCE"));
check("§276 : -1 END du PDF", attests(sections["276"], "Vous perdez 1 point d'ENDURANCE"));
check("§36 : -2 END sur le jet", attests(sections["36"], "Vous perdez donc 2 points d'ENDURANCE"));
check("§158 : -4 END sur le jet (6-9)", attests(sections["158"], "perdez 4 points d'ENDURANCE"));
check("§188 : Sac à Dos déchiré (0-6)", attests(sections["188"], "a déchiré de ses serres pointues la toile de votre Sac à Dos"));
check("§188 : -3 END sur le jet (7-9)", attests(sections["188"], "vous perdez 3 points d'ENDURANCE"));
check("§144 : -2 END", attests(sections["144"], "vous perdez 2 points D'ENDURANCE"));
check("§146 : -3 END", attests(sections["146"], "Vous perdez 3 points d'ENDURANCE"));
check("§162 : Sac + Armes perdus, Or conservé", attests(sections["162"], "Ils vous prennent votre Sac à Dos et vos Armes"));
check("§166 : -4 END", attests(sections["166"], "Vous perdez 4 points d'ENDURANCE"));
check("§203 : -10 END", attests(sections["203"], "Vous perdez 10 points d'ENDURANCE"));
check("§236 : -6 END et -1 HAB définitifs", attests(sections["236"], "perdu 6 points d'ENDURANCE") && attests(sections["236"], "réduit de 1 point"));
check("§304 : -2 END", attests(sections["304"], "Vous perdez aussitôt 2 points d'ENDURANCE"));
check("§308 : -1 END", attests(sections["308"], "Vous perdez 1 point d'ENDURANCE"));
check("§313 : -1 END", attests(sections["313"], "qui vous coûtent 1 point d'ENDURANCE"));
check("§320 : -2 END", attests(sections["320"], "vous avez perdu 2 points d'ENDURANCE"));
check("§212 : guérison complète", attests(sections["212"], "vous récupérez tous les points d'ENDURANCE dont vous disposiez au départ de votre mission"));

// ============================================================
// Bilan
// ============================================================
const failed = results.filter((r) => !r.ok);
console.log(
  `\n${failed.length === 0 ? "✅" : "❌"} ATTESTATIONS : ${results.length - failed.length}/${results.length} conformes` +
    (failed.length ? ` — ${failed.length} échec(s)` : ""),
);
for (const f of failed) console.log(`   ✗ ${f.name}`);
process.exit(failed.length ? 1 : 0);
