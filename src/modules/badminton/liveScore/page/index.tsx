import { MainLayout } from '@/components/layout';
import { QuickViewColumn as BadmintonQuickViewColumn } from '@/components/modules/badminton';
import { SportMatchListSectionReprIsolated } from '@/components/modules/badminton/SportMatchListSectionReprIsolated';
import { TwDataSection } from '@/components/modules/common';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import {
  TwColumWrapperLeft,
  TwColumnWrapperMiddle,
} from '@/components/modules/common/tw-components/TwHome';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { TwQuickViewCol } from '@/components/modules/football/tw-components';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import { NextPageWithLayout } from '@/models';

import { useFilterStore, useMatchStore, useSitulations } from '@/stores';
import { useScrollStore } from '@/stores/scroll-progess';
import { scrollToTop } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BadmintonSubPage: NextPageWithLayout<{
  page: PAGE;
  isDesktop?: boolean;
  sport?: SPORT;
}> = ({ isDesktop = true, page, sport = SPORT.BADMINTON }) => {
  const router = useRouter();
  const { query } = router;
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  const { situlations } = useSitulations();
  const isShowSimulation = situlations.length > 0;
  const getFilter: any = query?.qFilter || 'all';
  const { setSelectedMatch } = useMatchStore();
  const { setMatchFilter, dateFilter } = useFilterStore();


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

      <TwColumnWrapperMiddle className='lg:w-[calc(100%-209px)]'>
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>
          <div className='h-full rounded-md'>
            <MainColHeader page={page} sport={sport} />
            <SportMatchListSectionReprIsolated
              page={page}
              sport={sport}
              setFirstMatch={setFirstMatch}
              firstMatch={firstMatch}
            />
          </div>
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <BadmintonQuickViewColumn
                top={true}
                sticky={true}
                matchData={firstMatch}
              />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      {isDesktop && <SimulationColumn sport={sport} />}

    </TwDataSection>
  );
};

BadmintonSubPage.Layout = MainLayout;

export default BadmintonSubPage;

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
