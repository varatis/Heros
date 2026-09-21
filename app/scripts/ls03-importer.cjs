#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const racine = path.join(__dirname, "..");
const depot = path.join(racine, "..");
const brutPath = path.join(depot, "content", "stories", "ls03-texte-brut.txt");
const overridesPath = path.join(__dirname, "ls03-overrides.json");
const sortieDir = path.join(racine, "content", "lonewolf", "ls03");

const MODE_AUDIT = process.argv.includes("--audit");
const MODE_CARTE = process.argv.includes("--carte");
const audit = [];
const trace = (section, message) => audit.push({ section, message });

if (!fs.existsSync(brutPath)) {
  console.error(`Fichier brut manquant: ${brutPath}`);
  process.exit(1);
}

const brut = fs.readFileSync(brutPath, "utf8");
let texte = brut.replace(/===== PAGE \d+ =====/g, "\n");

function nettoyerLignes(src) {
  const lignes = src.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(l => l.length > 0);
  const recollees = [];
  for (const ligne of lignes) {
    const precedente = recollees[recollees.length - 1];
    if (precedente && /-$/.test(precedente) && !/^-/.test(ligne)) {
      recollees[recollees.length - 1] = precedente.replace(/-$/, "") + ligne;
      continue;
    }
    recollees.push(ligne);
  }
  return recollees;
}

let lignes = nettoyerLignes(texte);
let startIdx = -1;
for (let i = 0; i < lignes.length - 1; i++) {
  if (/^(1)$/.test(lignes[i]) && lignes[i+1].startsWith("Avant même")) { startIdx = i; break; }
}
if (startIdx === -1) { console.error("Début non trouvé"); process.exit(1); }
lignes = lignes.slice(startIdx);

const paragraphes = new Map();
let courant = null;
let attendu = 1;
for (const ligne of lignes) {
  const m = ligne.match(/^(\d{1,3})$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (attendu <= 350 && n === attendu) { courant = String(n); paragraphes.set(courant, []); attendu++; continue; }
    if (!courant) continue;
  }
  if (courant) paragraphes.get(courant).push(ligne);
}
trace("*", `Paragraphes détectés : ${paragraphes.size}/350`);
for (let n = 1; n <= 350; n++) if (!paragraphes.has(String(n))) trace(String(n), "PARAGRAPHE MANQUANT");

const DISCIPLINES_TEXTE = [
  [/sixi[eè]me sens/i, "sixieme-sens"],
  [/sens de l['’]orientation/i, "orientation"],
  [/gu[ée]rison/i, "guerison"],
  [/\bchasse\b/i, "chasse"],
  [/camouflage/i, "camouflage"],
  [/puissance psychique/i, "puissance-psychique"],
  [/bouclier psychique/i, "bouclier-psychique"],
  [/communication animale/i, "communication-animale"],
  [/ma[îi]trise des armes/i, "maitrise-armes"],
  [/ma[îi]trise (?:psychique )?de la mati[eè]re/i, "maitrise-matiere"],
];
function disciplineDepuis(t) { for (const [re,id] of DISCIPLINES_TEXTE) if (re.test(t)) return id; return undefined; }
function decouperPhrases(bloc) { return bloc.split(/(?<=[.!?…]\s*»?)\s+(?=[«A-ZÀ-Ý\d])/).map(s=>s.trim()).filter(Boolean); }
const RE_CIBLE = /(?:rend(?:ez[- ]vous)?|vous rendrez|en vous rendant|vous rendre|Retournez(?: à présent)?|retournez)(?:[a-zà-ÿéèêàçûôî'’ ]{0,40})au\s+(\d{1,3})/i;
function libelleChoix(phrase) {
  let t = phrase.replace(RE_CIBLE, "").replace(/\s+/g, " ").replace(/[,;:\s.·]+$/, "").trim();
  t = t.replace(/^(?:et |puis |sinon |enfin |ou )/i, "");
  t = t.replace(/^d['’]une part,?\s*/i, "");
  t = t.replace(/^Si (?:vous|tu)\s*/i, "Si vous ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
const NOMS_ENNEMIS = new Map([
  ["BARBARE DES GLACES", "Barbare des Glaces"],
  ["LANGUABARB", "Languabarb"],
  ["LOUP MAUDIT", "Loup Maudit"],
  ["LOUPS MAUDITS", "Loups Maudits"],
  ["BAKANAL", "Bakanal"],
  ["JAVEK", "Javek"],
  ["SERPENT DE CRISTAL", "Serpent de Cristal"],
  ["ECLAIREUR", "Éclaireur Barbare"],
  ["ECLAIREUR BARBARE", "Éclaireur Barbare"],
  ["MONSTRE D'ENFER", "Monstre d'Enfer"],
  ["AKRANIONOR", "Akranionor"],
  ["VONOTAR", "Vonotar"],
  ["KRAAN", "Kraan"],
  ["GLOK", "Glok"],
]);

const RE_STATS_SIMPLE = /([A-ZÀ-Ý][A-ZÀ-Ý'’ \-]+?)\s+HABILET[ÉE]\s*:?\s*(\d{1,2})\s+ENDURANCE\s*:?\s*(\d{1,2})/g;
const RE_STATS_MULTI = /(?:Premier|Deuxième|Troisième|Quatrième|Cinquième|Deuxieme|Troisieme)?\s*([A-ZÀ-Ý][A-ZÀ-Ý'’ \-]+)\s+(\d{1,2})\s+(\d{1,2})/g;

function parserStats(bloc) {
  const trouves = [];
  let m;
  RE_STATS_SIMPLE.lastIndex = 0;
  while ((m = RE_STATS_SIMPLE.exec(bloc))) {
    let nomRaw = m[1].trim().replace(/\s+/g, " ");
    nomRaw = nomRaw.replace(/^(?:Premier|Deuxième|Troisième|Quatrième|Cinquième|Deuxieme|Troisieme)\s+/i, "").trim();
    if (nomRaw.length < 2) continue;
    const cle = nomRaw.toUpperCase();
    let normalise = NOMS_ENNEMIS.get(cle);
    if (!normalise) {
      // fallback
      normalise = nomRaw.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
    }
    trouves.push({ nomSource: nomRaw, nom: normalise, habilete: parseInt(m[2],10), endurance: parseInt(m[3],10) });
  }
  if (trouves.length) return trouves;
  if (/HABILET[ÉE]\s+ENDURANCE/i.test(bloc)) {
    const after = bloc.split(/HABILET[ÉE]\s+ENDURANCE/i)[1];
    if (after) {
      RE_STATS_MULTI.lastIndex = 0;
      let mm;
      while ((mm = RE_STATS_MULTI.exec(after))) {
        let nomRaw = mm[1].trim();
        if (nomRaw.length < 3) continue;
        if (/^Si vous/i.test(nomRaw)) continue;
        if (/RENDEZ/i.test(nomRaw)) continue;
        if (/^\d+$/.test(nomRaw)) continue;
        const cle = nomRaw.toUpperCase();
        let normalise = NOMS_ENNEMIS.get(cle) || nomRaw.charAt(0) + nomRaw.slice(1).toLowerCase();
        trouves.push({ nomSource: nomRaw, nom: normalise, habilete: parseInt(mm[2],10), endurance: parseInt(mm[3],10) });
        if (trouves.length >= 6) break;
      }
    }
  }
  return trouves;
}

function parserJet(bloc) {
  if (!/utilisez la table de hasard/i.test(bloc)) return null;
  const branches = {};
  const resume = [];
  const re = /rend(?:ez[- ]vous)?(?:[a-zà-ÿéèêàçûôî'’ ]{0,40})au\s+(\d{1,3})/gi;
  const occ = [];
  let m; let prev = -1;
  while ((m = re.exec(bloc))) {
    const debutPhrase = bloc.lastIndexOf(".", m.index) + 1;
    const debut = Math.max(debutPhrase, prev);
    occ.push({ cible: m[1], cond: bloc.slice(debut, m.index).replace(/^\s*[;,]\s*/, "") });
    prev = m.index + m[0].length;
  }
  for (const {cible, cond} of occ) {
    let min, max;
    const mr = cond.match(/entre\s+(\d+)\s+et\s+(\d+)/i) || cond.match(/de\s+(\d+)\s+à\s+(\d+)/i);
    if (mr) { min=+mr[1]; max=+mr[2]; }
    else {
      const nums = [...cond.matchAll(/\d+/g)].map(x=>+x[0]).filter(x=>x<=9);
      if (nums.length) { min=Math.min(...nums); max=Math.max(...nums); }
    }
    if (min===undefined) continue;
    const cle = `${min}-${max}`;
    if (branches[cle]) continue;
    const libelle = cond.replace(/^[«\s]+/, "").replace(/\s+/g, " ").trim();
    branches[cle] = { vers: cible, texte: libelle||undefined };
    resume.push(`${cle}→${cible}`);
  }
  if (Object.keys(branches).length < 2) return null;
  return { branches, resume: resume.join(" · ") };
}

function parserPerteEndurance(bloc) {
  const m1 = bloc.match(/Si vous perdez des points d['’]ENDURANCE[^.]*?rendez-vous(?: immédiatement)? au\s+(\d{1,3})/i);
  const m2 = bloc.match(/Si vous remportez le combat sans perdre[^.]*?rendez-vous au\s+(\d{1,3})/i);
  if (m1 && m2) return { perte: m1[1], sansPerte: m2[1] };
  return null;
}

let overrides = {};
if (fs.existsSync(overridesPath)) overrides = JSON.parse(fs.readFileSync(overridesPath,"utf8"));

const sections = new Map();

for (const [id, lignesBloc] of paragraphes) {
  let bloc = lignesBloc.join(" ").replace(/\s+/g, " ").trim();
  const ov = overrides[id] || {};
  const section = { id, texte: bloc };

  if (ov.fin) { section.fin = ov.fin; if (ov.nomFin) section.nomFin = ov.nomFin; }
  else if (/(?:mission|quête|aventure|vie)[^.]*s['’]ach[eè]ve/i.test(bloc) && !/rendez-vous au/i.test(bloc.slice(-200))) {
    if (/en même temps que votre vie|vous êtes tué|vous succombez|vous mourez/i.test(bloc)) {
      section.fin = "mort"; section.nomFin = `Fin tragique — §${id}`; trace(id, "fin=mort auto");
    }
  }

  if (ov.combatsChaine) {
    const chaine = ov.combatsChaine;
    const [premier, ...suite] = chaine;
    section.combat = { ...premier };
    // Remove suite from premier if it will be chained
    if (chaine.length>1) delete section.combat.suite;
    suite.forEach((c,i)=>{
      const sid = `${id}-${String.fromCharCode(97+1+i)}`;
      const isLast = i===suite.length-1;
      const combatData = { ...c };
      const suiteVal = combatData.suite;
      delete combatData.suite;
      const texteVal = combatData.texte;
      delete combatData.texte;
      const choixVal = combatData.choix;
      delete combatData.choix;
      const titreVal = combatData.titre;
      delete combatData.titre;
      const sec = { id: sid, texte: texteVal||`Suite du combat du §${id}`, combat: combatData, suite: suiteVal ?? (i < suite.length-1 ? `${id}-${String.fromCharCode(97+2+i)}` : undefined), choix: choixVal };
      if (titreVal) sec.titre = titreVal;
      // If this is last and override has choix, attach it
      if (isLast && ov.choix) {
        sec.choix = ov.choix;
        sec.suite = undefined;
      }
      // If last has no suite and no choix but override suite is on premier? handled
      sections.set(sid, sec);
    });
    if (chaine.length>1) {
      section.suite = `${id}-b`;
      // If override has choix and chain length 1? else main has no choix
      if (ov.choix && chaine.length===1) {
        // put choix on main if single? actually final is main
        section.choix = ov.choix;
      }
    } else {
      section.suite = premier.suite;
      if (ov.choix) section.choix = ov.choix;
    }
    trace(id, `chaîne ${chaine.length} combats override`);
  } else if (ov.combat) {
    section.combat = { ...ov.combat };
  } else {
    const stats = parserStats(bloc);
    if (stats.length>1) {
      const chaine = stats.map((s,idx)=>({ nom: s.nom, habilete: s.habilete, endurance: s.endurance }));
      const [premier, ...suite] = chaine;
      section.combat = { nom: premier.nom, habilete: premier.habilete, endurance: premier.endurance };
      suite.forEach((c,i)=>{
        const sid = `${id}-${String.fromCharCode(97+1+i)}`;
        sections.set(sid, { id: sid, texte: `Vous affrontez le ${c.nom} suivant.`, combat: { nom: c.nom, habilete: c.habilete, endurance: c.endurance }, suite: i < suite.length-1 ? `${id}-${String.fromCharCode(97+2+i)}` : undefined });
      });
      section.suite = `${id}-b`;
      trace(id, `chaîne auto ${chaine.length} (${stats.map(s=>s.nom).join(", ")})`);
    } else if (stats.length===1) {
      const ennemi = { nom: stats[0].nom, habilete: stats[0].habilete, endurance: stats[0].endurance };
      if (/insensible à la (?:discipline ka[ïi] de la )?puissance psychique/i.test(bloc)) ennemi.immunisePsychique = true;
      if (/multiplier par (?:2|deux)/i.test(bloc) && /mort[s]?\s+vivant/i.test(bloc)) ennemi.vulnerableGlaiveSommer = true;
      const fuite = bloc.match(/prendre la fuite[^.]*?(?:en vous rendant au|rendez-vous (?:pour cela |dans ce cas )?au|vous rendrez au)\s+(\d+)/i);
      if (fuite) ennemi.fuite = [{ texte: "Prendre la fuite", vers: fuite[1] }];
      // Bonus premier assaut ?
      if (/attaque par surprise/i.test(bloc)) ennemi.bonusPremierAssaut = 2;
      section.combat = ennemi;
    }
  }

  if (ov.evenement) section.evenement = ov.evenement;
  else {
    const jet = parserJet(bloc);
    if (jet) { section.evenement = { type: "jet-hasard-table", branches: jet.branches }; trace(id, `jet hasard : ${jet.resume}`); }
  }

  const perteCond = parserPerteEndurance(bloc);
  if (perteCond && !ov.evenement && !section.evenement) {
    section.choix = [
      { texte: "Si vous avez perdu des points d'ENDURANCE au cours du combat", vers: perteCond.perte },
      { texte: "Si vous avez remporté le combat sans perdre de points d'ENDURANCE", vers: perteCond.sansPerte },
    ];
    trace(id, `perte ENDURANCE: ${perteCond.perte}/${perteCond.sansPerte}`);
  }

  const phrases = decouperPhrases(bloc);
  const ciblesJet = new Set(section.evenement?.branches ? Object.values(section.evenement.branches).map(b=>b.vers).filter(Boolean) : []);
  const ciblesFuite = new Set((section.combat?.fuite ?? []).map(f=>f.vers));
  const phrasesChoix = [];
  const phrasesTexte = [];
  let derniere = null;
  for (const phrase of phrases) {
    const matches = [...phrase.matchAll(new RegExp(RE_CIBLE, 'gi'))];
    if (matches.length) {
      // if multiple rendez-vous in same sentence, split
      if (matches.length>1) {
        // attempt to split by color or by rendez-vous
        let remaining = phrase;
        for (const mm of matches) {
          const vers = mm[1];
          if (ciblesJet.has(vers) || ciblesFuite.has(vers)) continue;
          if (perteCond && (vers===perteCond.perte || vers===perteCond.sansPerte)) continue;
          // extract segment up to this rendez-vous
          const idx = remaining.toLowerCase().indexOf(mm[0].toLowerCase());
          let segment = idx>=0 ? remaining.slice(0, idx+mm[0].length) : mm[0];
          remaining = remaining.slice(idx+mm[0].length);
          const sans = segment.replace(RE_CIBLE, "").replace(/\s+/g, " ").replace(/[,;:\s.·?]+$/, "").trim();
          if (!sans && derniere) { const lp = derniere; phrasesTexte.pop(); derniere = phrasesTexte.length ? phrasesTexte[phrasesTexte.length-1] : null; phrasesChoix.push(lp + " " + segment); }
          else phrasesChoix.push(segment);
        }
        continue;
      }
      const m = matches[0];
      if (ciblesJet.has(m[1]) || ciblesFuite.has(m[1])) continue;
      if (perteCond && (m[1]===perteCond.perte || m[1]===perteCond.sansPerte)) continue;
      const sans = phrase.replace(RE_CIBLE, "").replace(/\s+/g, " ").replace(/[,;:\s.·?]+$/, "").trim();
      if (!sans && derniere) { const lp = derniere; phrasesTexte.pop(); derniere = phrasesTexte.length ? phrasesTexte[phrasesTexte.length-1] : null; phrasesChoix.push(lp + " " + phrase); continue; }
      phrasesChoix.push(phrase);
    } else { phrasesTexte.push(phrase); derniere = phrase; }
  }

  if (ov.choix) section.choix = ov.choix;
  else if (section.combat && phrasesChoix.length===1 && !section.suite && !perteCond) {
    section.suite = phrasesChoix[0].match(RE_CIBLE)[1];
    trace(id, `victoire → ${section.suite}`);
  } else if (phrasesChoix.length && !ov.suiteForcee && !perteCond) {
    const choixGen = phrasesChoix.map(phrase=>{
      const vers = phrase.match(RE_CIBLE)[1];
      const choix = { texte: libelleChoix(phrase), vers };
      if (/discipline ka[ïi]/i.test(phrase)) {
        const disc = disciplineDepuis(phrase);
        if (disc) choix.requis = { discipline: disc };
        if (/glaive de sommer/i.test(phrase)) choix.requis = { ...(choix.requis||{}), special: "glaive-sommer" };
      } else if (/glaive de sommer/i.test(phrase)) choix.requis = { special: "glaive-sommer" };
      if (/clé d['’]argent/i.test(phrase)) choix.requis = { ...(choix.requis||{}), special: "cle-argent" };
      return choix;
    });
    if (choixGen.length===1 && !section.combat && !section.evenement?.branches && !choixGen[0].requis && !choixGen[0].texte.trim()) {
      section.suite = choixGen[0].vers;
      trace(id, `suite auto vide → ${section.suite}`);
    } else {
      if (!section.choix) section.choix = choixGen;
    }
  } else if (ov.suite) section.suite = ov.suite;
  else {
    const cf = bloc.match(RE_CIBLE);
    if (cf && !section.fin && !section.combat && !section.evenement?.branches && !perteCond) { section.suite = cf[1]; trace(id, `suite auto → ${cf[1]}`); }
  }
  if (ov.suite && section.choix) section.suite = ov.suite;
  if (ov.effets) section.effets = ov.effets;
  if (ov.titre) section.titre = ov.titre;
  if (ov.image) section.image = ov.image;
  if (ov.texte) section.texte = ov.texte;

  const RE_STATS_TEXTE = /(?:[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9'’ \-]*?)?\s*HABILET[ÉE]\s*:?\s*\d{1,2}\s+ENDURANCE\s*:?\s*\d{1,2}/;
  if (!ov.texte && (section.choix || section.evenement?.branches)) section.texte = phrasesTexte.join(" ").trim() || bloc;
  else if (!ov.texte && section.combat) section.texte = phrasesTexte.join(" ").replace(RE_STATS_TEXTE, "").replace(/\s{2,}/g, " ").trim();
  else if (!ov.texte && section.suite && phrasesTexte.length && phrasesTexte.length < phrases.length) section.texte = phrasesTexte.join(" ").trim() || bloc;

  sections.set(id, section);
}

for (const [id, ov] of Object.entries(overrides)) {
  const supp = id==="sectionsSupplementaires" ? ov : ov.sectionsSupplementaires;
  if (Array.isArray(supp)) { for (const s of supp) { sections.set(s.id, s); trace(s.id, "synthétique"); } }
}

const ciblesManquantes = [];
for (const s of sections.values()) {
  const cibles = [...(s.choix??[]).map(c=>c.vers), ...(s.combat?.fuite??[]).map(f=>f.vers), ...(s.evenement?.branches ? Object.values(s.evenement.branches).map(b=>b.vers).filter(Boolean) : []), ...(s.suite?[s.suite]:[])];
  for (const c of cibles) if (!sections.has(c)) ciblesManquantes.push(`${s.id}→${c}`);
}
if (ciblesManquantes.length) trace("*", `CIBLES MANQUANTES: ${ciblesManquantes.join(", ")}`);
for (const s of sections.values()) {
  const sorties = (s.choix?.length??0)+(s.suite?1:0)+(s.combat?1:0)+(s.evenement?.branches?Object.keys(s.evenement.branches).length:0);
  if (sorties===0 && !s.fin) trace(s.id, "AUCUNE SORTIE");
}
const visites = new Set(); const pile = ["1"];
while (pile.length) {
  const id = pile.pop(); if (!id || visites.has(id) || !sections.has(id)) continue;
  visites.add(id); const s = sections.get(id);
  for (const c of s.choix??[]) pile.push(c.vers);
  for (const f of s.combat?.fuite??[]) pile.push(f.vers);
  if (s.evenement?.branches) for (const b of Object.values(s.evenement.branches)) if (b.vers) pile.push(b.vers);
  if (s.suite) pile.push(s.suite);
}
const inatteignables = [...sections.keys()].filter(id=>!visites.has(id));
if (inatteignables.length) trace("*", `INATTEIGNABLES (${inatteignables.length}): ${inatteignables.join(", ")}`);
const fins = [...sections.values()].filter(s=>s.fin);
trace("*", `Fins : ${fins.filter(f=>f.fin==="victoire").length} victoire(s), ${fins.filter(f=>f.fin==="mort").length} mort(s)`);
const combats = [...sections.values()].filter(s=>s.combat);
trace("*", `Combats : ${combats.length}`);

function carte() {
  for (let n=1;n<=350;n++) {
    const s = sections.get(String(n));
    if (!s) { console.log(`§${n} : ABSENT`); continue; }
    const drapeaux = [];
    if (s.fin) drapeaux.push(s.fin.toUpperCase());
    if (s.combat) drapeaux.push(`COMBAT(${s.combat.nom} ${s.combat.habilete}/${s.combat.endurance})`);
    if (s.evenement?.branches) drapeaux.push(`JET(${Object.entries(s.evenement.branches).map(([k,v])=>`${k}→${v.vers}`).join(" ")})`);
    if (s.choix) drapeaux.push(`choix=${s.choix.length}[${s.choix.map(c=>c.vers).join(",")}]`);
    if (s.suite) drapeaux.push(`suite→${s.suite}`);
    console.log(`§${n} : ${drapeaux.join(" ")}`);
  }
}

function serialiserChoix(c) {
  const p = [`texte: ${JSON.stringify(c.texte)}`, `vers: ${JSON.stringify(c.vers)}`];
  if (c.requis) p.push(`requis: ${JSON.stringify(c.requis)}`);
  if (c.montreToujours) p.push(`montreToujours: true`);
  if (c.effets) { const ef = serialiserEffets(c.effets); if (ef) p.push(`effets: ${ef}`); }
  return `{ ${p.join(", ")} }`;
}
function serialiserEffets(e) {
  if (!e) return undefined;
  const p = [];
  if (e.endurance!==undefined) p.push(`endurance: ${e.endurance}`);
  if (e.habilete!==undefined) p.push(`habilete: ${e.habilete}`);
  if (e.or!==undefined) p.push(`or: ${e.or}`);
  if (e.repas!==undefined) p.push(`repas: ${e.repas}`);
  if (e.objets) p.push(`objets: ${JSON.stringify(e.objets)}`);
  if (e.retirerObjets) p.push(`retirerObjets: ${JSON.stringify(e.retirerObjets)}`);
  if (e.perdreArme) p.push(`perdreArme: ${JSON.stringify(e.perdreArme)}`);
  if (e.drapeau) p.push(`drapeau: ${JSON.stringify(e.drapeau)}`);
  if (e.repasObligatoire) p.push(`repasObligatoire: true`);
  if (e.repasChassePossible===false) p.push(`repasChassePossible: false`);
  if (e.enduranceSiSansDiscipline) p.push(`enduranceSiSansDiscipline: { discipline: ${JSON.stringify(e.enduranceSiSansDiscipline.discipline)}, perte: ${e.enduranceSiSansDiscipline.perte} }`);
  if (e.guerisonReposSiDiscipline) p.push(`guerisonReposSiDiscipline: { discipline: ${JSON.stringify(e.guerisonReposSiDiscipline.discipline)} }`);
  if (e.mort) p.push(`mort: true`);
  if (!p.length) return undefined;
  return `{ ${p.join(", ")} }`;
}
function serialiserEnnemi(c) {
  const p = [`nom: ${JSON.stringify(c.nom)}`, `habilete: ${c.habilete}`, `endurance: ${c.endurance}`];
  if (c.immunisePsychique) p.push(`immunisePsychique: true`);
  if (c.vulnerableGlaiveSommer) p.push(`vulnerableGlaiveSommer: true`);
  if (c.bonusPremierAssaut) p.push(`bonusPremierAssaut: ${c.bonusPremierAssaut}`);
  if (c.sansDefenseAssauts) p.push(`sansDefenseAssauts: ${c.sansDefenseAssauts}`);
  if (c.bonusJoueur) p.push(`bonusJoueur: ${c.bonusJoueur}`);
  if (c.malusPsychique) p.push(`malusPsychique: ${c.malusPsychique}`);
  if (c.malusEvitePar) p.push(`malusEvitePar: ${JSON.stringify(c.malusEvitePar)}`);
  if (c.fuite) p.push(`fuite: [${c.fuite.map(f=>`{ texte: ${JSON.stringify(f.texte)}, vers: ${JSON.stringify(f.vers)} }`).join(", ")}]`);
  return `{ ${p.join(", ")} }`;
}
function serialiserEvenement(ev) {
  if (!ev) return undefined;
  const p = [`type: ${JSON.stringify(ev.type)}`];
  if (ev.titre) p.push(`titre: ${JSON.stringify(ev.titre)}`);
  if (ev.texte) p.push(`texte: ${JSON.stringify(ev.texte)}`);
  if (ev.ton) p.push(`ton: ${JSON.stringify(ev.ton)}`);
  if (ev.branches) {
    const br = Object.entries(ev.branches).map(([k,b])=>{
      const champs = [];
      if (b.vers!==undefined) champs.push(`vers: ${JSON.stringify(b.vers)}`);
      if (b.texte!==undefined) champs.push(`texte: ${JSON.stringify(b.texte)}`);
      if (b.endurance!==undefined) champs.push(`endurance: ${b.endurance}`);
      if (b.or!==undefined) champs.push(`or: ${b.or}`);
      if (b.objets!==undefined) champs.push(`objets: ${JSON.stringify(b.objets)}`);
      if (b.drapeau!==undefined) champs.push(`drapeau: ${JSON.stringify(b.drapeau)}`);
      if (b.mort!==undefined) champs.push(`mort: ${b.mort}`);
      return `${JSON.stringify(k)}: { ${champs.join(", ")} }`;
    });
    p.push(`branches: {\n        ${br.join(",\n        ")}\n      }`);
  }
  return `{\n        ${p.join(",\n        ")}\n      }`;
}
function serialiserSection(s) {
  const p = [`id: ${JSON.stringify(s.id)}`];
  if (s.titre) p.push(`titre: ${JSON.stringify(s.titre)}`);
  if (s.image) p.push(`image: ${JSON.stringify(s.image)}`);
  if (s.imageAlt) p.push(`imageAlt: ${JSON.stringify(s.imageAlt)}`);
  p.push(`texte: ${JSON.stringify(s.texte)}`);
  if (s.suite) p.push(`suite: ${JSON.stringify(s.suite)}`);
  if (s.choix) p.push(`choix: [\n    ${s.choix.map(serialiserChoix).join(",\n    ")}\n  ]`);
  const ef = serialiserEffets(s.effets);
  if (ef) p.push(`effets: ${ef}`);
  if (s.combat) p.push(`combat: ${serialiserEnnemi(s.combat)}`);
  const ev = serialiserEvenement(s.evenement);
  if (ev) p.push(`evenement: ${ev}`);
  if (s.fin) p.push(`fin: ${JSON.stringify(s.fin)}`);
  if (s.nomFin) p.push(`nomFin: ${JSON.stringify(s.nomFin)}`);
  return `  {\n  ${p.join(",\n  ")}\n  }`;
}
function ecrire() {
  const fs = require("node:fs"); const path = require("node:path");
  fs.mkdirSync(sortieDir, { recursive: true });
  const textes = {}; for (const [id,s] of sections) textes[id]=s.texte;
  fs.writeFileSync(path.join(sortieDir, "textes.json"), JSON.stringify(textes, undefined, 2)+"\n");
  const ids = [...sections.keys()].sort((a,b)=>{
    const na=parseInt(a,10), nb=parseInt(b,10);
    if (!isNaN(na) && !isNaN(nb) && na!==nb) return na-nb;
    return a.localeCompare(b);
  });
  const tranches = [{f:"sections-001-089.ts",de:1,a:89},{f:"sections-090-179.ts",de:90,a:179},{f:"sections-180-269.ts",de:180,a:269},{f:"sections-270-350.ts",de:270,a:350}];
  for (const tr of tranches) {
    const groupe = ids.filter(id=>{ const n=parseInt(id,10); return n>=tr.de && n<=tr.a && /^\d+$/.test(id); });
    const corps = groupe.map(id=>serialiserSection(sections.get(id))).join(",\n");
    const contenu = `import type { StorySection } from "../../../lib/lonewolf/types";\n\n/**\n * Loup Solitaire 03 — Les Grottes de Kalte\n * Paragraphes ${String(tr.de).padStart(3,"0")} à ${tr.a}. Généré par ls03-importer.cjs\n */\nexport const SECTIONS_${String(tr.de).padStart(3,"0")}_${tr.a}: StorySection[] = [\n${corps}\n];\n`;
    fs.writeFileSync(path.join(sortieDir, tr.f), contenu);
  }
  const suppIds = ids.filter(id=>!/^\d+$/.test(id));
  if (suppIds.length) {
    const corps = suppIds.map(id=>serialiserSection(sections.get(id))).join(",\n");
    fs.writeFileSync(path.join(sortieDir, "sections-supp.ts"), `import type { StorySection } from "../../../lib/lonewolf/types";\n\nexport const SECTIONS_SUPP: StorySection[] = [\n${corps}\n];\n`);
  }
}

if (MODE_CARTE) carte();
else if (!MODE_AUDIT) ecrire();

console.log("=== AUDIT IMPORT LS03 ===");
for (const a of audit) console.log(`§${a.section} : ${a.message}`);
console.log(`Total : ${sections.size} sections. ${MODE_AUDIT ? "(audit)" : MODE_CARTE ? "(carte)" : "Fichiers écrits."}`);
