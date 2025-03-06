import { MATCH_FILTERS, SPORT } from '@/constant/common';
import { PAGE } from '@/constant/common';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import {
  adjustMatchDateForTimezone,
  calculateMinuteLive,
  formatMatchDate,
  formatMinuteLive,
  generateUpcomingMatchString,
  handleFutureMatchDateComparisons,
  isMatchOnDate,
  normalizeTimestamp,
} from '@/utils';
import { format, isSameDay, isSameYear } from 'date-fns';

import vi from '~/lang/vi';

export enum MatchStatusTableTennis {
  ABNORMAL = 0, // Suggest hiding
  NOT_STARTED = 1,
  IN_PROGRESS = 3,
  FIRST_SET = 51,
  FIRST_PAUSE = 331,
  SECOND_SET = 52,
  SECOND_PAUSE = 332,
  THIRD_SET = 53,
  THIRD_PAUSE = 333,
  FOURTH_SET = 54,
  FOURTH_PAUSE = 334,
  FIFTH_SET = 55,
  FIFTH_PAUSE = 335,
  SIXTH_SET = 472,
  SIXTH_PAUSE = 336,
  SEVENTH_SET = 473,
  ENDED = 100,
  WALKOVER = 20,
  RETIRED = 21,
  WALKOVER1 = 22,
  WALKOVER2 = 23,
  RETIRED1 = 24,
  RETIRED2 = 25,
  DEFAULTED1 = 26,
  DEFAULTED2 = 27,
  POSTPONED = 14,
  DELAYED = 15,
  CANCELED = 16,
  INTERRUPTED = 17,
  CUT_IN_HALF = 19,
  TO_BE_DETERMINED = 99,
}

export enum TableTennisStatisticsStatus {
  POINTS_WON = 1,
  MAX_POINTS_IN_A_ROW = 2,
  COMEBACK_TO_WIN = 3,
  BIGGEST_LEAD = 4,
  SERVICE_POINTS_SUCCESS = 5,
  SERVICE_POINTS_TOTAL = 6,
  SERVICE_POINTS_RATE = 7,
  RECEIVER_POINTS_SUCCESS = 8,
  RECEIVER_POINTS_TOTAL = 9,
  RECEIVER_POINTS_RATE = 10,
  SERVICE_ERRORS = 11,
  TIMEOUTS = 12,
}

// Technical Statistics
export const tableTennisTechStat: Record<number, string> = {
  1: 'points_won',
  2: 'max_points_in_a_row',
  3: 'comeback_to_win',
  4: 'biggest_lead',
  5: 'service_points_success',
  6: 'service_points_total',
  7: 'service_points_rate',
  8: 'receiver_points_success',
  9: 'receiver_points_total',
  10: 'receiver_points_rate',
  11: 'service_errors',
  12: 'timeouts',
};

export const parseMatchDataArrayTableTennis = (
  matchDataString: string | null | undefined
): any[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }

  const matchDataArray = matchDataString?.split('!!');

  if (matchDataArray?.length === 0) return [];
  const matches = matchDataArray.map((matchString) => {
    const matchDetails = matchString.split('^');
    return {
      id: matchDetails[0],
      startTimestamp: Number(matchDetails[1]),
      uniqueTournament: {
        id: matchDetails[2],
        priority: Number(matchDetails[3]),
        name: matchDetails[4],
        category: {
          id: matchDetails[5],
          name: matchDetails[6],
        },
      },
      status: convertStatusCodeTableTennis(Number(matchDetails[7])),
      homeTeam: {
        id: matchDetails[10],
        name: matchDetails[11],
        // slug: matchDetails[12],
        national: matchDetails[13],
        sub_ids: JSON.parse(matchDetails?.[12] || '[]') || [],
      },
      awayTeam: {
        id: matchDetails[14],
        name: matchDetails[15],
        // slug: matchDetails[16],
        national: matchDetails[17],
        sub_ids: JSON.parse(matchDetails?.[16] || '[]') || [],
      },
      scores: JSON.parse(matchDetails[18] || '[]'),
      serve: matchDetails[19],
      slug: matchDetails[20],
      season_id: matchDetails[21],
      // venue: {
      //   name: matchDetails[28],
      //   capacity: matchDetails[29],
      //   city: matchDetails[30]
      // }
    };
  });
  return matches;
};

export const convertStatusCodeTableTennis = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: '',
        },
      };
    case MatchStatusTableTennis.ABNORMAL:
      return {
        code: MatchStatusTableTennis.ABNORMAL,
        type: 'ABNORMAL',
        description: 'Abandoned',
      };
    case MatchStatusTableTennis.NOT_STARTED:
      return {
        code: MatchStatusTableTennis.NOT_STARTED,
        type: 'NOT_STARTED',
        description: 'Not Started',
      };
    case MatchStatusTableTennis.IN_PROGRESS:
      return {
        code: MatchStatusTableTennis.IN_PROGRESS,
        type: 'IN_PROGRESS',
        description: 'In Progress',
      };
    case MatchStatusTableTennis.FIRST_SET:
      return {
        code: MatchStatusTableTennis.FIRST_SET,
        type: 'FIRST_SET',
        description: 'First Set',
      };
    case MatchStatusTableTennis.SECOND_SET:
      return {
        code: 52,
        description: 'Second Set',
        type: 'SECOND_SET',
      };
    case MatchStatusTableTennis.FIRST_PAUSE:
      return {
        code: MatchStatusTableTennis.FIRST_PAUSE,
        type: 'FIRST_PAUSE',
        description: 'First Pause',
      };
    case MatchStatusTableTennis.SECOND_SET:
      return {
        code: MatchStatusTableTennis.SECOND_SET,
        type: 'SECOND_SET',
        description: 'Second Set',
      };
    case MatchStatusTableTennis.SECOND_PAUSE:
      return {
        code: MatchStatusTableTennis.SECOND_PAUSE,
        type: 'SECOND_PAUSE',
        description: 'Second Pause',
      };
    case MatchStatusTableTennis.THIRD_SET:
      return {
        code: MatchStatusTableTennis.THIRD_SET,
        type: 'THIRD_SET',
        description: 'Third Set',
      };
    case MatchStatusTableTennis.THIRD_PAUSE:
      return {
        code: MatchStatusTableTennis.THIRD_PAUSE,
        type: 'THIRD_PAUSE',
        description: 'Third Pause',
      };
    case MatchStatusTableTennis.FOURTH_SET:
      return {
        code: MatchStatusTableTennis.FOURTH_SET,
        type: 'FOURTH_SET',
        description: 'Fourth Set',
      };
    case MatchStatusTableTennis.FOURTH_PAUSE:
      return {
        code: MatchStatusTableTennis.FOURTH_PAUSE,
        type: 'FOURTH_PAUSE',
        description: 'Fourth Pause',
      };
    case MatchStatusTableTennis.FIFTH_SET:
      return {
        code: MatchStatusTableTennis.FIFTH_SET,
        type: 'FIFTH_SET',
        description: 'Fifth Set',
      };
    case MatchStatusTableTennis.FIFTH_PAUSE:
      return {
        code: MatchStatusTableTennis.FIFTH_PAUSE,
        type: 'FIFTH_PAUSE',
        description: 'Fifth Pause',
      };
    case MatchStatusTableTennis.SIXTH_SET:
      return {
        code: MatchStatusTableTennis.SIXTH_SET,
        type: 'SIXTH_SET',
        description: 'Sixth Set',
      };
    case MatchStatusTableTennis.SIXTH_PAUSE:
      return {
        code: MatchStatusTableTennis.SIXTH_PAUSE,
        type: 'SIXTH_PAUSE',
        description: 'Sixth Pause',
      };
    case MatchStatusTableTennis.SEVENTH_SET:
      return {
        code: MatchStatusTableTennis.SEVENTH_SET,
        type: 'SEVENTH_SET',
        description: 'Seventh Set',
      };
    case MatchStatusTableTennis.ENDED:
      return {
        code: MatchStatusTableTennis.ENDED,
        type: 'ENDED',
        description: 'Ended',
      };
    case MatchStatusTableTennis.WALKOVER:
      return {
        code: MatchStatusTableTennis.WALKOVER,
        type: 'WALKOVER',
        description: 'Walkover',
      };
    case MatchStatusTableTennis.WALKOVER1:
      return {
        code: MatchStatusTableTennis.RETIRED,
        type: 'RETIRED',
        description: 'Retired',
      };
    case MatchStatusTableTennis.WALKOVER2:
      return {
        code: MatchStatusTableTennis.WALKOVER2,
        type: 'WALKOVER2',
        description: 'Walkover',
      };
    case MatchStatusTableTennis.RETIRED1:
      return {
        code: MatchStatusTableTennis.RETIRED1,
        type: 'RETIRED1',
        description: 'Retired',
      };
    case MatchStatusTableTennis.RETIRED2:
      return {
        code: MatchStatusTableTennis.RETIRED2,
        type: 'RETIRED2',
        description: 'Retired',
      };
    case MatchStatusTableTennis.DEFAULTED1:
      return {
        code: MatchStatusTableTennis.DEFAULTED1,
        type: 'DEFAULTED1',
        description: 'Defaulted',
      };
    case MatchStatusTableTennis.DEFAULTED2:
      return {
        code: MatchStatusTableTennis.DEFAULTED2,
        type: 'DEFAULTED2',
        description: 'Defaulted',
      };
    case MatchStatusTableTennis.POSTPONED:
      return {
        code: MatchStatusTableTennis.POSTPONED,
        type: 'POSTPONED',
        description: 'Postponed',
      };
    case MatchStatusTableTennis.DELAYED:
      return {
        code: MatchStatusTableTennis.DELAYED,
        type: 'DELAYED',
        description: 'Delayed',
      };
    case MatchStatusTableTennis.CANCELED:
      return {
        code: MatchStatusTableTennis.CANCELED,
        type: 'CANCELED',
        description: 'Canceled',
      };
    case MatchStatusTableTennis.INTERRUPTED:
      return {
        code: MatchStatusTableTennis.INTERRUPTED,
        type: 'INTERRUPTED',
        description: 'Interrupted',
      };
    case MatchStatusTableTennis.CUT_IN_HALF:
      return {
        code: MatchStatusTableTennis.CUT_IN_HALF,
        type: 'CUT_IN_HALF',
        description: 'Cut in Half',
      };
    case MatchStatusTableTennis.TO_BE_DETERMINED:
      return {
        code: MatchStatusTableTennis.TO_BE_DETERMINED,
        type: 'TO_BE_DETERMINED',
        description: 'To Be Determined',
      };
    default:
      return {
        code: -1,
        type: '',
        description: '',
      };
  }
};

export const checkMatchStatus = (code: number) => {
  // Kiểm tra nếu trạng thái trận đấu là 'NotStarted'
  return code === MatchStatusTableTennis.NOT_STARTED;
};
// Format time trạng thái trận đấu (List) - basket ball
export const formatTime = (code: number) => {
  if (code === MatchStatusTableTennis.ABNORMAL) return 'Abandoned';
  if (code === MatchStatusTableTennis.ENDED) return 'FT';
  if (code === MatchStatusTableTennis.CUT_IN_HALF) return 'Cut';
  if (code === MatchStatusTableTennis.TO_BE_DETERMINED) return 'Pending';
  if (code === MatchStatusTableTennis.INTERRUPTED) return 'Interrupted';
  if (code === MatchStatusTableTennis.POSTPONED) return 'Postponed';
  if (code === MatchStatusTableTennis.CANCELED) return 'Cancelled';
  if (code === MatchStatusTableTennis.WALKOVER) return 'Walkover';
  if (code === MatchStatusTableTennis.RETIRED) return 'Retired';
  if (code === MatchStatusTableTennis.RETIRED1) return 'P1-Retired';
  if (code === MatchStatusTableTennis.RETIRED2) return 'P2-Retired';
  if (code === MatchStatusTableTennis.WALKOVER) return 'Walkover';
  if (code === MatchStatusTableTennis.WALKOVER1) return 'P1-Walkover';
  if (code === MatchStatusTableTennis.WALKOVER2) return 'P2-Walkover';
  if (code === MatchStatusTableTennis.DEFAULTED1) return 'P1-Defaulted';
  if (code === MatchStatusTableTennis.DEFAULTED2) return 'P2-Defaulted';
  if (code === MatchStatusTableTennis.DELAYED) return 'Delayed';
  return '';
};

// Format time trạng thái trận đấu (List)
export const getCurrentRound = (code: MatchStatusTableTennis) => {
  if (code === MatchStatusTableTennis.IN_PROGRESS) {
    return 'Inprogress';
  }
  if (code === MatchStatusTableTennis.FIRST_SET) {
    return 'S1';
  }
  if (code === MatchStatusTableTennis.SECOND_SET) {
    return 'S2';
  }
  if (code === MatchStatusTableTennis.THIRD_SET) {
    return 'S3';
  }
  if (code === MatchStatusTableTennis.FOURTH_SET) {
    return 'S4';
  }
  if (code === MatchStatusTableTennis.FIFTH_SET) {
    return 'S5';
  }
  if (code === MatchStatusTableTennis.SIXTH_SET) {
    return 'S6';
  }
  if (code === MatchStatusTableTennis.SEVENTH_SET) {
    return 'S7';
  }
  if (code === MatchStatusTableTennis.FIRST_PAUSE) {
    return 'S1-Pause';
  }
  if (code === MatchStatusTableTennis.SECOND_PAUSE) {
    return 'S2-Pause';
  }
  if (code === MatchStatusTableTennis.THIRD_PAUSE) {
    return 'S3-Pause';
  }
  if (code === MatchStatusTableTennis.FOURTH_PAUSE) {
    return 'S4-Pause';
  }
  if (code === MatchStatusTableTennis.FIFTH_PAUSE) {
    return 'S5-Pause';
  }
  if (code === MatchStatusTableTennis.SIXTH_PAUSE) {
    return 'S6-Pause';
  }
  if (code === MatchStatusTableTennis.ENDED) {
    return 'End';
  }

  return '';
};

// Format time trạng thái trận đấu (List)
export const getNumberSet = (code: MatchStatusTableTennis) => {
  if (code === MatchStatusTableTennis.FIRST_SET) {
    return 1;
  }
  if (code === MatchStatusTableTennis.SECOND_SET) {
    return 2;
  }
  if (code === MatchStatusTableTennis.THIRD_SET) {
    return 3;
  }
  if (code === MatchStatusTableTennis.FOURTH_SET) {
    return 4;
  }
  if (code === MatchStatusTableTennis.FIFTH_SET) {
    return 5;
  }
};
// Format time trạng thái trận đấu (List)  (DONE)
export function checkInProgessMatch(statusId: number): boolean {
  return (
    statusId === MatchStatusTableTennis.FIRST_SET ||
    statusId === MatchStatusTableTennis.FIRST_PAUSE ||
    statusId === MatchStatusTableTennis.SECOND_SET ||
    statusId === MatchStatusTableTennis.SECOND_PAUSE ||
    statusId === MatchStatusTableTennis.THIRD_SET ||
    statusId === MatchStatusTableTennis.THIRD_PAUSE ||
    statusId === MatchStatusTableTennis.FOURTH_SET ||
    statusId === MatchStatusTableTennis.FOURTH_PAUSE ||
    statusId === MatchStatusTableTennis.FIFTH_SET ||
    statusId === MatchStatusTableTennis.FIFTH_PAUSE ||
    statusId === MatchStatusTableTennis.SIXTH_SET ||
    statusId === MatchStatusTableTennis.SIXTH_PAUSE ||
    statusId === MatchStatusTableTennis.SEVENTH_SET
  );
}

// Format time trạng thái trận đấu - ghi chi tiết (details)
export const formatTime_sub = (code: number) => {
  if (code === MatchStatusTableTennis.ABNORMAL) return 'Abandoned';
  if (code === MatchStatusTableTennis.ENDED) return 'FT';
  if (code === MatchStatusTableTennis.CUT_IN_HALF) return 'Cut';
  if (code === MatchStatusTableTennis.TO_BE_DETERMINED) return 'Pending';
  if (code === MatchStatusTableTennis.INTERRUPTED) return 'Interrupted';
  if (code === MatchStatusTableTennis.POSTPONED) return 'Postponed';
  if (code === MatchStatusTableTennis.CANCELED) return 'Cancelled';
  if (code === MatchStatusTableTennis.WALKOVER) return 'Walkover';
  if (code === MatchStatusTableTennis.RETIRED) return 'Retired';
  if (code === MatchStatusTableTennis.RETIRED1) return 'P1-Retired';
  if (code === MatchStatusTableTennis.RETIRED2) return 'P2-Retired';
  if (code === MatchStatusTableTennis.WALKOVER) return 'Walkover';
  if (code === MatchStatusTableTennis.WALKOVER1) return 'P1-Walkover';
  if (code === MatchStatusTableTennis.WALKOVER2) return 'P2-Walkover';
  if (code === MatchStatusTableTennis.DEFAULTED1) return 'P1-Defaulted';
  if (code === MatchStatusTableTennis.DEFAULTED2) return 'P2-Defaulted';
  if (code === MatchStatusTableTennis.DELAYED) return 'Delayed';
  if (code === MatchStatusTableTennis.IN_PROGRESS) {
    return 'Inprogress';
  }
  if (code === MatchStatusTableTennis.FIRST_SET) {
    return 'S1';
  }
  if (code === MatchStatusTableTennis.FIRST_PAUSE) {
    return 'S1-Pause';
  }
  if (code === MatchStatusTableTennis.SECOND_SET) {
    return 'S2';
  }
  if (code === MatchStatusTableTennis.SECOND_PAUSE) {
    return 'S2-Pause';
  }
  if (code === MatchStatusTableTennis.THIRD_SET) {
    return 'S3';
  }
  if (code === MatchStatusTableTennis.THIRD_PAUSE) {
    return 'S3-Pause';
  }
  if (code === MatchStatusTableTennis.FOURTH_SET) {
    return 'S4';
  }
  if (code === MatchStatusTableTennis.FOURTH_PAUSE) {
    return 'S4-Pause';
  }
  if (code === MatchStatusTableTennis.FIFTH_SET) {
    return 'S5';
  }
  if (code === MatchStatusTableTennis.FIFTH_PAUSE) {
    return 'S5-Pause';
  }
  if (code === MatchStatusTableTennis.SIXTH_SET) {
    return 'S6';
  }
  if (code === MatchStatusTableTennis.SIXTH_PAUSE) {
    return 'S6-Pause';
  }
  if (code === MatchStatusTableTennis.SEVENTH_SET) {
    return 'S7';
  }
  if (code === MatchStatusTableTennis.ENDED) {
    return 'End';
  }
  return '';
};

export const isMatchEndTableTennis = (statusCode: number) => {
  switch (statusCode) {
    case MatchStatusTableTennis.ENDED:
    case MatchStatusTableTennis.WALKOVER:
    case MatchStatusTableTennis.RETIRED:
    case MatchStatusTableTennis.WALKOVER1:
    case MatchStatusTableTennis.WALKOVER2:
    case MatchStatusTableTennis.RETIRED1:
    case MatchStatusTableTennis.RETIRED2:
    case MatchStatusTableTennis.DEFAULTED1:
    case MatchStatusTableTennis.DEFAULTED2:
    case MatchStatusTableTennis.CANCELED:
    case MatchStatusTableTennis.INTERRUPTED:
    case MatchStatusTableTennis.CUT_IN_HALF:
    case MatchStatusTableTennis.TO_BE_DETERMINED:
    case MatchStatusTableTennis.POSTPONED:
    case MatchStatusTableTennis.DELAYED:
      return true;
    default:
      return false;
  }
};

export const isMatchNotStartedTableTennis = (statusCode: number) => {
  return statusCode === MatchStatusTableTennis.NOT_STARTED;
};

export const isMatchHaveStatTableTennis = (statusCode: number) => {
  return [
    MatchStatusTableTennis.IN_PROGRESS,
    MatchStatusTableTennis.ENDED,
    MatchStatusTableTennis.FIRST_SET,
    MatchStatusTableTennis.SECOND_SET,
    MatchStatusTableTennis.THIRD_SET,
    MatchStatusTableTennis.FOURTH_SET,
    MatchStatusTableTennis.FIFTH_SET,
    MatchStatusTableTennis.SIXTH_SET,
    MatchStatusTableTennis.SEVENTH_SET,
    MatchStatusTableTennis.FIRST_PAUSE,
    MatchStatusTableTennis.SECOND_PAUSE,
    MatchStatusTableTennis.THIRD_PAUSE,
    MatchStatusTableTennis.FOURTH_PAUSE,
    MatchStatusTableTennis.FIFTH_PAUSE,
    MatchStatusTableTennis.SIXTH_PAUSE,
  ].includes(statusCode);
}

const matchEndedStates = [
  MatchStatusTableTennis.ENDED,
  MatchStatusTableTennis.WALKOVER,
  MatchStatusTableTennis.RETIRED,
  MatchStatusTableTennis.WALKOVER1,
  MatchStatusTableTennis.WALKOVER2,
  MatchStatusTableTennis.RETIRED1,
  MatchStatusTableTennis.RETIRED2,
  MatchStatusTableTennis.DEFAULTED1,
  MatchStatusTableTennis.DEFAULTED2,
];

export const filterMatchesTableTennis = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string
): SportEventDtoWithStat[] => {
  const today = new Date();

  return matches.filter((match) => {
    const priority = parseInt(
      match?.uniqueTournament?.priority?.toString() || '0',
      10
    );
    const isDateFilterMatching = isMatchOnDate(
      match.startTimestamp,
      dateFilter
    );
    const isMatchHot =
      match?.uniqueTournament?.priority &&
      priority < mapMatchPriority[SPORT.TABLE_TENNIS];
    const matchEnded = isMatchEndTableTennis(match.status?.code);
    const matchInProgress =
      !matchEnded && !matchEndedStates.includes(match.status?.code);

    if (
      filter === MATCH_FILTERS.FINISHED ||
      filter === MATCH_FILTERS.RESULTS ||
      page === PAGE.results ||
      filterMobile === MATCH_FILTERS.FINISHED
    ) {
      return isSameDay(today, dateFilter)
        ? matchEnded
        : matchEnded && isDateFilterMatching;
    }

    if (filter === MATCH_FILTERS.HOT) {
      return isSameDay(today, dateFilter)
        ? isMatchHot
        : isMatchHot && isDateFilterMatching;
    }

    if (
      (filter === MATCH_FILTERS.LIVE || filter === MATCH_FILTERS.ALL) &&
      !isSameDay(today, dateFilter)
    ) {
      return isDateFilterMatching;
    }

    if (
      page === PAGE.fixtures ||
      filterMobile === MATCH_FILTERS.FIXTURES ||
      (filter === MATCH_FILTERS.ALL && isSameDay(today, dateFilter))
    ) {
      return matchInProgress;
    }

    return true;
  });
};

export const formatMatchTimestampTableTennis = (
  timestamp = 0,
  status: any,
  isByTime = false,
  startTime?: number
) => {
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
};

function generateDisplayStringTTennis(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code >= 20 && status.code <= 472 && status.code != 100) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 10 && status.code <= 19) {
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

export function genDisplayedTimeTTennis(
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

  return generateDisplayStringTTennis(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}
