import clsx from 'clsx';

import { TwDataSection, TwQuickViewCol } from '@/components/modules/common';

import { useFilterStore, useSitulations } from '@/stores';

import { MainLayout } from '@/components/layout';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import {
  TwColumnWrapperMiddle,
  TwColumWrapperLeft,
} from '@/components/modules/common/tw-components/TwHome';
import { MatchListSectionReprIsolated as VlbMatchListSectionReprIsolated } from '@/components/modules/volleyball';
import { QuickViewColumn } from '@/components/modules/volleyball/quickviewColumn/QuickViewColumn';
import { PAGE, SPORT } from '@/constant/common';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { scrollToTop } from '@/utils';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { useDetectDeviceClient } from '@/hooks';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollProgress } from '@/hooks/useScrollProgess';

const VolleyballSubPage: NextPageWithLayout<{
  page?: PAGE;
  isDesktop?: boolean;
  sport?: SPORT;
}> = ({
  page = PAGE.liveScore,
  sport = SPORT.VOLLEYBALL,
}) => {
  const router = useRouter();
  const { isDesktop } = useDetectDeviceClient();
  const { situlations } = useSitulations();
  const [firstMatch, setFirstMatch] = useState<any>({});
  const isShowSimulation = situlations.length > 0;
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
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
          <div className='h-full rounded-md'>
            <MainColHeader sport={sport} page={page} />
            <VlbMatchListSectionReprIsolated
              page={page}
              sport={SPORT.VOLLEYBALL}
              setFirstMatch={setFirstMatch}
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
      {isDesktop && (<SimulationColumn sport={sport} /> )}
    </TwDataSection>
  );
};
VolleyballSubPage.Layout = MainLayout;
export default VolleyballSubPage;
