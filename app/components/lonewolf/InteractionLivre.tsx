"use client";
import { useState } from 'react';
import type { AdventureState, StorySection } from '../../lib/lonewolf/types';
import { appliquerInteraction, quantiteButinRestante, type InteractionAction } from '../../lib/lonewolf/ls02-interactions';
import { getItem } from '../../lib/lonewolf/rules';
import { tirerNombre } from '../../lib/lonewolf/table-hasard';

export default function InteractionLivre({ state, section, onChange }: {
  state: AdventureState; section: StorySection; onChange: (state: AdventureState) => void;
}) {
  const [montant, setMontant] = useState(1);
  const [numero, setNumero] = useState(0);
  const [message, setMessage] = useState('');
  const inter = section.evenement?.interaction;
  if (!inter) return null;
  function agir(action: InteractionAction) {
    try {
      const next = appliquerInteraction(state, section, action);
      const delta = next.couronnes-state.couronnes;
      onChange(next);
      const tirages = action.type === 'hublots' ? `Tirages : ${action.tirages.join(', ')}. `
        : action.type === 'roulette' ? `Numéro sorti : ${action.tirage}. ` : '';
      setMessage(`${tirages}Action effectuée. Or : ${delta >= 0 ? '+' : ''}${delta}.`);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Action impossible'); }
  }
  const key = `ls02:${section.id}:`;
  return <section className="glass-card rounded-2xl p-5 space-y-3" aria-label="Actions du paragraphe">
    <h3 className="font-bold">Équipement et actions du paragraphe</h3>
    {inter.type === 'butin' && <>
      <p>Choisissez ce que vous emportez{inter.maximum ? ` (au plus ${inter.maximum} offres)` : ''}. Les limites de votre inventaire s’appliquent.</p>
      {inter.offres?.map((o,i) => {
        const restant = quantiteButinRestante(state, section, i);
        const bloque = !restant || (!state.drapeaux[key+i] && inter.maximum !== undefined && Number(state.drapeaux[key+'prises'] || 0) >= inter.maximum);
        return <div key={i} className="flex flex-wrap gap-2 items-center">
          <span>{o.id ? getItem(o.id)?.nom ?? o.id : `${o.or} Pièces d’Or`} · {restant ? `${restant} disponible(s)` : 'Épuisé'}</span>
          {Array.from({length:restant || 1},(_,j)=>j+1).map(quantite => <button key={quantite} className="btn btn-secondary"
            disabled={bloque} onClick={()=>agir({type:'prendre',index:i,quantite})}>
            {o.id ? `Prendre ${quantite}` : 'Prendre l’or'}
          </button>)}
        </div>;
      })}
    </>}
    {inter.type === 'boutique' && Object.entries(inter.prix ?? {}).map(([id,prix])=><div key={id} className="flex flex-wrap gap-2 items-center">
      <span>{getItem(id)?.nom ?? id}</span>
      <button className="btn btn-secondary" disabled={state.couronnes < prix || (inter.achatUnique && !!state.drapeaux[key+'prises'])} onClick={()=>agir({type:'acheter',id})}>Acheter : {prix} PO</button>
      {inter.revente && <button className="btn btn-secondary" disabled={!state.mains.includes(id)} onClick={()=>agir({type:'vendre',id})}>Vendre : {prix-1} PO</button>}
    </div>)}
    {(inter.type === 'don' || inter.type === 'roulette') && <label className="block">{inter.type === 'don' ? 'Don' : 'Mise'} en Couronnes
      <input className="ml-2 w-20 text-black bg-white rounded p-1" type="number" min={inter.type==='don'?0:1} max={state.couronnes} value={montant} onChange={e=>setMontant(Number(e.target.value))}/>
    </label>}
    {inter.type === 'don' && <button className="btn btn-secondary" onClick={()=>agir({type:'donner',montant})}>Donner</button>}
    {inter.type === 'roulette' && <>
      <label>Numéro choisi <select className="text-black bg-white ml-2 p-1 rounded" value={numero} onChange={e=>setNumero(Number(e.target.value))}>{Array.from({length:10},(_,i)=><option key={i}>{i}</option>)}</select></label>
      <p className="text-xs">Convention de cette adaptation : 0 et 9 voisins ; gains nets ×8 / ×5, plafonnés à 40 PO de bénéfice. Ces détails ne sont pas explicités par le PDF.</p>
      <button className="btn btn-primary" onClick={()=>agir({type:'roulette',numero,mise:montant,tirage:tirerNombre()})}>Miser et tirer</button>
    </>}
    {inter.type === 'hublots' && <button className="btn btn-primary" disabled={state.couronnes<3} onClick={()=>agir({type:'hublots',tirages:Array.from({length:6},()=>tirerNombre())})}>Miser 3 PO et lancer les six tirages</button>}
    {(inter.type === 'hublots' || inter.type === 'roulette') && <p>Bénéfice net : {Number(state.drapeaux[key+'gains'] || 0)} / 40 PO. Vous pouvez quitter la table avec les choix du paragraphe.</p>}
    <p role="status" aria-live="polite">{message}</p>
  </section>;
}
