import { SportMatchListSectionReprIsolated as BkbSportMatchListSectionReprIsolated } from '@/components/modules/basketball';
import { QuickViewColumn } from '@/components/modules/basketball/quickviewColumn';
import { TwDataSection } from '@/components/modules/common';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import {
  TwColumWrapperLeft,
  TwColumnWrapperMiddle,
} from '@/components/modules/common/tw-components/TwHome';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import {
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import { NextPageWithLayout } from '@/models';
import { LeagueStandingsSection } from '@/modules/basketball/competition/components/LeagueStandingsSection';
import { SelectStandingSection } from '@/modules/basketball/competition/components/SelectStandingSection';
import StandingPageComponent from '@/modules/standings';
import { useFilterStore, useMatchStore, useSitulations } from '@/stores';
import { useScrollStore } from '@/stores/scroll-progess';
import { scrollToTop } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BasketBallSubPage: NextPageWithLayout<{
  page: PAGE;
  isDesktop?: boolean;
  sport?: SPORT;
}> = ({ isDesktop = true, page, sport = SPORT.BASKETBALL }) => {
  const { situlations } = useSitulations();
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all'
  const { setMatchFilter, dateFilter } = useFilterStore();
  const { setSelectedMatch } = useMatchStore();
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const isShowSimulation = situlations.length > 0;

  const [dataFetchStandings, setDataFetchStandings] = useState<any>({
    tournamentId: '',
    seasonId: '',
  });

  const { matchTypeFilter } = useFilterStore();

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
            <>
              {/* <SelectStandingSection dataInfo={setDataFetchStandings} />
              <LeagueStandingsSection
                tournamentId={dataFetchStandings.tournamentId}
                seasonId={dataFetchStandings.seasonId}
              /> */}
              <StandingPageComponent sport={SPORT.BASKETBALL} />
            </>
          ): (
            <div className='h-full rounded-md'>
              <MainColHeader sport={sport} page={page} />
              <BkbSportMatchListSectionReprIsolated
                page={page}
                sport={sport}
                setFirstMatch={setFirstMatch}
              />
            </div>
          )}
        </div>

        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <QuickViewColumn top={true} sticky={true}
                matchData={firstMatch} />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      <SimulationColumn sport={sport} />
    </TwDataSection>
  );
};

export default BasketBallSubPage;
