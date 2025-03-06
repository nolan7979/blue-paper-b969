import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useTrans from '@/hooks/useTrans';

import { CalendarFilter } from '@/components/filters';
import { FooballAllLeauges } from '@/components/modules/football/filters/FilterColumn';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

import { FixturesLeageRow, footballLeagues } from '@/modules/football/fixtures/components';

export function FootballResultsFilterColumn() {
  const i18n = useTrans();
  const router = useRouter();
  const currentPath = router.asPath;
  const { setFixturesSelectedLeague } = useLeagueStore();
  const { dateFilter } = useFilterStore();

  useEffect(() => {
    setFixturesSelectedLeague('');
  }, [dateFilter, setFixturesSelectedLeague]);

  useEffect(() => {
    const params = router.query['leagueId'] || [];
    if (params.length > 0) {
      setFixturesSelectedLeague(params[params.length - 1]);
    } else {
      setFixturesSelectedLeague('');
    }
  }, [currentPath, router.query, setFixturesSelectedLeague]);

  return (
    <>
      <TwCard className=''>
        {/*<DateFilter />*/}
        <CalendarFilter />
      </TwCard>
      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.top_league}</TwFilterTitle>
        <ResultsTopLeauges />
      </TwCard>
      {/* <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.ranking}</TwFilterTitle>
        <Rankings />
      </TwCard> */}
      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
        <FooballAllLeauges hrefPrefix='/football/results' />
      </TwCard>
    </>
  );
}

export const ResultsTopLeauges = () => (
  <div className=''>
    {footballLeagues.map((league) => (
      <FixturesLeageRow
        key={league.href}
        href={`/football/results/${league?.id}`} // TODO add slug
        src={league.src}
        alt={league.alt}
      ></FixturesLeageRow>
    ))}
  </div>
);
