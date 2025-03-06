import { format, isSameDay, isSameYear, isToday } from 'date-fns';

import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import { MatchStateBasketBall, SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import { handleFutureMatchDateComparisons, isMatchOnDate } from '@/utils/common-utils';
import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, generateUpcomingMatchString, normalizeTimestamp } from '@/utils/football-utils';
import vi from '~/lang/vi';


export function formatBkbMatchTimestamp(
  timestamp = 0,
  status: any,
  isByTime = false,
  startTime?: number,
) {
  try {
    const date = new Date(timestamp * 1000);

    date.setHours(date.getHours());

    let formattedDate = format(date, 'dd/MM');
    if (!isSameYear(date, new Date())) {
      formattedDate = format(date, 'dd/MM/yy');
    }
    const formattedTime = format(date, 'HH:mm');

    const statusInprogress = (code: MatchStateBasketBall) => {
      switch (code) {
        case MatchStateBasketBall.FirstHalf:
          return `Q1`;
        case MatchStateBasketBall.FirstHalfOver:
          return `Q1 Ended`;
        case MatchStateBasketBall.SecondHalf:
          return `Q2`;
        case MatchStateBasketBall.SecondHalfOver:
          return `Q2 Ended`;
        case MatchStateBasketBall.ThirdHalf:
          return `Q3`;
        case MatchStateBasketBall.ThirdHalfOver:
          return `Q3 Ended`;
        case MatchStateBasketBall.FourHalf:
          return `Q4`;
        case MatchStateBasketBall.OverTime:
          return `OT`;
        default:
          return '';
      }
    }

    const statusMap: { [key: string]: [string, string] } = {
      not_started: isToday(date)
        ? [formattedTime, isByTime ? formattedTime : '']
        : [formattedDate, formattedTime],
      inprogress: [
        statusInprogress(status.code), statusInprogress(status.code)
      ],
      interrupted: isToday(date)
        ? [formattedTime, 'Interrupted']
        : [formattedDate, 'Interrupted'],
      cancelled: isToday(date)
        ? [formattedTime, 'Cancelled']
        : [formattedDate, 'Cancelled'],
      finished: isToday(date) ? [formattedTime, 'FT'] : [formattedDate, 'FT'],
      cutInHalf: isToday(date)
        ? [formattedTime, 'Cut in half']
        : [formattedDate, 'Cut in half'],
      extension: isToday(date)
        ? [formattedTime, 'Extension']
        : [formattedDate, 'Extension'],
      toBeDetermined: isToday(date)
        ? [formattedTime, 'Pending']
        : [formattedDate, 'Pending'],
      firt_half_over: isToday(date) ? [formattedTime, 'Q1 Ended'] : [formattedDate, 'Q1 Ended'],
      second_half_over: isToday(date) ? [formattedTime, 'Q2 Ended'] : [formattedDate, 'Q2 Ended'],
      third_half_over: isToday(date) ? [formattedTime, 'Q3 Ended'] : [formattedDate, 'Q3 Ended'],
      overTime: isToday(date) ? [formattedTime, 'OT'] : [formattedDate, 'OT'],
    };


    let statusType = status.type;

    if (!statusType) {
      statusType = 'not_started';
    }

    if (status.code == MatchStateBasketBall.Cancelled) {
      statusType = 'canceled';
    } else if (status.code == MatchStateBasketBall.Interrupted) {
      statusType = 'interrupted';
    } else if (status.code == MatchStateBasketBall.Ended) {
      statusType = 'finished';
    } else if (status.code == MatchStateBasketBall.CutInHalf) {
      statusType = 'cutInHalf';
    } else if (status.code == MatchStateBasketBall.Extension) {
      statusType = 'extension';
    } else if (status.code == MatchStateBasketBall.ToBeDetermined) {
      statusType = 'toBeDetermined';
    } else if (status.code == MatchStateBasketBall.FirstHalfOver) {
      statusType = 'firt_half_over';
    } else if (status.code == MatchStateBasketBall.SecondHalfOver) {
      statusType = 'second_half_over';
    } else if (status.code == MatchStateBasketBall.ThirdHalfOver) {
      statusType = 'third_half_over';
    } else if (status.code == MatchStateBasketBall.OverTime) {
      statusType = 'overTime';
    }


    return statusMap[statusType] || [formattedDate, formattedTime];
  } catch (err) {
    return ['', ''];
  }
}

export const convertStatusCodeBasketBall = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: '',
        },
      };
    case MatchStateBasketBall.Abandoned:
      return {
        code: 0,
        description: 'abandoned',
        type: 'finished',
      };
    case MatchStateBasketBall.NotStarted:
      return {
        code: 1,
        description: 'not_started',
        type: 'not_started',
      };
    case MatchStateBasketBall.FirstHalf:
      return {
        code: 2,
        description: '1st_half',
        type: 'inprogress',
      };

    case MatchStateBasketBall.FirstHalfOver:
      return {
        code: 3,
        description: '1st_half_over',
        type: 'finished',
      };
    case MatchStateBasketBall.SecondHalf:
      return {
        code: 4,
        description: '2nd_half',
        type: 'inprogress',
      };
    case MatchStateBasketBall.SecondHalfOver:
      return {
        code: 5,
        description: '2nd_half_over',
        type: 'finished',
      };
    case MatchStateBasketBall.ThirdHalf:
      return {
        code: 6,
        description: '3rd_half',
        type: 'inprogress',
      };
    case MatchStateBasketBall.ThirdHalfOver:
      return {
        code: 7,
        description: '3rd_half_over',
        type: 'finished',
      };
    case MatchStateBasketBall.FourHalf:
      return {
        code: 8,
        description: '4st_half',
        type: 'inprogress',
      };
    case MatchStateBasketBall.OverTime:
      return {
        code: 9,
        description: 'overtime',
        type: 'inprogress',
      };
    case MatchStateBasketBall.Ended:
      return {
        code: 10,
        description: 'Ended',
        type: 'finished',
      };
    case MatchStateBasketBall.Interrupted:
      return {
        code: 11,
        description: 'interrupted',
        type: 'finished',
      };
    case MatchStateBasketBall.Cancelled:
      return {
        code: 12,
        description: 'cancelled',
        type: 'finished',
      };
    case MatchStateBasketBall.Extension:
      return {
        code: 13,
        description: 'extension',
        type: 'finished',
      };
    case MatchStateBasketBall.CutInHalf:
      return {
        code: 14,
        description: 'cut in half',
        type: 'finished',
      };
    case MatchStateBasketBall.ToBeDetermined:
      return {
        code: 15,
        description: 'to be determined',
        type: 'toBeDetermined',
      };
    default:
      return {
        code: -1,
        type: '',
        description: '',
      };
  }
};

export const parseMatchDataBasketBall = (
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
        group_num: Number(matchDetails[6]),
        category: {
          id: matchDetails[7],
          name: matchDetails[8],
        },
      },
      status: convertStatusCodeBasketBall(Number(matchDetails[9])),
      homeTeam: {
        id: matchDetails[10],
        name: matchDetails[11],
        slug: matchDetails[12],
      },
      awayTeam: {
        id: matchDetails[13],
        name: matchDetails[14],
        slug: matchDetails[15],
      },
      stage_id: matchDetails[16],
      time: {
        runSeconds: Number(matchDetails[17]),
        countDown: Number(matchDetails[18]),
        updateTime: Number(matchDetails[19]),
        remainTime: Number(matchDetails[20]),
        status: convertStatusCodeBasketBall(Number(matchDetails[9])),
        currentPeriodStartTimestamp: Number(matchDetails[1]),
      },
      homeScore: {
        display: Number(matchDetails[21]),
        period1: Number(matchDetails[22]),
        period2: Number(matchDetails[23]),
        period3: Number(matchDetails[24]),
        period4: Number(matchDetails[25]),
        overtime: Number(matchDetails[26]),
        series: Number(matchDetails[27]),
      },
      awayScore: {
        display: Number(matchDetails[28]),
        period1: Number(matchDetails[29]),
        period2: Number(matchDetails[30]),
        period3: Number(matchDetails[31]),
        period4: Number(matchDetails[32]),
        overtime: Number(matchDetails[33]),
        series: Number(matchDetails[34]),
      },
      slug: matchDetails[35],
      roundInfo: {
        round: Number(matchDetails[36]),
      },
    };
  });
  return matches;
};

export function isMatchHaveStatBkb(matchStatusId: number): boolean {
  return [
    MatchStateBasketBall.Abandoned,
    // MatchStateBasketBall.NotStarted,
    MatchStateBasketBall.FirstHalf,
    MatchStateBasketBall.FirstHalfOver,
    MatchStateBasketBall.SecondHalf,
    MatchStateBasketBall.SecondHalfOver,
    MatchStateBasketBall.ThirdHalf,
    MatchStateBasketBall.ThirdHalfOver,
    MatchStateBasketBall.FourHalf,
    MatchStateBasketBall.OverTime,
    MatchStateBasketBall.Ended,
    MatchStateBasketBall.Interrupted,
    MatchStateBasketBall.Cancelled,
    MatchStateBasketBall.Extension,
    MatchStateBasketBall.CutInHalf,
    MatchStateBasketBall.ToBeDetermined,
  ].includes(matchStatusId);
}

export function isMatchesEndedBkb(matchStatusId: number): boolean {
  return [MatchStateBasketBall.Ended, MatchStateBasketBall.Abandoned,
  MatchStateBasketBall.Interrupted,
  MatchStateBasketBall.Cancelled,
  // MatchStateBasketBall.Extension,
  MatchStateBasketBall.CutInHalf,
  // MatchStateBasketBall.ToBeDetermined,
  ].includes(matchStatusId);
}

function generateDisplayStringBkb(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
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
}

export function genDisplayedTimeBkb(
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

  return generateDisplayStringBkb(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

export const filterMatchesBasketball = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string
): SportEventDtoWithStat[] => {
  const today = new Date();

  const matchEndedStates = [
    MatchStateBasketBall.Abandoned,
    MatchStateBasketBall.Interrupted,
    MatchStateBasketBall.Cancelled,
    MatchStateBasketBall.Extension,
    MatchStateBasketBall.CutInHalf,
    MatchStateBasketBall.ToBeDetermined,
  ]

  return matches.filter((match) => {
    const priority = parseInt(match?.tournament?.priority.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.tournament?.priority && priority < mapMatchPriority[SPORT.BASKETBALL];
    const matchEnded = isMatchesEndedBkb(match.status?.code);
    const matchInProgress = !matchEnded && !matchEndedStates.includes(match.status?.code);


    if (filter === MATCH_FILTERS.FINISHED || filter === MATCH_FILTERS.RESULTS || page === PAGE.results || filterMobile === MATCH_FILTERS.FINISHED) {
      return isSameDay(today, dateFilter) ? matchEnded : matchEnded && isDateFilterMatching;
    }

    if (filter === 'hot') {
      return isMatchHot && isDateFilterMatching;
    }

    if ((filter === 'live' || filter === 'all') && !isSameDay(today, dateFilter)) {
      return isDateFilterMatching;
    }

    if (page === PAGE.fixtures || filterMobile === MATCH_FILTERS.FIXTURES || (filter === 'all' && isSameDay(today, dateFilter))) {
      return matchInProgress
    }
    return true
  });
};

export function isMatchInprogressBkb(matchStatusId: number): boolean {
  return [
    MatchStateBasketBall.FirstHalf,
    MatchStateBasketBall.FirstHalfOver,
    MatchStateBasketBall.SecondHalf,
    MatchStateBasketBall.SecondHalfOver,
    MatchStateBasketBall.ThirdHalf,
    MatchStateBasketBall.ThirdHalfOver,
    MatchStateBasketBall.FourHalf,
    MatchStateBasketBall.OverTime,
    MatchStateBasketBall.CutInHalf,
  ].includes(matchStatusId);
}
