import {
  LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/cricket/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/cricket/match/MatchRowIsolated';
import useTrans from '@/hooks/useTrans';
import React, { useEffect, useRef, useState } from 'react';

import {
  useFilterStore,
  useHomeStore,
  useMatchStore,
  useSettingsStore,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { useFilterMatches } from '@/hooks/useCricket';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import clsx from 'clsx';
import { produce } from 'immer';
import { useRouter as useRouterNav } from 'next/navigation';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  tournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}
interface MatchListIsolatedProps {
  page?: (typeof PAGE)[keyof typeof PAGE];
  sport: string;
  isDetail?: boolean;
  matches?: any;
  matchesLive?: any;
  setMatches?: (matches: any) => void;
  setMatchesLive?: (matches: any) => void;
  matchLiveSocket?: Record<string, any> | null;
  isLiveMatchRefetching?: boolean;
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = SPORT.CRICKET,
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
  const router = useRouterNav();
  const { width } = useWindowSize();
  const matchLiveIdRef = useRef<boolean | null>(null);
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
    matchDetails,
  } = useMatchStore();

  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const { matchesOdds } = useHomeStore();

  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { homeSound } = useSettingsStore();

  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.football
  );

  const { filteredMatches, setIsLoading, isLoading } = useFilterMatches({
    page,
    matchTypeFilterMobile,
    matchTypeFilter,
    matches,
    matchesLive,
    dateFilter,
  });

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
      // setShowSelectedMatch2nd(true);
      // setSelectedMatch2nd(`${match.id}`);
    }
    if (width < 1024 || isDetail) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  };

  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const sortedMatchesToShow: TournamentGroup[] = [];

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
        const optimizedMatches = produce(
          (draft: {
            allMatchesByTournament: Record<string, SportEventDtoWithStat[]>;
            followedMatchesByTournament: Record<
              string,
              SportEventDtoWithStat[]
            >;
          }) => {
            filteredMatches.forEach((match) => {
              const tournamentId = match.uniqueTournament?.id || '';

              if (!draft.allMatchesByTournament[tournamentId]) {
                draft.allMatchesByTournament[tournamentId] = [];
              }
              draft.allMatchesByTournament[tournamentId].push(match);

              const isTournamentFollowed = tournamentFollowed.some(
                (follow) => follow?.id === tournamentId
              );

              const isMatchFollowed = matchFollowed.some(
                (follow: any) => follow.matchId === match?.id
              );

              if (isTournamentFollowed || isMatchFollowed) {
                if (!draft.followedMatchesByTournament[tournamentId]) {
                  draft.followedMatchesByTournament[tournamentId] = [];
                }

                draft.followedMatchesByTournament[tournamentId].push(match);

                draft.allMatchesByTournament[tournamentId] =
                  draft.allMatchesByTournament[tournamentId].filter(
                    (m) => m?.id !== match?.id
                  );
              }
            });
          },
          {
            allMatchesByTournament: {} as Record<
              string,
              SportEventDtoWithStat[]
            >,
            followedMatchesByTournament: {} as Record<
              string,
              SportEventDtoWithStat[]
            >,
          }
        );

        const { allMatchesByTournament, followedMatchesByTournament } =
          optimizedMatches();

        if (Object.values(followedMatchesByTournament).length > 0) {
          Object.entries(followedMatchesByTournament).forEach(
            ([tournamentId, matches]) => {
              sortedMatchesToShow.push({
                tournament: matches[0]?.uniqueTournament,
                matches,
              });
            }
          );
        }

        if (Object.values(allMatchesByTournament).length > 0) {
          Object.values(allMatchesByTournament).forEach((matches) => {
            if (matches.length > 0) {
              sortedMatchesToShow.push({
                tournament: matches[0]?.uniqueTournament,
                matches,
              });
            }
          });
        }

        setMatchShow(sortedMatchesToShow);
        matchLiveIdRef.current = null;
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
    filteredMatches,
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    if (filteredMatches.length === 0 && matchShow.length > 0) {
      setMatchShow([]);
      return;
    }
  }, [filteredMatches, matchShow]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setMatchShow([]);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

  useEffect(() => {
    const fieldsToCompare = ['scores', 'status', 'serve', 'extraScores'];
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
          isDetail,
          setMatchDetails,
          matchDetails
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
    if (
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
    return <MatchSkeletonMapping />;
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
      <div className='h-full space-y-1' test-id='match-list-cricket'>
        {(matchShow as TournamentGroup[]).map((group, idx) => (
          <div
            className='space-y-2 relative'
            key={`group-${idx}`}
            test-id='match-league'
          >
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && (
                    <LeagueRow
                      match={match}
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
                    homeSound={homeSound}
                    onClick={handleClick}
                    isSimulator={
                      page === 'live-score' && matchTypeFilter !== 'finished'
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
