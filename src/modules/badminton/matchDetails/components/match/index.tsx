'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useFetchEventIncidents,
  useMatchMomentumGraphData,
} from '@/hooks/useTennis';

import Avatar from '@/components/common/Avatar';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { EventsOfSet, GameScore, GroupedData } from '@/models';
import { GraphPointTennis } from '@/models/interface';
import {
  MatchRoundTennis,
  isMatchLive,
  isMatchLiveTennis,
  isMatchNotStarted,
} from '@/utils';

import Rectangle from '@/components/common/skeleton/Rectangle';
import { TwQuickViewTitleV2 } from '@/components/modules/common';
import useTrans from '@/hooks/useTrans';
import BarChart from '../chart';
import clsx from 'clsx';
import React from 'react';
import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';

const REQUEST_TIME = 30000;

const useMatchData = (matchId: string, status: StatusDto) => {
  const {
    data: momentumData,
    isLoading,
    isError,
    refetch,
  } = useMatchMomentumGraphData(matchId, status.code);

  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isEventError,
    refetch: refetchEvents,
  } = useFetchEventIncidents(matchId, status.code);

  return {
    momentumData,
    events,
    isLoading: isLoading && isLoadingEvents,
    isError: isError && isEventError,
    refetch,
    refetchEvents,
  };
};

const Match = ({
  matchData,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const [labels, setLabels] = useState<number[]>([]);
  const [timeLines, setTimelines] = useState<GroupedData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const status: StatusDto = matchData?.status;
  const shouldRefetching = isMatchLive(status?.code);
  // const { addMore } = useTimeLineStore();
  const { momentumData, events, isLoading, isError, refetch } = useMatchData(
    matchData?.id,
    status
  );

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const groupBySetMatch = (
    data: GraphPointTennis[],
    events: EventsOfSet[],
    match?: SportEventDtoWithStat
  ) => {
    if (data) {
      const groupData = data?.reduce(
        (acc: GroupedData[], { set, round, value }: GraphPointTennis) => {
          // Find if the set already exists in the accumulator
          let homeScore = 0,
            awayScore = 0;
          let setGroup = acc.find((group) => group.label.set === set);
          let findSet = events?.find((event) => event.set === set);
          const largestGame = findSet?.games.reduce(
            (max, game) => Math.max(max, game.game),
            0
          );

          if (largestGame) {
            const setScore = findSet?.games.find(
              (game) => game.game === largestGame
            )?.score;
            homeScore = setScore?.homeScore || 0;
            awayScore = setScore?.awayScore || 0;
          } else if (match && match.scores) {
            const lastKey = Object.keys(MatchRoundTennis)
              .reverse()
              .find(
                (key) =>
                  match.scores &&
                  match.scores[key as keyof typeof MatchRoundTennis]
              );
            if (lastKey) {
              homeScore = match.scores[lastKey][0];
              awayScore = match.scores[lastKey][1];
            }
          }

          // If the set is not found, then we need to find the last set that has scores
          if (!setGroup) {
            setGroup = {
              label: { set, score: { home: homeScore, away: awayScore } },
              data: {
                home: [],
                away: [],
              },
            };
            acc.push(setGroup);
          }
          // Add the data to the set
          setGroup.data.home.push({ x: round, y: value > 0 ? value : 0 });
          setGroup.data.away.push({ x: round, y: value <= 0 ? value : 0 });

          return acc;
        },
        []
      ) satisfies GroupedData[];

      setTimelines(groupData);
    }
    return;
  };

  useEffect(() => {
    groupBySetMatch(momentumData, events, matchData);
  }, [momentumData, events, matchData]);

  useEffect(() => {
    if (shouldRefetching) {
      intervalRef.current = setInterval(() => {
        refetch();
        // refetchEvents();
      }, REQUEST_TIME);
    }

    return () => {
      clearCurrentInterval();
    };
  }, [refetch, shouldRefetching]);

  useEffect(() => {
    if (!isMatchNotStarted(matchData.status.code)) {
      clearCurrentInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchData.status.code]);

  const memoizedLabels = useMemo(() => labels, [labels]);
  const memoizedTimeLines = useMemo(() => timeLines, [timeLines]);

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <div className='flex justify-center'>
          <Rectangle classes='w-20 h-7' />
        </div>
        <div className='bg-primary-gradient space-y-3'>
          <Rectangle classes='w-full h-[8.5rem]' fullWidth />
        </div>
      </div>
    );
  }

  if (isError || memoizedTimeLines.length === 0) {
    return <></>; // TODO
  }

  return (
    <div className='space-y-3'>
      {!isDetail && <TwQuickViewTitleV2>Stats</TwQuickViewTitleV2>}
      <TwBorderLinearBox
        className={clsx('dark:border-linear-box bg-white dark:bg-primary-gradient', {
          '!bg-none after:!bg-none': isDetail,
        })}
      >
        <div className='highlight-score-content p-8'>
          <div className='timeline-content'>
            <div className='team-content'>
              <div className='home'>
                <HandleGroupAvatar team={matchData.homeTeam} sport={'tennis'} size={24}></HandleGroupAvatar>
              </div>
              <div className='guest'>
                <HandleGroupAvatar team={matchData.awayTeam} sport={'tennis'} size={24}></HandleGroupAvatar>
              </div>
            </div>
            <div className='flex h-auto w-full items-center bg-[#171c29]'>
              {memoizedTimeLines?.length > 0 && (
                <BarChart
                  labels={memoizedLabels}
                  data={memoizedTimeLines}
                  isLive={isMatchLiveTennis(matchData.status.code)}
                />
              )}
            </div>
          </div>
        </div>
      </TwBorderLinearBox>
    </div>
  );
};

export default Match;
