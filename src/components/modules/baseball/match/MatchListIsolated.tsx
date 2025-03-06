import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import {
  LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/baseball/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/baseball/match/MatchRowIsolated';

import { useFilterStore, useMatchStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { filterBaseballMatches } from '@/utils/baseballUtils';
import { useRouter } from 'next/navigation';
import { isEqual } from 'lodash';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  uniqueTournament?: TournamentDto;
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = SPORT.BASEBALL,
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
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { width } = useWindowSize();
  const matchLiveIdRef = useRef<boolean | null>(null);
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();

  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.football
  );

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

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }
    // Handle navigation after state updates
    if (width < 1024 || isDetail) {
      // window.location.href = `/${sport}/match/${match.slug}/${match.id}`;
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
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const matchesShow = matchTypeFilter === 'live' ? matchesLive : matches;
      matchesLive;
      const followedMatchesByTournament: Record<
        string,
        SportEventDtoWithStat[]
      > = {};
      const allMatchesByTournament: Record<string, SportEventDtoWithStat[]> =
        {};

      const filteredMatches: SportEventDtoWithStat[] = filterBaseballMatches(
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
          const tournamentId = match.uniqueTournament?.id;
          if (tournamentId) {
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
          }
        });

        const sortedMatchesToShow: TournamentGroup[] = [];

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
        matchLiveIdRef.current = false;
        if (!isMatchesEqual) {
          setMatchShow(sortedMatchesToShow);
        }
      }
    }

    if (isLoading) {
      setIsLoading(false);
    }
  }, [
    matchTypeFilter,
    dateFilter,
    matchFollowed,
    matchesLive,
    matchShow,
    matchTypeFilterMobile,
    matches,
    isLoading,
    tournamentFollowed,
    i18n.language,
    matchLiveIdRef.current,
    isLiveMatchRefetching,
  ]);

  // Used for socket to update information of the matches
  useEffect(() => {
    if (matches && matchLiveSocket) {
      const { metadata } = matchLiveSocket;
      let updatedMatchesLive = { ...matchesLive };
      let updatedMatches = { ...matches };
      if (Array.isArray(metadata) && metadata.length > 0) {
        const isMachingData = metadata.some((meta) => {
          return matchesLive[meta.id];
        });
        if (!isMachingData) return;

        metadata.forEach((meta) => {
          const { id } = meta;
          const match = matchesLive[id];
          const updatedMatch = {
            ...match,
            ...meta,
          };
          updatedMatchesLive = {
            ...matchesLive,
            [id]: updatedMatch,
          };
          updatedMatches = {
            ...matches,
            [id]: updatedMatch,
          };
        });
        matchLiveIdRef.current = true;
        setMatches(updatedMatches);
        setMatchesLive(updatedMatchesLive);
      }
      setIsLoading(false);
    }
  }, [matchLiveSocket]);

  useEffect(() => {
    if (isDetail) {
      setMatchFilter('live');
    }
  }, [isDetail]);

  useEffect(() => {
    if (
      (matchShow.length > 0 ||
        (['live'].includes(matchTypeFilter) &&
          Object.values(matchesLive).length === 0 &&
          Object.values(matches).length === 0)) &&
      isLoading
    ) {
      setIsLoading(false);
    }
  }, [matchShow, matchesLive, isLoading, matchTypeFilter]);

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
    <TwMatchListContainer className={`${isDetail && '!px-0'}`}>
      <div className='h-full space-y-1' test-id='match-list'>
        {matchShow.map((group, idx) => (
          <div className='space-y-2 relative' key={`group-${idx}`} test-id='match-row'>
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && (
                    <LeagueRow
                      match={match}
                      sport={sport}
                      isLink={
                        match && match.season_id && match.season_id.length > 0
                          ? true
                          : false
                      }
                    />
                  )}
                  <MatchRowIsolated
                    key={match?.id}
                    isDetail={isDetail}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    showYellowCard={showYellowCard}
                    showRedCard={showRedCard}
                    homeSound={homeSound}
                    onClick={handleClick}
                    sport={sport}
                    isSimulator={
                      page === 'live-score' &&
                      (matchTypeFilter === 'live' || matchTypeFilter === 'all')
                    }
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
