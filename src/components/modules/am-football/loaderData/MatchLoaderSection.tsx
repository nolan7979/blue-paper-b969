import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';
import { useDailySummaryData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useLivescoreStore } from '@/stores/liveScore-store';

import { LOCAL_STORAGE, SPORT } from '@/constant/common';
import { competitionsByCountry } from '@/constant/competitions';
import { ILeaguesItems } from '@/models';
import { parseMatchDataArray, parseMatchDataBasketBall } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useTopLeagues } from '@/hooks/useCommon';
import { parseMatchDataArrayAMFootball } from '@/utils/americanFootballUtils';

export const MatchLoaderSection = ({
  page,
  sport,
}: {
  page: string;
  sport: string;
}) => {
  let dateFilterString = '';
  const i18n = useTrans();
  const countryLocal = i18n.language ?? '';
  const competitionCountry = competitionsByCountry[countryLocal] ?? [];
  const { mutate } = useMessage();
  const { dateFilter, setDateFilter, matchTypeFilter, setOddsCompany } =
    useFilterStore();

  const { setMatches, setTopLeagues } = useHomeStore();
  const { removeAllLivescore } = useLivescoreStore();
  // const { data: oddsCompany } = useOddsCompany();
  const { data: topLeagues, isError } = useTopLeagues(SPORT.AMERICAN_FOOTBALL);

  const { setShow1x2 } = useSettingsStore();
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

  // const bookMakerStorage = getItem('bookMaker');
  // const ParseBookMaker = bookMakerStorage && JSON.parse(bookMakerStorage);

  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }
  const { data: matches = '', isLoading } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter
  );

  useEffect(() => {
    const showTX = getItem(LOCAL_STORAGE.showTX) === 'true';
    const show1x2 = getItem(LOCAL_STORAGE.show1x2) === 'true';
    const showHdp = getItem(LOCAL_STORAGE.showHdp) === 'true';
    const isAllOddsSelected = showTX && show1x2 && showHdp;

    if (isAllOddsSelected) {
      setShow1x2(false);
    }

    const getNotice = getItem('notice_globle');
    if (!getNotice)
      try {
        mutate({
          matchId: 'global',
          isSubscribe: true,
          locale: i18n ? i18n.language : 'en',
        });
        setItem('notice_globle', 'true');
      } catch (error) {
        console.error(error);
        setItem('notice_globle', 'false');
      }
  }, []);

  const sortedTopLeagues = useMemo(() => {
    if (!topLeagues || topLeagues?.live === 0 || isError) return [];
    return [...topLeagues].sort((a, b) => {
      const indexA = competitionCountry.indexOf(a.id);
      const indexB = competitionCountry.indexOf(b.id);
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    });
  }, [topLeagues, competitionCountry, i18n.language]);

  useEffect(() => {
    if (sortedTopLeagues.length) setTopLeagues(sortedTopLeagues);
    if (matches) {
      const parsedMatches = parseMatchDataArrayAMFootball(matches as string);
      setMatches(parsedMatches);
      removeAllLivescore();
    }

    // if (oddsCompany && oddsCompany?.length > 0) {
    //   setOddsCompany(oddsCompany);
    // }
  }, [
    matches,
    setMatches,
    topLeagues,
    // oddsCompany,
    focusKey,
    i18n.language,
    sport,
  ]);

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
