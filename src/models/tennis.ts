export interface Coordinate {
  x: number;
  y: number;
}

export interface GroupedLabel {
  set: number | string;
  score: {
    home: number;
    away: number;
  }
}

export interface GroupedData {
  label: GroupedLabel;
  data: { home: Coordinate[], away: Coordinate[] };
}

export interface TimeLineTennisChartProps {
  labels: number[];
  data: GroupedData[];
  isLive?: boolean;
}


export interface Point {
  homePoint: string;
  awayPoint: string;
}

// Interface for the score of a game
export interface GameScore {
  homeScore: number;  // Total games won by home side
  awayScore: number;  // Total games won by away side
  serve: number;      // Who is serving, 1 for home, 2 for away
}

// Interface for a single game
export interface Game {
  game: number;
  points: Point[];
  score: GameScore;
}

// Interface for a set of games
export interface EventsOfSet {
  set: number;
  games: Game[];
}
