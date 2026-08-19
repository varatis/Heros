import { create } from "zustand";

/**
 * Wallet côté client — simple miroir d'affichage.
 *
 * ⚠️ Depuis la migration 004 (sécurisation de la monétisation), les
 * soldes ne sont PLUS modifiables côté client : RLS bloque l'écriture
 * directe des tables wallets/transactions. Toutes les mutations passent
 * par les Edge Functions (make-choice, validate-purchase, ...) ou les
 * RPC SECURITY DEFINER, qui renvoient le solde à jour — c'est ce solde
 * serveur qu'on pousse ici via setWallet().
 */
interface WalletState {
  gems: number;
  coins: number;
  isInitialized: boolean;
  setWallet: (gems: number, coins?: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  gems: 0,
  coins: 0,
  isInitialized: false,

  setWallet: (gems: number, coins: number = 0) =>
    set({ gems, coins, isInitialized: true }),
}));
