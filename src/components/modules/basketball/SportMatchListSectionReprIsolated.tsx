import {
  MatchListIsolated as BkbMatchListIsolated,
  MatchListByTimeIsolated as BkbMatchListByTimeIsolated,
} from '@/components/modules/basketball/match';
import useMqttClient from '@/hooks/useMqtt';
import { format } from 'date-fns';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';

import { useSortStore } from '@/stores/sort-store';
import { useEffect, useMemo, useState } from 'react';
import { useFilterStore, useMatchStore } from '@/stores';
import useTrans from '@/hooks/useTrans';
import { SportEventDtoWithStat } from '@/constant/interface';
import { MatchStateBasketBall, parseMatchDataBasketBall } from '@/utils';
import { PAGE, SPORT } from '@/constant/common';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.BASKETBALL,
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
  const { matchLiveSocket } = useMqttClient(sport, true);
  const { matchDetails, setMatchDetails } = useMatchStore();
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
    parseMatchDataBasketBall
  );

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );

  useEffect(() => {
    if (matchesDefault) {
      const parsedMatches =
        parseMatchDataBasketBall((matches as string) || matchesDefault)?.reduce(
          (acc, match) => {
            const matchId = match?.id;
            acc[matchId] = match;
            return acc;
          },
          {} as Record<string, any>
        ) || {};
      setMatchesData(parsedMatches);
    } else {
      if (matches) {
        const firstMatch = Object.values(matches).find(
          (match: any, index: number) =>
            match?.status?.code === MatchStateBasketBall.NotStarted
        ) as SportEventDtoWithStat;
        if (!matchDetails) {
          setFirstMatch && setFirstMatch(firstMatch);
          setMatchDetails(firstMatch);
        }
      }
      setMatchesData(matches);
    }
  }, [matches, matchesDefault]);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataBasketBall(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    // addMatches(liveMatchesConvert);
    setMatchesLive(liveMatchesConvert);
  }, [liveMatches]);

  const memoizedMatchesData = useMemo(() => matchesData, [matchesData]);
  const memoizedMatchesLive = useMemo(() => matchesLive, [matchesLive]);
  const memoizedMatchesSocket = useMemo(
    () => matchLiveSocket,
    [matchLiveSocket]
  );

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
        <BkbMatchListByTimeIsolated
          page={page}
          sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket}
        />
      ) : (
        <BkbMatchListIsolated
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
