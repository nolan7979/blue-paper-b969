import { useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { CalendarFilter } from '@/components/filters';
import { TwFilterButton } from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useTranslation } from 'next-i18next';

export const MainColHeaderCountry = () => {
  return (
    <>
      <TwMatchListContainer className='flex justify-between'>
        <div className='ml-2 inline-block w-2/3 rounded-xl bg-light-match dark:bg-dark-match sm:w-2/5 lg:hidden'>
          {/*<DateFilter />*/}
          <CalendarFilter />
        </div>

        <div className='hidden lg:inline-block'>
          <MatchFilter></MatchFilter>
        </div>
      </TwMatchListContainer>
    </>
  );
};

export const MatchFilter = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  const { matchTypeFilter, setMatchFilter } = useFilterStore();

  return (
    <div className='no-scrollbar flex gap-2 overflow-scroll px-1 py-1 xl:gap-3 xl:px-2'>
      <TwFilterButton
        isActive={matchTypeFilter === 'all'}
        onClick={() => setMatchFilter('all')}
        className='bg-all-blue lg:text-center xl:text-left'
      >
        {t('football:filter.all')}
      </TwFilterButton>
    </div>
  );
};

export const TwMatchListContainer = tw.div`py-2 md:px-2.5`;
