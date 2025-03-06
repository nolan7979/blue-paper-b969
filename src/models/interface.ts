import { StatusDto } from "@/constant/interface";
import { STATUS_TYPE } from "./common";

export interface MatchProps {
  id: string;
  home: { name: string; logo: string };
  away: { name: string; logo: string };
}

export interface GraphPoint {
  minute: number;
  value: number;
}
export interface GraphPointTennis {
  set: number;
  value: number;
  round: number
}


export interface Player {
  id: string;
  name: string;
  slug?: string;
  shortName?: string;
  position?: string;
}

export interface Incident {
  time: number;
  isHome: boolean;
  incidentType: string;
  incidentClass?: string;
  text?: string;
  player?: Player;
  playerIn?: Player;
  playerOut?: Player;
}

export interface TimelineData {
  x: number;
  y: number;
  incidents?: Incident[];
}

export interface TimeLineChartProps {
  labels: number[];
  data: TimelineData[];
  breakTime?: string;
}
export interface ChartItemProps {
  x: number;
  y: number;
  incidents?: Incident[];
}

export interface TimeBarProps {
  startTime: number;
  duration: number;
  status: StatusDto;
  currentPeriodTime?: number;
  breakTime: string;
  extraTime?: number;
  code?:string
}

export interface MatchStatusProps {
  id: string;
  description: string;
  code?: number;
  type: (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE];
}

export interface EventProps {
  startTimestamp: number;
  status: MatchStatusProps;
  time?: {
    currentPeriodStartTimestamp: number;
  };
}

export interface Message {
  id: string;
  msg: string;
  msgType: string;
  createdAt: number;
  matchId: string;
  user: {
    avatar: string;
    role: string;
    id: string;
    displayName: string;
    level: number;
    ip: string;
  };
  version?: string;
}


export interface SendMessagePayload {
  matchId: string;
  msg: string;
  sport: string;
}


type Sport = {
  id: number;
  name: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export type UniqueTournament = {
  id: string;
  name: string;
  slug: string;
  type?: number;
};

type Tournament = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  uniqueTournament: UniqueTournament;
};

export type Manager = {
  id: string;
  name: string;
  slug: string;
};

type City = {
  name: string;
};

export type Stadium = {
  name: string;
  capacity: number;
};

export type Venue = {
  id: string;
  city: City;
  stadium: Stadium;
  country: Country;
};

export type Country = {
  id: string;
  name: string;
  slug: string;
};

export type TeamDetails = {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  sport: Partial<Sport>;
  category: Partial<Category>;
  tournament: Partial<Tournament>;
  manager: Partial<Manager>;
  venue: Partial<Venue>;
  country: Partial<Country>;
  foundationDate?: number;
  type: number;
  foreignPlayers: number;
  nationalPlayers: number;
};

type Team = {
  id: string;
  name: string;
  slug: string;
};

type TransferFeeRaw = {
  value: number | null;
  currency: string;
};

export type Transfer = {
  player: Partial<Player>;
  transferFrom: Partial<Team>;
  transferTo: Partial<Team>;
  type: number;
  transferFee: number;
  transferFeeDescription: string;
  transferDateTimestamp: number;
  transferFeeRaw: Partial<TransferFeeRaw>;
};

export type TeamTransfers = {
  transfersIn: Transfer[];
  transfersOut: Transfer[];
};

export type StatsSeason = {
  id: string;
  year: string;
};

export type MatchEventLiveProps = {
  football_live: number;
  basketball_live: number;
  tennis_live: number;
  volleyball_live: number;
  badminton_live: number;
  am_football_live: number;
  baseball_live: number;
  cricket_live: number;
  hockey_live: number;
  table_tennis_live: number;
  snooker_live: number;
};

export type Commentary = {
  text: string;
  time: string;
  position: number;
  incidentType: string;
  incidentClass: string;
  playerIn?: Player;
  playerOut?: Player;
  player?: Player;
};

export type MatchCommentary = {
  comments: Commentary[];
};
