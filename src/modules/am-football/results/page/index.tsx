import clsx from 'clsx';

import { CalendarFilter } from '@/components/filters';
import {
  TwDataSection,
  TwFilterCol,
  TwMainCol,
  TwMobileView,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useSitulations } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

import { MenuLeftSide } from '@/components/menus';
import { FilterColumn as FilterColumnAMFootball } from '@/components/modules/am-football';
import { QuickViewColumn } from '@/components/modules/am-football/quickviewColumn/QuickViewColumn';
import { TwColumnWrapperMiddle } from '@/components/modules/common/tw-components/TwHome';
import { PAGE, SPORT } from '@/constant/common';
import { SportFixturesAllMatchesSection as SportFixturesAllMatchesSectionAMFootball } from '@/modules/am-football/fixtures/components/BkbSportFixturesAllMatchesSection';
import FixturesSelectedLeagueSection from '@/modules/football/fixtures/components/FixturesSelectedLeagueSection';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';

const ResultsPageAMFootball = ({
  sport = SPORT.AMERICAN_FOOTBALL,
  page = PAGE.results,
}: {
  sport: SPORT;
  page: PAGE;
}) => {
  const { fixturesSelectedLeague } = useLeagueStore();
  const { situlations } = useSitulations();

  const isShowSimulation = situlations.length > 0;
  return (
    <div className='block'>
      <TwMobileView className='sticky top-14 bg-light-match dark:bg-dark-main'>
        <TwFilterCol className='flex-shrink-1'>
          {/*<FilterColumn />*/}
          <CalendarFilter />
        </TwFilterCol>
        <MainColHeader sport={sport} page={page} />
      </TwMobileView>

      <TwDataSection className='layout'>
        <TwFilterCol
          className={clsx(
            'flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:overflow-y-scroll',
            { 'lg:!hidden': isShowSimulation }
          )}
        >
          <MenuLeftSide sport={SPORT.AMERICAN_FOOTBALL} />
          <FilterColumnAMFootball />
        </TwFilterCol>

        <TwColumnWrapperMiddle
          className={clsx({
            'lg:w-[calc(100%-209px)]': !isShowSimulation,
            'lg:w-[calc(100%-279px)]': isShowSimulation,
          })}
        >
          <TwMainCol>
            <div className='h-full rounded-md'>
              {fixturesSelectedLeague ? (
                <FixturesSelectedLeagueSection
                  tournamentId={fixturesSelectedLeague}
                />
              ) : (
                <SportFixturesAllMatchesSectionAMFootball
                  sport={sport}
                  page={page}
                />
              )}
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 !w-full'>
            <QuickViewColumn top sticky />
          </TwQuickViewCol>
        </TwColumnWrapperMiddle>
        {/* <SimulationColumn /> */}
      </TwDataSection>
    </div>
  );
};

export default ResultsPageAMFootball;
