import { create } from 'zustand';

interface SortStore {
  sortBy: string;
  setSortBy: (sortBy: string) => void;

  tlkSortBy: string;
  setTlkSortBy: (sortBy: string) => void;
}

export const useSortStore = create<SortStore>((set) => ({
  sortBy: 'league', // league/time
  setSortBy: (sortBy: string) => set(() => ({ sortBy })),

  tlkSortBy: 'league', // league/time
  setTlkSortBy: (tlkSortBy: string) => set(() => ({ tlkSortBy })),
}));
