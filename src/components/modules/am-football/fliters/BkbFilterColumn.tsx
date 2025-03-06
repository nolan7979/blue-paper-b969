import { CalendarFilter } from '@/components/filters';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useHomeStore } from '@/stores';
import useTrans from '@/hooks/useTrans';
import { TopLeaguesSkeleton } from '@/components/common/skeleton/homePage';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { SPORT } from '@/constant/common';


export function FilterColumn() {
  const i18n = useTrans();
  const { topLeagues } = useHomeStore();

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
            <TopLeauges leagues={topLeagues} sport={SPORT.AMERICAN_FOOTBALL} />
          </>
        )}
        {!topLeagues?.length && <TopLeaguesSkeleton />}
      </div>
    </div>
  );
}
