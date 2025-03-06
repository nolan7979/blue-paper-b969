import { SportEventDtoWithStat, StatusDto } from "@/constant/interface";
import { getSlug } from "@/utils/common-utils";
import { convertStatusCode } from "@/utils/convertInterface";
import { format, isSameDay, isSameYear } from "date-fns";
import { formatTime_sub } from '@/utils/tableTennisUtils';
import {
  adjustMatchDateForTimezone,
  calculateMinuteLive,
  formatMatchDate,
  formatMinuteLive,
  generateUpcomingMatchString,
  handleFutureMatchDateComparisons,
  normalizeTimestamp,
} from '@/utils';

import vi from '~/lang/vi';

export enum MatchStateSnooker {
  postponed = 14,
  delayed = 15,
  canceled = 16,
  interrupted = 17,
  finished = 30,
  //
  upcoming = 1,
  live = 200,
  Removed = 3,
  Walkover = 20,
  Retired = 21,
  Ended = 100,
  // CamelCase
  CoverageCanceled = 18
}

export const parseSnookerMatchDataArray = (
  matchDataString: string | null | undefined
): any[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }

  const matchDataArray = matchDataString?.split('!!');

  if (matchDataArray?.length === 0) return [];
  const matches = matchDataArray.map((matchString, index) => {
    const matchDetails = matchString.split('^');
    return {
      id: matchDetails[0],
      startTimestamp: Number(matchDetails[1]),
      currentPeriodTimestamp: Number(matchDetails[2]),
      uniqueTournament: {
        id: matchDetails[3],
        category: {
          id: matchDetails[4],
          name: matchDetails[5]
        },
        name: matchDetails[6],
        tier: matchDetails[7]
      },
      status:
        snookerMatchState[
          isNaN(Number(matchDetails[8]))
            ? MatchStateSnooker.upcoming
            : Number(matchDetails[8])
        ],
      homeTeam: {
        id: matchDetails[10],
        name: matchDetails[11],
        shortName: matchDetails[12],
        gender: matchDetails[13],
        national: matchDetails[14],
        type: matchDetails[15]
      },
      awayTeam: {
        id: matchDetails[16],
        name: matchDetails[17],
        shortName: matchDetails[18],
        gender: matchDetails[19],
        national: matchDetails[20],
        type: matchDetails[21]
      },
      scores: JSON.parse(matchDetails[22] || '[]'),
      slug: matchDetails[23],
      seasonId: matchDetails[24]
    };
  });
  return matches;
};
export interface SnookerMatchStateStatus {
  code: number;
  description: string;
  type: string;
}
export const snookerMatchState: Record<number, SnookerMatchStateStatus> = {
  [MatchStateSnooker.canceled]: {
    code: MatchStateSnooker.canceled,
    description: 'Canceled',
    type: 'canceled'
  },
  [MatchStateSnooker.delayed]: {
    code: MatchStateSnooker.delayed,
    description: 'Start delayed',
    type: 'delayed'
  },
  [MatchStateSnooker.interrupted]: {
    code: MatchStateSnooker.interrupted,
    description: 'Interrupted',
    type: 'interrupted'
  },
  [MatchStateSnooker.postponed]: {
    code: MatchStateSnooker.postponed,
    description: 'Postponed',
    type: 'postponed'
  },
  [MatchStateSnooker.upcoming]: {
    code: MatchStateSnooker.upcoming,
    description: 'Not started',
    type: 'upcoming'
  },
  [MatchStateSnooker.live]: {
    code: MatchStateSnooker.live,
    description: 'Live',
    type: 'live'
  },
  [MatchStateSnooker.finished]: {
    code: MatchStateSnooker.finished,
    description: 'Finished',
    type: 'finished'
  },
  [MatchStateSnooker.Removed]: {
    code: MatchStateSnooker.Removed,
    description: 'Removed',
    type: 'finished'
  },
  [MatchStateSnooker.Walkover]: {
    code: MatchStateSnooker.Walkover,
    description: 'Walkover',
    type: 'finished'
  },
  [MatchStateSnooker.Retired]: {
    code: MatchStateSnooker.Retired,
    description: 'Retired',
    type: 'finished'
  },
  [MatchStateSnooker.Ended]: {
    code: MatchStateSnooker.Ended,
    description: 'Ended',
    type: 'finished'
  },
  [MatchStateSnooker.CoverageCanceled]: {
    code: MatchStateSnooker.CoverageCanceled,
    description: 'Coverage canceled',
    type: 'finished'
  }
};



export function formatMatchTimestampSnooker(
  timestamp = 0,
  status: any,
  isByTime = false,
  startTime?: number,
  type?: string
) {
  try {
      const date = new Date(timestamp * 1000);   
      date.setHours(date.getHours());
  
      let formattedDate = format(date, 'dd/MM');
      if (!isSameYear(date, new Date())) {
        formattedDate = format(date, 'dd/MM/yy');
      }
      const formattedTime = format(date, 'HH:mm');
  
      const formattedCurrentStatus = formatTime_sub(status?.code);
  
      return isSameDay(new Date(), date)
        ? [formattedTime, formattedCurrentStatus]
        : [formattedDate, formattedCurrentStatus || formattedTime];
    } catch (err) {
      console.error(err);
      return ['', ''];
    }
}

export function isMatchHaveStatSnooker(matchStatusId: number): boolean {
  return [
    MatchStateSnooker.finished,
    MatchStateSnooker.live,
    MatchStateSnooker.Walkover,
    MatchStateSnooker.Retired,
    MatchStateSnooker.Ended,
  ].includes(matchStatusId);
}

function generateDisplayStringSnooker(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code == 200) { //live
    return [formatMinuteLive(minuteLive)];
  } else if (status.code > 1 && status.code <= 29) {
    return generateUpcomingMatchString(
      status,
      i18n,
      matchDate,
      now,
      formattedDate
    );
  } else {
    return handleFutureMatchDateComparisons(
      matchDate,
      now,
      i18n,
      formattedDate,
      status
    );
  }
}

export function genDisplayedTimeSnooker(
  timestamp: number,
  status: StatusDto,
  i18n: any = vi,
  startTime?: number
) {
  const minuteLive: string | number = calculateMinuteLive(
    startTime,
    status,
    i18n
  );

  timestamp = normalizeTimestamp(timestamp);
  const matchDate = new Date(timestamp);
  adjustMatchDateForTimezone(matchDate);

  const now = new Date();
  const formattedDate = formatMatchDate(matchDate, now);

  if (!status || status.code === -1) {
    return ['', formattedDate, ''];
  }

  return generateDisplayStringSnooker(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}
// Format time trạng thái trận đấu - ghi chi tiết (details)
export const formatTime_sub_snooker = (code: number) => {
  if (code === MatchStateSnooker.postponed) return "Postponed";
  if (code === MatchStateSnooker.delayed) return "Delayed";
  if (code === MatchStateSnooker.canceled) return "Canceled";
  if (code === MatchStateSnooker.interrupted) return "Interrupted";
  if (code === MatchStateSnooker.finished) return "Finished";
  if (code === MatchStateSnooker.upcoming) return "Upcoming";
  if (code === MatchStateSnooker.live) return "Live";
  if (code === MatchStateSnooker.Removed) return "Removed";
  if (code === MatchStateSnooker.Walkover) return "Walkover";
  if (code === MatchStateSnooker.Retired) return "Retired";
  if (code === MatchStateSnooker.Ended) return "Ended";
  if (code === MatchStateSnooker.CoverageCanceled) return "coverage canceled";
  return '';
};