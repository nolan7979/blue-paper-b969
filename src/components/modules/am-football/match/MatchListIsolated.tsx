/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
// import useInfiniteScroll from '@/hooks/useInfiniteScroll';

import { useFilterStore, useMatchStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { LeagueRow as LeagueRowAMFootball } from '@/components/modules/am-football/columns';
import { MatchRowIsolated as MatchRowIsolatedAMFootball } from '@/components/modules/am-football/match';
import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { filterMatchesAMFootball } from '@/utils/americanFootballUtils';
import { isSameDay } from 'date-fns/fp';
import { useRouter } from 'next/router';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { isEqual } from 'lodash';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  uniqueTournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = SPORT.AMERICAN_FOOTBALL,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching = false,
}) => {
  const i18n = useTrans();
  const router = useRouter();
  const { width } = useWindowSize();
  const matchLiveIdRef = useRef<boolean | null>(null);
  const tournamentFollowedLengthRef = useRef<number>(0);
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();

  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, matchTypeFilterMobile, setMatchFilter } =
    useFilterStore();

  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { homeSound } = useSettingsStore();

  // const { isSocketBasketBall, setIsSocketBasketBall } = useBasketballStore();
  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament[sport] || []
  );

  const tournamentFollowedChanges = useCallback(
    (filteredMatches: Record<string, any>) => {
      const isTournamentFollowed = tournamentFollowed.some((follow, index) => {
        return follow?.id === filteredMatches[index]?.uniqueTournament?.id;
      });
      return (
        tournamentFollowedLengthRef.current !== tournamentFollowed.length &&
        isTournamentFollowed
      );
    },
    [tournamentFollowed]
  );

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(match.id.toString());
    }

    // Handle navigation after state updates
    if (width < 1024 || isDetail) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setMatchShow([]);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

  useEffect(() => {
    if (isDetail) {
      setMatchFilter('live');
    }
  }, [isDetail]);

  const areMatchesEqual = (
    arr1: Record<string, any>[],
    arr2: Record<string, any>[]
  ) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (!isEqual(arr1[i], arr2[i])) return false;
    }
    return true;
  };

  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const sortedMatchesToShow: TournamentGroup[] = [];
      const matchesShow = matchTypeFilter === 'live' ? matchesLive : matches;
      const followedMatchesByTournament: Record<
        string,
        SportEventDtoWithStat[]
      > = {};
      const allMatchesByTournament: Record<string, SportEventDtoWithStat[]> =
        {};

      const filteredMatches: SportEventDtoWithStat[] = filterMatchesAMFootball(
        Object.values(matchesShow),
        page,
        matchTypeFilter,
        dateFilter,
        matchTypeFilterMobile
      );

      const isTournamentFollowed = tournamentFollowedChanges(filteredMatches);

      if (filteredMatches.length === 0 && isLoading) {
        setMatchShow([]);
        setIsLoading(false);
        return;
      }

      if (
        ((isTournamentFollowed ||
          matchShow.length === 0 ||
          (!!matchLiveIdRef.current && matchShow.length > 0)) &&
          filteredMatches.length > 0) ||
        isLiveMatchRefetching
      ) {
        filteredMatches.forEach((match) => {
          const tournamentId = match?.uniqueTournament?.id as string;

          if (!allMatchesByTournament[tournamentId]) {
            allMatchesByTournament[tournamentId] = [];
          }
          allMatchesByTournament[tournamentId].push(match);

          const isTournamentFollowed = tournamentFollowed.some(
            (follow) => follow?.id === tournamentId
          );

          const isMatchFollowed = matchFollowed.some(
            (follow: any) => follow.matchId === match?.id
          );

          if (isTournamentFollowed || isMatchFollowed) {
            tournamentFollowedLengthRef.current = tournamentFollowed.length;
            if (!followedMatchesByTournament[tournamentId]) {
              followedMatchesByTournament[tournamentId] = [];
            }

            followedMatchesByTournament[tournamentId].push(match);

            allMatchesByTournament[tournamentId] = allMatchesByTournament[
              tournamentId
            ].filter((m) => m?.id !== match?.id);
          }
        });

        if (Object.values(followedMatchesByTournament).length > 0) {
          Object.entries(followedMatchesByTournament).forEach(
            ([tournamentId, matches]) => {
              sortedMatchesToShow.push({
                uniqueTournament: matches[0]?.uniqueTournament,
                matches,
              });
            }
          );
        }

        if (Object.values(allMatchesByTournament).length > 0) {
          Object.values(allMatchesByTournament).forEach((matches) => {
            if (matches.length > 0) {
              sortedMatchesToShow.push({
                uniqueTournament: matches[0]?.uniqueTournament,
                matches,
              });
            }
          });
        }
        const isMatchesEqual = areMatchesEqual(matchShow, sortedMatchesToShow);

        if (!isMatchesEqual) {
          setMatchShow(sortedMatchesToShow);
        }
        matchLiveIdRef.current = false;

        if (isLoading) {
          setIsLoading(false);
        }
      }
    }
  }, [
    matchTypeFilter,
    dateFilter,
    matchFollowed,
    matchesLive,
    matches,
    isLoading,
    tournamentFollowed,
    matchTypeFilterMobile,
    i18n.language,
    matchShow,
    matchLiveIdRef.current,
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    const fieldsToCompare = ['scores', 'serve', 'status'];
    if (!matches || !matchLiveSocket) return;

    const { metadata } = matchLiveSocket;

    if (
      Array.isArray(metadata) &&
      metadata.length > 0 &&
      !matchLiveIdRef.current
    ) {
      const isMatchingData = metadata.some(
        (meta) => matchesLive[meta.id] || matches[meta.id]
      );
      if (!isMatchingData) return;

      metadata.forEach((meta) => {
        updateMatchesBySocket(
          meta,
          matches,
          matchesLive,
          fieldsToCompare,
          setMatches,
          setMatchesLive,
          matchLiveIdRef,
          isDetail
        );
      });
    }
  }, [matchLiveSocket]);

  useEffect(() => {
    if (
      !isSameDay(new Date(), dateFilter) &&
      ['live'].includes(matchTypeFilter) &&
      matchShow.length === 0 &&
      isLoading
    ) {
      setIsLoading(false);
    }
  }, [matchShow, dateFilter, matchTypeFilter, isLoading]);

  useEffect(() => {
    if (
      (matchShow.length > 0 ||
        (Object.values(matchesLive).length === 0 &&
          Object.values(matches).length === 0)) &&
      isLoading
    ) {
      setIsLoading(false);
    }
  }, [matchShow, matchesLive, isLoading, matchTypeFilter]);

  if (isLoading && !isDetail) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  if (
    ((!isLoading && matchShow.length === 0) || matches.length === 0) &&
    matchShow.length === 0 &&
    !isDetail
  ) {
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
    <div className={`p-2 md:px-2.5 ${isDetail && '!px-0'}`}>
      <div className='h-full space-y-1' test-id='match-list-am-football'>
        {(matchShow as TournamentGroup[]).map((group, idx) => (
          <div className='space-y-2 relative' key={`group-${idx}`} test-id='league'>
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && (
                    <LeagueRowAMFootball match={match} isLink />
                  )}
                  <MatchRowIsolatedAMFootball
                    key={match?.id}
                    isDetail={isDetail}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    homeSound={homeSound}
                    onClick={handleClick}
                    sport={sport}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
