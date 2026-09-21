/** Actions locales du PDF. Les opérations refusées sont atomiques (aucun débit,
 * aucune acquisition partielle). Pas de paragraphe/Guérison supplémentaire. */
import type { AdventureState, StorySection } from './types';
import { ajouterObjet, retirerObjet, possede } from './engine';
import { LIMITE_COURONNES } from './rules';

export type InteractionAction =
  | { type: 'prendre'; index: number; quantite?: number }
  | { type: 'acheter' | 'vendre'; id: string }
  | { type: 'donner'; montant: number }
  | { type: 'roulette'; numero: number; mise: number; tirage: number }
  | { type: 'hublots'; tirages: number[] };
export function resultatHublots(ds: number[]): number {
  if (ds.length !== 6 || ds.some(d => !Number.isInteger(d) || d < 0 || d > 9)) throw Error('Six tirages 0–9 requis');
  const score = (i: number) => ds[i] === 0 && ds[i+1] === 0 ? 100 : ds[i]+ds[i+1];
  const a = score(0), b = score(2), joueur = score(4);
  if (a === b || a === joueur || b === joueur) return 0;
  return joueur > a && joueur > b ? 6 : -3;
}
export function resultatRoulette(numero: number, mise: number, tirage: number): number {
  if (![numero, tirage].every(n => Number.isInteger(n) && n >= 0 && n <= 9) || !Number.isInteger(mise) || mise < 1)
    throw Error('Numéro/tirage 0–9 et mise entière positive requis');
  const distance = (tirage-numero+10)%10;
  return distance === 0 ? mise*8 : distance === 1 || distance === 9 ? mise*5 : -mise;
}
/** Stock restant d'une offre. Les anciens marqueurs booléens signifient « tout pris ». */
export function quantiteButinRestante(etat: AdventureState, section: StorySection, index: number): number {
  const offre = section.evenement?.interaction?.offres?.[index];
  if (!offre) return 0;
  const total = offre.quantity ?? 1;
  const pris = etat.drapeaux[`ls02:${section.id}:${index}`];
  return Math.max(0, total - (pris === true ? total : Number(pris || 0)));
}
export function appliquerInteraction(etat: AdventureState, section: StorySection, action: InteractionAction): AdventureState {
  if (etat.termine || etat.enduranceActuelle <= 0 || etat.paragraphe !== section.id) throw Error('Action hors de la scène active');
  const inter = section.evenement?.interaction;
  if (!inter) throw Error('Pas d’interaction');
  const state = structuredClone(etat);
  const prefix = `ls02:${section.id}:`;
  const count = Number(state.drapeaux[prefix+'prises'] || 0);
  if (action.type === 'prendre' && inter.type === 'butin') {
    const offre = inter.offres?.[action.index];
    const restant = quantiteButinRestante(state, section, action.index);
    const dejaChoisie = !!state.drapeaux[prefix+action.index];
    if (!offre || !restant || (!dejaChoisie && inter.maximum !== undefined && count >= inter.maximum)) throw Error('Offre épuisée');
    const quantite = action.quantite ?? restant;
    if (!Number.isInteger(quantite) || quantite < 1 || quantite > restant) throw Error('Quantité impossible');
    if (offre.id && !ajouterObjet(state, {id:offre.id, quantity:quantite}).ajoute) throw Error('Inventaire plein');
    if (offre.or) state.couronnes = Math.min(LIMITE_COURONNES, state.couronnes+offre.or);
    state.drapeaux[prefix+action.index] = (offre.quantity ?? 1) - restant + quantite;
    // Un lot partiellement emporté reste une seule offre (§15 et §91).
    state.drapeaux[prefix+'prises'] = count + (dejaChoisie ? 0 : 1);
  } else if ((action.type === 'acheter' || action.type === 'vendre') && inter.type === 'boutique') {
    const prix = inter.prix?.[action.id];
    if (prix === undefined) throw Error('Article absent du tarif');
    if (action.type === 'acheter') {
      if (state.couronnes < prix || (inter.achatUnique && count > 0)) throw Error('Achat impossible');
      if (!ajouterObjet(state, {id:action.id}).ajoute) throw Error('Inventaire plein');
      state.couronnes -= prix;
      state.drapeaux[prefix+'prises'] = count+1;
    } else {
      if (!inter.revente || !possede(state, action.id)) throw Error('Revente impossible');
      retirerObjet(state, action.id);
      state.couronnes = Math.min(LIMITE_COURONNES,state.couronnes+prix-1);
    }
  } else if (action.type === 'donner' && inter.type === 'don') {
    if (!Number.isInteger(action.montant) || action.montant < 0 || action.montant > state.couronnes) throw Error('Don impossible');
    state.couronnes -= action.montant;
  } else if ((action.type === 'roulette' && inter.type === 'roulette') || (action.type === 'hublots' && inter.type === 'hublots')) {
    const mise = action.type === 'roulette' ? action.mise : 3;
    const gains = Number(state.drapeaux[prefix+'gains'] || 0);
    const maximum = inter.gainMaximum ?? 40;
    if (state.couronnes < mise || gains >= maximum) throw Error('Mise impossible ou plafond atteint');
    let delta = action.type === 'roulette' ? resultatRoulette(action.numero, mise, action.tirage) : resultatHublots(action.tirages);
    delta = Math.min(delta, maximum-gains);
    state.drapeaux[prefix+'gains'] = gains+delta;
    state.couronnes = Math.min(LIMITE_COURONNES, state.couronnes+delta);
  } else throw Error('Action incompatible');
  return state;
}
