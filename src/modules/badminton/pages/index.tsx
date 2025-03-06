import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import { QuickViewColumn as VlbQuickViewColumn } from '@/components/modules/baseball/quickviewColumn/QuickViewColumn';

import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { MatchListIsolated } from '@/components/modules/baseball/match';
import { TwFilterCol } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchBBData } from '@/hooks/useBaseball';
import { useTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { isMatchLive } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
import dynamic from 'next/dynamic';

const QuickViewSummary = dynamic(
  () =>
    import('@/components/modules/baseball/quickviewColumn/QuickViewSummary'),
  {
    ssr: false,
  }
);

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
  const { data: topLeagues } = useTopLeagues(SPORT.BASEBALL);
  const { data: matchDataV2, refetch } = useSelectedMatchBBData(
    matchData ? matchData?.id : matchId
  );
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale || i18n.language
  );

  const { mbDetailMatchTab, setMbDetailMatchTab } = useFilterStore();
  const { setMatchLiveInfo, matchLiveInfo } = useHomeStore();

  const { matchDetails } = useMatchStore();

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
  return (
    <>
      <div className='hidden py-4 lg:block'>
        {/* {matchData && <BreadCrumbMain matchData={matchData} />} */}
      </div>
      <div className='grid w-full grid-cols-12 gap-4 '>
        <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
          <div className='hidden xl:block'>
            <MatchListIsolated
              page={PAGE.liveScore}
              sport={SPORT.BASEBALL}
              isDetail
            />
          </div>
          <TwFilterCol className='flex-shrink-1 rounded-md '>
            <FilterColumn sport={SPORT.BASEBALL} isDetail={true} />
          </TwFilterCol>
        </div>
        <div className='col-span-5 hidden lg:block'>
          <div className='sticky top-20'>
            <div className='dark:border-linear-box rounded-md dark:bg-primary-gradient'>
              <QuickViewSummary
                isDetail
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
    </>
  );
};

export default MatchDetails;
