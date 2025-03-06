import clsx from 'clsx';
import { TwDataSection } from '@/components/modules/common';
import { FootballMatchLoaderSection } from '@/components/modules/cricket/loaderData/FootballMatchLoaderSection';
import SimulationColumn from '@/components/modules/cricket/SimulationColumn';
import { SportMatchListSectionReprIsolated } from '@/components/modules/cricket/SportMatchListSectionReprIsolated';
import { TwQuickViewCol } from '@/components/modules/cricket/tw-components';

import { useFilterStore, useMatchStore, useSitulations } from '@/stores';

import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import {
  TwColumnWrapperMiddle,
  TwColumWrapperLeft,
} from '@/components/modules/common/tw-components/TwHome';
import { QuickViewColumn } from '@/components/modules/cricket/quickviewColumn/QuickViewColumn';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useDetectDeviceClient } from '@/hooks';
import { LeagueStandingsSection } from '@/modules/cricket/competition/components/LeagueStandingsSection';
import { SelectStandingSection } from '@/modules/cricket/competition/components/SelectStandingSection';
import { useLeagueStore } from '@/stores/league-store';
import { scrollToTop } from '@/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollProgress } from '@/hooks/useScrollProgess';
type IProps = {
  tournamentId: string;
  seasonId: string;
};

const LiveScoreComponent: React.FC<{
  page: PAGE;
  sport: SPORT;
  featureData?: SportEventDtoWithStat;
}> = ({ page, sport, featureData }) => {
  const { isDesktop } = useDetectDeviceClient();
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
  const { situlations } = useSitulations();
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const isShowSimulation = situlations.length > 0;
  const { setSelectedMatch } = useMatchStore();
  const { setMatchFilter, setDateFilter } = useFilterStore();
  const { matchTypeFilter, dateFilter } = useFilterStore();
  const { selectedSeason, selectedLeague } = useLeagueStore();
  const [dataFetchStandings, setDataFetchStandings] = useState<IProps>({
    tournamentId: selectedLeague,
    seasonId: selectedSeason,
  });

  //Store
  const {scrollProgress,setScrollProgress} = useScrollStore()
  const getScrollProgess= useScrollProgress({
    enableLogging: false,
    onProgressChange: (progress) => {
      // Do something with progress value
   
      if (progress === 100) {
        console.log('Reached bottom of page');
      }
    },
    throttleDelay: 50
  });

  useEffect(() => {
   
    if (getScrollProgess - (scrollProgress +1) >= 1 || scrollProgress - (getScrollProgess +1) >=0) {
      setScrollProgress(getScrollProgess);
    }
  }, [getScrollProgess]);
  useEffect(() => {
    setSelectedMatch('');
  }, [setSelectedMatch, router.asPath]);

  useEffect(() => {
    setMatchFilter(getFilter);
  }, [getFilter]);

  useEffect(() => {
    scrollToTop();
    return () => {
      router.events.off('routeChangeComplete', scrollToTop);
    };
  }, [router, dateFilter]);

  return (
    <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
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
            <div className='bottom-[68px] left-0 w-full space-y-4 overflow-auto bg-modal p-4'>
              <SelectStandingSection dataInfo={setDataFetchStandings} />
              <LeagueStandingsSection
                tournamentId={dataFetchStandings.tournamentId}
                seasonId={dataFetchStandings.seasonId}
                type='total'
                wide={true}
                uniqueTournament={true}
              />
            </div>
          ) : (
            <div className='h-full rounded-md'>
              <MainColHeader sport={sport} page={page} />
              <SportMatchListSectionReprIsolated
                page={page}
                sport={sport}
                setFirstMatch={setFirstMatch}
              />
              <FootballMatchLoaderSection page='live-score' sport={sport} />
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
