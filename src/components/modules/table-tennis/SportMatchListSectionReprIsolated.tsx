import {
  MatchListByTimeIsolated,
  MatchListIsolated,
} from '@/components/modules/table-tennis';
import { PAGE, SPORT } from '@/constant/common';
import { MatchStateTennis, SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import { useSortStore } from '@/stores/sort-store';
import { parseMatchDataArrayTableTennis } from '@/utils/tableTennisUtils';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.TABLE_TENNIS,
  matchesDefault,
  setFirstMatch,
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
}) => {
  const i18n = useTrans();
  const { sortBy } = useSortStore();
  const { matchLiveSocket } = useMqttClient(sport,true);
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const [matchesData, setMatchesData] = useState<SportEventDtoWithStat | {}>(
    {}
  );
  const [matchesLive, setMatchesLive] = useState<SportEventDtoWithStat | {}>(
    {}
  );

  const dateFilterString = useMemo(() => {
    //compare format date
    const dateFormat = format(dateFilter, 'yyyy-MM-dd');
    return dateFormat;
  }, [dateFilter]);

  const { data: matches = '', isLoading } = useDailySummaryData(
    dateFilterString,
    SPORT.TABLE_TENNIS,
    matchTypeFilter,
    i18n.language,
    parseMatchDataArrayTableTennis
  );

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );

  useEffect(() => {
    if (matches) {
      const firstMatch = Object.values(matches).find(
        (match: any, index: number) =>
          match?.status?.code === MatchStateTennis.NotStarted
      ) as SportEventDtoWithStat;

      setFirstMatch && setFirstMatch(firstMatch);
      setMatchesData(matches);
    }
  }, [matches]);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayTableTennis(liveMatches as string)?.reduce(
        (acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        },
        {} as Record<string, any>
      ) || {};

    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

  const memoizedMatchesData = useMemo(() => matchesData, [matchesData]);
  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);
  const memoizedMatchesSocket = useMemo(
    () => matchLiveSocket,
    [matchLiveSocket]
  );

  return (
    <>
      {sortBy === 'time' ? (
        <MatchListByTimeIsolated
          page={page}
          sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket}
        />
      ) : (
        <MatchListIsolated
          page={page}
          sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket}
          isLiveMatchRefetching={isRefetching}
        />
      )}
    </>
  );
};
