import {
  MatchListByTimeIsolated as MatchListByTimeIsolatedAMFootball,
  MatchListIsolated as MatchListIsolatedAMFootball,
} from '@/components/modules/am-football/match';
import { PAGE, SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useMatchStore } from '@/stores';

import { useSortStore } from '@/stores/sort-store';
import { format } from 'date-fns';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import {
  MatchStateAMFootball,
  parseMatchDataArrayAMFootball,
} from '@/utils/americanFootballUtils';
import { useEffect, useMemo, useState } from 'react';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.AMERICAN_FOOTBALL,
  matchesDefault,
  setFirstMatch,
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
}) => {
  const { sortBy } = useSortStore();
  const i18n = useTrans();
  const { matchLiveSocket } = useMqttClient(sport, true);
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const { setMatchDetails } = useMatchStore();
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
    parseMatchDataArrayAMFootball
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
        parseMatchDataArrayAMFootball(
          (matches as string) || matchesDefault
        )?.reduce((acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        }, {} as Record<string, any>) || {};
      setMatchesData(parsedMatches);
    } else {
      if (matches) {
        const firstMatch = Object.values(matches).find(
          (match: any, index: number) =>
            match?.status.code === MatchStateAMFootball.NOT_STARTED
        ) as SportEventDtoWithStat;

        if (!firstMatch) {
          setMatchDetails(null);
          const firstMatchDefault = Object.values(matches)[0] as SportEventDtoWithStat;
          setFirstMatch && setFirstMatch(firstMatchDefault);
        } else {
          setFirstMatch && setFirstMatch(firstMatch);
        }
        setMatchesData(matches);
      }
    }
  }, [matches, matchesDefault]);

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArrayAMFootball(liveMatches as string)?.reduce(
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
        <MatchListByTimeIsolatedAMFootball
          page={page}
          sport={sport}
          matches={memoizedMatchesData}
          matchesLive={memoizedMatchesLive}
          setMatches={setMatchesData}
          setMatchesLive={setMatchesLive}
          isLiveMatchRefetching={isRefetching}
          matchLiveSocket={memoizedMatchesSocket}
        />
      ) : (
        <MatchListIsolatedAMFootball
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
