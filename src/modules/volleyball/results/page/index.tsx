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

// import { BasketballMenu } from '@/components/menus';
import { MainLeftMenu } from '@/components/menus';
import { TwColumnWrapperMiddle } from '@/components/modules/common/tw-components/TwHome';
import { BkbQuickViewColumnSection } from '@/components/modules/volleyball/quickviewColumn/BkbQuickViewColumnSection';
import { PAGE, SPORT } from '@/constant/common';
import FixturesSelectedLeagueSection from '@/modules/football/fixtures/components/FixturesSelectedLeagueSection';
import { SportFixturesAllMatchesSection } from '@/modules/volleyball/fixtures/components/SportFixturesAllMatchesSection';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';

const MatchResultsPage = ({
  sport,
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
      <TwMobileView className='sticky top-[6.063rem] z-[5] bg-light-match dark:bg-dark-main '>

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
          <MainLeftMenu sport={sport} />
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
                <SportFixturesAllMatchesSection sport={sport} page={page} />
              )}
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 !w-full'>
            <BkbQuickViewColumnSection />
          </TwQuickViewCol>
        </TwColumnWrapperMiddle>
        {/* <SimulationColumn /> */}
      </TwDataSection>
    </div>
  );
};

export default MatchResultsPage;
