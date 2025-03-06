// import { filterMatches } from '@/utils/matchFilter';
import { MATCH_FILTERS, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { mapMatchPriority } from '@/constant/matchPriority';
import { isMatchEnded, MatchStateSnooker } from '@/utils';
import { isMatchOnDate } from '@/utils/common-utils';
import { isSameDay } from 'date-fns';
import { useMemo, useState } from 'react';

interface FilterMatchesProps {
  page: string;
  matchTypeFilter: string;
  matches: Record<string, any>;
  matchesLive: Record<string, any>;
  matchTypeFilterMobile: string;
  dateFilter: Date;
}

export const useFilterMatchesSnooker = ({
  page,
  matchTypeFilterMobile,
  matchTypeFilter,
  matches = {},
  matchesLive = {},
  dateFilter
}: FilterMatchesProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const filteredMatches = useMemo(() => {
    const matchesShow = matchTypeFilter === 'live' ? matchesLive : {...matches, ...matchesLive};
    return filterMatchesSnooker(
      Object.values(matchesShow),
      page,
      matchTypeFilter,
      matchTypeFilterMobile,
      dateFilter
    );
  }, [
    page,
    matchTypeFilter,
    matchTypeFilterMobile,
    matches,
    matchesLive,
    dateFilter,
  ]);

  return { filteredMatches, setIsLoading, isLoading };
};

export const filterMatchesSnooker = (
  matches: SportEventDtoWithStat[],
  page: string,
  filter: string,
  filterMobile: string,
  dateFilter: Date
): SportEventDtoWithStat[] => {
  const today = new Date();
  const matchEndedStates = [
      MatchStateSnooker.postponed,
      MatchStateSnooker.interrupted,
      MatchStateSnooker.finished,
      MatchStateSnooker.Ended,
    ];
  

  return matches.filter((match) => {
    const priority = parseInt(match?.tournament?.priority?.toString(), 10);
    const isDateFilterMatching = isMatchOnDate(match.startTimestamp, dateFilter);
    const matchEnded = matchEndedStates.includes(match?.status?.code);
    const isMatchHot = priority <= mapMatchPriority[SPORT.SNOOKER] && !matchEnded;
    const matchInProgress = !matchEnded && !matchEndedStates.includes(match?.status?.code);

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
  }).sort((a, b) => a.startTimestamp - b.startTimestamp);
};
