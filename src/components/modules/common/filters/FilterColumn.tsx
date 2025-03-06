import { TopLeaguesSkeleton } from '@/components/common/skeleton/homePage';
import { CalendarFilter } from '@/components/filters';
import { MainLeftMenu } from '@/components/menus';
import { Card } from '@/components/common';
import { TwFilterTitle } from '@/components/modules/common';
import { AllLeagues } from '@/components/modules/common/filters/AllLeagues';
import { LeaguesRow } from '@/components/modules/common/row/LeagueRow';
import { SPORT } from '@/constant/common';
import { ILanguageKey } from '@/constant/leagues/hotLeaguesFootball';
import { useSortedTopLeagues, useTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { ILeaguesItems } from '@/models';
import { useHomeStore } from '@/stores';
import { isEqual } from 'lodash';
import { memo, useEffect, useMemo } from 'react';

interface IFilterColumnProps {
  sport: string;
  hiddenAllLeagues?: boolean;
  isDetail?: boolean;
}

export const FilterColumn = ({
  sport,
  hiddenAllLeagues = false,
  isDetail = false,
}: IFilterColumnProps) => {
  const { data: topLeagues, isError } = useTopLeagues(sport);
  const { setTopLeagues } = useHomeStore();
  const i18n = useTrans();
  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  const sortedTopLeagues = useSortedTopLeagues(topLeagues, countryLocal);

  const topLeaguesMemoized = useMemo(
    () => (sport === SPORT.FOOTBALL ? sortedTopLeagues : topLeagues),
    [sortedTopLeagues, topLeagues]
  );

  useEffect(() => {
    if (!isEqual(topLeaguesMemoized, topLeagues)) return;
    setTopLeagues(topLeaguesMemoized);
  }, [topLeaguesMemoized]);

  return (
    <div className='space-y-8'>
      <div className='space-y-3'>
        {!isDetail && (
          <>
            <MainLeftMenu sport={sport} testId={`${sport}-menu`} />
            <Card className=''>
              <CalendarFilter />
            </Card>
          </>
        )}

        <div className='mt-4 space-y-1 py-2'>
          <TwFilterTitle className='font-oswald'>
            {i18n.home.top_league}
          </TwFilterTitle>
          <TopLeauges leagues={topLeaguesMemoized} sport={sport} />
          {!topLeagues?.length && <TopLeaguesSkeleton className='py-2' />}
        </div>

        <AllLeagues
          sport={sport}
          hrefPrefix={`/${sport}/competition`}
          isHiddenAllLeages={hiddenAllLeagues}
        />
      </div>
    </div>
  );
};

export const TopLeauges = memo(
  ({ leagues, sport }: { leagues: ILeaguesItems[]; sport: string }) => {
    return (
      <div className='mt-4 flex flex-col gap-3 px-3 lg:mt-0 lg:gap-0 lg:space-y-0 lg:px-0'>
        {leagues?.length > 0 &&
          leagues?.map((league: ILeaguesItems) => (
            <LeaguesRow
              key={league.id}
              id={league.id}
              alt={league.name}
              sport={sport}
            />
          ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.leagues === nextProps.leagues &&
      prevProps.sport === nextProps.sport
    );
  }
);
