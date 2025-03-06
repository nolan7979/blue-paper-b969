import { PAGE } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { ISelectBookMaker } from '@/stores';

export interface OddsRowProps {
  odd1: string;
  odd2: string;
  odd3: string;
  keyIndex: string;
  selectedBookMaker?: ISelectBookMaker;
  oddsType: string;
  theme?: string;
}

export interface Odds {
  odd1: number;
  odd2: number;
  odd3: number;
}

export interface Colors {
  color1: string;
  color2: string;
  color3: string;
}
export interface MatchListIsolatedProps {
  page?: PAGE;
  sport: string;
  isDetail?: boolean;
  matches?: Record<string, any>;
  matchesLive?: any;
  setMatches?: (matches: any) => void;
  setMatchesLive?: (matches: any) => void;
  matchLiveSocket?: Record<string, any> | null;
  isLiveMatchRefetching?: boolean;
}

