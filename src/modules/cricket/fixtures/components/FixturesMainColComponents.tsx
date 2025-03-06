/* eslint-disable @next/next/no-img-element */

import { CalendarFilter } from '@/components/filters';
import { MainMatchFilter } from '@/components/layout/MainMatchFilter';
import { TwMatchListContainer } from '@/components/modules/football/columns/MainColumnComponents';
import { SPORT } from '@/constant/common';

export const FixturesMainColHeader = () => {
  return (
    <>
      <TwMatchListContainer className='flex justify-between'>
        <div className='ml-2 inline-block w-2/3 rounded-xl bg-light-match dark:bg-dark-match sm:w-2/5 lg:hidden'>
          {/*<DateFilter />*/}
          <CalendarFilter />
        </div>

        {/* Match filters */}
        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter sport={SPORT.FOOTBALL} />
        </div>

        {/*<div className='hidden lg:flex lg:items-center'>*/}
        {/*  <SortOptions></SortOptions>*/}
        {/*</div>*/}

        {/* Odds filter */}
        {/* <OddsToggler /> */}
      </TwMatchListContainer>
    </>
  );
};
