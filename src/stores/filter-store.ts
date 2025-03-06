import { create } from 'zustand';

import { IOddsCompany } from '@/models/football/common';

export enum DetailMatchTabs {
  details = 'details',
  squad = 'squad',
  stats = 'stats',
  matches = 'matches',
  topScore = 'topScore',
  standings = 'standings',
}

interface FilterStore {
  matchTypeFilter: string;
  matchTypeFilterMobile: string
  dateFilter: Date;
  bxhFormat: string;
  bxhData: string;
  playerFilter: string;
  mbDetailMatchTab: keyof typeof DetailMatchTabs;
  mbDetailTeamTab: string;
  mbBottomFilter: string;
  mbSquadTab: string;
  matchH2HFilter: string;
  oddsCompany: IOddsCompany[];
  showRecentMatchMobile: boolean;
  toggleRecentMatch: boolean;
  setMatchFilter: (matchType: string) => void;
  setMatchFilterMobile: (matchType: string) => void;
  resetMatchFilter: () => void;
  resetMatchFilterMobile: () => void;
  setDateFilter: (dateObj: Date) => void;
  setBxhFormat: (bxhFormat: string) => void;
  setBxhData: (bxhData: string) => void;
  setShowRecentMatchMobile: (isShow: boolean) => void;
  setToggleRecentMatch: (isShow: boolean) => void;
  setPlayerFilter: (bxhData: string) => void;
  setMbDetailMatchTab: (bxhData: keyof typeof DetailMatchTabs) => void;
  setMbDetailTeamTab: (bxhData: string) => void;
  setMbSquadTab: (bxhData: string) => void;
  setMbBottomFilter: (bxhData: string) => void;
  setMatchH2HFilter: (bxhData: string) => void;
  setOddsCompany: (company: IOddsCompany[]) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  matchTypeFilter: 'all', // live/all/finished/hot + league
  matchTypeFilterMobile: 'all', // live/all/finished/hot + league
  dateFilter: new Date(),
  bxhFormat: 'full',
  bxhData: 'total',
  playerFilter: 'player-lineup',
  mbDetailMatchTab: DetailMatchTabs.details,
  mbDetailTeamTab: 'details',
  mbBottomFilter: 'all',
  mbSquadTab: 'squat1',
  matchH2HFilter: 'h2h', // h2h, home, away
  oddsCompany: [],
  showRecentMatchMobile: false,
  toggleRecentMatch: false,
  setMatchFilterMobile: (matchType: string) => set(() => ({ matchTypeFilterMobile: matchType })),
  setMbSquadTab: (bxhData: string) => set(() => ({ mbSquadTab: bxhData })),
  setMatchFilter: (matchType: string) =>
    set(() => ({ matchTypeFilter: matchType })),
  resetMatchFilter: () => set(() => ({ matchTypeFilter: 'all' })),
  resetMatchFilterMobile: () => set(() => ({ matchTypeFilterMobile: 'all' })),
  setDateFilter: (dateObj: Date) => {
    set(() => ({ dateFilter: dateObj }));
  },
  setBxhFormat: (bxhFormat: string) => set(() => ({ bxhFormat: bxhFormat })),
  setBxhData: (bxhData: string) => set(() => ({ bxhData: bxhData })),
  setShowRecentMatchMobile: (isShow: boolean) => set(() => ({ showRecentMatchMobile: isShow })),
  setToggleRecentMatch: (isShow: boolean) => set(() => ({ toggleRecentMatch: isShow })),
  setPlayerFilter: (playerFilter: string) =>
    set(() => ({ playerFilter: playerFilter })),
  setMbDetailMatchTab: (mbDetailMatchTab: keyof typeof DetailMatchTabs) =>
    set(() => ({ mbDetailMatchTab: mbDetailMatchTab })),
  setMbDetailTeamTab: (mbDetailTeamTab: string) =>
    set(() => ({ mbDetailTeamTab: mbDetailTeamTab })),
  setMbBottomFilter: (mbBottomFilter: string) =>
    set(() => ({ mbBottomFilter: mbBottomFilter })),
  setMatchH2HFilter: (matchH2HFilter: string) =>
    set(() => ({ matchH2HFilter: matchH2HFilter })),
  setOddsCompany: (company: IOddsCompany[]) =>
    set(() => ({ oddsCompany: company })),
}));

export interface IRoundItemV2 {
  stage_id: string;
  name: string;
}
interface LeagueMatchFilterStore {
  filterMatchBy: string;
  byDatePage: number;
  selectedRound: IRoundItemV2;
  selectedRoundSlug: string;
  selectedRoundPrefix: string;
  selectedGroup: any;
  setFilterMatchBy: (filterMatchBy: string) => void;
  setSelectedRound: (selectedRound: IRoundItemV2) => void;
  setSelectedRoundSlug: (selectedRoundSlug: string) => void;
  setSelectedRoundPrefix: (selectedRoundPrefix: string) => void;
  setSelectedGroup: (selectedGroup: any) => void;
  setByDatePage: (byDatePage: number) => void;
}

export const useLeagueMatchFilterStore = create<LeagueMatchFilterStore>(
  (set) => ({
    filterMatchBy: 'by_date', // by_date, by_round, by_group
    selectedRound: {
      stage_id: '',
      name: '',
    },
    selectedRoundSlug: '',
    selectedRoundPrefix: '',
    selectedGroup: {},
    byDatePage: 0,
    setFilterMatchBy: (filterMatchBy: string) =>
      set(() => ({ filterMatchBy: filterMatchBy })),
    setSelectedRound: (selectedRoundData: IRoundItemV2) =>
      set(() => ({ selectedRound: selectedRoundData })),
    setSelectedRoundSlug: (selectedRoundSlug: string) =>
      set(() => ({ selectedRoundSlug: selectedRoundSlug })),
    setSelectedRoundPrefix: (selectedRoundPrefix: string) =>
      set(() => ({ selectedRoundPrefix: selectedRoundPrefix })),
    setSelectedGroup: (selectedGroup: any) =>
      set(() => ({ selectedGroup: selectedGroup })),
    setByDatePage: (byDatePage: number) =>
      set(() => ({ byDatePage: byDatePage })),
  })
);

export interface IDrawerStore {
  showDrawer: boolean;
  setShowDrawer: (showDrawer: boolean) => void;
}

export const useDrawerStore = create<IDrawerStore>((set) => ({
  showDrawer: false,
  setShowDrawer: (showDrawer: boolean) => set(() => ({ showDrawer })),
}));