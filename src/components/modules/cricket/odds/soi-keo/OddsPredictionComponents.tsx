/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

// import { DateFilter } from '@/components/filters';
// import { AllLeauges } from '@/components/football/FilterColumn';
import { FixturesLeageRow, footballLeagues } from '@/modules/cricket/fixtures/components';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/cricket/tw-components';

import { useFilterStore } from '@/stores';
import { useLeagueStore } from '@/stores/league-store';

export function OddsPredictionFilterColumn() {
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
      <TwCard className='py-2'>
        <TwFilterTitle className=''>{i18n.home.top_league}</TwFilterTitle>
        <OddsPredTopLeauges />
      </TwCard>
    </>
  );
}

export const OddsPredTopLeauges = () => (
  <div className=''>
    {footballLeagues.map((league) => (
      <FixturesLeageRow
        key={league.href}
        href={`/cricket/results/${league?.id}`} // TODO add slug
        src={league.src}
        alt={league.alt}
      ></FixturesLeageRow>
    ))}
  </div>
);

export const TwSmallColOddsPred = tw.div`
  shrink
  hidden
  gap-y-3
  w-1/5
  lg:(flex flex-col)
`;

export const TwNewsGrid = tw.div`grid grid-cols-1 gap-1 overflow-hidden relative md:gap-4 md:grid-cols-2 lg:grid-cols-3`;

export const TwNewTile = tw.div` flex flex-col rounded-md `;

export const ThumbnailComponent = ({ imgUrl }: { imgUrl: string }) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <>
      <img
        src={isError ? '/images/football/players/unknown1.webp' : imgUrl}
        // width={48}
        // height={48}
        alt=''
        onError={() => {
          setIsError(true);
        }}
        className='rounded-full'
      ></img>
    </>
  );
};
