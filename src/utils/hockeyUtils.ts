import { MATCH_FILTERS, PAGE, SPORT } from "@/constant/common";
import { MatchStateHockey, SportEventDtoWithStat, StatusDto } from "@/constant/interface";
import { mapMatchPriority } from "@/constant/matchPriority";
import { adjustMatchDateForTimezone, calculateMinuteLive, formatMatchDate, formatMinuteLive, normalizeTimestamp } from "@/utils";
import { handleFutureMatchDateComparisons, isMatchOnDate } from "@/utils/common-utils";
import { format, isSameDay, isSameYear } from "date-fns";
import vi from "~/lang/vi";

/* eslint-disable no-unused-vars */
export function isMatchHockeyHaveStat(matchStatusId: number): boolean {
  return [
    // MatchStateHockey.NotStarted,
    MatchStateHockey.FirstPeriod,
    MatchStateHockey.FirstPause,
    MatchStateHockey.SecondPeriod,
    MatchStateHockey.SecondPause,
    MatchStateHockey.ThirdPeriod,
    MatchStateHockey.AwaitingOT,
    MatchStateHockey.Overtime,
    MatchStateHockey.AfterOT,
    MatchStateHockey.AwaitingPenalties,
    MatchStateHockey.PenaltyShooting,
    MatchStateHockey.AfterPenalties,
    MatchStateHockey.Ended,
  ].includes(matchStatusId);
}

export function isMatchHockeyLive(matchStatusId: number): boolean {
  return [
    MatchStateHockey.FirstPeriod,  // 30
    MatchStateHockey.FirstPause,   // 331
    MatchStateHockey.SecondPeriod, // 31
    MatchStateHockey.SecondPause,  // 332 
    MatchStateHockey.ThirdPeriod,  // 32
    MatchStateHockey.AwaitingOT,   // 6
    MatchStateHockey.Overtime,     // 10
    MatchStateHockey.AwaitingPenalties, // 8
    MatchStateHockey.PenaltyShooting,   // 13
  ].includes(matchStatusId);
}

export const parseMatchDataArrayHockey = (
  matchDataString: string | null | undefined
): any[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }
  const matchDataArray = matchDataString?.split('!!');

  const matches = matchDataArray.map(matchString => {
    const matchDetails = matchString.split('^');
    return {
      id: matchDetails[0],
      startTimestamp: Number(matchDetails[1]),
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
        short_name: matchDetails[8],
        tier: matchDetails[9]
      },
      status: convertStatusCodeHockey(Number(matchDetails[10])),
      homeTeam: {
        id: matchDetails[11],
        name: matchDetails[12],
        short_name: matchDetails[13],
        abbr: matchDetails[14],
        suffix: matchDetails[15],
        gender: matchDetails[16],
        national: matchDetails[17]
      },
      awayTeam: {
        id: matchDetails[18],
        name: matchDetails[19],
        short_name: matchDetails[20],
        abbr: matchDetails[21],
        suffix: matchDetails[22],
        gender: matchDetails[23],
        national: matchDetails[24]
      },
      timer: JSON.parse(matchDetails[25]),
      scores: JSON.parse(matchDetails[26]),
      serve: matchDetails[27],
      slug: matchDetails[28],
      season_id: matchDetails[29],
      venue: {
        name: matchDetails[30]
      }
    };
  });
  return matches;
};
export const nonActiveStates = [
  MatchStateHockey.Abandoned,
  MatchStateHockey.Ended,
  MatchStateHockey.AfterOT,
  MatchStateHockey.AfterPenalties,
  MatchStateHockey.Postponed,
  MatchStateHockey.Cancelled,
  MatchStateHockey.Interrupted,
  MatchStateHockey.CutInHalf,
  MatchStateHockey.ToBeDetermined
];

export const convertStatusCodeHockey = (statusCode: number): any => {
  switch (statusCode) {
    case -1:
      return {
        '-1': {
          code: -1,
          type: '',
          description: ''
        }
      };
    case MatchStateHockey.Abandoned:
      return {
        code: MatchStateHockey.Abandoned,
        description: 'abandoned',
        type: 'finished'
      };
    case MatchStateHockey.NotStarted:
      return {
        code: MatchStateHockey.NotStarted,
        description: 'not_started',
        type: 'not_started'
      };
    case MatchStateHockey.FirstPeriod:
      return {
        code: MatchStateHockey.FirstPeriod,
        description: '1st_period',
        type: 'inprogress'
      };
    case MatchStateHockey.FirstPause:
      return {
        code: MatchStateHockey.FirstPause,
        description: '1st_pause',
        type: 'inprogress'
      };
    case MatchStateHockey.SecondPeriod:
      return {
        code: MatchStateHockey.SecondPeriod,
        description: '2nd_period',
        type: 'inprogress'
      };
    case MatchStateHockey.SecondPause:
      return {
        code: MatchStateHockey.SecondPause,
        description: '2nd_pause',
        type: 'inprogress'
      };
    case MatchStateHockey.ThirdPeriod:
      return {
        code: MatchStateHockey.ThirdPeriod,
        description: '3rd_period',
        type: 'inprogress'
      };
    case MatchStateHockey.Ended:
      return {
        code: MatchStateHockey.Ended,
        description: 'ended',
        type: 'finished'
      };
    case MatchStateHockey.AwaitingOT:
      return {
        code: MatchStateHockey.AwaitingOT,
        description: 'awaiting_ot',
        type: 'inprogress'
      };
    case MatchStateHockey.Overtime:
      return {
        code: MatchStateHockey.Overtime,
        description: 'overtime',
        type: 'inprogress'
      };
    case MatchStateHockey.AfterOT:
      return {
        code: MatchStateHockey.AfterOT,
        description: 'after_ot',
        type: 'finished'
      };
    case MatchStateHockey.AwaitingPenalties:
      return {
        code: MatchStateHockey.AwaitingPenalties,
        description: 'awaiting_penalties',
        type: 'inprogress'
      };
    case MatchStateHockey.PenaltyShooting:
      return {
        code: MatchStateHockey.PenaltyShooting,
        description: 'penalty_shooting',
        type: 'inprogress'
      };
    case MatchStateHockey.AfterPenalties:
      return {
        code: MatchStateHockey.AfterPenalties,
        description: 'after_penalties',
        type: 'finished'
      };
    case MatchStateHockey.Postponed:
      return {
        code: MatchStateHockey.Postponed,
        description: 'postponed',
        type: 'not_started'
      };
    case MatchStateHockey.Delayed:
      return {
        code: MatchStateHockey.Delayed,
        description: 'delayed',
        type: 'not_started'
      };
    case MatchStateHockey.Cancelled:
      return {
        code: MatchStateHockey.Cancelled,
        description: 'cancelled',
        type: 'finished'
      };
    case MatchStateHockey.Interrupted:
      return {
        code: MatchStateHockey.Interrupted,
        description: 'interrupted',
        type: 'inprogress'
      };
    case MatchStateHockey.CutInHalf:
      return {
        code: MatchStateHockey.CutInHalf,
        description: 'cut_in_half',
        type: 'inprogress'
      };
    case MatchStateHockey.ToBeDetermined:
      return {
        code: MatchStateHockey.ToBeDetermined,
        description: 'to_be_determined',
        type: 'not_started'
      };
    default:
      return {
        code: statusCode,
        description: 'unknown',
        type: 'unknown'
      };
  }
};

export const checkMatchStatus = (code: number) => {
  // Kiểm tra nếu trạng thái trận đấu là 'NotStarted'
  return code === MatchStateHockey.NotStarted;
};
// Format time trạng thái trận đấu (List) - hockey
export const formatTimeHockey = (code: number) => {
  switch (code) {
    case MatchStateHockey.Abandoned:
      return 'Abandoned';
    case MatchStateHockey.Ended:
      return 'FT';
    case MatchStateHockey.CutInHalf:
      return 'Cut';
    case MatchStateHockey.ToBeDetermined:
      return 'Pending';
    case MatchStateHockey.Interrupted:
      return 'Interrupted';
    case MatchStateHockey.Postponed:
      return 'Postponed';
    case MatchStateHockey.Cancelled:
      return 'Cancelled';
    case MatchStateHockey.FirstPeriod:
      return `Q1 Ended`;
    case MatchStateHockey.SecondPeriod:
      return `Q2 Ended`;
    case MatchStateHockey.ThirdPeriod:
      return `Q3 Ended`;
    case MatchStateHockey.Overtime:
      return 'OT';
    case MatchStateHockey.FirstPause:
    case MatchStateHockey.SecondPause:
    case MatchStateHockey.AwaitingOT:
    case MatchStateHockey.AwaitingPenalties:
    case MatchStateHockey.PenaltyShooting:
      return "Live'";
    default:
      return false;
  }
};

// Format time trạng thái trận đấu (List) - basket ball
export const getCurrentRound = (code: MatchStateHockey) => {
  switch (code) {
    case MatchStateHockey.FirstPeriod:
      return 'Q1';
    case MatchStateHockey.SecondPeriod:
      return 'Q2';
    case MatchStateHockey.ThirdPeriod:
      return 'Q3';
    case MatchStateHockey.Overtime:
      return 'OT';
    default:
      return '';
  }
};

export const isInProgessMatchHockey = (code: number) => {
  return (
    code === MatchStateHockey.FirstPeriod ||
    code === MatchStateHockey.SecondPeriod ||
    code === MatchStateHockey.ThirdPeriod ||
    code === MatchStateHockey.Overtime
  )
}

export const isInProgessPausedMatchHockey = (code: number) => {
  return (
    code === MatchStateHockey.FirstPause ||
    code === MatchStateHockey.SecondPause ||
    code === MatchStateHockey.AwaitingOT ||
    code === MatchStateHockey.AwaitingPenalties ||
    code === MatchStateHockey.PenaltyShooting
  );
};
// Format time trạng thái trận đấu - ghi chi tiết (details) - hockey
export const formatTime_sub = (code: number) => {
  switch (code) {
    case MatchStateHockey.Abandoned:
      return 'Abandoned';
    case MatchStateHockey.Ended:
      return 'FT';
    case MatchStateHockey.CutInHalf:
      return 'Cut';
    case MatchStateHockey.ToBeDetermined:
      return 'Pending';
    case MatchStateHockey.Interrupted:
      return 'Interrupted';
    case MatchStateHockey.Postponed:
      return 'Postponed';
    case MatchStateHockey.Cancelled:
      return 'Cancelled';
    case MatchStateHockey.FirstPeriod:
      return `P1`;
    case MatchStateHockey.SecondPeriod:
      return `P2`;
    case MatchStateHockey.ThirdPeriod:
      return `P3`;
    case MatchStateHockey.Overtime:
      return 'OT';
    case MatchStateHockey.FirstPause:
      return 'P1 Ended';
    case MatchStateHockey.SecondPause:
      return 'P2 Ended';
    case MatchStateHockey.AwaitingOT:
      return 'AwaitingOT';
    case MatchStateHockey.AwaitingPenalties:
      return 'AwaitingPenalties';
    case MatchStateHockey.PenaltyShooting:
      return 'Shootout';
    case MatchStateHockey.Delayed:
      return 'Delayed';
    case MatchStateHockey.AfterOT:
      return 'AOT';
    case MatchStateHockey.AfterPenalties:
      return 'ASO';
    default:
      return '';
  }
};

export const isMatchesPausedHockey = (statusCode: number): boolean => {
  return [MatchStateHockey.FirstPause, MatchStateHockey.SecondPause, MatchStateHockey.AwaitingOT, MatchStateHockey.AwaitingPenalties, MatchStateHockey.PenaltyShooting].includes(statusCode);
};

export const isMatchesEndedHockey = (statusCode: number): boolean => {
  switch (statusCode) {
    case MatchStateHockey.Ended:
    case MatchStateHockey.Abandoned:
    case MatchStateHockey.CutInHalf:
    case MatchStateHockey.ToBeDetermined:
    case MatchStateHockey.Interrupted:
    case MatchStateHockey.Postponed:
    case MatchStateHockey.Cancelled:
    case MatchStateHockey.AfterOT:
    case MatchStateHockey.AfterPenalties:
      return true;
    default:
      return false;
  }
};

export const isMatchNotStartedHockey = (statusCode: number): boolean => {
  switch (statusCode) {
    case MatchStateHockey.NotStarted:
    case MatchStateHockey.Postponed:
    case MatchStateHockey.ToBeDetermined:
      return true;
    default:
      return false;
  }
}

export const isMatchesHaveScoreHockey = (statusCode: number): boolean => {
  switch (statusCode) {
    case MatchStateHockey.Ended:
    case MatchStateHockey.Abandoned:
    case MatchStateHockey.CutInHalf:
    case MatchStateHockey.ToBeDetermined:
    case MatchStateHockey.Interrupted:
    case MatchStateHockey.Postponed:
    case MatchStateHockey.Cancelled:
    case MatchStateHockey.AfterOT:
    case MatchStateHockey.AfterPenalties:
    case MatchStateHockey.FirstPeriod:
    case MatchStateHockey.SecondPeriod:
    case MatchStateHockey.ThirdPeriod:
    case MatchStateHockey.Overtime:
    case MatchStateHockey.FirstPause:
    case MatchStateHockey.SecondPause:
    case MatchStateHockey.AwaitingOT:
    case MatchStateHockey.AwaitingPenalties:
    case MatchStateHockey.PenaltyShooting:
      return true;
    default:
      return false;
  }
}


export const filterMatchesHockey = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  dateFilter: Date,
  filterMobile: string
): SportEventDtoWithStat[] => {
  const today = new Date();

  const matchEndedStates = [
    MatchStateHockey.Abandoned,
    MatchStateHockey.Interrupted,
    MatchStateHockey.Cancelled,
    MatchStateHockey.CutInHalf,
    MatchStateHockey.ToBeDetermined,
    MatchStateHockey.Delayed,
    MatchStateHockey.Postponed,
  ]

  return matches.filter((match) => {
    const priority = parseInt(match?.uniqueTournament?.priority?.toString() || '1001', 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const isMatchHot = match?.uniqueTournament?.priority && priority < mapMatchPriority[SPORT.ICE_HOCKEY];
    const matchEnded = isMatchesEndedHockey(match.status?.code);
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

export function formatMatchTimestampHockey(
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

export function genDisplayedTimeHockey(
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

  return generateDisplayStringHockey(
    status,
    minuteLive,
    i18n,
    matchDate,
    now,
    formattedDate
  );
}

function generateDisplayStringHockey(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (isInProgessMatchHockey(status.code)) {
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
