import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import { QuickViewColumn as VlbQuickViewColumn } from '@/components/modules/volleyball/quickviewColumn/QuickViewColumn';

import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { TwFilterCol } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { MatchListIsolated } from '@/components/modules/volleyball/match';
import QuickViewSummary from '@/components/modules/volleyball/quickviewColumn/QuickViewSummary';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useTopLeagues } from '@/hooks/useCommon';
import useMqttClient from '@/hooks/useMqtt';
import { useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { useSelectedMatchData } from '@/hooks/useVolleyball';
import { isMatchLive, parseMatchDataVolleyball } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

interface MatchDetailsProps {
  matchData: SportEventDtoWithStat;
  matchId: string;
  isDetails?: boolean;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({
  matchData,
  matchId,
  isDetails,
}) => {
  const { locale } = useRouter();
  const i18n = useTrans();
  const statsLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);
  const [matchesLive, setMatchesLive] = useState<any>({});
  const { isConnectSocket } = useIsConnectSocketStore();
  const { data: topLeagues } = useTopLeagues(SPORT.VOLLEYBALL);
  const { data: matchDataV2, refetch } = useSelectedMatchData(
    matchData ? matchData?.id : matchId
  );
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale || i18n.language
  );

  const {
    mbDetailMatchTab,
    setMbDetailMatchTab,
    setDateFilter,
    setMatchFilter,
  } = useFilterStore();
  const { setMatchLiveInfo, matchLiveInfo } = useHomeStore();

  const { matchDetails } = useMatchStore();

  const { data: liveMatches } = useLiveMatchData(SPORT.VOLLEYBALL);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataVolleyball(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

  useEffect(() => {
    if (
      !isConnectSocket &&
      isMatchLive(matchData ? matchData.status.code : -1)
    ) {
      const intervalId = setInterval(() => {
        refetch();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isConnectSocket, refetch]);

  useEffect(() => {
    const checkStatsData = statsLocale && JSON.parse(statsLocale);

    if (statsDetailData) {
      setItem(
        LOCAL_STORAGE.statsLocaleDetail,
        JSON.stringify(statsDetailData, undefined, 2)
      );
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
    setMatchLiveInfo(false);
  }, []);

  useEffect(() => {
    setDateFilter(new Date());
    setMatchFilter('live');
  }, []);

  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);

  return (
    <div className='grid w-full grid-cols-12 gap-4 '>
      <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
        <div className='hidden xl:block'>
          <MatchListIsolatedSocket
            sport={SPORT.VOLLEYBALL}
            matchesLive={memoizedMatchesLive}
            setMatchesLive={setMatchesLive}
            isDetail={true}
          />
        </div>
        <TwFilterCol className='flex-shrink-1 rounded-md '>
          <FilterColumn sport={SPORT.VOLLEYBALL} isDetail={true} />
        </TwFilterCol>
      </div>
      <div className='col-span-5 hidden lg:block'>
        <div className='sticky top-20'>
          <div className='dark:border-linear-box rounded-md dark:bg-primary-gradient'>
            <QuickViewSummary
              isDetail={isDetails}
              match={(matchDataV2 as SportEventDtoWithStat) || matchDetails}
            />
          </div>
        </div>
      </div>
      <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
        <div className='w-full rounded-md lg:p-3 lg:pt-0'>
          <VlbQuickViewColumn
            top={true}
            sticky={true}
            matchId={matchId || matchDataV2?.id || matchData?.id}
            isDetail
          />
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;

export const MatchListIsolatedSocket: React.FC<{
  sport: SPORT;
  matchesLive: any;
  setMatchesLive: any;
  isDetail: boolean;
}> = ({ sport, matchesLive, setMatchesLive, isDetail }) => {
  const { matchLiveSocket } = useMqttClient(sport, true);
  const memoizedMatchesSocket = useMemo(
    () => matchLiveSocket,
    [matchLiveSocket]
  );

  return (
    <MatchListIsolated
      page={PAGE.liveScore}
      sport={sport}
      isDetail={isDetail}
      matchesLive={matchesLive}
      setMatchesLive={setMatchesLive}
      matchLiveSocket={memoizedMatchesSocket}
    />
  );
};
