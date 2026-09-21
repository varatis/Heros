#!/usr/bin/env node
// Matrice de traçabilité : le statut n'est PAS une preuve exhaustive des parcours.
require('./load-lonewolf.cjs');
const fs=require('node:fs'),path=require('node:path');
const {LS02}=require('../content/lonewolf/ls02/index.ts');
const source=require('../../content/stories/ls02-source-verifiee.json');
const rules=require('./ls02-overrides.json');
const rows=['# LS02 — Matrice des 350 paragraphes','',
  'Générée par `node app/scripts/ls02-audit.cjs`. Lire d’abord `AUDIT_LS02.md` pour les limites.',
  'Les pages désignent les **pages physiques du PDF**, non une pagination imprimée.',
  'Chaque ligne est couverte par les tests de texte et de renvois. Les colonnes mécaniques inventorient les règles codées, sans certifier toutes les combinaisons d’états.',
  '', '| § | Pages PDF | Renvois imprimés | Règles encodées |', '|---|---|---|---|'];
for(let n=1;n<=350;n++) {
  const src=source.sections[n],s=LS02.sections[n],r=rules[n]||{},tags=[];
  if(s.combat)tags.push(`Combat ${s.combat.habilete}/${s.combat.endurance}`);
  if(r.combatsChaine)tags.push(`${r.combatsChaine.length} adversaires successifs`);
  if(s.evenement?.branches)tags.push('Table de Hasard');
  if(s.evenement?.interaction)tags.push(s.evenement.interaction.type);
  if(s.choix?.some(c=>c.requis))tags.push('Conditions');
  if(s.choix?.some(c=>c.effets))tags.push('Effets au choix');
  if(s.effets)tags.push(Object.keys(s.effets).join(', '));
  if(s.fin)tags.push(s.fin);
  if(n===276)tags.push('Défi non mortel (18/25) ou Puissance Psychique');
  if(src.transcriptionImage)tags.push('Enseigne transcrite de l’image');
  rows.push(`| ${n} | ${src.pages.join(', ')} | ${src.renvois.join(', ')||'—'} | ${tags.join(' ; ')||'Navigation'} |`);
}
const text=rows.join('\n')+'\n',dest=path.resolve(__dirname,'../../AUDIT_LS02_PARAGRAPHES.md');
if(process.argv.includes('--check')) {if(fs.readFileSync(dest,'utf8')!==text)throw Error('Matrice désynchronisée');}
else fs.writeFileSync(dest,text);
