/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useCategoryData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import { CalendarFilter } from '@/components/filters';
import { AllLeaguesRep } from '@/components/modules/football/filters/FilterColumn';
import { FixturesLeageRow } from '@/modules/football/fixtures/components/FixturesLeagueRow';
// import { BxhLeageRow } from '@/components/football/standings/BxhLeagueRow';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';
import React from 'react';

export function TennisFixturesFilterColumn() {
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
        <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
        <SportAllLeauges sport='tennis' />
      </TwCard>
    </>
  );
}

export const FixtureTopLeauges = ({
  leagues,
  sport,
}: {
  leagues: any;
  sport: string;
}) => (
  <div className=''>
    {leagues.map((league: any) => (
      <FixturesLeageRow
        key={league.href}
        href={`/${sport}/fixtures/${league?.id}`} // TODO add slug
        src={league.src}
        alt={league.alt}
      ></FixturesLeageRow>
    ))}
  </div>
);

export const SportAllLeauges = ({
  // hrefPrefix = '/competition/basketball',
  sport = 'football',
}: {
  // hrefPrefix?: string;
  sport?: string;
}) => {
  const [category, setCategory] = useState<string>('');
  const { data: allCates, isFetching, isLoading } = useCategoryData(sport);

  if (isLoading || isFetching || !allCates) {
    return <></>;
  }

  return (
    <AllLeaguesRep
      category={category}
      setCategory={setCategory}
      allCates={allCates}
      hrefPrefix={`/competition/${sport}`}
    ></AllLeaguesRep>
  );
};
