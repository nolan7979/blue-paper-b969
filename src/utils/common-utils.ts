/* eslint-disable @typescript-eslint/no-explicit-any */
import { addWeeks, compareAsc, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarWeeks, differenceInHours, differenceInMinutes, endOfWeek, format, isSameDay, isThisWeek, isToday, isTomorrow, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import slugify from 'slugify';

import { SPORT } from '@/constant/common';
import { MatchState } from '@/constant/interface';
import { decode } from '@/utils/hash.id';
import { isMatchEndTableTennis } from '@/utils/tableTennisUtils';
import { isMatchEnd as isMatchEndCricket } from '@/utils/cricketUtils';
import { isMatchEndAMFootball } from '@/utils/americanFootballUtils';
import { isMatchEnded } from '@/utils/football-utils';
import { isMatchEndedVlb } from '@/utils/volleyballUtils';
import { isMatchesEndedTennis } from '@/utils/tennisUtils';
import { isMatchesEndedBkb } from '@/utils/basketballUtils';
import { isMatchesEndedBaseball } from '@/utils/baseballUtils';
import { isMatchesEndedHockey } from '@/utils/hockeyUtils';
import { isMatchesEndedBmt } from '@/utils/badmintonUtils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';


const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || 'https://img.uniscore.com';

export function parseDateTime(dtString?: string) {
  if (!dtString) {
    return ['', ''];
  }

  const dt = new Date(dtString);
  const now = new Date();

  const isToday =
    dt.getDate() === now.getDate() &&
    dt.getMonth() === now.getMonth() &&
    dt.getFullYear() === now.getFullYear();

  const dtDayMonthYear = `${('0' + dt.getDate()).slice(-2)}/${(
    '0' +
    (dt.getMonth() + 1)
  ).slice(-2)}/${dt.getFullYear()}`;
  const dtHourMinute = `${('0' + dt.getHours()).slice(-2)}:${(
    '0' + dt.getMinutes()
  ).slice(-2)}`;

  if (isToday) {
    return [dtHourMinute, ''];
  } else if (dt < now) {
    return [dtDayMonthYear, 'FT'];
  } else {
    return [dtDayMonthYear, dtHourMinute];
  }
}

export function checkStickyOfMainScreen() {
  const router = useRouter();
 
   const routerSportMapping: { [key: string]: string } = {
     '/basketball': SPORT.BASKETBALL,
     '/tennis': SPORT.TENNIS,
     '/volleyball': SPORT.VOLLEYBALL,
     '/badminton': SPORT.BADMINTON,
     '/baseball': SPORT.BASEBALL,
     '/am-football': SPORT.AMERICAN_FOOTBALL,
     '/cricket': SPORT.CRICKET,
     '/hockey': SPORT.ICE_HOCKEY,
     '/table-tennis': SPORT.TABLE_TENNIS,
     '/snooker': SPORT.SNOOKER,
     '/football': SPORT.FOOTBALL,
      '/': SPORT.FOOTBALL,
   };
 
   const isSticky = useMemo(() => {
     for (const path in routerSportMapping) {
       if (router.pathname.startsWith(path) && !router.pathname.split("/")[2]) {
         return true;
       }
     }
     return false;
   }, [router.pathname]);

   return isSticky;
}

export function getFormattedDate(dtStr?: string) {
  let first = '';
  let second = '';

  if (!dtStr) {
    return [first, second];
  }

  const parsedDate = parseISO(dtStr);
  const now = new Date();
  const comparison = compareAsc(parsedDate, now);

  if (comparison === 0) {
    // date is today
    first = format(parsedDate, 'HH:mm');
  } else if (comparison === -1) {
    // date is in the past
    first = format(parsedDate, 'dd/MM/yy');
    // first = isSameYear(parsedDate, now) ? format(parsedDate, 'dd/MM') : format(parsedDate, 'dd/MM/yy');
    second = 'FT';
  } else if (comparison === 1) {
    // date is in the future
    first = format(parsedDate, 'dd/MM/yy');
    // first = isSameYear(parsedDate, now) ? format(parsedDate, 'dd/MM') : format(parsedDate, 'dd/MM/yy');
    second = format(parsedDate, 'HH:mm');
  }

  return [first, second];
}

export function isValEmpty(value: any): boolean {
  if (value === 0) return false;

  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  return false;
}

export function getNonEmptyFields(
  entity: Record<string, any>
): Record<string, any> {
  const resultObject: Record<string, any> = {};

  Object.keys(entity).forEach((key) => {
    if (!isValEmpty(entity[key])) {
      resultObject[key] = entity[key];
    }
  });

  return resultObject;
}

export function getFirstLetters(name: string) {
  if (!name) return '';
  const words = name.split(' ');

  if (words.length <= 2) {
    return name.replace(/\s/g, '').substring(0, 3);
  } else {
    return words
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 3);
  }
}

export function formatTimestamp(
  timestamp: number,
  formatString = 'dd/MM/yyyy - HH:mm'
) {
  if (!timestamp) return timestamp;
  try {
    if (timestamp.toString().length < 13) {
      timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    return format(date, formatString);
  } catch (error) {
    return timestamp;
  }
}

export function formatTimestampV2(
  timestamp: number,
  statusCode: number,
  formatString = 'dd/MM/yyyy - HH:mm'
): string | number {
  if (statusCode === MatchState.Interrupt) return 'Interrupted';
  else if (statusCode === MatchState.Postponed) return 'Postponed';
  else if (statusCode === MatchState.Cancel) return 'Cancelled';
  if (!timestamp) return timestamp;
  try {
    if (timestamp.toString().length < 13) {
      timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    return format(date, formatString);
  } catch (error) {
    return timestamp;
  }
}

export function roundNumber(val: any, precision?: number) {
  val = `${val}`;
  const value = parseFloat(val);

  if (isNaN(value)) {
    return val;
  }

  if (val.includes('.')) {
    return Number(value.toFixed(precision || 2));
  }

  return val;
}

export const calcPercent = (val1: number, val2: number, precision = 2) => {
  return roundNumber((val1 / (val2 || 1)) * 100, precision);
};

export function isNumber(str: any) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

export function getDateFromTimestamp(timestamp: number) {
  if (!timestamp) return timestamp;
  try {
    if (timestamp.toString().length < 13) {
      timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    return date;
  } catch (error) {
    return timestamp;
  }
}

export const isMatchOnDate = (startTimestamp: number, date: Date) => {
  return isSameDay(getDateFromTimestamp(startTimestamp), date);
};

export const scrollWithOffset = function (elementId: string, offset: number) {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({
      top: rect.top + scrollTop - offset,
      behavior: 'smooth',
    });
  }
};

export const getMinuteOffset = () => {
  return new Date().getTimezoneOffset();
};

export function roundNum(number: number, precision = 2) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

export function numerizeObj(obj: any) {
  const convertedObj = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      parseFloat(value as string) || null,
    ])
  );
  return convertedObj;
}

export function isStringNumeric(s: string | number): boolean {
  return !isNaN(parseFloat(String(s))) && isFinite(Number(s));
}

export const getImage = (
  key: string,
  initialId: string | null | undefined,
  isSmall?: boolean,
  sport: string = SPORT.FOOTBALL
): string => {
  let convetSport: string = sport;
  if (!initialId) return `${IMAGE_URL}/${key}`;
  if (sport === SPORT.AMERICAN_FOOTBALL) {
    convetSport = 'american-football';
  }

  const newId = decode(initialId);
  return `${IMAGE_URL}/${convetSport}/${key}/${newId}/image${
    isSmall ? '/small' : '/medium'
  }`;
};

const getCurrentDateTimestamp = (): number => {
  const currentDateTimestamp: number = Math.floor(Date.now() / 1000);
  return currentDateTimestamp;
};

const timestampToMinutesSeconds = (
  timestamp: number
): { minutes: number; seconds: number } => {
  const minutes: number = Math.floor(timestamp / 60);
  const seconds: number = timestamp % 60;
  return { minutes, seconds };
};

export const calculateTime = (
  code: number,
  startTimestamp: number
): string | number => {
  if (startTimestamp === 0) return `0'`;
  const currentDate: number = getCurrentDateTimestamp();
  const { minutes } = timestampToMinutesSeconds(currentDate - startTimestamp);
  const minutes_app: number = minutes + 1;

  const codeMappings: { [key: number]: string | number } = {
    5: minutes_app > 45 ? `45+'` : `${minutes_app}'`,
    6: 'HT',
    7: minutes_app + 45 > 90 ? `90+'` : `${45 + minutes_app}'`,
    33: minutes_app + 90 > 105 ? `105+'` : `${90 + minutes_app}'`,
    42: minutes_app + 105 > 120 ? `120+'` : `${105 + minutes_app}'`,
    13: 'Penalties',
    34: 'Aw. Pen.',
    14: 'Overtime',
    15: 'interrupted',
  };
  return codeMappings[code] || '';
};

export const formatTime = (seconds: number): string => {
  if (!seconds || seconds < 0) return "00:00'";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}'`;
};

export enum Images {
  player = 'player',
  team = 'team',
  competition = 'competition',
  country = 'country',
  competitor = 'competitor',
}

export enum ImagesError {
  player = 'players',
  team = 'teams',
  country = 'countries',
}

export function getSlug(str: string | null | undefined): string {
  const tmpStr = str ? str.replace(/([^a-zA-Z0-9 -]+)/g, (s0) => '') : 'slug';
  return slugify(tmpStr || '-', { lower: true });
}

export function isShowOdds(dotDomain: string): boolean {
  // domain .com show odds
  // if (dotDomain === 'com') {
  //   return true;
  // } else {
  //   return false;
  // }

  return dotDomain === 'development'; // hidden odds
}

export function extractCompetitionId(
  competitionId: string | undefined
): string {
  if (!competitionId) return '';
  const extra = competitionId.split('_');
  return extra[0];
}

export const getMetaContent = (data: Record<string, any>) => {
  const meta = data?.yoast_head_json;
  return {
    templateTitle: meta?.title,
    description: meta?.description,
    og_url: meta?.og_url,
    og_site_name: meta?.og_site_name,
    og_description: meta?.og_description,
    og_title: meta?.og_title,
    og_image: meta?.og_image,
  };
};

let idCounter = 0;

export function generateUniqueId(prefix = 'id') {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const getThumbnailUrl = (url: string, chanel = 'youtube') => {
  if (chanel === 'youtube') {
    const thumbnail = 'https://img.youtube.com/vi/:videoId/hqdefault.jpg';

    let videoId = url.split('v=')[1];
    if (videoId?.includes('&t=')) {
      videoId = videoId.split('&t=')[0];
    }
    return thumbnail.replace(':videoId', videoId);
  }

  return '';
};

export const updateHtmlDir = (direction: 'ltr' | 'rtl') => {
  if (!direction) {
    return;
  }

  document.documentElement.setAttribute('dir', direction);
};

export const formatSecondToHourView = (inputSecond: number): string => {
  const minutes = Math.floor(inputSecond / 60);
  const seconds = inputSecond - minutes * 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
};

export const handleObjectScore = (scores: any) => {
  const getKey = Object.keys(scores).filter(
    (key: string) => key !== 'ft' && key !== 'pt' && !key.includes('x')
  );
  let homeScore = [],
    awayScore = [];
  if (getKey.length > 0) {
    homeScore = [1, 2, 3, 4, 5].map((it) => ({
      pScore: scores[`p${it}`] ? scores[`p${it}`][0] : '-',
      xScore: scores[`x${it}`] ? scores[`x${it}`][0] : '-',
    }));
    awayScore = [1, 2, 3, 4, 5].map((it) => ({
      pScore: scores[`p${it}`] ? scores[`p${it}`][1] : '-',
      xScore: scores[`x${it}`] ? scores[`x${it}`][1] : '-',
    }));
  } else {
    homeScore = [1, 2, 3, 4, 5].map((it) => '-');
    awayScore = [1, 2, 3, 4, 5].map((it) => '-');
  }
  return {
    score: scores,
    homeScore,
    awayScore,
  };
};

export const pickChartColorOfAvatar = (fullName: string) => {
  const colors: { [key: string]: string } = {
    A: 'rgb(197, 90, 240)',
    Ă: 'rgb(241, 196, 15)',
    Â: 'rgb(142, 68, 173)',
    B: '#02c7ad',
    C: '#0cb929',
    D: 'rgb(124, 12, 80)',
    Đ: 'rgb(216, 140, 141)',
    E: 'rgb(26, 188, 156)',
    Ê: 'rgb(51, 152, 219)',
    G: 'rgb(90, 29, 291)',
    H: 'rgb(21, 83, 239)',
    I: 'rgb(142, 68, 173)',
    K: '#2209b7',
    L: '#759e13',
    M: 'rgb(236, 157, 92)',
    N: '#bd3d0a',
    O: 'rgb(51, 152, 219)',
    Ô: 'rgb(241, 196, 15)',
    Ơ: 'rgb(142, 68, 173)',
    P: 'rgb(12, 26, 76)',
    Q: 'rgb(91, 101, 243)',
    R: 'rgb(44, 62, 80)',
    S: 'rgb(122, 8, 56)',
    T: 'rgb(120, 76, 240)',
    U: 'rgb(51, 152, 219)',
    Ư: 'rgb(241, 196, 15)',
    V: 'rgb(142, 68, 173)',
    X: 'rgb(142, 68, 173)',
    W: 'rgb(211, 84, 0)',
  };

  const defaultColor = 'rgb(44, 62, 80)';

  if (!fullName) return { chart: '', color: defaultColor };
  const nameFirst = fullName?.split(' ');
  const initialFirst = nameFirst[0][0];
  const nameParts = fullName?.split(' ');
  let initialParts = '';
  if (nameParts?.length > 1 && nameParts?.[nameParts.length - 1]) {
    initialParts = nameParts?.[nameParts.length - 1][0];
  }

  const chart = initialFirst + (initialParts || '');

  const color = colors[initialFirst?.toUpperCase()] || defaultColor;

  return {
    chart,
    color,
  };
};

export const compareFields = (
  obj1: any,
  obj2: any,
  fields: string[]
): string[] => {
  const changedFields: string[] = [];
  fields.forEach((field) => {
    if (
      (obj1?.[field] !== undefined || obj2?.[field] !== undefined) &&
      JSON.stringify(obj1?.[field]) !== JSON.stringify(obj2?.[field])
    ) {
      changedFields.push(field);
    }
  });
  return changedFields;
};

export const formatSocketChatTopicGlobal = (topicKey: string) => {
  if (!topicKey) return '';

  return `chat-${topicKey}/global`;
};

export const formatParamMessageChatGlobal = (topicKey: string) => {
  if (!topicKey) return '';

  return `${topicKey}-global`;
};

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export const CheckIsFollowAllCate = (row: any, followed: any) => {
  let isFollow = false;
  if (row?.type == 'sport-event') {
    isFollow = followed.match.some(
      (item: any) => item.matchId === row?.entity?.id || row?.id
    );
  }
  if (row?.type == 'team') {
    isFollow = followed.teams[row?.sport.toLocaleLowerCase()].some(
      (item: any) => item.id === row?.entity?.id || row?.id
    );
  }
  if (row?.type == 'player') {
    isFollow = followed.players[row?.sport.toLocaleLowerCase()].some(
      (item: any) => item.id === row?.entity?.id || row?.id
    );
  }
  if (row?.type == 'competition') {
    isFollow = followed.tournament[row?.sport.toLocaleLowerCase()].some(
      (item: any) => item.id === row?.entity?.id || row?.id
    );
  }
  return isFollow;
}

export const flatDataSport = (rootData:any) => {
  let mapSport:any = [];
  if(rootData && Object.keys(rootData).length > 0){
    Object.keys(rootData).forEach((sport:any) => {
      mapSport = [...mapSport, ...rootData[sport].map((it:any) => ({...it, sport: sport}))]
    })
  }
  return mapSport
};

const sportEndCheckers: { [key: string]: (statusCode: number) => boolean } = {
  [SPORT.TENNIS]: isMatchesEndedTennis,
  [SPORT.BASKETBALL]: isMatchesEndedBkb,
  [SPORT.AMERICAN_FOOTBALL]: isMatchEndAMFootball,
  [SPORT.BASEBALL]: isMatchesEndedBaseball,
  [SPORT.ICE_HOCKEY]: isMatchesEndedHockey,
  [SPORT.FOOTBALL]: isMatchEnded,
  [SPORT.VOLLEYBALL]: isMatchEndedVlb,
  [SPORT.TABLE_TENNIS]: isMatchEndTableTennis,
  [SPORT.BADMINTON]: isMatchesEndedBmt,
  [SPORT.CRICKET]: isMatchEndCricket,
};

export const isMatchEndAllSport = (statusCode: number, sport: string) => {
  const checkEnd = sportEndCheckers[sport];
  return checkEnd ? checkEnd(statusCode) : false;
};


export const getLocaleSEOContext = (locale?: string) => {
  if(!locale) return 'en';

  const localeEN = ['en', 'en-PH', 'en-GB', 'en-SG', 'en-IN'];
  return localeEN.includes(locale) ? 'en' : locale || 'en';
}

export function handleFutureMatchDateComparisons(
  matchDate: Date,
  now: Date,
  i18n: any,
  formattedDate: string,
  status: any
): string[] {
  const diffInCalendarDays = differenceInCalendarDays(matchDate, now);
  const diffInCalendarHours = differenceInHours(matchDate, now);
  const diffInCalendarMinutes = differenceInMinutes(matchDate, now);
  const diffInCalendarWeeks = differenceInCalendarWeeks(matchDate, now);
  const diffInCalendarMonths = differenceInCalendarMonths(matchDate, now);

  // Match is happening tomorrow
  if (isTomorrow(matchDate)) {
    return [
      i18n.time.tomorrow,
      format(matchDate, 'HH:mm'),
      `${i18n.time.in} ${diffInCalendarHours} ${i18n.time.hours_later}`,
    ];
  }

  if (isToday(matchDate)) {
    return [
      i18n.time.today,
      format(matchDate, 'HH:mm'),
      diffInCalendarHours > 0 ? `${i18n.time.in} ${diffInCalendarHours} ${i18n.time.hours_later}` : diffInCalendarMinutes > 0 ? `${i18n.time.in} ${diffInCalendarMinutes} ${i18n.time.minutes_later}` : '',
    ];
  }

  // Match is happening later this week
  if (
    diffInCalendarDays > 1 &&
    diffInCalendarDays < 7 &&
    isThisWeek(matchDate)
  ) {
    return [
      `${i18n.time.in} ${diffInCalendarDays} ${i18n.time.days_later}`,
      formattedDate,
      '',
    ];
  }

  // Match is happening next week
  const startOfNextWeek = startOfWeek(addWeeks(now, 1));
  if (
    isWithinInterval(matchDate, {
      start: startOfNextWeek,
      end: endOfWeek(startOfNextWeek),
    })
  ) {
    return [i18n.time.next_week, formattedDate, ''];
  }

  // Match is happening within the next four weeks
  if (diffInCalendarWeeks > 1 && diffInCalendarWeeks <= 4) {
    return [
      `${i18n.time.in} ${diffInCalendarWeeks} ${i18n.time.weeks_later}`,
      formattedDate,
      '',
    ];
  }

  // Match is happening next month
  if (diffInCalendarMonths === 1) {
    return [i18n.time.next_month, formattedDate, ''];
  }

  // Match is happening in the following months
  if (diffInCalendarMonths > 1) {
    return [
      `${i18n.time.in} ${diffInCalendarMonths} ${i18n.time.months_later}`,
      formattedDate,
      '',
    ];
  }

  // Default return if none of the above conditions meet
  return ['', formattedDate, ''];
}
