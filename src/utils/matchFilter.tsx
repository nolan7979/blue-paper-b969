/* eslint-disable @typescript-eslint/no-explicit-any */

import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';

import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import {
  FAVORITE_TYPE,
  MatchState,
  SPORT_TYPE,
  SportEventDto,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import { IMatchFavorite } from '@/modules/favorite/components/MatchRowIsolateCommon';
import {
  formatMatchTimestamp,
  isMatchEnded,
  isMatchLive,
  isMatchOnDate,
  isValEmpty,
} from '@/utils';
import isSameDay from 'date-fns/isSameDay';
import { ca } from 'date-fns/locale';
import id from '~/lang/id';

interface IMatchOddsMapping {
  OddAsianHandicap: Map<string, string>;
  OddOverUnder: Map<string, string>;
  OddEuropean?: Map<string, string>;
  matchMapping: string;
  bookMakerId: string;
}
export const filterFinishedMatches = (
  matches: SportEventDtoWithStat[]
): SportEventDtoWithStat[] =>
  matches.filter((match) => match.status?.code === MatchState.End);

export const filterHotMatches = (
  matches: SportEventDtoWithStat[]
): SportEventDtoWithStat[] => {
  return matches.filter((match) => {
    return match?.tournament?.priority && match?.tournament?.priority <= 1000;
  });
};

export const filterMatchesByDate = (
  matches: SportEventDtoWithStat[],
  dateFilter: Date
): SportEventDtoWithStat[] => {
  const today = new Date();

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  if (isSameDay(today, dateFilter)) {
    return matches.filter((match) => {
      const { code } = match.status ?? {};

      const isPending =
        code < 61 &&
        ![
          MatchState.Postponed,
          MatchState.Interrupt,
          MatchState.CutInHalf,
          MatchState.Cancel,
          MatchState.NotStarted,
        ].includes(code);

      const isUpcoming =
        code === MatchState.NotStarted &&
        match.startTimestamp > currentTimeInSeconds;

      return isPending || isUpcoming;
    });
  }
  return matches;
};

const filterLiveMatches = (
  matches: SportEventDtoWithStat[]
): SportEventDtoWithStat[] => {
  return matches.filter((match) => {
    return isMatchLive(match.status.code) && !!match.id;
  });
};

export const calculateSortedMatchesToShow = (
  matches: Record<string, SportEventDtoWithStat>,
  matchFollowed: { matchId: string }[],
  matchTypeFilter: string,
  dateFilter: Date,
  page: string
): SportEventDtoWithStat[] => {
  if (isValEmpty(matches)) {
    return [];
  }

  let filteredMatches: SportEventDtoWithStat[] = Object.values(matches);

  if (
    matchTypeFilter === 'finished' ||
    matchTypeFilter === 'results' ||
    page === 'results'
  ) {
    filteredMatches = filterFinishedMatches(filteredMatches);
  } else if (matchTypeFilter === 'hot') {
    filteredMatches = filterHotMatches(filteredMatches);
  } else if (matchTypeFilter === 'live') {
    filteredMatches = filterLiveMatches(filteredMatches);
  } else {
    filteredMatches = filterMatchesByDate(filteredMatches, dateFilter);
  }
  const followedMatches = filteredMatches.filter((match) =>
    matchFollowed.some((follow) => follow?.matchId === match?.id)
  );

  const nonFollowedMatches = filteredMatches.filter((match) => {
    const [date, time] = formatMatchTimestamp(
      match.startTimestamp,
      match.status,
      true,
      match.time?.currentPeriodStartTimestamp
    );
    const isNaNTime = time === '0';
    return (
      !matchFollowed.some((follow) => follow?.matchId === match?.id) &&
      !isNaNTime
    );
  });

  if (
    matchTypeFilter === 'finished' ||
    matchTypeFilter === 'results' ||
    page === 'results'
  ) {
    followedMatches.sort((a, b) => b.startTimestamp - a.startTimestamp);
    nonFollowedMatches.sort((a, b) => b.startTimestamp - a.startTimestamp);
  } else {
    followedMatches.sort((a, b) => a.startTimestamp - b.startTimestamp);
    nonFollowedMatches.sort((a, b) => a.startTimestamp - b.startTimestamp);
  }

  return [...followedMatches, ...nonFollowedMatches];
};

export const groupByTournamentShow = (
  displayedData: SportEventDtoWithStat[]
) => {
  if (isValEmpty(displayedData)) {
    return [];
  }
  const groupedData: TournamentGroup[] = [];
  let currentTournament: any = null;
  let currentGroup: SportEventDtoWithStat[] | null = null;

  displayedData.forEach((item: any) => {
    if (!currentTournament || currentTournament !== item.tournament?.id) {
      currentTournament = item.tournament?.id;
      currentGroup = [];
      groupedData.push({
        tournament: item.tournament,
        matches: currentGroup,
      });
    }
    currentGroup?.push(item);
  });

  return groupedData;
};

export interface TournamentGroupVlb {
  uniqueTournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const groupByUniqueTournamentShow = (
  displayedData: SportEventDtoWithStat[]
) => {
  if (isValEmpty(displayedData)) {
    return [];
  }
  const groupedData: TournamentGroupVlb[] = [];
  let currentTournament: any = null;
  let currentGroup: SportEventDtoWithStat[] | null = null;

  displayedData.forEach((item: any) => {
    if (!currentTournament || currentTournament !== item.uniqueTournament?.id) {
      currentTournament = item.uniqueTournament?.id;
      currentGroup = [];
      groupedData.push({
        uniqueTournament: item.uniqueTournament,
        matches: currentGroup,
      });
    }
    currentGroup?.push(item);
  });

  return groupedData;
};

export const mappingOddsTestStore = ({
  OddAsianHandicap,
  OddOverUnder,
  matchMapping,
  bookMakerId,
  OddEuropean,
}: IMatchOddsMapping) => {
  const odds = OddAsianHandicap.get(`${matchMapping}_${bookMakerId}`);
  const odds2 = OddOverUnder.get(`${matchMapping}_${bookMakerId}`);
  const odds3 =
    OddEuropean && OddEuropean.get(`${matchMapping}_${bookMakerId}`);
  const extra1: string[] = (odds && odds.split('^')) || [];
  const extra2: string[] = (odds2 && odds2.split('^')) || [];
  const extra3: string[] = (odds3 && odds3.split('^')) || [];

  return {
    asian_hdp_home: extra1[3] || '',
    asian_hdp: extra1[2] || '',
    asian_hdp_away: extra1[4] || '',
    over: extra2[3] || '',
    over_under_hdp: extra2[2] || '',
    under: extra2[4] || '',
    european_home: extra3[3] || '',
    european_draw: extra3[2] || '',
    european_away: extra3[4] || '',
    inplay_asian: extra1[6] === '1' ? true : false,
    close_asian: extra1[7] === '1' ? true : false,
    inplay_overUnder: extra2[6] === '1' ? true : false,
    over_under_close: extra2[7] === '1' ? true : false,
    inplay_european: extra3[6] === '1' ? true : false,
    close_european: extra3[7] === '1' ? true : false,
  };
};

//check match have time = 0 and remove it from the array
export const isNaNTime = (match: SportEventDto) => {
  const time = formatMatchTimestamp(
    match.startTimestamp,
    match.status,
    true,
    match.time?.currentPeriodStartTimestamp
  );
  return time.length > 1 && parseInt(time[1]) === 0;
};

export const filterMatches = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  filterMobile: string,
  dateFilter: Date
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates = [
    MatchState.Postponed,
    MatchState.Interrupt,
    MatchState.CutInHalf,
    MatchState.Cancel,
  ];

  return matches.filter((match) => {
    const priority = parseInt(match?.tournament?.priority?.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const matchEnded = isMatchEnded(match.status?.code);
    const isMatchHot = priority <= mapMatchPriority[SPORT.FOOTBALL] && !matchEnded;
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

    if (page === PAGE.fixtures || filterMobile === MATCH_FILTERS.FIXTURES || ((filter === MATCH_FILTERS.ALL ||filter === MATCH_FILTERS.LIVE ) && isSameDay(today, dateFilter))) {
      return matchInProgress;
    }

    return true;
  });
};

export const groupByDate = (
  displayedData: IMatchFavorite[],
  type: 'asc' | 'desc' = 'desc'
) => {
  if (isValEmpty(displayedData)) {
    return [];
  }
  const groupedData: any[] = [];
  let currentDate: any = null;
  let currentGroup: IMatchFavorite[] | null = null;

  const sortDate:any = displayedData.sort((a:any, b:any) => {
    if(type === 'asc') {
      return a.formatDate.localeCompare(b.formatDate);
    } else {
      return b.formatDate.localeCompare(a.formatDate);
    }
  });

  sortDate.forEach((item: any) => {
    if (!currentDate || currentDate !== item?.formatDate) {
      currentDate = item?.formatDate;
      currentGroup = [];
      groupedData.push({
        date: item?.formatDate,
        matches: currentGroup,
      });
    }
    currentGroup?.push(item);
  });

  return groupedData;
};


export const GroupBySport = (
  displayedData: IMatchFavorite[]
) => {
  if (isValEmpty(displayedData)) {
    return [];
  }
  const groupedData: any[] = [];
  let currentSport: any = null;
  let currentGroup: IMatchFavorite[] | null = null;

  const sortSport:any = displayedData.sort((a:any, b:any) => {
    if(a.sport > b.sport) return -1
    if(a.sport < b.sport) return 1
    return 0;
  })

  sortSport.forEach((item: any) => {
    if (!currentSport || currentSport !== item?.sport) {
      currentSport = item?.sport;
      currentGroup = [];
      groupedData.push({
        sport: item?.sport,
        matches: currentGroup,
      });
    }
    currentGroup?.push(item);
  });

  return groupedData;
};

export const GroupByLeague = (
  displayedData: IMatchFavorite[]
) => {
  if (isValEmpty(displayedData)) {
    return [];
  }
  const groupedData: any[] = [];
  let currentLeague: any = null;
  let currentGroup: IMatchFavorite[] | null = null;

  const sortLeague:any = displayedData.sort((a:any, b:any) => {
    if(a.tournamentId != '' && b.tournamentId != '') {
      if(a.tournamentId > b.tournamentId) return -1
      if(a.tournamentId < b.tournamentId) return 1
    } else {
      if(a.uniqueTournament > b.uniqueTournament) return -1
      if(a.uniqueTournament < b.uniqueTournament) return 1
    }
    return 0;
  })

  sortLeague.forEach((item: any) => {
    if(item.tournamentId != '') {
      if (!currentLeague || currentLeague !== item?.tournamentId) {
        currentLeague = item?.tournamentId;
        currentGroup = [];
        groupedData.push({
          tournament: item?.tournamentId,
          sport: item?.sport,
          matches: currentGroup,
        });
      }
      currentGroup?.push(item);
    } else {
      if (!currentLeague || currentLeague !== item?.uniqueTournament) {
        currentLeague = item?.uniqueTournament;
        currentGroup = [];
        groupedData.push({
          tournament: item?.uniqueTournament,
          sport: item?.sport,
          matches: currentGroup,
        });
      }
      currentGroup?.push(item);
    }
  });

  return groupedData;
};

export const getSportName = (sportType: number) => {
  switch (sportType) {
    case SPORT_TYPE.Football:
      return 'football';
    case SPORT_TYPE.Basketball:
      return 'basketball';
    case SPORT_TYPE.Tennis: 
      return 'tennis';
    case SPORT_TYPE.Volleyball:
      return 'volleyball';
    case SPORT_TYPE.Badminton:
      return 'badminton';
    case SPORT_TYPE.Baseball:
      return 'baseball';
    case SPORT_TYPE.AMFootball:
      return 'american football';
    case SPORT_TYPE.Cricket:
      return 'cricket';
    case SPORT_TYPE.IceHockey:
      return 'hockey';
    case SPORT_TYPE.TableTennis:
      return 'table-tennis';
    case SPORT_TYPE.Snooker:
      return 'snooker';
    default:
      return '';
  }
}

export const getSportType = (sportName: string) => {
  switch (sportName) {
    case 'football':
      return SPORT_TYPE.Football;
    case 'basketball':
      return SPORT_TYPE.Basketball;
    case 'tennis': 
      return SPORT_TYPE.Tennis;
    case 'volleyball':
      return SPORT_TYPE.Volleyball;
    case 'badminton':
      return SPORT_TYPE.Badminton;
    case 'baseball':
      return SPORT_TYPE.Baseball;
    case 'am-football':
      return SPORT_TYPE.AMFootball;
    case 'cricket':
      return SPORT_TYPE.Cricket;
    case 'hockey':
      return SPORT_TYPE.IceHockey;
    case 'table-tennis':
      return SPORT_TYPE.TableTennis;
    case 'snooker':
      return SPORT_TYPE.Snooker;
    default:
      return '';
  }
};

export const getFavoriteType = (favoriteName: string) => {
  switch (favoriteName) {
    case 'competitor':
      return FAVORITE_TYPE.TEAM;
    case 'player':
      return FAVORITE_TYPE.PLAYER;
    case 'competition':
      return FAVORITE_TYPE.COMPETITION;
    default:
      return 0;
  }
}

const demoData = [
  {
    id:"mfiws1aoh0uztg4",
    name:"Premier League",
    shortName:"ENG Premier League",
    sportType:0,
    userId:"113501849769534120654",
    _id:"677278d086a03bed47c11dee",
  },
  {
    id:"jy2us9bzsyjs7fj",
    name:"LVBP",
    shortName:"LVBP",
    sportType:5,
    userId:"113501849769534120654",
    _id:"677278d086a03bed47c11dee",
  },
  {
    id:"s4luxyhillrrihp",
    name:"American Hockey League",
    shortName:"American Hockey League",
    sportType:8,
    userId:"113501849769534120654",
    _id:"677278d086a03bed47c11dee",
  },
  {
    id:"jy2us9rmd2ar7fj",
    name:"ITF Indonesia F6, Men Singles",
    shortName:"ITF Indonesia F6, Men Singles",
    sportType:2,
    userId:"113501849769534120654",
    _id:"677278d086a03bed47c11dee",
  },
]

const convertArrayToObject = (arr:any) => {
  return arr.reduce((acc:any, item:any) => {
      acc[item.sport] = item.data.map((it:any) => ({id: it.id, name: it.name}));
      return acc;
  }, {});
}

export const GroupBySportServerData = (
  inputData: any[]
) => {
  if (isValEmpty(inputData)) {
    return [];
  }
  const groupedData: any[] = [];
  let currentSport: any = null;
  let currentGroup: any[] | null = null;

  const sortSport:any = inputData.sort((a:any, b:any) => {
    if(a.sportType > b.sportType) return -1
    if(a.sportType < b.sportType) return 1
    return 0;
  })

  sortSport.forEach((item: any) => {
    if (currentSport !== item?.sportType) {
      currentSport = item?.sportType;
      currentGroup = [];
      groupedData.push({
        sport: getSportName(item?.sportType),
        data: currentGroup,
      });
    }
    currentGroup?.push(item);
  });
  const result = convertArrayToObject(groupedData);
  return result;
};
