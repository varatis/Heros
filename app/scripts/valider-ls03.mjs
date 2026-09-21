import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const dossier = "app/content/lonewolf/ls03";
const fichiers = readdirSync(dossier).filter(f=>f.startsWith("sections-"));
const positions=[];
const objetsConnus=new Set();
const rules=readFileSync("app/lib/lonewolf/rules.ts","utf8");
for (const m of rules.matchAll(/id:\s*"([a-z0-9-]+)",/g)) objetsConnus.add(m[1]);

for (const f of fichiers){
  const src=readFileSync(join(dossier,f),"utf8");
  const blocs=src.split(/\n  \{\n/).slice(1);
  for (const bloc of blocs){
    const id=bloc.match(/id:\s*"([^"]+)"/)?.[1];
    if(id) positions.push({id,fichier:f,bloc});
  }
}
const positionsParId=new Map(positions.map(p=>[p.id,p]));
const erreurs=[];
const sorties=new Map();
function cible(section, texte){
  if(!positionsParId.has(texte)){
    erreurs.push(`Paragraphe ${section.id} (${section.fichier}) → "${texte}" inexistant`);
  }
}
for (const pos of positions){
  const bloc=pos.bloc;
  const cibles=[...bloc.matchAll(/vers:\s*"([^"]+)"/g), ...bloc.matchAll(/suite:\s*"([^"]+)"/g)].map(m=>m[1]);
  // also branches vers
  for (const mm of bloc.matchAll(/"vers":\s*"([^"]+)"/g)) cibles.push(mm[1]);
  sorties.set(pos.id, [...new Set(cibles)]);
  for (const c of cibles) cible(pos,c);
  for (const m of bloc.matchAll(/\{\s*id:\s*"([a-z0-9-]+)"/g)){
    if(!objetsConnus.has(m[1])){
      erreurs.push(`Paragraphe ${pos.id} : objet inconnu "${m[1]}"`);
    }
  }
}
const vus=new Set();
const pile=["1"];
while(pile.length){
  const id=pile.pop();
  if(!id||vus.has(id)||!positionsParId.has(id)) continue;
  vus.add(id);
  for(const c of sorties.get(id)??[]) pile.push(c);
}
for(const pos of positions){
  if(!vus.has(pos.id)) erreurs.push(`Paragraphe ${pos.id} jamais atteint depuis le 1`);
}
for(const pos of positions){
  const estTerminal=/fin:\s*"/.test(pos.bloc);
  const aCombatSansSuite=/combat:\s*\{/.test(pos.bloc) && !/suite:\s*"/.test(pos.bloc);
  const hasEvenement=/evenement:/.test(pos.bloc);
  if(!estTerminal && !hasEvenement && (sorties.get(pos.id)??[]).length===0){
    // combat sans suite but with choices? still need sortie
    if(!/choix:/.test(pos.bloc)) erreurs.push(`Paragraphe ${pos.id} : aucune sortie (cul-de-sac)`);
  }
}
const fins=positions.filter(p=>/fin:\s*"/.test(p.bloc));
function finsparType(t){return fins.filter(f=>new RegExp(`fin:\\s*"${t}"`).test(f.bloc));}
console.log(`Paragraphes      : ${positions.length}`);
console.log(`Atteignables     : ${vus.size}`);
console.log(`Fins victoire    : ${finsparType("victoire").map(f=>f.id).join(", ")||"aucune"}`);
console.log(`Fins mort        : ${finsparType("mort").map(f=>f.id).join(", ")||"aucune"}`);
console.log(`Fins neutre      : ${finsparType("neutre").map(f=>f.id).join(", ")||"aucune"}`);
console.log(`Fins             : ${fins.length}`);
if(erreurs.length){
  console.error("\n❌ "+erreurs.length+" problème(s) :");
  for(const e of erreurs) console.error("  - "+e);
  process.exit(1);
}
console.log("\n✅ Graphe narratif valide.");
