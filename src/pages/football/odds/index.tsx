import { TwMatchListContainer } from '@/components/modules/football';
import { TLKMatchRow } from '@/components/modules/football/odds/ty-le-keo';
import { MainLayout } from '@/components/layout';

import { useFilterStore, useOddsLeagueStore, useTLKMatchStore } from '@/stores';
import { useSortStore } from '@/stores/sort-store';

const OddPredictionPage = () => {
  return <></>;
};

OddPredictionPage.Layout = MainLayout;

export default OddPredictionPage;
// export const getStaticProps: GetStaticProps = async () => {
//   const data = await getContentStaticPage(String(CONTENT_ID.RESULT));
//   return {
//     props: {
//       data: data,
//     },
//     revalidate: 1800,
//   };
// };

export const ShowMatchesSections = () => {
  const { tlkSortBy } = useSortStore();
  const { matchTypeFilter } = useFilterStore();
  const { selectedLeagues } = useOddsLeagueStore();
  const { matches } = useTLKMatchStore();

  let filteredMatches = matches;

  if (matchTypeFilter === 'hot') {
    // TODO hot matches
  } else if (matchTypeFilter === 'following') {
    // TODO following matches
  } else if (matchTypeFilter === 'league') {
    // console.log('selectedLeagues: before', selectedLeagues);
    const mapSelectedLeagues = selectedLeagues.reduce((acc: any, cur: any) => {
      acc[`${cur}`] = true;
      return acc;
    }, {});

    filteredMatches = Object.values(filteredMatches).filter((m: any) => {
      const { tournament } = m;

      return mapSelectedLeagues[`${tournament?.id}`];
    });
  }

  if (tlkSortBy === 'time') {
    filteredMatches = Object.values(filteredMatches).sort(
      (m1: any, m2: any) => {
        if (m1.startTimestamp > m2.startTimestamp) {
          return 1;
        }
        return -1;
      }
    );
  } else {
    filteredMatches = Object.values(filteredMatches).sort(
      (m1: any, m2: any) => {
        const { tournament: t1 } = m1;
        const { tournament: t2 } = m2;

        if (t1?.id > t2?.id) {
          return -1;
        }
        return 1;
      }
    );
  }

  if (!filteredMatches.length) {
    // TODO: No live match
    return <div className='text-sm'>No live match</div>;
  }

  return (
    <>
      <TwMatchListContainer className='h-auto space-y-0.5 rounded-md'>
        {filteredMatches.map((match: any) => {
          return (
            <TLKMatchRow key={match?.id} matchId={match?.id}></TLKMatchRow>
          );
        })}
      </TwMatchListContainer>
    </>
  );
};
