import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import {
  // LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/football/columns/MainColumnComponents';

import { useFilterStore, useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { EmptyEvent } from '@/components/common/empty/EmptyEvent';
import LeagueRow from '@/components/modules/badminton/components/LeagueRow';
import { MatchRowIsolated } from '@/components/modules/badminton/match/MatchRowIsolated';
import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import {
  compareFields,
  filterMatchesBadminton,
  MatchBadmintonState,
} from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { UniqueTournamentGroup } from '@/components/modules/football/match';
import { isSameDay } from 'date-fns';
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
  sport = SPORT.BADMINTON,
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

  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
    matchDetails,
  } = useMatchStore();

  const matchLiveIdRef = useRef<boolean | null>(null);
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);

  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.uniqueTournament?.football
  );

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
    setIsLoading(true);
  }, [dateFilter, matchTypeFilter]);

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
      const filteredMatches: SportEventDtoWithStat[] = filterMatchesBadminton(
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

      const isTournamentFollowed = tournamentFollowed.some(
        (follow, index) =>
          follow?.id === filteredMatches[index]?.uniqueTournament?.id
      );

      if (
        ((isTournamentFollowed ||
          matchShow.length === 0 ||
          (!!matchLiveIdRef.current && matchShow.length > 0)) &&
          filteredMatches.length > 0) ||
        isLiveMatchRefetching
      ) {
        filteredMatches.forEach((match: any) => {
          const tournamentId = match.uniqueTournament?.id;

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

        if (Object.keys(followedMatchesByTournament).length > 0) {
          Object.entries(followedMatchesByTournament).forEach(
            ([tournamentId, matches]) => {
              sortedMatchesToShow.push({
                uniqueTournament: matches[0]?.uniqueTournament,
                matches,
              });
            }
          );
        }

        if (Object.keys(allMatchesByTournament).length > 0) {
          Object.values(allMatchesByTournament).forEach((matches) => {
            if (matches.length > 0) {
              sortedMatchesToShow.push({
                uniqueTournament: matches[0]?.uniqueTournament,
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
    const fieldsToCompare = ['scores', 'serve', 'status'];
    if (!matches || !matchLiveSocket) return;

    const { metadata } = matchLiveSocket;
    const { sport_event_id } = metadata || {};
    let updatedMatchesLive = { ...matchesLive };
    let updatedMatches = { ...matches };

    if (
      Array.isArray(metadata) &&
      metadata.length > 0 &&
      !matchLiveIdRef.current
    ) {
      const isMachingData = metadata.some((meta) => {
        return matchesLive[meta.id] || matches[meta.id];
      });
      if (!isMachingData) return;

      metadata.forEach((meta) => {
        const { id } = meta;
        // Todo: Check if the match is in the list of matches
        const currentMatch = matchesLive[id] && matches[id];
        if (!currentMatch) return;

        const updatedMatch = {
          ...currentMatch,
          scores: { ...currentMatch?.scores, ...meta.scores },
          serve: meta.serve,
          status: { ...currentMatch?.status, ...meta.status },
        };

        updatedMatchesLive = { ...matchesLive, [id]: updatedMatch };
        updatedMatches = { ...matches, [id]: updatedMatch };
        const changedFields = compareFields(
          currentMatch,
          updatedMatch,
          fieldsToCompare
        );

        if (changedFields.length > 0) {
          changedFields.forEach((field) => {
            updatedMatchesLive[id] = {
              ...matchesLive[id],
              [field]: updatedMatch[field],
            };
            updatedMatches[id] = {
              ...matches[id],
              [field]: updatedMatch[field],
            };
          });
          setMatches(Object.values(updatedMatches));
          setMatchesLive(Object.values(updatedMatchesLive));
          if (matchDetails?.id === sport_event_id) {
            setMatchDetails(updatedMatch);
          }
          matchLiveIdRef.current = true;
        }
      });
    }
  }, [matchLiveSocket]);

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
  }, []);

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
    if (isLiveMatchRefetching && matchDetails) {
      const getMatchDetail = matchesLive[matchDetails?.id];

      const isMatchDetailDifferent = !isEqual(
        {
          homeScore: getMatchDetail?.homeScore,
          awayScore: getMatchDetail?.awayScore,
          status: getMatchDetail?.status,
          currentPeriodStartTimestamp: getMatchDetail?.startTimestamp,
        },
        {
          homeScore: matchDetails?.homeScore,
          awayScore: matchDetails?.awayScore,
          status: matchDetails?.status,
          currentPeriodStartTimestamp: matchDetails?.startTimestamp,
        }
      );

      if (
        isMatchDetailDifferent &&
        getMatchDetail &&
        matchDetails?.status?.code !== MatchBadmintonState.ENDED
      ) {
        setMatchDetails(getMatchDetail);
      }
    }
  }, [isLiveMatchRefetching]);

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

  if (matchShow.length === 0 && !isDetail && !isLoading) {
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
      <div className='mt-2 h-full space-y-2' test-id='match-list-badminton'>
        {(matchShow as UniqueTournamentGroup[]).map((group, idx) => (
          <div
            className='relative space-y-2'
            key={`group-${idx}`}
            // ref={idx === matchesToShow.length - 1 ? lastElementRef : null}
            test-id='match-row'
          >
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && <LeagueRow match={match} />}
                  <MatchRowIsolated
                    key={match?.id}
                    isDetail={isDetail}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    onClick={handleClick}
                    isSimulator={
                      page === 'live-score' &&
                      (matchTypeFilter === 'live' || matchTypeFilter === 'all')
                    }
                    sport={sport}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ))}

        {/*
         {!!hasMore && (
          <div className='text-center'>
            <MatchSkeleton />
          </div>
        )} */}
      </div>
    </TwMatchListContainer>
  );
};
