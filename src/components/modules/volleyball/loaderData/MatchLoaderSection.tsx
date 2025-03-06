import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { useOddsCompany, useTopLeagues } from '@/hooks/useFootball';
import { useMessage } from '@/hooks/useFootball/useMessage';
import { useDailySummaryData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useFilterStore, useHomeStore } from '@/stores';

export const MatchLoaderSection = ({
  page,
  sport = 'football',
}: {
  page: string;
  sport: string;
}) => {
  let dateFilterString = '';
  const i18n = useTrans();
  const { mutate } = useMessage();
  const { dateFilter, setDateFilter, matchTypeFilter, setOddsCompany } =
    useFilterStore();

  const { setMatches, setTopLeagues } = useHomeStore();
  const { data: topLeagues } = useTopLeagues();

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
    matchTypeFilter
  );

  useEffect(() => {
    if (matches) {
      setMatches(matches);
    }
  }, [matches, setMatches, focusKey, i18n.language, sport]);

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
