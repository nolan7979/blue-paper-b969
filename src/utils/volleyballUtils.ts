import { format, isSameYear, isToday } from 'date-fns';
import { SportEventDtoWithStat, StatusDto } from "@/constant/interface";
import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, generateUpcomingMatchString, handleFutureMatchDateComparisons, isMatchOnDate, normalizeTimestamp } from "@/utils";
import vi from '~/lang/vi';
import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import { isSameDay } from 'date-fns';
import { mapMatchPriority } from '@/constant/matchPriority';

export enum MatchStateVolleyball {
  ABNORMAL = 0,
  NOT_STARTED = 1,
  FIRST_SET = 432,
  SECOND_SET = 434,
  THIRD_SET = 436,
  FOURTH_SET = 438,
  FIFTH_SET = 440,
  ENDED = 100,
  POSTPONED = 14,
  DELAYED = 15,
  CANCELED = 16,
  INTERRUPTED = 17,
  CUT_IN_HALF = 19,
  TO_BE_DETERMINED = 99
}

export function isMatchHaveStatVlb(matchStatusId: number): boolean {
  return [
    MatchStateVolleyball.ABNORMAL,
    MatchStateVolleyball.FIRST_SET,
    MatchStateVolleyball.SECOND_SET,
    MatchStateVolleyball.THIRD_SET,
    MatchStateVolleyball.FOURTH_SET,
    MatchStateVolleyball.FIFTH_SET,
    MatchStateVolleyball.ENDED,
    MatchStateVolleyball.INTERRUPTED,
    MatchStateVolleyball.CUT_IN_HALF,
  ].includes(matchStatusId);
}

export function isMatchInprogressVlb(matchStatusId: number): boolean {
  return [MatchStateVolleyball.FIRST_SET, MatchStateVolleyball.SECOND_SET, MatchStateVolleyball.THIRD_SET, MatchStateVolleyball.FOURTH_SET, MatchStateVolleyball.FIFTH_SET].includes(matchStatusId)
}

export function isMatchEndedVlb(matchStatusId: number): boolean {
  return [MatchStateVolleyball.ENDED].includes(matchStatusId);
}

export function isMatchPendingVlb(matchStatusId: number): boolean {
  return [
    MatchStateVolleyball.INTERRUPTED,
    MatchStateVolleyball.POSTPONED,
    MatchStateVolleyball.CANCELED,
    MatchStateVolleyball.DELAYED,
    MatchStateVolleyball.CUT_IN_HALF,
    MatchStateVolleyball.ABNORMAL,
    MatchStateVolleyball.NOT_STARTED,
  ].includes(matchStatusId);
}

function generateDisplayStringVlb(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code >= 432 && status.code < 440) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 10 && status.code <= 15) {
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

export function genDisplayedTimeVlb(
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

  return generateDisplayStringVlb(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

export const filterVolleyballMatches = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string,
): SportEventDtoWithStat[] => {
  const today = new Date();

  const matchEndedStates = [
    MatchStateVolleyball.ABNORMAL,
    MatchStateVolleyball.INTERRUPTED,
    MatchStateVolleyball.CANCELED,
    MatchStateVolleyball.CUT_IN_HALF,
    MatchStateVolleyball.TO_BE_DETERMINED,
    MatchStateVolleyball.POSTPONED,
    MatchStateVolleyball.DELAYED,
    MatchStateVolleyball.ENDED,
  ]

  return matches.filter((match) => {
    const priority = match?.uniqueTournament?.priority ? parseInt(match?.uniqueTournament?.priority.toString(), 10) : 0;
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.uniqueTournament?.priority && priority < mapMatchPriority[SPORT.VOLLEYBALL];
    const matchEnded = isMatchEndedVlb(match.status?.code);
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

    return true
  });
};

export const formatMatchTimestampVolleyball = (
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

    const statusMap: { [key: string]: [string, string] } = {
      NOT_STARTED: isToday(date)
        ? [formattedTime, isByTime ? formattedTime : '']
        : [formattedDate, formattedTime],

      INTERRUPTED: isToday(date)
        ? [formattedTime, 'Interrupted']
        : [formattedDate, 'Interrupted'],
      POSTPONED: isToday(date)
        ? [formattedTime, 'Postponed']
        : [formattedDate, 'Postponed'],
      CANCELED: isToday(date)
        ? [formattedTime, 'Canceled']
        : [formattedDate, 'Canceled'],
      ENDED: isToday(date) ? [formattedTime, 'FT'] : [formattedDate, 'FT'],
      DELAYED: isToday(date)
        ? [formattedTime, 'Delayed']
        : [formattedDate, 'Delayed'],
      FIRST_SET: [formattedTime, 'S1'],
      SECOND_SET: [formattedTime, 'S2'],
      THIRD_SET: [formattedTime, 'S3'],
      FOURTH_SET: [formattedTime, 'S4'],
      FIFTH_SET: [formattedTime, 'S5'],
    };

    let statusType = status.type;
    if (status.code == MatchStateVolleyball.CANCELED) {
      statusType = 'CANCELED';
    } else if (status.code == MatchStateVolleyball.INTERRUPTED) {
      statusType = 'INTERRUPTED';
    } else if (status.code == MatchStateVolleyball.ENDED) {
      statusType = 'ENDED';
    } else if (status.code == MatchStateVolleyball.DELAYED) {
      statusType = 'DELAYED';
    } else if (status.code == MatchStateVolleyball.POSTPONED) {
      statusType = 'POSTPONED';
    } else if (status.code == MatchStateVolleyball.CUT_IN_HALF) {
      statusType = 'CUT_IN_HALF';
    } else if (status.code == MatchStateVolleyball.TO_BE_DETERMINED) {
      statusType = 'TO_BE_DETERMINED';
    } else if (status.code == MatchStateVolleyball.ABNORMAL) {
      statusType = 'ABNORMAL';
    }

    return statusMap[statusType] || [formattedDate, formattedTime];
  } catch (err) {
    console.error(err);
    return ['', ''];
  }
};

export function isMatchNotStartedVlb(matchStatusId: number): boolean {
  return (
    matchStatusId === MatchStateVolleyball.NOT_STARTED ||
    matchStatusId === MatchStateVolleyball.ABNORMAL ||
    matchStatusId === MatchStateVolleyball.INTERRUPTED ||
    matchStatusId === MatchStateVolleyball.CANCELED ||
    matchStatusId === MatchStateVolleyball.CUT_IN_HALF ||
    matchStatusId === MatchStateVolleyball.POSTPONED
  );
}

export const convertStatusCodeVolleyball = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: ''
        }
      };
    case MatchStateVolleyball.ABNORMAL:
      return {
        code: MatchStateVolleyball.ABNORMAL,
        description: 'ABNORMAL',
        type: 'ABNORMAL'
      };
    case MatchStateVolleyball.NOT_STARTED:
      return {
        code: MatchStateVolleyball.NOT_STARTED,
        description: 'NOT_STARTED',
        type: 'NOT_STARTED'
      };
    case MatchStateVolleyball.FIRST_SET:
      return {
        code: MatchStateVolleyball.FIRST_SET,
        description: 'FIRST_SET',
        type: 'FIRST_SET'
      };
    case MatchStateVolleyball.SECOND_SET:
      return {
        code: MatchStateVolleyball.SECOND_SET,
        description: 'SECOND_SET',
        type: 'SECOND_SET'
      };
    case MatchStateVolleyball.THIRD_SET:
      return {
        code: MatchStateVolleyball.THIRD_SET,
        description: 'THIRD_SET',
        type: 'THIRD_SET'
      };
    case MatchStateVolleyball.FOURTH_SET:
      return {
        code: MatchStateVolleyball.FOURTH_SET,
        description: 'FOURTH_SET',
        type: 'FOURTH_SET'
      };
    case MatchStateVolleyball.FIFTH_SET:
      return {
        code: MatchStateVolleyball.FIFTH_SET,
        description: 'FIFTH_SET',
        type: 'FIFTH_SET'
      };
    case MatchStateVolleyball.ENDED:
      return {
        code: MatchStateVolleyball.ENDED,
        description: 'ENDED',
        type: 'ENDED'
      };
    case MatchStateVolleyball.POSTPONED:
      return {
        code: MatchStateVolleyball.POSTPONED,
        description: 'POSTPONED',
        type: 'POSTPONED'
      };
    case MatchStateVolleyball.DELAYED:
      return {
        code: MatchStateVolleyball.DELAYED,
        description: 'DELAYED',
        type: 'DELAYED'
      };
    case MatchStateVolleyball.CANCELED:
      return {
        code: MatchStateVolleyball.CANCELED,
        description: 'CANCELED',
        type: 'CANCELED'
      };
    case MatchStateVolleyball.INTERRUPTED:
      return {
        code: MatchStateVolleyball.INTERRUPTED,
        description: 'INTERRUPTED',
        type: 'INTERRUPTED'
      };
    case MatchStateVolleyball.CUT_IN_HALF:
      return {
        code: MatchStateVolleyball.CUT_IN_HALF,
        description: 'Cut in half',
        type: 'Cut in half'
      };
    case MatchStateVolleyball.TO_BE_DETERMINED:
      return {
        code: MatchStateVolleyball.TO_BE_DETERMINED,
        description: 'To be determined',
        type: 'To be determined'
      };

    default:
      return {
        code: -1,
        type: '',
        description: ''
      };
  }
};


export const parseMatchDataVolleyball = (
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
        priority: Number(matchDetails[4]),
        category: {
          id: matchDetails[5],
          name: matchDetails[6]
        },
        country: {
          id: matchDetails[7],
          name: matchDetails[8]
        }
      },
      status: {
        code: Number(matchDetails[9]),
        description: convertStatusCodeVolleyball(Number(matchDetails[9]))?.description,
        type: convertStatusCodeVolleyball(Number(matchDetails[9]))?.type
      },
      homeTeam: {
        id: matchDetails[12],
        name: matchDetails[13],
        shortName: matchDetails[14],
        gender: matchDetails[15]
      },
      awayTeam: {
        id: matchDetails[16],
        name: matchDetails[17],
        shortName: matchDetails[18],
        gender: matchDetails[19]
      },
      scores: JSON.parse(matchDetails[20]),
      winnerCode: Number(matchDetails[27]),
      mlive: Number(matchDetails[17]),
      serve: matchDetails[21],
      slug: matchDetails[22],
      season_id: matchDetails[23],
      updated_at: Number(matchDetails[25])
    };
  });
  return matches;
};

