import {
  MatchListByTimeIsolated as HockeyMatchListByTimeIsolated,
  MatchListIsolated as HockeyMatchListIsolated,
} from '@/components/modules/hockey/match';
import useMqttClient from '@/hooks/useMqtt';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { format } from 'date-fns';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useMatchStore } from '@/stores';
import { useSortStore } from '@/stores/sort-store';
import {  parseMatchDataArrayHockey } from '@/utils';
import { MatchStateHockey } from '@/constant/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.ICE_HOCKEY,
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
  const { matchLiveSocket } = useMqttClient(sport,true);
  const { matchDetails, setMatchDetails } = useMatchStore();
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
    parseMatchDataArrayHockey
  );
  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);
  const countLiveMatchesRef = useRef<number>(matchLiveSocket?.match_living_amount || 0);

  useEffect(() => {
    if (matchesDefault) {
      const parsedMatches = parseMatchDataArrayHockey(matches as string || matchesDefault)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};
      setMatchesData(parsedMatches);
    } else {
      if (matches) {
        const firstMatch = Object.values(matches).find((match: any, index: number) => match?.status?.code === MatchStateHockey.NotStarted ) as SportEventDtoWithStat;
        if (!matchDetails) {
          setFirstMatch && setFirstMatch(firstMatch);
          setMatchDetails(firstMatch);
        }
        setMatchesData(matches);
      }
    }
  }, [matches, matchesDefault]);


  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayHockey(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    // addMatches(liveMatchesConvert);
    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

  useEffect(() => {
    if (matchLiveSocket?.match_living_amount !== countLiveMatchesRef.current) {
      refetch();
      countLiveMatchesRef.current = matchLiveSocket?.match_living_amount;
    }
  }, [matchLiveSocket]);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );


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
        <HockeyMatchListByTimeIsolated page={page} sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket} />
      ) : (
        <HockeyMatchListIsolated
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
