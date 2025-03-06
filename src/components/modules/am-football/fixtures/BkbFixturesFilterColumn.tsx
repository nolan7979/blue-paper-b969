/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useBkbCategoryData } from '@/hooks/useBasketball';
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

export const bkbLeagues = [
  {
    href: '/competition/basketball/usa/nba/132',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/132/image/dark',
    alt: 'NBA',
    id: '132',
  },
  {
    href: '/competition/basketball/international/euroleague/138',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/138/image/dark',
    alt: 'Euroleague',
    id: '138',
  },
  {
    href: '/competition/basketball/international/fiba-world-cup/441',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/441/image/dark',
    alt: 'FIBA World Cup',
    id: '441',
  },
  {
    href: '/competition/basketball/greece/a1/304',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/304/image/dark',
    alt: 'A1',
    id: '304',
  },
  {
    href: '/competition/basketball/italy/serie-a/262',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/262/image/dark',
    alt: 'Serie A',
    id: '262',
  },
  {
    href: '/competition/basketball/spain/liga-acb/264',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/264/image/dark',
    alt: 'Liga ACB',
    id: '264',
  },
  {
    href: '/competition/basketball/brazil/nbb/1562',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/1562/image/dark',
    alt: 'NBB',
    id: '1562',
  },
  {
    href: '/competition/basketball/international/eurocup/141',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/141/image/dark',
    alt: 'Eurocup',
    id: '141',
  },
  {
    href: '/competition/basketball/international/admiralbet-aba-league/235',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/235/image/dark',
    alt: 'AdmiralBet ABA League',
    id: '235',
  },
];

export function BkbFixturesFilterColumn({ sport }: { sport: string }) {
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
        <FixtureTopLeauges sport={sport} leagues={bkbLeagues} />
      </TwCard>

      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
        <BkbAllLeauges hrefPrefix={`/${sport}/fixtures`} />
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

export const BkbAllLeauges = ({
  hrefPrefix = '/competition/basketball',
}: {
  hrefPrefix?: string;
}) => {
  const [category, setCategory] = useState<string>('');
  const { data: allCates, isLoading } = useBkbCategoryData();

  if (isLoading || !allCates) {
    return <></>;
  }

  return (
    <AllLeaguesRep
      category={category}
      setCategory={setCategory}
      allCates={allCates}
      hrefPrefix={hrefPrefix}
    ></AllLeaguesRep>
  );
};
