import { MatchListByTimeIsolated } from '@/components/modules/snooker/match/MatchListByTimeIsolated';
import { MatchListIsolated } from '@/components/modules/snooker/match/MatchListIsolated';
import { PAGE, SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';
import { format } from 'date-fns';

import { MatchState, SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { useFilterStore, useMatchStore } from '@/stores';
import { useConnectionStore } from '@/stores/connection-store';
import { useEventCountStore } from '@/stores/event-count';
import { useSortStore } from '@/stores/sort-store';
import { MatchStateSnooker, parseSnookerMatchDataArray } from '@/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.SNOOKER,
  matchesDefault = '',
  setFirstMatch,
  firstMatch,
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
  firstMatch?: SportEventDtoWithStat;
}) => {
  const { sortBy } = useSortStore();
  const i18n = useTrans();
  const eventNumberRef = useRef<number | null>(null);
  const [matchesData, setMatchesData] = useState<SportEventDtoWithStat | {}>(
    {}
  );
  const [matchesLive, setMatchesLive] = useState<SportEventDtoWithStat | {}>(
    {}
  );
  const { matchDetails, setMatchDetails } = useMatchStore();
  const { eventNumber } = useEventCountStore();
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const { matchLiveSocket } = useMqttClient(sport, true);
  const { isConnected } = useConnectionStore();
  const dateFilterString = useMemo(() => {
    //compare format date
    const dateFormat = format(dateFilter, 'yyyy-MM-dd');
    return dateFormat;
  }, [dateFilter]);

  const { data: matches } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter,
    i18n.language,
    parseSnookerMatchDataArray
  );

  useEffect(() => {
    if (matchesDefault || matches) {
      const parsedMatches =
      (matchesDefault &&
        parseSnookerMatchDataArray(matchesDefault)?.reduce((acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        }, {} as Record<string, any>)) ||
        {};
      const matchesData = matches || parsedMatches;
      const firstMatchData = Object.values(matchesData).find(
        (match: any, index: number) =>
          match?.status?.code === MatchStateSnooker.upcoming
      ) as SportEventDtoWithStat;
     
      if (!matchDetails) {
        setMatchDetails(firstMatchData);
      }
      if (firstMatchData) {
        setFirstMatch && setFirstMatch(firstMatchData);
      }
      setMatchesData(matchesData);
    }
  }, [matches, matchesDefault, sport]);

  const {
    data: liveMatches,
    refetch,
    isRefetching,
  } = useLiveMatchData(sport, parseSnookerMatchDataArray);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        matchTypeFilter === 'live' &&
        liveMatches &&
        Object.keys(liveMatches).length > 0 &&
        !isConnected
      ) {
        refetch();
      }
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch, matchTypeFilter, liveMatches, isConnected]);

  useEffect(() => {
    if (eventNumberRef.current === null) {
      eventNumberRef.current = eventNumber;
    }
    const isChangeEventNumber =
      eventNumberRef.current !== eventNumber && eventNumber > 0;
    if (isChangeEventNumber) {
      refetch();
      eventNumberRef.current = eventNumber;
    }
  }, [eventNumber, refetch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    // addMatches(liveMatches);
    setMatchesLive(liveMatches);
  }, [liveMatches, isRefetching, setMatchesLive]);

  const memoizedMatchesData = useMemo(() => {
    return matchesData;
  }, [matchesData]);
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
          matchesLive={matchesLive}
          matches={memoizedMatchesData}
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
          matchesLive={matchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          matchLiveSocket={memoizedMatchesSocket}
          isLiveMatchRefetching={isRefetching}
        />
      )}
    </>
  );
};
