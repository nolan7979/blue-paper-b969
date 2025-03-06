import clsx from 'clsx';

import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { SportMatchListSectionReprIsolated } from '@/components/modules/football/SportMatchListSectionReprIsolated';
import { TwQuickViewCol } from '@/components/modules/football/tw-components';

import { TwDataSection } from '@/components/modules/common';
import { useFilterStore, useMatchStore, useSitulations } from '@/stores';

import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import {
  TwColumnWrapperMiddle,
  TwColumWrapperLeft,
} from '@/components/modules/common/tw-components/TwHome';
import { QuickViewColumn } from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
import { SelectStandingSection } from '@/modules/football/competition/components/SelectStandingSection';
import { useLeagueStore } from '@/stores/league-store';
import { scrollToTop } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useDetectDeviceClient } from '@/hooks';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import { useScrollStore } from '@/stores/scroll-progess';
type IProps = {
  tournamentId: string;
  seasonId: string;
};

const LiveScoreComponent: React.FC<{
  isDesktop?: boolean;
  matchesDefault?: string;
  page: PAGE;
  sport: SPORT;
  featureData?: SportEventDtoWithStat;
}> = ({ matchesDefault = '', page, sport, featureData }) => {
  const { isDesktop } = useDetectDeviceClient();
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
  const { situlations } = useSitulations();
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const isShowSimulation = situlations.length > 0;
  const { setSelectedMatch } = useMatchStore();
  const { setMatchFilter, setDateFilter, dateFilter } = useFilterStore();
  const { matchTypeFilter } = useFilterStore();
  const { selectedSeason, selectedLeague } = useLeagueStore();
  const isLandscape = useDeviceOrientation();
  const [dataFetchStandings, setDataFetchStandings] = useState<IProps>({
    tournamentId: selectedLeague,
    seasonId: selectedSeason,
  });
  //Store
  const {scrollProgress,setScrollProgress} = useScrollStore()
  const lastProgress = useRef(0);
  const getScrollProgess= useScrollProgress({
    enableLogging: false,
    onProgressChange: (progress) => {
      // Do something with progress value
   
      // if (progress === 100) {
      //   console.log('Reached bottom of page');
      // }
    },
    throttleDelay: 50
  });

  const showRedCard = useMemo(() => getItem(LOCAL_STORAGE.showRedCard), []);
  const showYellowCard = useMemo(
    () => getItem(LOCAL_STORAGE.showYellowCard),
    []
  );

  useEffect(() => {
    setSelectedMatch('');
  }, [setSelectedMatch, router.asPath]);

  useEffect(() => {
    setMatchFilter(getFilter);
    setDateFilter(new Date());
    if ((showRedCard && !JSON.parse(showRedCard)) || !showRedCard) {
      setItem(LOCAL_STORAGE.showRedCard, 'true');
    }
    if (showYellowCard) {
      setItem(LOCAL_STORAGE.showYellowCard, 'false');
    }
  }, [showRedCard, getFilter]);

  useEffect(() => {
    scrollToTop();
    return () => {
      router.events.off('routeChangeComplete', scrollToTop);
    };
  }, [router, dateFilter]);

  useEffect(() => {

    if (getScrollProgess - (scrollProgress +1) >= 1 || scrollProgress - (getScrollProgess +1) >=0 ) {
      setScrollProgress(getScrollProgess);
    }
  }, [getScrollProgess]);

  return (
    <TwDataSection
      className={clsx('layout flex transition-all duration-150 lg:flex-row mt-0 lg:!mt-3')}
    >
      {isDesktop && (
        <TwColumWrapperLeft
          className={clsx('no-scrollbar', { 'lg:!hidden': isShowSimulation })}
        >
          <FilterColumn sport={sport} />
        </TwColumWrapperLeft>
      )}

      <TwColumnWrapperMiddle
        className={clsx({
          'lg:w-[calc(100%-209px)]': !isShowSimulation,
          'lg:w-[calc(100%-279px)]': isShowSimulation,
        })}
      >
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>
          {matchTypeFilter === 'standings' ? (
            <div className='bottom-[68px] left-0 w-full space-y-4 overflow-auto  relative top-0 h-[100vh] '>
              <SelectStandingSection dataInfo={setDataFetchStandings} />
              <LeagueStandingsSection
                tournamentId={dataFetchStandings.tournamentId}
                seasonId={dataFetchStandings.seasonId}
                type='total'
                wide={true}
                uniqueTournament={true}
                showRecentMatch
              />
            </div>
          ) : (
            <div className='h-full rounded-md'>
              <MainColHeader sport={sport} page={page} />
              <SportMatchListSectionReprIsolated
                page={page}
                sport={sport}
                matchesDefault={matchesDefault}
                setFirstMatch={setFirstMatch}
                firstMatch={firstMatch}
             
              />
            </div>
          )}
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <QuickViewColumn
                top={true}
                sticky={true}
                matchData={firstMatch}
                featureMatchData={featureData}
              />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      <SimulationColumn />
    </TwDataSection>
  );
};
export default LiveScoreComponent;
