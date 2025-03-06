import { create } from 'zustand';

interface LeagueStore {
  selectedView: number;
  selectedOrder: number;
  maxViews: number;
  selectedTeam1: string;
  selectedTeam2: string;
  selectedSeason: string;
  selectedLeague: string;
  fixturesSelectedLeague: string;
  showPerformanceGraph: boolean;
  selectedXIRound: any;
  allOfXIRound: any;
  setSelectedView: (view: number) => void;
  setSelectedOrder: (order: number) => void;
  setMaxViews: (maxViews: number) => void;
  setSelectedTeam1: (team: string) => void;
  setSelectedTeam2: (team: string) => void;
  setSelectedSeason: (season: string) => void;
  setSelectedLeague: (league: string) => void;
  setFixturesSelectedLeague: (league: string) => void;
  setShowPerformanceGraph: (show: boolean) => void;
  setSelectedXIRound: (round: any) => void;
  setAllOfXIRound: (data: any) => void;
}

export const useLeagueStore = create<LeagueStore>((set) => ({
  selectedView: 0,
  selectedOrder: 1,
  maxViews: 0,
  selectedTeam1: '',
  selectedTeam2: '',
  selectedSeason: '',
  selectedLeague: '',
  fixturesSelectedLeague: '',
  showPerformanceGraph: true,
  selectedXIRound: {},
  allOfXIRound: [],
  setSelectedView: (view: number) => set(() => ({ selectedView: view })),
  setSelectedOrder: (order: number) => set(() => ({ selectedOrder: order })),
  setMaxViews: (maxViews: number) => set(() => ({ maxViews })),
  setSelectedTeam1: (team: string) => set(() => ({ selectedTeam1: team })),
  setSelectedTeam2: (team: string) => set(() => ({ selectedTeam2: team })),
  setSelectedLeague: (selectedLeague: string) =>
    set(() => ({ selectedLeague: selectedLeague })),
  setSelectedSeason: (selectedSeason: string) =>
    set(() => ({ selectedSeason: selectedSeason })),
  setFixturesSelectedLeague: (fixturesSelectedLeague: string) =>
    set(() => ({ fixturesSelectedLeague: fixturesSelectedLeague })),
  setShowPerformanceGraph: (show: boolean) =>
    set(() => ({ showPerformanceGraph: show })),
  setSelectedXIRound: (round: any) => set(() => ({ selectedXIRound: round })),
  setAllOfXIRound: (data: any) => set(() => ({ allOfXIRound: data })),
}));
