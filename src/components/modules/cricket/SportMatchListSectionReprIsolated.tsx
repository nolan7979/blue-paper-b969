import { format } from 'date-fns';
import { MatchListByTimeIsolated } from '@/components/modules/cricket/match/MatchListByTimeIsolated';
import { MatchListIsolated } from '@/components/modules/cricket/match/MatchListIsolated';
import { PAGE, SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';

import { useSortStore } from '@/stores/sort-store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFilterStore, useMatchStore } from '@/stores';
import { useDailySummaryData, useLiveMatchData } from '@/hooks/useSportData';
import { MatchState, parseMatchDataArray } from '@/utils/cricketUtils';
import useMqttClient from '@/hooks/useMqtt';
import {  SportEventDtoWithStat } from '@/constant/interface';
import useRefetchLiveMatch from '@/hooks/useRefetchLiveMatch';
type IProps = {
  tournamentId: string;
  seasonId: string;
};

export const SportMatchListSectionReprIsolated = ({
  page,
  sport = SPORT.CRICKET,
  matchesDefault = '',
  setFirstMatch,
}: {
  page: PAGE;
  sport: SPORT;
  matchesDefault?: string;
  setFirstMatch?: (match: SportEventDtoWithStat) => void;
}) => {
  const { sortBy } = useSortStore();
  const i18n = useTrans();
  const [matchesData, setMatchesData] = useState<any>({});
  const [matchesLive, setMatchesLive] = useState<any>({});
  const { matchDetails, setMatchDetails } = useMatchStore();
  const { dateFilter, matchTypeFilter } = useFilterStore();
  const { matchLiveSocket } = useMqttClient(sport,true);

  const dateFilterString = useMemo(() => {
    //compare format date
    const dateFormat = format(dateFilter, 'yyyy-MM-dd');
    return dateFormat;
  }, [dateFilter]);

  const { data: matches = '' } = useDailySummaryData(
    dateFilterString,
    sport,
    matchTypeFilter,
    i18n.language,
    parseMatchDataArray
  );

  useEffect(() => {
    if (matchesDefault) {
      const parsedMatches =
        parseMatchDataArray((matches as string) || matchesDefault)?.reduce(
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
            match?.status?.code === MatchState.NotStarted
        ) as SportEventDtoWithStat;
        if (!matchDetails) {
          setFirstMatch && setFirstMatch(firstMatch);
          setMatchDetails(firstMatch);
        }
        setMatchesData(matches);
      }
    }
  }, [matches, matchesDefault]);

  const { data: liveMatches, refetch, isRefetching } = useLiveMatchData(sport);

  const addMatches = useCallback(
    (newMatches: any) => {
      // const newMatchesData = produce((draft: any) => {
      //   return Object.values(newMatches)?.forEach((match: any) => {
      //     draft[match?.id] = match;
      //   });
      // })(matchesData);
      // if (JSON.stringify(newMatchesData) !== JSON.stringify(matchesData)) {
      // }
      // setMatchesData(newMatchesData);
    },
    [matchesData, setMatchesData]
  );

  useRefetchLiveMatch(
    Object.values(matchesLive)?.length > 0,
    matchTypeFilter,
    refetch,
  );

  useEffect(() => {
    const liveMatchesConvert =
      parseMatchDataArray(liveMatches as string)?.reduce((acc, match) => {
        const matchId = match?.id;
        acc[matchId] = match;
        return acc;
      }, {} as Record<string, any>) || {};

    addMatches(liveMatchesConvert);
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
          matchesLive={memoizedMatchesLive}
          matches={memoizedMatchesData}
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
