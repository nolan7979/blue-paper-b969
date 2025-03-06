/* eslint-disable @next/next/no-img-element */

import useTrans from '@/hooks/useTrans';

import { TopLeaguesSkeleton } from '@/components/common/skeleton/homePage';
import { CalendarFilter } from '@/components/filters';
import {
  TwCard,
  TwFilterTitle
} from '@/components/modules/football/tw-components';

import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { SPORT } from '@/constant/common';
import { useTopLeagues } from '@/hooks/useCommon';

export function TennisFilterColumn() {
  const i18n = useTrans();
  const { data: topLeagues } = useTopLeagues(SPORT.TENNIS);

  return (
    <div className='space-y-8'>
      <TwCard className='mt-2'>
        <CalendarFilter />
      </TwCard>
      <div className='mt-4 space-y-1 py-2'>
          {!!topLeagues?.length && (
            <>
              <TwFilterTitle className='font-oswald'>
                {i18n.home.top_league}
              </TwFilterTitle>
              <TopLeauges leagues={topLeagues} sport={SPORT.TENNIS} />
            </>
          )}
          {!topLeagues?.length && <TopLeaguesSkeleton />}
        </div>
        {/* <div className='space-y-1 py-2'>
          <TwFilterTitle className='font-oswald'>Tournaments</TwFilterTitle>
          <AllLeagues />
      </div> */}
      {/* <div className='space-y-1 py-2'>
        <TwFilterTitle className='font-oswald'>Tournaments</TwFilterTitle>
        <BkbAllLeagues />
      </div> */}
    </div>
  );
}
