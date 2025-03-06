import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import { MatchStateTennis, SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { format, isBefore, isSameDay, isSameYear, isToday } from 'date-fns';

import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, generateUpcomingMatchString, handleFutureMatchDateComparisons, isMatchOnDate, normalizeTimestamp } from '@/utils';
import { mapMatchPriority } from '@/constant/matchPriority';
import { vi } from 'date-fns/locale';

export enum MatchRoundTennis {
  p1 = 'p1',
  p2 = 'p2',
  p3 = 'p3',
  p4 = 'p4',
  p5 = 'p5',
}

export function isMatchesEndedTennis(matchStatusId: number): boolean {
  return [MatchStateTennis.Ended,
    MatchStateTennis.Abandoned,
    MatchStateTennis.Interrupted,
    MatchStateTennis.Canceled,
    MatchStateTennis.CutInHalf,
    MatchStateTennis.Postponed,
    MatchStateTennis.Retired,
    MatchStateTennis.Retired1,
    MatchStateTennis.Retired2,
    MatchStateTennis.Walkover,
    MatchStateTennis.Walkover1,
    MatchStateTennis.Walkover2,].includes(matchStatusId);
}

export const filterMatchesTennis = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string,
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates = [
    MatchStateTennis.Abandoned,
    MatchStateTennis.Interrupted,
    MatchStateTennis.Canceled,
    MatchStateTennis.CutInHalf,
    MatchStateTennis.Postponed,
    MatchStateTennis.Retired,
    MatchStateTennis.Retired1,
    MatchStateTennis.Retired2,
    MatchStateTennis.Walkover,
    MatchStateTennis.Walkover1,
    MatchStateTennis.Walkover2,
  ]

  return matches.filter((match) => {
    const priority = parseInt(match?.tournament?.priority.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.tournament?.priority && priority < mapMatchPriority[SPORT.TENNIS];
    const matchEnded = isMatchesEndedTennis(match.status?.code);
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

export const isMatchNotStartedTennis = (matchStatusId: number): boolean => {
  return (
    matchStatusId === MatchStateTennis.NotStarted ||
    matchStatusId === MatchStateTennis.Abandoned ||
    matchStatusId === MatchStateTennis.Interrupted ||
    matchStatusId === MatchStateTennis.Canceled ||
    matchStatusId === MatchStateTennis.CutInHalf ||
    matchStatusId === MatchStateTennis.Postponed ||
    matchStatusId === MatchStateTennis.ToBeDetermined
  );
};
export function isMatchLiveTennis(matchStatusId: number): boolean {
  return [
    MatchStateTennis.FirstSet,
    MatchStateTennis.SecondSet,
    MatchStateTennis.FourthSet,
    MatchStateTennis.FifthSet,
    MatchStateTennis.InProgress,
    MatchStateTennis.ThirdSet,
  ].includes(matchStatusId);
}

export const formatMatchTimestampTennis = (
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
      ENDED: isToday(date)
        ? [formattedTime, 'FT']
        : [formattedDate, formattedTime],
      DELAYED: isToday(date)
        ? [formattedTime, 'Delayed']
        : [formattedDate, 'Delayed'],
      ABNORMAL: isToday(date) ? [formattedTime, 'Abnormal'] : [formattedDate, 'Abnormal'],
      TO_BE_DETERMIN: isToday(date) ? [formattedTime, 'pending'] : [formattedDate, 'pending'],
      IN_PROGRESS: isToday(date)
        ? [formattedTime, 'In Progress']
        : [formattedDate, 'In Progress'],
      FIRST_SET: [formattedTime, 'S1'],
      SECOND_SET: [formattedTime, 'S2'],
      THIRD_SET: [formattedTime, 'S3'],
      FOURTH_SET: [formattedTime, 'S4'],
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
    }else if(status.code == MatchStateTennis.Abandoned){
      statusType = 'ABNORMAL';
    }else if(status.code == MatchStateTennis.ToBeDetermined){
      statusType = 'TO_BE_DETERMIN'
    }

    return statusMap[statusType] || [formattedDate, formattedTime];
  } catch (err) {
    console.error(err);
    return ['', ''];
  }
};

export function isMatchHaveStatTennis(matchStatusId: number): boolean {
  return [
    MatchStateTennis.Ended,
    MatchStateTennis.FirstSet,
    MatchStateTennis.FifthSet,
    MatchStateTennis.FourthSet,
    MatchStateTennis.Ended,
    MatchStateTennis.InProgress,
    MatchStateTennis.SecondSet,
    MatchStateTennis.ThirdSet,
    MatchStateTennis.Retired,
    MatchStateTennis.Retired1,
    MatchStateTennis.Retired2,
    MatchStateTennis.Walkover,
    MatchStateTennis.Walkover1,
    MatchStateTennis.Walkover2,
  ].includes(matchStatusId);
}

export const convertStatusCode = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: '',
        },
      };
    case MatchStateTennis.Abandoned:
      return {
        code: 0,
        description: 'ABNORMAL',
        type: 'ABNORMAL',
      };
    case MatchStateTennis.NotStarted:
      return {
        code: 1,
        description: 'NOT_STARTED',
        type: 'NOT_STARTED',
      };
    case MatchStateTennis.InProgress:
      return {
        code: 3,
        description: 'IN_PROGRESS',
        type: 'IN_PROGRESS',
      };

    case MatchStateTennis.FirstSet:
      return {
        code: 51,
        description: 'FIRST_SET',
        type: 'FIRST_SET',
      };
    case MatchStateTennis.SecondSet:
      return {
        code: 52,
        description: 'SECOND_SET',
        type: 'SECOND_SET',
      };
    case MatchStateTennis.ThirdSet:
      return {
        code: 53,
        description: 'THIRD_SET',
        type: 'THIRD_SET',
      };
    case MatchStateTennis.FourthSet:
      return {
        code: 54,
        description: 'FOURTH_SET',
        type: 'FOURTH_SET',
      };
    case MatchStateTennis.FifthSet:
      return {
        code: 55,
        description: 'FIFTH_SET',
        type: 'FIFTH_SET',
      };
    case MatchStateTennis.Ended:
      return {
        code: 100,
        description: 'ENDED',
        type: 'ENDED',
      };
    case MatchStateTennis.Walkover:
      return {
        code: 20,
        description: 'WALKOVER',
        type: 'WALKOVER',
      };
    case MatchStateTennis.Retired:
      return {
        code: 21,
        description: 'RETIRED',
        type: 'RETIRED',
      };
    case MatchStateTennis.Walkover1:
      return {
        code: 22,
        description: 'WALKOVER1',
        type: 'WALKOVER1',
      };
    case MatchStateTennis.Walkover2:
      return {
        code: 23,
        description: 'WALKOVER2',
        type: 'WALKOVER2',
      };
    case MatchStateTennis.Retired1:
      return {
        code: 24,
        description: 'RETIRED1',
        type: 'RETIRED1',
      };
    case MatchStateTennis.Retired2:
      return {
        code: 25,
        description: 'RETIRED2',
        type: 'RETIRED2',
      };
    case MatchStateTennis.Defaulted1:
      return {
        code: 26,
        description: 'DEFAULTED1',
        type: 'DEFAULTED1',
      };
    case MatchStateTennis.Defaulted2:
      return {
        code: 27,
        description: 'DEFAULTED2',
        type: 'DEFAULTED2',
      };
    case MatchStateTennis.Postponed:
      return {
        code: 14,
        description: 'POSTPONED',
        type: 'POSTPONED',
      };
    case MatchStateTennis.Delayed:
      return {
        code: 15,
        description: 'DELAYED',
        type: 'DELAYED',
      };
    case MatchStateTennis.Canceled:
      return {
        code: 16,
        description: 'CANCELED',
        type: 'CANCELED',
      };
    case MatchStateTennis.Interrupted:
      return {
        code: 17,
        description: 'INTERRUPTED',
        type: 'INTERRUPTED',
      };
    case MatchStateTennis.Suspension:
      return {
        code: 18,
        description: 'SUSPENSION',
        type: 'SUSPENSION',
      };
    case MatchStateTennis.CutInHalf:
      return {
        code: 19,
        description: 'Cut in half',
        type: 'Cut in half',
      };
    case MatchStateTennis.ToBeDetermined:
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

export const parseMatchDataArrayTennis = (
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
      tournament: {
        id: matchDetails[2],
        priority: Number(matchDetails[3]),
        name: matchDetails[4],
        slug: matchDetails[5],
        ground: {
          code: matchDetails[8],
          description: matchDetails[9],
          main_type: matchDetails[10],
        },
        category: {
          id: matchDetails[6],
          name: matchDetails[7],
        },
      },
      status: convertStatusCode(Number(matchDetails[11])),
      homeTeam: {
        id: matchDetails[14],
        name: matchDetails[15],
        slug: matchDetails[16],
        national: matchDetails[17],
        sub_ids: matchDetails[18],
      },
      awayTeam: {
        id: matchDetails[19],
        name: matchDetails[20],
        slug: matchDetails[21],
        national: matchDetails[22],
        sub_ids: matchDetails[23],
      },
      scores: JSON.parse(matchDetails[24] || '[]'),
      serve: matchDetails[25],
      slug: matchDetails[26],
      season_id: matchDetails[27],
      venue: {
        name: matchDetails[28],
        capacity: matchDetails[29],
        city: matchDetails[30],
      },
    };
  });
  return matches;
};

export function isMatchInprogressTennis(matchStatusId: number): boolean {
  return [
    MatchStateTennis.FirstSet,
    MatchStateTennis.FifthSet,
    MatchStateTennis.FourthSet,
    MatchStateTennis.InProgress,
    MatchStateTennis.SecondSet,
    MatchStateTennis.ThirdSet,
    MatchStateTennis.Retired,
    MatchStateTennis.Retired1,
    MatchStateTennis.Retired2,
    MatchStateTennis.Walkover,
    MatchStateTennis.Walkover1,
    MatchStateTennis.Walkover2,
  ].includes(matchStatusId);
}

export const renderRoundOfMatchTennis = (code: number) => {
  switch (code) {
    case MatchStateTennis.FirstSet:
      return `S1`;
    case MatchStateTennis.SecondSet:
      return `S2`;
    case MatchStateTennis.ThirdSet:
      return `S3`;
    case MatchStateTennis.FourthSet:
      return `S4`;
    case MatchStateTennis.FifthSet:
      return `S5`;
    case MatchStateTennis.Ended:
      return `FT`;
    case MatchStateTennis.Delayed:
      return `Delayed`;
    case MatchStateTennis.Canceled:
      return `Canceled`;
    case MatchStateTennis.NotStarted:
      return `Not Started`;
    case MatchStateTennis.Suspension:
      return `Suspension`;
    case MatchStateTennis.Walkover:
      return `Walkover`;
    case MatchStateTennis.Walkover1:
      return `P1-Walkover`;
    case MatchStateTennis.Walkover2:
      return `P2-Walkover`;
    case MatchStateTennis.Retired:
    case MatchStateTennis.Retired1:
    case MatchStateTennis.Retired2:
      return `Retired`;
    case MatchStateTennis.Postponed:
      return `Postponed`;
    case MatchStateTennis.Interrupted:
      return `Interrupted`;
    case MatchStateTennis.Abandoned:
      return `Abandoned`;
    default:
      return ``;
  }
}
export function genDisplayedTimeTennis(
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

  return generateDisplayString(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

function generateDisplayString(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (isMatchLiveTennis(status.code)) {
    return [formatMinuteLive(minuteLive)];
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
