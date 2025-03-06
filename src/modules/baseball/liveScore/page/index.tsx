import { TwDataSection, TwQuickViewCol } from '@/components/modules/common';

import { MainLayout } from '@/components/layout';
import { MatchListSectionReprIsolated as BBMatchListSectionReprIsolated } from '@/components/modules/baseball';
import { QuickViewColumn as BaseballQuickviewColumn } from '@/components/modules/baseball/quickviewColumn/QuickViewColumn';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import {
  TwColumWrapperLeft,
  TwColumnWrapperMiddle,
} from '@/components/modules/common/tw-components/TwHome';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useDetectDeviceClient } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { useFilterStore } from '@/stores/filter-store';
import { scrollToTop } from '@/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollProgress } from '@/hooks/useScrollProgess';

const BaseballSubPage: NextPageWithLayout<{
  page?: PAGE;
  sport: SPORT;
}> = ({ page = PAGE.liveScore, sport }) => {
  
  const {isDesktop} = useDetectDeviceClient();
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
  const { setMatchFilter, matchTypeFilter, dateFilter } = useFilterStore();


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
    if (matchTypeFilter !== getFilter) {
      setMatchFilter(getFilter);
    }
  }, [getFilter]);

  useEffect(() => {
    scrollToTop();
    return () => {
      router.events.off('routeChangeComplete', scrollToTop);
    };
  }, [router, dateFilter]);

  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();
  return (
    <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
      {isDesktop && (
        <TwColumWrapperLeft className='no-scrollbar'>
          <FilterColumn sport={sport} />
        </TwColumWrapperLeft>
      )}

      <TwColumnWrapperMiddle>
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>
          <div className='h-full rounded-md'>
            <MainColHeader sport={sport} page={page} />
            <BBMatchListSectionReprIsolated
              page={page}
              sport={sport}
              setFirstMatch={setFirstMatch}
            />
          </div>
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <BaseballQuickviewColumn
                top
                sticky
                sport={sport}
                matchData={firstMatch}
              />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
    </TwDataSection>
  );
};
BaseballSubPage.Layout = MainLayout;
export default BaseballSubPage;
