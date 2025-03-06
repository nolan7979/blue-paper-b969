/* eslint-disable react-hooks/exhaustive-deps */
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { MatchStateIdToMatchState } from '@/components/modules/football/match/MatchListIsolated';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useLivescoreStore } from '@/stores/liveScore-store';

import {
  matchStateIdToMatchState,
  SportEventDtoWithStat,
} from '@/constant/interface';
import {
  filterMatchesTennis,
  formatMatchTimestampTennis,
  getDateFromTimestamp,
} from '@/utils';
import { convertStatusCode } from '@/utils/convertInterface';

import vi from '~/lang/vi';
import { MatchRowByTimeIsolated } from '@/components/modules/tennis';
import React from 'react';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { PAGE, SPORT } from '@/constant/common';

export const MatchListByTimeIsolated = ({
  sport = SPORT.BASKETBALL,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching = false,
}: MatchListIsolatedProps) => {
  const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
  const [allMatches, setAllMatches] = useState<SportEventDtoWithStat[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

  const { resolvedTheme } = useTheme();
  const { matchTypeFilter } = useFilterStore();
  const { matchesOdds } = useHomeStore();
  const { dateFilter } = useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { homeSound } = useSettingsStore();
  const isShowTime = true;
  const i18n = useTrans();

  useEffect(() => {
    if (matches || matchesLive) {
      const matchShow = matchTypeFilter === 'live' ? matchesLive : matches;
      const filteredMatches: SportEventDtoWithStat[] = filterMatchesTennis(
        Object.values(matchShow),
        page,
        matchTypeFilter,
        dateFilter,
        sport
      );
      if (JSON.stringify(filteredMatches) !== JSON.stringify(allMatches)) {
        setAllMatches(filteredMatches);
        const followedMatches = filteredMatches.filter((match) =>
          matchFollowed.some(
            (follow: { matchId: string }) => follow?.matchId === match?.id
          )
        );

        const nonFollowedMatches = filteredMatches.filter((match) => {
          const [time] = formatMatchTimestampTennis(
            match.startTimestamp,
            match.status,
            true,
            0
          );
          const isNaNTime = time === '0';
          return (
            !matchFollowed.some(
              (follow: { matchId: string }) => follow?.matchId === match?.id
            ) && !isNaNTime
          );
        });

        if (
          matchTypeFilter === 'finished' ||
          matchTypeFilter === 'results' ||
          page === 'results'
        ) {
          followedMatches.sort((a, b) => b.startTimestamp - a.startTimestamp);
          nonFollowedMatches.sort(
            (a, b) => b.startTimestamp - a.startTimestamp
          );
        } else {
          followedMatches.sort((a, b) => a.startTimestamp - b.startTimestamp);
          nonFollowedMatches.sort(
            (a, b) => a.startTimestamp - b.startTimestamp
          );
        }
        setShouldRefetch(false);
        setMatchesShow([...followedMatches, ...nonFollowedMatches]);
      }
    }
  }, [
    matchTypeFilter,
    dateFilter,
    page,
    matchFollowed,
    matches,
    matchesLive,
    sport,
  ]);

  useEffect(() => {
    setShouldRefetch(true);
  }, [dateFilter, matchTypeFilter]);

  // Used for socket to update information of the matches
  useEffect(() => {
    if (matches && matchLiveSocket) {
      const { metadata, payload } = matchLiveSocket;
      const { sport_event_id } = metadata || {};
      const { sport_event_status } = payload || {};
      const { away_score, home_score, status_id, kick_of_timestamp } =
        sport_event_status || {};
      if (matches[sport_event_id] || matchesLive[sport_event_id]) {
        const updatedMatch = {
          ...matches[sport_event_id],
          homeScore: {
            ...(matches[sport_event_id] && matches[sport_event_id].homeScore),
            display: home_score?.regular_score,
          },
          homeCornerKicks: home_score?.corners,
          awayScore: {
            ...(matches[sport_event_id] && matches[sport_event_id].awayScore),
            display: away_score?.regular_score,
          },
          awayCornerKicks: away_score?.corners,
          status: convertStatusCode(
            matchStateIdToMatchState[
              status_id as keyof MatchStateIdToMatchState
            ]
          ),
          time: {
            currentPeriodStartTimestamp: kick_of_timestamp,
          },
        };

        const updatedMatches = {
          ...matches,
          [sport_event_id]: updatedMatch,
        };
        const updatedMatchesLive = matchesLive[sport_event_id]
          ? {
              ...matchesLive,
              [sport_event_id]: updatedMatch,
            }
          : { ...matchesLive };

        setMatches(Object.values(updatedMatches));
        setMatchesLive(Object.values(updatedMatchesLive));
        setShouldRefetch(false);
      }
    }
  }, [matchLiveSocket]);

  if (matchesShow.length === 0 && shouldRefetch) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }
  return (
    <div className='p-2 md:px-2.5'>
      <div className=' h-full space-y-1'>
        <div className=' dev3 space-y-2'>
          {(matchesShow as SportEventDtoWithStat[])?.map(
            (match: SportEventDtoWithStat, idx: number) => {
              const matchDate = getDateFromTimestamp(match.startTimestamp);
              const prevRowDate = getDateFromTimestamp(
                (matchesShow as SportEventDtoWithStat[])[idx - 1]
                  ?.startTimestamp
              );
              const isSameDate: boolean =
                idx > 0 && !isSameDay(matchDate, prevRowDate);

              if (isSameDate) {
                const matchId = match?.id;
                return (
                  <div key={match?.id || idx}>
                    <div
                      key={`nd-${match?.id}`}
                      className='flex place-content-center items-center p-2 text-csm text-logo-blue'
                    >
                      {i18n === vi
                        ? format(matchDate, 'dd/MM/yyyy (eeee)', {
                            locale: dateFnsVi,
                          })
                        : format(matchDate, 'eeee, yyyy/MM/dd')}
                    </div>
                    <MatchRowByTimeIsolated
                      key={match?.id || idx}
                      match={match}
                      theme={resolvedTheme}
                      homeSound={homeSound}
                      showTime={isShowTime}
                      page={page}
                    />
                  </div>
                );
              } else {
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
                return (
                  <div key={match?.id}>
                    <MatchRowByTimeIsolated
                      key={match?.id || idx}
                      theme={resolvedTheme}
                      match={match}
                      homeSound={homeSound}
                      matchOdds={matchOdds}
                      page={page}
                      showTime={isShowTime}
                    />
                  </div>
                );
              }
            }
          )}
        </div>
      </div>
    </div>
  );
};
