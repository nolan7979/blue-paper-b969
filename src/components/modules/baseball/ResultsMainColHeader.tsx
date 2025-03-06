import { CalendarFilter } from "@/components/filters";
import { MainMatchFilter } from "@/components/layout/MainMatchFilter";
import { TwMatchListContainer } from "@/components/modules/volleyball/columns/MainColumnComponents";
import { PAGE, SPORT } from "@/constant/common";
import React from "react";

const ResultsMainColHeader = ({ page }: { page: PAGE }) => {
  return (
    <>
      <TwMatchListContainer className='flex justify-between'>
        <div className='ml-2 inline-block w-2/3 rounded-xl bg-light-match dark:bg-dark-match sm:w-2/5 lg:hidden'>
          {/*<DateFilter />*/}
          <CalendarFilter />
        </div>

        {/* Match filters */}
        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter sport={SPORT.BASEBALL} page={page} />
        </div>

        {/* Odds filter */}
        {/* <OddsToggler /> */}
      </TwMatchListContainer>
    </>
  );
};
export default ResultsMainColHeader;