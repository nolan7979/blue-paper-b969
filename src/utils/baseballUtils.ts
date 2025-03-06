import { MATCH_FILTERS, PAGE, SPORT } from "@/constant/common";
import { SportEventDtoWithStat, StatusDto } from "@/constant/interface";
import { mapMatchPriority } from "@/constant/matchPriority";
import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, generateUpcomingMatchString, handleFutureMatchDateComparisons, normalizeTimestamp } from "@/utils";
import { isMatchOnDate } from "@/utils/common-utils";
import { format, isSameDay, isSameYear, isToday } from "date-fns";
import vi from '~/lang/vi';

export enum MatchBaseballState {
  ABNORMAL = 0, // Suggest Hiding
  NOT_STARTED = 1,
  FIRST_INNING_TOP = 432,
  BREAK_TOP1_BOTTOM1 = 452,
  FIRST_INNING_BOTTOM = 433,
  BREAK_TOP2_BOTTOM1 = 453,
  SECOND_INNING_TOP = 434,
  BREAK_TOP2_BOTTOM2 = 454,
  SECOND_INNING_BOTTOM = 435,
  BREAK_TOP3_BOTTOM2 = 455,
  THIRD_INNING_TOP = 436,
  BREAK_TOP3_BOTTOM3 = 456,
  THIRD_INNING_BOTTOM = 437,
  BREAK_TOP4_BOTTOM3 = 457,
  FOURTH_INNING_TOP = 438,
  BREAK_TOP4_BOTTOM4 = 458,
  FOURTH_INNING_BOTTOM = 439,
  BREAK_TOP5_BOTTOM4 = 459,
  FIFTH_INNING_TOP = 440,
  BREAK_TOP5_BOTTOM5 = 460,
  FIFTH_INNING_BOTTOM = 411,
  BREAK_TOP6_BOTTOM5 = 461,
  SIXTH_INNING_TOP = 412,
  BREAK_TOP6_BOTTOM6 = 462,
  SIXTH_INNING_BOTTOM = 413,
  BREAK_TOP7_BOTTOM6 = 463,
  SEVENTH_INNING_TOP = 414,
  BREAK_TOP7_BOTTOM7 = 464,
  SEVENTH_INNING_BOTTOM = 415,
  BREAK_TOP8_BOTTOM7 = 465,
  EIGHTH_INNING_TOP = 416,
  BREAK_TOP8_BOTTOM8 = 466,
  EIGHTH_INNING_BOTTOM = 417,
  BREAK_TOP9_BOTTOM8 = 467,
  NINTH_INNING_TOP = 418,
  BREAK_TOP9_BOTTOM9 = 468,
  NINTH_INNING_BOTTOM = 419,
  BREAK_TOPEI_BOTTOM9 = 469,
  EXTRA_INNING_TOP = 420,
  BREAK_TOPEI_BOTTOMEI = 470,
  EXTRA_INNING_BOTTOM = 421,
  ENDED = 100,
  POSTPONED = 14,
  DELAYED = 15,
  CANCELED = 16,
  INTERRUPTED = 17,
  CUT_IN_HALF = 19,
  TO_BE_DETERMINED = 99
}

export const parseMatchDataArrayBaseball = (matchDataString: string | null | undefined): any[] => {
  if (!matchDataString || matchDataString && matchDataString.length <= 0) {
    return [];
  }
  const matchDataArray =
    matchDataString.length > 0 ? matchDataString?.split('!!') : [];

  const matches = matchDataArray.map(matchString => {
    const matchDetails = matchString.split('^');
    return {
      id: matchDetails[0],
      startTimestamp: matchDetails[1],
      uniqueTournament: {
        id: matchDetails[2],
        category: {
          id: matchDetails[3],
          name: matchDetails[4]
        },
        country: {
          id: matchDetails[5],
          name: matchDetails[6]
        },
        name: matchDetails[7],
        priority: Number(matchDetails[8])
      },
      status: convertStatusCode(Number(matchDetails[9])),
      homeTeam: {
        id: matchDetails[12],
        name: matchDetails[13]
      },
      awayTeam: {
        id: matchDetails[14],
        name: matchDetails[15]
      },
      scores: JSON.parse(matchDetails[16] || '[]'),
      serve: matchDetails[17],
      season_id: matchDetails[19],
      slug: matchDetails[18],
      venue: {
        name: matchDetails[20]
      }
    };
  });
  return matches;
};

export const renderStatusMatchBaseball = (time: string, i18n: any, status: any) => {
  switch (status?.code) {
    case MatchBaseballState.ABNORMAL:
      return 'Abnormal';
    case MatchBaseballState.ENDED:
      return 'FT';
    case MatchBaseballState.POSTPONED:
      return 'Postponed';
    case MatchBaseballState.FIRST_INNING_TOP:
    case MatchBaseballState.FIRST_INNING_BOTTOM:
      return '1st Inning';
    case MatchBaseballState.SECOND_INNING_TOP:
    case MatchBaseballState.SECOND_INNING_BOTTOM:
      return '2nd Inning';
    case MatchBaseballState.THIRD_INNING_TOP:
    case MatchBaseballState.THIRD_INNING_BOTTOM:
      return '3rd Inning';
    case MatchBaseballState.FOURTH_INNING_TOP:
    case MatchBaseballState.FOURTH_INNING_BOTTOM:
      return '4th Inning';
    case MatchBaseballState.FIFTH_INNING_TOP:
    case MatchBaseballState.FIFTH_INNING_BOTTOM:
      return '5th Inning';
    case MatchBaseballState.SIXTH_INNING_TOP:
    case MatchBaseballState.SIXTH_INNING_BOTTOM:
      return '6th Inning';
    case MatchBaseballState.SEVENTH_INNING_TOP:
    case MatchBaseballState.SEVENTH_INNING_BOTTOM:
      return '7th Inning';
    case MatchBaseballState.EIGHTH_INNING_TOP:
    case MatchBaseballState.EIGHTH_INNING_BOTTOM:
      return '8th Inning';
    case MatchBaseballState.NINTH_INNING_TOP:
    case MatchBaseballState.NINTH_INNING_BOTTOM:
      return '9th Inning';
    case MatchBaseballState.EXTRA_INNING_TOP:
    case MatchBaseballState.EXTRA_INNING_BOTTOM:
      return 'Extra Inning';
    case MatchBaseballState.TO_BE_DETERMINED:
      return 'Pending'
    default:
      return time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;
  }
};


export const convertStatusCode = (statusCode: number): any => {
  switch (statusCode) {
    case MatchBaseballState.ABNORMAL:
      return {
        code: MatchBaseballState.ABNORMAL,
        description: 'Abnormal',
        type: 'abnormal'
      };
    case MatchBaseballState.NOT_STARTED:
      return {
        code: MatchBaseballState.NOT_STARTED,
        description: 'Not Started',
        type: 'pending'
      };
    case MatchBaseballState.FIRST_INNING_TOP:
      return {
        code: MatchBaseballState.FIRST_INNING_TOP,
        description: 'First Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP1_BOTTOM1:
      return {
        code: MatchBaseballState.BREAK_TOP1_BOTTOM1,
        description: 'Break Between Top 1 and Bottom 1',
        type: 'break'
      };
    case MatchBaseballState.FIRST_INNING_BOTTOM:
      return {
        code: MatchBaseballState.FIRST_INNING_BOTTOM,
        description: 'First Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.SECOND_INNING_TOP:
      return {
        code: MatchBaseballState.SECOND_INNING_TOP,
        description: 'Second Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP2_BOTTOM1:
      return {
        code: MatchBaseballState.BREAK_TOP2_BOTTOM1,
        description: 'Break Between Top 2 and Bottom 1',
        type: 'break'
      };
    case MatchBaseballState.SECOND_INNING_BOTTOM:
      return {
        code: MatchBaseballState.SECOND_INNING_BOTTOM,
        description: 'Second Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.THIRD_INNING_TOP:
      return {
        code: MatchBaseballState.THIRD_INNING_TOP,
        description: 'Third Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP3_BOTTOM2:
      return {
        code: MatchBaseballState.BREAK_TOP3_BOTTOM2,
        description: 'Break Between Top 3 and Bottom 2',
        type: 'break'
      };
    case MatchBaseballState.THIRD_INNING_BOTTOM:
      return {
        code: MatchBaseballState.THIRD_INNING_BOTTOM,
        description: 'Third Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.FOURTH_INNING_TOP:
      return {
        code: MatchBaseballState.FOURTH_INNING_TOP,
        description: 'Fourth Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP4_BOTTOM3:
      return {
        code: MatchBaseballState.BREAK_TOP4_BOTTOM3,
        description: 'Break Between Top 4 and Bottom 3',
        type: 'break'
      };
    case MatchBaseballState.FOURTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.FOURTH_INNING_BOTTOM,
        description: 'Fourth Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.FIFTH_INNING_TOP:
      return {
        code: MatchBaseballState.FIFTH_INNING_TOP,
        description: 'Fifth Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP5_BOTTOM4:
      return {
        code: MatchBaseballState.BREAK_TOP5_BOTTOM4,
        description: 'Break Between Top 5 and Bottom 4',
        type: 'break'
      };
    case MatchBaseballState.FIFTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.FIFTH_INNING_BOTTOM,
        description: 'Fifth Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.SIXTH_INNING_TOP:
      return {
        code: MatchBaseballState.SIXTH_INNING_TOP,
        description: 'Sixth Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP6_BOTTOM5:
      return {
        code: MatchBaseballState.BREAK_TOP6_BOTTOM5,
        description: 'Break Between Top 6 and Bottom 5',
        type: 'break'
      };
    case MatchBaseballState.SIXTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.SIXTH_INNING_BOTTOM,
        description: 'Sixth Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.SEVENTH_INNING_TOP:
      return {
        code: MatchBaseballState.SEVENTH_INNING_TOP,
        description: 'Seventh Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP7_BOTTOM6:
      return {
        code: MatchBaseballState.BREAK_TOP7_BOTTOM6,
        description: 'Break Between Top 7 and Bottom 6',
        type: 'break'
      };
    case MatchBaseballState.SEVENTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.SEVENTH_INNING_BOTTOM,
        description: 'Seventh Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.EIGHTH_INNING_TOP:
      return {
        code: MatchBaseballState.EIGHTH_INNING_TOP,
        description: 'Eighth Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP8_BOTTOM7:
      return {
        code: MatchBaseballState.BREAK_TOP8_BOTTOM7,
        description: 'Break Between Top 8 and Bottom 7',
        type: 'break'
      };
    case MatchBaseballState.EIGHTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.EIGHTH_INNING_BOTTOM,
        description: 'Eighth Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.NINTH_INNING_TOP:
      return {
        code: MatchBaseballState.NINTH_INNING_TOP,
        description: 'Ninth Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOP9_BOTTOM8:
      return {
        code: MatchBaseballState.BREAK_TOP9_BOTTOM8,
        description: 'Break Between Top 9 and Bottom 8',
        type: 'break'
      };
    case MatchBaseballState.NINTH_INNING_BOTTOM:
      return {
        code: MatchBaseballState.NINTH_INNING_BOTTOM,
        description: 'Ninth Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.EXTRA_INNING_TOP:
      return {
        code: MatchBaseballState.EXTRA_INNING_TOP,
        description: 'Extra Inning Top',
        type: 'live'
      };
    case MatchBaseballState.BREAK_TOPEI_BOTTOM9:
      return {
        code: MatchBaseballState.BREAK_TOPEI_BOTTOM9,
        description: 'Break Between Extra Inning Top and Bottom',
        type: 'break'
      };
    case MatchBaseballState.EXTRA_INNING_BOTTOM:
      return {
        code: MatchBaseballState.EXTRA_INNING_BOTTOM,
        description: 'Extra Inning Bottom',
        type: 'live'
      };
    case MatchBaseballState.ENDED:
      return {
        code: MatchBaseballState.ENDED,
        description: 'Ended',
        type: 'completed'
      };
    case MatchBaseballState.POSTPONED:
      return {
        code: MatchBaseballState.POSTPONED,
        description: 'Postponed',
        type: 'pending'
      };
    case MatchBaseballState.DELAYED:
      return {
        code: MatchBaseballState.DELAYED,
        description: 'Delayed',
        type: 'pending'
      };
    case MatchBaseballState.CANCELED:
      return {
        code: MatchBaseballState.CANCELED,
        description: 'Canceled',
        type: 'abnormal'
      };
    case MatchBaseballState.INTERRUPTED:
      return {
        code: MatchBaseballState.INTERRUPTED,
        description: 'Interrupted',
        type: 'abnormal'
      };
    case MatchBaseballState.CUT_IN_HALF:
      return {
        code: MatchBaseballState.CUT_IN_HALF,
        description: 'Cut in Half',
        type: 'abnormal'
      };
    case MatchBaseballState.TO_BE_DETERMINED:
      return {
        code: MatchBaseballState.TO_BE_DETERMINED,
        description: 'To Be Determined',
        type: 'pending'
      };
    default:
      return {
        code: -1,
        type: '',
        description: ''
      };
  }
};

export function isMatchesEndedBaseball(matchStatusId: number): boolean {
  return [MatchBaseballState.ENDED, MatchBaseballState.INTERRUPTED,
  MatchBaseballState.POSTPONED,
  MatchBaseballState.CANCELED,
  MatchBaseballState.DELAYED,
  MatchBaseballState.CUT_IN_HALF,
  MatchBaseballState.ABNORMAL, MatchBaseballState.TO_BE_DETERMINED].includes(matchStatusId);
}
export const filterBaseballMatches = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string,
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStated = [
    MatchBaseballState.INTERRUPTED,
    MatchBaseballState.POSTPONED,
    MatchBaseballState.CANCELED,
    MatchBaseballState.DELAYED,
    MatchBaseballState.CUT_IN_HALF,
    MatchBaseballState.ABNORMAL,
    MatchBaseballState.TO_BE_DETERMINED,
  ]

  return matches.filter((match) => {
    const priority = match?.uniqueTournament ? parseInt(match?.uniqueTournament?.priority.toString(), 10) : 1000;
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = priority <= mapMatchPriority[SPORT.BASEBALL];
    const matchEnded = isMatchesEndedBaseball(match.status?.code) 
    const matchInProgress = !matchEnded && !matchEndedStated.includes(match.status?.code);

    if (filter === MATCH_FILTERS.FINISHED || filter === MATCH_FILTERS.RESULTS || page === PAGE.results || filterMobile === MATCH_FILTERS.FINISHED) {
      return isSameDay(today, dateFilter) ? matchEnded : matchEnded && isDateFilterMatching;

    }

    if (filter === 'hot') {
      return isMatchHot && isDateFilterMatching
    }

    if ((filter === 'live' || filter === 'all') && !isSameDay(today, dateFilter)) {
      return isDateFilterMatching;
    }

    if (page === PAGE.fixtures || filterMobile === MATCH_FILTERS.FIXTURES || (filter === 'all' && isSameDay(today, dateFilter))) {
      return matchInProgress
    }
    return true
  })
};

export const formatMatchTimestampBaseball = (
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
        : [formattedDate, 'FT'],
      DELAYED: isToday(date)
        ? [formattedTime, 'Delayed']
        : [formattedDate, 'Delayed'],
      FIRST_SET: [formattedTime, 'S1'],
      SECOND_SET: [formattedTime, 'S2'],
      THIRD_SET: [formattedTime, 'S3'],
      FOURTH_SET: [formattedTime, 'S4'],
      FIFTH_SET: [formattedTime, 'S5'],
      CUT_IN_HALF: [formattedTime, 'Cut'],
    };

    let statusType = status.type;

    if (!statusType) {
      statusType = 'NOT_STARTED';
    }

    if (status.code == MatchBaseballState.CANCELED) {
      statusType = 'CANCELED';
    } else if (status.code == MatchBaseballState.INTERRUPTED) {
      statusType = 'INTERRUPTED';
    } else if (status.code == MatchBaseballState.ENDED) {
      statusType = 'ENDED';
    } else if (status.code == MatchBaseballState.DELAYED) {
      statusType = 'DELAYED';
    } else if (status.code == MatchBaseballState.POSTPONED) {
      statusType = 'POSTPONED';
    } else if (status.code == MatchBaseballState.CUT_IN_HALF) {
      statusType = 'CUT_IN_HALF';
    } else if (status.code == MatchBaseballState.TO_BE_DETERMINED) {
      statusType = 'TO_BE_DETERMINED';
    } else if (status.code == MatchBaseballState.ABNORMAL) {
      statusType = 'ABNORMAL';
    }

    return statusMap[statusType] || [formattedDate, formattedTime];
  } catch (err) {
    console.error(err);
    return ['', ''];
  }
};

export function isMatchHaveStatBB(matchStatusId: number): boolean {
  return [
    MatchBaseballState.ABNORMAL,
    MatchBaseballState.FIRST_INNING_TOP,
    MatchBaseballState.BREAK_TOP1_BOTTOM1,
    MatchBaseballState.FIRST_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP2_BOTTOM1,
    MatchBaseballState.SECOND_INNING_TOP,
    MatchBaseballState.BREAK_TOP2_BOTTOM2,
    MatchBaseballState.SECOND_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP3_BOTTOM2,
    MatchBaseballState.THIRD_INNING_TOP,
    MatchBaseballState.BREAK_TOP3_BOTTOM3,
    MatchBaseballState.THIRD_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP4_BOTTOM3,
    MatchBaseballState.FOURTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP4_BOTTOM4,
    MatchBaseballState.FOURTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP5_BOTTOM4,
    MatchBaseballState.FIFTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP5_BOTTOM5,
    MatchBaseballState.FIFTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP6_BOTTOM5,
    MatchBaseballState.SIXTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP6_BOTTOM6,
    MatchBaseballState.SIXTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP7_BOTTOM6,
    MatchBaseballState.SEVENTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP7_BOTTOM7,
    MatchBaseballState.SEVENTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP8_BOTTOM7,
    MatchBaseballState.EIGHTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP8_BOTTOM8,
    MatchBaseballState.EIGHTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP9_BOTTOM8,
    MatchBaseballState.NINTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP9_BOTTOM9,
    MatchBaseballState.NINTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOPEI_BOTTOM9,
    MatchBaseballState.EXTRA_INNING_TOP,
    MatchBaseballState.BREAK_TOPEI_BOTTOMEI,
    MatchBaseballState.EXTRA_INNING_BOTTOM,
    MatchBaseballState.ENDED,
    MatchBaseballState.INTERRUPTED,
    MatchBaseballState.CUT_IN_HALF,
  ].includes(matchStatusId);
}

export function isMatchInprogressBB(matchStatusId: number): boolean {
  return [
    MatchBaseballState.FIRST_INNING_TOP,
    MatchBaseballState.BREAK_TOP1_BOTTOM1,
    MatchBaseballState.FIRST_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP2_BOTTOM1,
    MatchBaseballState.SECOND_INNING_TOP,
    MatchBaseballState.BREAK_TOP2_BOTTOM2,
    MatchBaseballState.SECOND_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP3_BOTTOM2,
    MatchBaseballState.THIRD_INNING_TOP,
    MatchBaseballState.BREAK_TOP3_BOTTOM3,
    MatchBaseballState.THIRD_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP4_BOTTOM3,
    MatchBaseballState.FOURTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP4_BOTTOM4,
    MatchBaseballState.FOURTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP5_BOTTOM4,
    MatchBaseballState.FIFTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP5_BOTTOM5,
    MatchBaseballState.FIFTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP6_BOTTOM5,
    MatchBaseballState.SIXTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP6_BOTTOM6,
    MatchBaseballState.SIXTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP7_BOTTOM6,
    MatchBaseballState.SEVENTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP7_BOTTOM7,
    MatchBaseballState.SEVENTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP8_BOTTOM7,
    MatchBaseballState.EIGHTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP8_BOTTOM8,
    MatchBaseballState.EIGHTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOP9_BOTTOM8,
    MatchBaseballState.NINTH_INNING_TOP,
    MatchBaseballState.BREAK_TOP9_BOTTOM9,
    MatchBaseballState.NINTH_INNING_BOTTOM,
    MatchBaseballState.BREAK_TOPEI_BOTTOM9,
    MatchBaseballState.EXTRA_INNING_TOP,
    MatchBaseballState.BREAK_TOPEI_BOTTOMEI,
    MatchBaseballState.EXTRA_INNING_BOTTOM,
  ].includes(matchStatusId)
}

function generateDisplayStringBB(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code >= 400 && status.code < 500) { //inproccess
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 2 && status.code <= 100) { //comming match
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

export function genDisplayedTimeBB(
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

  return generateDisplayStringBB(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

export const handleObjectScoreBaseball = (scores: any) => {
  const excludedKeys = ['ft', 'e', 'h'];
  const getKey = Object.keys(scores).filter(
    (key) => !excludedKeys.includes(key)
  );

  const generateScoreArray = (index: number) =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((it) => ({
      pScore: scores[`p${it}`] ? scores[`p${it}`][index] : '-',
    }));

  const homeScore =
    getKey.length > 0 ? generateScoreArray(0) : Array(9).fill('-');
  const awayScore =
    getKey.length > 0 ? generateScoreArray(1) : Array(9).fill('-');

  return {
    score: scores,
    homeScore,
    awayScore,
  };
};
