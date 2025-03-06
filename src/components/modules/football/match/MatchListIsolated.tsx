import { LeagueRow } from '@/components/modules/football/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/football/match/MatchRowIsolated';
import useTrans from '@/hooks/useTrans';
import { useTheme } from 'next-themes';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

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
import { PAGE } from '@/constant/common';
import {
  MatchOdd,
  MatchState,
  MatchStateId,
  matchStateIdToMatchState,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import {
  hotLeaguesFootball,
  ILanguageKey,
} from '@/constant/leagues/hotLeaguesFootball';
import { useWindowSize } from '@/hooks';
import { useFilterMatches } from '@/hooks/useFootball/useFilterMatches';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { compareFields } from '@/utils';
import { areMatchesEqual } from '@/utils/compareArrays';
import { convertStatusCode } from '@/utils/convertInterface';
import clsx from 'clsx';
import { isSameDay } from 'date-fns';
import { produce } from 'immer';
import { isEqual } from 'lodash';
import { useRouter as useRouterNav } from 'next/navigation';

export type MatchStateIdToMatchState = {
  [key in MatchStateId]: MatchState;
};

// const initialDisplayCount = 30;
export interface TournamentGroup {
  tournament: any; // <Consider> defining a more specific type
  matches: SportEventDtoWithStat[]; // Consider defining a more specific type
}

export interface UniqueTournamentGroup {
  uniqueTournament: TournamentDto;
  matches: SportEventDtoWithStat[];
}

export const MatchListIsolated: React.FC<MatchListIsolatedProps> = ({
  sport = 'football',
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching,
}) => {
  const i18n = useTrans();
  const router = useRouterNav();
  const { width } = useWindowSize();
  const matchLiveIdRef = useRef<boolean | null>(null);
  const tournamentFollowedLengthRef = useRef<number>(0);
  const {
    selectedMatch,
    showSelectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    matchDetails,
    setMatchDetails,
  } = useMatchStore();

  const { resolvedTheme } = useTheme();
  const [matchShow, setMatchShow] = useState<TournamentGroup[]>([]);
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const { matchesOdds } = useHomeStore();

  const matchFollowed = useFollowStore((state) => state.followed.match);

  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();

  const isEmptyMatch = useMemo(() => matchShow.length === 0, [matchShow]);

  const tournamentFollowed = useFollowStore(
    (state) => state?.followed?.tournament?.football
  );

  // const tournamentFollowedChanges = useCallback(
  //   (filteredMatches: Record<string, any>) => {
  //     const isTournamentFollowed = tournamentFollowed.some((follow, index) => {
  //       return follow?.id === filteredMatches[index]?.tournament?.id;
  //     });
  //     return (
  //       tournamentFollowedLengthRef.current !== tournamentFollowed.length &&
  //       isTournamentFollowed
  //     );
  //   },
  //   [tournamentFollowed]
  // );

  const { filteredMatches, setIsLoading, isLoading } = useFilterMatches({
    page,
    matchTypeFilterMobile,
    matchTypeFilter,
    matches,
    matchesLive,
    dateFilter,
  });

  const handleClick = (match: SportEventDtoWithStat) => {
    if (isDetail || width < 1024) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    } else {
      setShowSelectedMatch(true);
      setMatchDetails(match);
      setSelectedMatch(match?.id?.toString());
    }
  };

  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const sortedMatchesToShow: TournamentGroup[] = [];
      const countryLocal = i18n.language ?? '';
      const competitionCountryHot =
        hotLeaguesFootball[countryLocal as ILanguageKey] ?? [];
      const competitionCountry = Object.values(competitionCountryHot).map((league:any) => league?.id) ?? [];


      if (filteredMatches.length === 0 && isLoading) {
        setMatchShow([]);
        setIsLoading(false);
        return;
      }

      const optimizedMatches = produce(
        (draft: {
          allMatchesByTournament: Record<string, SportEventDtoWithStat[]>;
          followedMatchesByTournament: Record<string, SportEventDtoWithStat[]>;
          theLeagueNearCountry: Record<string, SportEventDtoWithStat[]>;
        }) => {
          filteredMatches.forEach((match) => {
            const tournamentId = match.tournament?.id;

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
              tournamentFollowedLengthRef.current = tournamentFollowed.length;
              if (!draft.followedMatchesByTournament[tournamentId]) {
                draft.followedMatchesByTournament[tournamentId] = [];
              }

              draft.followedMatchesByTournament[tournamentId].push(match);

              draft.allMatchesByTournament[tournamentId] =
                draft.allMatchesByTournament[tournamentId].filter(
                  (m) => m?.id !== match?.id
                );
            }

            if (countryLocal) {
              const isHotLeague = competitionCountry.includes(tournamentId)
              if (isHotLeague) {
                if (!draft.theLeagueNearCountry[tournamentId]) {
                  draft.theLeagueNearCountry[tournamentId] = [];
                }
                draft.theLeagueNearCountry[tournamentId].push(match);
                draft.allMatchesByTournament[tournamentId] =
                  draft.allMatchesByTournament[tournamentId].filter(
                    (m) => m?.id !== match?.id
                  );
                if (!draft.followedMatchesByTournament[tournamentId]) {
                  draft.followedMatchesByTournament[tournamentId] = [];
                }
                draft.followedMatchesByTournament[tournamentId] =
                  draft.followedMatchesByTournament[tournamentId].filter(
                    (m) => m?.id !== match?.id
                  );
              }
            }
          });
        },
        {
          allMatchesByTournament: {} as Record<string, SportEventDtoWithStat[]>,
          followedMatchesByTournament: {} as Record<
            string,
            SportEventDtoWithStat[]
          >,
          theLeagueNearCountry: {} as Record<string, SportEventDtoWithStat[]>,
        }
      );

      const {
        allMatchesByTournament,
        followedMatchesByTournament,
        theLeagueNearCountry,
      } = optimizedMatches();

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

      if (Object.values(theLeagueNearCountry).length > 0) {
        Object.entries(theLeagueNearCountry).forEach(
          ([tournamentId, matches]) => {
            if (matches.length > 0) {
              sortedMatchesToShow.push({
                tournament: matches[0]?.tournament,
                matches,
              });
            }
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

      sortedMatchesToShow.sort((a, b) => {
        const indexA = competitionCountry.indexOf(a.tournament?.id);
        const indexB = competitionCountry.indexOf(b.tournament?.id);
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      });
      const isMatchesEqual = areMatchesEqual(matchShow, sortedMatchesToShow);
      if (!isMatchesEqual) {
        // update details when list matches change

        setMatchShow(sortedMatchesToShow);
      } else {
        sortedMatchesToShow.forEach((group, groupIdx) => {
          const oldGroup = matchShow[groupIdx];

          group.matches.forEach((newMatch, matchIdx) => {
            const oldMatch = oldGroup.matches[matchIdx];
            if (!oldMatch) return;

            // Compare relevant fields that should trigger a re-render
            const isMatchDifferent = !isEqual(
              {
                homeScore: newMatch.homeScore,
                awayScore: newMatch.awayScore,
                homeCornerKicks: newMatch.homeCornerKicks,
                awayCornerKicks: newMatch.awayCornerKicks,
                status: newMatch.status,
                time: newMatch.time,
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
              setMatchShow(sortedMatchesToShow);
            }
          });
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
    matchFollowed,
    matchesLive,
    matches,
    isLoading,
    tournamentFollowed,
    matchTypeFilterMobile,
    i18n.language,
    filteredMatches,
    matchShow,
    matchLiveIdRef.current,
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    if (filteredMatches.length === 0 && matchShow.length > 0) {
      setMatchShow([]);
      return;
    }
  }, [filteredMatches, matchShow]);

  useEffect(() => {
    setIsLoading(true);
    setMatchShow([]);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

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

    let currentMatch = isDetail
      ? matchesLive[sport_event_id]
      : matches[sport_event_id] || matchesLive[sport_event_id];

    if (!currentMatch) return;

    const updatedMatch = {
      ...currentMatch,
      homeScore: {
        ...currentMatch.homeScore,
        display: home_score?.regular_score,
      },
      homeCornerKicks: home_score?.corners || currentMatch?.homeCornerKicks,
      awayScore: {
        ...currentMatch.awayScore,
        display: away_score?.regular_score,
      },
      awayCornerKicks: away_score?.corners || currentMatch?.awayCornerKicks,
      status: {
        ...currentMatch.status,
        ...convertStatusCode(
          matchStateIdToMatchState[status_id as keyof MatchStateIdToMatchState]
        ),
      },
      time: {
        currentPeriodStartTimestamp:
          kick_of_timestamp >= 0
            ? kick_of_timestamp
            : currentMatch?.time?.currentPeriodStartTimestamp,
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
      const updatedMatchesClean =
        updatedMatches &&
        Object.fromEntries(
          Object.entries(updatedMatches).filter(([_key, value]) => {
            return value !== null && typeof value === 'object' && 'id' in value;
          })
        );
      const updatedMatchesLiveClean =
        updatedMatchesLive &&
        Object.fromEntries(
          Object.entries(updatedMatchesLive).filter(([_key, value]) => {
            return value !== null && typeof value === 'object' && 'id' in value;
          })
        );

      setMatches(updatedMatchesClean);
      setMatchesLive(updatedMatchesLiveClean);
      if (matchDetails?.id === sport_event_id) {
        setMatchDetails(updatedMatch);
      }
      matchLiveIdRef.current = true;
      //Todo : Add animation for live match
      // if (
      //   changedFields.includes('homeScore') ||
      //   changedFields.includes('awayScore')
      // ) {
      //   const element = document.getElementById(sport_event_id);
      //   if (element) {
      //     element.classList.add('animate-flicker');
      //   }
      //   setTimeout(() => {
      //     if (element) {
      //       element.classList.remove('animate-flicker');
      //     }
      //   }, 4000);
      // }
    }
  }, [matchLiveSocket, isDetail]);

  useEffect(() => {
    if (isDetail) {
      setMatchFilter('live');
    }
  }, [isDetail]);

  if (isLoading && !isDetail) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  if (isDetail && matchShow.length === 0 && !isLoading) {
    return null;
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
    <div
      className={clsx('p-2 py-0 md:px-2.5 ', {
        '!p-0': isEmptyMatch,
        '!px-0': isDetail,
      })}
    >
      <div
        className='mt-2 h-full space-y-1.5 '
        test-id={`match-list-${matchTypeFilter}`}
      >
        {(matchShow as TournamentGroup[]).map((group, idx) => (
          <div
            className='space-y-1.5 relative'
            key={`group-${idx}`}
            test-id={`match-league-${group.tournament?.id}`}
          >
            {group.matches.map((match, matchIdx) => {
              const matchId = match?.id;
              const matchOdds: MatchOdd = matchesOdds[matchId];

              return (
                <React.Fragment key={`match-key-${match?.id}`}>
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
                    isDetail={isDetail}
                    match={match}
                    i18n={i18n}
                    theme={resolvedTheme}
                    showYellowCard={showYellowCard}
                    showRedCard={showRedCard}
                    homeSound={homeSound}
                    matchOdds={matchOdds}
                    selectedMatch={selectedMatch}
                    showSelectedMatch={showSelectedMatch}
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
    </div>
  );
};
