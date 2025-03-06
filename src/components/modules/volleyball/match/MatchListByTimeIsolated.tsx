/* eslint-disable react-hooks/exhaustive-deps */
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { MatchRowByTimeIsolated } from '@/components/modules/volleyball/match/MatchRowByTimeIsolated';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { SportEventDtoWithStat } from '@/constant/interface';
import {
  filterVolleyballMatches,
  formatMatchTimestampVolleyball,
  getDateFromTimestamp,
} from '@/utils';

import vi from '~/lang/vi';
import { PAGE, SPORT } from '@/constant/common';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { TwSectionWrapper } from '@/components/modules/common';
import { EmptyEvent } from '@/components/common/empty';

export const MatchListByTimeIsolated = ({
  sport = SPORT.VOLLEYBALL,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => {},
  setMatchesLive = () => {},
  matchLiveSocket,
  isLiveMatchRefetching,
}: MatchListIsolatedProps) => {
  const matchLiveIdRef = useRef<boolean | null>(null);
  const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
  const [allMatches, setAllMatches] = useState<SportEventDtoWithStat[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

  const { resolvedTheme } = useTheme();
  const { dateFilter, matchTypeFilter, matchTypeFilterMobile } =
    useFilterStore();
  const { matchesOdds } = useHomeStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
  // const { matches, matchesLive, setMatches, setMatchesLive } = useHomeStore();
  const isShowTime = true;
  // matchTypeFilter !== 'finished' && page !== 'results';
  const i18n = useTrans();
  // const { liveScoresSocket } = useLivescoreStore();

  useEffect(() => {
    if (
      Object.values(matchesLive).length > 0 ||
      Object.values(matches).length > 0
    ) {
      const matchShow = matchTypeFilter === 'live' ? matchesLive : matches;
      const filteredMatches: SportEventDtoWithStat[] = filterVolleyballMatches(
        Object.values(matchShow),
        page,
        matchTypeFilter,
        dateFilter,
        sport
      );
      if (JSON.stringify(filteredMatches) !== JSON.stringify(allMatches)) {
        setAllMatches(filteredMatches);
        const followedMatches = filteredMatches.filter((match) =>
          matchFollowed.some(
            (follow: { matchId: string }) => follow?.matchId === match?.id
          )
        );

        const nonFollowedMatches = filteredMatches.filter((match) => {
          const [time] = formatMatchTimestampVolleyball(
            match.startTimestamp,
            match.status,
            true,
            match.time?.currentPeriodStartTimestamp
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
      }
    }
    setShouldRefetch(false);
  }, [
    matchTypeFilter,
    dateFilter,
    page,
    matchFollowed,
    matches,
    matchesLive,
    matchTypeFilterMobile,
    i18n.language,
    matchesShow,
    matchLiveIdRef.current,
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

  if (shouldRefetch) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
    );
  }

  if (matchesShow.length === 0 && !isDetail) {
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
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
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
                      matchOdds={matchOdds}
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
