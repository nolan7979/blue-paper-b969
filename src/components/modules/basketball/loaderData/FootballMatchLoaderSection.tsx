import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { useOddsCompany, useTopLeagues } from '@/hooks/useFootball';
import { useMessage } from '@/hooks/useFootball/useMessage';
import { useDailySummaryData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useLivescoreStore } from '@/stores/liveScore-store';

import { LOCAL_STORAGE } from '@/constant/common';
import { competitionsByCountry } from '@/constant/competitions';
import { ILeaguesItems } from '@/models';
import { parseMatchDataArray, parseMatchDataBasketBall } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
export const FootballMatchLoaderSection = ({
  page,
  sport = 'football',
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
  const { data: oddsCompany } = useOddsCompany();
  const { data: topLeagues } = useTopLeagues();

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
    if (!topLeagues || topLeagues?.live === 0) return [];

    // Mảng các giải đấu ưu tiên mà bạn muốn thêm thủ công
    const prioritizedLeagues: ILeaguesItems[] = [
      {
        id: '7au4xbko7zt97f7',
        name: 'Brasileirão Betano',
      },
      {
        id: 'm2q3xlro8xp8ag1',
        name: 'Série B',
      },
      {
        id: 'c9dxsq8owot1o5r',
        name: 'Copa do Brasil',
      },
    ];

    // Nếu ngôn ngữ là 'pt-BR', ưu tiên các giải đấu trong prioritizedLeagues
    if (i18n.language === 'pt-BR') {
      // Lọc ra các giải đấu không có trong prioritizedLeagues
      const remainingLeagues = topLeagues.filter(
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

      // Trả về kết hợp của prioritizedLeagues và sortedRemainingLeagues
      return [...prioritizedLeagues, ...sortedRemainingLeagues];
    }

    // Sắp xếp topLeagues như bình thường nếu không phải 'br'
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
      let parsedMatches;
      if (sport === 'football') {
        parsedMatches = parseMatchDataArray(matches as string);
      }
      if (sport === 'basketball') {
        parsedMatches = parseMatchDataBasketBall(matches as string);
      }
      setMatches(parsedMatches);
      removeAllLivescore();
    }

    if (oddsCompany && oddsCompany?.length > 0) {
      setOddsCompany(oddsCompany);
    }
  }, [matches, setMatches, topLeagues, oddsCompany, focusKey, i18n.language]);

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
