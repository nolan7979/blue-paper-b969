import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useDailySummaryData, useTopLeagues } from '@/hooks/useCommon';
import { useFilterStore, useHomeStore } from '@/stores';
import { parseMatchDataArrayBaseball } from '@/utils/baseballUtils';

export const MatchLoaderSection = ({
  page,
  sport = 'football',
}: {
  page: string;
  sport: string;
}) => {
  let dateFilterString = '';
  const i18n = useTrans();
  // const { mutate } = useMessage();
  const { dateFilter, setDateFilter, matchTypeFilter, setOddsCompany } =
    useFilterStore();

  const { setMatches, setTopLeagues } = useHomeStore();
  const { data: topLeagues } = useTopLeagues(sport);

  const [focusKey, setFocusKey] = useState(0);

  // Add an event listener for window focus
  useEffect(() => {
    const handleFocus = () => {
      setFocusKey((prevKey) => prevKey + 1);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }
  const { data: matches, isLoading } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter,
    false
  );

  useEffect(() => {
    if(topLeagues) {
      setTopLeagues(topLeagues);
    }
    if (matches) {
      setMatches(parseMatchDataArrayBaseball(matches));
    }
  }, [matches, setMatches, focusKey, i18n.language, sport,topLeagues]);

  if (isLoading) {
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
