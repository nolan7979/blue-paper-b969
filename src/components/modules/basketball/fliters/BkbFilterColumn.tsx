/* eslint-disable @next/next/no-img-element */

import { CalendarFilter } from '@/components/filters';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { TopLeaguesSkeleton } from '@/components/common/skeleton/homePage';
import { SPORT } from '@/constant/common';
import { useTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { AllLeagues } from '@/components/modules/common/filters/AllLeagues';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';

export function BkbFilterColumn({ isHiddenCalendar = false }: { isHiddenCalendar?: boolean }) {
  const i18n = useTrans();
  // const { topLeagues } = useHomeStore();

  const { data: topLeagues } = useTopLeagues(SPORT.BASKETBALL);

  return (
    <div className='space-y-8'>
      {!isHiddenCalendar && <TwCard className='mt-2'>
        <CalendarFilter />
      </TwCard>}
      <div className='mt-4 space-y-1 py-2'>
        {!!topLeagues?.length && (
          <>
            <TwFilterTitle className='font-oswald'>
              {i18n.home.top_league}
            </TwFilterTitle>
            <TopLeauges leagues={topLeagues} sport={SPORT.BASKETBALL} />
          </>
        )}
        {!topLeagues?.length && <TopLeaguesSkeleton />}
      </div>
      <div className='space-y-1 py-2'>
        <TwFilterTitle className='font-oswald'>Tournaments</TwFilterTitle>
        <AllLeagues sport={SPORT.BASKETBALL} />
      </div>
    </div>
  );
}
