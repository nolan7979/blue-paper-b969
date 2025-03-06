/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import CustomLink from '@/components/common/CustomizeLink';
import { FooballAllLeauges } from '@/components/modules/football/filters/FilterColumn';
import { BxhLeageRow } from '@/components/modules/football/standings/BxhLeagueRow';
import {
  TwBxhFilterColMb,
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

import { decodeLinkForDev } from '@/utils/hash.id';

export function BxhFilterColumn({ sport }: { sport: string }) {
  const i18n = useTrans();
  const { setSelectedLeague } = useLeagueStore();
  const { setBxhData } = useFilterStore();

  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const params = router.query['leagueId'] || [];
    if (params.length > 0) {
      setSelectedLeague(params[params.length - 1]);
      setBxhData('total');
    } else {
      setSelectedLeague(`${decodeLinkForDev('mfiws1aoh0uztg4')}`);
      setBxhData('total');
    }
  }, [currentPath, router.query, setSelectedLeague, setBxhData]);

  return (
    <>
      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.top_league}</TwFilterTitle>
        <BxhTopLeauges />
      </TwCard>

      <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
        <FooballAllLeauges hrefPrefix={`/${sport}/standings`} />
      </TwCard>
    </>
  );
}

const leagues = [
  {
    href: `/football/standings/europe/uefa-champions-league/${decodeLinkForDev(
      'c9dxsq8o5wt1o5r'
    )}`,
    src: '/images/football/leagues/uefa-champions-league.webp',
    alt: 'UEFA Champions League',
    id: `${decodeLinkForDev('c9dxsq8o5wt1o5r')}`,
  },
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

// export const BxhTopLeauges = () => (
//   <div className=''>
//     {leagues.map((league) => (
//       <LeageRow
//         key={league.href}
//         // href={league.href}
//         src={league.src}
//         alt={league.alt}
//       ></LeageRow>
//     ))}
//   </div>
// );

export const BxhTopLeauges = () => (
  <div className=''>
    {leagues.map((league) => (
      <BxhLeageRow
        key={league.href}
        href={league.href}
        src={league.src}
        alt={league.alt}
      ></BxhLeageRow>
    ))}
  </div>
);

export const BxhTopLeaugesMb = () => {
  const [err, setErr] = useState(false);
  return (
    <TwBxhFilterColMb className=' layout my-4 pl-2'>
      <div className='no-scrollbar flex gap-x-4 overflow-x-scroll'>
        {leagues.map((league: any, idx: number) => (
          <CustomLink href={league.href} key={idx} target='_parent'>
            <button
              key={`league-${idx}`}
              className='item-hover bg-ligth-match flex w-48 items-center gap-1 rounded-full p-2 text-left dark:bg-dark-match'
            >
              <img
                src={`${
                  err
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/unique-tournament/${league?.id}/image`
                }`}
                alt='...'
                width={24}
                height={24}
                onError={() => setErr(true)}
              ></img>
              <span className='truncate'>{league.alt}</span>
            </button>
          </CustomLink>
        ))}
      </div>
    </TwBxhFilterColMb>
  );
};
