import clsx from 'clsx';

import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
// import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { SportMatchListSectionReprIsolated } from '@/components/modules/snooker/SportMatchListSectionReprIsolated';
import { TwQuickViewCol } from '@/components/modules/football/tw-components';

import { TwDataSection } from '@/components/modules/common';
import { useFilterStore, useMatchStore, useSitulations } from '@/stores';

import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import {
  TwColumnWrapperMiddle,
  TwColumWrapperLeft,
} from '@/components/modules/common/tw-components/TwHome';
import { QuickViewColumn } from '@/components/modules/snooker/quickviewColumn/QuickViewColumn';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
// import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
// import { SelectStandingSection } from '@/modules/football/competition/components/SelectStandingSection';
import { useLeagueStore } from '@/stores/league-store';
import { scrollToTop } from '@/utils';
// import { getItem, setItem } from '@/utils/localStorageUtils';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
type IProps = {
  tournamentId: string;
  seasonId: string;
};

const LiveScoreComponent: React.FC<{
  isDesktop?: boolean;
  matchesDefault?: string;
  page: PAGE;
  sport: SPORT;
}> = ({ isDesktop = true, matchesDefault = '', page, sport }) => {
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
  const { situlations } = useSitulations();
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const isShowSimulation = situlations.length > 0;
  const { setSelectedMatch } = useMatchStore();
  const { setMatchFilter, setDateFilter ,dateFilter} = useFilterStore();
  const { matchTypeFilter } = useFilterStore();
  const { selectedSeason, selectedLeague } = useLeagueStore();
  const [dataFetchStandings, setDataFetchStandings] = useState<IProps>({
    tournamentId: selectedLeague,
    seasonId: selectedSeason,
  });

  // const showRedCard = useMemo(() => getItem(LOCAL_STORAGE.showRedCard), []);
  // const showYellowCard = useMemo(
  //   () => getItem(LOCAL_STORAGE.showYellowCard),
  //   []
  // );

  useEffect(() => {
    setSelectedMatch('');
  }, [setSelectedMatch, router.asPath]);

  useEffect(() => {
    setMatchFilter(getFilter);
    setDateFilter(new Date());
    // if ((showRedCard && !JSON.parse(showRedCard)) || !showRedCard) {
    //   setItem(LOCAL_STORAGE.showRedCard, 'true');
    // }
    // if (showYellowCard) {
    //   setItem(LOCAL_STORAGE.showYellowCard, 'false');
    // }
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
          {/* {matchTypeFilter === 'standings' ? (
            <div className='bottom-[68px] left-0 w-full space-y-4 overflow-auto p-4 dark:bg-modal'>
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
                matchesDefault={matchesDefault}
                setFirstMatch={setFirstMatch}
                firstMatch={firstMatch}
              />
            </div>
          )} */}
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
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <QuickViewColumn
                top={true}
                sticky={true}
                matchData={firstMatch}
              />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      {/* <SimulationColumn /> */}
    </TwDataSection>
  );
};
export default LiveScoreComponent;
