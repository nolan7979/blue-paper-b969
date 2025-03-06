import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';

import { MatchListIsolated } from '@/components/modules/cricket/match/MatchListIsolated';
import { QuickViewColumn } from '@/components/modules/cricket/quickviewColumn/QuickViewColumn';
import {
  TwFilterCol,
  TwFilterTitle,
} from '@/components/modules/cricket/tw-components';

import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import MatchDetailSummary from '@/modules/cricket/matchDetails/components/MatchSumaryDetails';
import { getSlug, isMatchLive } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useTopLeagues } from '@/hooks/useCommon';
import { useLiveMatchData } from '@/hooks/useSportData';
import { FilterColumn, TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { parseMatchDataArray } from '@/utils/cricketUtils';
import { useSelectedMatchData } from '@/hooks/useCricket';
import PlayByPlaySection from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab/PlayByPlaySection';
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import useMqttClient from '@/hooks/useMqtt';
import { AllLeagues } from '@/components/modules/common/filters/AllLeagues';

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

  const { isConnectSocket } = useIsConnectSocketStore();
  const { data: topLeagues } = useTopLeagues(SPORT.CRICKET);
  const { data: matchDataV2, refetch } = useSelectedMatchData(
    matchData ? matchData?.id : matchId
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

  const [matchesLive, setMatchesLive] = useState<any>({});

  const { data: liveMatches } = useLiveMatchData(SPORT.CRICKET);

  useEffect(() => {
    let liveMatchesConvert = {};
    liveMatchesConvert =
      parseMatchDataArray(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

  useEffect(() => {
    setDateFilter(new Date());
    setMatchFilter('live');
  }, []);

  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);

  return (
    <>
      <div className='hidden py-4 lg:block'>
        {matchData && (
          <BreadCrumb className='overflow-x-scroll no-scrollbar'>
            <BreadCumbLink href='/cricket' name={i18n.header.cricket} />
            <BreadCrumbSep />
            <BreadCumbLink
              href={`/cricket/competition/${getSlug(
                matchData?.uniqueTournament?.short_name ||
                  matchData?.uniqueTournament?.name
              )}/${matchData?.uniqueTournament?.id}`}
              name={
                matchData?.uniqueTournament?.short_name ||
                matchData?.uniqueTournament?.name
              }
            />
            <BreadCrumbSep />
            <BreadCumbLink
              href={`/cricket/match/${getSlug(matchData?.slug || 'slug')}/${
                matchData?.id
              }`}
              name={`${matchData?.awayTeam.name} vs ${matchData?.homeTeam.name}`}
              isEnd
            />
          </BreadCrumb>
        )}
      </div>
      <div className='grid w-full grid-cols-12 gap-4 '>
        {isDesktop && (
          <div className='top-0 col-span-4 hidden overflow-y-auto no-scrollbar lg:sticky lg:col-span-3 lg:block lg:h-[91vh]'>
            <div className='hidden xl:block'>
              <MatchListIsolatedSocket
                sport={SPORT.CRICKET}
                matchesLive={memoizedMatchesLive}
                setMatchesLive={setMatchesLive}
              />
            </div>
            <TwFilterCol className='flex-shrink-1 rounded-md '>
              <FilterColumn sport={SPORT.CRICKET} isDetail={true} />
            </TwFilterCol>
          </div>
        )}
        {isDesktop && (
          <div className='col-span-5 hidden lg:block'>
            <div className='sticky top-20 space-y-6'>
              <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
                <MatchDetailSummary
                  matchData={
                    (matchDataV2 as SportEventDtoWithStat) || matchDetails
                  }
                  isDetails
                />
              </div>
              <PlayByPlaySection
                matchData={matchDataV2 as SportEventDtoWithStat}
              />
            </div>
          </div>
        )}
        <div className='top-0 col-span-12 lg:sticky lg:col-span-4 lg:w-[443px]'>
          <div className='w-full rounded-md lg:p-3 lg:pt-0'>
            <QuickViewColumn
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

export const MatchListIsolatedSocket: React.FC<{
  sport: SPORT;
  matchesLive: any;
  setMatchesLive: any;
}> = ({ sport, matchesLive, setMatchesLive }) => {
  const { matchLiveSocket } = useMqttClient(sport, true);
  const memoizedMatchesSocket = useMemo(
    () => matchLiveSocket,
    [matchLiveSocket]
  );

  return (
    <MatchListIsolated
      page={PAGE.liveScore}
      sport={sport}
      isDetail={true}
      matchesLive={matchesLive}
      setMatchesLive={setMatchesLive}
      matchLiveSocket={memoizedMatchesSocket}
    />
  );
};
