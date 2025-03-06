/* eslint-disable react-hooks/exhaustive-deps */
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { TwMatchListContainer } from '@/components/modules/football/columns/MainColumnComponents';
import { MatchStateIdToMatchState } from '@/components/modules/football/match/MatchListIsolated';
import { MatchRowByTimeIsolated } from '@/components/modules/football/match/MatchRowByTimeIsolated';

import {
  useFilterStore,
  useHomeStore,
  useMatchStore,
  useSettingsStore,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  matchStateIdToMatchState,
  SportEventDtoWithStat,
} from '@/constant/interface';
import {
  compareFields,
  formatMatchTimestamp,
  getDateFromTimestamp,
} from '@/utils';
import { convertStatusCode } from '@/utils/convertInterface';

import { EmptyEvent } from '@/components/common/empty';
import { TwSectionWrapper } from '@/components/modules/common';
import { useWindowSize } from '@/hooks';
import { useFilterMatches } from '@/hooks/useFootball/useFilterMatches';
import { produce } from 'immer';
import { useRouter as useRouterNav } from 'next/navigation';
import React from 'react';
import vi from '~/lang/vi';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { PAGE, SPORT } from '@/constant/common';
import { areMatchesEqual } from '@/utils/compareArrays';
import { isEqual } from 'lodash';

export const MatchListByTimeIsolated = ({
  page = PAGE.liveScore,
  sport = SPORT.FOOTBALL,
  matches = {},
  matchesLive,
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isDetail,
  isLiveMatchRefetching,
}: MatchListIsolatedProps) => {
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
  const { width } = useWindowSize();
  const router = useRouterNav();

  const { filteredMatches, isLoading, setIsLoading } = useFilterMatches({
    page,
    matchTypeFilterMobile,
    matchTypeFilter,
    matches,
    matchesLive,
    dateFilter,
  });
  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
    matchDetails,
  } = useMatchStore();

  const handleClick = (match: SportEventDtoWithStat) => {
    if (isDetail || width < 1024) {
      router.push(`/${sport}/match/${match?.slug}/${match?.id}`);
    } else {
      setShowSelectedMatch(true);
      setSelectedMatch(match?.id.toString());
      setMatchDetails(match);
    }
  };

  useEffect(() => {
    if (
      (matches && Object.values(matches).length > 0) ||
      (matchesLive && Object.values(matchesLive).length > 0)
    ) {
      // if (
      //   (filteredMatches.length > 0 &&
      //     (matchesShow.length === 0 ||
      //       (!!matchLiveIdRef.current && matchesShow.length > 0))) ||
      //   isLiveMatchRefetching
      // ) {
        const optimizedMaches = produce(
          (draft: {
            followedMatches: SportEventDtoWithStat[];
            nonFollowedMatches: SportEventDtoWithStat[];
          }) => {
            filteredMatches.forEach((match) => {
              const [time] = formatMatchTimestamp(
                match.startTimestamp,
                match.status,
                true,
                match.time?.currentPeriodStartTimestamp
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
        const matchsShowCombined = [...followedMatches, ...nonFollowedMatches];

        const isMatchesEqual = areMatchesEqual(matchesShow, matchsShowCombined);
        if (!isMatchesEqual) {
          setMatchesShow(matchsShowCombined);
        } else {

          matchsShowCombined.forEach((match, idx) => {
            const oldMatch = matchesShow[idx];
  
              if (!oldMatch) return;
  
              // Compare relevant fields that should trigger a re-render
              const isMatchDifferent = !isEqual(
                {
                  homeScore: match.homeScore,
                  awayScore: match.awayScore,
                  homeCornerKicks: match.homeCornerKicks,
                  awayCornerKicks: match.awayCornerKicks,
                  status: match.status,
                  time: match.time,
                },
                {
                  homeScore: oldMatch.homeScore,
                  awayScore: oldMatch.awayScore,
                  homeCornerKicks: oldMatch.homeCornerKicks,
                  awayCornerKicks: oldMatch.awayCornerKicks,
                  status: oldMatch.status,
                  time: oldMatch.time,
                }
              );
  
              if (isMatchDifferent) {
                setMatchesShow(matchsShowCombined);
              }
          });
        }

        if (isLoading) {
          setIsLoading(false);
        }
        matchLiveIdRef.current = false;
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
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    if (isLiveMatchRefetching && matchDetails) {
      const getMatchDetail = matchesLive[matchDetails?.id];
      
      const isMatchDetailDifferent = !isEqual({
        homeScore: getMatchDetail?.homeScore,
        awayScore: getMatchDetail?.awayScore,
        homeCornerKicks: getMatchDetail?.homeCornerKicks,
        awayCornerKicks: getMatchDetail?.awayCornerKicks,
        status: getMatchDetail?.status,
        currentPeriodStartTimestamp: getMatchDetail?.time?.currentPeriodStartTimestamp,
      }, {
        homeScore: matchDetails?.homeScore,
        awayScore: matchDetails?.awayScore,
        homeCornerKicks: matchDetails?.homeCornerKicks,
        awayCornerKicks: matchDetails?.awayCornerKicks,
        status: matchDetails?.status,
        currentPeriodStartTimestamp: matchDetails?.time?.currentPeriodStartTimestamp
      })

      if (isMatchDetailDifferent && getMatchDetail) {
        setMatchDetails(getMatchDetail);
      }
    }
  }, [isLiveMatchRefetching]);

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

    if (!matchLiveSocket?.metadata?.sport_event_id || !matches) return;

    const { metadata: { sport_event_id }, payload } = matchLiveSocket;
    const { away_score, home_score, status_id, kick_of_timestamp } = payload?.sport_event_status || {};

    const currentMatch = matchesLive[sport_event_id] || matches[sport_event_id];
    if (!currentMatch) return;

    const updatedMatch = {
      ...currentMatch,
      homeScore: {
        ...currentMatch.homeScore,
        display: home_score?.regular_score ?? currentMatch.homeScore.display,
      },
      homeCornerKicks: home_score?.corners ?? currentMatch.homeCornerKicks,
      awayScore: {
        ...currentMatch.awayScore,
        display: away_score?.regular_score ?? currentMatch.awayScore.display,
      },
      awayCornerKicks: away_score?.corners ?? currentMatch.awayCornerKicks,
      status: status_id ? convertStatusCode(
        matchStateIdToMatchState[status_id as keyof MatchStateIdToMatchState]
      ) : currentMatch.status,
      time: {
        currentPeriodStartTimestamp: kick_of_timestamp >= 0 ? kick_of_timestamp : currentMatch.time?.currentPeriodStartTimestamp,
      },
    };

    const changedFields = compareFields(currentMatch, updatedMatch, fieldsToCompare);
    if (changedFields.length === 0) return;

    const updatedMatches = produce(matches, draft => {
      if (draft[sport_event_id]) {
        changedFields.forEach(field => {
          draft[sport_event_id][field] = updatedMatch[field];
        });
      }
    });

    const updatedMatchesLive = produce(matchesLive, (draft: any) => {
      if (draft[sport_event_id]) {
        changedFields.forEach(field => {
          draft[sport_event_id][field] = updatedMatch[field];
        });
      }
    });

    const updatedMatchesClean = Object.fromEntries(Object.entries(updatedMatches).filter(([_key, value]) => {
      return value !== null && typeof value === 'object' && 'id' in value;
    }));
    const updatedMatchesLiveClean = Object.fromEntries(Object.entries(updatedMatchesLive).filter(([_key, value]) => {
      return value !== null && typeof value === 'object' && 'id' in value;
    }));

    setMatches(updatedMatchesClean);
    setMatchesLive(updatedMatchesLiveClean);

    if (matchDetails?.id === sport_event_id) {
      setMatchDetails(updatedMatch);
    }
    matchLiveIdRef.current = true;

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
                  <div key={match?.id || idx} id={`match-by-time-${match?.id}`}>
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
                      selectedMatch={selectedMatch}
                      showSelectedMatch={showSelectedMatch}
                      onClick={handleClick}
                    />
                  </div>
                );
              } else {
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
                return (
                  <div key={match?.id} id={`match-by-time-${match?.id}`}>
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
                      selectedMatch={selectedMatch}
                      showSelectedMatch={showSelectedMatch}
                      onClick={handleClick}
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
};
