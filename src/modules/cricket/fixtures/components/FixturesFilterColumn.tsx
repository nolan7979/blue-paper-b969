/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useTrans from '@/hooks/useTrans';

import { CalendarFilter } from '@/components/filters';
import { FooballAllLeauges } from '@/components/modules/football/filters/FilterColumn';
// import { BxhLeageRow } from '@/components/football/standings/BxhLeagueRow';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

import { FixturesLeageRow } from '@/modules/football/fixtures/components/FixturesLeagueRow';
import { decodeLinkForDev } from '@/utils/hash.id';

export const footballLeagues = [
  {
    href: `/football/standings/english-premier-league/${decodeLinkForDev(
      'mfiws1aoh0uztg4'
    )}`,
    src: '/images/football/leagues/premier-league.webp',
    alt: 'Premier League',
    id: `${decodeLinkForDev('mfiws1aoh0uztg4')}`,
  },
  {
    href: `/football/standings/spanish-la-liga/${decodeLinkForDev(
      'ym2xwfiotyu669p'
    )}`,
    src: '/images/football/leagues/laliga.webp',
    alt: 'LaLiga',
    id: `${decodeLinkForDev('ym2xwfiotyu669p')}`,
  },
  {
    href: `/football/standings/bundesliga/${decodeLinkForDev(
      'jz5xx7noo6txee9'
    )}`,
    src: '/images/football/leagues/bundesliga.webp',
    alt: 'Bundesliga',
    id: `${decodeLinkForDev('jz5xx7noo6txee9')}`,
  },
  {
    href: `/football/standings/italian-serie-a/${decodeLinkForDev(
      '7au4xbkox5t97f7'
    )}`,
    src: '/images/football/leagues/serie-a.webp',
    alt: 'Serie A',
    id: `${decodeLinkForDev('7au4xbkox5t97f7')}`,
  },
  {
    href: `/football/standings/french-ligue-1/${decodeLinkForDev(
      'bm0nxitovzu9p9u'
    )}`,
    src: '/images/football/leagues/ligue-1.webp',
    alt: 'Ligue 1',
    id: `${decodeLinkForDev('bm0nxitovzu9p9u')}`,
  },
];

export function FixturesFilterColumn({ sport }: { sport: string }) {
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
        <FixtureTopLeauges sport={sport} leagues={footballLeagues} />
      </TwCard>
      {/* <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.ranking}</TwFilterTitle>
        <Rankings />
      </TwCard> */}
      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
        <FooballAllLeauges hrefPrefix={`/${sport}/fixtures`} />
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
