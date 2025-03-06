export interface IPlayerLineups {
  src: string;
  name: string;
  shirtNo: number;
  isHome?: boolean;
  isSub?: boolean;
  yellowCard?: number;
  redCard?: number;
  numGoals?: number;
  penGoals?: number;
  ownGoals?: number;
  missedPens?: number;
  yellowRed?: number;
  numAssists?: number;
  rating?: number;
  team?: any;
  matchData?: any;
  player: IPlayerLineupItem;
  showStats?: boolean;
  captain?: boolean;
}
export interface IPlayerLineupItem {
  "id": string,
  "name": string,
  "fullName": string,
  "slug": string,
  "position": string,
  "order": number,
  "coutry": {
    "id": string
  },
  "birthday": number
  "height": number
  "team": {
    "id": string,
    "name": string
  }
}