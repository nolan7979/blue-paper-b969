import { SportEventDtoWithStat } from "@/constant/interface";

export interface TeamH2HEachTeamEventsProps {
  h2HFilter: string;
  matchData: SportEventDtoWithStat;
  showQuickView?: boolean;
  i18n: any;
  type2nd?: boolean;
  isDetail?: boolean;
}
