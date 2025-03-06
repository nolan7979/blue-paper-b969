import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { Match, Score, Team } from '@/models/football';
import { Images } from '@/utils';

export interface IQuickViewStandingsTab {
  matchData: SportEventDto;
  wide?: boolean;
  tournamentId?: string;
  seasonId?: string;
  stageId?: string;
  type?: string;
  isUniqueTournament?: boolean;
}

export interface IQuickViewDetailsTab {
  matchData: SportEventDtoWithStat;
  setActiveTab?: (e: string) => void;
  sport?: string;
}

export interface IQvPlayerProps {
  name: string;
  imgUrl?: string;
  rating?: number;
  shirtNo?: number;
  imgSize?: number;
  playerData?: any;
  isHome?: boolean;
  category?: string;
  i18n?: any;
  type?: keyof typeof Images;
  id?: string;
}

export interface IQuickViewStandingsTab {
  matchData: SportEventDto; 
  wide?: boolean;
  tournamentId?: string;
  seasonId?: string;
  stageId?: string;
  type?: string;
  isUniqueTournament?: boolean;
  isPlayerStats?: boolean;
  isStandings?: boolean;
  isSort?: boolean;
}

export interface IStandingRowProps {
  uniqueKey: number;
  no: number;
  team: Team;
  logoUrl?: string;
  homeScore?: number;
  awayScore?: number;
  isRankUp?: boolean;
  isRankDown?: boolean;
  change?: number;
  noMatches?: number;
  noWin?: number;
  noDraw?: number;
  noLoss?: number;
  scoresFor?: number;
  scoresAgainst?: number;
  goalDiff?: number;
  points?: number;
  showForm?: boolean;
  showLong?: boolean;
  promotion?: any;
  homeTeam?: any;
  awayTeam?: any;
  lastMatches?: any[];
  wide?: boolean;
  rankingColors?: any;
  live: boolean;
  match?: Match;
  nextMatchTeam?: any;
  classNameStickyColumn?: string;
  isDetails?: boolean;
  nextMatchUrl?: string;
  isDetail?: boolean;
}

export interface IQuickViewFilterProps {
  activeTab: string;
  setActiveTab: (x: string) => void;
  status?: any;
  lineup?: number;
  has_standing?: boolean;
  has_player_stats?: boolean;
  isHaveData?: boolean;
  hasHighlight?: boolean;
  hasCommentary?: boolean;
  hasAdvancedStats?: boolean;
  locale?: string;
  hasBoxScore?: boolean;
}

interface Event {
  id: string;
  homeScore: Score;
  awayScore: Score;
  homeTeam: Team;
  awayTeam: Team;
}

interface TeamForm {
  position?: number;
  value: string;
  form: string[];
  event: Event[];
}

export interface ShortForm {
  homeTeam: TeamForm;
  awayTeam: TeamForm;
  label: string;
}
