import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import { MatchListIsolated as MatchListIsolatedAMFootball } from '@/components/modules/am-football/match';
import { QuickViewColumn as AMFQuickViewColumn } from '@/components/modules/am-football/quickviewColumn';

import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';

import QuickViewSummary from '@/components/modules/am-football/quickviewColumn/QuickViewSummary';
import { TwFilterCol } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData, useTopLeagues } from '@/hooks/useCommon';
import { useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { parseMatchDataArrayAMFootball } from '@/utils/americanFootballUtils';
import { getItem, setItem } from '@/utils/localStorageUtils';
import React from 'react';

interface MatchDetailsProps {
  matchData: SportEventDtoWithStat;
  matchId: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matchData, matchId }) => {
  const i18n = useTrans();
  const { locale } = useRouter();
  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    []
  );
  const currentLocale = useMemo(() => getItem(LOCAL_STORAGE.currentLocale), []);
  const { setMatchDetails } = useMatchStore();

  const [matchesLive, setMatchesLive] = useState<
    SportEventDtoWithStat | object
  >({});

  const { data: topLeagues } = useTopLeagues(SPORT.AMERICAN_FOOTBALL);

  const { data: matchDataV2 } = useSelectedMatchData(
    matchData ? matchData?.id : '',
    SPORT.AMERICAN_FOOTBALL
  );
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale || i18n.language
  );

  const { mbDetailMatchTab, setMbDetailMatchTab } = useFilterStore();
  const { setMatchLiveInfo, matchLiveInfo } = useHomeStore();

  const { data: liveMatches } = useLiveMatchData(SPORT.AMERICAN_FOOTBALL);

  const { matchDetails } = useMatchStore();

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayAMFootball(liveMatches as string)?.reduce(
        (acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        },
        {} as Record<string, any>
      ) || {};
    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

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
    setMatchDetails(matchDataV2 || matchDetails);
  }, [matchDataV2, matchDetails]);

  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);

  return (
    <div className='grid w-full grid-cols-12 gap-4 '>
      <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
        <div className='hidden xl:block'>
          <MatchListIsolatedAMFootball
            page={PAGE.liveScore}
            sport={SPORT.AMERICAN_FOOTBALL}
            isDetail
            matchesLive={memoizedMatchesLive}
            setMatchesLive={setMatchesLive}
          />
        </div>
        <TwFilterCol className='flex-shrink-1 rounded-md '>
          <FilterColumn sport={SPORT.AMERICAN_FOOTBALL} isDetail={true} />
        </TwFilterCol>
      </div>
      <div className='col-span-5 hidden lg:block'>
        <div className='sticky top-20'>
          <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
            <QuickViewSummary
              match={(matchData as SportEventDtoWithStat) || matchDetails}
              isDetail
            />
          </div>
        </div>
      </div>
      <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
        <div className='w-full rounded-md lg:p-3 lg:pt-0'>
          <AMFQuickViewColumn
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
