import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';

import { useFilterStore, useMatchStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { TwSectionWrapper } from '@/components/modules/common';
import { LeagueRow as HockeyLeagueRow } from '@/components/modules/hockey/columns';
import { MatchRowIsolated as HockeyMatchRowIsolated } from '@/components/modules/hockey/match';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';

import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { filterMatchesHockey } from '@/utils';
import { useRouter } from 'next/router';
import { UniqueTournamentGroup } from '@/components/modules/football/match';
import { TwMatchListContainer } from '@/components/modules/football';
import clsx from 'clsx';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  tournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = SPORT.ICE_HOCKEY,
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
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();

  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<UniqueTournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { homeSound } = useSettingsStore();
  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.hockey || []
  );

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }

    // Handle navigation after state updates
    if (width < 1024 || isDetail) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  };
  //useMqttClient(SPORT.BASKETBALL);
  //1ztvu6l01xn3v9p
  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const matchesShow = matchTypeFilter === 'live' ? matchesLive : matches;

      const sortedMatchesToShow: UniqueTournamentGroup[] = [];
      const followedMatchesByTournament: Record<
        string,
        SportEventDtoWithStat[]
      > = {};
      const allMatchesByTournament: Record<string, SportEventDtoWithStat[]> =
        {};

      const filteredMatches: SportEventDtoWithStat[] = filterMatchesHockey(
        Object.values(matchesShow),
        page,
        matchTypeFilter,
        dateFilter,
        matchTypeFilterMobile
      );

      if (filteredMatches.length === 0 && isLoading) {
        setMatchShow([]);
        setIsLoading(false);
        return;
      }

      const isTournamentFollowed = tournamentFollowed.some((follow, index) => {
        return follow?.id === filteredMatches[index]?.tournament?.id;
      });

      if (
        ((isTournamentFollowed ||
          matchShow.length === 0 ||
          (!!matchLiveIdRef.current && matchShow.length > 0)) &&
          filteredMatches.length > 0) ||
        isLiveMatchRefetching
      ) {
        filteredMatches.forEach((match) => {
          const tournamentId =
            match.uniqueTournament?.id || match?.tournament?.id;

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
              if (matches[0]?.uniqueTournament) {
                sortedMatchesToShow.push({
                  uniqueTournament: matches[0].uniqueTournament,
                  matches,
                });
              }
            }
          );
        }

        if (Object.values(allMatchesByTournament).length > 0) {
          Object.values(allMatchesByTournament).forEach((matches) => {
            if (matches.length > 0 && matches[0]?.uniqueTournament) {
              sortedMatchesToShow.push({
                uniqueTournament: matches[0].uniqueTournament,
                matches,
              });
            }
          });
        }

        setMatchShow(sortedMatchesToShow);
        setIsLoading(false);
        matchLiveIdRef.current = false;
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
    page,
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setMatchShow([]);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

  useEffect(() => {
    const fieldsToCompare = ['scores', 'timer', 'status'];
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
    if (isDetail) {
      setMatchFilter('live');
    }
  }, []);

  useEffect(() => {
    const hasMatchesToShow = matchShow.length > 0;
    const isLiveFilterActive = matchTypeFilter === 'live';
    const noLiveMatches = Object.values(matchesLive).length === 0;
    const noMatches = Object.values(matches).length === 0;

    if (
      (hasMatchesToShow ||
        (isLiveFilterActive && noLiveMatches && noMatches)) &&
      isLoading
    ) {
      setIsLoading(false);
    }
  }, [matchShow, matchesLive, matches, isLoading, matchTypeFilter]);

  if (isLoading) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  if (!isLoading && matchShow.length === 0 && !isDetail) {
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
    <TwMatchListContainer
      className={clsx({ '!p-0': matchShow.length === 0, '!px-0': isDetail })}
    >
      {' '}
      <div className='mt-2 h-full space-y-1.5' test-id='match-list-hockey'>
        {(matchShow as UniqueTournamentGroup[]).map((group, idx) => (
          <div className='space-y-1.5 relative' key={`group-${idx}`} test-id='league'>
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && <HockeyLeagueRow match={match} isLink />}
                  <HockeyMatchRowIsolated
                    key={match?.id}
                    isDetail={isDetail}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    homeSound={homeSound}
                    onClick={handleClick}
                    isSimulator={
                      page === 'live-score' &&
                      (matchTypeFilter === 'live' ||
                        matchTypeFilter === 'all') &&
                      sport === SPORT.ICE_HOCKEY
                    }
                    sport={sport}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </TwMatchListContainer>
  );
};
