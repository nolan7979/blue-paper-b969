import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useLocaleStatsDetailHead,
  useSelectedMatchData,
} from '@/hooks/useFootball';

import BreadCrumbMain from '@/components/breadcumbs/BreadCrumbMain';
import { MatchListIsolated } from '@/components/modules/football/match/MatchListIsolated';
import { QuickViewColumn } from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import RatingSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/RatingSection';
import QuickViewPossessionRate from '@/components/modules/football/quickviewColumn/QuickViewPossessionRate';
import { TwFilterCol } from '@/components/modules/football/tw-components';

import { useFilterStore, useMatchStore } from '@/stores';

import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useDetectDeviceClient } from '@/hooks';
import useMqttClient from '@/hooks/useMqtt';
import { useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import MatchDetailSummary from '@/modules/football/matchDetails/components/MatchSumaryDetails';
import { useConnectionStore } from '@/stores/connection-store';
import { useEventCountStore } from '@/stores/event-count';
import { parseMatchDataArray } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
interface MatchDetailsProps {
  matchData: SportEventDtoWithStat;
  matchId: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matchData, matchId }) => {
  const i18n = useTrans();
  const { locale } = useRouter();
  const statsLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);
  const { isConnected } = useConnectionStore();
  const { isDesktop } = useDetectDeviceClient();
  const [activeRating, setActiveRating] = useState<string | null>(null);

  const isMatchLive = useMemo(() => {
    return matchData?.status?.code > 0 && matchData?.status?.code < 60;
  }, [matchData?.status?.code]);

  const {
    data: matchDataV2,
    refetch,
    isRefetching,
  } = useSelectedMatchData(
    matchData ? matchData?.id : matchId,
    isMatchLive ? 1000 : 30000,
    isMatchLive ? 1000 : 30000
  );
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

  const { matchDetails, setMatchDetails } = useMatchStore();

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
      return { ...matchDataRender, ...matchDataV2};
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
      matchShowData?.status?.code !== undefined &&
      matchShowData.status.code > 0 &&
      matchShowData.status.code < 60
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
        {matchData && Object.keys(matchData).length > 0 && (
          <BreadCrumbMain matchData={matchData} sport={SPORT.FOOTBALL} />
        )}
      </div>
      <div className='grid w-full grid-cols-12 gap-4 '>
        {isDesktop && (
          <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
            <MatchListIsolatedSocket sport={SPORT.FOOTBALL} />
            <TwFilterCol className='flex-shrink-1 rounded-md '>
              <FilterColumn sport={SPORT.FOOTBALL} isDetail={true} />
            </TwFilterCol>
          </div>
        )}
        {isDesktop && (
          <div className='col-span-5 hidden lg:block'>
            <div className='sticky top-20'>
              <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
                <MatchDetailSummary
                  isDetails={true}
                  matchData={matchShowData as SportEventDtoWithStat}
                />

                <div className='border-b border-dotted border-[#272A31]'>
                  <QuickViewPossessionRate
                    matchData={matchShowData as SportEventDtoWithStat}
                    isDetail
                  />
                </div>

                {/* Rating */}
                <div className='px-8'>
                  <RatingSection
                    matchData={matchShowData as SportEventDtoWithStat}
                    isDetail
                    setActiveTab={setActiveRating}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
          <div className='w-full rounded-md lg:p-3 lg:pt-0'>
            <QuickViewColumn
              top={true}
              sticky={true}
              isMobile={!isDesktop}
              matchData={matchShowData as SportEventDtoWithStat}
              matchId={matchId || matchDataV2?.id || matchData?.id}
              isDetail
              activeRating={activeRating}
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
  } = useLiveMatchData(SPORT.FOOTBALL, parseMatchDataArray);

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

  return (
    <MatchListIsolated
      page={PAGE.liveScore}
      sport={sport}
      isDetail={true}
      matchesLive={liveMatches}
      matchLiveSocket={memoizedMatchesSocket}
      isLiveMatchRefetching={isRefetching}
    />
  );
};
