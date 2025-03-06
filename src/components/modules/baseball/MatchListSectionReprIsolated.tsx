import { MatchListByTimeIsolated, MatchListIsolated } from '@/components/modules/baseball/match';
import { SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useTrans from '@/hooks/useTrans';
import { format } from 'date-fns';
import { useFilterStore } from '@/stores';

import { useSortStore } from '@/stores/sort-store';
import React, { useEffect, useMemo, useState } from 'react';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { MatchBaseballState, parseMatchDataArrayBaseball } from '@/utils/baseballUtils';
import { PAGE, SPORT } from '@/constant/common';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';

export const MatchListSectionReprIsolated = ({
  page,
  sport = SPORT.BASKETBALL,
  matchesDefault,
  setFirstMatch
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
}) => {
  const i18n = useTrans();
  const { sortBy } = useSortStore();
  const { matchLiveSocket } = useMqttClient(sport, true);
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const [matchesData, setMatchesData] = useState<SportEventDtoWithStat | {}>({});
  const [matchesLive, setMatchesLive] = useState<SportEventDtoWithStat | {}>({});


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
    parseMatchDataArrayBaseball
  );

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );

  useEffect(() => {
    if (matches) {
      const firstMatch = Object.values(matches).find((match: any, index: number) => match?.status?.code === MatchBaseballState.NOT_STARTED || (index === 0 && match?.status?.code !== MatchBaseballState.ENDED)) as SportEventDtoWithStat;
      setFirstMatch && setFirstMatch(firstMatch);
      setMatchesData(matches)
    }
  }, [matches, matchesDefault]);


  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayBaseball(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    // addMatches(liveMatchesConvert);
    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);


  const memoizedMatchesData = useMemo(() => matchesData, [matchesData]);
  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);
  const memoizedMatchesSocket = useMemo(() => matchLiveSocket, [matchLiveSocket]);

  if (isLoading && !memoizedMatchesData) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  return (
    <>
      {sortBy === 'time' ? (
        <MatchListByTimeIsolated page={page} sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket}
          isLiveMatchRefetching={isRefetching} />
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
