/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import { StateCreator, create } from 'zustand';

import { LOCAL_STORAGE } from '@/constant/common';
import { MatchOdd, SportEventDtoWithStat } from '@/constant/interface';
import { ILeaguesItems } from '@/models';
import { isEqual } from 'lodash';
import { createJSONStorage, persist, devtools } from 'zustand/middleware';
import { MatchEventLiveProps } from '@/models/interface';

export interface ISelectedFavorite {
  id: string;
  sport: string;
  type: string;
}

interface MatchStore {
  selectedMatch: string | null;
  selectedRealTimeRemainTime: number | null;
  showSelectedMatch: boolean;
  loadMoreMatches: boolean;
  matchDetails: SportEventDtoWithStat | null;
  selectedFavorite: ISelectedFavorite | null;
  setSelectedMatch: (match: string | null) => void;
  toggleShowSelectedMatch: () => void;
  setShowSelectedMatch: (showSelectedMatch: boolean) => void;
  setLoadMoreMatches: (loadMoreMatches: boolean) => void;
  setMatchDetails: (match: SportEventDtoWithStat | null) => void;
  setSelectedRealTimeRemainTime: (time: number) => void;
  setSelectedFavorite: (selected: ISelectedFavorite) => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  selectedMatch: null,
  showSelectedMatch: false,
  loadMoreMatches: false,
  matchDetails: null,
  selectedRealTimeRemainTime: null,
  selectedFavorite: {id: '', sport: '', type: 'match'},
  setSelectedMatch: (match: string | null) =>
    set(() => ({ selectedMatch: match })),

  toggleShowSelectedMatch: () => {
    const currentState = get().showSelectedMatch;
    set({ showSelectedMatch: !currentState });
  },

  setShowSelectedMatch: (showSelectedMatch: boolean) => {
    const currentState = get().showSelectedMatch;
    if (currentState !== showSelectedMatch) {
      set(() => ({ showSelectedMatch }));
    }
  },

  setLoadMoreMatches: (loadMoreMatches: boolean) =>
    set(() => ({ loadMoreMatches })),
  setMatchDetails: (match: SportEventDtoWithStat | null) =>
    set(() => ({ matchDetails: match })),
  setSelectedRealTimeRemainTime: (time: number) =>
    set(() => ({ selectedRealTimeRemainTime: time })),
  setSelectedFavorite: (selected: ISelectedFavorite) =>
    set(() => ({ selectedFavorite: selected })),
}));

export const useMatchStore2nd = create<MatchStore>((set) => ({
  selectedMatch: null,
  showSelectedMatch: false,
  loadMoreMatches: false,
  matchDetails: null,
  selectedRealTimeRemainTime: null,
  selectedFavorite: null,
  setSelectedMatch: (match: string | null) =>
    set(() => ({ selectedMatch: match })),
  toggleShowSelectedMatch: () =>
    set((state) => ({ showSelectedMatch: !state.showSelectedMatch })),
  setShowSelectedMatch: (showSelectedMatch: boolean) =>
    set(() => ({ showSelectedMatch })),
  setLoadMoreMatches: (loadMoreMatches: boolean) =>
    set(() => ({ loadMoreMatches })),
  setMatchDetails: (match: SportEventDtoWithStat | null) =>
    set(() => ({ matchDetails: match })),
  setSelectedRealTimeRemainTime: (time: number) =>
    set(() => ({ selectedRealTimeRemainTime: time })),
  setSelectedFavorite: (selected: ISelectedFavorite) =>
    set(() => ({ selectedFavorite: selected })),
}));

interface TLKMatchStore {
  matches: any;
  setMatches: (matches: any) => void;
  updateMatch: (id: string, data: any) => void;
  addMatch: (match: any) => void;
  addMatches: (newMatches: any[]) => void;

  matchesOdds: any;
  setMatchesOdds: (matchesOdds: any) => void;
  updateMatchOdds: (id: string, data: any) => void;
  addMatchOdds: (match: any) => void;
}

export const useTLKMatchStore = create<TLKMatchStore>((set) => ({
  matches: {},
  setMatches: (matches: any) => set(() => ({ matches })),
  updateMatch: (id: string, data: any) =>
    set(
      produce((state: any) => {
        if (state.matches[id]) {
          state.matches[id] = { ...state.matches[id], ...data };
        }
      })
    ),
  addMatch: (match: any) =>
    set(
      produce((state: any) => {
        state.matches[match?.id] = match;
      })
    ),

  matchesOdds: {},
  setMatchesOdds: (matchesOdds: any) => set(() => ({ matchesOdds })),
  updateMatchOdds: (id: string, data: any) =>
    set(
      produce((state: any) => {
        if (state.matchesOdds[id]) {
          state.matchesOdds[id] = { ...state.matchesOdds[id], ...data };
        }
      })
    ),
  addMatchOdds: (matchOdds: any) =>
    set(
      produce((state: any) => {
        state.matchesOdds[matchOdds?.id] = matchOdds;
      })
    ),
  addMatches: (newMatches: any[]) => {
    set(
      produce((state: any) => {
        newMatches.forEach((match) => {
          state.matches[match.id] = match;
        });
      })
    );
  },
}));

interface MatchSectionStore {
  selectedSection: string;
  setSelectedSection: (tab: string) => void;

  selectedOddsSection: string;
  setSelectedOddsSection: (tab: string) => void;
}

export const useMatchSectionStore = create<MatchSectionStore>((set) => ({
  selectedSection: 'timeline',
  setSelectedSection: (section: string) =>
    set(() => ({ selectedSection: section })),

  selectedOddsSection: 'compare-odds',
  setSelectedOddsSection: (section: string) =>
    set(() => ({ selectedOddsSection: section })),
}));

interface HomeStore {
  matches: any;
  matchesOdds: any;
  matchesOddEuropean: any;
  matchesOddOverUnder: any;
  matchesLive: any;
  matchLiveInfo: boolean;
  loadingMatches: boolean;
  topLeagues: ILeaguesItems[];
  allEventCount?: MatchEventLiveProps | Record<string, any>;
  currentSport: string;

  setCurrentSport: (sport: string) => void;
  setTopLeagues: (leagues: ILeaguesItems[]) => void;

  setMatchLiveInfo: (match: boolean) => void;
  setMatchesOdds: (matchesOdds: any) => void;
  addMatchOdds: (matchesOdds: any) => void;

  addMatches: (newMatches: any[]) => void;
  setMatches: (matches: any) => void;

  addMatchesLive: (newMatches: any[]) => void;
  setMatchesLive: (matches: any) => void;
  removeMatches: () => void;
  setAllEventCount?: (data: any) => void;
  setLoadingMatches: (loading: boolean) => void;
}

export type StateSlice<T> = StateCreator<T, [], [], T>;

export const useHomeStore = create<HomeStore>(
  persist(
    (set) => ({
      matchesOdds: {},
      matchesOddEuropean: {},
      matchesOddOverUnder: {},
      matchLiveInfo: false,
      topLeagues: [],
      currentSport: '',

      loadingMatches: true,
      setLoadingMatches: (loading: boolean) => set(() => ({ loadingMatches: loading })),

      setCurrentSport: (sport: string) => set(() => ({ currentSport: sport })),

      setTopLeagues: (leagues: ILeaguesItems[]) =>
        set(() => ({ topLeagues: leagues })),

      setMatchLiveInfo: (live: boolean) => set(() => ({ matchLiveInfo: live })),
      setMatchesOdds: (matchesOdds: any) => set(() => ({ matchesOdds })),
      addMatchOdds: (matchOdds: MatchOdd[]) => {
        set(
          produce((state: any) => {
            state.matchesOdds = {};
            (matchOdds || []).forEach((match) => {
              state.matchesOdds[match?.id] = match;
            });
          })
        );
      },

      matches: {},
      addMatches: (newMatches: SportEventDtoWithStat[]) => {
        set(
          produce((state: any) => {
            newMatches.forEach((match) => {
              state.matches[match?.id] = match;
            });
          })
        );
      },

      setMatches: (newMatches: any[]) => {
        set(
          produce((state: any) => {
            const updatedMatches = newMatches.reduce((acc, match) => {
              const matchId = match?.id;
              if (matchId && (!state.matches[matchId] || !isEqual(state.matches[matchId], match))) {
                acc[matchId] = match;
              }
              return acc;
            }, {} as Record<string, any>);

            if (Object.keys(updatedMatches).length > 0) {
              state.matches = { ...state.matches, ...updatedMatches };
              // state.matches = updatedMatches;
            }
          }),
        );
      },

      removeMatches: () => {
        set(() => ({ matches: {} }));
      },

      matchesLive: {},
      addMatchesLive: (newMatches: SportEventDtoWithStat[]) => {
        set(
          produce((state: HomeStore) => {
            newMatches.forEach((match) => {
              state.matchesLive[match.id] = match;
            });
          })
        );
      },

      setMatchesLive: (newMatches: any[]) => {
        set(
          produce((state: any) => {
            const newMatchesObj: Record<string, any> = {};
            newMatches.forEach((match) => {
              newMatchesObj[match?.id] = match;
            });

            if (!isEqual(state.matchesLive, newMatchesObj)) {
              state.matchesLive = newMatchesObj;
            }
          })
        );
      },

      allEventCount: {},
      setAllEventCount: (data: MatchEventLiveProps) => set(() => ({ allEventCount: data })),

    }),
    {
      name: LOCAL_STORAGE.homeStorage,
      partialize: (state: HomeStore) => ({
        topLeagues: state.topLeagues,
        currentSport: state.currentSport,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  ) as StateSlice<HomeStore>
);
