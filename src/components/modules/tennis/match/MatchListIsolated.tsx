import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { EmptyEvent } from '@/components/common/empty';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';

import {
  useFilterStore,
  useFollowStore,
  useMatchStore,
  useSettingsStore,
} from '@/stores';

import { TwSectionWrapper } from '@/components/modules/common';
import { LeagueRow, MatchRowIsolated } from '@/components/modules/tennis';
import { TwMatchListContainer } from '@/components/modules/tennis/columns/MainColumnComponents';
import { SPORT } from '@/constant/common';
import {
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { useLocale } from '@/hooks/useLocale';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { filterMatchesTennis } from '@/utils';
import clsx from 'clsx';
import { isSameDay } from 'date-fns';
import { useRouter } from 'next/router';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};
export interface TournamentGroup {
  tournament: any;
  matches: SportEventDtoWithStat[];
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  page = 'live-score',
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
  const { resolvedTheme } = useTheme();
  const { currentLocale } = useLocale(i18n.language);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();

  const { homeSound } = useSettingsStore();
  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.tennis
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
    setMatchDetails(match);
    if (width < 1024 || isDetail) {
      router.push(
        `${currentLocale}/${SPORT.TENNIS}/match/${match?.slug}/${match.id}`
      );
    } else {
      const isCurrentMatchSelected = `${match.id}` === `${selectedMatch}`;
      if (!isCurrentMatchSelected) {
        setShowSelectedMatch(true);
        setSelectedMatch(`${match.id}`);
      }
    }
  };

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

      const filteredMatches: SportEventDtoWithStat[] = filterMatchesTennis(
        Object.values(matchesShow),
        page,
        matchTypeFilter,
        dateFilter,
        matchTypeFilterMobile,
      );


      if (filteredMatches.length === 0 && isLoading) {
        setIsLoading(false);
        setMatchShow([]);
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
            tournamentFollowedLengthRef.current = tournamentFollowed.length
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
                tournament: matches[0]?.tournament,
                matches,
              });
            }
          );
        }

        if (Object.keys(allMatchesByTournament).length > 0) {
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
    const fieldsToCompare = ['scores', 'serve', 'status'];
    if (!matches || !matchLiveSocket) return;

    const { metadata } = matchLiveSocket;

    if (
      Array.isArray(metadata) &&
      metadata.length > 0 &&
      !matchLiveIdRef.current
    ) {
      const isMatchingData = metadata.some(
        (meta) => matchesLive[meta.id] && matches[meta.id]
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
      matchLiveIdRef.current = true;
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
      <div className='h-full space-y-1.5 mt-2' test-id='match-list'>
        {(matchShow as TournamentGroup[]).map((group, idx) => (
          <div className='space-y-1.5 relative' key={`group-${idx}`} test-id='match-row'>
            {group.matches.map((match, matchIdx) => {
              return (
                <React.Fragment key={`match-${match?.id}-${matchIdx}`}>
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
                    handleClick={handleClick}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    homeSound={homeSound}
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
