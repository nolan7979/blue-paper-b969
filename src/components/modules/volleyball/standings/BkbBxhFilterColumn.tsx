/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { useBkbCategoryData } from '@/hooks/useBasketball';

import CustomLink from '@/components/common/CustomizeLink';
import { AllLeaguesRep } from '@/components/modules/football/filters/FilterColumn';
import { BxhLeageRow } from '@/components/modules/football/standings/BxhLeagueRow';
import {
  TwBxhFilterColMb,
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

export function BkbBxhFilterColumn({ sport }: { sport: string }) {
  const { t } = useTranslation();
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
      setSelectedLeague('132');
      setBxhData('total');
    }
  }, [currentPath, router.query, setSelectedLeague, setBxhData]);

  return (
    <>
      <TwCard className='py-2'>
        <TwFilterTitle>{t('football:home.top_league')}</TwFilterTitle>
        <BxhTopLeauges />
      </TwCard>

      <TwCard className='py-2'>
        <TwFilterTitle>{t('football:home.all_leagues')}</TwFilterTitle>
        <BkbAllLeauges hrefPrefix={`/${sport}/standings`} />
      </TwCard>
    </>
  );
}

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

export const bkbLeagues = [
  {
    href: '/basketball/standings/usa/nba/132',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/132/image/dark',
    alt: 'NBA',
    id: '132',
  },
  {
    href: '/basketball/standings/international/euroleague/138',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/138/image/dark',
    alt: 'Euroleague',
    id: '138',
  },
  {
    href: '/basketball/standings/international/fiba-world-cup/441',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/441/image/dark',
    alt: 'FIBA World Cup',
    id: '441',
  },
  {
    href: '/basketball/standings/greece/a1/304',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/304/image/dark',
    alt: 'A1',
    id: '304',
  },
  {
    href: '/basketball/standings/italy/serie-a/262',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/262/image/dark',
    alt: 'Serie A',
    id: '262',
  },
  {
    href: '/basketball/standings/spain/liga-acb/264',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/264/image/dark',
    alt: 'Liga ACB',
    id: '264',
  },
  {
    href: '/basketball/standings/brazil/nbb/1562',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/1562/image/dark',
    alt: 'NBB',
    id: '1562',
  },
  {
    href: '/basketball/standings/international/eurocup/141',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/141/image/dark',
    alt: 'Eurocup',
    id: '141',
  },
  {
    href: '/basketball/standings/international/admiralbet-aba-league/235',
    src: 'https://api.sofascore.app/api/v1/unique-tournament/235/image/dark',
    alt: 'AdmiralBet ABA League',
    id: '235',
  },
];

export const BxhTopLeauges = () => (
  <div className=''>
    {bkbLeagues.map((league: any) => (
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
        {bkbLeagues.map((league: any, idx: number) => (
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
