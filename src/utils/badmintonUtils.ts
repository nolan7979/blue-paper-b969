import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import {
  MatchStateTennis,
  SportEventDtoWithStat,
  StatusDto,
} from '@/constant/interface';
import { format, isSameDay, isSameYear, isToday } from 'date-fns';

import { mapMatchPriority } from '@/constant/matchPriority';
import {
  adjustMatchDateForTimezone,
  calculateMinuteLive,
  formatMatchDate,
  formatMinuteLive,
  generateUpcomingMatchString,
  handleFutureMatchDateComparisons,
  isMatchOnDate,
  normalizeTimestamp
} from '@/utils';
import en from '~/lang/en';

export enum MatchBadmintonState {
  ABNORMAL = 0,
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
  ENDED = 100,
  WALKOVER = 20,
  RETIRED21 = 21,
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
  SUSPENSION = 18,
  CUT_IN_HALF = 19,
  TO_BE_DETERMINED = 99,
}

export const formatMatchTimestampBadminton = (
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
        ? [formattedTime, isByTime ? formattedTime : '-']
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
      ENDED: isToday(date)
        ? [formattedTime, 'FT']
        : [formattedDate, formattedTime],
      DELAYED: isToday(date)
        ? [formattedTime, 'Delayed']
        : [formattedDate, 'Delayed'],
      IN_PROGRESS: isToday(date)
        ? [formattedTime, 'In Progress']
        : [formattedDate, 'In Progress'],
      FIRST_SET: [formattedTime, 'S1'],
      SECOND_SET: [formattedTime, 'S2'],
      THIRD_SET: [formattedTime, 'S3'],
      FOURTH_SET: [formattedTime, 'S4'],
      WALKOVER: [formattedTime, 'WALKOVER'],
      WALKOVER1: [formattedTime, 'WALKOVER'],
      WALKOVER2: [formattedTime, 'WALKOVER'],
      RETIRED1: [formattedTime, 'RETIRED'],
      RETIRED2: [formattedTime, 'RETIRED'],
      RETIRED21: [formattedTime, 'RETIRED'],
    };

    let statusType = status.type;
    if (status.code == MatchStateTennis.Canceled) {
      statusType = 'CANCELED';
    } else if (status.code == MatchStateTennis.Interrupted) {
      statusType = 'INTERRUPTED';
    } else if (status.code == MatchStateTennis.Ended) {
      statusType = 'ENDED';
    } else if (status.code == MatchStateTennis.Delayed) {
      statusType = 'DELAYED';
    } else if (status.code == MatchStateTennis.Postponed) {
      statusType = 'POSTPONED';
    } else if (status.code == MatchStateTennis.InProgress) {
      statusType = 'IN_PROGRESS';
    }

    return statusMap[statusType] || [formattedDate, formattedTime];
  } catch (err) {
    console.error(err);
    return ['', ''];
  }
};

export function isMatchInprogressBmt(matchStatusId: number): boolean {
  return [
    MatchBadmintonState.IN_PROGRESS,
    MatchBadmintonState.FIRST_SET,
    MatchBadmintonState.FIRST_PAUSE,
    MatchBadmintonState.SECOND_SET,
    MatchBadmintonState.SECOND_PAUSE,
    MatchBadmintonState.THIRD_SET,
    MatchBadmintonState.THIRD_PAUSE,
    MatchBadmintonState.FOURTH_SET,
    MatchBadmintonState.FOURTH_PAUSE,
    MatchBadmintonState.FIFTH_SET,
    MatchBadmintonState.WALKOVER,
    MatchBadmintonState.WALKOVER1,
    MatchBadmintonState.WALKOVER2,
  ].includes(matchStatusId)
}

export const convertBmtStatusCode = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: '',
        },
      };
    case MatchBadmintonState.ABNORMAL:
      return {
        code: MatchBadmintonState.ABNORMAL,
        description: 'ABNORMAL',
        type: 'ABNORMAL',
      };
    case MatchBadmintonState.NOT_STARTED:
      return {
        code: MatchBadmintonState.NOT_STARTED,
        description: 'NOT_STARTED',
        type: 'NOT_STARTED',
      };
    case MatchBadmintonState.IN_PROGRESS:
      return {
        code: MatchBadmintonState.IN_PROGRESS,
        description: 'IN_PROGRESS',
        type: 'IN_PROGRESS',
      };
    case MatchBadmintonState.FIRST_SET:
      return {
        code: MatchBadmintonState.FIRST_SET,
        description: 'FIRST_SET',
        type: 'FIRST_SET',
      };
    case MatchBadmintonState.FIRST_PAUSE:
      return {
        code: MatchBadmintonState.FIRST_PAUSE,
        description: 'FIRST_PAUSE',
        type: 'FIRST_PAUSE',
      };
    case MatchBadmintonState.SECOND_SET:
      return {
        code: MatchBadmintonState.SECOND_SET,
        description: 'SECOND_SET',
        type: 'SECOND_SET',
      };
    case MatchBadmintonState.SECOND_PAUSE:
      return {
        code: MatchBadmintonState.SECOND_PAUSE,
        description: 'SECOND_PAUSE',
        type: 'SECOND_PAUSE',
      };
    case MatchBadmintonState.THIRD_SET:
      return {
        code: MatchBadmintonState.THIRD_SET,
        description: 'THIRD_SET',
        type: 'THIRD_SET',
      };
    case MatchBadmintonState.THIRD_PAUSE:
      return {
        code: MatchBadmintonState.THIRD_PAUSE,
        description: 'THIRD_PAUSE',
        type: 'THIRD_PAUSE',
      };
    case MatchBadmintonState.FOURTH_SET:
      return {
        code: MatchBadmintonState.FOURTH_SET,
        description: 'FOURTH_SET',
        type: 'FOURTH_SET',
      };
    case MatchBadmintonState.FOURTH_PAUSE:
      return {
        code: MatchBadmintonState.FOURTH_PAUSE,
        description: 'FOURTH_PAUSE',
        type: 'FOURTH_PAUSE',
      };
    case MatchBadmintonState.FIFTH_SET:
      return {
        code: MatchBadmintonState.FIFTH_SET,
        description: 'FIFTH_SET',
        type: 'FIFTH_SET',
      };
    case MatchBadmintonState.ENDED:
      return {
        code: MatchBadmintonState.ENDED,
        description: 'ENDED',
        type: 'ENDED',
      };
    case MatchBadmintonState.WALKOVER:
      return {
        code: MatchBadmintonState.WALKOVER,
        description: 'WALKOVER',
        type: 'WALKOVER',
      };
    case MatchBadmintonState.RETIRED21:
      return {
        code: MatchBadmintonState.RETIRED21,
        description: 'RETIRED21',
        type: 'RETIRED21',
      };
    case MatchBadmintonState.WALKOVER1:
      return {
        code: MatchBadmintonState.WALKOVER1,
        description: 'WALKOVER1',
        type: 'WALKOVER1',
      };
    case MatchBadmintonState.WALKOVER2:
      return {
        code: MatchBadmintonState.WALKOVER2,
        description: 'WALKOVER',
        type: 'WALKOVER',
      };
    case MatchBadmintonState.RETIRED1:
      return {
        code: MatchBadmintonState.RETIRED1,
        description: 'RETIRED1',
        type: 'RETIRED1',
      };
    case MatchBadmintonState.RETIRED2:
      return {
        code: MatchBadmintonState.RETIRED2,
        description: 'RETIRED2',
        type: 'RETIRED2',
      };
    case MatchBadmintonState.DEFAULTED1:
      return {
        code: MatchBadmintonState.DEFAULTED1,
        description: 'DEFAULTED1',
        type: 'DEFAULTED1',
      };
    case MatchBadmintonState.DEFAULTED2:
      return {
        code: MatchBadmintonState.DEFAULTED2,
        description: 'DEFAULTED2',
        type: 'DEFAULTED2',
      };
    case MatchBadmintonState.POSTPONED:
      return {
        code: MatchBadmintonState.POSTPONED,
        description: 'POSTPONED',
        type: 'POSTPONED',
      };
    case MatchBadmintonState.DELAYED:
      return {
        code: MatchBadmintonState.DELAYED,
        description: 'DELAYED',
        type: 'DELAYED',
      };
    case MatchBadmintonState.CANCELED:
      return {
        code: MatchBadmintonState.CANCELED,
        description: 'CANCELED',
        type: 'CANCELED',
      };
    case MatchBadmintonState.INTERRUPTED:
      return {
        code: MatchBadmintonState.INTERRUPTED,
        description: 'INTERRUPTED',
        type: 'INTERRUPTED',
      };
    case MatchBadmintonState.CUT_IN_HALF:
      return {
        code: 19,
        description: 'Cut in half',
        type: 'Cut in half',
      };
    case MatchBadmintonState.TO_BE_DETERMINED:
      return {
        code: 99,
        description: 'To be determined',
        type: 'To be determined',
      };
    default:
      return {
        code: -1,
        type: '',
        description: '',
      };
  }
};

export const parseMatchDataArrayBadminton = (
  matchDataString: string | null | undefined
): any[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }
  const matchDataArray = matchDataString?.split('!!');

  const matches = matchDataArray.map((matchString) => {
    const matchDetails = matchString.split('^');
    const sub_ids_home = matchDetails[15]?.length
      ? matchDetails[15].split('~')
      : [];
    const sub_ids_away = matchDetails[20]?.length
      ? matchDetails[20].split('~')
      : [];
    return {
      id: matchDetails[0],
      startTimestamp: Number(matchDetails[1]),
      uniqueTournament: {
        id: matchDetails[2],
        priority: Number(matchDetails[3]),
        name: matchDetails[4],
        slug: matchDetails[5],
        category: {
          id: matchDetails[6],
          name: matchDetails[7],
        },
      },
      status: convertBmtStatusCode(Number(matchDetails[8])),
      homeTeam: {
        id: matchDetails[11],
        name: matchDetails[12],
        slug: matchDetails[13],
        national: matchDetails[14],
        sub_ids: sub_ids_home,
      },
      awayTeam: {
        id: matchDetails[16],
        name: matchDetails[17],
        slug: matchDetails[18],
        national: matchDetails[19],
        sub_ids: sub_ids_away,
      },
      scores: JSON.parse(matchDetails[21] || '[]'),
      serve: matchDetails[22],
      slug: matchDetails[23],
      season_id: matchDetails[24],
      venue: {
        name: matchDetails[25],
        capacity: matchDetails[26],
        city: matchDetails[27],
      },
    };
  });

  return matches;
};

export function isMatchHaveStatBadminton(matchStatusId: number): boolean {
  return [
    MatchBadmintonState.ABNORMAL,
    MatchBadmintonState.FIRST_SET,
    MatchBadmintonState.FIRST_PAUSE,
    MatchBadmintonState.SECOND_SET,
    MatchBadmintonState.SECOND_PAUSE,
    MatchBadmintonState.THIRD_SET,
    MatchBadmintonState.THIRD_PAUSE,
    MatchBadmintonState.FOURTH_SET,
    MatchBadmintonState.FOURTH_PAUSE,
    MatchBadmintonState.FIFTH_SET,
    MatchBadmintonState.ENDED,
    MatchBadmintonState.WALKOVER,
    MatchBadmintonState.RETIRED21,
    MatchBadmintonState.RETIRED1,
    MatchBadmintonState.RETIRED2,
    MatchBadmintonState.DEFAULTED1,
    MatchBadmintonState.DEFAULTED2,
    MatchBadmintonState.WALKOVER1,
    MatchBadmintonState.WALKOVER2,
    MatchBadmintonState.POSTPONED,
    // MatchBadmintonState.DELAYED,
    // MatchBadmintonState.CANCELED,
    MatchBadmintonState.INTERRUPTED,
    MatchBadmintonState.SUSPENSION,
    MatchBadmintonState.CUT_IN_HALF,
    MatchBadmintonState.TO_BE_DETERMINED,
  ].includes(matchStatusId);
}

export function isMatchBmtLive(matchStatusId: number): boolean {
  return [
    MatchBadmintonState.FIRST_SET,
    MatchBadmintonState.FIRST_PAUSE,
    MatchBadmintonState.SECOND_SET,
    MatchBadmintonState.SECOND_PAUSE,
    MatchBadmintonState.THIRD_SET,
    MatchBadmintonState.THIRD_PAUSE,
    MatchBadmintonState.FOURTH_SET,
    MatchBadmintonState.FOURTH_PAUSE,
    MatchBadmintonState.FIFTH_SET,
  ].includes(matchStatusId);
}

export function isMatchesEndedBmt(matchStatusId: number): boolean {
  return [MatchBadmintonState.ENDED, MatchBadmintonState.CANCELED,
  MatchBadmintonState.SUSPENSION, MatchBadmintonState.INTERRUPTED,
  MatchBadmintonState.WALKOVER, MatchBadmintonState.RETIRED21,
  MatchBadmintonState.WALKOVER1, MatchBadmintonState.WALKOVER2,
  MatchBadmintonState.RETIRED1, MatchBadmintonState.RETIRED2,
  MatchBadmintonState.DEFAULTED1, MatchBadmintonState.DEFAULTED2,
  MatchBadmintonState.CUT_IN_HALF, MatchBadmintonState.POSTPONED,
  MatchBadmintonState.TO_BE_DETERMINED
  ].includes(matchStatusId);
}

export function isMatchNotStartedBmt(matchStatusId: number): boolean {
  return [MatchBadmintonState.NOT_STARTED, MatchBadmintonState.ABNORMAL, MatchBadmintonState.INTERRUPTED, MatchBadmintonState.CANCELED, MatchBadmintonState.CUT_IN_HALF, MatchBadmintonState.TO_BE_DETERMINED].includes(matchStatusId);
}

export function isMatchCanceledBmt(matchStatusId: number): boolean {
  return [MatchBadmintonState.CANCELED, MatchBadmintonState.SUSPENSION, MatchBadmintonState.INTERRUPTED, MatchBadmintonState.CUT_IN_HALF, MatchBadmintonState.TO_BE_DETERMINED, MatchBadmintonState.WALKOVER, MatchBadmintonState.WALKOVER1, MatchBadmintonState.WALKOVER2, MatchBadmintonState.DEFAULTED1, MatchBadmintonState.DEFAULTED2].includes(matchStatusId);
}

export const filterMatchesBadminton = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string,
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates = [
    MatchBadmintonState.CANCELED,
    MatchBadmintonState.SUSPENSION,
    MatchBadmintonState.INTERRUPTED,
    MatchBadmintonState.WALKOVER,
    MatchBadmintonState.RETIRED21,
    MatchBadmintonState.WALKOVER1,
    MatchBadmintonState.WALKOVER2,
    MatchBadmintonState.RETIRED1,
    MatchBadmintonState.RETIRED2,
    MatchBadmintonState.DEFAULTED1,
    MatchBadmintonState.DEFAULTED2,
    MatchBadmintonState.CUT_IN_HALF,
    MatchBadmintonState.TO_BE_DETERMINED,
    MatchBadmintonState.FIRST_PAUSE,
    MatchBadmintonState.SECOND_PAUSE,
    MatchBadmintonState.THIRD_PAUSE,
    MatchBadmintonState.FOURTH_PAUSE,
    MatchBadmintonState.ABNORMAL,
  ]

  return matches.filter((match: any) => {
    const priority = parseInt(match?.uniqueTournament?.priority.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.tournament?.priority && priority < mapMatchPriority[SPORT.BADMINTON];
    const matchEnded = isMatchesEndedBmt(match.status?.code);
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
const generateDisplayStringBadminton = (
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) => {
  if (status.code >= 2 && status.code < 10) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 10) {
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
};

export const genDisplayedTimeBadminton = (
  timestamp: number,
  status: StatusDto,
  i18n: any = en,
  startTime?: number
) => {
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

  return generateDisplayStringBadminton(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
};


export const renderRoundOfMatchBadminton = (status: StatusDto) => {
  switch (status.code) {
    case MatchBadmintonState.FIRST_SET:
      return 'S1';
    case MatchBadmintonState.FIRST_PAUSE:
      return 'S1 ENDED';
    case MatchBadmintonState.SECOND_SET:
      return 'S2';
    case MatchBadmintonState.SECOND_PAUSE:
      return 'S2 ENDED';
    case MatchBadmintonState.THIRD_SET:
      return 'S3';
    case MatchBadmintonState.THIRD_PAUSE:
      return 'S3 ENDED';
    case MatchBadmintonState.FOURTH_SET:
      return 'S4';
    case MatchBadmintonState.FOURTH_PAUSE:
      return 'S4 ENDED';
    case MatchBadmintonState.FIFTH_SET:
      return 'S5';
    case MatchBadmintonState.ABNORMAL:
      return 'ABNORMAL';
    case MatchBadmintonState.WALKOVER:
    case MatchBadmintonState.WALKOVER1:
    case MatchBadmintonState.WALKOVER2:
      return 'WALKOVER';
    case MatchBadmintonState.RETIRED1:
    case MatchBadmintonState.RETIRED2:
    case MatchBadmintonState.RETIRED21:
      return 'RETIRED';
    case MatchBadmintonState.CANCELED:
      return 'CANCELED';
    case MatchBadmintonState.INTERRUPTED:
      return 'INTERRUPTED';
    case MatchBadmintonState.CUT_IN_HALF:
      return 'CUT IN HALF';
    case MatchBadmintonState.TO_BE_DETERMINED:
      return 'TO BE DETERMINED';
    case MatchBadmintonState.ENDED:
      return `FT`;
    default:
      return '';
  }
}