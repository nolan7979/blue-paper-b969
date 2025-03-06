import { MatchState } from '@/constant/interface';
import { create } from 'zustand';

interface MatchCompetition {
  page: number;
  matchesShow: any[];
  index: number;
  matchesAll: any[];
  setIndex: () => void;
  setPage: (increase: boolean) => void;
  setMatchesNotStarted: (matches: any[]) => void;
  setMatchesEnded: (matches: any[]) => void;
  setMatchesAll: (matches: any[]) => void;
  resetAll: () => void;
}

export const useMatchCompetition = create<MatchCompetition>((set) => ({
  page: 0,
  matchesShow: [],
  matchesAll: [],
  index: 0,
  setMatchesAll: () => {
    set((state) => ({}));
  },
  setIndex: () => {
    set((state) => {
      const newIndex = state.matchesShow.findIndex((m: any) => {
        return m.status.code === MatchState.NotStarted;
      });
      let index: number;
      if (newIndex === -1) {
        index = state.matchesShow.length - 10;
      } else if (newIndex > 8) {
        index = newIndex - 8;
      } else {
        index = 0;
      }

      return {
        ...state,
        index,
      };
    });
  },
  setPage: (increase: boolean) => {
    set((state) => {
      return {
        ...state,
        page: increase ? state.page + 1 : state.page - 1,
      };
    });
  },
  setMatchesNotStarted: (m: any[]) => {
    set((state) => {
      const newMatches = m?.filter((item) => !state.matchesShow.includes(item));

      return {
        ...state,
        matchesShow: [...state.matchesShow, ...newMatches],
      };
    });
  },
  setMatchesEnded: (m: any[]) => {
    set((state) => {
      const newMatches = m.filter((item) => !state.matchesShow.includes(item));
      return {
        ...state,
        matchesShow: [...newMatches, ...state.matchesShow],
      };
    });
  },
  resetAll: () => {
    set(() => {
      return {
        page: 0,
        matchesShow: [],
        index: 0,
      };
    });
  },
}));
