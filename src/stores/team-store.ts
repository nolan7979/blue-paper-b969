import { create } from 'zustand';

interface TeamStore {
  teamStatsTournament: any;
  teamStatsSeason: any;
  selectedStandingsTournament: any;
  selectedStandingsSeason: any;
  seasonOptions: any[];
  selectedTeamStatsSeason: any;
  playerStatsTournament: any;
  playerStatsSeason: any;
  setTeamStatsTournament: (teamStatsTournament: any) => void;
  setTeamStatsSeason: (teamStatsSeason: any) => void;
  setSelectedStandingsTournament: (selectedStandingTournament: any) => void;
  setSelectedStandingsSeason: (selectedStandingSeason: any) => void;
  setSeasonOptions: (seasonOptions: any[]) => void;
  setSelectedTeamStatsSeason: (selectedTeamStatsSeason: any) => void;
  setPlayerStatsTournament: (playerStatsTournament: any) => void;
  setPlayerStatsSeason: (playerStatsSeason: any) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teamStatsTournament: {},
  teamStatsSeason: {},
  selectedStandingsTournament: {},
  selectedStandingsSeason: {},
  seasonOptions: [],
  selectedTeamStatsSeason: {},
  playerStatsTournament: {},
  playerStatsSeason: {},
  setTeamStatsTournament: (teamStatsTournament: any) =>
    set(() => ({ teamStatsTournament })),
  setTeamStatsSeason: (teamStatsSeason: any) =>
    set(() => ({ teamStatsSeason })),
  setSelectedStandingsTournament: (selectedStandingsTournament: any) =>
    set(() => ({ selectedStandingsTournament })),
  setSeasonOptions: (seasonOptions: any[]) => set(() => ({ seasonOptions })),
  setSelectedTeamStatsSeason: (selectedTeamStatsSeason: any) =>
    set(() => ({ selectedTeamStatsSeason })),
  setSelectedStandingsSeason: (selectedStandingsSeason: any) =>
    set(() => ({ selectedStandingsSeason })),
  setPlayerStatsTournament: (playerStatsTournament: any) =>
    set(() => ({ playerStatsTournament })),
  setPlayerStatsSeason: (playerStatsSeason: any) =>
    set(() => ({ playerStatsSeason })),
}));
