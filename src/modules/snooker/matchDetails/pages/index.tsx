import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSelectedMatchData } from '@/hooks/useCommon';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import BreadCrumbMain from '@/components/breadcumbs/BreadCrumbMain';
import { MatchListIsolated } from '@/components/modules/snooker/match/MatchListIsolated';
import { QuickViewColumn } from '@/components/modules/snooker/quickviewColumn/QuickViewColumn';
import { TwFilterCol } from '@/components/modules/snooker/tw-components';

import { useFilterStore, useMatchStore } from '@/stores';

import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import QuickViewSummary from '@/components/modules/snooker/quickviewColumn/QuickViewSummary';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { useTopLeagues } from '@/hooks/useCommon';
import useMqttClient from '@/hooks/useMqtt';
import { useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { useConnectionStore } from '@/stores/connection-store';
import { useEventCountStore } from '@/stores/event-count';
import { parseMatchDataArray } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

interface MatchDetailsProps {
  matchData: SportEventDtoWithStat;
  matchId: string;
  isDesktop?: boolean;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({
  matchData,
  matchId,
  isDesktop,
}) => {
  const i18n = useTrans();
  const { locale } = useRouter();
  const statsLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);
  const { isConnected } = useConnectionStore();

  const { data: topLeagues } = useTopLeagues(SPORT.SNOOKER);
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 1024, [width]);

  const {
    data: matchDataV2,
    refetch,
    isRefetching,
  } = useSelectedMatchData(matchData ? matchData?.id : matchId, SPORT.SNOOKER);
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale || i18n.language
  );

  const {
    setDateFilter,
    setMatchFilter,
    mbDetailMatchTab,
    setMbDetailMatchTab,
  } = useFilterStore();
  // const { setMatchLiveInfo } = useHomeStore();

  const { matchDetails, showSelectedMatch, setMatchDetails } = useMatchStore();
  const memoizedShowSelectedMatch = useMemo(
    () => showSelectedMatch,
    [showSelectedMatch]
  );

  const extraHasData = (data: SportEventDtoWithStat) => {
    return {
      lineup: data?.lineup,
      has_standing: data?.has_standing,
      has_player_stats: data?.has_player_stats,
      has_commentary: data?.has_commentary,
      has_advanced_stats: data?.has_advanced_stats,
      stage_id: data?.stage_id,
      season: data?.season,
    };
  };

  const matchShowData = useMemo(() => {
    const matchDataRender = {
      ...matchData,
      ...matchDataV2,
      ...matchDetails,
      ...extraHasData(matchData as SportEventDtoWithStat),
    };

    if (isRefetching) {
      return { ...matchDataRender, ...matchDataV2 };
    }

    return matchDataRender;
  }, [matchDataV2, matchDetails, matchData, isRefetching]);

  useEffect(() => {
    if (!matchDetails && matchDataV2) {
      setMatchDetails(matchDataV2);
    }
  }, [matchDataV2, matchDetails]);

  useEffect(() => {
    const checkStatsData = statsLocale && JSON.parse(statsLocale);
    if (checkStatsData?.stat) {
      // setIsFetching(true);
    }
    if (statsDetailData) {
      setItem(
        LOCAL_STORAGE.statsLocaleDetail,
        JSON.stringify(statsDetailData, undefined, 2)
      );
      // setIsFetching(false);
    }
  }, [statsDetailData]);

  useEffect(() => {
    const parseLocale = currentLocale && JSON.parse(currentLocale);

    if (parseLocale !== locale) {
      // setIsFetching(true);
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
    }
  }, [locale]);

  useEffect(() => {
    if (mbDetailMatchTab !== 'details') {
      setMbDetailMatchTab('details');
    }
    setDateFilter(new Date());
    setMatchFilter('live');
  }, []);

  useEffect(() => {
    if (
      !isConnected &&
      matchShowData?.status?.code > 0 &&
      matchShowData?.status?.code < 60
    ) {
      const interval = setInterval(() => {
        refetch();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isConnected, matchShowData?.status?.code]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  return (
    <>
      <div className='hidden py-4 lg:block'>
        {matchData && (
          <BreadCrumbMain matchData={matchData} sport={SPORT.SNOOKER} />
        )}
      </div>
      <div className='grid w-full grid-cols-12 gap-4 '>
        {isDesktop && (
          <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
            <MatchListIsolatedSocket sport={SPORT.SNOOKER} />
            <TwFilterCol className='flex-shrink-1 rounded-md '>
              <FilterColumn sport={SPORT.SNOOKER} isDetail={true} />
            </TwFilterCol>
          </div>
        )}
        {isDesktop && (
          <div className='col-span-5 hidden lg:block'>
            <div className='sticky top-20'>
              <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
                <QuickViewSummary
                  match={matchShowData as SportEventDtoWithStat}
                  isSelectMatch={memoizedShowSelectedMatch}
                  isDetail={true}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        )}
        <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
          <div className='w-full rounded-md lg:p-3 lg:pt-0'>
            <QuickViewColumn
              top={true}
              sticky={true}
              isMobile={isMobile}
              matchData={matchShowData as SportEventDtoWithStat}
              matchId={matchId || matchDataV2?.id || matchData?.id}
              isDetail
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchDetails;

export const MatchListIsolatedSocket: React.FC<{
  sport: SPORT;
}> = ({ sport }) => {
  const eventNumberRef = useRef<number | null>(null);
  const [matchesLive, setMatchesLive] = useState<any>({});
  const { matchLiveSocket } = useMqttClient(sport, true);
  const { eventNumber } = useEventCountStore();
  const { isConnected } = useConnectionStore();
  const memoizedMatchesSocket = useMemo(
    () => matchLiveSocket,
    [matchLiveSocket]
  );

  const {
    data: liveMatches,
    refetch,
    isRefetching,
  } = useLiveMatchData(SPORT.SNOOKER, parseMatchDataArray);

  useEffect(() => {
    if (!isConnected && liveMatches && Object.keys(liveMatches).length > 0) {
      const intervalId = setInterval(() => {
        refetch();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isConnected, refetch, liveMatches]);

  useEffect(() => {
    if (eventNumberRef.current === null) {
      eventNumberRef.current = eventNumber;
    }
    const isChangeEventNumber =
      eventNumberRef.current !== eventNumber && eventNumber > 0;
    if (isChangeEventNumber) {
      refetch();
      eventNumberRef.current = eventNumber;
    }
  }, [eventNumber, refetch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    setMatchesLive(liveMatches);
  }, [liveMatches]);

  return (
    <MatchListIsolated
      page={PAGE.liveScore}
      sport={sport}
      isDetail={true}
      matchesLive={matchesLive}
      setMatchesLive={setMatchesLive}
      matchLiveSocket={memoizedMatchesSocket}
      isLiveMatchRefetching={isRefetching}
    />
  );
};
