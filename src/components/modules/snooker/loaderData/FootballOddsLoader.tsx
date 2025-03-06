import { format } from 'date-fns';
import { useEffect } from 'react';

import { useDailyOddsCompactData } from '@/hooks/useFootball/useOddsData';

import { useFilterStore, useHomeStore, useOddsStore } from '@/stores';

import { isValEmpty, parseOddMatchDataArray } from '@/utils';

export const FootballOddsLoader = () => {
  const { dateFilter, setDateFilter } = useFilterStore();
  const { selectedBookMaker, market } = useOddsStore();

  const { addMatchOdds } = useHomeStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const { data: odds } = useDailyOddsCompactData(
    dateFilterString,
    selectedBookMaker?.id.toString()
  );

  useEffect(() => {
    if (!isValEmpty(odds as string)) {
      addMatchOdds(parseOddMatchDataArray(odds));
    }
  }, [odds, addMatchOdds]);

  return <></>;
};
