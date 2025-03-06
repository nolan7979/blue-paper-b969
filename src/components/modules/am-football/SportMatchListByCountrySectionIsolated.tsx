import { MatchListByTimeIsolated, MatchListIsolated } from '@/components/modules/am-football/match';
import { PAGE, SPORT } from '@/constant/common';
import { useSortStore } from '@/stores/sort-store';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport,
}: {
  page: PAGE;
  sport: SPORT;
}) => {
  const { sortBy } = useSortStore();

  return (
    <>
      {sortBy === 'time' ? (
        <MatchListByTimeIsolated page={page} sport={sport} />
      ) : (
        <MatchListIsolated page={page} sport={sport} />
      )}
    </>
  );
};
