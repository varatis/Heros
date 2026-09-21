const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {execFileSync} = require('node:child_process');
require('./load-lonewolf.cjs');
const {LS02: book} = require('../content/lonewolf/ls02/index.ts');
const E = require('../lib/lonewolf/engine.ts');
const R = require('../lib/lonewolf/rules.ts');
const I = require('../lib/lonewolf/ls02-interactions.ts');
const root = path.resolve(__dirname,'../..');
const source = require('../../content/stories/ls02-source-verifiee.json');
const sections = book.sections;
const all = Object.values(sections);
const sorted = a => [...new Set(a)].sort((a,b)=>Number(a)-Number(b));
const targets = s => [s.suite,...(s.choix||[]).map(c=>c.vers),...(s.combat?.fuite||[]).map(f=>f.vers),s.combat?.defaiteVers,...Object.values(s.evenement?.branches||{}).map(b=>b.vers)].filter(Boolean);
function state(patch={}) {return {...E.creerAventure({book,habileteBase:15,enduranceBase:25,disciplines:[],orDepart:15}),...patch};}

// Oracles manuels séparés du générateur et des overrides : transcription du PDF.
const combats = {
  5:[[22,20]],7:[[28,30]],17:[[22,30]],30:[[13,16]],34:[[16,14]],60:[[8,11]],66:[[15,15]],85:[[24,27]],
  90:[[10,16],[6,9],[11,14],[5,8],[11,17]],106:[[22,30]],110:[[15,22]],128:[[13,19]],
  131:[[15,23],[13,21],[13,20]],146:[[15,15]],157:[[15,22]],158:[[16,23]],162:[[20,27]],185:[[17,25],[16,26]],
  237:[[23,30]],241:[[17,25]],268:[[16,25]],270:[[28,30]],276:[[18,25]],282:[[16,24],[16,22]],
  296:[[13,22],[12,20],[11,19],[11,9],[10,18],[10,17]],298:[[15,23],[13,21],[13,20]],306:[[16,24]],326:[[15,25]],332:[[21,30]],345:[[16,24]],348:[[16,25]]
};
const jets = {
  10:[51,51,51,51,195,195,195,339,339,339],12:[58,58,58,58,167,167,167,329,329,329,329,329],22:[119,119,119,119,119,341,341,341,341,341],31:[176,176,176,176,176,254,254,254,254,254],45:[311,311,311,311,311,311,311,311,159,159],81:[260,260,260,260,260,281,281,281,281,281],99:[326,326,326,326,326,163,163,163,163,163],105:[286,286,286,286,286,120,120,120,120,120],114:[206,206,206,206,63,63,63,63,8,8],122:[46,46,46,46,46,112,112,112,112,112],151:[262,262,262,262,262,110,110,110,110,110],152:[216,216,216,216,49,49,49,193,193,193],169:[39,39,39,39,249,249,249,339,339,339],175:[53,53,53,53,53,209,209,209,209,209],183:[311,311,311,311,311,311,311,311,311,159],197:[247,78,78,78,78,141,141,141,141,141],201:[285,285,285,285,285,70,70,70,70,70],210:[275,275,275,275,275,330,330,330,330,330],278:[41,41,41,41,41,41,41,180,180,180],280:[2,2,2,2,2,108,108,108,108,108],300:[224,224,316,316,81,81,22,22,99,99],316:[107,107,107,107,107,94,94,94,94,94]
};

test('Source : SHA-256 du PDF, 191 pages, 350 textes intégraux et fichiers reproductibles',()=>{
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,source.pdf))).digest('hex'),source.sha256);
  assert.equal(source.nombrePages,191);
  assert.equal(Object.keys(source.sections).length,350);
  for (let n=1;n<=350;n++) {
    assert.equal(sections[n].texte,source.sections[n].texte,`§${n}: texte tronqué ou réécrit`);
    assert.ok(source.sections[n].pages.length);
  }
  for (const args of [['ls02-importer.cjs','--check'],['generer-sql-contenu.cjs','ls02','--check'],['ls02-audit.cjs','--check']])
    execFileSync(process.execPath,args.map((a,i)=>i===0?path.join(__dirname,a):a));
});

test('576 renvois source : ni oubli, ni renvoi inventé, ni contournement des chaînes de combat',()=>{
  let count=0;
  for(let n=1;n<=350;n++) {
    const seen = new Set();
    function collapse(id) {
      if (/^\d+$/.test(id)) return [id];
      assert.equal(parseInt(id),n,`§${n}: étape technique étrangère ${id}`);
      assert.ok(!seen.has(id),`cycle technique ${id}`);seen.add(id);
      assert.ok(sections[id]);return targets(sections[id]).flatMap(collapse);
    }
    const actual=targets(sections[n]).flatMap(collapse);
    assert.deepEqual(sorted(actual),sorted(source.sections[n].renvois),`§${n}`);
    count+=source.sections[n].renvois.length;
    if (sections[n].combat) assert.ok(!sections[n].choix?.length,'combat contournable');
  }
  assert.equal(count,576);
  const visited=new Set(), queue=['1'];
  while(queue.length) {const id=queue.pop();if(visited.has(id))continue;visited.add(id);assert.ok(sections[id],id);queue.push(...targets(sections[id]));}
  assert.equal(visited.size,all.length,'section structurellement inaccessible');
  assert.deepEqual(all.filter(s=>s.fin==='mort').map(s=>+s.id).sort((a,b)=>a-b),[8,11,44,54,87,126,159,190,212,213,214,234,247,248,275,292,304,317]);
  assert.deepEqual(all.filter(s=>s.fin==='victoire').map(s=>s.id),['350']);
});

test('Tous les adversaires : statistiques et ordre transcrits du PDF, aucun combat aléatoire substitué',()=>{
  const actual={};
  for(const s of all.filter(s=>s.combat)) (actual[parseInt(s.id)]??=[]).push([s.combat.habilete,s.combat.endurance]);
  assert.deepEqual(actual,combats);
  for(const n of [7,270]) {assert.equal(sections[n].combat.immunisePsychique,true);assert.equal(sections[n].combat.bonusPremierAssaut,2);}
  for(const n of [106,332]) {assert.equal(sections[n].combat.degatsPsychiquesParAssaut,2);assert.equal(sections[n].combat.bonusJoueur,undefined);assert.equal(sections[n].combat.malusPsychique,undefined);}
  for(const n of [268,348])assert.equal(sections[n].combat.fuiteApresAssauts,2);
});

test('Tous les jets 0–9, bonus Sixième Sens et formules de gains/pertes',()=>{
  for(const [n,expected] of Object.entries(jets)) for(let d=0;d<expected.length;d++) {
    const ev=sections[n].evenement;
    const matching=Object.keys(ev.branches).filter(k=>{const [a,b]=k.split('-').map(Number);return d>=a&&d<=b});
    assert.equal(matching.length,1,`${n}/${d}: trou ou chevauchement`);
    assert.equal(E.branchePour(ev,d).vers,String(expected[d]),`${n}/${d}`);
  }
  for(let d=0;d<10;d++) for(const sense of [false,true]) {
    const s=state({disciplines:sense?['sixieme-sens']:[]});
    assert.equal(E.resoudreEvenement(s,sections[12].evenement,d).vers,String(jets[12][d+(sense?2:0)]));
    for(const n of [21,57,116]) {
      const result=E.resoudreEvenement(state({couronnes:0}),sections[n].evenement,d);
      assert.equal(result.state.couronnes,n===21?(d||10)*3-1:n===116?d+4:0);
    }
  }
  assert.throws(()=>E.resoudreEvenement(state(),sections[12].evenement,10));
  assert.throws(()=>E.resoudreEvenement(state({disciplines:['sixieme-sens']}),sections[122].evenement,0));
});

test('Issues conditionnelles : présence ET absence, argent 0–50 ; aucun « sinon » libre',()=>{
  const pairs=[[2,42,168,'discipline','sixieme-sens'],[23,144,295,'discipline','communication-animale'],[39,346,156,'objet','billet-port-bax'],[40,97,242,'discipline','sixieme-sens'],[47,111,307,'drapeau','crepuscule'],[52,338,234,'objet','lance-magique'],[59,332,311,'objet','lance-magique'],[70,219,44,'objet','cristal-etoile'],[107,74,294,'discipline','guerison'],[108,343,168,'discipline','sixieme-sens'],[134,38,304,'objet','lance-magique'],[196,79,123,'discipline','sixieme-sens'],[239,77,28,'discipline','camouflage']];
  for(const [n,y,no,kind,key] of pairs) for(const yes of [false,true]) {
    const s=state({objetsSpeciaux:[],disciplines:[],drapeaux:{}});
    if(yes) {if(kind==='discipline')s.disciplines=[key];if(kind==='objet')s.objetsSpeciaux=[key];if(kind==='drapeau')s.drapeaux[key]=true;}
    assert.deepEqual(sections[n].choix.filter(c=>E.requiert(s,c.requis)).map(c=>c.vers),[String(yes?y:no)],`§${n}/${yes}`);
  }
  for(let money=0;money<=50;money++) for(const n of [117,233]) {
    const cs=sections[n].choix.filter(c=>E.requiert(state({couronnes:money}),c.requis)).map(c=>c.vers);
    assert.deepEqual(cs,money===0?['292']:money<3?['148']:['37','148']);
  }
  for(let bits=0;bits<4;bits++) {
    const ds=['sixieme-sens','maitrise-matiere'].filter((_,i)=>bits&(1<<i));
    assert.deepEqual(sections[25].choix.filter(c=>E.requiert(state({disciplines:ds}),c.requis)).map(c=>c.vers),[bits?'116':'153']);
  }
});

test('Chacun des 345 choix a un témoin local satisfaisant ses conditions',()=>{
  // Toutes les combinaisons des prédicats pertinents, pas un état omnipotent.
  function atoms(req,out=new Map()) {
    if(!req)return out;
    if(req.non)atoms(req.non,out);
    for(const r of req.auMoinsUn||[])atoms(r,out);
    for(const k of ['discipline','objet','special','drapeau'])if(req[k])out.set(k+':'+req[k],[k,req[k]]);
    return out;
  }
  let covered=0;
  for(const s of all) for(const c of s.choix||[]) {
    const aa=[...atoms(c.requis).values()];let witness;
    for(let b=0;b<(1<<aa.length)&&!witness;b++)for(let money=0;money<=50&&!witness;money++){
      const st=state({paragraphe:s.id,couronnes:money,objetsSpeciaux:['sac-a-dos'],mains:[],sac:[],disciplines:[],drapeaux:{}});
      aa.forEach(([k,v],i)=>{if(!(b&(1<<i)))return;if(k==='discipline')st.disciplines.push(v);else if(k==='drapeau')st.drapeaux[v]=true;else E.ajouterObjet(st,{id:v});});
      if(E.requiert(st,c.requis))witness=st;
    }
    assert.ok(witness,`${s.id} → ${c.vers} impossible`);
    const res=E.appliquerEffets(witness,c.effets);
    if(!res.mort)assert.equal(E.chargerParagraphe(res.state,book,c.vers).section.id,c.vers);
    covered++;
  }
  assert.equal(covered,345);
});

test('Objets, repas, poison, repos et coûts : régressions relevées dans le PDF',()=>{
  assert.equal(R.getItem('potion-guerison-3').effet.endurance,3);
  assert.equal(R.getItem('laumspur-5').effet.endurance,5);
  assert.equal(R.getItem('herbe-laumspur').effet.endurance,3);
  assert.ok(!R.getItem('liquide-orange').effet);
  for(const n of [78,141]) {
    const s=E.appliquerEffets(state({objetsSpeciaux:['cotte-mailles']}),sections[n].effets).state;
    assert.ok(!s.objetsSpeciaux.includes('cotte-mailles'));
  }
  const s=state({objetsSpeciaux:['lance-magique','sceau-hammardal'],couronnes:10,sac:['repas'],mains:['epee']});
  assert.deepEqual(E.appliquerEffets(s,sections[194].effets).state.objetsSpeciaux,[]);
  const give=sections[299].choix.find(c=>c.vers==='102');
  assert.ok(!E.appliquerEffets(s,give.effets).state.objetsSpeciaux.includes('lance-magique'));
  assert.deepEqual(E.appliquerEffets(s,sections[337].effets).state.mains,[]);
  for(let hp=1;hp<=25;hp++)for(const heal of [false,true]) {
    const res=E.appliquerEffets(state({enduranceActuelle:hp,disciplines:heal?['guerison']:[]}),sections[240].effets);
    assert.equal(res.state.enduranceActuelle,heal?25:hp+Math.ceil((25-hp)/2));
  }
  for(let money=0;money<3;money++)for(const food of [false,true])for(const hunt of [false,true]) {
    const st=state({couronnes:money,sac:food?['repas']:[],disciplines:hunt?['chasse']:[]});
    const res=E.appliquerEffets(st,sections[346].effets).state;
    assert.equal(res.enduranceActuelle,food||money?25:22);
    assert.equal(res.couronnes,food||!money?money:money-1);
  }
  const death=E.chargerParagraphe(state({enduranceActuelle:2,disciplines:['guerison'],sac:[]}),book,'32');
  assert.equal(death.mort,true);assert.equal(death.state.enduranceActuelle,0);assert.equal(death.state.termine,true);
  assert.throws(()=>E.chargerParagraphe(death.state,book,'350'));
  assert.ok(!sections[314].effets?.repasObligatoire,'Ne pas manger deux fois le repas empoisonné');
  assert.equal(sections[305].effets.or,5);
  assert.ok(!sections[72].effets.or,'Bière payée une seule fois');
  assert.ok(!sections[327].evenement.interaction.prix['laissez-passer-blanc']);
});

test('Table imprimée p.191 : 130 cellules indépendantes, dont morts instantanées',()=>{
  const rows=[
    '0/K 0/K 0/8 0/6 1/6 2/5 3/5 4/5 5/4 6/4 7/4 8/3 9/3',
    '0/K 0/8 0/7 1/6 2/5 3/5 4/4 5/4 6/3 7/3 8/3 9/3 10/2',
    '0/8 0/7 1/6 2/5 3/5 4/4 5/4 6/3 7/3 8/3 9/2 10/2 11/2',
    '0/8 1/7 2/6 3/5 4/4 5/4 6/3 7/3 8/2 9/2 10/2 11/2 12/2',
    '1/7 2/6 3/5 4/4 5/4 6/3 7/2 8/2 9/2 10/2 11/2 12/2 14/1',
    '2/6 3/6 4/5 5/4 6/3 7/2 8/2 9/2 10/2 11/1 12/1 14/1 16/1',
    '3/5 4/5 5/4 6/3 7/2 8/2 9/1 10/1 11/1 12/0 14/0 16/0 18/0',
    '4/4 5/4 6/3 7/2 8/1 9/1 10/0 11/0 12/0 14/0 16/0 18/0 K/0',
    '5/3 6/3 7/2 8/0 9/0 10/0 11/0 12/0 14/0 16/0 18/0 K/0 K/0',
    '6/0 7/0 8/0 9/0 10/0 11/0 12/0 14/0 16/0 18/0 K/0 K/0 K/0'
  ];
  rows.forEach((row,i)=>assert.deepEqual(R.COUPS_PORTES[(i+1)%10],row.split(' ').map(p=>p.split('/').map(x=>x==='K'?x:Number(x))),`ligne ${(i+1)%10}`));
  const result=E.resoudreAssaut(state({habileteBase:40,mains:['epee'],armeEnMain:'epee'}),sections[268].combat,25,0,1);
  assert.equal(result.enduranceEnnemi,0,'T doit tuer, et non infliger zéro dégât');assert.equal(result.termine,'victoire');
});

test('Combats : tous adversaires × 10 habiletés × 10 jets × 3 tours ; pouvoirs/fuite/défaite',()=>{
  for(const sec of all.filter(s=>s.combat)) for(let h=10;h<=19;h++)for(let d=0;d<=9;d++)for(let tour=1;tour<=3;tour++) {
    const s=state({habileteBase:h,mains:['epee'],armeEnMain:'epee',objetsSpeciaux:['lance-magique']});
    const result=E.resoudreAssaut(s,sec.combat,sec.combat.endurance,d,tour);
    assert.ok(result.enduranceEnnemi>=0&&result.enduranceEnnemi<=sec.combat.endurance);
    assert.ok(result.state.enduranceActuelle>=0&&result.state.enduranceActuelle<=25);
  }
  const armed=state({mains:['epee'],armeEnMain:'epee',objetsSpeciaux:['lance-magique']});
  for(let d=0;d<10;d++) {
    const a=E.resoudreAssaut(armed,sections[106].combat,30,d,1);
    const b=E.resoudreAssaut({...armed,disciplines:['bouclier-psychique']},sections[106].combat,30,d,1);
    assert.equal(a.log.quotient,b.log.quotient);
    assert.equal(a.state.enduranceActuelle,Math.max(0,b.state.enduranceActuelle-2));
    for(let tour=1;tour<=2;tour++)assert.equal(E.resoudreAssaut(armed,sections[60].combat,11,d,tour).state.enduranceActuelle,25);
  }
  const sommer=state({mains:['epee'],armeEnMain:'epee',objetsSpeciaux:['glaive-sommer'],disciplines:['maitrise-armes'],armeMaitrisee:'epee'});
  assert.equal(E.habileteCombat(sommer).total,25,'Sommer +8 et maîtrise +2, une seule fois');
  assert.equal(E.habileteCombat({...sommer,armeEnMain:undefined}).total,25);
  const spearOnly=state({mains:[],armeEnMain:undefined,objetsSpeciaux:['lance-magique'],disciplines:['maitrise-armes'],armeMaitrisee:'lance'});
  assert.equal(E.habileteCombat(spearOnly,sections[306].combat).total,17,'la Lance reste une arme hors des combats contre les Monstres');
  const normal=E.resoudreAssaut(armed,{nom:'Garde',habilete:16,endurance:24},24,6,1);
  assert.equal(E.resoudreAssaut(armed,sections[306].combat,24,6,1).log.degatsEnnemi,normal.log.degatsEnnemi*2);
  assert.throws(()=>E.fuirCombat(armed,sections[268],1,1,'125'));
  assert.ok(E.fuirCombat(armed,sections[268],2,1,'125').state.enduranceActuelle<25);
  const challenge=E.chargerParagraphe(state(),book,'276-combat');
  const lose={...challenge.state,enduranceActuelle:0};
  const result=E.defaiteNonMortelle(lose,sections['276-combat']);
  assert.equal(result.vers,'192');assert.equal(result.state.enduranceActuelle,25);
  assert.equal(E.defaiteNonMortelle(lose,sections[268]),undefined);
});

test('Hublots : 1 000 000 combinaisons, double zéro et égalités ; roulette 5 000 mises/tirages',()=>{
  for(let v=0;v<1000000;v++) {
    const ds=String(v).padStart(6,'0').split('').map(Number);
    const scores=[0,2,4].map(i=>[Number(ds[i]===0&&ds[i+1]===0),ds[i]+ds[i+1]]);
    const compare=(a,b)=>a[0]-b[0] || a[1]-b[1];
    const tie=compare(scores[0],scores[1])===0||compare(scores[0],scores[2])===0||compare(scores[1],scores[2])===0;
    const expected=tie?0:compare(scores[2],scores[0])>0&&compare(scores[2],scores[1])>0?6:-3;
    assert.equal(I.resultatHublots(ds),expected);
  }
  for(let numero=0;numero<10;numero++)for(let d=0;d<10;d++)for(let mise=1;mise<=50;mise++){
    const attendu=d===numero?mise*8:[(numero+9)%10,(numero+1)%10].includes(d)?mise*5:-mise;
    assert.equal(I.resultatRoulette(numero,mise,d),attendu);
  }
  const st=state({paragraphe:'238',couronnes:50,drapeaux:{'ls02:238:gains':39}});
  assert.equal(I.appliquerInteraction(st,sections[238],{type:'roulette',numero:0,tirage:0,mise:1}).drapeaux['ls02:238:gains'],40);
  assert.throws(()=>I.appliquerInteraction({...st,drapeaux:{'ls02:238:gains':40}},sections[238],{type:'roulette',numero:0,tirage:0,mise:1}));
});

test('Chaque offre et tarif : acquisition/revente, argent insuffisant, capacités, aucun achat partiel',()=>{
  for(const sec of all) {
    const inter=sec.evenement?.interaction;
    if(inter?.type==='butin')for(let i=0;i<inter.offres.length;i++) {
      const st=state({paragraphe:sec.id,couronnes:0,mains:[],sac:[],objetsSpeciaux:['sac-a-dos']});
      const next=I.appliquerInteraction(st,sec,{type:'prendre',index:i});
      const o=inter.offres[i];
      if(o.id)assert.equal([...next.sac,...next.mains,...next.objetsSpeciaux].filter(x=>x===o.id).length,(o.quantity||1)+(o.id==='sac-a-dos'?1:0));
      else assert.equal(next.couronnes,o.or);
      assert.throws(()=>I.appliquerInteraction(next,sec,{type:'prendre',index:i}));
    }
    if(inter?.type==='boutique')for(const [id,prix] of Object.entries(inter.prix)) {
      const st=state({paragraphe:sec.id,couronnes:prix,mains:[],sac:[],objetsSpeciaux:['sac-a-dos']});
      assert.throws(()=>I.appliquerInteraction({...st,couronnes:prix-1},sec,{type:'acheter',id}));
      const next=I.appliquerInteraction(st,sec,{type:'acheter',id});assert.equal(next.couronnes,0);assert.ok(E.possede(next,id));
      if(inter.revente) {const sold=I.appliquerInteraction(next,sec,{type:'vendre',id});assert.equal(sold.couronnes,prix-1);assert.ok(!E.possede(sold,id));}
    }
  }
  const st=state({paragraphe:'91',sac:Array(7).fill('repas')});const before=structuredClone(st);
  assert.throws(()=>I.appliquerInteraction(st,sections[91],{type:'prendre',index:2}));assert.deepEqual(st,before);
});

test('Parcours légal complet de §1 à §350, achats, jets, disciplines, combats et effets réels',()=>{
  let s=E.creerAventure({book,habileteBase:19,enduranceBase:29,disciplines:['guerison','chasse','communication-animale','orientation','maitrise-armes'],armeMaitrisee:'epee',tirageDepart:'1',tirageDepart2:'0',orDepart:19});
  s=E.chargerParagraphe(s,book,'1').state;
  const route=[160,16,268,333,300,99,163,240,101,222,175,209,197,78,337,139,27,312,117,37,257,181,186,136,238,186,136,10,51,103,249,39,346,280,2,168,314,290,200,158,220,33,88,150,334,115,80,15,244,47,111,265,252,191,318,62,263,246,202,31,176,277,59,311,299,118,279,23,144,349,284,9,196,123,40,242,152,216,100,267,309,26,66,218,105,120,225,350].map(String);
  for(const target of route) {
    const sec=sections[s.paragraphe];
    if(sec.id==='238')s=I.appliquerInteraction(s,sec,{type:'roulette',numero:0,mise:1,tirage:0});
    if(sec.combat) {
      let ep=sec.combat.endurance,turn=0;
      while(ep>0&&turn<100){const r=E.resoudreAssaut(s,sec.combat,ep,0,++turn);s=r.state;ep=r.enduranceEnnemi;assert.notEqual(r.termine,'mort');}
      assert.equal(ep,0);
    }
    if(sec.evenement?.branches&&E.requiert(s,sec.evenement.requis)) {
      const die=Array.from({length:10},(_,i)=>i).find(d=>E.resoudreEvenement(s,sec.evenement,d).vers===target);
      assert.notEqual(die,undefined,`${sec.id} → ${target}`);
      s=E.resoudreEvenement(s,sec.evenement,die).state;
    } else if(sec.suite)assert.equal(sec.suite,target);
    else {
      const c=sec.choix.find(c=>c.vers===target&&E.requiert(s,c.requis));
      assert.ok(c,`${sec.id} → ${target}, or ${s.couronnes}`);
      const r=E.appliquerEffets(s,c.effets);assert.ok(!r.mort);s=r.state;
    }
    const res=E.chargerParagraphe(s,book,target);assert.ok(!res.mort,`Mort §${target}`);s=res.state;
  }
  assert.equal(s.paragraphe,'350');assert.equal(s.termine,true);
});

test('SQL PostgreSQL : réimport ×2, 366 lignes conformes, isolation autres livres/sauvegardes et rollback',async()=>{
  const {PGlite}=await import('@electric-sql/pglite');
  const {uuid_ossp}=await import('@electric-sql/pglite/contrib/uuid_ossp');
  const db=new PGlite({extensions:{uuid_ossp}});
  try {
    await db.exec(`CREATE EXTENSION "uuid-ossp"; CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
      CREATE TABLE public.profiles(id uuid PRIMARY KEY);
      CREATE FUNCTION update_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;`);
    await db.exec(fs.readFileSync(path.join(root,'app/supabase/migrations/004_loup_solitaire_schema.sql'),'utf8'));
    await db.exec(`INSERT INTO lw_livres(slug,numero,titre) VALUES ('autre-livre',1,'Ne pas toucher');
      INSERT INTO lw_sections(livre_slug,numero,texte) VALUES ('autre-livre','1','Témoin');
      INSERT INTO profiles VALUES ('11111111-1111-1111-1111-111111111111');
      INSERT INTO lw_sauvegardes(user_id,livre_slug,etat,paragraphe) VALUES ('11111111-1111-1111-1111-111111111111','loup-solitaire-02','{"conserver":true}','42');`);
    const sql=fs.readFileSync(path.join(root,'clean_sql/02_loup_solitaire_02_fidele_350.sql'),'utf8');
    for(let pass=0;pass<2;pass++) {
      await db.exec(sql);
      const {rows}=await db.query(`SELECT numero,texte,suite,choix,combat,evenement,effets,fin FROM lw_sections WHERE livre_slug='loup-solitaire-02'`);
      assert.equal(rows.length,all.length);
      for(const row of rows) {
        const sec=sections[row.numero];assert.ok(sec);
        for(const key of ['texte','suite','choix','combat','evenement','effets','fin'])assert.deepEqual(row[key],JSON.parse(JSON.stringify(sec[key]??null)),`${row.numero}/${key}`);
      }
      if(!pass)await db.exec(`INSERT INTO lw_sections(livre_slug,numero,texte) VALUES ('loup-solitaire-02','fantome','obsolete');`);
    }
    assert.equal((await db.query(`SELECT texte FROM lw_sections WHERE livre_slug='autre-livre'`)).rows[0].texte,'Témoin');
    assert.deepEqual((await db.query('SELECT etat FROM lw_sauvegardes')).rows[0].etat,{conserver:true});
    const broken=sql.replace('-- Assertions exécutables',`DELETE FROM lw_sections WHERE livre_slug='loup-solitaire-02' AND numero='350';\n-- Assertions exécutables`);
    await assert.rejects(db.exec(broken),/LS02/);await db.exec('ROLLBACK;');
    assert.equal((await db.query(`SELECT count(*)::int AS n FROM lw_sections WHERE livre_slug='loup-solitaire-02'`)).rows[0].n,all.length);
  } finally {await db.close();}
});

test('Aucun choix bloqué sans issue : 1 024 ensembles de disciplines × 4 profils d’inventaire × 4 bourses',()=>{
  const disciplines=R.DISCIPLINES.map(d=>d.id);
  for(let bits=0;bits<(1<<disciplines.length);bits++)for(let profile=0;profile<4;profile++)for(const or of [0,1,19,50]) {
    const st=state({couronnes:or,disciplines:disciplines.filter((_,i)=>bits&(1<<i)),objetsSpeciaux:profile&1?['sac-a-dos','billet-port-bax','sceau-hammardal','cristal-etoile','lance-magique','laissez-passer-rouge']:[],sac:profile&2?['herbe-laumspur']:[],drapeaux:profile&2?{crepuscule:true}:{}});
    for(const s of all) {
      if(s.fin||s.combat||s.suite)continue;
      if(s.evenement?.branches&&E.requiert(st,s.evenement.requis))continue;
      assert.ok(s.choix?.some(c=>E.requiert(st,c.requis)),`§${s.id}, disciplines ${bits}, profil ${profile}, or ${or}`);
    }
  }
});

test('Toute référence d’objet existe ; perte du sac, récupération et capacités respectées',()=>{
  function visit(x){
    if(!x||typeof x!=='object')return;
    if(x.objets)for(const g of x.objets)assert.ok(R.getItem(g.id),g.id);
    if(x.retirerObjets)for(const id of x.retirerObjets)assert.ok(R.getItem(id),id);
    if(x.offres)for(const o of x.offres)if(o.id)assert.ok(R.getItem(o.id),o.id);
    if(x.prix)for(const id of Object.keys(x.prix))assert.ok(R.getItem(id),id);
    for(const v of Object.values(x))visit(v);
  }
  all.forEach(visit);
  let st=E.appliquerEffets(state(),sections[194].effets).state;
  assert.equal(E.ajouterObjet(st,{id:'repas'}).ajoute,false);
  assert.equal(E.ajouterObjet(st,{id:'sac-a-dos'}).ajoute,true);
  assert.equal(E.ajouterObjet(st,{id:'repas'}).ajoute,true);
});

// Oracles transcrits du PDF, PAS dérivés des overrides. Un gain ajouté par erreur
// doit échouer même si le SQL, le TypeScript et le générateur sont d'accord.
test('Oracle PDF : toutes les pertes/guérisons fixes, bourses et repas imposés',()=>{
  const field = key => Object.fromEntries(all.filter(s=>s.effets?.[key] !== undefined).map(s=>[s.id,s.effets[key]]));
  assert.deepEqual(field('endurance'),{17:-5,27:2,29:-2,31:6,72:1,78:-1,106:-2,108:-2,141:-2,145:-5,154:-2,189:-2,198:-1,219:-3,258:-1,313:-4,330:-5,338:-2,347:-1});
  assert.deepEqual(field('or'),{58:-10,86:3,165:40,231:5,238:-1,305:5,329:10});
  assert.deepEqual(field('perdreArme'),{144:'bourse',194:'tout',337:'toutes'});
  assert.deepEqual(field('retirerObjets'),{78:['cotte-mailles'],141:['cotte-mailles'],165:['sceau-hammardal'],196:['sceau-hammardal']});
  assert.deepEqual(field('restaurerEndurance'),{40:true});
  assert.deepEqual(field('enduranceSiSansArme'),{298:4});
  assert.deepEqual(field('enduranceSiSansDiscipline'),{69:{discipline:'bouclier-psychique',perte:2}});
  assert.deepEqual(field('repasObligatoire'),{32:true,37:true,127:true,148:true,150:true,284:true,321:true,346:true});
  assert.deepEqual(field('repasChassePossible'),{37:false,148:false,321:false,346:false});
  assert.deepEqual(field('repasPenalite'),{321:2});assert.deepEqual(field('repasCout'),{346:1});
  const costs={};
  for(const s of all) for(const c of s.choix||[]) if(c.effets?.or!==undefined) costs[`${s.id}>${c.vers}`]=c.effets.or;
  assert.deepEqual(costs,{'72>56':-2,'75>142':-10,'117>37':-3,'117>148':-1,'136>10':-20,'168>314':-1,'195>249':-1,'217>199':-1,'226>56':-2,'233>37':-3,'233>148':-1,'339>249':-1,'342>72':-1,'342>56':-2,'346>280':-1});
  // §314 / §346 : reconnaître le poison avec la Chasse n'offre pas un repas.
  for(const vers of ['178','290']) for(const food of [false,true]) {
    const st=state({sac:food?['repas']:[],disciplines:['chasse']});
    const next=E.appliquerEffets(st,sections[314].choix.find(c=>c.vers===vers).effets).state;
    assert.equal(next.enduranceActuelle,food?25:22);assert.equal(next.sac.length,0);
  }
});

test('Oracle PDF : catalogue complet des 23 interactions, articles, quantités et tarifs',()=>{
  const expectedLoot={
    15:{glaive:1,masse:1,baton:1,'potion-guerison-3':1,repas:3,'sac-a-dos':1,or:12},
    21:{poignard:1},76:{poignard:1,or:2},91:{baton:1,couverture:1,repas:2,'sac-a-dos':1,poignard:1,corde:1},
    124:{or:42,sabre:1,poignard:1},132:{lance:1},187:{lance:2,epee:2,or:6},220:{or:23},235:{sabre:1},260:{epee:1},
    262:{epee:1,masse:1,baton:1,repas:1,or:6,'liquide-orange':1},274:{epee:1,or:6,masse:1},301:{or:3,poignard:3,sabre:1},
    302:{masse:1,glaive:1,baton:1,'potion-guerison-3':1,repas:3,'sac-a-dos':1,or:12},331:{epee:1,poignard:1,or:3}};
  const expectedShops={55:{glaive:12},181:{epee:4,poignard:2,sabre:3,'marteau-de-guerre':6,lance:5,masse:4,couverture:3,'sac-a-dos':1},
    266:{epee:4,poignard:2,glaive:7,sabre:3,'marteau-de-guerre':6,lance:5,masse:4,hache:3,baton:3},
    283:{epee:4,poignard:2,glaive:6,lance:5,repas:2,'anneau-or':8,couverture:3,'sac-a-dos':1},327:{'documents-port-bax':6}};
  const loot={},shops={},other={};
  for(const s of all) {
    const i=s.evenement?.interaction;if(!i)continue;
    if(i.type==='butin')loot[s.id]=i.offres.reduce((a,o)=>{const k=o.id||'or';a[k]=(a[k]||0)+(o.id?(o.quantity||1):o.or);return a;},{});
    else if(i.type==='boutique')shops[s.id]=i.prix;
    else other[s.id]=i.type;
  }
  assert.deepEqual(loot,expectedLoot);assert.deepEqual(shops,expectedShops);
  assert.deepEqual(other,{93:'don',238:'roulette',308:'hublots'});
  assert.deepEqual(all.filter(s=>s.evenement?.interaction?.revente).map(s=>s.id),['266']);
  assert.deepEqual(all.filter(s=>s.evenement?.interaction?.achatUnique).map(s=>s.id),['55','327']);
  assert.deepEqual(Object.fromEntries(all.filter(s=>s.evenement?.interaction?.maximum).map(s=>[s.id,s.evenement.interaction.maximum])),{15:1,91:2});
});

test('Butin fractionnable, limites des offres et abandon hors combat sans duplication',()=>{
  const H=require('../lib/lonewolf/item-help.ts');
  for(const n of [15,91,302]) for(let places=0;places<=8;places++) {
    const sec=sections[n],index=sec.evenement.interaction.offres.findIndex(o=>o.id==='repas');
    const total=sec.evenement.interaction.offres[index].quantity;
    for(let q=1;q<=total;q++) {
      const st=state({paragraphe:String(n),sac:Array(8-places).fill('repas')});const before=structuredClone(st);
      if(q>places)assert.throws(()=>I.appliquerInteraction(st,sec,{type:'prendre',index,quantite:q}));
      else {
        const next=I.appliquerInteraction(st,sec,{type:'prendre',index,quantite:q});
        assert.equal(next.sac.length,8-places+q);assert.equal(I.quantiteButinRestante(next,sec,index),total-q);
        assert.equal(next.drapeaux[`ls02:${n}:prises`],1);
      }
      assert.deepEqual(st,before,'l’état source doit rester inchangé');
    }
  }
  let st=state({paragraphe:'15',sac:Array(7).fill('repas')});
  st=I.appliquerInteraction(st,sections[15],{type:'prendre',index:4,quantite:1});
  for(let i=0;i<2;i++)st=H.discardItem(st,'repas','lecture').state;
  st=I.appliquerInteraction(st,sections[15],{type:'prendre',index:4,quantite:2});
  assert.equal(st.sac.length,8);assert.equal(st.drapeaux['ls02:15:prises'],1);
  assert.throws(()=>I.appliquerInteraction(st,sections[15],{type:'prendre',index:0}),'un seul cadeau');
  assert.throws(()=>I.appliquerInteraction(st,sections[15],{type:'prendre',index:4}),'pas de réapparition du lot');
  for(const quantite of [0,-1,1.5,NaN,Infinity,4])assert.throws(()=>I.appliquerInteraction(state({paragraphe:'15'}),sections[15],{type:'prendre',index:4,quantite}));
  assert.equal(H.discardItem(st,'repas','combat').discarded,false);
  assert.equal(H.discardItem({...st,termine:true},'repas','lecture').discarded,false);
  const armed=state({mains:['epee','lance'],armeEnMain:'epee'}),drop=H.discardItem(armed,'epee','preparation');
  assert.equal(drop.discarded,true);assert.equal(drop.state.armeEnMain,'lance');assert.equal(armed.mains.length,2);
});

test('§276 : Guérison ne profite pas du découpage du défi ; défaite restaurée',()=>{
  for(let hp=1;hp<=25;hp++)for(const psychique of [false,true]) {
    const st=state({enduranceActuelle:hp,disciplines:['guerison',...(psychique?['puissance-psychique']:[])]});
    const arrivee=E.chargerParagraphe(st,book,'276').state;
    assert.equal(arrivee.enduranceActuelle,psychique?Math.min(25,hp+1):hp);
    if(psychique)continue;
    const challenge=E.chargerParagraphe(arrivee,book,'276-combat').state;assert.equal(challenge.enduranceActuelle,hp);
    const defaite=E.defaiteNonMortelle({...challenge,enduranceActuelle:0},sections['276-combat']);
    assert.equal(defaite.state.enduranceActuelle,hp);assert.equal(defaite.vers,'192');assert.equal(defaite.state.couronnes,st.couronnes);
  }
});

test('Potions LS02 après victoire : 3/4/5 points, une dose ; Laumspur alimentaire distinct',()=>{
  const H=require('../lib/lonewolf/item-help.ts');
  for(const [id,gain] of Object.entries({'potion-guerison-3':3,'potion-guerison':4,'laumspur-5':5}))for(let hp=1;hp<=25;hp++) {
    const st=state({enduranceActuelle:hp,sac:[id]});assert.equal(H.isHealingPotion(id),true);
    for(const phase of ['lecture','preparation','combat'])assert.equal(H.consumeHealingPotion(st,id,phase).used,false);
    const result=H.consumeHealingPotion(st,id,'apres-combat');
    assert.equal(result.state.enduranceActuelle,Math.min(25,hp+gain));assert.equal(result.used,hp<25);
    if(result.used)assert.equal(H.consumeHealingPotion(result.state,id,'apres-combat').used,false);
  }
  for(const id of ['herbe-laumspur','liquide-orange','repas'])assert.equal(H.isHealingPotion(id),false);
});

test('Tous les jets : transition atomique, rechargement sans relance ni blocage',()=>{
  for(const sec of all.filter(s=>s.evenement?.branches))for(let die=0;die<10;die++) {
    const start=E.chargerParagraphe(state(),book,sec.id).state;
    const result=E.resoudreJetParagraphe(start,book,die),saved=JSON.parse(JSON.stringify(result.state));
    const expected=E.resoudreEvenement(start,sec.evenement,die);
    assert.equal(saved.paragraphe,expected.vers||sec.id);
    if(saved.paragraphe===sec.id) {
      assert.throws(()=>E.resoudreJetParagraphe(saved,book,die),'les gains de §21/116 ne se retirent pas deux fois');
      assert.ok(sec.suite || sec.choix?.length,'issue après le jet');
    } else assert.equal(saved.historique.at(-1),expected.vers,'arrivée persistée avant toute animation');
    assert.ok(!start.drapeaux[`jet-resolu:${sec.id}`]);
  }
  const result=E.resoudreJetParagraphe(state({paragraphe:'21',couronnes:0}),book,0);
  assert.equal(result.state.couronnes,29);
  assert.equal(E.possede(I.appliquerInteraction(result.state,sections[21],{type:'prendre',index:0}),'poignard'),true);
});


test('5 040 parties légales reproductibles, tous les 252 ensembles de cinq disciplines',t=>{
  const result=require('./ls02-simulate.cjs').simuler();
  assert.equal(result.profils,252);assert.equal(result.parties,5040);
  assert.equal(result.victoires+result.morts+result.limiteAtteinte,result.parties);
  assert.ok(result.victoires>0,'la stratégie échantillonnée doit atteindre la victoire');
  assert.ok(result.paragraphesVus>=330,'ne pas réduire silencieusement la couverture');
  // Les boucles existent dans le PDF. Elles sont bornées et publiées, pas des
  // victoires ni la preuve d'un défaut. Les tests locaux vérifient leurs sorties.
  t.diagnostic(JSON.stringify(result));
});


test('Toutes les fuites imprimées : avant/après engagement, minimum d’assauts, T et journal',()=>{
  const st=state({mains:['epee'],armeEnMain:'epee'});
  for(const sec of all.filter(s=>s.combat?.fuite?.length))for(const f of sec.combat.fuite) {
    const min=sec.combat.fuiteApresAssauts||0;
    for(let tour=0;tour<min;tour++)assert.throws(()=>E.fuirCombat(st,sec,tour,0,f.vers));
    for(let tour=min;tour<=min+2;tour++)for(let die=0;die<10;die++) {
      const res=E.fuirCombat(st,sec,tour,die,f.vers);
      assert.equal(res.vers,f.vers);
      if(tour===0)assert.equal(res.state.enduranceActuelle,st.enduranceActuelle);
      else {
        const round=E.resoudreAssaut(st,sec.combat,sec.combat.endurance,die,tour+1,true);
        assert.equal(round.enduranceEnnemi,sec.combat.endurance,'aucun dégât ennemi en fuite');
        assert.equal(round.log.degatsEnnemi,0);
        assert.notEqual(round.log.critique,'ennemi-tue');
        assert.equal(res.state.enduranceActuelle,round.state.enduranceActuelle);
      }
    }
    assert.throws(()=>E.fuirCombat(st,sec,min,0,'350'),'destination non imprimée');
  }
  const fatal=E.resoudreAssaut(state({habileteBase:10,enduranceActuelle:17}),sections[7].combat,30,1,2);
  assert.equal(fatal.state.enduranceActuelle,0);assert.equal(fatal.log.degatsJoueur,17);
  assert.equal(fatal.log.critique,'joueur-tue');
});
