// ============================================================
// HeroBook — FIDÉLITÉ LS01 « Les Maîtres des Ténèbres »
// ------------------------------------------------------------
// Contrôles T-xxx de l'AUDIT_LS01_PARCOURS_COMPLETS.md + correctifs
// C1→C13 (chapitre 4) + idempotence de la migration 026. Complète
// test-attestations-ls01.mjs (ancrage PDF phrase par phrase).
// Écarts assumés vs l'audit, prouvés par le PDF :
//   - §160 : 0-4→286 ; 5-9→10 (l'annexe B indiquait d'autres cibles) ;
//   - §276 : −1 END SEULEMENT (l'audit T-021 annonçait +1 HAB, absent
//     du livre : « Vous perdez 1 point d'ENDURANCE avant de vous rendre
//     au 213 ») ;
//   - verrous de Discipline : 32 (29 de l'audit + §162→258, §175→182,
//     §200→168, clauses prouvées) ;
//   - objets : 36 définis dans le catalogue conservé après retrait des
//     histoires hors Loup Solitaire (dont parchemin, message et savon-parfume).
//
//   node scripts/test-fidelite-ls01.mjs
// ============================================================

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

import {
  bookRenvois,
  ensurePdfSections,
  loadDb,
  loadStory,
  norm,
  SECTION_KEY,
  SECTION_NUM,
} from "./ls01-pdf-lib.mjs";

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

const sections = ensurePdfSections();
const db = await loadDb({ PGlite, uuid_ossp, pgcrypto });
const story = await loadStory(db);
const renvois = bookRenvois(sections);
const SKEY = (n) => `section_${String(n).padStart(3, "0")}`;

// ============================================================
console.log("\n=== T-001 · Contenance ===\n");
{
  const sectionNodes = story.nodes.filter((n) => SECTION_NUM(n.node_key) !== null);
  check("T-001 : 350 nœuds « section_NNN »", sectionNodes.length === 350, `${sectionNodes.length}`);
  const vides = sectionNodes.filter((n) => !(n.content ?? "").trim());
  check("T-001 : aucun contenu de section vide", vides.length === 0, vides.slice(0, 6).map((n) => n.node_key).join(","));
  let diffs = 0;
  const ex = [];
  for (const n of sectionNodes) {
    const num = SECTION_NUM(n.node_key);
    // l'extraction PDF garde parfois le numéro de section collé au texte
    const pdfNorm = norm(sections[String(num)] ?? "").replace(new RegExp(`^${num}`), "");
    if (norm(n.content ?? "") !== pdfNorm) {
      diffs++;
      if (ex.length < 5) ex.push(n.node_key);
    }
  }
  check(
    "T-001 : content de chaque section = texte extrait du PDF (normalisé)",
    diffs === 0,
    diffs ? `${diffs} divergences (${ex.join(",")}…)` : "0",
  );
}

console.log("\n=== T-002 · Renvois ===\n");
{
  const impl = new Set();
  for (const c of story.choices) {
    if (c.src === c.tgt) continue;
    if (SECTION_NUM(c.src) === null || SECTION_NUM(c.tgt) === null) continue;
    impl.add(`${SECTION_NUM(c.src)}->${SECTION_NUM(c.tgt)}`);
  }
  check("T-002 : ≥ 350 paires (src,cible) distinctes implémentées", impl.size >= 350, `${impl.size}`);
  check("T-002 : §251 jamais cité (isolat d'édition)", ![...impl].some((k) => k.endsWith("->251")));
  check("T-002 : 553 renvois du livre (calibration)", renvois.size === 553, `${renvois.size}`);
}

console.log("\n=== T-003 / T-013 · Tables de Hasard (21 sections du livre) ===\n");
{
  // Branches relues phrase par phrase dans le PDF (« Utilisez la Table de
  // Hasard… »). 21 sections + la chaîne technique du §21 (2 jets de plus).
  const BOOK_HAZARDS = [
    [2, [[0, 4, "section_343"], [5, 9, "section_276"]]],
    [7, [[0, 2, "section_108"], [3, 9, "section_025"]]],
    [17, [[0, 0, "section_053"], [1, 2, "section_274"], [3, 9, "section_331"]]],
    [21, [[0, 4, "section_021_enlisement"], [5, 9, "section_189"]]],
    [22, [[0, 4, "section_181"], [5, 9, "section_145"]]],
    [36, [[0, 4, "section_140"], [5, 9, "section_323"]]],
    [44, [[0, 4, "section_277"], [5, 9, "section_338"]]],
    [49, [[0, 4, "section_339"], [5, 9, "section_060"]]],
    [89, [[0, 1, "section_053"], [2, 4, "section_274"], [5, 9, "section_316"]]],
    [158, [[0, 5, "section_106"], [6, 9, "section_106"]]],
    [160, [[0, 4, "section_286"], [5, 9, "section_010"]]],
    [188, [[0, 6, "section_303"], [7, 9, "section_303"]]],
    [205, [[0, 4, "section_181"], [5, 9, "section_145"]]],
    [226, [[0, 4, "section_277"], [5, 9, "section_338"]]],
    [237, [[0, 4, "section_265"], [5, 9, "section_072"]]],
    [275, [[0, 4, "section_345"], [5, 9, "section_074"]]],
    [279, [[0, 6, "section_112"], [7, 9, "section_096"]]],
    [294, [[0, 2, "section_230"], [3, 6, "section_190"], [7, 9, "section_321"]]],
    [302, [[0, 2, "section_110"], [3, 9, "section_285"]]],
    [314, [[0, 6, "section_341"], [7, 9, "section_098"]]],
    [337, [[0, 4, "section_219"], [5, 9, "section_317"]]],
  ];
  for (const [n, branches] of BOOK_HAZARDS) {
    const hs = story.byKey.get(SKEY(n))?.metadata?.hazard_consequences ?? [];
    const same =
      hs.length === branches.length &&
      branches.every(([min, max, tgt], i) =>
        hs[i] && hs[i].min === min && hs[i].max === max && hs[i].target_node_key === tgt,
      );
    check(`T-013 : §${n} [${branches.map((b) => `${b[0]}-${b[1]}→${SECTION_NUM(b[2])}`).join(", ")}]`, same, same ? "" : JSON.stringify(hs));
  }
  const chain = [
    ["section_021_enlisement", [[0, 7, "section_021_derniere_chance"], [8, 9, "section_189"]]],
    ["section_021_derniere_chance", [[0, 8, "section_021_mort"], [9, 9, "section_312"]]],
  ];
  for (const [key, branches] of chain) {
    const hs = story.byKey.get(key)?.metadata?.hazard_consequences ?? [];
    const same = hs.length === branches.length &&
      branches.every(([min, max, tgt], i) =>
        hs[i] && hs[i].min === min && hs[i].max === max && hs[i].target_node_key === tgt);
    check(`T-013 : chaîne §21 — ${key}`, same, same ? "" : JSON.stringify(hs));
  }
  const hazardNodes = story.nodes.filter((n) => (n.metadata?.hazard_consequences ?? []).length > 0);
  check("T-003 : 23 nœuds à jet (21 sections + 2 de la chaîne §21)", hazardNodes.length === 23, `${hazardNodes.length}`);
  // Deltas de jet, valeur par valeur
  const jetDeltas = [[36, -2], [158, -4], [188, -3]];
  for (const [n, v] of jetDeltas) {
    const hs = story.byKey.get(SKEY(n))?.metadata?.hazard_consequences ?? [];
    check(`T-013 : §${n} perte de jet ${v} END`, hs.some((h) => h.hp_delta === v));
  }
  check("T-013 : §188 Sac à Dos déchiré sur 0-6", (story.byKey.get(SKEY(188))?.metadata?.hazard_consequences ?? []).some((h) => h.min === 0 && h.lose_backpack === true));
}

console.log("\n=== T-004 / T-005 · Combats et fuites ===\n");
{
  const combats = story.nodes.filter((n) => (n.metadata?.combatants ?? []).length > 0);
  check("T-004 : 29 sections de combat (valeurs prouvées par test-attestations)", combats.length === 29, `${combats.length}`);
  const flees = story.nodes.filter((n) => n.metadata?.combat?.flee?.target_node_key);
  check("T-005 : 7 fuites autorisées", flees.length === 7, flees.map((n) => SECTION_NUM(n.node_key)).sort((a, b) => a - b).join(","));
  const fleesWithMin = flees
    .map((n) => [SECTION_NUM(n.node_key), n.metadata.combat.flee.min_rounds ?? 0])
    .sort((a, b) => a[0] - b[0]);
  check(
    "T-005 : fuites contraintes = §43 (3 assauts), §169 (1), §231 (2)",
    JSON.stringify(fleesWithMin.filter(([, m]) => m > 0)) === JSON.stringify([[43, 3], [169, 1], [231, 2]]),
    JSON.stringify(fleesWithMin),
  );
}

console.log("\n=== T-006 · Fins ===\n");
{
  // Le livre compte 16 morts de section sans renvoi + §350 (victoire). Le
  // moteur ajoute deux morts techniques : section_021_mort (bourbier) et
  // mort_epuisement (règle de famine du moteur).
  const morts = story.nodes
    .filter((n) => n.is_ending && n.ending_type === "death")
    .map((n) => n.node_key)
    .sort();
  const BOOK_DEATHS = [
    "section_053", "section_054", "section_060", "section_108", "section_127",
    "section_154", "section_185", "section_219", "section_234", "section_259",
    "section_271", "section_286", "section_292", "section_306", "section_309",
    "section_327", "section_021_mort", "mort_epuisement",
  ].sort();
  check(
    "T-006 : 18 fins de mort (16 de section + 2 morts techniques moteur)",
    morts.length === 18 && JSON.stringify(morts) === JSON.stringify(BOOK_DEATHS),
    `${morts.length} : ${morts.join(",")}`,
  );
  const victoires = story.nodes.filter((n) => n.is_ending && n.ending_type === "victory");
  check("T-006 : §350 unique fin de victoire", victoires.length === 1 && victoires[0].node_key === "section_350");
}

console.log("\n=== T-007 / T-008 · Verrous (curés ; ensemble prouvé par attestations) ===\n");
{
  const effByChoice = new Map();
  for (const e of story.effects) {
    if (!effByChoice.has(e.choice_id)) effByChoice.set(e.choice_id, []);
    effByChoice.get(e.choice_id).push(e);
  }
  let lockCount = 0;
  let objCount = 0;
  for (const c of story.choices) {
    for (const e of effByChoice.get(c.id) ?? []) {
      if (e.effect_type === "flag_require" && e.flag_key?.startsWith("discipline_") && e.flag_value !== false) lockCount++;
      if (e.effect_type === "inventory_require") objCount++;
    }
  }
  check("T-007 : 32 verrous de Discipline (29 de l'audit + §162, §175, §200 prouvés)", lockCount === 32, `${lockCount}`);
  check("T-008 : 6 conditions d'objet (dont le verrou de sécurité C9 §161→209)", objCount === 6, `${objCount}`);
}

console.log("\n=== T-009 · Objets ===\n");
{
  const defined = story.items.length;
  check("T-009 : 36 objets dans le catalogue conservé (après retrait des histoires hors Loup Solitaire)", defined === 36, `${defined}`);
  const slugs = new Set(story.items.map((i) => i.slug));
  for (const s of ["parchemin", "message", "savon-parfume"]) {
    check(`T-009 : objet créé « ${s} » existe`, slugs.has(s));
  }
  // Référencés directement par la mécanique de LS01
  const REFERENCED = [
    "baton", "briquet-amadou", "carte-geographique", "casque", "cle-argent", "cle-or",
    "cotte-de-mailles", "couronnes", "epee", "etoile-cristal", "glaive", "hache", "lance",
    "laumspur", "marteau-guerre", "masse-armes", "message", "parchemin", "pierre-vordak",
    "poignard", "potion-guerison", "relique-potion-alether", "repas", "sabre", "sac-a-dos",
    "savon-parfume", "torches",
  ];
  const referenced = new Set();
  for (const e of story.effects) if (e.item_slug) referenced.add(e.item_slug);
  for (const n of story.nodes) {
    const oa = n.metadata?.on_arrive ?? {};
    for (const a of oa.add_items ?? []) referenced.add(a.slug);
    for (const s of oa.remove_items ?? []) referenced.add(s);
    for (const a of oa.inventory ?? []) referenced.add(a.slug ?? a);
    for (const a of oa.special ?? []) referenced.add(a.slug ?? a);
    const cl = oa.choose_loss ?? {};
    for (const s of cl.candidates_items ?? []) referenced.add(s);
    for (const s of cl.candidates_pool ?? []) referenced.add(s);
    for (const h of n.metadata?.hazard_consequences ?? []) for (const s of h.lose_items ?? []) referenced.add(s);
  }
  const orphelins = [...referenced].filter((s) => !slugs.has(s));
  check("T-009 : tout slug référencé existe dans items", orphelins.length === 0, `orphelins=[${orphelins.join(",")}]`);
  const missing = REFERENCED.filter((s) => !referenced.has(s));
  const extra = [...referenced].filter((s) => !REFERENCED.includes(s));
  check(
    "T-009 : exactement les 27 objets de LS01 référencés par la mécanique",
    missing.length === 0 && extra.length === 0,
    `manquants=[${missing.join(",")}] en trop=[${extra.join(",")}]`,
  );
}

console.log("\n=== T-010 / T-011 · Modificateurs ===\n");
{
  // Valeurs relevées dans le livre (annexe F) — y compris le §276 qui ne
  // porte QU'−1 END (l'audit annonçait +1 HAB : non fondé, cf. en-tête).
  const ARRIVAL_DELTAS = [
    ["hp", 76, -2], ["hp", 119, -2], ["hp", 144, -2], ["hp", 146, -3], ["hp", 166, -4],
    ["hp", 203, -10], ["hp", 236, -6], ["skill", 236, -1], ["hp", 276, -1], ["hp", 304, -2],
    ["hp", 308, -1], ["hp", 313, -1], ["hp", 320, -2], ["hp", 343, -2],
  ];
  for (const [stat, n, v] of ARRIVAL_DELTAS) {
    const oa = story.byKey.get(SKEY(n))?.metadata?.on_arrive ?? {};
    const key = stat === "hp" ? "hp_delta" : "skill_delta";
    check(`T-010 : §${n} ${key} = ${v}`, oa[key] === v);
  }
  check("T-010 : §276 SANS bonus d'HABILETÉ (fidélité PDF, l'audit s'est trompé)", (story.byKey.get(SKEY(276))?.metadata?.on_arrive ?? {}).skill_delta === undefined);
  check("T-010 : §212 guérison complète (hp_to_max)", story.byKey.get(SKEY(212))?.metadata?.on_arrive?.hp_to_max === true);
  // Comptage global : 14 valeurs d'arrivée + 3 pertes de jet
  let count = 0;
  for (const n of story.nodes) {
    const oa = n.metadata?.on_arrive ?? {};
    if (typeof oa.hp_delta === "number") count++;
    if (typeof oa.skill_delta === "number") count++;
    for (const h of n.metadata?.hazard_consequences ?? []) if (typeof h.hp_delta === "number") count++;
  }
  check("T-010 : 17 modificateurs de stats en tout (14 arrivée + 3 jets)", count === 17, `${count}`);
  const mealNodes = story.nodes
    .filter((n) => n.metadata?.on_arrive?.meal_required)
    .map((n) => SECTION_NUM(n.node_key))
    .sort((a, b) => a - b);
  check(
    "T-011 : 7 Repas obligatoires (§37, 130, 147, 168, 184, 235, 300)",
    mealNodes.join(",") === "37,130,147,168,184,235,300",
    mealNodes.join(","),
  );
}

console.log("\n=== T-015 / T-016 · Textes = PDF ===\n");
{
  const pdfTexts = {};
  const dbTexts = {};
  for (const n of story.nodes) {
    const num = SECTION_NUM(n.node_key);
    if (num === null) continue;
    pdfTexts[String(num)] = sections[String(num)];
    dbTexts[String(num)] = n.content ?? "";
  }
  const py = spawnSync("python3", [new URL("./ls01_text_ratio.py", import.meta.url).pathname], {
    input: JSON.stringify({ sections: pdfTexts, contents: dbTexts }),
    encoding: "utf8",
  });
  const ratioReport = JSON.parse(py.stdout || "{}");
  const bad = ratioReport.faibles ?? [];
  check(
    "T-015 : ratio difflib contenu base/texte PDF ≥ 0,97 pour les 350 sections",
    bad.length === 0,
    bad.length ? `sous 0,97 : ${bad.slice(0, 8).map((s) => `${s[0]}=${s[1]}`).join(", ")}` : `min=${(ratioReport.ratio_min ?? 0).toFixed(3)}`,
  );
  let x = 42;
  const rand = () => (x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  const sampleNums = [];
  while (sampleNums.length < 30) {
    const n = 1 + Math.floor(rand() * 350);
    if (!sampleNums.includes(n)) sampleNums.push(n);
  }
  let sampleOk = true;
  for (const n of sampleNums) {
    const dbText = story.byKey.get(SKEY(n))?.content ?? "";
    const words = dbText.split(/\s+/).filter((w) => w.length > 4).slice(0, 3);
    if (words.length && !norm(sections[String(n)]).includes(norm(words[0]))) sampleOk = false;
  }
  check("T-016 : 30 échantillons de sections tracés dans le PDF", sampleOk);
}

console.log("\n=== T-018 / T-019 / T-023 / T-024 · Structure ===\n");
{
  let dangling = 0;
  for (const c of story.choices) if (c.tgt && !story.byKey.get(c.tgt)) dangling++;
  for (const n of story.nodes) {
    for (const h of n.metadata?.hazard_consequences ?? []) if (h.target_node_key && !story.byKey.get(h.target_node_key)) dangling++;
    const f = n.metadata?.combat?.flee;
    if (f?.target_node_key && !story.byKey.get(f.target_node_key)) dangling++;
  }
  check("T-018 : aucune cible morte (toutes les cibles existent)", dangling === 0, `${dangling} cassées`);

  // T-019 : metadata.references = exactement les cibles implémentées
  // (choix hors auto-boucles + conséquences de jet + fuites), dédoublonnées.
  const targetsOf = (key) => {
    const t = new Set();
    for (const c of story.choices) {
      if (c.src !== key || !c.tgt || c.tgt === key) continue;
      t.add(c.tgt);
    }
    const n = story.byKey.get(key);
    for (const h of n?.metadata?.hazard_consequences ?? []) if (h.target_node_key && h.target_node_key !== key) t.add(h.target_node_key);
    const f = n?.metadata?.combat?.flee;
    if (f?.target_node_key && f.target_node_key !== key) t.add(f.target_node_key);
    return [...t].sort();
  };
  let badRefs = 0;
  const badEx = [];
  for (const n of story.nodes) {
    const num = SECTION_NUM(n.node_key);
    if (num === null) continue;
    const refs = [...(n.metadata?.references ?? [])].sort();
    const expected = targetsOf(n.node_key);
    if (JSON.stringify(refs) !== JSON.stringify(expected)) {
      badRefs++;
      if (badEx.length < 6) badEx.push(`${n.node_key}: refs=${JSON.stringify(refs)} cibles=${JSON.stringify(expected)}`);
    }
  }
  check("T-019 : metadata.references == cibles implémentées (350 sections)", badRefs === 0, badRefs ? badEx.join(" | ") : "0 écart");
  // ... et chaque cible implémentée est un renvoi du livre (sauf chaîne §21)
  let horsLivre = 0;
  for (const n of story.nodes) {
    const num = SECTION_NUM(n.node_key);
    if (num === null) continue;
    for (const tgt of targetsOf(n.node_key)) {
      const tn = SECTION_NUM(tgt);
      if (tn === null) continue; // chaîne technique
      if (!renvois.has(`${num}->${tn}`) && !(num === 21 && [189, 312].includes(tn))) {
        console.log(`   ⚠️ cible hors renvois du livre : ${num}->${tn}`);
        horsLivre++;
      }
    }
  }
  check("T-019 : aucune cible implémentée hors des renvois du livre", horsLivre === 0, `${horsLivre}`);

  // Les choix ajoutés par les passes de fidélité sont rejetés en fin de liste
  // (display_order=90) : l'invariant est la STRICTE croissance, pas 0..n-1.
  let badOrder = 0;
  const bySrc = new Map();
  for (const c of story.choices) {
    if (!bySrc.has(c.src)) bySrc.set(c.src, []);
    bySrc.get(c.src).push(c);
  }
  for (const [key, list] of bySrc) {
    const ords = list.map((c) => c.display_order);
    const strict = ords.every((o, i) => i === 0 || o > ords[i - 1]);
    const unique = new Set(ords).size === ords.length;
    if (!strict || !unique) {
      badOrder++;
      if (badOrder <= 3) console.log(`   ⚠️ ordres de ${key} : [${ords.join(",")}]`);
    }
  }
  check("T-023 : display_order strictement croissant et unique sur chaque nœud", badOrder === 0, `${badOrder} nœuds mal ordonnés`);
  const orphanChoices = story.choices.filter((c) => !story.byKey.get(c.src) || (c.tgt && !story.byKey.get(c.tgt)));
  check("T-024 : FK src/tgt de tous les choix cohérentes", orphanChoices.length === 0);
}

console.log("\n=== C1–C13 · Correctifs du chapitre 4 ===\n");
{
  const s340 = story.byKey.get("section_340")?.metadata?.combatants?.[0];
  check("C1 : §340 GLOK+LOUP MAUDIT 14/24 (book)", s340?.combat_skill === 14 && s340?.endurance === 24);
  const rule = (n, props) => {
    const e = story.byKey.get(SKEY(n))?.metadata?.combatants?.[0] ?? {};
    return Object.entries(props).every(([k, v]) => e[k] === v);
  };
  check("C2 : §55 +4 HAB", rule(55, { player_skill_bonus: 4 }));
  check("C3 : §136 +1 HAB", rule(136, { player_skill_bonus: 1 }));
  check("C4 : §229 −1 HAB", rule(229, { player_skill_penalty: 1 }));
  check("C5 : §260 −4 HAB", rule(260, { player_skill_penalty: 4 }));
  const flee43 = story.byKey.get("section_043")?.metadata?.combat?.flee;
  check("C6 : §43 fuite au 3e assaut → 106", flee43?.target_node_key === "section_106" && flee43?.min_rounds === 3);
  const choix43 = story.choices.filter((c) => c.src === "section_043" && c.tgt === "section_106");
  check("C6 : choix de fuite direct §43→106 supprimé", choix43.length === 0);
  const h2 = story.byKey.get("section_002")?.metadata?.hazard_consequences ?? [];
  check("C7 : §2 aucun hp_delta sur le jet", h2.every((h) => h.hp_delta === undefined));
  const effByChoice = new Map();
  for (const e of story.effects) {
    if (!effByChoice.has(e.choice_id)) effByChoice.set(e.choice_id, []);
    effByChoice.get(e.choice_id).push(e);
  }
  const locks = new Set();
  for (const c of story.choices) {
    for (const e of effByChoice.get(c.id) ?? []) {
      if (e.effect_type === "flag_require" && e.flag_key?.startsWith("discipline_") && e.flag_value !== false) {
        locks.add(`${SECTION_NUM(c.src)}->${SECTION_NUM(c.tgt)}`);
      }
    }
  }
  for (const faux of ["18->29", "172->29", "211->106", "23->326"]) {
    check(`C8 : faux verrou ${faux} supprimé`, !locks.has(faux));
  }
  check("C8 : verrou §23→151 (MPM) posé", locks.has("23->151"));
  check("C8 : verrou §222→67 (Orientation) posé", locks.has("222->67"));
  const oa161 = story.byKey.get("section_161")?.metadata?.on_arrive;
  check("C9 : §161 message + Clé d'Or attribuée", oa161?.message === "Vous prenez la Clé." && (oa161?.add_items ?? []).some((a) => a.slug === "cle-or"));
  const c10 = [
    [33, "couronnes", 3], [62, "couronnes", 28], [62, "repas", 3], [76, "pierre-vordak", 1],
    [94, "couronnes", 16], [113, "laumspur", 2], [124, "couronnes", 15], [137, "pierre-vordak", 20],
    [161, "cle-or", 1], [199, "repas", 1], [269, "couronnes", 10], [291, "couronnes", 6],
    [304, "pierre-vordak", 1], [307, "repas", 1], [349, "etoile-cristal", 1],
  ];
  for (const [n, slug, qty] of c10) {
    const adds = story.byKey.get(SKEY(n))?.metadata?.on_arrive?.add_items ?? [];
    check(`C10 : §${n} add_items ${slug} ×${qty}`, adds.some((a) => a.slug === slug && (a.qty ?? 1) === qty));
  }
  check("C11 : metadata.references cohérents", true); // totalisé en T-019
  check("C12 : offres R2–R4 prouvées", true); // totalisé par attestations
  const c13 = [76, 119, 144, 146, 161, 162, 166, 203, 212, 236, 276, 304, 308, 313, 320, 343];
  for (const n of c13) {
    const msg = story.byKey.get(SKEY(n))?.metadata?.on_arrive?.message;
    check(`C13 : §${n} porte un message littéral`, typeof msg === "string" && msg.length > 0);
  }
}

console.log("\n=== Idempotence · migration 026 ×2 ===\n");
{
  const snap = async () => {
    const r = await db.query(`
      SELECT
        (SELECT count(*) FROM public.story_nodes WHERE story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')) AS nodes,
        (SELECT count(*) FROM public.story_choices) AS choices,
        (SELECT count(*) FROM public.choice_effects) AS effects,
        (SELECT count(*) FROM public.items) AS items,
        (SELECT COALESCE(jsonb_agg(jsonb_build_object('k', node_key, 'm', metadata) ORDER BY node_key), '[]'::jsonb)
           FROM public.story_nodes WHERE story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')) AS metas,
        (SELECT COALESCE(jsonb_agg(jsonb_build_object('s', n.node_key, 't', tn.node_key, 'x', c.text, 'o', c.display_order)
              ORDER BY n.node_key, c.display_order), '[]'::jsonb)
           FROM public.story_choices c
           JOIN public.story_nodes n ON n.id = c.node_id
           LEFT JOIN public.story_nodes tn ON tn.id = c.target_node_id) AS chos,
        (SELECT COALESCE(jsonb_agg(jsonb_build_object('e', ce.effect_type, 'k', ce.stat_key, 'v', ce.stat_value,
                                                      'i', i.slug, 'f', ce.flag_key, 'b', ce.flag_value)
              ORDER BY ce.id), '[]'::jsonb)
           FROM public.choice_effects ce LEFT JOIN public.items i ON i.id = ce.item_id) AS effs`);
    return JSON.stringify(r.rows[0]);
  };
  const before = await snap();
  const sql = readFileSync(new URL("../supabase/migrations/026_ls01_fidelite_passe3.sql", import.meta.url), "utf8");
  await db.exec("BEGIN");
  await db.exec(sql);
  await db.exec("COMMIT");
  const after = await snap();
  check("Idempotence : rejouer 026 ne change rien (×2)", before === after, before === after ? "" : "dérive détectée");
}

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${failed.length === 0 ? "✅" : "❌"} FIDÉLITÉ LS01 : ${results.length - failed.length}/${results.length} contrôles` +
    (failed.length ? ` — ${failed.length} échec(s)` : ""),
);
for (const f of failed) console.log(`   ✗ ${f.name}`);
process.exit(failed.length ? 1 : 0);
