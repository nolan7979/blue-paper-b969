import { format } from "date-fns";

import { useDailySummaryData, useLiveMatchData } from "@/hooks/useSportData";

import { MatchList, MatchListByTime } from "@/components/modules/football";
import Skeleton from "@/components/Skeleton";

import { useFilterStore } from "@/stores";
import { useSortStore } from "@/stores/sort-store";

import { filterDifferentDate } from "@/utils";

const SportResultsMatchListSection = ({
  sport = 'football',
  page = 'results',
}: {
  sport: string;
  page: string;
}) => {
  // use match filter store
  const { matchTypeFilter } = useFilterStore();
  const { sortBy } = useSortStore();
  const { dateFilter, setDateFilter } = useFilterStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const { data: liveMatches = [], isLoading: isLoadingLiveMatches } =
    useLiveMatchData(sport);

  const { data: matches = [], isLoading } = useDailySummaryData(
    dateFilterString,
    sport
  );

  if (isLoading) {
    return (
      <div>
        {sortBy === 'time' ? (
          <Skeleton className='h-10 w-full bg-dark-red' />
        ) : (
          // TODO Match list by time skeleton
          <Skeleton className='h-10 w-full' />
          // TODO Match list skeleton
        )}
      </div>
    );
  }
  let filteredMatches: any[] = [];
  if (matchTypeFilter === 'live') {
    if (!isLoadingLiveMatches) {
      filteredMatches = liveMatches;
    }
  } else {
    if (sortBy !== 'time') {
      // sort by leagues
      filteredMatches = filterDifferentDate(matches, dateFilter); // all
    } else {
      filteredMatches = matches;
    }

    if (matchTypeFilter === 'finished') {
      filteredMatches = filteredMatches.filter((match: any) => {
        if (match.status?.code >= 91 || match.status?.type === 'finished') {
          return true;
        }
        return false;
      });
    } else if (matchTypeFilter === 'hot') {
      // TODO hot matches
    }
  }

  if (page === 'results') {
    filteredMatches = filteredMatches.filter((match: any) => {
      if (match.status?.code >= 91 || match.status?.type === 'finished') {
        return true;
      }
      return false;
    });
  }

  return (
    <>
      {sortBy === 'time' ? (
        <MatchListByTime
          matches={filteredMatches}
          dateFilter={dateFilter}
          page={page}
          sport={sport}
        />
      ) : (
        <MatchList
          matches={filteredMatches}
          page={page}
          sport={sport}
        />
      )}
    </>
  );
};

export default SportResultsMatchListSection;