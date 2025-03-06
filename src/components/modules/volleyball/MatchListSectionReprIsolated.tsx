import {
  MatchListByTimeIsolated,
  MatchListIsolated,
} from '@/components/modules/volleyball/match';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useTrans from '@/hooks/useTrans';

import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { useFilterStore } from '@/stores';
import { useSortStore } from '@/stores/sort-store';
import { format } from 'date-fns';
import { useState } from 'react';

import { MatchStateBasketBall, parseMatchDataVolleyball } from '@/utils';
import { isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';

export const MatchListSectionReprIsolated = ({
  page,
  sport = SPORT.VOLLEYBALL,
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

  const { data: matches, isLoading } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter,
    i18n.language,
    parseMatchDataVolleyball
  );

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch
  );

  useEffect(() => {
    if (matchesDefault) {
      const parsedMatches = parseMatchDataVolleyball(
        (matches as string) || matchesDefault
      )?.reduce<Record<string, SportEventDtoWithStat>>((acc, match) => {
        if (match?.id) {
          acc[match.id] = match;
        }
        return acc;
      }, {});

      setMatchesData(parsedMatches || {});
    }
    if (matches) {
      // Find first not started match and set matches data
      const firstMatch = Object.values(
        matches as Record<string, SportEventDtoWithStat>
      ).find(
        (match) => match?.status?.code === MatchStateBasketBall.NotStarted
      );

      if (isEqual(matches, matchesData)) return;

      if (firstMatch && setFirstMatch) {
        setFirstMatch(firstMatch);
      }
      setMatchesData(matches);
    }
  }, [matches]);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataVolleyball(liveMatches as string)?.reduce((acc, match) => {
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
