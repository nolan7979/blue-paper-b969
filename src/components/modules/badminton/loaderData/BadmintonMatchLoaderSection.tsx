import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { useTopLeagues } from '@/hooks/useCommon';
import { useDailySummaryData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useLivescoreStore } from '@/stores/liveScore-store';

import { SPORT } from '@/constant/common';
import { parseMatchDataArrayBadminton } from '@/utils';

export const BadmintonMatchLoaderSection = ({ page }: { page: string }) => {
  let dateFilterString = '';
  const i18n = useTrans();
  const { dateFilter, setDateFilter, matchTypeFilter } =
    useFilterStore();

  const { setMatches,setTopLeagues } = useHomeStore();
  const { removeAllLivescore } = useLivescoreStore();
  // const { data: oddsCompany } = useOddsCompany();
  const { data: topLeagues } = useTopLeagues(SPORT.BADMINTON);

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
  const { data: matches = '', isLoading } = useDailySummaryData(
    dateFilterString,
    SPORT.BADMINTON,
    matchTypeFilter,
    i18n.language
  );

  useEffect(() => {
    if(topLeagues){
      setTopLeagues(topLeagues);
    }
    if (matches) {
      const parsedMatches = parseMatchDataArrayBadminton(matches as string);

      setMatches(parsedMatches);
      removeAllLivescore();
    }

    // if (oddsCompany && oddsCompany?.length > 0) {
    //   setOddsCompany(oddsCompany);
    // }
  }, [topLeagues, matches, setMatches, focusKey]);

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
