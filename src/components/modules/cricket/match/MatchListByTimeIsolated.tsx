/* eslint-disable react-hooks/exhaustive-deps */
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { TwMatchListContainer } from '@/components/modules/cricket/columns/MainColumnComponents';
import { MatchStateIdToMatchState } from '@/components/modules/cricket/match/MatchListIsolated';
import { MatchRowByTimeIsolated } from '@/components/modules/cricket/match/MatchRowByTimeIsolated';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  matchStateIdToMatchState,
  SportEventDtoWithStat,
} from '@/constant/interface';
import {
  compareFields,
  getDateFromTimestamp,
} from '@/utils';
import { convertStatusCode } from '@/utils/convertInterface';

import { EmptyEvent } from '@/components/common/empty';
import { TwSectionWrapper } from '@/components/modules/common';
import { produce } from 'immer';
import React from 'react';
import vi from '~/lang/vi';
import { formatMatchTimestamp } from '@/utils/cricketUtils';
import { useFilterMatches } from '@/hooks/useCricket';

export const MatchListByTimeIsolated = React.memo(
  ({
    page = 'live-score',
    sport = 'football',
    matches,
    matchesLive,
    setMatches = () => {},
    setMatchesLive = () => {},
    matchLiveSocket,
  }: {
    page: string;
    sport: string;
    matches: any;
    matchesLive: any;
    setMatches: (matches: any) => void;
    setMatchesLive: (matches: any) => void;
    matchLiveSocket?: Record<string, any> | null;
  }) => {
    const matchLiveIdRef = useRef<boolean | null>(null);
    const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
    const { resolvedTheme } = useTheme();
    const { dateFilter, matchTypeFilter, matchTypeFilterMobile } =
      useFilterStore();
    const { matchesOdds } = useHomeStore();
    const matchFollowed = useFollowStore((state) => state.followed.match);
    const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
    const isShowTime = true;
    const i18n = useTrans();

    const { filteredMatches, isLoading, setIsLoading } = useFilterMatches({
      page,
      matchTypeFilterMobile,
      matchTypeFilter,
      matches,
      matchesLive,
      dateFilter,
    });

    useEffect(() => {
      if (
        Object.values(matches).length > 0 ||
        Object.values(matchesLive).length > 0
      ) {
        if (
          filteredMatches.length > 0 &&
          (matchesShow.length === 0 ||
            (!!matchLiveIdRef.current && matchesShow.length > 0))
        ) {
          const optimizedMaches = produce(
            (draft: {
              followedMatches: SportEventDtoWithStat[];
              nonFollowedMatches: SportEventDtoWithStat[];
            }) => {
              filteredMatches.forEach((match) => {
                const [time] = formatMatchTimestamp(
                  match.startTimestamp,
                  match?.status?.code || 1,
                );
                const isNaNTime = time === '0';
                const isMatchFollowed = matchFollowed.some(
                  (follow: { matchId: string }) => follow?.matchId === match?.id
                );
                if (isMatchFollowed) {
                  draft.followedMatches.push(match);
                }
                if (!isMatchFollowed && !isNaNTime) {
                  draft.nonFollowedMatches.push(match);
                }

                if (
                  matchTypeFilter === 'finished' ||
                  matchTypeFilter === 'results' ||
                  page === 'results'
                ) {
                  draft.followedMatches.sort(
                    (a, b) => b.startTimestamp - a.startTimestamp
                  );
                  draft.nonFollowedMatches.sort(
                    (a, b) => b.startTimestamp - a.startTimestamp
                  );
                } else {
                  draft.followedMatches.sort(
                    (a, b) => a.startTimestamp - b.startTimestamp
                  );
                  draft.nonFollowedMatches.sort(
                    (a, b) => a.startTimestamp - b.startTimestamp
                  );
                }
              });
            },
            {
              followedMatches: [] as SportEventDtoWithStat[],
              nonFollowedMatches: [] as SportEventDtoWithStat[],
            }
          );
          const { followedMatches, nonFollowedMatches } = optimizedMaches();

          setMatchesShow([...followedMatches, ...nonFollowedMatches]);
          matchLiveIdRef.current = false;
        }
      }
    }, [
      matchTypeFilter,
      dateFilter,
      page,
      matchFollowed,
      matches,
      matchesLive,
      matchTypeFilterMobile,
      isLoading,
      i18n.language,
      filteredMatches,
      matchesShow,
      matchLiveIdRef.current,
    ]);

    // Used for socket to update information of the matches
    useEffect(() => {
      const fieldsToCompare = [
        'homeScore',
        'awayScore',
        'homeCornerKicks',
        'awayCornerKicks',
        'status',
        'time',
      ];
      if (!matchLiveSocket || !matches) return;

      const { metadata, payload } = matchLiveSocket;
      const { sport_event_id } = metadata || {};
      const { sport_event_status } = payload || {};
      const { away_score, home_score, status_id, kick_of_timestamp } =
        sport_event_status || {};

      if (!matches[sport_event_id] && !matchesLive[sport_event_id]) return;

      const currentMatch =
        matchesLive[sport_event_id] || matches[sport_event_id];

      if (!currentMatch) return;

      const updatedMatch = {
        ...currentMatch,
        homeScore: {
          ...currentMatch.homeScore,
          display: home_score?.regular_score,
        },
        homeCornerKicks: home_score?.corners,
        awayScore: {
          ...currentMatch.awayScore,
          display: away_score?.regular_score,
        },
        awayCornerKicks: away_score?.corners,
        status: convertStatusCode(
          matchStateIdToMatchState[status_id as keyof MatchStateIdToMatchState]
        ),
        time: {
          currentPeriodStartTimestamp: kick_of_timestamp,
        },
      };

      const updatedMatches = { ...matches };
      const updatedMatchesLive = { ...matchesLive };

      const changedFields = compareFields(
        currentMatch,
        updatedMatch,
        fieldsToCompare
      );

      if (changedFields.length > 0) {
        changedFields.forEach((field) => {
          updatedMatchesLive[sport_event_id] = {
            ...updatedMatchesLive[sport_event_id],
            [field]: updatedMatch[field],
          };
          updatedMatches[sport_event_id] = {
            ...updatedMatches[sport_event_id],
            [field]: updatedMatch[field],
          };
        });

        setMatches(updatedMatches);
        setMatchesLive(updatedMatchesLive);
        matchLiveIdRef.current = sport_event_id;
      }
    }, [matchLiveSocket]);

    useEffect(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
      setMatchesShow([]);
    }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

    useEffect(() => {
      if (
        !isSameDay(new Date(), dateFilter) &&
        ['live'].includes(matchTypeFilter) &&
        matchesShow.length === 0 &&
        isLoading
      ) {
        setIsLoading(false);
      }
    }, [matchesShow, dateFilter, matchTypeFilter, isLoading]);

    useEffect(() => {
      if (filteredMatches.length === 0) {
        setMatchesShow([]);
        return;
      }
    }, [filteredMatches]);

    useEffect(() => {
      if (
        (matchesShow.length > 0 ||
          (['live'].includes(matchTypeFilter) &&
            Object.values(matchesLive).length === 0 &&
            Object.values(matches).length === 0)) &&
        isLoading
      ) {
        setIsLoading(false);
      }
    }, [matchesShow, matchesLive, isLoading, matchTypeFilter]);

    if (isLoading) {
      return <MatchSkeletonMapping />;
    }

    if (!isLoading && matchesShow.length === 0) {
      return (
        <TwSectionWrapper>
          <EmptyEvent
            title={i18n.notification.notiTitle}
            content={i18n.notification.notiContent}
          />
        </TwSectionWrapper>
      );
    }

    return (
      <TwMatchListContainer className=''>
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
                  const matchOdds = matchesOdds[matchId];
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
                        showYellowCard={showYellowCard}
                        showRedCard={showRedCard}
                        homeSound={homeSound}
                        matchOdds={matchOdds}
                        showTime={isShowTime}
                        page={page}
                        sport={sport}
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
                        showYellowCard={showYellowCard}
                        showRedCard={showRedCard}
                        homeSound={homeSound}
                        matchOdds={matchOdds}
                        page={page}
                        showTime={isShowTime}
                        sport={sport}
                      />
                    </div>
                  );
                }
              }
            )}
          </div>
        </div>
      </TwMatchListContainer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.matches === nextProps.matches &&
      prevProps?.matchesLive === nextProps.matchesLive &&
      prevProps?.page === nextProps.page &&
      prevProps?.sport === nextProps.sport && 
      prevProps?.matchLiveSocket === nextProps.matchLiveSocket
    );
  }
);
