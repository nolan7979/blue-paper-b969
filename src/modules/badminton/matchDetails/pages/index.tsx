import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import { QuickViewColumn as BmtQuickViewColumn } from '@/components/modules/badminton';

import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { MatchListIsolated } from '@/components/modules/badminton/match';
import QuickViewSummary from '@/components/modules/badminton/quickViewColumn/QuickViewSummary';
import { TwFilterCol } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useBadminton';
import { useTopLeagues } from '@/hooks/useCommon';
import { useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { isMatchLive, parseMatchDataArrayBadminton } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

interface MatchDetailsProps {
  matchData: SportEventDtoWithStat;
  matchId: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matchData, matchId }) => {
  const { locale } = useRouter();
  const i18n = useTrans();
  const statsLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);

  const { isConnectSocket } = useIsConnectSocketStore();
  const { setDateFilter, setMatchFilter } = useFilterStore();
  const { data: topLeagues } = useTopLeagues(SPORT.BADMINTON);
  const { data: matchDataV2, refetch } = useSelectedMatchData(
    matchData ? matchData?.id : matchId
  );
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale || i18n.language
  );

  const { mbDetailMatchTab, setMbDetailMatchTab } = useFilterStore();
  const { setMatchLiveInfo, matchLiveInfo } = useHomeStore();

  const { matchDetails ,setMatchDetails} = useMatchStore();

  const [matchesLive, setMatchesLive] = useState<any>({});

  const { data: liveMatches } = useLiveMatchData(SPORT.BADMINTON);
  useEffect(() => {
    let liveMatchesConvert = {};
    liveMatchesConvert =
      parseMatchDataArrayBadminton(liveMatches as string)?.reduce((acc, match) => {
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
    setMatchLiveInfo(false);
  }, []);

  useEffect(() => {
    setDateFilter(new Date());
    setMatchFilter('live');
  }, []);

  useEffect(() => {
    if (!matchDetails && matchDataV2) {
      setMatchDetails(matchDataV2);
    }
  }, [matchDataV2, matchDetails]);

  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);

  return (
    <>
      <div className='hidden py-4 lg:block'>
        {/* {matchData && <BreadCrumbMain matchData={matchData} />} */}
      </div>
      <div className='grid w-full grid-cols-12 gap-4 '>
        <div className='no-scrollbar top-0 col-span-4 hidden overflow-y-auto lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
          <div className='hidden xl:block'>
            <MatchListIsolated
              page={PAGE.liveScore}
              sport={SPORT.BADMINTON}
              isDetail
              matchesLive={memoizedMatchesLive}
              setMatchesLive={setMatchesLive}
            />
            <TwFilterCol className='flex-shrink-1 rounded-md '>
              <FilterColumn sport={SPORT.BADMINTON} isDetail={true} />
            </TwFilterCol>
          </div>
        </div>
        <div className='col-span-5 hidden lg:block'>
          <div className='sticky top-20'>
            <div className='dark:bg-primary-gradient dark:border-linear-box rounded-md'>
              <QuickViewSummary
                isDetail
                match={(matchDataV2 as SportEventDtoWithStat) || matchDetails}
              />
            </div>
          </div>
        </div>
        <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
          <div className='w-full rounded-md lg:p-3 lg:pt-0'>
            <BmtQuickViewColumn
              top={true}
              sticky={true}
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
