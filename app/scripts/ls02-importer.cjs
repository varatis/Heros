#!/usr/bin/env node
/** LS02: source intégrale + règles relues. Aucune inférence de combat, de fin
 * ou d'effet depuis des mots-clés. --check vérifie les fichiers sans les écrire.
 * --audit et --carte sont non destructifs. Voir AUDIT_LS02.md. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const source = require('../../content/stories/ls02-source-verifiee.json');
const rules = require('./ls02-overrides.json');
const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, source.pdf))).digest('hex');
if (sha !== source.sha256) throw Error('Le PDF a changé : réextraire et relire la source.');
const sections = [];
const unique = xs => [...new Set(xs)];
function labels(text) {
  const matches = [...text.matchAll(/\bau\s+(\d{1,3})\b/g)];
  let last = 0;
  return matches.map(m => {
    let label = text.slice(last, m.index).replace(/rendez-?\s*vous(?:\s+\w+){0,3}\s*$/i, '').trim();
    last = m.index + m[0].length;
    label = label.split(/[.!?]\s+/).at(-1).replace(/^[.,;\s]+|[,;\s]+$/g, '');
    return { texte: label || `Continuer au §${m[1]}`, vers: m[1] };
  });
}
for (let n = 1; n <= 350; n++) {
  const id = String(n), src = source.sections[id], rule = rules[id] || {};
  const s = { id, texte: src.texte };
  if (!src.renvois.length) {
    s.fin = n === 350 ? 'victoire' : 'mort';
    s.nomFin = `${s.fin === 'victoire' ? 'Holmgard délivrée' : 'Fin de la mission'} — §${n}`;
  }
  if (rule.effets) s.effets = rule.effets;
  if (rule.evenement) s.evenement = rule.evenement;
  if (rule.combat) s.combat = rule.combat;
  const randomTargets = Object.values(s.evenement?.branches || {}).map(b => b.vers);
  const fleeTargets = (s.combat?.fuite || []).map(f => f.vers);
  let exits = labels(src.texte).filter(c => !randomTargets.includes(c.vers) && !fleeTargets.includes(c.vers));
  if (rule.choix) s.choix = rule.choix;
  else if (rule.combatsChaine) {
    const chain = rule.combatsChaine;
    const first = { ...chain[0] }; delete first.suite;
    s.combat = first;
    s.suite = `${id}-b`;
    chain.slice(1).forEach((e, i) => {
      const cid = `${id}-${String.fromCharCode(98 + i)}`;
      const combat = { ...e }; delete combat.suite;
      sections.push({ id: cid, texte: `Suite du combat du §${id} : adversaire ${i+2} sur ${chain.length}.`,
        combat, suite: e.suite || `${id}-${String.fromCharCode(99+i)}` });
    });
  } else if (s.combat) {
    if (unique(exits.map(c => c.vers)).length !== 1) throw Error(`Combat §${id} : issue ambiguë`);
    s.suite = exits[0].vers;
  } else if (exits.length === 1 && !rule.conditions && !rule.effetsChoix) s.suite = exits[0].vers;
  else if (exits.length) s.choix = exits;
  if (s.choix) for (const c of s.choix) {
    if (rule.conditions?.[c.vers]) c.requis = rule.conditions[c.vers];
    if (rule.effetsChoix?.[c.vers]) c.effets = rule.effetsChoix[c.vers];
  }
  sections.push(s);
}
for (const [id, r] of Object.entries(rules)) {
  if (!/^\d+-/.test(id)) continue;
  const { source: ignored, ...s } = r;
  sections.push({ id, ...s });
}
sections.sort((a,b) => a.id.localeCompare(b.id, 'en', {numeric:true}));
const ids = new Set(sections.map(s => s.id));
function targets(s) {
  return [s.suite, ...(s.choix || []).map(c=>c.vers), ...(s.combat?.fuite || []).map(f=>f.vers),
    s.combat?.defaiteVers, ...Object.values(s.evenement?.branches || {}).map(b=>b.vers)].filter(Boolean);
}
if (ids.size !== sections.length) throw Error('Identifiant dupliqué');
for (const s of sections) {
  for (const t of targets(s)) if (!ids.has(t)) throw Error(`${s.id} → ${t} absent`);
  if (!s.fin && !targets(s).length) throw Error(`§${s.id} sans sortie`);
}
const dest = path.join(root, 'app/content/lonewolf/ls02');
const files = new Map();
files.set('textes.json', JSON.stringify(Object.fromEntries(sections.map(s=>[s.id,s.texte])),null,2)+'\n');
for (const [min,max] of [[1,89],[90,179],[180,269],[270,350]]) {
  const prefix = String(min).padStart(3,'0');
  const group = sections.filter(s => parseInt(s.id)>=min && parseInt(s.id)<=max);
  files.set(`sections-${prefix}-${String(max).padStart(3,'0')}.ts`,
    `// Généré par scripts/ls02-importer.cjs. Source PDF SHA-256: ${sha}\n`+
    `// Les identifiants suffixés sont des étapes techniques, pas des paragraphes du livre.\n`+
    `import type { StorySection } from "../../../lib/lonewolf/types";\n`+
    `export const SECTIONS_${prefix}_${max}: StorySection[] = ${JSON.stringify(group,null,2)};\n`);
}
const audit = process.argv.includes('--audit') || process.argv.includes('--carte');
if (!audit) for (const [name, text] of files) {
  const filename = path.join(dest,name);
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(filename,'utf8')!==text) throw Error(`${name} désynchronisé : relancer l'import`);
  } else fs.writeFileSync(filename,text);
}
if (process.argv.includes('--carte')) for (const s of sections) console.log(s.id, targets(s).join(', ') || s.fin);
console.log(`LS02 : 350 paragraphes source, ${sections.length-350} étapes techniques, ${sections.length} lignes. PDF vérifié.`);
