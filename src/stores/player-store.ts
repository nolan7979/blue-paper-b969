import { create } from 'zustand';

interface PlayerStore {
  isShowing1: boolean;
  isShowing2: boolean;
  isShowing3: boolean;
  couple1: any;
  couple2: any;
  couple3: any;
  coupleQueue: any[];

  setIsShowing1: (isShowing: boolean) => void;
  setIsShowing2: (isShowing2: boolean) => void;
  setIsShowing3: (isShowing3: boolean) => void;
  setCuple1: (couple1: any) => void;
  setCuple2: (couple2: any) => void;
  setCuple3: (couple3: any) => void;

  setCoupleQueue: (coupleQueue: any[]) => void;
  enCoupleQueue: (couple: any) => void;
  deCoupleQueue: () => void;
  popCoupleQueue: () => void;
  removeQueueAt: (index: number) => void;

  // match
  selectedMatch: string | null;
  showSelectedMatch: boolean;
  setSelectedMatch: (selectedMatch: string) => void;
  setShowSelectedMatch: (showSelectedMatch: boolean) => void;

  // stats
  statsTournament: any;
  statsSeason: any;
  statsSeasonType: any;
  setStatsTournament: (statsTournament: any) => void;
  setStatsSeason: (statsSeason: any) => void;
  setStatsSeasonType: (statsSeasonType: any) => void;

  // overview
  selectedPlayer: any;
  isComparing: boolean;
  setSelectedPlayer: (selectedPlayer: any) => void;
  setIsComparing: (isComparing: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isShowing1: false,
  isShowing2: false,
  isShowing3: false,
  couple1: { matchData: {}, player: {}, isHome: true },
  couple2: { matchData: {}, player: {}, isHome: true },
  couple3: { matchData: {}, player: {}, isHome: true },
  coupleQueue: [],

  setIsShowing1: (isShowing1: boolean) => set(() => ({ isShowing1 })),
  setIsShowing2: (isShowing2: boolean) => set(() => ({ isShowing2 })),
  setIsShowing3: (isShowing3: boolean) => set(() => ({ isShowing3 })),
  setCuple1: (couple1: any) => set(() => ({ couple1 })),
  setCuple2: (couple2: any) => set(() => ({ couple2 })),
  setCuple3: (couple3: any) => set(() => ({ couple3 })),

  setCoupleQueue: (coupleQueue: any[]) => set(() => ({ coupleQueue })),
  popCoupleQueue: () =>
    set((state) => ({ coupleQueue: state.coupleQueue.slice(0, -1) })),
  enCoupleQueue: (couple: any) =>
    set((state) => {
      if (state.coupleQueue.length > 3) {
        return { coupleQueue: [...state.coupleQueue.slice(1), couple] };
      }
      return { coupleQueue: [...state.coupleQueue, couple] };
    }),
  deCoupleQueue: () =>
    set((state) => ({ coupleQueue: state.coupleQueue.slice(1) })),
  removeQueueAt: (index: number) =>
    set((state) => ({
      coupleQueue: [
        ...state.coupleQueue.slice(0, index),
        ...state.coupleQueue.slice(index + 1),
      ],
    })),

  // match
  selectedMatch: '',
  showSelectedMatch: false,
  setSelectedMatch: (selectedMatch: string) => set(() => ({ selectedMatch })),
  setShowSelectedMatch: (showSelectedMatch: boolean) =>
    set(() => ({ showSelectedMatch })),

  // stats
  statsTournament: {},
  statsSeason: {},
  statsSeasonType: {},
  setStatsTournament: (statsTournament: any) =>
    set(() => ({ statsTournament })),
  setStatsSeason: (statsSeason: any) => set(() => ({ statsSeason })),
  setStatsSeasonType: (statsSeasonType: any) => set(() => ({ statsSeasonType })),

  // oveview
  selectedPlayer: {},
  isComparing: false,
  setSelectedPlayer: (selectedPlayer: any) => set(() => ({ selectedPlayer })),
  setIsComparing: (isComparing: boolean) => set(() => ({ isComparing })),
}));
