import { format, isSameDay, isSameYear, isToday } from 'date-fns';

import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import {
  SportEventDtoWithStat,
  StatusDto
} from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import { handleFutureMatchDateComparisons, isMatchOnDate } from '@/utils/common-utils';
import {
  adjustMatchDateForTimezone,
  calculateMinuteLive,
  formatMatchDate,
  formatMinuteLive,
  generateUpcomingMatchString,
  normalizeTimestamp,
} from '@/utils/football-utils';
import vi from '~/lang/vi';

export const filterMatchesAMFootball = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates = [
    MatchStateAMFootball.ABNORMAL,
    MatchStateAMFootball.ENDED,
    MatchStateAMFootball.CANCELED,
    MatchStateAMFootball.POSTPONED,
    MatchStateAMFootball.DELAYED,
    MatchStateAMFootball.INTERRUPTED,
    MatchStateAMFootball.CUT_IN_HALF,
    MatchStateAMFootball.TO_BE_DETERMINED,
  ]

  return matches.filter((match) => {
    const priority = parseInt(match?.tournament?.priority.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.tournament?.priority && priority < mapMatchPriority[SPORT.AMERICAN_FOOTBALL];
    const matchEnded = isMatchEndAMFootball(match.status?.code);
    const matchInProgress = !matchEnded && !matchEndedStates.includes(match.status?.code);


    if (filter === MATCH_FILTERS.FINISHED || filter === MATCH_FILTERS.RESULTS || page === PAGE.results || filterMobile === MATCH_FILTERS.FINISHED) {
      return isSameDay(today, dateFilter) ? matchEnded : matchEnded && isDateFilterMatching;
    }

    if (filter === MATCH_FILTERS.HOT) {
      return isSameDay(today, dateFilter) ? isMatchHot : isMatchHot && isDateFilterMatching;
    }

    if ((filter === MATCH_FILTERS.LIVE || filter === MATCH_FILTERS.ALL) && !isSameDay(today, dateFilter)) {
      return isDateFilterMatching;
    }

    if (page === PAGE.fixtures || filterMobile === MATCH_FILTERS.FIXTURES || (filter === MATCH_FILTERS.ALL && isSameDay(today, dateFilter))) {
      return matchInProgress;
    }

    return true;
  });
};

export enum MatchStateAMFootball {
  ABNORMAL = 0,
  NOT_STARTED = 1,
  FIRST_QUARTER = 44,
  FIRST_PAUSE = 331,
  SECOND_QUARTER = 45,
  SECOND_PAUSE = 332,
  THIRD_QUARTER = 46,
  THIRD_PAUSE = 333,
  FOURTH_QUARTER = 47,
  FOURTH_PAUSE = 334,
  ENDED = 100,
  AWAITING_OT = 6,
  OVERTIME = 10,
  AFTER_OT = 105,
  POSTPONED = 14,
  DELAYED = 15,
  CANCELED = 16,
  INTERRUPTED = 17,
  CUT_IN_HALF = 19,
  TO_BE_DETERMINED = 99,
}
export const nonActiveStatesAMFootball = [
  MatchStateAMFootball.ABNORMAL,
  MatchStateAMFootball.CANCELED,
  MatchStateAMFootball.CUT_IN_HALF,
  MatchStateAMFootball.AFTER_OT,
  MatchStateAMFootball.ENDED,
  MatchStateAMFootball.INTERRUPTED,
  MatchStateAMFootball.TO_BE_DETERMINED,
];
export const parseMatchDataArrayAMFootball = (
  matchDataString: string | null | undefined
): any[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }
  const matchDataArray = matchDataString?.split('!!');

  const matches = matchDataArray.map((matchString) => {
    const matchDetails = matchString.split('^');
    return {
      id: matchDetails[0],
      startTimestamp: Number(matchDetails[1]),
      uniqueTournament: {
        id: matchDetails[2],
        name: matchDetails[3],
        slug: matchDetails[4],
        short_name: matchDetails[5],
        category: {
          id: matchDetails[6],
          name: matchDetails[7],
        },
      },
      status: convertStatusCodeAMFootball(Number(matchDetails[8])),
      homeTeam: {
        id: matchDetails[11],
        name: matchDetails[12],
        slug: matchDetails[13],
        short_name: matchDetails[14],
        abbr: matchDetails[15],
        gender: matchDetails[16],
        national: matchDetails[17],
      },
      awayTeam: {
        id: matchDetails[18],
        name: matchDetails[19],
        slug: matchDetails[20],
        short_name: matchDetails[21],
        abbr: matchDetails[22],
        gender: matchDetails[23],
        national: matchDetails[24],
      },
      scores: JSON.parse(matchDetails[25] || '[]'),
      serve: matchDetails[26],
      slug: matchDetails[27],
      season_id: matchDetails[28],
      venue: {
        name: matchDetails[29],
        capacity: matchDetails[30],
        city: matchDetails[31],
      },
    };
  });
  return matches;
};

export const convertStatusCodeAMFootball = (code: number) => {
  switch (code) {
    case MatchStateAMFootball.ABNORMAL:
      return {
        code: MatchStateAMFootball.ABNORMAL,
        type: 'ABNORMAL',
        description: 'Trạng thái bất thường, có thể không hiển thị.',
      };
    case MatchStateAMFootball.NOT_STARTED:
      return {
        code: MatchStateAMFootball.NOT_STARTED,
        type: 'NOT_STARTED',
        description: 'Trận đấu chưa bắt đầu.',
      };
    case MatchStateAMFootball.FIRST_QUARTER:
      return {
        code: MatchStateAMFootball.FIRST_QUARTER,
        type: 'FIRST_QUARTER',
        description: 'Hiệp đầu tiên đang diễn ra.',
      };
    case MatchStateAMFootball.FIRST_PAUSE:
      return {
        code: MatchStateAMFootball.FIRST_PAUSE,
        type: 'FIRST_PAUSE',
        description: 'Thời gian nghỉ giữa hiệp đầu.',
      };
    case MatchStateAMFootball.SECOND_QUARTER:
      return {
        code: MatchStateAMFootball.SECOND_QUARTER,
        type: 'SECOND_QUARTER',
        description: 'Hiệp thứ hai đang diễn ra.',
      };
    case MatchStateAMFootball.SECOND_PAUSE:
      return {
        code: MatchStateAMFootball.SECOND_PAUSE,
        type: 'SECOND_PAUSE',
        description: 'Thời gian nghỉ giữa hiệp thứ hai.',
      };
    case MatchStateAMFootball.THIRD_QUARTER:
      return {
        code: MatchStateAMFootball.THIRD_QUARTER,
        type: 'THIRD_QUARTER',
        description: 'Hiệp thứ ba đang diễn ra.',
      };
    case MatchStateAMFootball.THIRD_PAUSE:
      return {
        code: MatchStateAMFootball.THIRD_PAUSE,
        type: 'THIRD_PAUSE',
        description: 'Thời gian nghỉ giữa hiệp thứ ba.',
      };
    case MatchStateAMFootball.FOURTH_QUARTER:
      return {
        code: MatchStateAMFootball.FOURTH_QUARTER,
        type: 'FOURTH_QUARTER',
        description: 'Hiệp thứ tư đang diễn ra.',
      };
    case MatchStateAMFootball.FOURTH_PAUSE:
      return {
        code: MatchStateAMFootball.FOURTH_PAUSE,
        type: 'FOURTH_QUARTER',
        description: 'Thời gian nghỉ giữa hiệp thứ tư',
      };
    case MatchStateAMFootball.ENDED:
      return {
        code: MatchStateAMFootball.ENDED,
        type: 'ENDED',
        description: 'Trận đấu đã kết thúc.',
      };
    case MatchStateAMFootball.AWAITING_OT:
      return {
        code: MatchStateAMFootball.AWAITING_OT,
        type: 'AWAITING_OT',
        description: 'Chờ đợi hiệp phụ (overtime).',
      };
    case MatchStateAMFootball.OVERTIME:
      return {
        code: MatchStateAMFootball.OVERTIME,
        type: 'OVERTIME',
        description: 'Hiệp phụ đang diễn ra.',
      };
    case MatchStateAMFootball.AFTER_OT:
      return {
        code: MatchStateAMFootball.AFTER_OT,
        type: 'AFTER_OT',
        description: 'Sau hiệp phụ.',
      };
    case MatchStateAMFootball.POSTPONED:
      return {
        code: MatchStateAMFootball.POSTPONED,
        type: 'POSTPONED',
        description: 'Trận đấu bị hoãn.',
      };
    case MatchStateAMFootball.DELAYED:
      return {
        code: MatchStateAMFootball.DELAYED,
        type: 'DELAYED',
        description: 'Trận đấu bị trì hoãn.',
      };
    case MatchStateAMFootball.CANCELED:
      return {
        code: MatchStateAMFootball.CANCELED,
        type: 'CANCELED',
        description: 'Trận đấu bị hủy bỏ.',
      };
    case MatchStateAMFootball.INTERRUPTED:
      return {
        code: MatchStateAMFootball.INTERRUPTED,
        type: 'INTERRUPTED',
        description: 'Trận đấu bị gián đoạn.',
      };
    case MatchStateAMFootball.CUT_IN_HALF:
      return {
        code: MatchStateAMFootball.CUT_IN_HALF,
        type: 'CUT_IN_HALF',
        description: 'Trận đấu bị cắt ngắn.',
      };
    case MatchStateAMFootball.TO_BE_DETERMINED:
      return {
        code: MatchStateAMFootball.TO_BE_DETERMINED,
        type: 'TO_BE_DETERMINED',
        description: 'Trạng thái đang chờ xác định.',
      };
    default:
      return {
        code: 'UNKNOWN',
        type: 'UNKNOWN',
        description: 'Trạng thái không xác định.',
      };
  }
};

// Format time trạng thái trận đấu (List) - American Football
export const formatTimeAMFootball = (code: number) => {
  if (code === MatchStateAMFootball.ABNORMAL) return 'Abandoned';
  if (code === MatchStateAMFootball.ENDED) return 'FT';
  if (code === MatchStateAMFootball.CUT_IN_HALF) return 'Cut';
  if (code === MatchStateAMFootball.TO_BE_DETERMINED) return 'Pending';
  if (code === MatchStateAMFootball.INTERRUPTED) return 'Interrupted';
  if (code === MatchStateAMFootball.POSTPONED) return 'Postponed';
  if (code === MatchStateAMFootball.CANCELED) return 'Cancelled';
  if (code === MatchStateAMFootball.FIRST_PAUSE) {
    return 'Q1 Ended';
  }
  if (code === MatchStateAMFootball.SECOND_PAUSE) {
    return 'Q2 Ended';
  }
  if (code === MatchStateAMFootball.THIRD_PAUSE) {
    return 'Q3 Ended';
  }
  if (code === MatchStateAMFootball.FOURTH_PAUSE) {
    return 'Q4 Ended';
  }
  if (code === MatchStateAMFootball.FIRST_QUARTER) {
    return 'Q1';
  }
  if (code === MatchStateAMFootball.SECOND_QUARTER) {
    return 'Q2';
  }
  if (code === MatchStateAMFootball.THIRD_QUARTER) {
    return 'Q3';
  }
  if (code === MatchStateAMFootball.FOURTH_QUARTER) {
    return 'Q4';
  }
  if (code === MatchStateAMFootball.AWAITING_OT) {
    return 'Awaiting Overtime';
  }
  if (code === MatchStateAMFootball.AFTER_OT) {
    return 'AOT';
  }
  if (code === MatchStateAMFootball.OVERTIME) {
    return 'OT';
  }
  return false;
};

// Format time trạng thái trận đấu (List) - basket ball
export const getCurrentRoundAMFootball = (code: MatchStateAMFootball) => {
  if (code === MatchStateAMFootball.FIRST_QUARTER) {
    return 'Q1';
  }
  if (code === MatchStateAMFootball.SECOND_QUARTER) {
    return 'Q2';
  }
  if (code === MatchStateAMFootball.THIRD_QUARTER) {
    return 'Q3';
  }
  if (code === MatchStateAMFootball.FOURTH_QUARTER) {
    return 'Q4';
  }
  if (code === MatchStateAMFootball.OVERTIME) {
    return 'OT';
  }
};
export const checkEndedAMfootball = (code: MatchStateAMFootball) => {
  return code === MatchStateAMFootball.ENDED;
};
// Format time trạng thái trận đấu (List) - basket ball
export const checkInProgressMatchAMFootball = (code: number) => {
  return (
    code === MatchStateAMFootball.FIRST_QUARTER ||
    code === MatchStateAMFootball.SECOND_QUARTER ||
    code === MatchStateAMFootball.THIRD_QUARTER ||
    code === MatchStateAMFootball.FOURTH_QUARTER ||
    code === MatchStateAMFootball.OVERTIME ||
    code === MatchStateAMFootball.FIRST_PAUSE ||
    code === MatchStateAMFootball.SECOND_PAUSE ||
    code === MatchStateAMFootball.THIRD_PAUSE ||
    code === MatchStateAMFootball.FOURTH_PAUSE
  );
};
// Format time trạng thái trận đấu - ghi chi tiết (details) - basket ball
export const formatMatchTimestampAMFootball = (timestamp = 0, code: number) => {
  const date = new Date(timestamp * 1000);
  const formattedTime = format(date, 'HH:mm');
  let formattedDate = format(date, 'dd/MM');
  if (!isSameYear(date, new Date())) {
    formattedDate = format(date, 'dd/MM/yy');
  }

  const matchStateLabels: { [key: number]: string } = {
    [MatchStateAMFootball.ABNORMAL]: 'Abandoned',
    [MatchStateAMFootball.ENDED]: 'FT',
    [MatchStateAMFootball.CUT_IN_HALF]: 'Cut',
    [MatchStateAMFootball.TO_BE_DETERMINED]: 'Pending',
    [MatchStateAMFootball.INTERRUPTED]: 'Interrupted',
    [MatchStateAMFootball.POSTPONED]: 'Postponed',
    [MatchStateAMFootball.CANCELED]: 'Canceled',
    [MatchStateAMFootball.FIRST_PAUSE]: 'Q1 Ended',
    [MatchStateAMFootball.SECOND_PAUSE]: 'Q2 Ended',
    [MatchStateAMFootball.THIRD_PAUSE]: 'Q3 Ended',
    [MatchStateAMFootball.FOURTH_PAUSE]: 'Q4 Ended',
    [MatchStateAMFootball.AWAITING_OT]: 'Awaiting Overtime',
    [MatchStateAMFootball.AFTER_OT]: 'After Overtime',
    [MatchStateAMFootball.OVERTIME]: 'OT',
    [MatchStateAMFootball.FIRST_QUARTER]: 'Q1',
    [MatchStateAMFootball.SECOND_QUARTER]: 'Q2',
    [MatchStateAMFootball.THIRD_QUARTER]: 'Q3',
    [MatchStateAMFootball.FOURTH_QUARTER]: 'Q4',
  };

  const label = matchStateLabels[code] || formattedTime;

  if(formattedTime === label) {
    return isToday(date) ? [label] : [formattedDate, label];
  }

  return isToday(date) ? [formattedTime, label] : [formattedDate, label];
};

export const isMatchEndAMFootball = (statusCode: number): boolean => {
  switch (statusCode) {
    case MatchStateAMFootball.AFTER_OT:
    case MatchStateAMFootball.ENDED:
    case MatchStateAMFootball.ABNORMAL:
    case MatchStateAMFootball.INTERRUPTED:
    case MatchStateAMFootball.CANCELED:
    case MatchStateAMFootball.POSTPONED:
    case MatchStateAMFootball.CUT_IN_HALF:
    case MatchStateAMFootball.TO_BE_DETERMINED:
      return true;
    default:
      return false;
  }
};

export function isMatchHaveStatAMFootball(matchStatusId: number): boolean {
  return [
    MatchStateAMFootball.ABNORMAL,
    MatchStateAMFootball.FIRST_QUARTER,
    MatchStateAMFootball.FIRST_PAUSE,
    MatchStateAMFootball.SECOND_QUARTER,
    MatchStateAMFootball.SECOND_PAUSE,
    MatchStateAMFootball.THIRD_QUARTER,
    MatchStateAMFootball.THIRD_PAUSE,
    MatchStateAMFootball.FOURTH_QUARTER,
    MatchStateAMFootball.FOURTH_PAUSE,
    MatchStateAMFootball.ENDED,
    MatchStateAMFootball.AWAITING_OT,
    MatchStateAMFootball.OVERTIME,
    MatchStateAMFootball.AFTER_OT,
    // MatchStateAMFootball.POSTPONED,
    // MatchStateAMFootball.DELAYED,
    // MatchStateAMFootball.CANCELED,
    MatchStateAMFootball.INTERRUPTED,
    MatchStateAMFootball.CUT_IN_HALF,
    // MatchStateAMFootball.TO_BE_DETERMINED,
  ].includes(matchStatusId);
}

export function isMatchInprogressAMFootball(matchStatusId: number): boolean {
  return [
    MatchStateAMFootball.FIRST_QUARTER,
    MatchStateAMFootball.FIRST_PAUSE,
    MatchStateAMFootball.SECOND_QUARTER,
    MatchStateAMFootball.SECOND_PAUSE,
    MatchStateAMFootball.THIRD_QUARTER,
    MatchStateAMFootball.THIRD_PAUSE,
    MatchStateAMFootball.FOURTH_QUARTER,
    MatchStateAMFootball.FOURTH_PAUSE,
    MatchStateAMFootball.AWAITING_OT,
    MatchStateAMFootball.OVERTIME,
  ].includes(matchStatusId);
}

export function otherStatusMatchAMFootball(matchStatusId: number): boolean {
  return [
    MatchStateAMFootball.DELAYED,
    MatchStateAMFootball.POSTPONED,
    MatchStateAMFootball.CANCELED,
    MatchStateAMFootball.INTERRUPTED,
    MatchStateAMFootball.TO_BE_DETERMINED,
    MatchStateAMFootball.ABNORMAL,
    MatchStateAMFootball.AFTER_OT,
    MatchStateAMFootball.AWAITING_OT,
    MatchStateAMFootball.OVERTIME,
  ].includes(matchStatusId);
}

function generateDisplayStringAMFootball(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (isMatchInprogressAMFootball(status.code)) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 10 && status.code < 100) {
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

export function genDisplayedTimeAMFootball(
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
  const formattedTime = formatMatchTimestampAMFootball(timestamp, status.code);
  const formattedDate = formatMatchDate(matchDate, now);

  if (!status || status.code === -1) {
    return ['', formattedDate, ''];
  }

  return generateDisplayStringAMFootball(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

export const handleIncidentDataAMF = (mainArray: any = []) => {
  if (mainArray.length == 0) return {}
  let result: any = {
    ft: [],
  };
  const getKey = (type: number, extra: number) => {
    if ((type === 1 && extra === 0) || type === 7) {
      return "bg";
    }
    else if (type === 1 && extra === 100) {
      return "ft";
    }
    else if (type == 1) {
      return "q" + extra;
    }
  };

  let pType = mainArray[0].type;
  let pExtra = mainArray[0].extra;

  const finalItem = mainArray.find((it: any) => it.type == 2) || {};

  for (let i = 0; i < mainArray.length; i++) {
    const type = mainArray[i].type;
    const extra = mainArray[i].extra;

    let key: string | any = "";

    if (type == 2 && mainArray[i].type) {
      key = getKey(pType, pExtra);
    } else {
      key = getKey(type, extra);
    }

    if (result[key] === undefined) {
      result[key] = [];
    }

    result[key].push(mainArray[i]);

    if (type != 2) {
      pType = type;
      pExtra = extra;
    }
  }
  result.ft[0] = { ...result.ft?.[0], homeScore: finalItem?.homeScore, awayScore: finalItem?.awayScore }
  return result;
}
