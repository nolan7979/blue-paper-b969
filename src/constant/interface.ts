export interface IScore {
  display?: number;
  period1?: number;
  period2?: number;
  period3?: number;
  period4?: number;
  corner?: number;
  red_card?: number;
  yellow_card?: number;
  current?: number;
}

export interface ITSMatchScore {
  regular_score: number;
  half_time_score: number;
  red_card: number;
  yellow_card: number;
  corners: number;
  overTime_score: number;
  penalty_score: number;
}
export interface IPayload {
  id: string;
  payload: {
    sport_event_status: ISportEventStatus | object;
  };
  metadata: {
    sport_event_id: string;
    match_living_amount: number;
  };
}
export interface IPayloadV2 {
  metadata: Record<string, any>;
  match_living_amount?: number;
}

export interface ISportEventStatus {
  status_id: number;
  home_score: ITSMatchScore;
  away_score: ITSMatchScore;
  kick_of_timestamp?: number;
  clock?: {
    played: string;
  };
}

export enum MatchState {
  Abnormal = 80,
  NotStarted = 0,
  FirstHalf = 5,
  HalfTime = 6,
  SecondHalf = 7,
  OverTime = 14,
  PenaltyShootOut = 13,
  End = 100,
  Postponed = 60,
  Interrupt = 15,
  Cancel = 70,
  CutInHalf = 90,
  AET = 110,
  AP = 120,
}
export enum MatchStateHockey {
  Abandoned = 0,
  NotStarted = 1,
  FirstPeriod = 30,
  FirstPause = 331,
  SecondPeriod = 31,
  SecondPause = 332,
  ThirdPeriod = 32,
  Ended = 100,
  AwaitingOT = 6,
  Overtime = 10,
  AfterOT = 105,
  AwaitingPenalties = 8,
  PenaltyShooting = 13,
  AfterPenalties = 110,
  Postponed = 14,
  Delayed = 15,
  Cancelled = 16,
  Interrupted = 17,
  CutInHalf = 19,
  ToBeDetermined = 99
}
export enum MatchStateBasketBall {
  Abandoned = 0,
  NotStarted = 1,
  FirstHalf = 2,
  FirstHalfOver = 3,
  SecondHalf = 4,
  SecondHalfOver = 5,
  ThirdHalf = 6,
  ThirdHalfOver = 7,
  FourHalf = 8,
  OverTime = 9,
  Ended = 10,
  Interrupted = 11,
  Cancelled = 12,
  Extension = 13,
  CutInHalf = 14,
  ToBeDetermined = 15,
}

export enum MatchStateTennis {
  Abandoned = 0,
  NotStarted = 1,
  InProgress = 3,
  Postponed = 14,
  Delayed = 15,
  Canceled = 16,
  Interrupted = 17,
  Suspension = 18,
  CutInHalf = 19,
  Walkover = 20,
  Retired = 21,
  Walkover1 = 22,
  Walkover2 = 23,
  Retired1 = 24,
  Retired2 = 25,
  Defaulted1 = 26,
  Defaulted2 = 27,
  FirstSet = 51,
  SecondSet = 52,
  ThirdSet = 53,
  FourthSet = 54,
  FifthSet = 55,
  ToBeDetermined = 99,
  Ended = 100,
}

export const FinishedStatesTennis = [
  MatchStateTennis.Ended,
  MatchStateTennis.Canceled,
];

export const InProgressStatesTennis = [
  MatchStateTennis.InProgress,
  MatchStateTennis.FirstSet,
  MatchStateTennis.SecondSet,
  MatchStateTennis.ThirdSet,
  MatchStateTennis.FourthSet,
  MatchStateTennis.FifthSet,
];

export const FinishedStates = [
  MatchState.End,
  MatchState.Cancel,
  MatchState.AP,
  MatchState.AET,
];

export enum MatchStateId {
  Unknown = -1,
  Abandoned = 0,
  NotStarted = 1,
  FirstHalf = 2,
  HalfTime = 3,
  SecondHalf = 4,
  OverTime = 5,
  Penalties = 7,
  Ended = 8,
  Postponed = 9,
  Interrupted = 10,
  CutInHalf = 11,
  Cancelled = 12,
  AET = 110,
  AP = 120, // Assuming 12 and 13 both map to cancelled in MatchState
}

export const matchStateIdToMatchState = {
  [MatchStateId.Unknown]: MatchState.Abnormal,
  [MatchStateId.Abandoned]: MatchState.Abnormal,
  [MatchStateId.NotStarted]: MatchState.NotStarted,
  [MatchStateId.FirstHalf]: MatchState.FirstHalf,
  [MatchStateId.HalfTime]: MatchState.HalfTime,
  [MatchStateId.SecondHalf]: MatchState.SecondHalf,
  [MatchStateId.OverTime]: MatchState.OverTime,
  [MatchStateId.Penalties]: MatchState.PenaltyShootOut,
  [MatchStateId.Ended]: MatchState.End,
  [MatchStateId.Postponed]: MatchState.Postponed,
  [MatchStateId.Interrupted]: MatchState.Interrupt,
  [MatchStateId.CutInHalf]: MatchState.CutInHalf,
  [MatchStateId.Cancelled]: MatchState.Cancel,
  [MatchStateId.AET]: MatchState.AET,
  [MatchStateId.AP]: MatchState.AP,
};

export interface SportEventDto {
  id: string;
  startTimestamp: number;
  tournament: TournamentDto;
  uniqueTournament?: TournamentDto;
  status: IStatusCode;
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  stage_id: string;
  seasonId?: string;
  time: any;
  homeScore: IScore;
  awayScore: IScore;
  slug: string;
  roundInfo: RoundInfoDto;
  winnerCode: number;
  has_standing?: boolean;
  has_player_stats?: boolean;
  has_highlight?: boolean;
  has_commentary?: boolean;
  lineup: number;
  referee?: RefereeDto;
  venue?: VenueDto;
  season_id?: string;
  season?: SeasonDto;
  serve?: number;
  scores?: { [key: string]: number[] };
  extraScores: { [key: string]: any };
  timer?: {
    countDown: number;
    remainTime: number;
    runSeconds: number;
    updateTime: number;
  };
  agg_score?: {
    home_score: number;
    away_score: number;
    related_id: string;
  };
}

export interface SportEventDtoWithStat extends SportEventDto {
  [x: string]: any;
  updated_at: any;
  isHomeWin(isHomeWin: any): unknown;
  mlive: any;
  homeRedCards: number;
  awayRedCards: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeCornerKicks: number;
  awayCornerKicks: number;
  is_id?: string | null;
}

export interface TournamentDto {
  name?: string;
  slug?: string;
  category?: CategoryDto;
  userCount?: number;
  uniqueTournament?: any;
  crowdsourcingEnabled?: boolean;
  hasPerformanceGraphFeature?: boolean;
  id: string;
  hasEventPlayerStatistics?: boolean;
  displayInverseHomeAwayTeams?: boolean;
  priority: number;
  group_num?: number;
  primary_color?: string;
  secondary_color?: string;
  code?: string;
  country?: any;
  short_name?: string;
  tournament?: TournamentDto;
  tier?: number;
}

export interface TournamentInfoDto {
  id: string;
  host_city: string;
  surface: string;
  sets: number;
}
export interface StatusDto {
  code: number;
  description: string;
  type: string;
}

export interface SeasonDto {
  id: string;
  year: string;
  start_time: number;
  end_time: number;
  editor: boolean;
}
export interface CompetitorDto {
  name?: string;
  slug?: string;
  shortName?: string;
  gender?: string;
  sport?: SportDto;
  userCount?: number;
  nameCode?: string;
  disabled?: boolean;
  national?: boolean;
  type?: number;
  id: string;
  country?: any;
  subTeams?: any[]; // Replace with the correct DTO when available.
  teamColors?: any;
  logo?: string;
  sub_ids?: string[] | string;
}

export class CategoryDto {
  name?: string;
  slug?: string;
  sport?: SportDto;
  id?: string;
  flag?: string;
  alpha2?: string;
  logo?: string;
}

export class SportDto {
  name?: string;
  slug?: string;
  id?: number;
}

export class RoundInfoDto {
  round?: number;
  name?: string;
  cupRoundType?: number;
  slug?: string;
  prefix?: string;
}

export interface IStatusCode {
  code: number;
  type: string;
  description: string;
}

export interface RefereeDto {
  id?: number;
  name?: string;
  slug?: string;
  yellowCards?: number;
  redCards?: number;
  yellowRedCards?: number;
  games?: number;
  sport?: any;
  country?: any;
}

export interface VenueDto {
  id?: string;
  city?: any;
  stadium?: any;
  country?: any;
  name?: string;
  capacity?: number;
}

export interface IMathOddsClose {
  close_asian?: boolean;
  over_under_close?: boolean;
  close_european?: boolean;
}

export interface MatchOdd extends IMathOddsClose {
  id: string;
  encode_is_id: string;
  asian_hdp: string;
  asian_hdp_home: string;
  asian_hdp_away: string;
  european_home: string;
  european_draw: string;
  european_away: string;
  over_under_hdp: string;
  over: string;
  under: string;
}

export type MatchOddTestStore = Omit<MatchOdd, 'encode_is_id' | 'id'>;

export interface ITeamStreaksItem {
  continued: number;
  fields: string;
  name: string;
  team: string;
  value: string;
}

export interface ITeamStreaksData {
  general: ITeamStreaksItem[];
  head2head: ITeamStreaksItem[];
}

export interface CompetitionsByCountry {
  [country: string]: string[];
}

export type competition = {
  id: string;
  name: string;
  short_name: string;
};

export type TeamDto = {
  id: string;
  name: string;
  short_name?: string;
  shortName?: string;
  national: boolean;
  conference_name: string;
  competition: competition;
  slug: string;
  country: any;
  coach: any;
  venue: any;
};

export type TeamSeasonDto = {
  team: TeamDto;
  losses: number;
  matches: number;
  wins: number;
  stage_id: string;
};

export type StandingDto = {
  name: string;
  rows: TeamSeasonDto[];
};

export type StandingSeasonDto = {
  stages: any[];
  standings: StandingDto[];
};

export type StageDto = {
  id: string;
  name: string;
};

export type StatsTeamType = {
  scope: number;
  name: string;
};

export type StatisticsDto = {
  [key: string]: any;
};

export type PlayerDto = {
  id: string;
  name: string;
  slug: string;
  shortName: string;
};

export type RankingRecordDto = {
  team: TeamDto;
  statistics: StatisticsDto;
  player: PlayerDto;
};

export type RankingDto = {
  [key: string]: RankingRecordDto[];
};

export type ViewDto = {
  order: number;
  awayTeamScore: number;
  homeTeamScore: number;
  notStart: boolean;
  time: number;
  round: { description: string };
};

export type CupTreeDto = {
  name: string;
  views: Array<ViewDto[]>;
};

export type Ball = {
  display: string;
  score: number;
  extra_score: number;
  description: string;
};

export type Bowler = {
  id: string;
  name: string;
};

export type Batter = {
  id: string;
  name: string;
};

export type Over = {
  over_number: number;
  bowler: Bowler;
  batter: Batter;
  batter2?: Batter;
  total_run: number;
  runs: number;
  wickets: number;
  balls: Ball[];
};

export type Team = {
  id: string;
  name: string;
};

export type Inning = {
  inning: number;
  team: Team;
  overs: Over[];
};

type Row = {
  team: Team;
  position: number;
  points: number;
  total: number;
  win: number;
  loss: number;
  sets_win: number;
  sets_loss: number;
};

export type Group = {
  name: string;
  rows: Row[];
};

export type EmailDataPayload = {
  email: string;
  subject: string;
  body: string;
  links: string[];
};

export type UpLoadPayload = {
  images: File[];
  email: string;
};

export type Image = {
  name: string;
  path: string;
};

export type Data = {
  valid_images: Image[];
};

export type UploadImageResponse = {
  code: number;
  data: Data;
};

type FootyStats = {
  _id: string;
  competition_id: number;
  id: number;
  season: string;
  stats: any;
};

export type TeamInfoFooty = {
  _id: string;
  id: number;
  alt_names: string[];
  cleanName: string;
  continent: string | null;
  country: string;
  english_name: string;
  flag_element: string | null;
  founded: string;
  full_name: string;
  image: string;
  name: string;
  official_sites: string[];
  performance_rank: number;
  risk: number;
  seasonClean: string | null;
  season_format: string;
  shortHand: string;
  stats: FootyStats;
  table_position: number;
  url: string;
  mappingCountry: string | null;
};

export type FullTimeScoredStats = {
  seasonScoredOver05PercentageHome: number;
  seasonScoredOver05PercentageAway: number;
  seasonScoredOver15PercentageHome: number;
  seasonScoredOver15PercentageAway: number;
  seasonScoredOver25PercentageHome: number;
  seasonScoredOver25PercentageAway: number;
  seasonScoredOver35PercentageHome: number;
  seasonScoredOver35PercentageAway: number;
  seasonFTSPercentageHome: number;
  seasonFTSPercentageAway: number;
};

export type FullTimeConcededStats = {
  seasonConcededOver05PercentageHome: number;
  seasonConcededOver05PercentageAway: number;
  seasonConcededOver15PercentageHome: number;
  seasonConcededOver15PercentageAway: number;
  seasonConcededOver25PercentageHome: number;
  seasonConcededOver25PercentageAway: number;
  seasonConcededOver35PercentageHome: number;
  seasonConcededOver35PercentageAway: number;
  seasonCSPercentageHome: number;
  seasonCSPercentageAway: number;
};

export type HalfTimeScoredStats = {
  scoredBothHalvesPercentageHome: number;
  scoredBothHalvesPercentageAway: number;
  scoredAVGHTHome: number;
  scoredAVGHTAway: number;
  scored2hgAvgHome: number;
  scored2hgAvgAway: number;
};

export type HalfTimeConcededStats = {
  concededAVGHTHome: number;
  concededAVGHTAway: number;
  conceded2hgAvgHome: number;
  conceded2hgAvgAway: number;
  seasonCSPercentageHTHome: number;
  seasonCSPercentageHTAway: number;
  cs2hgPercentageHome: number;
  cs2hgPercentageAway: number;
};

export type OverPercentageStats = {
  seasonOver05Percentage_home: number;
  seasonOver15Percentage_home: number;
  seasonOver25Percentage_home: number;
  seasonOver35Percentage_home: number;
  seasonOver45Percentage_home: number;
  seasonOver05Percentage_away: number;
  seasonOver15Percentage_away: number;
  seasonOver25Percentage_away: number;
  seasonOver35Percentage_away: number;
  seasonOver45Percentage_away: number;
  o05Potential: number;
  o15Potential: number;
  o25Potential: number;
  o35Potential: number;
  o45Potential: number;
};

export type OverHTPercentageStats = {
  seasonOver05PercentageHT_home: number;
  over05_2hg_percentage_home: number;
  seasonOver15PercentageHT_home: number;
  over15_2hg_percentage_home: number;
  seasonOver25PercentageHT_home: number;
  over25_2hg_percentage_home: number;
  seasonOver05PercentageHT_away: number;
  over05_2hg_percentage_away: number;
  seasonOver15PercentageHT_away: number;
  over15_2hg_percentage_away: number;
  seasonOver25PercentageHT_away: number;
  over25_2hg_percentage_away: number;
  o05HT_potential: number;
  o05_2H_potential: number;
  o15HT_potential: number;
  o15_2H_potential: number;
  o25HT_potential: number;
  o25_2H_potential: number;
};

export type UnderPercentageStats = {
  seasonUnder05Percentage_home: number;
  seasonUnder15Percentage_home: number;
  seasonUnder25Percentage_home: number;
  seasonUnder35Percentage_home: number;
  seasonUnder45Percentage_home: number;
  seasonUnder05Percentage_away: number;
  seasonUnder15Percentage_away: number;
  seasonUnder25Percentage_away: number;
  seasonUnder35Percentage_away: number;
  seasonUnder45Percentage_away: number;
  u05Potential: number;
  u15Potential: number;
  u25Potential: number;
  u35Potential: number;
  u45Potential: number;
};

export type UnderHTPercentageStats = {
  seasonUnder05PercentageHT_home: number;
  under05_2hg_percentage_home: number;
  seasonUnder15PercentageHT_home: number;
  under15_2hg_percentage_home: number;
  seasonUnder25PercentageHT_home: number;
  under25_2hg_percentage_home: number;
  seasonUnder05PercentageHT_away: number;
  under05_2hg_percentage_away: number;
  seasonUnder15PercentageHT_away: number;
  under15_2hg_percentage_away: number;
  seasonUnder25PercentageHT_away: number;
  under25_2hg_percentage_away: number;
  u05HT_potential: number;
  u05_2H_potential: number;
  u15HT_potential: number;
  u15_2H_potential: number;
  u25HT_potential: number;
  u25_2H_potential: number;
};

export type CornersPercentageStats = {
  over65CornersPercentage_home: number;
  over75CornersPercentage_home: number;
  over85CornersPercentage_home: number;
  over95CornersPercentage_home: number;
  over105CornersPercentage_home: number;
  over115CornersPercentage_home: number;
  over125CornersPercentage_home: number;
  over135CornersPercentage_home: number;
  over145CornersPercentage_home: number;
  over65CornersPercentage_away: number;
  over75CornersPercentage_away: number;
  over85CornersPercentage_away: number;
  over95CornersPercentage_away: number;
  over105CornersPercentage_away: number;
  over115CornersPercentage_away: number;
  over125CornersPercentage_away: number;
  over135CornersPercentage_away: number;
  over145CornersPercentage_away: number;
  over65CornersPercentage_overall: number;
  over75CornersPercentage_overall: number;
  over85CornersPercentage_overall: number;
  over95CornersPercentage_overall: number;
  over105CornersPercentage_overall: number;
  over115CornersPercentage_overall: number;
  over125CornersPercentage_overall: number;
  over135CornersPercentage_overall: number;
  over145CornersPercentage_overall: number;
};

export type CornersHalfTimeStats = {
  //* Home
  corners_fh_avg_home: number;
  corners_fh_over4_percentage_home: number;
  corners_fh_over5_percentage_home: number;
  corners_fh_over6_percentage_home: number;
  corners_2h_avg_home: number;
  corners_2h_over4_home: number;
  corners_2h_over5_percentage_home: number;
  corners_2h_over6_percentage_home: number;

  //* Away
  corners_fh_avg_away: number;
  corners_fh_over4_percentage_away: number;
  corners_fh_over5_percentage_away: number;
  corners_fh_over6_percentage_away: number;
  corners_2h_avg_away: number;
  corners_2h_over4_away: number;
  corners_2h_over5_percentage_away: number;
  corners_2h_over6_percentage_away: number;

  //* Average
  corners_fh_avg: number;
  corners_fh_over4_percentage: number;
  corners_fh_over5_percentage: number;
  corners_fh_over6_percentage: number;
  corners_2h_avg: number;
  corners_2h_over4_percentage: number;
  corners_2h_over5_percentage: number;
  corners_2h_over6_percentage: number;
};

export type CornersEarnedStats = {
  //* Home
  cornersAVG_home: number;
  over25CornersForPercentage_home: number;
  over35CornersForPercentage_home: number;
  over45CornersForPercentage_home: number;
  over55CornersForPercentage_home: number;

  //* Away
  cornersAVG_away: number;
  over25CornersForPercentage_away: number;
  over35CornersForPercentage_away: number;
  over45CornersForPercentage_away: number;
  over55CornersForPercentage_away: number;

  //* Average
  cornersAVG_overall: number;
  over25CornersForPercentage_overall: number;
  over35CornersForPercentage_overall: number;
  over45CornersForPercentage_overall: number;
  over55CornersForPercentage_overall: number;
};

export type CornersAgainstStats = {
  //* Home
  cornersAgainstAVG_home: number;
  over25CornersAgainstPercentage_home: number;
  over35CornersAgainstPercentage_home: number;
  over45CornersAgainstPercentage_home: number;
  over55CornersAgainstPercentage_home: number;

  //* Away
  cornersAgainstAVG_away: number;
  over25CornersAgainstPercentage_away: number;
  over35CornersAgainstPercentage_away: number;
  over45CornersAgainstPercentage_away: number;
  over55CornersAgainstPercentage_away: number;

  //* Average
  cornersAgainstAVG_overall: number;
  over25CornersAgainstPercentage_overall: number;
  over35CornersAgainstPercentage_overall: number;
  over45CornersAgainstPercentage_overall: number;
  over55CornersAgainstPercentage_overall: number;
};

export type TotalCardsStats = {
  //* Home
  cards_total_avg_home: number;
  over05CardsPercentage_home: number;
  over15CardsPercentage_home: number;
  over25CardsPercentage_home: number;
  over35CardsPercentage_home: number;
  over45CardsPercentage_home: number;
  over55CardsPercentage_home: number;
  over65CardsPercentage_home: number;

  //* Away
  cards_total_avg_away: number;
  over05CardsPercentage_away: number;
  over15CardsPercentage_away: number;
  over25CardsPercentage_away: number;
  over35CardsPercentage_away: number;
  over45CardsPercentage_away: number;
  over55CardsPercentage_away: number;
  over65CardsPercentage_away: number;

  //* Average
  cards_total_avg_overall: number;
  over05CardsPercentage_overall: number;
  over15CardsPercentage_overall: number;
  over25CardsPercentage_overall: number;
  over35CardsPercentage_overall: number;
  over45CardsPercentage_overall: number;
  over55CardsPercentage_overall: number;
  over65CardsPercentage_overall: number;
};

export type CardedStats = {
  //* Home
  cards_for_avg_home: number;
  over05CardsForPercentage_home: number;
  over15CardsForPercentage_home: number;
  over25CardsForPercentage_home: number;
  over35CardsForPercentage_home: number;

  //* Away
  cards_for_avg_away: number;
  over05CardsForPercentage_away: number;
  over15CardsForPercentage_away: number;
  over25CardsForPercentage_away: number;
  over35CardsForPercentage_away: number;

  //* Average
  cards_for_avg: number;
  over05CardsForPercentage: number;
  over15CardsForPercentage: number;
  over25CardsForPercentage: number;
  over35CardsForPercentage: number;
};

export type OpponentCardsStats = {
  //* Home
  cards_against_avg_home: number;
  over05CardsAgainstPercentage_home: number;
  over15CardsAgainstPercentage_home: number;
  over25CardsAgainstPercentage_home: number;
  over35CardsAgainstPercentage_home: number;

  //* Away
  cards_against_avg_away: number;
  over05CardsAgainstPercentage_away: number;
  over15CardsAgainstPercentage_away: number;
  over25CardsAgainstPercentage_away: number;
  over35CardsAgainstPercentage_away: number;

  //* Average
  cards_against_avg: number;
  over05CardsAgainstPercentage: number;
  over15CardsAgainstPercentage: number;
  over25CardsAgainstPercentage: number;
  over35CardsAgainstPercentage: number;
};

export type firstSecondHalfCardsStats = {
  //* Home
  fh_cards_total_avg_home: number;
  h2_cards_total_avg_home: number;
  fh_cards_for_avg_home: number;
  h2_cards_for_avg_home: number;

  //* Away
  fh_cards_total_avg_away: number;
  h2_cards_total_avg_away: number;
  fh_cards_for_avg_away: number;
  h2_cards_for_avg_away: number;

  //* Average
  fh_cards_total_avg: number;
  h2_cards_total_avg: number;
  fh_cards_for_avg: number;
  h2_cards_for_avg: number;
};

export type Over_05_3CardsStats = {
  //* Home
  fh_total_cards_under2_percentage_home: number;
  h2_total_cards_under2_percentage_home: number;
  fh_total_cards_2to3_percentage_home: number;
  h2_total_cards_2to3_percentage_home: number;
  fh_total_cards_over3_percentage_home: number;
  h2_total_cards_over3_percentage_home: number;

  //* Away
  fh_total_cards_under2_percentage_away: number;
  h2_total_cards_under2_percentage_away: number;
  fh_total_cards_2to3_percentage_away: number;
  h2_total_cards_2to3_percentage_away: number;
  fh_total_cards_over3_percentage_away: number;
  h2_total_cards_over3_percentage_away: number;

  //* Average
  fh_total_cards_under2_percentage: number;
  h2_total_cards_under2_percentage: number;
  fh_total_cards_2to3_percentage: number;
  h2_total_cards_2to3_percentage: number;
  fh_total_cards_over3_percentage: number;
  h2_total_cards_over3_percentage: number;
};

export type FirstGoalStats = {
  //* Home
  firstGoalScored_home_overall: number;
  seasonMatchesPlayed_home_overall: number;
  firstGoalScoredPercentage_home_overall: number;

  //* Away
  firstGoalScored_away_overall: number;
  seasonMatchesPlayed_away_overall: number;
  firstGoalScoredPercentage_away_overall: number;
};

export type HalfFormStats = {
  leadingAtHTPercentage_home: number;
  wins_2hg_percentage_home: number;
  drawingAtHTPercentage_home: number;
  draws_2hg_percentage_home: number;
  trailingAtHTPercentage_home: number;
  losses_2hg_percentage_home: number;
  leadingAtHTPercentage_away: number;
  wins_2hg_percentage_away: number;
  drawingAtHTPercentage_away: number;
  draws_2hg_percentage_away: number;
  trailingAtHTPercentage_away: number;
  losses_2hg_percentage_away: number;
};

export enum SPORT_TYPE {
  Football    = 0,
  Basketball  = 1,
  Tennis      = 2,
  Volleyball  = 3,
  Badminton   = 4,
  Baseball    = 5,
  AMFootball  = 6,
  Cricket     = 7,
  IceHockey   = 8,
  TableTennis = 9,
  Snooker     = 10,
}

export enum FAVORITE_TYPE {
  COMPETITION = 1,
  TEAM = 2,
  PLAYER = 3,
}

export type TotalGoalsBy10Minutes = {
  goals_all_min_0_to_10_home: number;
  goals_all_min_11_to_20_home: number;
  goals_all_min_21_to_30_home: number;
  goals_all_min_31_to_40_home: number;
  goals_all_min_41_to_50_home: number;
  goals_all_min_51_to_60_home: number;
  goals_all_min_61_to_70_home: number;
  goals_all_min_71_to_80_home: number;
  goals_all_min_81_to_90_home: number;
  goals_all_min_0_to_10_away: number;
  goals_all_min_11_to_20_away: number;
  goals_all_min_21_to_30_away: number;
  goals_all_min_31_to_40_away: number;
  goals_all_min_41_to_50_away: number;
  goals_all_min_51_to_60_away: number;
  goals_all_min_61_to_70_away: number;
  goals_all_min_71_to_80_away: number;
  goals_all_min_81_to_90_away: number;
};

export type TotalGoalsBy15Minutes = {
  goals_all_min_0_to_15_home: number;
  goals_all_min_16_to_30_home: number;
  goals_all_min_31_to_45_home: number;
  goals_all_min_46_to_60_home: number;
  goals_all_min_61_to_75_home: number;
  goals_all_min_76_to_90_home: number;
  goals_all_min_0_to_15_away: number;
  goals_all_min_16_to_30_away: number;
  goals_all_min_31_to_45_away: number;
  goals_all_min_46_to_60_away: number;
  goals_all_min_61_to_75_away: number;
  goals_all_min_76_to_90_away: number;
};

export type GoalsScoredBy10Minutes = {
  goals_scored_min_0_to_10_home: number;
  goals_scored_min_11_to_20_home: number;
  goals_scored_min_21_to_30_home: number;
  goals_scored_min_31_to_40_home: number;
  goals_scored_min_41_to_50_home: number;
  goals_scored_min_51_to_60_home: number;
  goals_scored_min_61_to_70_home: number;
  goals_scored_min_71_to_80_home: number;
  goals_scored_min_81_to_90_home: number;
  goals_scored_min_0_to_10_away: number;
  goals_scored_min_11_to_20_away: number;
  goals_scored_min_21_to_30_away: number;
  goals_scored_min_31_to_40_away: number;
  goals_scored_min_41_to_50_away: number;
  goals_scored_min_51_to_60_away: number;
  goals_scored_min_61_to_70_away: number;
  goals_scored_min_71_to_80_away: number;
  goals_scored_min_81_to_90_away: number;
};

export type GoalsScoredBy15Minutes = {
  goals_scored_min_0_to_15_home: number;
  goals_scored_min_16_to_30_home: number;
  goals_scored_min_31_to_45_home: number;
  goals_scored_min_46_to_60_home: number;
  goals_scored_min_61_to_75_home: number;
  goals_scored_min_76_to_90_home: number;
  goals_scored_min_0_to_15_away: number;
  goals_scored_min_16_to_30_away: number;
  goals_scored_min_31_to_45_away: number;
  goals_scored_min_46_to_60_away: number;
  goals_scored_min_61_to_75_away: number;
  goals_scored_min_76_to_90_away: number;
};

export type GoalsConcededBy10Minutes = {
  goals_conceded_min_0_to_10_home: number;
  goals_conceded_min_11_to_20_home: number;
  goals_conceded_min_21_to_30_home: number;
  goals_conceded_min_31_to_40_home: number;
  goals_conceded_min_41_to_50_home: number;
  goals_conceded_min_51_to_60_home: number;
  goals_conceded_min_61_to_70_home: number;
  goals_conceded_min_71_to_80_home: number;
  goals_conceded_min_81_to_90_home: number;
  goals_conceded_min_0_to_10_away: number;
  goals_conceded_min_11_to_20_away: number;
  goals_conceded_min_21_to_30_away: number;
  goals_conceded_min_31_to_40_away: number;
  goals_conceded_min_41_to_50_away: number;
  goals_conceded_min_51_to_60_away: number;
  goals_conceded_min_61_to_70_away: number;
  goals_conceded_min_71_to_80_away: number;
  goals_conceded_min_81_to_90_away: number;
};

export type GoalsConcededBy15Minutes = {
  goals_conceded_min_0_to_15_home: number;
  goals_conceded_min_16_to_30_home: number;
  goals_conceded_min_31_to_45_home: number;
  goals_conceded_min_46_to_60_home: number;
  goals_conceded_min_61_to_75_home: number;
  goals_conceded_min_76_to_90_home: number;
  goals_conceded_min_0_to_15_away: number;
  goals_conceded_min_16_to_30_away: number;
  goals_conceded_min_31_to_45_away: number;
  goals_conceded_min_46_to_60_away: number;
  goals_conceded_min_61_to_75_away: number;
  goals_conceded_min_76_to_90_away: number;
};

export type ShotsTakenStats = {
  shotsAVG_home: number;
  shotsAVG_away: number;
  shotsAVG_overall: number;
  shot_conversion_rate_home: number;
  shot_conversion_rate_away: number;
  shot_conversion_rate_overall: number;
  shotsOnTargetAVG_home: number;
  shotsOnTargetAVG_away: number;
  shotsOnTargetAVG_overall: number;
  shotsOffTargetAVG_home: number;
  shotsOffTargetAVG_away: number;
  shotsOffTargetAVG_overall: number;
  shots_per_goals_scored_home: number;
  shots_per_goals_scored_away: number;
  shots_per_goals_scored_overall: number;
  team_shots_over105_percentage_home: number;
  team_shots_over105_percentage_away: number;
  team_shots_over105_percentage_overall: number;
  team_shots_over115_percentage_home: number;
  team_shots_over115_percentage_away: number;
  team_shots_over115_percentage_overall: number;
  team_shots_over125_percentage_home: number;
  team_shots_over125_percentage_away: number;
  team_shots_over125_percentage_overall: number;
  team_shots_over135_percentage_home: number;
  team_shots_over135_percentage_away: number;
  team_shots_over135_percentage_overall: number;
  team_shots_over145_percentage_home: number;
  team_shots_over145_percentage_away: number;
  team_shots_over145_percentage_overall: number;
  team_shots_over155_percentage_home: number;
  team_shots_over155_percentage_away: number;
  team_shots_over155_percentage_overall: number;
  team_shots_on_target_over35_percentage_home: number;
  team_shots_on_target_over35_percentage_away: number;
  team_shots_on_target_over35_percentage_overall: number;
  team_shots_on_target_over45_percentage_home: number;
  team_shots_on_target_over45_percentage_away: number;
  team_shots_on_target_over45_percentage_overall: number;
  team_shots_on_target_over55_percentage_home: number;
  team_shots_on_target_over55_percentage_away: number;
  team_shots_on_target_over55_percentage_overall: number;
  team_shots_on_target_over65_percentage_home: number;
  team_shots_on_target_over65_percentage_away: number;
  team_shots_on_target_over65_percentage_overall: number;
};
