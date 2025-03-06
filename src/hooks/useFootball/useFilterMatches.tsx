import { filterMatches } from '@/utils/matchFilter';
import { useMemo, useState } from 'react';

interface FilterMatchesProps {
  page: string;
  matchTypeFilter: string;
  matches: Record<string, any>;
  matchesLive: Record<string, any>;
  matchTypeFilterMobile: string;
  dateFilter: Date;
}

export const useFilterMatches = ({
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
    return filterMatches(
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
