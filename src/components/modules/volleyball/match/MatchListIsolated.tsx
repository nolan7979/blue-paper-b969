import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import {
  LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/volleyball/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/volleyball/match/MatchRowIsolated';

import {
  useFilterStore,
  useMatchStore,
  useSettingsStore,
  useVolleyStore,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { filterVolleyballMatches } from '@/utils';
import { useRouter } from 'next/router';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { TwSectionWrapper } from '@/components/modules/common/tw-components';
import { isSameDay } from 'date-fns';
import { areMatchesEqual } from '@/utils/compareArrays';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  uniqueTournament?: TournamentDto;
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  page = 'live-score',
  sport = SPORT.VOLLEYBALL,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching = false,
}) => {
  const i18n = useTrans();
  const matchLiveIdRef = useRef<boolean | null>(null);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { width } = useWindowSize();

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

  const { homeSound } = useSettingsStore();

  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.football
  );

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }
    if (width < 1024 || isDetail) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  };

  //1ztvu6l01xn3v9p
  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const matchesShow = matchTypeFilter === 'live' ? matchesLive : matches;

      const sortedMatchesToShow: TournamentGroup[] = [];
      const followedMatchesByTournament: Record<
        string,
        SportEventDtoWithStat[]
      > = {};
      const allMatchesByTournament: Record<string, SportEventDtoWithStat[]> =
        {};
      const allMatchesNotTournament: SportEventDtoWithStat[] = [];

      const filteredMatches: SportEventDtoWithStat[] = filterVolleyballMatches(
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

            const isMatchFollowed = matchFollowed.some(
              (follow: any) => follow.matchId === match?.id
            );

            if (isMatchFollowed) {
              if (!followedMatchesByTournament[tournamentId]) {
                followedMatchesByTournament[tournamentId] = [];
              }

              followedMatchesByTournament[tournamentId].push(match);

              allMatchesByTournament[tournamentId] = allMatchesByTournament[
                tournamentId
              ].filter((m) => m?.id !== match?.id);
            }
          } else {
            allMatchesNotTournament.push(match);
          }
        });

        if (allMatchesNotTournament.length > 0) {
          sortedMatchesToShow.push({
            uniqueTournament: {
              id: '',
              priority: 1000,
            },
            matches: allMatchesNotTournament,
          });
        }

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
        if (isLoading) {
          setIsLoading(false);
        }
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

  // Used for socket to update information of the matches

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
    if (isDetail) {
      setMatchFilter('live');
    }
  }, [isDetail]);

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
