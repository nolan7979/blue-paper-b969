import { SportEventDto } from '@/constant/interface';
import { create, SetState } from 'zustand';

export interface ICompetition {
  id: string;
  name: string;
  slug: string;
}

interface LeagueByCountryState {
  leagues: ICompetition[];
  matches: SportEventDto[];
  setLeague: (competition: ICompetition[]) => void;
  resetLeague: () => void;
  setMatches: (matches: SportEventDto[]) => void;
  resetMatches: () => void;
}

export const useLeagueByCountryStore = create<LeagueByCountryState>((set) => ({
  leagues: [],
  matches: [],
  setLeague: (competition: ICompetition[]) => {
    set({ leagues: competition });
  },
  resetLeague: () => {
    set({ leagues: [] });
  },
  setMatches: (matches: SportEventDto[]) => {
    set({ matches: matches });
  },
  resetMatches: () => {
    set({ matches: [] });
  },
}));
