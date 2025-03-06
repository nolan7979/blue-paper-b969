import { format } from 'date-fns';

import { useFilterStore, useHomeStore } from '@/stores';
import {
  useDailySummaryByCountryIdData,
  useFootballCategoryLeaguesData,
} from '@/hooks/useFootball';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { useEffect } from 'react';
import {
  ICompetition,
  useLeagueByCountryStore,
} from '@/stores/league-country-store';
import { parseMatchDataArray } from '@/utils';

export const FootballMatchCountryLoaderSection = ({
  countryId,
}: {
  countryId: string;
}) => {
  const { dateFilter, setDateFilter } = useFilterStore();

  const { setMatches } = useHomeStore();

  const { setLeague, resetLeague } = useLeagueByCountryStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const { data: leaguesByCountryId, isLoading } =
    useFootballCategoryLeaguesData(countryId);

  const { data: matches = '', isLoading: loadingMatches } =
    useDailySummaryByCountryIdData(dateFilterString, countryId);

  useEffect(() => {
    if (leaguesByCountryId) {
      resetLeague();
      setLeague(leaguesByCountryId[0].uniqueTournaments as ICompetition[]);
    }
  }, [leaguesByCountryId]);

  useEffect(() => {
    if (matches) {
      const matches_ = parseMatchDataArray(matches);
      setMatches(matches_);
    }
  }, [matches]);

  if (isLoading || loadingMatches) {
    const ArrayFromOneToNine = Array.from(
      { length: 9 },
      (_, index) => index + 1
    );
    return (
      <div>
        {ArrayFromOneToNine.map((number) => (
          <MatchSkeleton key={number} />
        ))}
      </div>
    );
  }
  return <></>;
};
