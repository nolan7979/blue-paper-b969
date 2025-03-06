import { format } from 'date-fns';
import { useEffect } from 'react';

import { useMoreMatchData } from '@/hooks/useFootball';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useFilterStore, useHomeStore } from '@/stores';
import { parseMatchDataArray } from '@/utils';

export const MoreMatchesIsolated = ({
  // page,
  sport = 'football',
}: {
  // page?: string;
  sport: string;
}) => {
  const { dateFilter, setDateFilter } = useFilterStore();
  const { addMatches } = useHomeStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const { data: matches = '', isFetching } = useMoreMatchData(
    dateFilterString,
    sport
  );

  useEffect(() => {
    if (matches) {
      const matches_ = parseMatchDataArray(matches);
      addMatches(matches_);
    }
  }, [matches, addMatches]);

  if (isFetching) {
    const ArrayFromOneToNine = Array.from(
      { length: 9 },
      (_, index) => index + 1
    );
    return (
      <div>
        {ArrayFromOneToNine.map((number) => (
          <MatchSkeleton key={number} />
        ))}
      </div>
    );
  }

  return <></>;
};
