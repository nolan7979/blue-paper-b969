import { useEffect, useMemo } from 'react';

import { useTopLeagues } from '@/hooks/useFootball';
import { useMessage } from '@/hooks/useFootball/useMessage';
import useTrans from '@/hooks/useTrans';

import { useHomeStore, useSettingsStore } from '@/stores';

import { LOCAL_STORAGE } from '@/constant/common';
import { competitionsByCountry } from '@/constant/competitions';
import {
  ILanguageKey,
  hotLeaguesFootball,
} from '@/constant/leagues/hotLeaguesFootball';
import { ILeaguesItems } from '@/models';
import { getItem, setItem } from '@/utils/localStorageUtils';
export const FootballMatchLoaderSection = ({
  page,
  sport = 'football',
}: {
  page: string;
  sport: string;
}) => {
  const i18n = useTrans();
  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  const competitionCountry = competitionsByCountry[countryLocal] ?? [];
  const { mutate } = useMessage();
  const { setTopLeagues, topLeagues } = useHomeStore();
  const { data: topLeaguesData, isError } = useTopLeagues();

  const { setShow1x2 } = useSettingsStore();
  // const [focusKey, setFocusKey] = useState(0);

  // Add an event listener for window focus
  // useEffect(() => {
  //   const handleFocus = () => {
  //     setFocusKey((prevKey) => prevKey + 1);
  //   };

  //   window.addEventListener('focus', handleFocus);

  //   return () => {
  //     window.removeEventListener('focus', handleFocus);
  //   };
  // }, []);

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
    if (!topLeaguesData || topLeaguesData?.live === 0 || isError) return [];
    const prioritizedLeagues: ILeaguesItems[] =
      hotLeaguesFootball[countryLocal];

    if (!prioritizedLeagues) return topLeaguesData;

    const remainingLeagues = topLeaguesData.filter(
      (league: ILeaguesItems) =>
        !prioritizedLeagues.some(
          (prioritized: ILeaguesItems) => prioritized.id === league.id
        )
    );

    // Sắp xếp remainingLeagues dựa trên competitionCountry
    const sortedRemainingLeagues = remainingLeagues.sort(
      (a: ILeaguesItems, b: ILeaguesItems) => {
        const indexA = competitionCountry.indexOf(a.id);
        const indexB = competitionCountry.indexOf(b.id);
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      }
    );

    return [...prioritizedLeagues, ...sortedRemainingLeagues];
  }, [topLeaguesData, competitionCountry, i18n.language]);

  useEffect(() => {

    if (sortedTopLeagues.length > 0 && topLeagues.length === 0)
      setTopLeagues(sortedTopLeagues);
  }, [topLeagues, sortedTopLeagues,topLeaguesData]);

  return <></>;
};
