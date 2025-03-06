import { format } from 'date-fns';
import { use, useEffect, useMemo, useRef, useState } from 'react';

// import { useTopLeagues } from '@/hooks/useFootball';
import { useMessage } from '@/hooks/useFootball/useMessage';
import useTrans from '@/hooks/useTrans';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';

import { LOCAL_STORAGE, SPORT } from '@/constant/common';
import { competitionsByCountry } from '@/constant/competitions';
import {
  ILanguageKey,
  hotLeaguesFootball,
} from '@/constant/leagues/hotLeaguesFootball';
import { ILeaguesItems } from '@/models';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useTopLeagues } from '@/hooks/useCommon';
export const FootballMatchLoaderSection = ({
  page,
  sport = 'football',
}: {
  page: string;
  sport: string;
}) => {
  // const i18n = useTrans();
  const dateFilterRef = useRef<any>(null);
  // const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  // const competitionCountry = competitionsByCountry[countryLocal] ?? [];
  // const { mutate } = useMessage();
  const { dateFilter } = useFilterStore();
  const { setTopLeagues, topLeagues, removeMatches, setLoadingMatches } =
    useHomeStore();
  // const { data: oddsCompany } = useOddsCompany();
  const { data: topLeaguesData, isError } = useTopLeagues(SPORT.CRICKET);

  // const { setShow1x2 } = useSettingsStore();
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

  useEffect(() => {
    // remove all matches when dateFiter change
    const dateFormat = format(dateFilter, 'yyyy-MM-dd');
    if (dateFilterRef.current !== dateFormat) {
      dateFilterRef.current = dateFormat;
      removeMatches();
      setLoadingMatches(true);
    }
  }, [dateFilter]);

  // useEffect(() => {
  //   const showTX = getItem(LOCAL_STORAGE.showTX) === 'true';
  //   const show1x2 = getItem(LOCAL_STORAGE.show1x2) === 'true';
  //   const showHdp = getItem(LOCAL_STORAGE.showHdp) === 'true';
  //   const isAllOddsSelected = showTX && show1x2 && showHdp;

  //   if (isAllOddsSelected) {
  //     setShow1x2(false);
  //   }

  //   const getNotice = getItem('notice_globle');
  //   if (!getNotice)
  //     try {
  //       mutate({
  //         matchId: 'global',
  //         isSubscribe: true,
  //         locale: i18n ? i18n.language : 'en',
  //       });
  //       setItem('notice_globle', 'true');
  //     } catch (error) {
  //       console.error(error);
  //       setItem('notice_globle', 'false');
  //     }
  // }, []);

  useEffect(() => {
    setTopLeagues([]);
  }, []);

  // const sortedTopLeagues = useMemo(() => {
  //   setTopLeagues([]);
  //   if (!topLeaguesData || topLeaguesData?.live === 0 || isError) return [];
  //   const prioritizedLeagues: ILeaguesItems[] =
  //     hotLeaguesFootball[countryLocal];

  //   if (!prioritizedLeagues) return topLeaguesData;

  //   const remainingLeagues = topLeaguesData.filter(
  //     (league: ILeaguesItems) =>
  //       !prioritizedLeagues.some(
  //         (prioritized: ILeaguesItems) => prioritized.id === league.id
  //       )
  //   );

  //   // Sắp xếp remainingLeagues dựa trên competitionCountry
  //   const sortedRemainingLeagues = remainingLeagues.sort(
  //     (a: ILeaguesItems, b: ILeaguesItems) => {
  //       const indexA = competitionCountry.indexOf(a.id);
  //       const indexB = competitionCountry.indexOf(b.id);
  //       return (
  //         (indexA === -1 ? Infinity : indexA) -
  //         (indexB === -1 ? Infinity : indexB)
  //       );
  //     }
  //   );

  //   return [...prioritizedLeagues, ...sortedRemainingLeagues];
  // }, [topLeaguesData, competitionCountry, i18n.language]);

  useEffect(() => {
    if (topLeaguesData?.length > 0 && topLeagues.length === 0)
      setTopLeagues(topLeaguesData);
  }, [topLeagues, topLeaguesData]);

  return <></>;
};
