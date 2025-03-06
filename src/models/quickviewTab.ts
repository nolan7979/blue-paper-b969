import { CompetitorDto, SportEventDtoWithStat } from '@/constant/interface';
import { Player } from '@/models/football';

export interface InjuriesSuspensionSectionProps {
  i18n: any;
  ref?: any;
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  homeMissingPlayers: any[];
  awayMissingPlayers: any[];
  className?: string;
}

export interface ILineupsPlayer {
  captain: boolean;
  jerseyNumber: number;
  player: Player;
  position: number;
  rating: string;
  shirtNumber: number;
  statistics: any;
  substitute: boolean;
}

export interface ILineupsItem {
  missingPlayers: ILineupsPlayer[];
  formation: string;
  players: ILineupsPlayer[];
  isNationalTeam: boolean
}

export interface ILineupsInfo {
  confirmed: boolean;
  home: ILineupsItem;
  away: ILineupsItem;
}


export interface QuickViewColumnProps {
  top: boolean;
  isBreadCumb?: boolean;
  sticky: boolean;
  matchId?: string;
  isDetail?: boolean;
  matchData?: SportEventDtoWithStat;
  featureMatchData?: SportEventDtoWithStat;
  sport?: string;
}