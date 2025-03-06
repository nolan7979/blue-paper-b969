import { MatchListByTimeIsolated } from '@/components/modules/badminton/match/MatchListByTimeIsolated';
import { MatchListIsolated } from '@/components/modules/badminton/match/MatchListIsolated';
import { SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useMatchStore } from '@/stores';
import { format } from 'date-fns';

import { PAGE, SPORT } from '@/constant/common';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { useSortStore } from '@/stores/sort-store';
import { MatchBadmintonState, parseMatchDataArrayBadminton } from '@/utils';
import { useEffect, useMemo, useState } from 'react';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.BADMINTON,
  matchesDefault,
  setFirstMatch,
  firstMatch,
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  firstMatch?: SportEventDtoWithStat;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
}) => {
  const { sortBy } = useSortStore();
  const matchLiveSocket = useMqttClient(sport, true);
  const { matchDetails, setMatchDetails } = useMatchStore();
  const i18n = useTrans();
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

  const { data: matches, isLoading } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter,
    i18n.language,
    parseMatchDataArrayBadminton
  );
  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );

  useEffect(() => {
    if (matches) {
      const getFirstMatch = Object.values(matches).find(
        (match: any, index: number) =>
          match?.status?.code === MatchBadmintonState.NOT_STARTED
      ) as SportEventDtoWithStat;
      if (!matchDetails) {
        setFirstMatch && setFirstMatch(getFirstMatch);
        setMatchDetails(getFirstMatch);
      }
    }
    setMatchesData(matches);
  }, [matches, matchesDefault]);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayBadminton(liveMatches as string)?.reduce(
        (acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        },
        {} as Record<string, any>
      ) || {};

    // addMatches(liveMatchesConvert);
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
          isLiveMatchRefetching={isRefetching}
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
