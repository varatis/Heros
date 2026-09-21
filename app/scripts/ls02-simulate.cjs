// Exploration bornée et reproductible de parties légales, PAS une preuve de tous
// les parcours. Pas de téléportation, d'Endurance infinie ni d'inventaire injecté.
require('./load-lonewolf.cjs');
const assert = require('node:assert/strict');
const {LS02: book} = require('../content/lonewolf/ls02/index.ts');
const E = require('../lib/lonewolf/engine.ts');
const R = require('../lib/lonewolf/rules.ts');
const I = require('../lib/lonewolf/ls02-interactions.ts');
const H = require('../lib/lonewolf/item-help.ts');
const {prng} = require('../lib/lonewolf/table-hasard.ts');

function groupes(items, size, start=0, acc=[], out=[]) {
  if (!size) out.push(acc);
  else for(let i=start;i<=items.length-size;i++) groupes(items,size-1,i+1,[...acc,items[i]],out);
  return out;
}
function simuler(repetitions=20) {
  const profils=groupes(R.DISCIPLINES.map(d=>d.id),5);
  const vus=new Set(),liens=new Set(),bornes=[];
  const stats={parties:0,profils:profils.length,victoires:0,morts:0,limiteAtteinte:0};
  for(const disciplines of profils) for(let rep=0;rep<repetitions;rep++) {
    const seed=++stats.parties,rnd=prng(seed),die=()=>Math.floor(rnd()*10);
    const pick=arr=>arr[Math.floor(rnd()*arr.length)];
    const first=die(),second=(first+1+Math.floor(rnd()*9))%10;
    let state=E.creerAventure({book,habileteBase:10+die(),enduranceBase:20+die(),disciplines,
      armeMaitrisee:R.ARME_PAR_TIRAGE[String(die())],tirageDepart:String(first),tirageDepart2:String(second),orDepart:10+die()});
    state=E.chargerParagraphe(state,book,'1').state;
    function aller(vers) {
      liens.add(`${state.paragraphe}>${vers}`);
      state=E.chargerParagraphe(state,book,vers).state;
    }
    let ended=false;
    for(let step=0;step<400;step++) {
      const s=book.sections[state.paragraphe];vus.add(s.id);
      assert.ok(state.couronnes>=0&&state.couronnes<=50,`bourse, graine ${seed}`);
      assert.ok(state.mains.length<=2&&state.sac.length<=8,`capacité, graine ${seed}`);
      assert.ok(state.enduranceActuelle>=0&&state.enduranceActuelle<=E.enduranceMax(state));
      if(state.termine || state.enduranceActuelle<=0) {
        if(s.fin==='victoire')stats.victoires++;else stats.morts++;
        ended=true;break;
      }
      if(s.combat) {
        let ep=s.combat.endurance,tour=0,sortie=false;
        while(ep>0 && tour<100) {
          if(s.combat.fuite?.length && tour>=(s.combat.fuiteApresAssauts||0) && rnd()<0.15) {
            const f=E.fuirCombat(state,s,tour,die(),pick(s.combat.fuite).vers);state=f.state;
            if(!f.mort)aller(f.vers);
            sortie=true;break;
          }
          const r=E.resoudreAssaut(state,s.combat,ep,die(),++tour);state=r.state;ep=r.enduranceEnnemi;
          if(r.termine==='mort') {
            const defaite=E.defaiteNonMortelle(state,s);
            if(defaite){state=defaite.state;aller(defaite.vers);}
            sortie=true;break;
          }
        }
        assert.ok(tour<100,`combat borné, graine ${seed}, §${s.id}`);
        if(sortie)continue;
        // Le même helper que l'interface : aucune potion en plein combat.
        for(const id of [...state.sac])if(H.isHealingPotion(id))state=H.consumeHealingPotion(state,id,'apres-combat').state;
        assert.ok(s.suite);aller(s.suite);continue;
      }
      if(s.evenement?.branches && E.requiert(state,s.evenement.requis) && !state.drapeaux[`jet-resolu:${s.id}`]) {
        const r=E.resoudreJetParagraphe(state,book,die());
        if(r.state.paragraphe!==s.id)liens.add(`${s.id}>${r.state.paragraphe}`);
        state=r.state;
        if(r.mort || state.paragraphe!==s.id)continue;
      }
      const inter=s.evenement?.interaction;
      if(inter?.type==='butin') for(let index=0;index<inter.offres.length;index++) {
        if(rnd()<0.3)continue;
        try {state=I.appliquerInteraction(state,s,{type:'prendre',index,quantite:1});}catch(e){
          assert.match(e.message,/Inventaire plein|Offre épuisée/);
        }
      }
      if(inter?.type==='boutique') for(const id of Object.keys(inter.prix)) {
        const slot=R.getItem(id).slot;
        const need=slot==='arme'?state.mains.length===0:id==='sac-a-dos'?!E.possede(state,id):id==='repas'?E.nombreRepas(state)<2:rnd()<0.25;
        if(need)try {state=I.appliquerInteraction(state,s,{type:'acheter',id});}catch(e){assert.match(e.message,/Achat impossible|Inventaire plein/);}
      }
      if(inter?.type==='roulette'||inter?.type==='hublots')for(let i=0;i<12&&rnd()<0.85;i++) {
        try {state=I.appliquerInteraction(state,s,inter.type==='roulette'
          ?{type:'roulette',numero:die(),mise:1,tirage:die()}
          :{type:'hublots',tirages:Array.from({length:6},die)});
        }catch(e){assert.match(e.message,/Mise impossible/);break;}
      }
      if(inter?.type==='don')state=I.appliquerInteraction(state,s,{type:'donner',montant:Math.floor(rnd()*(state.couronnes+1))});
      if(s.suite){aller(s.suite);continue;}
      const choix=(s.choix||[]).filter(c=>E.requiert(state,c.requis));
      assert.ok(choix.length,`aucune issue, graine ${seed}, §${s.id}`);
      const c=pick(choix),r=E.appliquerEffets(state,c.effets);state=r.state;
      if(!r.mort)aller(c.vers);
    }
    if(!ended){stats.limiteAtteinte++;bornes.push({graine:seed,paragraphe:state.paragraphe,or:state.couronnes});}
  }
  return {...stats,bornes,paragraphesVus:vus.size,transitionsVues:liens.size,
    nonVisites:Object.keys(book.sections).filter(id=>!vus.has(id))};
}
module.exports={simuler};
if(require.main===module)console.log(JSON.stringify(simuler(),null,2));
