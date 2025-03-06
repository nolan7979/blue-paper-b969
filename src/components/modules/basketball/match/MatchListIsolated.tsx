import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';

import { useFilterStore, useMatchStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { LeagueRow as BkbLeagueRow } from '@/components/modules/basketball/columns';
import { MatchRowIsolated as BkbMatchRowIsolated } from '@/components/modules/basketball/match';
import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { compareFields, filterMatchesBasketball } from '@/utils';
import { useRouter } from 'next/router';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  tournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = SPORT.BASKETBALL,
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
  const tournamentFollowedLengthRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { homeSound } = useSettingsStore();
  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.football
  );

  const tournamentFollowedChanges = useCallback(
    (filteredMatches: Record<string, any>) => {
      const isTournamentFollowed = tournamentFollowed.some((follow, index) => {
        return follow?.id === filteredMatches[index]?.tournament?.id;
      });
      return (
        tournamentFollowedLengthRef.current !== tournamentFollowed.length &&
        isTournamentFollowed
      );
    },
    [tournamentFollowed]
  );

  const handleClick = (match: SportEventDtoWithStat) => {
    // Handle navigation after state updates
    if (width < 1024 || isDetail) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
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

      const sortedMatchesToShow: TournamentGroup[] = [];
      const followedMatchesByTournament: Record<
        string,
        SportEventDtoWithStat[]
      > = {};
      const allMatchesByTournament: Record<string, SportEventDtoWithStat[]> =
        {};

      const filteredMatches: SportEventDtoWithStat[] = filterMatchesBasketball(
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

      const isTournamentFollowed = tournamentFollowedChanges(filteredMatches);

      if (
        ((isTournamentFollowed ||
          matchShow.length === 0 ||
          (!!matchLiveIdRef.current && matchShow.length > 0)) &&
          filteredMatches.length > 0) ||
        isLiveMatchRefetching
      ) {
        filteredMatches.forEach((match) => {
          const tournamentId = match.tournament?.id;

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
                tournament: matches[0]?.tournament,
                matches,
              });
            }
          );
        }

        if (Object.values(allMatchesByTournament).length > 0) {
          Object.values(allMatchesByTournament).forEach((matches) => {
            if (matches.length > 0) {
              sortedMatchesToShow.push({
                tournament: matches[0]?.tournament,
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

  const fieldsToCompare = ['homeScore', 'awayScore', 'time', 'status'];

  // Used for socket to update information of the matches
  useEffect(() => {
    if (!matches || !matchLiveSocket) return;

    const { metadata } = matchLiveSocket;
    if (!Array.isArray(metadata) || metadata.length === 0) return;

    let updatedMatchesLive = { ...matchesLive };
    let updatedMatches = { ...matches };

    if (Array.isArray(metadata) && metadata.length > 0) {
      const isMatchingData = metadata.some(
        (meta) => matchesLive[meta.id] || matches[meta.id]
      );

      if (!isMatchingData) return;

      metadata.forEach((meta) => {
        const { id } = meta;
        const currentMatch = matchesLive[id] || matches[id];

        const updatedMatch = {
          ...currentMatch,
          homeScore: { ...currentMatch?.homeScore, ...meta.homeScore },
          awayScore: { ...currentMatch?.awayScore, ...meta.awayScore },
          time: { ...currentMatch?.time, ...meta.time },
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
              ...updatedMatchesLive[id],
              [field]: updatedMatch[field],
            };
            updatedMatches[id] = {
              ...updatedMatches[id],
              [field]: updatedMatch[field],
            };
          });
          matchLiveIdRef.current = true;
          setMatches(updatedMatches);
          setMatchesLive(updatedMatchesLive);
        }
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
    <div className={`p-2 md:px-2.5 ${isDetail && '!px-0'}`}>
      <div className='h-full space-y-1' test-id={`match-list-${matchTypeFilter}`}>
        {(matchShow as TournamentGroup[]).map((group, idx) => (
          <div className='space-y-1.5 relative' key={`group-${idx}`} test-id='league'>
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}`}>
                  {matchIdx === 0 && <BkbLeagueRow match={match} isLink />}
                  <BkbMatchRowIsolated
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
                      sport === SPORT.BASKETBALL
                    }
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
