export interface SportEvent {
  ref_id: string;
  competition_sport_event_number: number;
  cup_round_sport_event_number: number;
  other_sport_event_id: string | null;
  start_time: string;
  start_date: number;
  start_time_confirmed: boolean;
  description: string;
  sport_event_status: object;
  match_status: string;
  replaced_by: string | null;
  record_updated_at: string;
  home_team: object;
  away_team: object;
  category: object;
  competition: object;
}
interface Sport {
  name: string;
  slug: string;
}
interface Category {
  name: string;
  slug: string;
  id: string;
  sport: Sport;
  flag?: string;
  alpha2?: string;
}

interface UniqueTournament {
  name: string;
  slug: string;
  category: Category;
  id: string;
  displayInverseHomeAwayTeams: boolean;
}
interface Country {
  id: string;
  name: string;
}
export interface Team {
  id: string;
  name: string;
  slug: string;
  sport: Sport;
  tournament: Tournament;
  primaryUniqueTournament: UniqueTournament;
  country: Country;
}

interface ProposedMarketValueRaw {
  value: number;
  currency: string;
}

interface Nationality {
  id: string;
  name?: string;
}

export interface Player {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  team: Team;
  position: string;
  height: number;
  preferredFoot: string;
  dateOfBirthTimestamp: number;
  jerseyNumber: string;
  contractUntilTimestamp: number;
  proposedMarketValue: number;
  proposedMarketValueRaw: ProposedMarketValueRaw;
  nationality: Nationality;
}

interface Tournament {
  id: string;
  priority: number;
  name: string;
  slug: string;
  category: {
    name: string;
    slug: string;
    id: string;
    flag: string;
    logo: string;
  };
  logo: string;
  group_num: number;
  uniqueTournament: {
    id: string;
    name: string;
    slug: string;
    category: {
      name: string;
      slug: string;
      id: string;
      flag: string;
      logo: string;
    };
  };
}

interface Venue {
  name: string;
  id: string;
  city: {
    name: string;
  };
  stadium: {
    name: string;
    capacity: number;
  };
  country: {
    name: string;
  };
}

export interface Score {
  current: number;
  display: number;
  period1: number;
  period2: number;
}

interface Status {
  code: number;
  description: string;
  type: string;
}

export interface Match {
  id: string;
  startTimestamp: number;
  startDt: string;
  tournament: Tournament;
  roundInfo: {
    round: number;
  };
  slug: string;
  status: Status;
  winnerCode: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: Score;
  awayScore: Score;
  referee: any; // Define referee details if available
  venue?: Venue;
  lineup: number;
  stage_id: string;
  season: {
    id: string;
    year: string;
    editor: boolean;
    seasonCoverageInfo: any; // Define seasonCoverageInfo structure if available
  };
}

export interface IMatchOdds {
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

export interface ILeaguesItems {
  id: string;
  name: string;
}

export interface IHighlight {
  title: string;
  subtitle: string;
  url: string;
  thumbnail_url: string;
  time?: string;
}
