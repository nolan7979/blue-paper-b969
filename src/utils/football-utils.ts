import {
  addWeeks,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInHours,
  differenceInMinutes,
  differenceInYears,
  endOfWeek,
  format,
  isSameDay,
  isSameYear,
  isThisWeek,
  isToday,
  isTomorrow,
  isWithinInterval,
  startOfWeek,
} from 'date-fns';
import tw from 'twin.macro';

import {
  MatchOdd,
  MatchState,
  SportEventDtoWithStat,
  StatusDto,
} from '@/constant/interface';
import {
  getDateFromTimestamp,
  getSlug,
  handleFutureMatchDateComparisons,
  isValEmpty,
} from '@/utils/common-utils';
import { convertStatusCode } from '@/utils/convertInterface';
import { Goal2GoalCn, oTool } from '@/utils/odds-utils';

import useTrans from '@/hooks/useTrans';
import en from '~/lang/en';
import vi from '~/lang/vi';

export function convertMonthStringToTimestamp(monthString: string) {
  const year = parseInt(monthString.substring(0, 4));
  const month = parseInt(monthString.substring(4));
  const date = new Date(Date.UTC(year, month - 1, 1));
  return Math.floor(date.getTime() / 1000);
}

export function calculateInjuryPercentage(injuryEvent: any) {
  // Convert timestamp to a Date object
  const injuryStart = new Date(injuryEvent.timestamp * 1000); // Convert to milliseconds
  const injuryEnd = new Date(
    (injuryEvent.timestamp + parseInt(injuryEvent.value)) * 1000
  );

  // Determine the year of the injury event
  const injuryYear = injuryStart.getFullYear();

  // Calculate the start and end of the year
  const yearStart = new Date(injuryYear, 0, 1);
  const yearEnd = new Date(injuryYear + 1, 0, 1);

  // Ensure that the injury event falls within the year's timeframe
  if (injuryStart < yearEnd && injuryEnd > yearStart) {
    // Calculate the number of days of injury within the year's timeframe
    const intersectionStart = Math.max(
      injuryStart.getTime(),
      yearStart.getTime()
    );
    const intersectionEnd = Math.min(injuryEnd.getTime(), yearEnd.getTime());
    const totalInjuryTime =
      (intersectionEnd - intersectionStart) / (24 * 60 * 60 * 1000); // Convert to days
    const totalYearDays =
      (yearEnd.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000); // Convert to days
    const percentage = (totalInjuryTime / totalYearDays) * 100;

    // Làm tròn phần trăm xuống và lấy phần nguyên
    const roundedPercentage = Math.floor(percentage);
    return roundedPercentage.toString(); // Chuyển đổi kết quả thành chuỗi
  }

  return '0'; // No injury during the year, trả về số 0 dưới dạng chuỗi
}

export function calculateLeftTimeStamp(
  startTimestamp: number,
  endTimestamp: number,
  now: number
) {
  const percentage =
    ((now - startTimestamp) / (endTimestamp - startTimestamp)) * 100;

  // Làm tròn phần trăm xuống và lấy phần nguyên
  const roundedPercentage = Math.floor(percentage);

  return roundedPercentage - 0.5;
}

export function getAgeFromTimestamp(timestamp: number) {
  if (!timestamp) return 0;

  const potentialDate = new Date(timestamp);
  const dateNow = new Date();

  if (potentialDate.getFullYear() <= 1970) {
    timestamp = timestamp * 1000;
  }

  const birthDate = new Date(timestamp);
  return differenceInYears(dateNow, birthDate);
}

export const calTeamAvgAge = (players = [] as any) => {
  let totalAge = 0;
  let numStarters = 0;
  for (const player of players) {
    if (player.player?.dateOfBirthTimestamp) {
      totalAge += getAgeFromTimestamp(player.player?.dateOfBirthTimestamp);
      numStarters += 1;
    }
  }

  const averageAge = totalAge / (numStarters === 0 ? 1 : numStarters);
  const avgAge = Number(Number(averageAge).toFixed(1));

  return avgAge;
};

export function calAverageAge(players: any[]): number {
  let totalAge = 0;
  let numStarters = 0;
  for (const playerRecord of players) {
    const player = playerRecord.player || {};
    const isStarter = playerRecord.substitute === false;
    if (isStarter) {
      totalAge += getAgeFromTimestamp(player && player.dateOfBirthTimestamp);
      numStarters += 1;
    }
  }

  const averageAge = totalAge / (numStarters === 0 ? 1 : numStarters);
  const avgAge = Number(Number(averageAge).toFixed(1));

  return avgAge;
}

export function calTeamRating(players: any[]) {
  let totalRating = 0;
  let numRatings = 0;
  for (const playerRecord of players) {
    let rating = playerRecord.statistics?.rating || playerRecord.rating;
    rating = parseFloat(rating);
    if (rating) {
      totalRating += rating;
      numRatings += 1;
    }
  }

  let avgRating = totalRating / (numRatings === 0 ? 1 : numRatings);
  avgRating = Number(Number(avgRating).toFixed(1));

  return avgRating;
}

export function splitSquad(formation: string, players: any[]) {
  if (isValEmpty(formation) || isValEmpty(players)) return [];

  const playLines = formation.split('-').map(Number);

  const linePlayers = [[players[0]]];
  players = players.slice(1);
  for (const line of playLines) {
    linePlayers.push(players.slice(0, line));
    players = players.slice(line);
  }

  return linePlayers;
}

export function parseStatsVal(statistic: string) {
  if (isValEmpty(statistic)) return statistic;
  const match = `${statistic}`.match(/(\d+(\.\d+)?)(?=%|\))/);
  if (!match) {
    return statistic;
  }
  return Number(match[1]);
}

export function filterDifferentDate(matches: any[], date: any) {
  return matches.filter((match: any) => {
    const startDate = getDateFromTimestamp(match.startTimestamp);
    // if (!isSameDay(date, startDate)) {
    const matchDate = format(startDate, 'yyyy-MM-dd');
    const filterDate = format(date, 'yyyy-MM-dd');
    const isOlderDate = matchDate !== filterDate && matchDate < filterDate;
    if (isOlderDate) {
      return false;
    } else {
      return true;
    }
  });
}

export function filterOlderDateAndFinished(matches: any[], date: any) {
  return matches.filter((match: any) => {
    const startDate = getDateFromTimestamp(match.startTimestamp);

    if (!isSameDay(date, startDate) && startDate < date) {
      // remove older dates
      return false;
    } else {
      // only filter older date if date is today
      if (match.status?.code >= 60 && isToday(date)) {
        return false;
      }
      return true;
    }
  });
}

export function filterOlderDate(matches: any[], date: any) {
  return matches.filter((match: any) => {
    const startDate = getDateFromTimestamp(match.startTimestamp);
    if (!isSameDay(date, startDate) && startDate < date) {
      return false;
    }
    return true;
  });
}

export function filterFutureDate(matches: any[], date: any) {
  return matches.filter((match: any) => {
    const startDate = getDateFromTimestamp(match.startTimestamp);

    if (!isSameDay(date, startDate) && date < startDate) {
      // remove future dates
      return false;
    } else {
      // only filter older date if date is today
      // if (match.status?.code >= 91 && isToday(date)) { // walkover match
      //   return false;
      // }

      return true;
    }
  });
}

export function formatMatchTimestamp(
  timestamp = 0,
  status: any,
  isByTime = false,
  startTime?: number,
  type?: string
) {
  if (status && Object.keys(status).length === 0) return ['', ''];

  try {
    let minuteLive;
    if (startTime && startTime > 0) {
      const currentTimeStamp = Math.ceil(Date.now() / 1000);

      const timeDifferenceInSeconds = currentTimeStamp - startTime;

      minuteLive = Math.ceil(timeDifferenceInSeconds / 60);

      if (status.code === 5 && minuteLive > 45) {
        minuteLive = `45+`;
      } else if (status.code === 7) {
        minuteLive += 45;

        if (minuteLive > 90) {
          minuteLive = `90+`;
        }
      }
      if (status.code == 6) {
        minuteLive = 'HT';
      }

      if (status.code == 100) {
        minuteLive = 'FT';
      }

      if (status.code == 14) {
        minuteLive = 'ET';
      }
      if (status.code == 110) {
        minuteLive = 'AET';
      }
      if (status.code == 120) {
        minuteLive = 'AP';
      }
    }

    if (status.code == 100) {
      minuteLive = 'FT';
    }

    if (status.code == 6) {
      minuteLive = 'HT';
    }

    if (status.code == 14) {
      minuteLive = 'ET';
    }

    if (status.code == 110) {
      minuteLive = 'AET';
    }
    if (status.code == 120) {
      minuteLive = 'AP';
    }
    if (status.code == -1) {
      minuteLive = '-';
    }

    const date = new Date(timestamp * 1000);

    date.setHours(date.getHours());

    let formattedDate = format(date, 'dd/MM');
    if (!isSameYear(date, new Date())) {
      formattedDate = format(date, 'dd/MM/yy');
    }
    const formattedTime = format(date, 'HH:mm');

    const statusMap: { [key: string]: [string, string] } = {
      not_started: isToday(date)
        ? [formattedTime, isByTime ? formattedTime : '-']
        : [formattedDate, formattedTime],
      inprogress: [
        formattedTime,
        `${minuteLive
          ? typeof minuteLive === 'number'
            ? `${minuteLive}`
            : minuteLive
          : '0'
        }`,
      ],

      penalties: [formattedTime, 'Penalties'],
      interrupted: isToday(date)
        ? [formattedTime, 'Interrupted']
        : [formattedDate, 'Interrupted'],
      postponed: isToday(date)
        ? [formattedTime, 'Postponed']
        : [formattedDate, 'Postponed'],
      cancelled: isToday(date)
        ? [formattedTime, 'Cancelled']
        : [formattedDate, 'Cancelled'],
      AET: isToday(date)
        ? [formattedTime, 'AET']
        : [formattedDate, 'AET'],
      AP: isToday(date)
        ? [formattedTime, 'AP']
        : [formattedDate, 'AP'],
      finished: isToday(date)
        ? [formattedTime, 'FT']
        : [formattedDate, 'FT'],
    };

    let statusType = status.type;
    if (status.code == 70) {
      statusType = 'cancelled';
    } else if (status.code == 15) {
      statusType = 'interrupted';
    } else if (status.code == 13) {
      statusType = 'penalties';
    } else if (status.code == 100) {
      statusType = 'finished';
    } else if (status.code == 110) {
      statusType = 'AET';
    } else if (status.code == 120) {
      statusType = 'AP';
    } else if (status.code == -1) {
      statusType = 'cancelled';
    }
    //when type is time, return only time
    const isMatchPast = status.code >= 60 && status.code <= 120;
    return type === 'time' && isMatchPast ? [formattedTime] : statusMap[statusType];
  } catch (err) {
    console.error(err);
    return ['', ''];
  }
}

const locales: any = { locale: { options: { weekStartsOn: 1 } } };

export function genDisplayedTime(
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

export function calculateMinuteLive(
  startTime: number | undefined,
  status: StatusDto,
  i18n: any = vi
): string | number {
  if (!startTime) return adjustMinuteLiveForStatus(0, status, i18n);
  const currentTimeStamp = Math.ceil(Date.now() / 1000);
  const timeDifferenceInSeconds = currentTimeStamp - startTime;
  const minuteLive = Math.ceil(timeDifferenceInSeconds / 60);
  return adjustMinuteLiveForStatus(minuteLive, status);
}

function adjustMinuteLiveForStatus(
  minuteLive: number,
  status: StatusDto,
  i18n: any = vi
): string | number {
  switch (status && status.code) {
    case MatchState.FirstHalf:
      return minuteLive > 45 ? '45+' : minuteLive;

    case MatchState.HalfTime:
      return 'HT';

    case MatchState.SecondHalf:
      minuteLive += 45;
      return minuteLive > 90 ? '90+' : minuteLive;

    case MatchState.OverTime:
      return i18n.status.overtime;

    case MatchState.PenaltyShootOut:
      return 'Penalties';

    default:
      return minuteLive;
  }
}

export function normalizeTimestamp(timestamp: number): number {
  if (timestamp)
    return timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
  return -1;
}

export function adjustMatchDateForTimezone(matchDate: Date): void {
  const offset = 7;
  matchDate.setHours(matchDate.getHours() + offset - 7);
}

export function formatMatchDate(matchDate: Date, now: Date): string {
  const formatString = isSameYear(matchDate, now)
    ? 'dd/MM HH:mm'
    : 'dd/MM/yyyy';
  return format(matchDate, formatString);
}

function generateDisplayString(
  status: StatusDto,
  minuteLive: string | number,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
) {
  if (status.code > 0 && status.code < 60) {
    return [formatMinuteLive(minuteLive)];
  } else if (status.code >= 60 && status.code < 100) {
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

export function formatMinuteLive(minuteLive: string | number): string {
  return `${['HT', 'FT', 'Overtime', 'Penalties'].includes(minuteLive.toString())
    ? minuteLive
    : `${minuteLive}'`
    }`;
}

// Implement this based on the original logic to handle match dates in the near future
export function generateUpcomingMatchString(
  status: StatusDto,
  i18n: any,
  matchDate: Date,
  now: Date,
  formattedDate: string
): string[] {

  const mapStatusToDescription: { [key: number]: string } = {
    [MatchState.NotStarted]: i18n.time.not_started,
    [MatchState.Cancel]: i18n.time.cancelled,
    [MatchState.Postponed]: i18n.time.postponed,
  };

  const i18nDescription =
    mapStatusToDescription[status?.code] ||
    i18n.time[status.type?.toLowerCase()] ||
    status.description;
  // If the match is today, display the time with a label indicating it's today.
  if (isSameDay(matchDate, now)) {
    return [
      i18nDescription,
      `${i18n.time.today} ${format(matchDate, 'HH:mm')}`,
      '',
    ];
  }
  // If the match is not today, return the formatted date and the i18n description.
  return [i18nDescription, formattedDate, ''];
}

function todayCase(matchDate: Date, now: Date, i18n: any, formattedDate: any) {
  const diffInHours = differenceInHours(matchDate, now);
  const diffInMinutes = differenceInMinutes(matchDate, now);

  if (diffInHours > 8) {
    return [
      `${i18n === en ? i18n.time.in : ''} ${diffInHours} ${i18n.time.hours_later
      }`,
      formattedDate,
      '',
    ];
  } else {
    return [
      format(matchDate, 'HH:mm'),
      `${i18n.time.today}`,
      (diffInHours >= 2 && `${diffInHours} ${i18n.time.hour_to_go}`) ||
      (diffInMinutes === 60 && `${diffInHours} ${i18n.time.hour_to_go}`) ||
      (diffInHours >= 1 &&
        diffInMinutes > 60 &&
        `${diffInHours} ${i18n.time.hours} ${diffInMinutes % 60} ${i18n.time.minute_to_go
        }`) ||
      (diffInMinutes >= 1 && `${diffInMinutes} ${i18n.time.minute_to_go}`) ||
      (diffInMinutes < 1 && diffInMinutes >= 0 && i18n.time.now) ||
      '',
    ];
  }
}

function tomorrowCase(
  matchDate: Date,
  now: Date,
  i18n: any,
  formattedDate: any
) {
  const diffInHours = differenceInHours(matchDate, now);

  if (diffInHours <= 24) {
    return [
      format(matchDate, 'HH:mm'),
      i18n.time.tomorrow,
      `${diffInHours} ${i18n.time.hour_to_go}`,
    ];
  }

  return [format(matchDate, 'HH:mm'), i18n.time.tomorrow, ''];
}

export function genStatusText(status: any, i18n: any = vi) {
  const { code = -1, description = '' } = status || {};
  const i18nDescription = i18n.time[description?.toLowerCase()] || description;

  if (code >= 60 && code < 100) {
    return i18nDescription;
  }

  return '';
}

export const NORMAL_COLORS = ['#fa8072', '#41c3ff', '#57A87B', '#D8BFD8'];
export const RELAGATION_COLORS = ['#EF5058', '#FEB936', '#FFFF00'];

// export const genColors = (type: string, color: string) => {
//   const csses = [
//     type === 'normal' && color === '0' && tw`bg-[#fa8072] text-black`,
//     type === 'normal' && color === '1' && tw`bg-[#41c3ff] text-black`,
//     type === 'normal' && color === '2' && tw`bg-[#09D8D7] text-black`,
//     type === 'normal' && color === '3' && tw`bg-[#D8BFD8] text-black`,
//     type === 'relegation' && color === '0' && tw`bg-[#EF5058] text-black`,
//     type === 'relegation' && color === '1' && tw`bg-[#FEB936] text-black`,
//     type === 'relegation' && color === '2' && tw`bg-[#FFFF00] text-black`,
//   ];

//   return csses;
// };

export const genBorderColors = (type: string, color: string) => {
  let csses;

  if (type === 'normal') {
    if (color === '0') {
      csses = tw`border-[#fa8072] border text-[#fa8072]`;
    } else if (color === '1') {
      csses = tw`border-[#41c3ff] border text-[#41c3ff]`;
    } else if (color === '2') {
      csses = tw`border-[#09D8D7] border text-[#09D8D7]`;
    } else if (color === '3') {
      csses = tw`border-[#D8BFD8] border text-[#D8BFD8]`;
    }
  } else if (type === 'relegation') {
    if (color === '0') {
      csses = tw`border-[#999999] border text-[#999999]`;
    } else if (color === '1') {
      csses = tw`border-[#FEB936] border text-[#FEB936]`;
    } else if (color === '2') {
      csses = tw`border-[#FFFF00] border text-[#FFFF00]`;
    }
  }

  return csses;
};

export const genColors = (type: string, color: string) => {
  let csses;

  if (type === 'normal') {
    if (color === '0') {
      csses = tw`bg-[#fa8072] text-black`;
    } else if (color === '1') {
      csses = tw`bg-[#41c3ff] text-black`;
    } else if (color === '2') {
      csses = tw`bg-[#09D8D7] text-black`;
    } else if (color === '3') {
      csses = tw`bg-[#D8BFD8] text-black`;
    }
  } else if (type === 'relegation') {
    if (color === '0') {
      csses = tw`bg-[#999999] text-black`;
    } else if (color === '1') {
      csses = tw`bg-[#FEB936] text-black`;
    } else if (color === '2') {
      csses = tw`bg-[#FFFF00] text-black`;
    }
  }

  return csses;
};

export function genRankingColors(standings: any[]) {
  const labelledStandings = standings.filter(
    (standing: any) => !isValEmpty(standing.promotion?.text)
  );

  const setOfPromotions = new Set();
  const normalPromotions = [];
  const relegationPromotions = [];

  for (const std of labelledStandings) {
    const { promotion = {} } = std;
    const { text, color } = promotion;

    if (setOfPromotions.has(text)) continue;

    setOfPromotions.add(text);
    if (text && text?.toLowerCase().includes('relega')) {
      relegationPromotions.push(text);
    } else {
      normalPromotions.push(text);
    }
  }

  const mapColor: Map<string, any> = new Map();
  for (const idx in normalPromotions) {
    const promotion = normalPromotions[idx];

    if (Number(idx) < NORMAL_COLORS.length) {
      mapColor.set(promotion, { type: 'normal', color: idx });
    } else {
      mapColor.set(promotion, {
        type: 'normal',
        color: NORMAL_COLORS.length - 1,
      });
    }
  }

  const len = relegationPromotions.length;
  const releColors = RELAGATION_COLORS.slice(0, len).reverse();
  for (const idx in relegationPromotions) {
    const promotion = relegationPromotions[len - Number(idx) - 1];

    if (Number(idx) < releColors.length) {
      mapColor.set(promotion, { type: 'relegation', color: idx });
    } else {
      mapColor.set(promotion, {
        type: 'relegation',
        color: releColors.length - 1,
      });
    }
  }

  const rankingColors = new Map(mapColor);

  return rankingColors;
}

export const getSeasonNotes = (rankingColors: any) => {
  const seasonNotes: any[] = [];
  for (const [key, value] of rankingColors.entries()) {
    const csses = genColors(value.type, value.color);
    seasonNotes.push({
      text: key,
      color: csses,
    });
  }

  return seasonNotes;
};

const keysMapping: any = {
  chancesCreated: {
    en: 'Chances Created',
    vi: 'Cơ hội tạo ra',
  },
  clearances: {
    en: 'Clearances',
    vi: 'Phá bóng',
  },
  dribble: {
    en: 'Dribble',
    vi: 'Số lần dẫn bóng',
  },
  dribbleSucc: {
    en: 'Dribble Success',
    vi: ' Số lần dẫn bóng thành công',
  },
  passes: {
    en: 'Passes',
    vi: 'Chuyền bóng',
  },
  cornerKicks: {
    en: 'Corner Kicks',
    vi: 'Phạt góc',
  },
  crossesSuccessful: {
    en: 'Crosses Successful',
    vi: 'Bóng băng qua thành công',
  },
  crossesTotal: {
    en: 'Crosses Total',
    vi: 'Tổng số bóng băng qua',
  },
  defensiveBlocks: {
    en: 'Defensive Blocks',
    vi: 'Phá bóng phòng ngự',
  },
  divingSaves: {
    en: 'Diving Saves',
    vi: 'Cứu thua bằng cú nhảy',
  },
  dribblesCompleted: {
    en: 'Dribbles Completed',
    vi: 'Qua người thành công',
  },
  foulsCommitted: {
    en: 'Fouls Committed',
    vi: 'Phạm lỗi',
  },
  goalsByHead: {
    en: 'Goals By Head',
    vi: 'Bàn thắng bằng đầu',
  },
  goalsByPenalty: {
    en: 'Goals By Penalty',
    vi: 'Bàn thắng bằng penalty',
  },
  penalty: {
    en: 'Penalty',
    vi: 'Phạt đền',
  },
  interceptions: {
    en: 'Interceptions',
    vi: 'Cắt bóng',
  },
  longPassesSuccessful: {
    en: 'Long Passes Successful',
    vi: 'Bóng dài thành công',
  },
  longPassesTotal: {
    en: 'Long Passes Total',
    vi: 'Tổng số bóng dài',
  },
  longPassesUnsuccessful: {
    en: 'Long Passes Unsuccessful',
    vi: 'Bóng dài không thành công',
  },
  lossOfPossession: {
    en: 'Loss Of Possession',
    vi: 'Mất bóng',
  },
  offsides: {
    en: 'Offsides',
    vi: 'Việt vị',
  },
  passesSuccessful: {
    en: 'Passes Successful',
    vi: 'B passes Unsuccessfulbóng thành công',
  },
  passesTotal: {
    en: 'Passes Total',
    vi: 'Tổng số bóng',
  },
  passesUnsuccessful: {
    en: 'Passes Unsuccessful',
    vi: 'Bóng không thành công',
  },
  penaltiesFaced: {
    en: 'Penalties Faced',
    vi: 'Số penalty đối mặt',
  },
  penaltiesMissed: {
    en: 'Penalties Missed',
    vi: 'Sút penalty không thành công',
  },
  penaltiesSaved: {
    en: 'Penalties Saved',
    vi: 'Cản penalty',
  },
  shotsBlocked: {
    en: 'Shots Blocked',
    vi: 'Cản bóng',
  },
  shotsFacedSaved: {
    en: 'Shots Faced Saved',
    vi: 'Cản bóng cứu thua',
  },
  shotsFacedTotal: {
    en: 'Shots Faced Total',
    vi: 'Tổng số cú sút đối mặt',
  },
  rating: {
    en: 'Rating',
    vi: 'Điểm',
  },
  goals: {
    en: 'Goals',
    vi: 'Số bàn thắng',
  },
  assists: {
    en: 'Assists',
    vi: 'Hỗ trợ',
  },
  goalsAssistsSum: {
    en: 'Goals Assists Sum',
    vi: 'Tổng số bàn thắng và hỗ trợ',
  },
  penaltyGoals: {
    en: 'Penalty Goals',
    vi: 'Số bàn thắng từ penalty',
  },
  freeKickGoal: {
    en: 'Free Kick Goal',
    vi: 'Bàn thắng từ đá phạt',
  },
  scoringFrequency: {
    en: 'Scoring Frequency',
    vi: 'Tần suất ghi bàn',
  },
  totalShots: {
    en: 'Total Shots',
    vi: 'Tổng cú sút',
  },
  shotsOnTarget: {
    en: 'Shots On Target',
    vi: 'Cú sút trúng đích',
  },
  bigChancesMissed: {
    en: 'Big Chances Missed',
    vi: 'Cơ hội lớn bị bỏ lỡ',
  },
  bigChancesCreated: {
    en: 'Big Chances Created',
    vi: 'Cơ hội lớn được tạo ra',
  },
  accuratePasses: {
    en: 'Accurate Passes',
    vi: 'Số đường chuyền chính xác',
  },
  keyPasses: {
    en: 'Key Passes',
    vi: 'Đường chuyền quyết định',
  },
  accurateLongBalls: {
    en: 'Accurate Long Balls',
    vi: 'Số đường chuyền xa chính xác',
  },
  successfulDribbles: {
    en: 'Successful Dribbles',
    vi: 'Dribble thành công',
  },
  penaltyWon: {
    en: 'Penalty Won',
    vi: 'Phạt đền được thắng',
  },
  tackles: {
    en: 'Tackles',
    vi: 'Phá bóng',
  },
  possessionLost: {
    en: 'Possession Lost',
    vi: 'Mất bóng',
  },
  yellowCards: {
    en: 'Yellow Cards',
    vi: 'Thẻ vàng',
  },
  redCards: {
    en: 'Red Cards',
    vi: 'Thẻ đỏ',
  },
  saves: {
    en: 'Saves',
    vi: 'Saves',
  },
  mostConceded: {
    en: 'Most Conceded',
    vi: 'Nhiều bàn thua nhất',
  },
  leastConceded: {
    en: 'Least Conceded',
    vi: 'Ít bàn thua nhất',
  },
  cleanSheet: {
    en: 'Clean Sheet',
    vi: 'Giữ sạch lưới',
  },
  goalAssist: {
    en: 'Goal Assist',
    vi: 'Hỗ trợ ghi bàn',
  },
  expectedAssists: {
    en: 'Expected Assists',
    vi: 'Dự đoán hỗ trợ',
  },
  expectedGoals: {
    en: 'Expected Goals',
    vi: 'Dự đoán bàn thắng',
  },
  errorLeadToAGoal: {
    en: 'Error Lead To A Goal',
    vi: 'Lỗi dẫn đến bàn thắng',
  },
  bigChanceMissed: {
    en: 'Big Chance Missed',
    vi: 'Cơ hội lớn bị bỏ lỡ',
  },
  bigChanceCreated: {
    en: 'Big Chance Created',
    vi: 'Cơ hội lớn được tạo ra',
  },
  keyPass: {
    en: 'Key Pass',
    vi: 'Đường chuyền quyết định',
  },
  accuratePass: {
    en: 'Accurate Pass',
    vi: 'Đường chuyền chính xác',
  },
  totalPass: {
    en: 'Total Pass',
    vi: 'Tổng số đường chuyền',
  },
  wonContest: {
    en: 'Won Contest',
    vi: 'Thắng cuộc tranh chấp',
  },
  totalTackle: {
    en: 'Total Tackle',
    vi: 'Tổng số lần tranh chấp',
  },
  totalClearance: {
    en: 'Total Clearance',
    vi: 'Tổng số lần phá bóng',
  },
  goalsPrevented: {
    en: 'Goals Prevented',
    vi: 'Ngăn chặn bàn thắng',
  },
  penaltySave: {
    en: 'Penalty Save',
    vi: 'Cản phạt đền',
  },
  penaltyMiss: {
    en: 'Penalty Miss',
    vi: 'Phạt đền bị bỏ lỡ',
  },
  avgRating: {
    en: 'Average Rating',
    vi: 'Điểm trung bình',
  },
  goalsScored: {
    en: 'Goals Scored',
    vi: 'Số bàn thắng',
  },
  goalsConceded: {
    en: 'Goals Conceded',
    vi: 'Số bàn thua',
  },
  bigChances: {
    en: 'Big Chances',
    vi: 'Cơ hội lớn',
  },
  hitWoodwork: {
    en: 'Hit Woodwork',
    vi: 'Dội xà ngang',
  },
  averageBallPossession: {
    en: 'Average Ball Possession',
    vi: 'Quản lý bóng trung bình',
  },
  accurateCrosses: {
    en: 'Accurate Crosses',
    vi: 'Bóng qua đích chính xác',
  },
  shots: {
    en: 'Shots',
    vi: 'Cú sút',
  },
  corners: {
    en: 'Corners',
    vi: 'Phạt góc',
  },
  fouls: {
    en: 'Fouls',
    vi: 'Lỗi vi phạm',
  },
  penaltyGoalsConceded: {
    en: 'Penalty Goals Conceded',
    vi: 'Bàn thắng từ đá phạt đền thủ mất',
  },
  cleanSheets: {
    en: 'Clean Sheets',
    vi: 'Trận giữ lưới không bị đục lưới',
  },
  totalLongBalls: {
    en: 'Total Long Balls',
    vi: 'Tổng số đường bóng xa',
  },
  aerialLost: {
    en: 'Aerial Duels Lost',
    vi: 'Tran chấp không thành công',
  },
  duelLost: {
    en: 'Duels Lost',
    vi: 'Tran đấu không thành công',
  },
  duelWon: {
    en: 'Duels Won',
    vi: 'Tran đấu thành công',
  },
  challengeLost: {
    en: 'Challenges Lost',
    vi: 'Thách thức thất bại',
  },
  totalContest: {
    en: 'Total Contests',
    vi: 'Tổng số tran đấu',
  },
  onTargetScoringAttempt: {
    en: 'On Target Scoring Attempts',
    vi: 'Cơ hội ghi bàn trúng đích',
  },
  outfielderBlock: {
    en: 'Outfielder Blocks',
    vi: 'Cầu thủ ngoài sân chặn',
  },
  interceptionWon: {
    en: 'Interceptions Won',
    vi: 'Bóng chặn thành công',
  },
  wasFouled: {
    en: 'Was Fouled',
    vi: 'Bị phạm lỗi',
  },
  minutesPlayed: {
    en: 'Minutes Played',
    vi: 'Phút thi đấu',
  },
  touches: {
    en: 'Touches',
    vi: 'Chạm bóng',
  },
  possessionLostCtrl: {
    en: 'Possessions Lost Control',
    vi: 'Mất kiểm soát bóng',
  },
  ratingVersions: {
    en: 'Rating Versions',
    vi: 'Phiên bản xếp hạng',
  },
  totalCross: {
    en: 'Total Crosses',
    vi: 'Tổng số bóng qua đích',
  },
  accurateCross: {
    en: 'Accurate Crosses',
    vi: 'Bóng qua đích chính xác',
  },
  dispossessed: {
    en: 'Dispossessed',
    vi: 'Mất bóng',
  },
  punches: {
    en: 'Punches',
    vi: 'Đấm bóng',
  },
  shotOffTarget: {
    en: 'Shot Off Target',
    vi: 'Cú sút không trúng đích',
  },
  aerialWon: {
    en: 'Aerial Duels Won',
    vi: 'Tran chấp thành công',
  },
  blockedScoringAttempt: {
    en: 'Blocked Scoring Attempt',
    vi: 'Cơ hội ghi bàn bị chặn',
  },
  goodHighClaim: {
    en: 'Good High Claim',
    vi: 'Chữa bóng cao tốt',
  },
  savedShotsFromInsideTheBox: {
    en: 'Saved Shots From Inside The Box',
    vi: 'Cứu bóng từ bên trong vòng cấm',
  },
  ownGoals: {
    en: 'Own Goals',
    vi: 'Bàn phản lưới nhà',
  },
  penaltiesTaken: {
    en: 'Penalties Taken',
    vi: 'Sút penalty',
  },
  freeKickGoals: {
    en: 'Free Kick Goals',
    vi: 'Bàn thắng từ đá phạt góc',
  },
  freeKickShots: {
    en: 'Free Kick Shots',
    vi: 'Cú sút từ đá phạt góc',
  },
  goalsFromInsideTheBox: {
    en: 'Goals from Inside the Box',
    vi: 'Bàn thắng từ bên trong vòng cấm',
  },
  goalsFromOutsideTheBox: {
    en: 'Goals from Outside the Box',
    vi: 'Bàn thắng từ bên ngoài vòng cấm',
  },
  shotsFromInsideTheBox: {
    en: 'Shots from Inside the Box',
    vi: 'Cú sút từ bên trong vòng cấm',
  },
  shotsFromOutsideTheBox: {
    en: 'Shots from Outside the Box',
    vi: 'Cú sút từ bên ngoài vòng cấm',
  },
  headedGoals: {
    en: 'Headed Goals',
    vi: 'Bàn thắng đánh đầu',
  },
  leftFootGoals: {
    en: 'Left Foot Goals',
    vi: 'Bàn thắng bằng chân trái',
  },
  rightFootGoals: {
    en: 'Right Foot Goals',
    vi: 'Bàn thắng bằng chân phải',
  },
  shotsOffTarget: {
    en: 'Shots off Target',
    vi: 'Cú sút không trúng đích',
  },
  dribbleAttempts: {
    en: 'Dribble Attempts',
    vi: 'Cố gắng đi bóng',
  },
  fastBreaks: {
    en: 'Fast Breaks',
    vi: 'Phản công nhanh',
  },
  fastBreakGoals: {
    en: 'Fast Break Goals',
    vi: 'Bàn thắng từ phản công nhanh',
  },
  fastBreakShots: {
    en: 'Fast Break Shots',
    vi: 'Cú sút trong phản công nhanh',
  },
  totalPasses: {
    en: 'Total Passes',
    vi: 'Tổng số đường chuyền',
  },
  accuratePassesPercentage: {
    en: 'Accurate Passes Percentage',
    vi: 'Tỷ lệ đường chuyền chính xác',
  },
  totalOwnHalfPasses: {
    en: 'Total Own Half Passes',
    vi: 'Tổng số đường chuyền ở nửa sân nhà',
  },
  accurateOwnHalfPasses: {
    en: 'Accurate Own Half Passes',
    vi: 'Đường chuyền ở nửa sân nhà chính xác',
  },
  accurateOwnHalfPassesPercentage: {
    en: 'Accurate Own Half Passes Percentage',
    vi: 'Tỷ lệ đường chuyền ở nửa sân nhà chính xác',
  },
  totalOppositionHalfPasses: {
    en: 'Total Opposition Half Passes',
    vi: 'Tổng số đường chuyền ở nửa sân đối phương',
  },
  accurateOppositionHalfPasses: {
    en: 'Accurate Opposition Half Passes',
    vi: 'Đường chuyền ở nửa sân đối phương chính xác',
  },
  accurateOppositionHalfPassesPercentage: {
    en: 'Accurate Opposition Half Passes Percentage',
    vi: 'Tỷ lệ đường chuyền ở nửa sân đối phương chính xác',
  },
  accurateLongBallsPercentage: {
    en: 'Accurate Long Balls Percentage',
    vi: 'Tỷ lệ đường chuyền xa chính xác',
  },
  totalCrosses: {
    en: 'Total Crosses',
    vi: 'Tổng số quả treo bóng',
  },
  accurateCrossesPercentage: {
    en: 'Accurate Crosses Percentage',
    vi: 'Tỷ lệ quả treo bóng chính xác',
  },
  errorsLeadingToGoal: {
    en: 'Errors Leading to Goal',
    vi: 'Lỗi dẫn đến bàn thắng',
  },
  errorsLeadingToShot: {
    en: 'Errors Leading to Shot',
    vi: 'Lỗi dẫn đến cú sút',
  },
  penaltiesCommitted: {
    en: 'Penalties Committed',
    vi: 'Số lần phạm lỗi dẫn đến penalty',
  },
  clearancesOffLine: {
    en: 'Clearances Off Line',
    vi: 'Cản phá trên vạch vôi',
  },
  lastManTackles: {
    en: 'Last Man Tackles',
    vi: 'Tackles cuối cùng',
  },
  totalDuels: {
    en: 'Total Duels',
    vi: 'Tổng số màn đối đầu',
  },
  duelsWon: {
    en: 'Duels Won',
    vi: 'Số lần đối đầu thành công',
  },
  duelsWonPercentage: {
    en: 'Duels Won Percentage',
    vi: 'Tỷ lệ đối đầu thành công',
  },
  totalGroundDuels: {
    en: 'Total Ground Duels',
    vi: 'Tổng số màn đối đầu trên mặt đất',
  },
  groundDuelsWon: {
    en: 'Ground Duels Won',
    vi: 'Số lần đối đầu trên mặt đất thành công',
  },
  groundDuelsWonPercentage: {
    en: 'Ground Duels Won Percentage',
    vi: 'Tỷ lệ đối đầu trên mặt đất thành công',
  },
  totalAerialDuels: {
    en: 'Total Aerial Duels',
    vi: 'Tổng số màn đối đầu không trung',
  },
  aerialDuelsWon: {
    en: 'Aerial Duels Won',
    vi: 'Số lần đối đầu không trung thành công',
  },
  aerialDuelsWonPercentage: {
    en: 'Aerial Duels Won Percentage',
    vi: 'Tỷ lệ đối đầu không trung thành công',
  },
  accurateFinalThirdPassesAgainst: {
    en: 'Accurate Final Third Passes Against',
    vi: 'Đường chuyền ở vùng cuối chính xác (đối phương)',
  },
  accurateOppositionHalfPassesAgainst: {
    en: 'Accurate Opposition Half Passes Against',
    vi: 'Đường chuyền ở nửa sân đối phương chính xác',
  },
  accurateOwnHalfPassesAgainst: {
    en: 'Accurate Own Half Passes Against',
    vi: 'Đường chuyền ở nửa sân nhà chính xác (đối phương)',
  },
  accuratePassesAgainst: {
    en: 'Accurate Passes Against',
    vi: 'Đường chuyền chính xác (đối phương)',
  },
  bigChancesAgainst: {
    en: 'Big Chances Against',
    vi: 'Cơ hội lớn (đối phương)',
  },
  bigChancesCreatedAgainst: {
    en: 'Big Chances Created Against',
    vi: 'Cơ hội lớn tạo ra (đối phương)',
  },
  bigChancesMissedAgainst: {
    en: 'Big Chances Missed Against',
    vi: 'Cơ hội lớn bị bỏ lỡ (đối phương)',
  },
  clearancesAgainst: {
    en: 'Clearances Against',
    vi: 'Cản phá (đối phương)',
  },
  cornersAgainst: {
    en: 'Corners Against',
    vi: 'Phạt góc (đối phương)',
  },
  crossesSuccessfulAgainst: {
    en: 'Successful Crosses Against',
    vi: 'Bóng bắt thành công sau các quả ném biên (đối phương)',
  },
  crossesTotalAgainst: {
    en: 'Total Crosses Against',
    vi: 'Tổng số quả ném biên (đối phương)',
  },
  dribbleAttemptsTotalAgainst: {
    en: 'Total Dribble Attempts Against',
    vi: 'Tổng số cố gắng đi bóng (đối phương)',
  },
  dribbleAttemptsWonAgainst: {
    en: 'Dribble Attempts Won Against',
    vi: 'Số lần đi bóng thành công (đối phương)',
  },
  errorsLeadingToGoalAgainst: {
    en: 'Errors Leading to Goal Against',
    vi: 'Lỗi dẫn đến bàn thua (đối phương)',
  },
  errorsLeadingToShotAgainst: {
    en: 'Errors Leading to Shot Against',
    vi: 'Lỗi dẫn đến cơ hội sút (đối phương)',
  },
  hitWoodworkAgainst: {
    en: 'Hit Woodwork Against',
    vi: 'Bóng đập xà ngang (đối phương)',
  },
  interceptionsAgainst: {
    en: 'Interceptions Against',
    vi: 'Cắt bóng (đối phương)',
  },
  keyPassesAgainst: {
    en: 'Key Passes Against',
    vi: 'Đường chuyền quyết định (đối phương)',
  },
  longBallsSuccessfulAgainst: {
    en: 'Successful Long Balls Against',
    vi: 'Bóng dài bắt thành công (đối phương)',
  },
  longBallsTotalAgainst: {
    en: 'Total Long Balls Against',
    vi: 'Tổng số bóng dài (đối phương)',
  },
  offsidesAgainst: {
    en: 'Offsides Against',
    vi: 'Việt vị (đối phương)',
  },
  redCardsAgainst: {
    en: 'Red Cards Against',
    vi: 'Thẻ đỏ (đối phương)',
  },
  shotsAgainst: {
    en: 'Shots Against',
    vi: 'Cú sút (đối phương)',
  },
  shotsBlockedAgainst: {
    en: 'Blocked Shots Against',
    vi: 'Cú sút bị chặn (đối phương)',
  },
  shotsFromInsideTheBoxAgainst: {
    en: 'Shots from Inside the Box Against',
    vi: 'Cú sút từ trong vùng cấm (đối phương)',
  },
  shotsFromOutsideTheBoxAgainst: {
    en: 'Shots from Outside the Box Against',
    vi: 'Cú sút từ ngoài vùng cấm (đối phương)',
  },
  shotsOffTargetAgainst: {
    en: 'Shots Off Target Against',
    vi: 'Cú sút không trúng mục tiêu (đối phương)',
  },
  shotsOnTargetAgainst: {
    en: 'Shots On Target Against',
    vi: 'Cú sút trúng mục tiêu (đối phương)',
  },
  blockedScoringAttemptAgainst: {
    en: 'Blocked Scoring Attempt Against',
    vi: 'Cố gắng ghi bàn bị chặn (đối phương)',
  },
  tacklesAgainst: {
    en: 'Tackles Against',
    vi: 'Cú vào bóng (đối phương)',
  },
  totalFinalThirdPassesAgainst: {
    en: 'Total Final Third Passes Against',
    vi: 'Tổng số đường chuyền vào vùng cuối (đối phương)',
  },
  oppositionHalfPassesTotalAgainst: {
    en: 'Total Opposition Half Passes Against',
    vi: 'Tổng số đường chuyền vào nửa sân đối phương (đối phương)',
  },
  ownHalfPassesTotalAgainst: {
    en: 'Total Own Half Passes Against',
    vi: 'Tổng số đường chuyền vào nửa sân nhà (đối phương)',
  },
  totalPassesAgainst: {
    en: 'Total Passes Against',
    vi: 'Tổng số đường chuyền (đối phương)',
  },
  yellowCardsAgainst: {
    en: 'Yellow Cards Against',
    vi: 'Thẻ vàng (đối phương)',
  },
  id: {
    en: 'ID',
    vi: 'ID',
  },
  matches: {
    en: 'Matches',
    vi: 'Trận đấu',
  },
  awardedMatches: {
    en: 'Awarded Matches',
    vi: 'Trận đấu được trao',
  },
  yellowRedCards: {
    en: 'Yellow Red Cards',
    vi: 'Thẻ vàng và thẻ đỏ',
  },
  successfulRunsOut: {
    en: 'Successful Runs Out',
    vi: 'Thoát bóng thành công',
  },
  highClaims: {
    en: 'High Claims',
    vi: 'Chặn bóng cao',
  },
  crossesNotClaimed: {
    en: 'Crosses Not Claimed',
    vi: 'Bóng qua không được chặn',
  },
  matchesStarted: {
    en: 'Matches Started',
    vi: 'Trận đấu bắt đầu',
  },
  penaltyConversion: {
    en: 'Penalty Conversion',
    vi: 'Chuyển đổi quả penalty',
  },
  setPieceConversion: {
    en: 'Set Piece Conversion',
    vi: 'Chuyển đổi cố định',
  },
  totalAttemptAssist: {
    en: 'Total Attempt Assist',
    vi: 'Tổng cố gắng hỗ trợ',
  },
  attemptPenaltyMiss: {
    en: 'Attempt Penalty Miss',
    vi: 'Cố gắng sút penalty không thành công',
  },
  attemptPenaltyPost: {
    en: 'Attempt Penalty Post',
    vi: 'Cố gắng sút penalty đưa bóng vào cột dọc',
  },
  attemptPenaltyTarget: {
    en: 'Attempt Penalty Target',
    vi: 'Cố gắng sút penalty trúng mục tiêu',
  },
  tacklesWon: {
    en: 'Tackles Won',
    vi: 'Tắc bóng thành công',
  },
  tacklesWonPercentage: {
    en: 'Tackles Won Percentage',
    vi: 'Tỷ lệ tắc bóng thành công',
  },
  savesCaught: {
    en: 'Saves Caught',
    vi: 'Cứu thua bắt trọn vẹn',
  },
  savesParried: {
    en: 'Saves Parried',
    vi: 'Cứu thua bật ra',
  },
  totwAppearances: {
    en: 'TOTW Appearances',
    vi: 'Sự xuất hiện trong Đội hình tiêu biểu tuần',
  },
  type: {
    en: 'Type',
    vi: 'Loại',
  },
  appearances: {
    en: 'Appearances',
    vi: 'Sự xuất hiện',
  },
  totalRating: {
    en: 'Total Rating',
    vi: 'Tổng điểm',
  },
  countRating: {
    en: 'Count Rating',
    vi: 'Đếm điểm',
  },
  inaccuratePasses: {
    en: 'Inaccurate Passes',
    vi: 'Chuyền không chính xác',
  },
  accurateFinalThirdPasses: {
    en: 'Accurate Final Third Passes',
    vi: 'Chuyền chính xác ở vùng cuối sân',
  },
  successfulDribblesPercentage: {
    en: 'Successful Dribbles Percentage',
    vi: 'Tỷ lệ dribble thành công',
  },
  directRedCards: {
    en: 'Direct Red Cards',
    vi: 'Thẻ đỏ trực tiếp',
  },
  totalDuelsWon: {
    en: 'Total Duels Won',
    vi: 'Tổng số tranh chấp thành công',
  },
  totalDuelsWonPercentage: {
    en: 'Total Duels Won Percentage',
    vi: 'Tỷ lệ tranh chấp thành công tổng cộng',
  },
  goalConversionPercentage: {
    en: 'Goal Conversion Percentage',
    vi: 'Tỷ lệ ghi bàn thành công',
  },
  penaltyConceded: {
    en: 'Penalty Conceded',
    vi: 'Phạm lỗi để đối thủ được penalty',
  },
  shotFromSetPiece: {
    en: 'Shot from Set Piece',
    vi: 'Sút từ tình huống cố định',
  },
  errorLeadToGoal: {
    en: 'Error Lead to Goal',
    vi: 'Lỗi dẫn đến bàn thắng',
  },
  errorLeadToShot: {
    en: 'Error Lead to Shot',
    vi: 'Lỗi dẫn đến cơ hội sút',
  },
  possessionWonAttThird: {
    en: 'Possession Won Attacking Third',
    vi: 'Giành quyền kiểm soát ở phần tấn công thứ ba',
  },
  totalChippedPasses: {
    en: 'Total Chipped Passes',
    vi: 'Tổng số đường chuyền ghi bàn',
  },
  accurateChippedPasses: {
    en: 'Accurate Chipped Passes',
    vi: 'Đường chuyền ghi bàn chính xác',
  },
  dribbledPast: {
    en: 'Dribbled Past',
    vi: 'Bị vượt qua khi đi bóng',
  },
  blockedShots: {
    en: 'Blocked Shots',
    vi: 'Cú sút bị chặn',
  },
  passToAssist: {
    en: 'Pass to Assist',
    vi: 'Đường chuyền ghi bàn',
  },
  penaltyFaced: {
    en: 'Penalty Faced',
    vi: 'Đối mặt với quả penalty',
  },
  savedShotsFromOutsideTheBox: {
    en: 'Saved Shots from Outside the Box',
    vi: 'Cứu thua các cú sút từ ngoài vùng cấm',
  },
  goalsConcededInsideTheBox: {
    en: 'Goals Conceded Inside the Box',
    vi: 'Bàn thua từ trong vùng cấm',
  },
  goalsConcededOutsideTheBox: {
    en: 'Goals Conceded Outside the Box',
    vi: 'Bàn thua từ ngoài vùng cấm',
  },
  runsOut: {
    en: 'Runs Out',
    vi: 'Chạy ra cứu thua',
  },
  substitutedIn: {
    en: 'Substituted In',
    vi: 'Thay thế vào sân',
  },
  substitutedOut: {
    en: 'Substituted Out',
    vi: 'Thay ra ngoài sân',
  },
  tacklesSuccessful: {
    en: 'Successful Tackles',
    vi: 'Tackles thành công',
  },
  tacklesTotal: {
    en: 'Total Tackles',
    vi: 'Tổng số lần vào bóng',
  },
  shotsOnBar: {
    en: 'Shots On Bar',
    vi: 'Cú sút đập xà ngang',
  },
  cardsGiven: {
    en: 'Cards Given',
    vi: 'Thẻ phân công',
  },
  shotsFaced: {
    en: 'Shots Faced',
    vi: 'Số lần bị sút vào cầu môn',
  },
  matchesPlayed: {
    en: 'Matches Played',
    vi: 'Trận đã thi đấu',
  },
  freekicks: {
    en: 'Free Kicks',
    vi: 'Sút phạt',
  },
  goalsByFoot: {
    en: 'Goals By Foot',
    vi: 'Bàn thắng bằng chân',
  },
  goalsConcededFirstHalf: {
    en: 'Goals Conceded First Half',
    vi: 'Bàn thua hiệp 1',
  },
  goalsConcededSecondHalf: {
    en: 'Goals Conceded Second Half',
    vi: 'Bàn thua hiệp 2',
  },
  goalsScoredFirstHalf: {
    en: 'Goals Scored First Half',
    vi: 'Bàn thắng hiệp 1',
  },
  goalsScoredSecondHalf: {
    en: 'Goals Scored Second Half',
    vi: 'Bàn thắng hiệp 2',
  },
  shotsOnPost: {
    en: 'Shots On Post',
    vi: 'Cú sút đập cột dọc',
  },
  shotsTotal: {
    en: 'Total Shots',
    vi: 'Tổng số cú sút',
  },
  ballRecovery: {
    en: 'Ball Recovery',
    vi: 'Khôi phục bóng',
  },
  penaltiesCommited: {
    en: 'Penalties Committed',
    vi: 'Vi phạm phạt đền',
  },
  throwIns: {
    en: 'Throw-Ins',
    vi: 'Ném biên',
  },
  fastbreaks: {
    en: 'Fastbreaks',
    vi: 'Phản công',
  },
  fastbreakShots: {
    en: 'Fastbreak Shots',
    vi: 'Cú sút khi phản công',
  },
  fastbreakGoals: {
    en: 'Fastbreak goals',
    vi: 'Bàn thắng khi phản công',
  },
  freekickGoals: {
    en: 'Freekick Goals',
    vi: 'Bàn thắng đá phạt',
  },
  runsOutSucc: {
    en: 'Run out Success',
    vi: ' Chạy ra cứu thua thành công',
  },
  yellow2redCards: {
    en: 'Yellow To Red Cards',
    vi: ' Thẻ vàng thành thẻ đỏ',
  },
  duels: {
    en: 'Duels',
    vi: 'Đấu trên không',
  },
  longBalls: {
    en: 'Long balls',
    vi: ' Chuyền dài',
  },
  longBallsAccuracy: {
    en: 'Long balls accuracy',
    vi: 'Tỷ lệ chuyền dài',
  },
  crosses: {
    en: ' Crosses',
    vi: ' Tạt cánh',
  },
  crossesAccuracy: {
    en: 'Crosses Accuracy',
    vi: 'Tỷ lệ tạt cánh thành công',
  },
  passesAccuracy: {
    en: 'Passes accuracy',
    vi: 'Tỷ lệ chuyền thành công',
  },
  first: {
    en: 'First',
    vi: 'Ra sân từ đầu',
  },
  court: {
    en: 'Court',
    vi: 'Khu vực đá bóng',
  },
  possLosts: {
    en: 'Poss lost',
    vi: ' Số lần mất bóng',
  },
  ballPossession: {
    en: 'Ball possession',
    vi: '% kiểm soát bóng',
  },
  minutes_played: {
    en: 'Minutes played',
    vi: 'Số phút thi đấu',
  },
  red_cards: {
    en: 'Red card',
    vi: 'Thẻ đỏ',
  },
  yellow_cards: {
    en: 'Yellow card',
    vi: 'Thẻ vàng',
  },
  shots_on_target: {
    en: 'Shot on target',
    vi: 'Cú sút trúng mục tiêu',
  },
  dribble_succ: {
    en: 'Dribble successfully',
    vi: 'Số lần qua người thành công',
  },
  poss_losts: {
    en: 'Poss losts',
    vi: ' Số lần mất bóng',
  },
  fastbreak_goals: {
    en: 'Fast break goals',
    vi: ' Số lần đột phá',
  },
  fastbreak_shots: {
    en: 'Fast break shots',
    vi: ' Số cú sút nhanh',
  },
  freekick_goals: {
    en: 'Freekick goals',
    vi: ' Số bàn thắng từ sút phạt',
  },
};

export type StatsLabel = keyof typeof vi.statsLabel;

export function getStatsLabel(key: StatsLabel, i18n: any = vi) {
  return i18n.statsLabel?.[key] || '';
}

export function getFullPosition(position: string) {
  // TODO i18n
  const i18n = useTrans();
  const map: any = {
    GK: i18n.competitor.goalkeeper,
    DF: i18n.competitor.defender,
    MF: i18n.competitor.midfielder,
    FW: i18n.competitor.forward,
    G: i18n.competitor.goalkeeper,
    D: i18n.competitor.defender,
    M: i18n.competitor.midfielder,
    F: i18n.competitor.forward,
  };
  return map[position] || position;
}

export function formatMarketValue(value: number) {
  if (!value) return 'N/A';

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else {
    return value / 1000 + 'K';
  }
}

export function genRatingColor(point: number) {
  const scaledPoint = point > 10 ? point / 10 : point;
  let color = '';
  if (scaledPoint >= 9) {
    color = 'bg-[#3498DB]';
  } else if (scaledPoint >= 8) {
    color = 'bg-[#47C152]';
  } else if (scaledPoint >= 7) {
    color = 'bg-[#A2B719]';
  } else if (scaledPoint >= 6.5) {
    color = 'bg-[#D8B62A]';
  } else if (scaledPoint >= 6) {
    color = 'bg-[#EE8749]';
  } else {
    color = 'bg-[#FA5151]';
  }

  return color;
}

export function genRatingColorText(point: number) {
  const scaledPoint = point > 10 ? point / 10 : point;

  let color = '';
  if (scaledPoint >= 9) {
    color = 'text-[#3498DB]';
  } else if (scaledPoint >= 8) {
    color = 'text-[#47C152]';
  } else if (scaledPoint >= 7) {
    color = 'text-[#A2B719]';
  } else if (scaledPoint >= 6.5) {
    color = 'text-[#D8B62A]';
  } else if (scaledPoint >= 6) {
    color = 'text-[#EE8749]';
  } else {
    color = 'text-[#FA5151]';
  }

  return color;
}

export function genTransferTexts(type: number, transferFeeDescription: string, i18n?: any) {
  let transferDesc = '';
  let transferFeeText = '';
  if (type === 0) {
    transferDesc = '';
  } else if (type === 1) {
    transferDesc = i18n ? i18n.football.loan : 'Loan';
  } else if (type === 2) {
    transferDesc = i18n ? i18n.football.end_of_loan : 'End of loan';
  } else if (type === 3) {
    transferDesc = i18n ? i18n.football.transfer : 'Transfer';
    transferFeeText =
      transferFeeDescription !== '-' ? transferFeeDescription : i18n.common.free;
  } else if (type === 4) {
    transferDesc = i18n ? i18n.football.retired : 'Retired';
  }

  return [transferDesc, transferFeeText];
}

export function matchResult(
  competitorId: string,
  homeTeamId: string,
  awayTeamId: string,
  winnerCode: number
) {
  let isWin = false;
  if (
    (`${competitorId}` === `${homeTeamId}` && winnerCode === 1) ||
    (`${competitorId}` === `${awayTeamId}` && winnerCode === 2)
  ) {
    isWin = true;
  }

  let isLoss = false;
  if (
    (`${competitorId}` === `${homeTeamId}` && winnerCode === 2) ||
    (`${competitorId}` === `${awayTeamId}` && winnerCode === 1)
  ) {
    isLoss = true;
  }

  const isDraw = winnerCode === 3;

  return {
    isWin,
    isLoss,
    isDraw,
  };
}

export const statsGroups = {
  summary: [
    'matches',
    'goals',
    'expectedGoals',
    'successfulDribbles',
    'tackles',
    'assists',
    'accuratePassesPercentage',
    'rating',
    'redCards',
    'yellowCards',
    'yellowRedCards',
    'goalsScored',
    'goalsConceded',
    'minutesPlayed',
  ],
  attack: [
    // 'goals',
    // 'expectedGoals',
    'bigChancesMissed',
    'successfulDribbles',
    'successfulDribblesPercentage',
    'totalShots',
    'shotsOnTarget',
    'shotsOffTarget',
    'blockedShots',
    'goalConversionPercentage',
    'penaltiesTaken',
    'penaltyGoals',
    'penaltyWon',
    'shotFromSetPiece',
    'freeKickGoal',
    'goalsFromInsideTheBox',
    'goalsFromOutsideTheBox',
    'headedGoals',
    'leftFootGoals',
    'rightFootGoals',
    'hitWoodwork',
    'offsides',
    'penaltyConversion',
    'setPieceConversion',
    // 'rating',
  ],
  defence: [
    'tackles',
    'interceptions',
    'penaltyConceded',
    'clearances',
    'errorLeadToGoal',
    'errorLeadToShot',
    'ownGoals',
    'dribbledPast',
    'cleanSheet',
    // 'rating',
  ],
  passing: [
    'bigChancesCreated',
    // 'assists',
    'accuratePasses',
    'inaccuratePasses',
    'totalPasses',
    'accuratePassesPercentage',
    'accurateOwnHalfPasses',
    'accurateOppositionHalfPasses',
    'accurateFinalThirdPasses',
    'keyPasses',
    'accurateCrosses',
    'accurateCrossesPercentage',
    'accurateLongBalls',
    'accurateLongBallsPercentage',
    'passToAssist',
    // 'rating',
  ],
  goalkeeper: [
    'saves',
    'cleanSheet',
    'penaltyFaced',
    'penaltySave',
    'savedShotsFromInsideTheBox',
    'savedShotsFromOutsideTheBox',
    'goalsConcededInsideTheBox',
    'goalsConcededOutsideTheBox',
    'punches',
    'runsOut',
    'successfulRunsOut',
    'highClaims',
    'crossesNotClaimed',
    // 'rating',
  ],
  other: [
    'groundDuelsWon',
    'groundDuelsWonPercentage',
    'aerialDuelsWon',
    'aerialDuelsWonPercentage',
    'totalDuelsWon',
    'totalDuelsWonPercentage',

    'wasFouled',
    'fouls',
    'dispossessed',
    'possessionLost',
    'appearances',
    'matchesStarted',
    // 'rating',
  ],
};

export const statsGroupOrder: any = {
  summary: {
    order: 1,
    name: 'Summary', // TODO i18n
  },
  attack: {
    order: 2,
    name: 'Attack',
  },
  defence: {
    order: 3,
    name: 'Defence',
  },
  passing: {
    order: 4,
    name: 'Passing',
  },
  goalkeeper: {
    order: 5,
    name: 'Goalkeeper',
  },
  other: {
    order: 6,
    name: 'Other',
  },
};

export const getStatsGroupInfo = (group: string) => {
  return (
    statsGroupOrder[group] || {
      order: 99,
      name: group,
    }
  );
};

export const mapToStatsGroup: any = {
  rating: 'summary',
  goals: 'summary',
  goalsScored: 'summary',
  goalsConceded: 'summary',
  matches: 'summary',
  averageBallPossession: 'summary',
  corners: 'summary',
  cornersAgainst: 'summary',
  dispossessed: 'summary',
  expectedGoals: 'attack',
  bigChancesMissed: 'attack',
  successfulDribbles: 'attack',
  successfulDribblesPercentage: 'attack',
  totalShots: 'attack',
  shotsOnTarget: 'attack',
  shotsOffTarget: 'attack',
  blockedShots: 'attack',
  goalConversionPercentage: 'attack',
  penaltiesTaken: 'attack',
  penaltyGoals: 'attack',
  penaltyWon: 'attack',
  shotFromSetPiece: 'attack',
  freeKickGoal: 'attack',
  goalsFromInsideTheBox: 'attack',
  goalsFromOutsideTheBox: 'attack',
  headedGoals: 'attack',
  leftFootGoals: 'attack',
  rightFootGoals: 'attack',
  hitWoodwork: 'attack',
  offsides: 'attack',
  penaltyConversion: 'attack',
  setPieceConversion: 'attack',
  tackles: 'defence',
  interceptions: 'defence',
  penaltyConceded: 'defence',
  clearances: 'defence',
  errorLeadToGoal: 'defence',
  errorLeadToShot: 'defence',
  ownGoals: 'defence',
  dribbledPast: 'defence',
  cleanSheet: 'goalkeeper',
  bigChancesCreated: 'passing',
  assists: 'summary',
  accuratePasses: 'passing',
  inaccuratePasses: 'passing',
  totalPasses: 'passing',
  accuratePassesPercentage: 'passing',
  accurateOwnHalfPasses: 'passing',
  accurateOppositionHalfPasses: 'passing',
  accurateFinalThirdPasses: 'passing',
  keyPasses: 'passing',
  accurateCrosses: 'passing',
  accurateCrossesPercentage: 'passing',
  accurateLongBalls: 'passing',
  accurateLongBallsPercentage: 'passing',
  passToAssist: 'passing',
  saves: 'goalkeeper',
  penaltyFaced: 'goalkeeper',
  penaltySave: 'goalkeeper',
  savedShotsFromInsideTheBox: 'goalkeeper',
  savedShotsFromOutsideTheBox: 'goalkeeper',
  goalsConcededInsideTheBox: 'goalkeeper',
  goalsConcededOutsideTheBox: 'goalkeeper',
  punches: 'goalkeeper',
  runsOut: 'goalkeeper',
  successfulRunsOut: 'goalkeeper',
  highClaims: 'goalkeeper',
  crossesNotClaimed: 'goalkeeper',
  yellowCards: 'summary',
  yellowRedCards: 'summary',
  redCards: 'summary',
  groundDuelsWon: 'other',
  groundDuelsWonPercentage: 'other',
  aerialDuelsWon: 'other',
  aerialDuelsWonPercentage: 'other',
  totalDuelsWon: 'other',
  totalDuelsWonPercentage: 'other',
  minutesPlayed: 'other',
  wasFouled: 'other',
  fouls: 'other',
  possessionLost: 'other',
  appearances: 'other',
  matchesStarted: 'other',
};

export const getStatsGroup = (stat: string) => {
  return mapToStatsGroup[stat] || 'other';
};

export const characteristics: any = {
  1: 'Uploading',
  2: 'Penalty Kick',
  3: 'Direct free kicks',
  4: 'Long shots',
  5: 'Finishing',
  6: 'Ground duels',
  7: 'Playmaking',
  8: 'Dribble',
  9: 'Tackling',
  10: 'Tackle',
  11: 'Consistency',
  12: 'Excellent',
  13: 'Long balls',
  14: 'Ball control',
  15: 'Passing',
  16: 'Aerial duels',
  17: 'Error proneness',
  18: 'Discipline',
  19: 'Penalty saving',
  20: 'Reaction',
  21: 'Abandon goal to participate in attack',
  22: 'High ball interception',
  23: 'Handling',
  24: 'Long shots saving',
  25: 'Positioning',
  26: 'High pressing',
  27: 'Long Shots Save',
  28: 'Crossing',
  29: 'Offside awareness',
  30: 'Close shot saves',
  31: 'Concentration',
  32: 'Defensive participation',
  33: 'Key passing Ball',
  34: 'Header',
  35: 'Set ball',
  36: 'Straight pass',
  37: 'Counter attack',
  38: 'One kick',
  39: 'Up High ball',
  40: 'Fouling',
  41: 'Inward cut',
  42: 'Boxing ball',
  43: 'Clearance',
};

export const characteristicsVietNamese: any = {
  1: 'Chưa xác định',
  2: 'Đá phạt đền',
  3: 'Đá phạt trực tiếp',
  4: 'Dứt điểm từ xa',
  5: 'Dứt điểm kỹ thuật',
  6: 'Chuyền ngắn',
  7: 'Tổ chức tấn công',
  8: 'Khéo léo',
  9: 'Interrupt the ball',
  10: 'Đoạt lại bóng',
  11: 'Bình tĩnh',
  12: 'Xuất sắc',
  13: 'Chuyền dài',
  14: 'Kiểm soát bóng',
  15: 'Không chiến',
  16: 'Tranh chấp',
  17: 'Dễ mắc lỗi',
  18: 'Kỷ luật',
  19: 'Punch penalty',
  20: 'Phản xạ',
  21: 'Từ bỏ bảo vệ khung thành để tham gia tấn công',
  22: 'Chặn bóng cao',
  23: 'Bắt bóng',
  24: 'Sút xa',
  25: 'Định vị',
  26: 'Quyết liệt',
  27: 'Cứu thua từ xa',
  28: 'Chuyền cánh',
  29: 'Nhận biết việt vị',
  30: 'Cứu thua cú sút gần',
  31: 'Tập trung',
  32: 'Tham gia phòng thủ',
  33: 'Đường chuyền quyết định',
  34: 'Đánh đầu',
  35: 'Sút cố định',
  36: 'Chuyền thẳng',
  37: 'Phản công',
  38: 'Đá một chạm',
  39: 'Đánh đầu bóng cao',
  40: 'Phạm lỗi',
  41: 'inward cut',
  42: 'Boxing ball',
  43: 'Phá bóng',
};

export const getCharacteristic = (id: number, i18n: string) => {
  if (i18n === 'vi') {
    return characteristicsVietNamese[id];
  } else if (i18n === 'en') {
    return characteristics[id];
  }
  return id;
};

export const shotmapConsts: any = {
  save: 'Attempt Saved',
  goal: 'Goal',
  miss: 'Miss',
  block: 'Block',
  assisted: 'Assisted',
  'throw-in-set-piece': 'Throw-in set piece',
  'fast-break': 'Fast Break',
  'set-piece': 'Set Piece',
  penalty: 'Penalty',
  corner: 'Corner',
  regular: 'Regular',
  'right-foot': 'Right footed',
  'left-foot': 'Left footed',
  other: 'Other',
  head: 'Head',
  'low-left': 'Low left',
  'low-centre': 'Low center',
  'low-right': 'Low right',
  'high-left': 'High left',
  'high-centre': 'High center',
  'high-right': 'High right',
  'close-left': 'Close left',
  'close-centre': 'Close center',
  'close-right': 'Close right',
  left: 'Left',
  high: 'Hight',
  centre: 'Center',
  low: 'Low',
  right: 'Right',
  shootout: 'Penalty Shootout',
};

export const getShotmapConst = (val: string) => {
  return shotmapConsts[val] || val;
};

export const getLastMatches = (matches: any[], limit = 5) => {
  if (isValEmpty(matches)) return [];

  const teamLastMatches = matches
    .slice()
    .filter((match: any) => match.status?.code >= 90)
    .sort((a: any, b: any) => b.startTimestamp - a.startTimestamp)
    .slice(0, limit)
    .reverse();

  return teamLastMatches;
};

export function generateTicks(maxTickVal: number, step = 2) {
  const ticks = [1];

  for (let i = step; i < maxTickVal; i += step) {
    ticks.push(i);
  }

  if (ticks[ticks.length - 1] !== maxTickVal) {
    ticks.push(maxTickVal);
  }

  return ticks;
}

export function toDecimal(fraction: string) {
  if (!fraction) return null;

  const [numerator, denominator] = fraction.split('/');
  return Number(Number(numerator) / Number(denominator || 1)).toFixed(2);
}

export function convertOdds(
  oddsValue: string,
  marketId?: string,
  oddsType?: string,
  pos?: number
): any {
  let returnedVal = oddsValue;
  if (marketId === 'std1x2' || marketId === 'eu1x2') {
    if (oddsType === '3') {
      returnedVal = oTool.changePL(oddsType, oddsValue, 1);
    } else {
      returnedVal = oddsValue;
    }
  } else if (marketId === 'tx' && pos === 2) {
    returnedVal = oddsValue;
  } else if (oddsType === '3' && pos === 2) {
    returnedVal = oddsValue;
  } else if (marketId === 'hdp' && pos === 2) {
    returnedVal = oddsValue;
  } else {
    returnedVal = oTool.changePL(oddsType, oddsValue);
  }

  if ((marketId === 'hdp' || marketId === 'tx') && pos === 2) {
    returnedVal = Goal2GoalCn(returnedVal);
  }

  return returnedVal || '-';
}

export function toDecimalOdd(fraction: string): any {
  if (!fraction) return null;

  const [numerator, denominator] = fraction.split('/');
  return parseFloat(
    Number(Number(numerator) / Number(denominator || 1) + 1).toFixed(2)
  );
}

export function isMatchLive(matchStatusId: number): boolean {
  return [
    MatchState.FirstHalf,
    MatchState.HalfTime,
    MatchState.SecondHalf,
    MatchState.OverTime,
    MatchState.PenaltyShootOut,
  ].includes(matchStatusId);
}


export function isMatchBadge(matchStatusId: number): boolean {
  return (
    matchStatusId === MatchState.NotStarted ||
    matchStatusId === MatchState.Abnormal ||
    matchStatusId === MatchState.Interrupt ||
    matchStatusId === MatchState.CutInHalf ||
    matchStatusId === MatchState.Postponed
  );
}

export function isMatchNotStarted(matchStatusId: number): boolean {
  return (
    matchStatusId === MatchState.NotStarted ||
    matchStatusId === MatchState.Abnormal ||
    matchStatusId === MatchState.Interrupt ||
    matchStatusId === MatchState.Cancel ||
    matchStatusId === MatchState.CutInHalf ||
    matchStatusId === MatchState.Postponed
  );
}

export function isMatchHaveStat(matchStatusId: number): boolean {
  return [
    MatchState.FirstHalf,
    MatchState.HalfTime,
    MatchState.SecondHalf,
    MatchState.OverTime,
    MatchState.PenaltyShootOut,
    MatchState.End,
    MatchState.AP,
    MatchState.AET,
  ].includes(matchStatusId);
}

export function isMatchEnded(matchStatusId: number): boolean {
  return [MatchState.End, MatchState.AET, MatchState.AP].includes(matchStatusId);
}

export const parseMatchDataArray = (
  matchDataString: string | null | undefined
): SportEventDtoWithStat[] => {
  if (!matchDataString || matchDataString.length <= 0) {
    return [];
  }
  const matchDataArray = matchDataString.split('!!');
  const matches = matchDataArray.map((matchString) => {
    const matchDetails = matchString.split('^');
    const time =
      Number(matchDetails[17]) === -1
        ? {}
        : {
          status: convertStatusCode(Number(matchDetails[9])),
          currentPeriodStartTimestamp: Number(matchDetails[17]),
        };

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
          slug: getSlug(matchDetails[8]),
        },
        primary_color: matchDetails[36] ? matchDetails[36] : '',
        secondary_color: matchDetails[37] ? matchDetails[37] : '',
      },
      status: convertStatusCode(Number(matchDetails[9])),
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
      time,
      homeScore: {
        display: Number(matchDetails[18]),
        period1: Number(matchDetails[19]),
        period2: Number(matchDetails[20]),
      },
      awayScore: {
        display: Number(matchDetails[21]),
        period1: Number(matchDetails[22]),
        period2: Number(matchDetails[23]),
      },
      slug: matchDetails[24],
      roundInfo: {
        round: Number(matchDetails[25]),
      },
      winnerCode: Number(matchDetails[26]),
      lineup: Number(matchDetails[27]),
      homeRedCards: Number(matchDetails[28]),
      awayRedCards: Number(matchDetails[29]),
      homeYellowCards: Number(matchDetails[30]),
      awayYellowCards: Number(matchDetails[31]),
      homeCornerKicks: Number(matchDetails[32]),
      awayCornerKicks: Number(matchDetails[33]),
      season_id: matchDetails[34],
      is_id: matchDetails[35],
    };
  }) as SportEventDtoWithStat[];
  return matches;
};

export const isCountryName = (name: string | undefined | null): boolean => {
  if (!name || name.length <= 0) return false;
  const categoryName = [
    'International',
    'Europe',
    'Americas',
    'Asia',
    'Oceania',
    'Africa',
    'Beach',
  ];

  return !categoryName.includes(name);
};

export const parseOddMatchDataArray = (
  oddDataString: string | null | undefined
): MatchOdd[] => {
  if (!oddDataString || oddDataString.length <= 0) {
    return [];
  }
  const matchOddDataArray = oddDataString.split('!');
  const matchesOdd: any = matchOddDataArray.map((match) => {
    const [theSport, ISports, oddAsian, oddEuro, oddOverUnder] =
      match.split('^');
    const [asian_hdp, asian_hdp_home, asian_hdp_away, asian_close] =
      oddAsian.split(':');
    const [european_home, european_draw, european_away, european_close] =
      oddEuro.split(':');
    const [over_under_hdp, over, under, over_under_close] =
      oddOverUnder.split(':');

    return {
      id: theSport,
      encode_is_id: ISports,
      asian_hdp: asian_hdp,
      asian_hdp_home: asian_hdp_home,
      asian_hdp_away: asian_hdp_away,
      asian_close: asian_close,
      european_home: european_home,
      european_draw: european_draw,
      european_away: european_away,
      european_close: european_close,
      over_under_hdp: over_under_hdp,
      over: over,
      under: under,
      over_under_close: over_under_close,
    };
  });
  return matchesOdd;
};

export enum MatchStateBasketBall {
  Abandoned = 0,
  NotStarted = 1,
  FirstHalf = 2,
  FirstHalfOver = 3,
  SecondHalf = 4,
  SecondHalfOver = 5,
  ThirdHalf = 6,
  ThirdHalfOver = 7,
  FourHalf = 8,
  OverTime = 9,
  Ended = 10,
  Interrupted = 11,
  Cancelled = 12,
  Extension = 13,
  CutInHalf = 14,
  ToBeDetermined = 15,
}
