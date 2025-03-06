import { format, isSameYear, isToday } from 'date-fns';
import isSameDay from 'date-fns/isSameDay';
import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, generateUpcomingMatchString, handleFutureMatchDateComparisons, isMatchOnDate, normalizeTimestamp } from '@/utils';

import vi from '~/lang/vi';

export enum MatchState {
  Abnormal = 0, // ABNORMAL (Suggest Hiding)
  NotStarted = 1, // NOT_STARTED
  FirstInningsHomeTeam = 532, // FIRST_INNINGS_HOME_TEAM
  FirstInningsAwayTeam = 533, // FIRST_INNINGS_AWAY_TEAM
  SecondInningsHomeTeam = 534, // SECOND_INNINGS_HOME_TEAM
  SecondInningsAwayTeam = 535, // SECOND_INNINGS_AWAY_TEAM
  AwaitingSuperOver = 536, // AWAITING_SUPER_OVER
  SuperOverHomeTeam = 537, // SUPER_OVER_HOME_TEAM
  SuperOverAwayTeam = 538, // SUPER_OVER_AWAY_TEAM
  AfterSuperOver = 539, // AFTER_SUPER_OVER
  InningsBreak = 540, // INNINGS_BREAK
  SuperOverBreak = 541, // SUPER_OVER_BREAK
  LunchBreak = 542, // LUNCH_BREAK
  TeaBreak = 543, // TEA_BREAK
  Ended = 100, // ENDED
  WaterBreak = 545, // WATER_BREAK
  Postponed = 14, // POSTPONED
  Delayed = 15, // DELAYED
  Canceled = 16, // CANCELED
  Interrupted = 17, // INTERRUPTED
  CutInHalf = 19, // Cut in half
  ToBeDetermined = 99,
  EndedMatchOfTheDay = 544, // Ended today
}

export const isMatchNotStartedCricket = (code: number) => {
  return code === MatchState.NotStarted;
}

export const inningStates: { [key: number]: string } = {
  [MatchState.FirstInningsHomeTeam]: 'I1',
  [MatchState.FirstInningsAwayTeam]: 'I1',
  [MatchState.SecondInningsHomeTeam]: 'I2',
  [MatchState.SecondInningsAwayTeam]: 'I2',
  [MatchState.AwaitingSuperOver]: 'Awaiting super over',
  [MatchState.SuperOverHomeTeam]: 'Super over',
  [MatchState.SuperOverAwayTeam]: 'Super over',
  [MatchState.AfterSuperOver]: 'ASO',
  [MatchState.InningsBreak]: 'Innings break',
  [MatchState.SuperOverBreak]: 'Super over break',
  [MatchState.LunchBreak]: 'Lunch break',
  [MatchState.TeaBreak]: 'Tea break',
  [MatchState.WaterBreak]: 'Water break',
  [MatchState.EndedMatchOfTheDay]: 'Stumps',
};

export const inningStatesDetail: { [key: number]: string } = {
  [MatchState.FirstInningsAwayTeam]: '1th Inning',
  [MatchState.FirstInningsHomeTeam]: '1th Inning',
  [MatchState.SecondInningsAwayTeam]: '2th Inning',
  [MatchState.SecondInningsHomeTeam]: '2th Inning',
  [MatchState.AwaitingSuperOver]: 'Awaiting super over',
  [MatchState.SuperOverHomeTeam]: 'Super over',
  [MatchState.SuperOverAwayTeam]: 'Super over',
  [MatchState.AfterSuperOver]: 'After super over',
  [MatchState.InningsBreak]: 'Innings break',
  [MatchState.SuperOverBreak]: 'Super over break',
  [MatchState.LunchBreak]: 'Lunch break',
  [MatchState.TeaBreak]: 'Tea break',
  [MatchState.WaterBreak]: 'Water break',
  [MatchState.EndedMatchOfTheDay]: 'Stumps',
};

export const matchStatesDetail: { [key: number]: string } = {
  [MatchState.Abnormal]: 'Abandoned',
  [MatchState.Ended]: 'FT',
  [MatchState.CutInHalf]: 'Cut',
  [MatchState.ToBeDetermined]: 'Pending',
  [MatchState.Interrupted]: 'Interrupted',
  [MatchState.Postponed]: 'Postponed',
  [MatchState.Canceled]: 'Canceled',
  [MatchState.Delayed]: 'Delayed',
};
export const nonScoreStates = [
  MatchState.Abnormal,
  MatchState.NotStarted,
  MatchState.ToBeDetermined,
  MatchState.Canceled,
  MatchState.Delayed,
  MatchState.Postponed,
];
export const nonActiveStates = [
  MatchState.Abnormal,
  MatchState.Canceled,
  MatchState.CutInHalf,
  MatchState.Ended,
  MatchState.Interrupted,
  MatchState.ToBeDetermined,
];
const matchStateFormats: { [key: number]: string } = {
  [MatchState.Abnormal]: 'Abandoned',
  [MatchState.Ended]: 'FT',
  [MatchState.CutInHalf]: 'Cut',
  [MatchState.ToBeDetermined]: 'Pending',
  [MatchState.Interrupted]: 'Interrupted',
  [MatchState.Postponed]: 'Postponed',
  [MatchState.Canceled]: 'Cancelled',
};

export const parseMatchDataArray = (
  matchDataString: string | undefined | null
): any[] => {
  if (!matchDataString) {
    return [];
  }

  if (!matchDataString && matchDataString?.length <= 0) {
    return [];
  }
  const matchDataArray =
    matchDataString?.length > 0 ? matchDataString?.split('!!') : [];

  const matches = matchDataArray.map((matchString) => {
    const matchDetails = matchString.split('^');

    return {
      id: matchDetails[0],
      startTimestamp: matchDetails[1],
      uniqueTournament: {
        id: matchDetails[2],
        tier: matchDetails[3],
        name: matchDetails[4],
        slug: matchDetails[5],
        tournament: {
          category: {
            id: matchDetails[6],
            name: matchDetails[7],
          },
        },
      },
      status: convertStatusCodeCricket(Number(matchDetails[8])),
      homeTeam: {
        id: matchDetails[11],
        name: matchDetails[12],
        slug: matchDetails[13],
        national: matchDetails[14],
      },
      awayTeam: {
        id: matchDetails[15],
        name: matchDetails[16],
        slug: matchDetails[17],
        national: matchDetails[18],
      },
      scores: JSON.parse(matchDetails[19] || '[]'),
      extraScores: JSON.parse(matchDetails[20] || '[]'),
      serve: matchDetails[21],
      season_id: matchDetails[23],
      slug: matchDetails[22],
      venue: {
        name: matchDetails[24],
        capacity: matchDetails[25],
        city: matchDetails[26],
      },
    };
  });
  return matches;
};
export const convertStatusCodeCricket = (statusCode: number): any => {
  switch (statusCode) {
    case MatchState.Abnormal:
      return {
        code: MatchState.Abnormal,
        description: 'ABNORMAL',
        type: 'ABNORMAL',
      };
    case MatchState.NotStarted:
      return {
        code: MatchState.NotStarted,
        description: 'NOT_STARTED',
        type: 'NOT_STARTED',
      };
    case MatchState.FirstInningsHomeTeam:
      return {
        code: MatchState.FirstInningsHomeTeam,
        description: 'FIRST_INNINGS_HOME_TEAM',
        type: 'FIRST_INNINGS_HOME_TEAM',
      };
    case MatchState.FirstInningsAwayTeam:
      return {
        code: MatchState.FirstInningsAwayTeam,
        description: 'FIRST_INNINGS_AWAY_TEAM',
        type: 'FIRST_INNINGS_AWAY_TEAM',
      };
    case MatchState.SecondInningsHomeTeam:
      return {
        code: MatchState.SecondInningsHomeTeam,
        description: 'SECOND_INNINGS_HOME_TEAM',
        type: 'SECOND_INNINGS_HOME_TEAM',
      };
    case MatchState.SecondInningsAwayTeam:
      return {
        code: MatchState.SecondInningsAwayTeam,
        description: 'SECOND_INNINGS_AWAY_TEAM',
        type: 'SECOND_INNINGS_AWAY_TEAM',
      };
    case MatchState.AwaitingSuperOver:
      return {
        code: MatchState.AwaitingSuperOver,
        description: 'AWAITING_SUPER_OVER',
        type: 'AWAITING_SUPER_OVER',
      };
    case MatchState.SuperOverHomeTeam:
      return {
        code: MatchState.SuperOverHomeTeam,
        description: 'SUPER_OVER_HOME_TEAM',
        type: 'SUPER_OVER_HOME_TEAM',
      };
    case MatchState.SuperOverAwayTeam:
      return {
        code: MatchState.SuperOverAwayTeam,
        description: 'SUPER_OVER_AWAY_TEAM',
        type: 'SUPER_OVER_AWAY_TEAM',
      };
    case MatchState.AfterSuperOver:
      return {
        code: MatchState.AfterSuperOver,
        description: 'AFTER_SUPER_OVER',
        type: 'AFTER_SUPER_OVER',
      };
    case MatchState.InningsBreak:
      return {
        code: MatchState.InningsBreak,
        description: 'INNINGS_BREAK',
        type: 'INNINGS_BREAK',
      };
    case MatchState.SuperOverBreak:
      return {
        code: MatchState.SuperOverBreak,
        description: 'SUPER_OVER_BREAK',
        type: 'SUPER_OVER_BREAK',
      };
    case MatchState.LunchBreak:
      return {
        code: MatchState.LunchBreak,
        description: 'LUNCH_BREAK',
        type: 'LUNCH_BREAK',
      };
    case MatchState.TeaBreak:
      return {
        code: MatchState.TeaBreak,
        description: 'TEA_BREAK',
        type: 'TEA_BREAK',
      };
    case MatchState.EndedMatchOfTheDay:
      return {
        code: MatchState.EndedMatchOfTheDay,
        description: 'END',
        type: 'END',
      };
    case MatchState.WaterBreak:
      return {
        code: MatchState.WaterBreak,
        description: 'WATER_BREAK',
        type: 'WATER_BREAK',
      };
    case MatchState.Ended:
      return {
        code: MatchState.Ended,
        description: 'ENDED',
        type: 'ENDED',
      };
    case MatchState.Postponed:
      return {
        code: MatchState.Postponed,
        description: 'POSTPONED',
        type: 'POSTPONED',
      };
    case MatchState.Delayed:
      return {
        code: MatchState.Delayed,
        description: 'DELAYED',
        type: 'DELAYED',
      };
    case MatchState.Canceled:
      return {
        code: MatchState.Canceled,
        description: 'CANCELED',
        type: 'CANCELED',
      };
    case MatchState.Interrupted:
      return {
        code: MatchState.Interrupted,
        description: 'INTERRUPTED',
        type: 'INTERRUPTED',
      };
    case MatchState.CutInHalf:
      return {
        code: MatchState.CutInHalf,
        description: 'Cut in half',
        type: 'Cut in half',
      };
    case MatchState.ToBeDetermined:
      return {
        code: MatchState.ToBeDetermined,
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

export const checkMatchStatus = (code: number) => {
  // Kiểm tra nếu trạng thái trận đấu là 'NotStarted'
  return code === MatchState.NotStarted;
};
// Format time trạng thái trận đấu (List) - basket ball
export const formatTime = (code: number) => {
  return matchStateFormats[code] || false;
};

// Format time trạng thái trận đấu (List)
export const getCurrentRound = (code: MatchState) => {
  // Kiểm tra các trạng thái bóng chày trước
  if (inningStates[code]) return inningStates[code];
  return '';
};

// Format time trạng thái trận đấu (List)
export const checkInProgessMatch = (code: MatchState) => {
  const nonProgressStates: MatchState[] = [
    MatchState.Abnormal,
    MatchState.NotStarted,
    MatchState.ToBeDetermined,
    MatchState.CutInHalf,
    MatchState.Interrupted,
    MatchState.Canceled,
    MatchState.Delayed,
    MatchState.Postponed,
    MatchState.Ended,
  ];

  return !nonProgressStates.includes(code);
};
export const checkEnded = (code: MatchState) => {
  return code === MatchState.Ended;
};
// Format time trạng thái trận đấu - ghi chi tiết (details)
export const formatTime_sub = (code: number) => {
  if (inningStatesDetail[code]) return inningStatesDetail[code];
  if (matchStatesDetail[code]) return matchStatesDetail[code];
  return '';
};

export const isMatchEnd = (statusCode: number): boolean => {
  const endStates: MatchState[] = [
    MatchState.Ended,
    MatchState.Canceled,
    MatchState.Postponed,
    MatchState.ToBeDetermined,
    MatchState.Interrupted,
    MatchState.CutInHalf,
  ];

  return endStates.includes(statusCode);
};

export const formatMatchTimestamp = (timestamp = 0, code: number) => {
  const date = new Date(timestamp * 1000);
  const formattedTime = format(date, 'HH:mm');
  let formattedDate = format(date, 'dd/MM');
  if (!isSameYear(date, new Date())) {
    formattedDate = format(date, 'dd/MM/yy');
  }

  const label =
    matchStatesDetail[code] ||
    inningStates[code] ||
    inningStatesDetail[code] ||
    formattedTime;

  if (checkInProgessMatch(code)) {
    return [formattedTime, label];
  }
  return isToday(date) ? ['', label] : [formattedDate, label];
};

export const filterMatches = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  filterMobile: string,
  dateFilter: Date
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates: MatchState[] = [
    MatchState.Ended,
    MatchState.Canceled,
    MatchState.Postponed,
    MatchState.ToBeDetermined,
    MatchState.Interrupted,
    MatchState.CutInHalf,
    MatchState.EndedMatchOfTheDay,
    MatchState.Abnormal,
  ];

  return matches.filter((match) => {
    const priority = parseInt(match?.uniqueTournament?.priority?.toString() || '1001', 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.uniqueTournament?.priority && priority < mapMatchPriority[SPORT.CRICKET];
    const matchEnded = isMatchEnd(match.status?.code);
    const matchInProgress = !matchEnded && !matchEndedStates.includes(match.status?.code);


    if (filter === MATCH_FILTERS.FINISHED || filter === MATCH_FILTERS.RESULTS || page === PAGE.results || filterMobile === MATCH_FILTERS.FINISHED) {
      return isSameDay(today, dateFilter) ? matchEnded : matchEnded && isDateFilterMatching;
    }

    if (filter === MATCH_FILTERS.HOT) {
      // return isSameDay(today, dateFilter) ? isMatchHot : isMatchHot && isDateFilterMatching;
      return matchInProgress //TODO: double check after have priority
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

export const getOrdinalSuffix = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};

export function formatMatchTimestampCricket(
  timestamp = 0,
  status: any,
) {
  try {
    const date = new Date(timestamp * 1000);

    date.setHours(date.getHours());

    let formattedDate = format(date, 'dd/MM');
    if (!isSameYear(date, new Date())) {
      formattedDate = format(date, 'dd/MM/yy');
    }
    const formattedTime = format(date, 'HH:mm');

    const formatTimeStatus = formatTime_sub(status.code);

    return {
      date: formattedDate,
      time: formattedTime,
      timeSub: formatTimeStatus,
    };
  } catch (err) {
    return { date: '', time: '', timeSub: '' };
  }
}

function generateDisplayStringCricket(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code >= 500 && status.code <= 550 && status.code != 100) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 10 && status.code <= 99) {
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

export function genDisplayedTimeCricket(
  timestamp: number,
  status: any,
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

  return generateDisplayStringCricket(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}