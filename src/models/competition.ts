import { SportEventDto } from '@/constant/interface';

interface Tab {
  id: string;
  tab: string;
}

export interface StandingTypeFilterProps {
  tabOption: Tab;
  setBxhData: (e: any) => void;
  wide: boolean;
  id: string;
}

export interface ILeagueStandingsSectionProps {
  wide?: boolean;
  tournamentId?: string;
  seasonId?: string;
  type?: string;
  uniqueTournament?: boolean;
  forTeam?: boolean;
  showRecentMatch?: boolean;
}
