#!/usr/bin/env node
/**
 * Importateur du Loup Solitaire 05 — Le Tyran du Désert (400 paragraphes).
 *
 *   node scripts/ls05-importer.cjs            # génère sections + textes
 *   node scripts/ls05-importer.cjs --audit    # audit seul, n'écrit rien
 *   node scripts/ls05-importer.cjs --carte    # carte compacte des 400 § (relecture)
 *
 * Source : content/stories/ls05-texte-brut.txt (extraction PyMuPDF du PDF,
 * page par page). Le script nettoie la césure, segmente les 400 paragraphes,
 * détecte mécaniquement les choix (« rendez-vous au N »), les combats
 * (« HABILETÉ : X ENDURANCE : Y »), les jets de Table de Hasard et les fins,
 * puis applique les correctifs éditoriaux de ls05-overrides.json :
 *   - app/content/lonewolf/ls05/textes.json
 *   - app/content/lonewolf/ls05/sections-XXX.ts
 * Chaque patch éditorial est tracé dans l'audit : rien n'est corrigé en
 * silence. Les effets mécaniques (dégâts, objets, or) ne sont JAMAIS
 * devinés automatiquement : ils sont posés à la main dans les overrides
 * après relecture du PDF source.
 */
const fs = require("node:fs");
const path = require("node:path");

const racine = path.join(__dirname, "..");
const depot = path.join(racine, "..");
const brutPath = path.join(depot, "content", "stories", "ls05-texte-brut.txt");
const overridesPath = path.join(__dirname, "ls05-overrides.json");
const sortieDir = path.join(racine, "content", "lonewolf", "ls05");

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
  [/ENDU-[\n\r]?RANCE/g, "ENDURANCE"],
  [/HABILET-[\n\r]?É/g, "HABILETÉ"],
  [/B[o0]uclier/g, "Bouclier"],
  [/vv\.\.\./g, "vou..."],
  [/e§t/g, "est"],
  // césure « rendez- vous » avec espace après le tiret
  [/rendez-\s+vous/g, "rendez-vous"],
  [/rendezvous/g, "rendez-vous"],
  [/Rendezvous/g, "Rendez-vous"],
  // OCR : « rendez-vous au 1t » au lieu de 11 (§195)
  [/(rendez-vous au) 1t\b/gi, "$1 11"],
];

function nettoyerLignes(src) {
  const lignes = src
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);
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

let lignes = nettoyerLignes(texte);

// Recoller "rendez- vous" (césure après tiret) globalement dans toutes les lignes
lignes = lignes.map((l) => l.replace(/rendez-\s+vous/gi, "rendez-vous"));

/* ------------------------------------------------------------------ */
/* 2. Segmentation : la chaîne des § démarre à 1 et progresse de 1.    */
/*    Pour LS05, le tableau des rangs Kaï (page 21) contient des      */
/*    numéros 1..10 isolés qui pollueraient la détection. On démarre  */
/*    donc la segmentation à partir de la première vraie section 1    */
/*    (« Pendant trois jours vous menez... »).                         */
/* ------------------------------------------------------------------ */

let startIdx = 0;
for (let i = 0; i < lignes.length; i++) {
  if (lignes[i].includes("Durant 25 jours")) {
    for (let j = Math.max(0, i - 5); j < i; j++) {
      if (/^1$/.test(lignes[j])) {
        startIdx = j;
        break;
      }
    }
    break;
  }
}
if (startIdx === 0) trace("*", "Début d'aventure non trouvé — segmentation depuis le début");
else trace("*", `Début d'aventure trouvé à la ligne ${startIdx}`);

const paragraphes = new Map();
let courant = null;
let attendu = 1;
for (const ligne of lignes.slice(startIdx)) {
  const m = ligne.match(/^(\d{1,3})$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (attendu <= 400 && n === attendu) {
      courant = String(n);
      paragraphes.set(courant, []);
      attendu += 1;
      continue;
    }
    if (!courant) continue;
  }
  if (courant) paragraphes.get(courant).push(ligne);
}
trace("*", `Paragraphes détectés : ${paragraphes.size}/400`);
for (let n = 1; n <= 400; n++) {
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
  return bloc
    .split(/(?<=[.!?…]\s*»?)\s+(?=[«A-ZÀ-Ý\d])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const RE_CIBLE =
  /(?:commencez votre nouvelle aventure|rendez\s*-?\s*vous|se rendre|pour cela|vous rendre|en vous rendant|vous rendrez|vous pouvez vous rendre|il vous faut vous rendre|dirigez-vous)(?:[\s\S]{0,400}?)au[x]?\s+(?:chapitre\s+)?(\d{1,3})/i;

function libelleChoix(phrase) {
  let t = phrase
    .replace(RE_CIBLE, "")
    .replace(/\s+/g, " ")
    .replace(/[,;:\s.·]+$/, "")
    .trim();
  t = t.replace(/^(?:et |puis |sinon |enfin |ou |mais )/i, "");
  t = t.replace(/^d['’]une part,?\s*/i, "");
  t = t.replace(/^Si (?:vous|tu)\s*/i, "Si vous ");
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const NOMS_ENNEMIS = new Map([
  ["VER DE PIERRE", "Ver de Pierre"],
  ["CHIEN DE GUERRE", "Chien de Guerre"],
  ["CHIENS DE GUERRE", "Chiens de Guerre"],
  ["CHIENS DE GUERRE VASSAGONIENS", "Chiens de Guerre Vassagoniens"],
  ["DÉMONDES SOUTERRAINS", "Démondes Souterrains"],
  ["DÉMONS DES SOUTERRAINS", "Démons des Souterrains"],
  ["MÉGACALMAR", "Mégacalmar"],
  ["MÉGA CALMAR", "Mégacalmar"],
  ["BANDIT BLESSÉ", "Bandit Blessé"],
  ["GARDE BLESSÉ", "Garde Blessé"],
  ["GUERRIER PILLARD", "Guerrier Pillard"],
  ["PATROUILLE DE BRIGANDS", "Patrouille de Brigands"],
  ["OFFICIER DES GARDES", "Officier des Gardes"],
  ["GARDE DU PONT", "Garde du Pont"],
  ["GARDE IVRE", "Garde Ivre"],
  ["GARDE", "Garde"],
  ["GARDES DE LA CRYPTE", "Gardes de la Crypte"],
  ["GUERRIER VASSAGONIEN", "Guerrier Vassagonien"],
  ["CAVALIER PILLARD", "Cavalier Pillard"],
  ["CAVALIER VASSAGONIEN", "Cavalier Vassagonien"],
  ["CHEF BRIGAND", "Chef Brigand"],
  ["ÉLIX", "Élix"],
  ["BARRAKA", "Barraka"],
]);

const RE_STATS =
  /((?:\d(?:er|e)?\s)?[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9'’ \-\(\)éèêàçûôîÉÈÊÀÇÛÔÎ]*?)\s*HABILET[ÉE]\s*:?\s*(\d{1,2})\s+ENDURANCE\s*:?\s*(\d{1,3})/g;

function parserStats(bloc) {
  const trouves = [];
  let m;
  RE_STATS.lastIndex = 0;
  while ((m = RE_STATS.exec(bloc))) {
    let nom = m[1].trim().replace(/\s+/g, " ");
    // Nettoyage: si nom contient phrase parasite, extraire dernier bloc majuscules
    if (/vous|craignez|alors que|Si vous|Rendez/i.test(nom)) {
      const ups = [...nom.matchAll(/[A-ZÀ-Ý][A-ZÀ-Ý'’ \-]{2,}/g)].map((x) => x[0].trim());
      if (ups.length) nom = ups[ups.length - 1];
    }
    const cle = nom.toUpperCase().replace(/^LES /, "").replace(/^UN /, "").trim();
    const normalise = NOMS_ENNEMIS.get(cle) ?? NOMS_ENNEMIS.get(nom.toUpperCase());
    trouves.push({
      nomSource: m[1].trim(),
      nom: normalise ?? (nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase()),
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
  const re = /rend(?:ez[- ]vous)?(?:[a-zà-ÿéèêàçûôî'’ ]{0,30})au\s+(\d{1,3})/gi;
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
      // "0 à 6" déjà capturé, mais aussi "7 ou plus" => 7-9 ou 7-13 selon contexte
      const plus = cond.match(/(\d+)\s+ou\s+plus/i);
      if (plus) {
        min = +plus[1];
        // Si texte mentionne 13 comme max (ex. §183 avec +4 Camouflage), on met 13
        max = /13/.test(cond) || /13/.test(bloc) ? 13 : 9;
      } else {
        const ouMatch = cond.match(/(\d+)\s+ou\s+(?:un\s+)?(\d+)/i);
        if (ouMatch) {
          min = Math.min(+ouMatch[1], +ouMatch[2]);
          max = Math.max(+ouMatch[1], +ouMatch[2]);
        } else {
          const nombres = [...cond.matchAll(/\d+/g)]
            .map((x) => +x[0])
            .filter((x) => x <= 13);
          if (nombres.length === 1) {
            min = nombres[0];
            max = nombres[0];
          } else if (nombres.length >= 2) {
            min = Math.min(...nombres);
            max = Math.max(...nombres);
          }
        }
      }
    }
    if (min === undefined) continue;
    // Normaliser 0-13 vers 0-9 si besoin, mais garder 0-13 pour §183
    const cle = `${min}-${max}`;
    if (branches[cle]) continue;
    const libelle = cond.replace(/^[«\s]+/, "").replace(/\s+/g, " ").trim();
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
  // Texte de remplacement (corrige des coquilles imprimées comme §152→5)
  if (ov.texte) {
    bloc = ov.texte;
    trace(id, "texte remplacé par override");
  }
  const section = { id, texte: bloc };

  // Sections à ignorer (tableaux, intertitres, faux § de renvoi vers le règlement)
  if (ov.ignore) {
    trace(id, "section ignorée (override)");
    continue;
  }

  /* --- fins --- */
  if (ov.fin) {
    section.fin = ov.fin;
    if (ov.nomFin) section.nomFin = ov.nomFin;
  } else if (
    /(?:mission|quête|aventure|vie|vôtre)[^.]*s['’]ach[eè]ve/i.test(bloc) ||
    /en même temps que votre vie/i.test(bloc) ||
    /vous ne vous réveillerez jamais plus/i.test(bloc) ||
    /votre mission a échoué/i.test(bloc) ||
    /votre vie (?:se termine|et tous les espoirs|ainsi que les derniers espoirs|et les espoirs)/i.test(bloc) ||
    /prene[zn]d fin ici/i.test(bloc) ||
    /vous mourez/i.test(bloc) ||
    /vous étes déjà mort|vous êtes déjà mort/i.test(bloc) ||
    /mort est instantanée/i.test(bloc) ||
    /trouvez une mort atroce/i.test(bloc) ||
    /ici se termine votre vie/i.test(bloc)
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
      const sid = `${id}-${String.fromCharCode(97 + 1 + i)}`;
      const blocChaine = {
        id: sid,
        titre: c.titre,
        texte: c.texte,
        combat: { ...c },
        suite: c.suite ?? (i < suite.length - 1 ? `${id}-${String.fromCharCode(97 + 2 + i)}` : undefined),
        choix: c.choix,
      };
      sections.set(sid, blocChaine);
      precedent = sid;
    });
    section.suite = chaine.length > 1 ? `${id}-b` : premier.suite;
    trace(id, `chaîne de ${chaine.length} combats (sections ${id}-b…${precedent})`);
  } else if ("combat" in ov) {
    if (ov.combat) section.combat = { ...ov.combat };
    else trace(id, "combat supprimé par override");
  } else {
    const stats = parserStats(bloc);
    if (stats.length > 1) {
      trace(id, `PLUSIEURS blocs de stats (${stats.map((s) => s.nomSource).join(", ")}) — override requis`);
      // Si plusieurs, on prend le premier par défaut, mais on trace
      if (!ov.combat && stats.length) {
        const ennemi = { ...stats[0] };
        delete ennemi.nomSource;
        section.combat = ennemi;
      }
    } else if (stats.length === 1) {
      const ennemi = { ...stats[0] };
      delete ennemi.nomSource;
      if (/multiplier par (?:2|deux)/i.test(bloc) && /mort[s]?\\s+vivant/i.test(bloc)) {
        ennemi.vulnerableGlaiveSommer = true;
      }
      if (
        /insensibl(?:e|es) à la (?:discipline ka[ïi] de la )?puissance psychique/i.test(bloc) ||
        /invulnérable[^.]*puissance psychique/i.test(bloc) ||
        /invulnérable à la Discipline Kaï de la Puissance Psychique/i.test(bloc)
      ) {
        ennemi.immunisePsychique = true;
      }
      const malusPsy = bloc.match(/bouclier psychique[^.]*?(\\d+)\\s+points?\\s+d['’]endurance/i);
      if (malusPsy) {
        ennemi.malusPsychique = +malusPsy[1];
        trace(id, `malus psychique ${malusPsy[1]} (sauf Bouclier)`);
      }
      const fuite = bloc.match(
        /prendre la fuite[^.]*?(?:en vous rendant au|rendez-vous (?:pour cela |dans ce cas )?au|vous rendrez au)\\s+(\\d+)/i
      );
      if (fuite) {
        ennemi.fuite = [{ texte: "Prendre la fuite", vers: fuite[1] }];
        trace(id, `fuite possible → ${fuite[1]}`);
      }
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
  let dernierePhraseTexte = null;
  for (const phrase of phrases) {
    const m = phrase.match(RE_CIBLE);
    if (m) {
      if (ciblesJet.has(m[1]) || ciblesFuite.has(m[1])) continue;
      const sansCible = phrase.replace(RE_CIBLE, "").replace(/\s+/g, " ").replace(/[,;:\s.·?]+$/, "").trim();
      if (!sansCible && dernierePhraseTexte) {
        const labelPhrase = dernierePhraseTexte;
        phrasesTexte.pop();
        dernierePhraseTexte = phrasesTexte.length ? phrasesTexte[phrasesTexte.length - 1] : null;
        phrasesChoix.push(labelPhrase + " " + phrase);
        continue;
      }
      phrasesChoix.push(phrase);
    } else {
      phrasesTexte.push(phrase);
      dernierePhraseTexte = phrase;
    }
  }

  if (ov.choix) {
    section.choix = ov.choix;
  } else if (section.combat && phrasesChoix.length === 1 && !section.suite) {
    section.suite = phrasesChoix[0].match(RE_CIBLE)[1];
    trace(id, `victoire → ${section.suite}`);
  } else if (phrasesChoix.length && !ov.suiteForcee) {
    const choixGen = phrasesChoix.map((phrase) => {
      const vers = phrase.match(RE_CIBLE)[1];
      const choix = { texte: libelleChoix(phrase), vers };
      if (/discipline ka[ïi]/i.test(phrase)) {
        const disc = disciplineDepuis(phrase);
        if (disc) choix.requis = { discipline: disc };
        // Cas "Chasse ou Crique-en-Gorn" => discipline + drapeau, on simplifie en discipline
        if (/crique-en-gorn/i.test(phrase) && !choix.requis) {
          choix.requis = { discipline: "chasse" };
        }
      }
      if (/rang ka[ïi] d'aspirant/i.test(phrase)) {
        choix.requis = { drapeau: "rang_aspirant" };
      }
      if (/clé de cuivre/i.test(phrase)) {
        choix.requis = { objet: "cle-cuivre" };
      }
      if (/clé de fer/i.test(phrase)) {
        choix.requis = { objet: "cle-fer" };
      }
      return choix;
    });
    if (
      choixGen.length === 1 &&
      !section.combat &&
      !section.evenement?.branches &&
      !choixGen[0].requis &&
      !choixGen[0].texte.trim()
    ) {
      section.suite = choixGen[0].vers;
      trace(id, `suite auto (choix vide) → ${section.suite}`);
    } else {
      section.choix = choixGen;
    }
  } else if (ov.suite) {
    section.suite = ov.suite;
  } else {
    const cibleFinale = bloc.match(RE_CIBLE);
    if (cibleFinale && !section.fin && !section.combat && !section.evenement?.branches) {
      section.suite = cibleFinale[1];
      trace(id, `suite auto → ${cibleFinale[1]}`);
    }
  }
  if (ov.suite && section.choix) section.suite = ov.suite;
  if (ov.effets) section.effets = ov.effets;

  if (ov.titre) section.titre = ov.titre;
  if (ov.image) section.image = ov.image;
  if (ov.texte) section.texte = ov.texte;

  const RE_STATS_TEXTE =
    /(?:[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9'’ \\-]*?)?\\s*HABILET[ÉE]\\s*:?\\s*\\d{1,2}\\s+ENDURANCE\\s*:?\\s*\\d{1,3}/;
  if (!ov.texte && (section.choix || section.evenement?.branches)) {
    section.texte = phrasesTexte.join(" ").trim() || bloc;
  } else if (!ov.texte && section.combat) {
    section.texte = phrasesTexte
      .join(" ")
      .replace(RE_STATS_TEXTE, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  } else if (!ov.texte && section.suite && phrasesTexte.length && phrasesTexte.length < phrases.length) {
    section.texte = phrasesTexte.join(" ").trim() || bloc;
  }

  sections.set(id, section);
}

/* Sections synthétiques entières (overrides.sectionsSupplementaires). */
for (const [id, ov] of Object.entries(overrides)) {
  const supp = id === "sectionsSupplementaires" ? ov : ov.sectionsSupplementaires;
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
    ...(s.evenement?.branches ? Object.values(s.evenement.branches).map((b) => b.vers).filter(Boolean) : []),
    ...(s.suite ? [s.suite] : []),
  ];
  for (const c of cibles) if (!sections.has(c)) ciblesManquantes.push(`${s.id}→${c}`);
}
if (ciblesManquantes.length) trace("*", `CIBLES MANQUANTES: ${ciblesManquantes.join(", ")}`);

for (const s of sections.values()) {
  const sorties =
    (s.choix?.length ?? 0) + (s.suite ? 1 : 0) + (s.combat ? 1 : 0) + (s.evenement?.branches ? Object.keys(s.evenement.branches).length : 0);
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
  if (s.evenement?.branches) for (const b of Object.values(s.evenement.branches)) if (b.vers) pile.push(b.vers);
  if (s.suite) pile.push(s.suite);
}
const inatteignables = [...sections.keys()].filter((id) => !visites.has(id));
if (inatteignables.length) trace("*", `INATTEIGNABLES (${inatteignables.length}): ${inatteignables.join(", ")}`);

const fins = [...sections.values()].filter((s) => s.fin);
trace("*", `Fins : ${fins.filter((f) => f.fin === "victoire").length} victoire(s), ${fins.filter((f) => f.fin === "mort").length} mort(s)`);
const combats = [...sections.values()].filter((s) => s.combat);
trace("*", `Combats : ${combats.length} (§ ${combats.map((c) => c.id).join(", ")})`);

/* ------------------------------------------------------------------ */
/* 7. Carte de relecture                                               */
/* ------------------------------------------------------------------ */

function carte() {
  for (let n = 1; n <= 400; n++) {
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
    console.log(`   ${s.texte.slice(0, 180).replace(/\n/g, " ")}`);
  }
}

/* ------------------------------------------------------------------ */
/* 8. Écriture                                                         */
/* ------------------------------------------------------------------ */

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
      `enduranceSiSansDiscipline: { discipline: ${JSON.stringify(e.enduranceSiSansDiscipline.discipline)}, perte: ${e.enduranceSiSansDiscipline.perte} }`
    );
  if (e.guerisonReposSiDiscipline)
    parties.push(
      `guerisonReposSiDiscipline: { discipline: ${JSON.stringify(e.guerisonReposSiDiscipline.discipline)} }`
    );
  if (e.mort) parties.push(`mort: true`);
  if (!parties.length) return undefined;
  return `{ ${parties.join(", ")} }`;
}

function serialiserEnnemi(c) {
  const parties = [`nom: ${JSON.stringify(c.nom)}`, `habilete: ${c.habilete}`, `endurance: ${c.endurance}`];
  if (c.immunisePsychique) parties.push(`immunisePsychique: true`);
  if (c.vulnerableGlaiveSommer) parties.push(`vulnerableGlaiveSommer: true`);
  if (c.bonusPremierAssaut) parties.push(`bonusPremierAssaut: ${c.bonusPremierAssaut}`);
  if (c.sansDefenseAssauts) parties.push(`sansDefenseAssauts: ${c.sansDefenseAssauts}`);
  if (c.bonusJoueur) parties.push(`bonusJoueur: ${c.bonusJoueur}`);
  if (c.malusPsychique) parties.push(`malusPsychique: ${c.malusPsychique}`);
  if (c.malusEvitePar) parties.push(`malusEvitePar: ${JSON.stringify(c.malusEvitePar)}`);
  if (c.emoji) parties.push(`emoji: ${JSON.stringify(c.emoji)}`);
  if (c.image) parties.push(`image: ${JSON.stringify(c.image)}`);
  if (c.description) parties.push(`description: ${JSON.stringify(c.description)}`);
  if (c.fuite)
    parties.push(`fuite: [${c.fuite.map((f) => `{ texte: ${JSON.stringify(f.texte)}, vers: ${JSON.stringify(f.vers)} }`).join(", ")}]`);
  // Champs spécifiques LS05 (conservés pour audit, même si non typés)
  if (c.malusPremiersAssauts) parties.push(`malusPremiersAssauts: ${JSON.stringify(c.malusPremiersAssauts)}`);
  if (c.malusSansArmeAssauts) parties.push(`malusSansArmeAssauts: ${JSON.stringify(c.malusSansArmeAssauts)}`);
  if (c.dureeMax) parties.push(`dureeMax: ${c.dureeMax}`);
  if (c.suiteApresDuree) parties.push(`suiteApresDuree: ${JSON.stringify(c.suiteApresDuree)}`);
  if (c.flawless) parties.push(`flawless: ${JSON.stringify(c.flawless)}`);
  if (c.singleAssaut) parties.push(`singleAssaut: ${JSON.stringify(c.singleAssaut)}`);
  if (c.oxygen) parties.push(`oxygen: ${JSON.stringify(c.oxygen)}`);
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
  if (s.choix) parties.push(`choix: [\n    ${s.choix.map(serialiserChoix).join(",\n    ")}\n  ]`);
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
  fs.writeFileSync(path.join(sortieDir, "textes.json"), JSON.stringify(textes, undefined, 2) + "\n");

  const ids = [...sections.keys()].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const tranches = [
    { f: "sections-001-100.ts", de: 1, a: 100 },
    { f: "sections-101-200.ts", de: 101, a: 200 },
    { f: "sections-201-300.ts", de: 201, a: 300 },
    { f: "sections-301-400.ts", de: 301, a: 400 },
  ];
  for (const tr of tranches) {
    const groupe = ids.filter((id) => {
      const n = parseInt(id, 10);
      return n >= tr.de && n <= tr.a;
    });
    const corps = groupe.map((id) => serialiserSection(sections.get(id))).join(",\n");
    const contenu = `import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Tyran du Désert
 * Paragraphes ${String(tr.de).padStart(3, "0")} à ${tr.a}. Fichier GÉNÉRÉ par
 * scripts/ls05-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls05-overrides.json puis relancer l'import.
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

console.log("=== AUDIT IMPORT LS05 ===");
for (const a of audit) console.log(`§${a.section} : ${a.message}`);
console.log(
  `Total : ${sections.size} sections. ${MODE_AUDIT ? "(mode audit)" : MODE_CARTE ? "(mode carte)" : "Fichiers écrits."}`
);
