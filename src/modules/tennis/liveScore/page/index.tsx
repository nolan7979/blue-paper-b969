import {
  TwQuickViewCol
} from '@/components/modules/football/tw-components';
import {
  MatchListHeader,
  QuickViewColumn,
  SportMatchListSectionReprIsolated
} from '@/components/modules/tennis';
import clsx from 'clsx';

import { useFilterStore, useMatchStore, useSitulations } from '@/stores';

import { TwDataSection } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { TwColumnWrapperMiddle, TwColumWrapperLeft } from '@/components/modules/common/tw-components/TwHome';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { scrollToTop } from '@/utils';
import StandingPageComponent from '@/modules/standings';

const TennisSubPage: NextPageWithLayout<{ page: PAGE, sport: SPORT, isDesktop?: boolean, matchesDefault?: string }> = ({ matchesDefault, isDesktop = true, page, sport }) => {

  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const { situlations } = useSitulations();
  const isShowSimulation = situlations.length > 0;
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all'
  const { setSelectedMatch } = useMatchStore();
  const { setMatchFilter,dateFilter } = useFilterStore();
  const { matchTypeFilter } = useFilterStore();

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
          <FilterColumn sport={SPORT.TENNIS} />
        </TwColumWrapperLeft>
      )}

      <TwColumnWrapperMiddle
        className={clsx({
          'lg:w-[calc(100%-209px)]': !isShowSimulation,
          'lg:w-[calc(100%-279px)]': isShowSimulation,
        })}
      >
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>
          {matchTypeFilter === 'standings' ? <StandingPageComponent sport={SPORT.TENNIS} /> : (
            <div className='h-full rounded-md'>
              <MainColHeader sport={sport} page={page} />
              <SportMatchListSectionReprIsolated
                sport={sport} page={page}
                setFirstMatch={setFirstMatch}
              />
            </div>
          )}
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
            <QuickViewColumn top={true} sticky={true} matchData={firstMatch} />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      {isDesktop && (<SimulationColumn sport={sport} /> )}
    </TwDataSection>
  );
};

export default TennisSubPage;

// export const BkbQuickViewColumnSection = () => {
//   const { showSelectedMatch } = useMatchStore();

//   return (
//     <div>
//       {showSelectedMatch ? (
//         <>
//           here A
//           <QuickViewColumn top={true} sticky={true} />
//         </>
//       ) : (
//         <>
//           here B
//           <QuickViewSummaryFeaturedMatch sport='basketball'></QuickViewSummaryFeaturedMatch>
//         </>
//       )}
//     </div>
//   );
// };
