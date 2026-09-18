#!/usr/bin/env node
/**
 * Importateur du Loup Solitaire 02 — La Traversée Infernale (350 paragraphes).
 *
 *   node scripts/ls02-importer.cjs            # génère sections + textes
 *   node scripts/ls02-importer.cjs --audit    # audit seul, n'écrit rien
 *   node scripts/ls02-importer.cjs --carte    # carte compacte des 350 § (relecture)
 *
 * Source : content/stories/ls02-texte-brut.txt (extraction PyMuPDF du PDF,
 * page par page). Le script nettoie la césure, segmente les 350 paragraphes,
 * détecte mécaniquement les choix (« rendez-vous au N »), les combats
 * (« HABILETÉ : X ENDURANCE : Y »), les jets de Table de Hasard et les fins,
 * puis applique les correctifs éditoriaux de ls02-overrides.json :
 *   - app/content/lonewolf/ls02/textes.json
 *   - app/content/lonewolf/ls02/sections-XXX.ts
 * Chaque patch éditorial est tracé dans l'audit : rien n'est corrigé en
 * silence. Les effets mécaniques (dégâts, objets, or) ne sont JAMAIS
 * devinés automatiquement : ils sont posés à la main dans les overrides
 * après relecture.
 */
const fs = require("node:fs");
const path = require("node:path");

const racine = path.join(__dirname, "..");
const depot = path.join(racine, "..");
const brutPath = path.join(depot, "content", "stories", "ls02-texte-brut.txt");
const overridesPath = path.join(__dirname, "ls02-overrides.json");
const sortieDir = path.join(racine, "content", "lonewolf", "ls02");

const MODE_AUDIT = process.argv.includes("--audit");
const MODE_CARTE = process.argv.includes("--carte");
const audit = [];
const trace = (section, message) => audit.push({ section, message });

/* ------------------------------------------------------------------ */
/* 1. Lecture et nettoyage                                             */
/* ------------------------------------------------------------------ */

const brut = fs.readFileSync(brutPath, "utf8");
let texte = brut.replace(/===== PAGE \d+ =====/g, "\n");

/** Corrections locales de césures et de coquilles d'extraction (tracées). */
const CORRECTIONS = [
  [/ENDU-\n?RANCE/g, "ENDURANCE"],
  [/impres-\n?sionnant/g, "impressionnant"],
  [/\bdonnei\b/g, "donner"],
  [/\bcneveux\b/g, "cheveux"],
  [/\bPrend ce glaive\b/g, "Prends ce glaive"],
  [/\bM-'tat\b/g, "état"],
  // Coquilles du scan (Tome 2) :
  [/\bII faut\b/g, "Il faut"],
  [/\boour\b/g, "pour"],
  [/\baudessus\b/g, "au-dessus"],
  [/\baudessous\b/g, "au-dessous"],
  [/\bnidde-pie\b/g, "nid-de-pie"],
  [/\blaisezpasser\b/g, "laissez-passer"],
  [/\bCest une\b/g, "C'est une"],
  [/sur h mer\b/g, "sur la mer"],
  [/\s•\s*/g, " "],
  [/\bjeune-garçon\b/g, "jeune garçon"],
];

function nettoyerLignes(src) {
  const lignes = src
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);
  // Recollement des césures : une ligne PRÉCÉDENTE finissant par « - »
  // absorbe la ligne courante (le marqueur « 42 » reste donc isolé).
  const recollees = [];
  for (const ligne of lignes) {
    const precedente = recollees[recollees.length - 1];
    if (precedente && /-\u2019?$/.test(precedente) && !/^-/.test(ligne)) {
      recollees[recollees.length - 1] = precedente.replace(/-$/, "") + ligne;
      continue;
    }
    recollees.push(ligne);
  }
  return recollees;
}

const lignes = nettoyerLignes(texte);

/* ------------------------------------------------------------------ */
/* 2. Segmentation : la chaîne des § démarre à 1 et progresse de 1.    */
/*    (les nombres isolés du frontispice et des tables sont ignorés)   */
/* ------------------------------------------------------------------ */

const paragraphes = new Map(); // id → string[] (lignes)
let courant = null;
let attendu = 1;
for (const ligne of lignes) {
  const m = ligne.match(/^(\d{1,3})$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (attendu <= 350 && n === attendu) {
      courant = String(n);
      paragraphes.set(courant, []);
      attendu += 1;
      continue;
    }
    // chiffre isolé hors chaîne (table, exemple des règles) : ignoré
    if (!courant) continue;
  }
  if (courant) paragraphes.get(courant).push(ligne);
}
trace("*", `Paragraphes détectés : ${paragraphes.size}/350`);
for (let n = 1; n <= 350; n++) {
  if (!paragraphes.has(String(n))) trace(String(n), "PARAGRAPHE MANQUANT");
}

/* ------------------------------------------------------------------ */
/* 3. Parsing mécanique                                                */
/* ------------------------------------------------------------------ */

const DISCIPLINES_TEXTE = [
  [/sixi[eè]me sens/i, "sixieme-sens"],
  [/sens de l['’]orientation/i, "orientation"],
  [/discipline ka[ïi] de l['’]orientation/i, "orientation"],
  [/gu[ée]rison/i, "guerison"],
  [/\bchasse\b/i, "chasse"],
  [/camouflage/i, "camouflage"],
  [/puissance psychique/i, "puissance-psychique"],
  [/bouclier psychique/i, "bouclier-psychique"],
  [/communication animale/i, "communication-animale"],
  [/ma[îi]trise des armes/i, "maitrise-armes"],
  [/ma[îi]trise (?:psychique )?de la mati[eè]re/i, "maitrise-matiere"],
];

function disciplineDepuis(t) {
  for (const [re, id] of DISCIPLINES_TEXTE) if (re.test(t)) return id;
  return undefined;
}

function decouperPhrases(bloc) {
  // Une phrase peut se terminer par un guillemet fermant « » » juste après la
  // ponctuation finale (ex. dialogue) : on l'inclut dans le lookbehind pour ne
  // pas fusionner par erreur deux phrases distinctes (bug corrigé — audit LS02).
  return bloc
    .split(/(?<=[.!?…]\s*»?)\s+(?=[«A-ZÀ-Ý\d])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const RE_CIBLE =
  /(?:rend(?:ez[- ]vous)?|vous rendrez|en vous rendant|vous rendre)(?:[a-zà-ÿéèêàçûôî'’ ]{0,24})au\s+(\d{1,3})/i;

function libelleChoix(phrase) {
  let t = phrase
    .replace(RE_CIBLE, "")
    .replace(/\s+/g, " ")
    .replace(/[,;:\s.·]+$/, "")
    .trim();
  t = t.replace(/^(?:et |puis |sinon |enfin |ou )/i, "");
  t = t.replace(/^d['’]une part,?\s*/i, "");
  t = t.replace(/^Si (?:vous|tu)\s*/i, "Si vous ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const NOMS_ENNEMIS = new Map([
  ["MONSTRE D'ENFER", "Monstre d'Enfer"],
  ["MONSTRE BLESSÉ", "Monstre d'Enfer blessé"],
  ["LES ZOMBIES", "Zombies"],
  ["ZOMBIES", "Zombies"],
  ["CAPITAINE ZOMBIE", "Capitaine Zombie"],
  ["GLOKS", "Gloks"],
  ["GUERRIER DRAKKARIM", "Guerrier Drakkarim"],
  ["DRAKKARIM", "Drakkarim"],
  ["BRIGANDS", "Brigands"],
  ["GARDE DE LA TOUR", "Garde de la Tour"],
  ["GARDE FRONTALIER", "Garde Frontalier"],
  ["GARDE", "Garde"],
  ["MOINE", "Moine"],
  ["HALVORC", "Halvorc"],
  ["VIVEKA", "Viveka"],
  ["TRICHEUR", "Tricheur"],
  ["CHEVALIER DE LA MONTAGNE BLANCHE", "Chevalier de la Montagne Blanche"],
  ["CHEVALIER DELA MONTAGNE BLANCHE", "Chevalier de la Montagne Blanche"],
  ["MARIN PATIBULAIRE", "Marin patibulaire"],
  ["DORIER GANON", "Dorier et Ganon"],
  ["GANON DORIER", "Dorier et Ganon"],
  ["CHEF VOLEUR", "Chef Voleur"],
  ["1ER VOLEUR", "Voleur"],
  ["2E VOLEUR", "Voleur"],
]);

const RE_STATS =
  /((?:\d(?:er|e)?\s)?[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9'’ \-]*?)\s*HABILET[ÉE]\s*:?\s*(\d{1,2})\s+ENDURANCE\s*:?\s*(\d{1,2})/g;

function parserStats(bloc) {
  const trouves = [];
  let m;
  RE_STATS.lastIndex = 0;
  while ((m = RE_STATS.exec(bloc))) {
    const nom = m[1].trim().replace(/\s+/g, " ");
    const cle = nom.toUpperCase().replace(/^LES /, "");
    const normalise = NOMS_ENNEMIS.get(nom.toUpperCase()) ?? NOMS_ENNEMIS.get(cle);
    trouves.push({
      nomSource: nom,
      nom: normalise ?? nom.charAt(0) + nom.slice(1).toLowerCase(),
      habilete: parseInt(m[2], 10),
      endurance: parseInt(m[3], 10),
    });
  }
  return trouves;
}

function parserJet(bloc) {
  if (!/utilisez la table de hasard/i.test(bloc)) return null;
  const branches = {};
  const resume = [];
  // Chaque cible « rendez-vous au N » : la condition du jet = le texte situé
  // entre la cible précédente et celle-ci (une même phrase peut porter
  // plusieurs branches, séparées par « ; » — ex. §300).
  const re =
    /rend(?:ez[- ]vous)?(?:[a-zà-ÿéèêàçûôî'’ ]{0,24})au\s+(\d{1,3})/gi;
  const occurrences = [];
  let m;
  let precedentFin = -1;
  while ((m = re.exec(bloc))) {
    const debutPhrase = bloc.lastIndexOf(".", m.index) + 1;
    const debut = Math.max(debutPhrase, precedentFin);
    occurrences.push({
      cible: m[1],
      cond: bloc.slice(debut, m.index).replace(/^\s*[;,]\s*/, ""),
    });
    precedentFin = m.index + m[0].length;
  }
  for (const { cible, cond } of occurrences) {
    let min, max;
    const mRange =
      cond.match(/entre\s+(\d+)\s+et\s+(\d+)/i) ||
      cond.match(/de\s+(\d+)\s+à\s+(\d+)/i);
    if (mRange) {
      min = +mRange[1];
      max = +mRange[2];
    } else {
      const nombres = [...cond.matchAll(/\d+/g)]
        .map((x) => +x[0])
        .filter((x) => x <= 9);
      if (nombres.length) {
        min = Math.min(...nombres);
        max = Math.max(...nombres);
      }
    }
    if (min === undefined) continue;
    const cle = `${min}-${max}`;
    if (branches[cle]) continue;
    const libelle = cond
      .replace(/^[«\s]+/, "")
      .replace(/\s+/g, " ")
      .trim();
    branches[cle] = { vers: cible, texte: libelle || undefined };
    resume.push(`${cle}→${cible}`);
  }
  if (Object.keys(branches).length < 2) return null;
  return { branches, resume: resume.join(" · ") };
}

/* ------------------------------------------------------------------ */
/* 4. Overrides éditoriaux                                             */
/* ------------------------------------------------------------------ */

const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));

/* ------------------------------------------------------------------ */
/* 5. Construction                                                     */
/* ------------------------------------------------------------------ */

const sections = new Map();

for (const [id, lignesBloc] of paragraphes) {
  let bloc = lignesBloc.join(" ");
  for (const [re, rep] of CORRECTIONS) bloc = bloc.replace(re, rep);
  bloc = bloc.replace(/\s+/g, " ").trim();

  const ov = overrides[id] || {};
  const section = { id, texte: bloc };

  /* --- fins --- */
  if (ov.fin) {
    section.fin = ov.fin;
    if (ov.nomFin) section.nomFin = ov.nomFin;
  } else if (
    /(?:mission|quête|aventure|vie|vôtre)[^.]*s['’]ach[eè]ve/i.test(bloc) ||
    /en même temps que votre vie/i.test(bloc) ||
    /vous ne vous réveillerez jamais plus/i.test(bloc)
  ) {
    section.fin = "mort";
    section.nomFin = `Fin tragique — §${id}`;
    trace(id, "fin=mort (détection automatique)");
  }

  /* --- chaîne de combats (ennemis « un par un ») --- */
  if (ov.combatsChaine) {
    const chaine = ov.combatsChaine;
    const [premier, ...suite] = chaine;
    section.combat = { ...premier };
    let precedent = id;
    suite.forEach((c, i) => {
      const sid = `${id}-${String.fromCharCode(97 + 1 + i)}`; // id-b, id-c…
      const blocChaine = {
        id: sid,
        titre: c.titre,
        texte: c.texte,
        combat: { ...c },
        suite: c.suite ?? (i < suite.length - 1
          ? `${id}-${String.fromCharCode(97 + 2 + i)}`
          : undefined),
        choix: c.choix,
      };
      sections.set(sid, blocChaine);
      precedent = sid;
    });
    // Après le premier ennemi, on enchaîne sur la section suivante de la chaîne.
    section.suite = chaine.length > 1 ? `${id}-b` : premier.suite;
    trace(id, `chaîne de ${chaine.length} combats (sections ${id}-b…${precedent})`);
  } else if (ov.combat) {
    section.combat = { ...ov.combat };
  } else {
    const stats = parserStats(bloc);
    if (stats.length > 1) {
      trace(
        id,
        `PLUSIEURS blocs de stats (${stats.map((s) => s.nomSource).join(", ")}) — override requis`
      );
    } else if (stats.length === 1) {
      const ennemi = { ...stats[0] };
      delete ennemi.nomSource;
      if (
        /multiplier par (?:2|deux)/i.test(bloc) &&
        /mort[s]?\s+vivant/i.test(bloc)
      ) {
        ennemi.vulnerableGlaiveSommer = true;
      }
      if (
        /insensibl(?:e|es) à la (?:discipline ka[ïi] de la )?puissance psychique/i.test(
          bloc
        ) ||
        /invulnérable[^.]*puissance psychique/i.test(bloc)
      ) {
        ennemi.immunisePsychique = true;
      }
      const malusPsy = bloc.match(
        /bouclier psychique[^.]*?(\d+)\s+points?\s+d['’]endurance/i
      );
      if (malusPsy) {
        ennemi.malusPsychique = +malusPsy[1];
        trace(id, `malus psychique ${malusPsy[1]} (sauf Bouclier)`);
      }
      const fuite = bloc.match(
        /prendre la fuite[^.]*?(?:en vous rendant au|rendez-vous (?:pour cela |dans ce cas )?au|vous rendrez au)\s+(\d+)/i
      );
      if (fuite) {
        ennemi.fuite = [{ texte: "Prendre la fuite", vers: fuite[1] }];
        trace(id, `fuite possible → ${fuite[1]}`);
      }
      if (/lors du premier assaut/i.test(bloc) && /(\d+) points? à votre total/i.test(bloc)) {
        ennemi.bonusPremierAssaut = +bloc.match(/(\d+) points? à votre total/i)[1];
        trace(id, `bonus 1er assaut +${ennemi.bonusPremierAssaut}`);
      }
      if (/incapable de se défendre/i.test(bloc)) {
        ennemi.sansDefenseAssauts = 2;
        trace(id, "sans défense pendant les 2 premiers assauts");
      }
      if (/s['’]il vous pla[îi]t/i.test(bloc)) trace(id, "note: formule inattendue");
      section.combat = ennemi;
    }
  }

  /* --- événement jet de hasard --- */
  if (ov.evenement) {
    section.evenement = ov.evenement;
  } else {
    const jet = parserJet(bloc);
    if (jet) {
      section.evenement = { type: "jet-hasard-table", branches: jet.branches };
      trace(id, `jet de hasard : ${jet.resume}`);
    }
  }

  /* --- choix / suite --- */
  const phrases = decouperPhrases(bloc);
  const ciblesJet = new Set(
    section.evenement?.branches
      ? Object.values(section.evenement.branches)
          .map((b) => b.vers)
          .filter(Boolean)
      : []
  );
  const ciblesFuite = new Set((section.combat?.fuite ?? []).map((f) => f.vers));
  const phrasesChoix = [];
  const phrasesTexte = [];
  for (const phrase of phrases) {
    const m = phrase.match(RE_CIBLE);
    if (m) {
      // Les cibles déjà couvertes par un jet de hasard ou par la fuite en
      // combat ne deviennent pas des boutons (et sortent du texte affiché).
      if (ciblesJet.has(m[1]) || ciblesFuite.has(m[1])) continue;
      phrasesChoix.push(phrase);
    } else {
      phrasesTexte.push(phrase);
    }
  }

  if (ov.choix) {
    section.choix = ov.choix;
  } else if (section.combat && phrasesChoix.length === 1 && !section.suite) {
    // Combat avec une issue unique : la victoire mène au paragraphe indiqué.
    section.suite = phrasesChoix[0].match(RE_CIBLE)[1];
    trace(id, `victoire → ${section.suite}`);
  } else if (phrasesChoix.length && !ov.suiteForcee) {
    section.choix = phrasesChoix.map((phrase) => {
      const vers = phrase.match(RE_CIBLE)[1];
      const choix = { texte: libelleChoix(phrase), vers };
      if (/discipline ka[ïi]/i.test(phrase)) {
        const disc = disciplineDepuis(phrase);
        if (disc) choix.requis = { discipline: disc };
      }
      return choix;
    });
  } else if (ov.suite) {
    section.suite = ov.suite;
  } else {
    const cibleFinale = bloc.match(RE_CIBLE);
    if (
      cibleFinale &&
      !section.fin &&
      !section.combat &&
      !section.evenement?.branches
    ) {
      section.suite = cibleFinale[1];
      trace(id, `suite auto → ${cibleFinale[1]}`);
    }
  }
  if (ov.suite && section.choix) section.suite = ov.suite;
  if (ov.effets) section.effets = ov.effets;

  if (ov.titre) section.titre = ov.titre;
  if (ov.image) section.image = ov.image;
  if (ov.texte) section.texte = ov.texte;

  // Texte affiché = paragraphe officiel sans les phrases de choix
  // (elles deviennent les boutons), sauf override « texte ». Pour les
  // combats, on retire aussi la ligne de stats (affichée par l'arène).
  const RE_STATS_TEXTE =
    /(?:[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9'’ \-]*?)?\s*HABILET[ÉE]\s*:?\s*\d{1,2}\s+ENDURANCE\s*:?\s*\d{1,2}/;
  if (!ov.texte && (section.choix || section.evenement?.branches)) {
    section.texte = phrasesTexte.join(" ").trim() || bloc;
  } else if (!ov.texte && section.combat) {
    section.texte = phrasesTexte
      .join(" ")
      .replace(RE_STATS_TEXTE, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  sections.set(id, section);
}

/* Sections synthétiques entières (overrides.sectionsSupplementaires). */
for (const [id, ov] of Object.entries(overrides)) {
  const supp =
    id === "sectionsSupplementaires" ? ov : ov.sectionsSupplementaires;
  if (Array.isArray(supp)) {
    for (const s of supp) {
      sections.set(s.id, s);
      trace(s.id, "section synthétique ajoutée");
    }
  }
}

/* ------------------------------------------------------------------ */
/* 6. Contrôles                                                        */
/* ------------------------------------------------------------------ */

const ciblesManquantes = [];
for (const s of sections.values()) {
  const cibles = [
    ...(s.choix ?? []).map((c) => c.vers),
    ...(s.combat?.fuite ?? []).map((f) => f.vers),
    ...(s.evenement?.branches
      ? Object.values(s.evenement.branches).map((b) => b.vers).filter(Boolean)
      : []),
    ...(s.suite ? [s.suite] : []),
  ];
  for (const c of cibles) if (!sections.has(c)) ciblesManquantes.push(`${s.id}→${c}`);
}
if (ciblesManquantes.length)
  trace("*", `CIBLES MANQUANTES: ${ciblesManquantes.join(", ")}`);

for (const s of sections.values()) {
  const sorties =
    (s.choix?.length ?? 0) +
    (s.suite ? 1 : 0) +
    (s.combat ? 1 : 0) +
    (s.evenement?.branches ? Object.keys(s.evenement.branches).length : 0);
  if (sorties === 0 && !s.fin) trace(s.id, "AUCUNE SORTIE (override requis)");
}

const visites = new Set();
const pile = ["1"];
while (pile.length) {
  const id = pile.pop();
  if (!id || visites.has(id) || !sections.has(id)) continue;
  visites.add(id);
  const s = sections.get(id);
  for (const c of s.choix ?? []) pile.push(c.vers);
  for (const f of s.combat?.fuite ?? []) pile.push(f.vers);
  if (s.evenement?.branches)
    for (const b of Object.values(s.evenement.branches)) if (b.vers) pile.push(b.vers);
  if (s.suite) pile.push(s.suite);
}
const inatteignables = [...sections.keys()].filter((id) => !visites.has(id));
if (inatteignables.length)
  trace("*", `INATTEIGNABLES (${inatteignables.length}): ${inatteignables.join(", ")}`);

const fins = [...sections.values()].filter((s) => s.fin);
trace(
  "*",
  `Fins : ${fins.filter((f) => f.fin === "victoire").length} victoire(s), ${
    fins.filter((f) => f.fin === "mort").length
  } mort(s)`
);
const combats = [...sections.values()].filter((s) => s.combat);
trace("*", `Combats : ${combats.length} (§ ${combats.map((c) => c.id).join(", ")})`);

/* ------------------------------------------------------------------ */
/* 7. Carte de relecture                                               */
/* ------------------------------------------------------------------ */

function carte() {
  for (let n = 1; n <= 350; n++) {
    const s = sections.get(String(n));
    if (!s) {
      console.log(`§${n} : — ABSENT —`);
      continue;
    }
    const drapeaux = [];
    if (s.fin) drapeaux.push(s.fin.toUpperCase());
    if (s.combat) drapeaux.push(`COMBAT(${s.combat.nom} ${s.combat.habilete}/${s.combat.endurance}${s.combat.vulnerableGlaiveSommer ? " ×2Sommer" : ""}${s.combat.immunisePsychique ? " psy∅" : ""})`);
    if (s.evenement?.branches)
      drapeaux.push(
        `JET(${Object.entries(s.evenement.branches)
          .map(([k, v]) => `${k}→${v.vers ?? "reste"}`)
          .join(" ")})`
      );
    if (s.choix) drapeaux.push(`choix=${s.choix.length}[${s.choix.map((c) => c.vers).join(",")}]`);
    if (s.suite) drapeaux.push(`suite→${s.suite}`);
    if (s.effets) drapeaux.push(`effets=${JSON.stringify(s.effets)}`);
    console.log(`§${n} : ${drapeaux.join(" ")}`);
    console.log(`   ${s.texte.slice(0, 150).replace(/\n/g, " ")}`);
  }
}

/* ------------------------------------------------------------------ */
/* 8. Écriture                                                         */
/* ------------------------------------------------------------------ */

function objetTs(obj, indent) {
  const corps = Object.entries(obj)
    .map(([cle, val]) => (val === undefined ? null : `${indent}  ${cle}: ${val}`))
    .filter(Boolean);
  return `{\n${corps.join(",\n")}\n${indent}}`;
}

function serialiserChoix(c) {
  const parties = [`texte: ${JSON.stringify(c.texte)}`, `vers: ${JSON.stringify(c.vers)}`];
  if (c.requis) parties.push(`requis: ${JSON.stringify(c.requis)}`);
  if (c.montreToujours) parties.push(`montreToujours: true`);
  if (c.effets) {
    const ef = serialiserEffets(c.effets);
    if (ef) parties.push(`effets: ${ef}`);
  }
  return `{ ${parties.join(", ")} }`;
}

function serialiserEffets(e) {
  if (!e) return undefined;
  const parties = [];
  if (e.endurance !== undefined) parties.push(`endurance: ${e.endurance}`);
  if (e.habilete !== undefined) parties.push(`habilete: ${e.habilete}`);
  if (e.or !== undefined) parties.push(`or: ${e.or}`);
  if (e.repas !== undefined) parties.push(`repas: ${e.repas}`);
  if (e.objets) parties.push(`objets: ${JSON.stringify(e.objets)}`);
  if (e.retirerObjets) parties.push(`retirerObjets: ${JSON.stringify(e.retirerObjets)}`);
  if (e.perdreArme) parties.push(`perdreArme: ${JSON.stringify(e.perdreArme)}`);
  if (e.drapeau) parties.push(`drapeau: ${JSON.stringify(e.drapeau)}`);
  if (e.repasObligatoire) parties.push(`repasObligatoire: true`);
  if (e.repasChassePossible === false) parties.push(`repasChassePossible: false`);
  if (e.enduranceSiSansDiscipline)
    parties.push(
      `enduranceSiSansDiscipline: { discipline: ${JSON.stringify(
        e.enduranceSiSansDiscipline.discipline
      )}, perte: ${e.enduranceSiSansDiscipline.perte} }`
    );
  if (e.guerisonReposSiDiscipline)
    parties.push(
      `guerisonReposSiDiscipline: { discipline: ${JSON.stringify(
        e.guerisonReposSiDiscipline.discipline
      )} }`
    );
  if (e.mort) parties.push(`mort: true`);
  if (!parties.length) return undefined;
  return `{ ${parties.join(", ")} }`;
}

function serialiserEnnemi(c) {
  const parties = [
    `nom: ${JSON.stringify(c.nom)}`,
    `habilete: ${c.habilete}`,
    `endurance: ${c.endurance}`,
  ];
  if (c.immunisePsychique) parties.push(`immunisePsychique: true`);
  if (c.vulnerableGlaiveSommer) parties.push(`vulnerableGlaiveSommer: true`);
  if (c.bonusPremierAssaut) parties.push(`bonusPremierAssaut: ${c.bonusPremierAssaut}`);
  if (c.sansDefenseAssauts)
    parties.push(`sansDefenseAssauts: ${c.sansDefenseAssauts}`);
  if (c.bonusJoueur) parties.push(`bonusJoueur: ${c.bonusJoueur}`);
  if (c.malusPsychique) parties.push(`malusPsychique: ${c.malusPsychique}`);
  if (c.malusEvitePar) parties.push(`malusEvitePar: ${JSON.stringify(c.malusEvitePar)}`);
  if (c.emoji) parties.push(`emoji: ${JSON.stringify(c.emoji)}`);
  if (c.image) parties.push(`image: ${JSON.stringify(c.image)}`);
  if (c.description) parties.push(`description: ${JSON.stringify(c.description)}`);
  if (c.fuite)
    parties.push(
      `fuite: [${c.fuite
        .map((f) => `{ texte: ${JSON.stringify(f.texte)}, vers: ${JSON.stringify(f.vers)} }`)
        .join(", ")}]`
    );
  return `{ ${parties.join(", ")} }`;
}

function serialiserEvenement(ev) {
  if (!ev) return undefined;
  const parties = [`type: ${JSON.stringify(ev.type)}`];
  if (ev.titre) parties.push(`titre: ${JSON.stringify(ev.titre)}`);
  if (ev.texte) parties.push(`texte: ${JSON.stringify(ev.texte)}`);
  if (ev.ton) parties.push(`ton: ${JSON.stringify(ev.ton)}`);
  if (ev.branches) {
    const branches = Object.entries(ev.branches).map(([cle, b]) => {
      const champs = [];
      if (b.vers !== undefined) champs.push(`vers: ${JSON.stringify(b.vers)}`);
      if (b.texte !== undefined) champs.push(`texte: ${JSON.stringify(b.texte)}`);
      if (b.endurance !== undefined) champs.push(`endurance: ${b.endurance}`);
      if (b.or !== undefined) champs.push(`or: ${b.or}`);
      if (b.objets !== undefined) champs.push(`objets: ${JSON.stringify(b.objets)}`);
      if (b.drapeau !== undefined) champs.push(`drapeau: ${JSON.stringify(b.drapeau)}`);
      if (b.mort !== undefined) champs.push(`mort: ${b.mort}`);
      return `${JSON.stringify(cle)}: { ${champs.join(", ")} }`;
    });
    parties.push(`branches: {\n        ${branches.join(",\n        ")}\n      }`);
  }
  return `{\n        ${parties.join(",\n        ")}\n      }`;
}

function serialiserSection(s) {
  const parties = [`id: ${JSON.stringify(s.id)}`];
  if (s.titre) parties.push(`titre: ${JSON.stringify(s.titre)}`);
  if (s.image) parties.push(`image: ${JSON.stringify(s.image)}`);
  if (s.imageAlt) parties.push(`imageAlt: ${JSON.stringify(s.imageAlt)}`);
  parties.push(`texte: ${JSON.stringify(s.texte)}`);
  if (s.suite) parties.push(`suite: ${JSON.stringify(s.suite)}`);
  if (s.choix)
    parties.push(`choix: [\n    ${s.choix.map(serialiserChoix).join(",\n    ")}\n  ]`);
  const ef = serialiserEffets(s.effets);
  if (ef) parties.push(`effets: ${ef}`);
  if (s.combat) parties.push(`combat: ${serialiserEnnemi(s.combat)}`);
  const ev = serialiserEvenement(s.evenement);
  if (ev) parties.push(`evenement: ${ev}`);
  if (s.fin) parties.push(`fin: ${JSON.stringify(s.fin)}`);
  if (s.nomFin) parties.push(`nomFin: ${JSON.stringify(s.nomFin)}`);
  return `  {\n  ${parties.join(",\n  ")}\n  }`;
}

function ecrire() {
  fs.mkdirSync(sortieDir, { recursive: true });

  const textes = {};
  for (const [id, s] of sections) textes[id] = s.texte;
  fs.writeFileSync(
    path.join(sortieDir, "textes.json"),
    JSON.stringify(textes, undefined, 2) + "\n"
  );

  const ids = [...sections.keys()].sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );
  const tranches = [
    { f: "sections-001-089.ts", de: 1, a: 89 },
    { f: "sections-090-179.ts", de: 90, a: 179 },
    { f: "sections-180-269.ts", de: 180, a: 269 },
    { f: "sections-270-350.ts", de: 270, a: 350 },
  ];
  for (const tr of tranches) {
    const groupe = ids.filter((id) => {
      const n = parseInt(id, 10);
      return n >= tr.de && n <= tr.a;
    });
    const corps = groupe.map((id) => serialiserSection(sections.get(id))).join(",\n");
    const contenu = `import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 02 — La Traversée Infernale
 * Paragraphes ${String(tr.de).padStart(3, "0")} à ${tr.a}. Fichier GÉNÉRÉ par
 * scripts/ls02-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls02-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_${String(tr.de).padStart(3, "0")}_${tr.a}: StorySection[] = [
${corps}
];
`;
    fs.writeFileSync(path.join(sortieDir, tr.f), contenu);
  }
}

if (MODE_CARTE) {
  carte();
} else if (!MODE_AUDIT) {
  ecrire();
}

console.log("=== AUDIT IMPORT LS02 ===");
for (const a of audit) console.log(`§${a.section} : ${a.message}`);
console.log(
  `Total : ${sections.size} sections. ${
    MODE_AUDIT ? "(mode audit)" : MODE_CARTE ? "(mode carte)" : "Fichiers écrits."
  }`
);
