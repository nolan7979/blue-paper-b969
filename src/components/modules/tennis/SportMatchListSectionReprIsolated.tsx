import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import {
  MatchListByTimeIsolated,
  MatchListIsolated,
} from '@/components/modules/tennis';
import { PAGE, SPORT } from '@/constant/common';
import { MatchStateTennis, SportEventDtoWithStat } from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useMatchStore } from '@/stores';
import { useConnectionStore } from '@/stores/connection-store';
import { useSortStore } from '@/stores/sort-store';
import { parseMatchDataArrayTennis } from '@/utils';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

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
  const { matchLiveSocket } = useMqttClient(sport,true);
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const { matchDetails, setMatchDetails } = useMatchStore();
  const { isConnected } = useConnectionStore();
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
    SPORT.TENNIS,
    matchTypeFilter,
    i18n.language,
    parseMatchDataArrayTennis
  );

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch,
  );

  useEffect(() => {
    if (matchesDefault) {
      const parsedMatches =
        parseMatchDataArrayTennis(matchesDefault)?.reduce((acc, match) => {
          const matchId = match?.id;
          acc[matchId] = match;
          return acc;
        }, {} as Record<string, any>) || {};
      setMatchesData(parsedMatches);
    } else {
      if (matches) {
        const firstMatch = Object.values(matches).find(
          (match: any, index: number) =>
            match?.status?.code === MatchStateTennis.NotStarted
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
      parseMatchDataArrayTennis(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};
    if (Object.keys(liveMatchesConvert).length > 0) {
      setMatchesLive(liveMatchesConvert);
    }
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
