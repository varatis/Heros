import { create } from "zustand";

interface WalletState {
  gems: number;
  coins: number;
  isInitialized: boolean;
  setWallet: (gems: number, coins?: number) => void;
  addGems: (amount: number) => void;
  deductGems: (amount: number) => boolean;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  gems: 0,
  coins: 0,
  isInitialized: false,

  setWallet: (gems: number, coins: number = 0) =>
    set({ gems, coins, isInitialized: true }),

  addGems: (amount: number) =>
    set((state) => ({ gems: state.gems + amount })),

  deductGems: (amount: number) => {
    const current = get().gems;
    if (current < amount) return false;
    set({ gems: current - amount });
    return true;
  },
}));
