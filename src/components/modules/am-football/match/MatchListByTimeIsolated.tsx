import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { MatchStateIdToMatchState } from '@/components/modules/football/match/MatchListIsolated';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  matchStateIdToMatchState,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { getDateFromTimestamp } from '@/utils';
import { convertStatusCode } from '@/utils/convertInterface';

import { EmptyEvent } from '@/components/common/empty';
import { MatchRowByTimeIsolated } from '@/components/modules/am-football/match';
import { TwSectionWrapper } from '@/components/modules/common';
import { PAGE, SPORT } from '@/constant/common';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import {
  filterMatchesAMFootball,
  formatMatchTimestampAMFootball,
} from '@/utils/americanFootballUtils';
import vi from '~/lang/vi';

export const MatchListByTimeIsolated = ({
  sport = SPORT.BASKETBALL,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching,
}: MatchListIsolatedProps) => {
  const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const matchLiveIdRef = useRef<boolean | null>(null);
  const { resolvedTheme } = useTheme();
  const { matchTypeFilter } = useFilterStore();
  const { matchesOdds } = useHomeStore();
  const { dateFilter, matchTypeFilterMobile } = useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();

  const isShowTime = true;
  const i18n = useTrans();

  useEffect(() => {
    if (
      Object.values(matches).length > 0 ||
      Object.values(matchesLive).length > 0
    ) {
      const matchShow = matchTypeFilter === 'live' ? matchesLive : matches;
      const filteredMatches: SportEventDtoWithStat[] = filterMatchesAMFootball(
        Object.values(matchShow),
        page,
        matchTypeFilter,
        dateFilter,
        matchTypeFilterMobile
      );

      if (filteredMatches.length === 0 && isLoading) {
        setMatchesShow([]);
        setIsLoading(false);
        return;
      }

      if (
        (filteredMatches.length > 0 &&
          (matchesShow.length === 0 ||
            (!!matchLiveIdRef.current && matchesShow.length > 0))) ||
        isLiveMatchRefetching
      ) {
        const followedMatches = filteredMatches.filter((match) =>
          matchFollowed.some(
            (follow: { matchId: string }) => follow?.matchId === match?.id
          )
        );

        const nonFollowedMatches = filteredMatches.filter((match) => {
          const [time] = formatMatchTimestampAMFootball(
            match.startTimestamp,
            match.status.code
          );
          const isNaNTime = time === '0';
          return (
            !matchFollowed.some(
              (follow: { matchId: string }) => follow?.matchId === match?.id
            ) && !isNaNTime
          );
        });

        if (
          matchTypeFilter === 'finished' ||
          matchTypeFilter === 'results' ||
          page === 'results'
        ) {
          followedMatches.sort((a, b) => b.startTimestamp - a.startTimestamp);
          nonFollowedMatches.sort(
            (a, b) => b.startTimestamp - a.startTimestamp
          );
        } else {
          followedMatches.sort((a, b) => a.startTimestamp - b.startTimestamp);
          nonFollowedMatches.sort(
            (a, b) => a.startTimestamp - b.startTimestamp
          );
        }
        setMatchesShow([...followedMatches, ...nonFollowedMatches]);
        matchLiveIdRef.current = false;
      }
      setIsLoading(false);
    }
  }, [
    matchTypeFilter,
    dateFilter,
    matchFollowed,
    matchesLive,
    matches,
    isLoading,
    matchTypeFilterMobile,
    i18n.language,
    matchesShow,
    matchLiveIdRef.current,
    isLiveMatchRefetching,
  ]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setMatchesShow([]);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

  // Used for socket to update information of the matches
  useEffect(() => {
    if (matches && matchLiveSocket) {
      const { metadata, payload } = matchLiveSocket;
      const { sport_event_id } = metadata || {};
      const { sport_event_status } = payload || {};
      const { away_score, home_score, status_id, kick_of_timestamp } =
        sport_event_status || {};
      if (matches[sport_event_id] || matchesLive[sport_event_id]) {
        const updatedMatch = {
          ...matches[sport_event_id],
          homeScore: {
            ...(matches[sport_event_id] && matches[sport_event_id].homeScore),
            display: home_score?.regular_score,
          },
          homeCornerKicks: home_score?.corners,
          awayScore: {
            ...(matches[sport_event_id] && matches[sport_event_id].awayScore),
            display: away_score?.regular_score,
          },
          awayCornerKicks: away_score?.corners,
          status: convertStatusCode(
            matchStateIdToMatchState[
              status_id as keyof MatchStateIdToMatchState
            ]
          ),
          time: {
            currentPeriodStartTimestamp: kick_of_timestamp,
          },
        };

        const updatedMatches = {
          ...matches,
          [sport_event_id]: updatedMatch,
        };
        const updatedMatchesLive = matchesLive[sport_event_id]
          ? {
              ...matchesLive,
              [sport_event_id]: updatedMatch,
            }
          : { ...matchesLive };

        setMatches(Object.values(updatedMatches));
        setMatchesLive(Object.values(updatedMatchesLive));
        setIsLoading(false);
      }
    }
  }, [matchLiveSocket]);

  useEffect(() => {
    if (!isSameDay(new Date(), dateFilter) && ['live'].includes(matchTypeFilter) && matchesShow.length === 0 && isLoading) {
      setIsLoading(false);
    }
  }, [matchesShow, dateFilter, matchTypeFilter, isLoading]);

  useEffect(() => {
    if ((matchesShow.length > 0 || ((['live'].includes(matchTypeFilter) || matchesShow.length === 0) && Object.values(matchesLive).length === 0 && Object.values(matches).length === 0)) && isLoading) {
      setIsLoading(false);
    }
  }, [matchesShow, matchesLive, isLoading, matchTypeFilter]);

  if (isLoading) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
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
    <div className='p-2 md:px-2.5'>
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
                return (
                  <div key={match?.id || idx}>
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
                      showTime={isShowTime}
                      page={page}
                      sport={sport}
                    />
                  </div>
                );
              } else {
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
                return (
                  <div key={match?.id}>
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
                    />
                  </div>
                );
              }
            }
          )}
        </div>
      </div>
    </div>
  );
};
