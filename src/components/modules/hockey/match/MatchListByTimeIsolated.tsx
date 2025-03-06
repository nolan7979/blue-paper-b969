/* eslint-disable react-hooks/exhaustive-deps */
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import {
  filterMatchesHockey,
  formatMatchTimestamp,
  getDateFromTimestamp,
} from '@/utils';
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { MatchRowByTimeIsolated } from '@/components/modules/hockey/match';
import { PAGE, SPORT } from '@/constant/common';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import vi from '~/lang/vi';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { EmptyEvent } from '@/components/common/empty';
import { TwSectionWrapper } from '@/components/modules/common';

export const MatchListByTimeIsolated = ({
  sport = SPORT.ICE_HOCKEY,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => { },
  setMatchesLive = () => { },
  matchLiveSocket,
}: MatchListIsolatedProps) => {
  const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);
  const matchLiveIdRef = useRef<boolean | null>(null);
  const { resolvedTheme } = useTheme();
  const { matchTypeFilter } = useFilterStore();
  const { dateFilter, matchTypeFilterMobile } = useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);

  const isShowTime = true;
  const i18n = useTrans();

  // Process and filter matches
  useEffect(() => {
    // Return early if no matches data
    if (!Object.values(matches).length && !Object.values(matchesLive).length) {
      setMatchesShow([]);
      return;
    }

    // Get matches based on filter
    const matchSource = matchTypeFilter === 'live' ? matchesLive : matches;
    const filteredMatches = filterMatchesHockey(
      Object.values(matchSource),
      page,
      matchTypeFilter,
      dateFilter,
      matchTypeFilterMobile
    );

    // Handle empty filtered matches
    if (filteredMatches.length === 0 && shouldRefetch) {
      setMatchesShow([]);
      setShouldRefetch(false);
      return;
    }

    // Helper function to check if match is followed
    const isMatchFollowed = (match: SportEventDtoWithStat) =>
      matchFollowed.some((follow: { matchId: string; }) => follow.matchId === match.id);

    // Helper function to check if match time is valid
    const hasValidTime = (match: SportEventDtoWithStat) => {
      const [time] = formatMatchTimestamp(
        match.startTimestamp,
        match.status,
        true,
        match.time?.currentPeriodStartTimestamp
      );
      return time !== '0';
    };

    // Split matches into followed and non-followed
    const followedMatches = filteredMatches.filter(isMatchFollowed);
    const nonFollowedMatches = filteredMatches.filter(match =>
      !isMatchFollowed(match) && hasValidTime(match)
    );

    // Sort matches based on filter type
    const sortByTime = (a: SportEventDtoWithStat, b: SportEventDtoWithStat) => {
      const isDescending = matchTypeFilter === 'finished' ||
        matchTypeFilter === 'results' ||
        page === 'results';
      return isDescending
        ? b.startTimestamp - a.startTimestamp
        : a.startTimestamp - b.startTimestamp;
    };

    followedMatches.sort(sortByTime);
    nonFollowedMatches.sort(sortByTime);

    // Update state
    if (matchesShow.length === 0 && shouldRefetch) {
      setMatchesShow([...followedMatches, ...nonFollowedMatches]);
    }

  }, [matchTypeFilter, dateFilter, page, matchFollowed, matches, matchesLive, matchTypeFilterMobile, matchesShow, shouldRefetch]);

  // Reset matches on filter change
  useEffect(() => {
    setMatchesShow([]);
    setShouldRefetch(true);
  }, [dateFilter, matchTypeFilter, matchTypeFilterMobile]);

  // Handle refetch state for non-current dates
  useEffect(() => {
    if (
      !isSameDay(new Date(), dateFilter) &&
      ['live'].includes(matchTypeFilter) &&
      matchesShow.length === 0
    ) {
      setShouldRefetch(false);
    }
  }, [dateFilter, matchTypeFilter, matchesShow.length]);

  // Update refetch state based on matches
  useEffect(() => {
    if (
      (matchesShow.length > 0 ||
        (['live'].includes(matchTypeFilter) &&
          Object.values(matchesLive).length === 0 &&
          Object.values(matches).length === 0)) &&
      shouldRefetch
    ) {
      setShouldRefetch(false);
    }
  }, [matchesShow.length, matchesLive, matches, shouldRefetch, matchTypeFilter]);

  // Handle socket updates
  useEffect(() => {
    const fieldsToCompare = ['scores', 'timer', 'status'];
    if (!matches || !matchLiveSocket) return;

    const { metadata } = matchLiveSocket;

    if (Array.isArray(metadata) && metadata.length > 0 && !matchLiveIdRef.current) {
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
  }, [matchLiveSocket, matches, matchesLive, setMatches, setMatchesLive]);

  useEffect(() => {
    if (matchesShow.length > 0 && shouldRefetch) {
      setShouldRefetch(false);
    }
  }, [matchesShow])

  if (shouldRefetch) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  if (!shouldRefetch && matchesShow.length === 0 && !isDetail) {
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
      <div className=' h-full space-y-1' test-id='match-list-hockey'>
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
                      showTime={isShowTime}
                      page={page}
                      sport={sport}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={match?.id}>
                    <MatchRowByTimeIsolated
                      key={match?.id || idx}
                      theme={resolvedTheme}
                      match={match}
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
