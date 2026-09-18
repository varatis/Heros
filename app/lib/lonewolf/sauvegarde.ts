import type { AdventureState, CombatState } from "./types";
import { VERSION_SAUVEGARDE } from "./engine";

/**
 * Sauvegarde de la partie.
 *
 * Le jeu doit pouvoir tourner immédiatement (aperçu, mode hors-ligne, application
 * mobile Capacitor) sans dépendre d'un serveur : la sauvegarde vit donc dans le
 * navigateur. La rencontre en cours est enregistrée avec la feuille du héros.
 * Il n’y a pas de synchronisation Supabase ni d’isolation par compte ici.
 */

const CLE = "heros:lonewolf:sauvegarde";
const CLE_FINS = "heros:lonewolf:fins";

export interface EncounterSave {
  paragraphe: string;
  enemyName: string;
  engaged: boolean;
  combat: Pick<
    CombatState,
    "enduranceEnnemi" | "journal" | "termine" | "bonusTemp"
  >;
}

export interface Sauvegarde {
  version: number;
  date: number;
  state: AdventureState;
  encounter?: EncounterSave;
}

export function sauvegarder(
  state: AdventureState,
  encounter?: EncounterSave,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Sauvegarde = {
      version: VERSION_SAUVEGARDE,
      date: Date.now(),
      state,
      encounter,
    };
    window.localStorage.setItem(CLE, JSON.stringify(payload));
    // Historique des fins atteintes (toutes parties confondues).
    const fins = new Set<string>(chargerFins());
    for (const f of state.fins) fins.add(f);
    window.localStorage.setItem(CLE_FINS, JSON.stringify([...fins]));
  } catch {
    /* quota dépassé : on ignore */
  }
}

export function charger(): Sauvegarde | null {
  if (typeof window === "undefined") return null;
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const payload = JSON.parse(brut) as Sauvegarde;
    if (payload.version !== VERSION_SAUVEGARDE) return null;
    return payload;
  } catch {
    return null;
  }
}

export function effacer(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLE);
}

export function chargerFins(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_FINS);
    return brut ? (JSON.parse(brut) as string[]) : [];
  } catch {
    return [];
  }
}

/** Nombre de paragraphes visités sur l'ensemble des parties. */
export function chargerVisites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem("heros:lonewolf:visites");
    return brut ? (JSON.parse(brut) as string[]) : [];
  } catch {
    return [];
  }
}

export function enregistrerVisites(visites: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const connues = new Set<string>(chargerVisites());
    for (const v of visites) connues.add(v);
    window.localStorage.setItem(
      "heros:lonewolf:visites",
      JSON.stringify([...connues]),
    );
  } catch {
    /* ignore */
  }
}
