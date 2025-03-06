import { SportMatchListSectionReprIsolated as SportMatchListSectionReprIsolatedAMFootball } from '@/components/modules/am-football';
import { TwQuickViewCol } from '@/components/modules/football/tw-components';

import { QuickViewColumn } from '@/components/modules/am-football/quickviewColumn';
import { MainColHeader } from '@/components/modules/common/columns/MainColHeader';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import {
  TwColumWrapperLeft,
  TwColumnWrapperMiddle,
} from '@/components/modules/common/tw-components/TwHome';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useFilterStore, useMatchStore } from '@/stores';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TwDataSection } from '@/components/modules/common';
import { scrollToTop } from '@/utils';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import ColumnLeftWrapper from '@/components/modules/common/columns/ColumnLeftWrapper';

const AmericanFootballSubPage: React.FC<{
  isDesktop?: boolean;
  matchesDefault?: string;
  page: PAGE;
  sport: SPORT;
  featureData?: SportEventDtoWithStat;
}> = ({ isDesktop = true, matchesDefault = '', page, sport, featureData }) => {
  const router = useRouter();
  const { query } = router;
  const getFilter: any = query?.qFilter || 'all';
  const { setMatchFilter, dateFilter } = useFilterStore();
  const { setSelectedMatch } = useMatchStore();
  const [firstMatch, setFirstMatch] = useState<SportEventDtoWithStat>();

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
        <ColumnLeftWrapper className='no-scrollbar'>
          <FilterColumn sport={sport} />
        </ColumnLeftWrapper>
      )}

      <TwColumnWrapperMiddle>
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>
          <div className='h-full rounded-md'>
            <MainColHeader sport={sport} page={page} />
            <SportMatchListSectionReprIsolatedAMFootball
              page={page}
              setFirstMatch={setFirstMatch}
              sport={sport}
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
    </TwDataSection>
  );
};

export default AmericanFootballSubPage;
