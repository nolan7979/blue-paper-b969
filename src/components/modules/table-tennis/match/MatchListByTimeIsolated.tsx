/* eslint-disable react-hooks/exhaustive-deps */
import { format, isSameDay } from 'date-fns';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';

import { useFilterStore, useHomeStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  SportEventDtoWithStat
} from '@/constant/interface';
import {
  getDateFromTimestamp
} from '@/utils';

import { MatchRowByTimeIsolated } from '@/components/modules/table-tennis';
import { PAGE, SPORT } from '@/constant/common';
import { updateMatchesBySocket } from '@/hooks/useUpdateMatchesBySocket';
import { MatchListIsolatedProps } from '@/models/mathIsolated';
import { filterMatchesTableTennis, formatMatchTimestampTableTennis } from '@/utils/tableTennisUtils';
import vi from '~/lang/vi';

export const MatchListByTimeIsolated = ({
  sport = SPORT.BASKETBALL,
  page = PAGE.liveScore,
  isDetail,
  matches = {},
  matchesLive = {},
  setMatches = () => { },
  setMatchesLive = () => { },
  matchLiveSocket,
}: MatchListIsolatedProps) => {
  const matchLiveIdRef = useRef<boolean | null>(null);
  const [matchesShow, setMatchesShow] = useState<SportEventDtoWithStat[]>([]);
  const [allMatches, setAllMatches] = useState<SportEventDtoWithStat[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

  const { resolvedTheme } = useTheme();
  const { matchTypeFilter } = useFilterStore();
  const { dateFilter } = useFilterStore();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { homeSound } = useSettingsStore();
  const isShowTime = true;
  const i18n = useTrans();

  useEffect(() => {
    if (matches || matchesLive) {
      const matchShow = matchTypeFilter === 'live' ? matchesLive : matches;
      const filteredMatches: SportEventDtoWithStat[] = filterMatchesTableTennis(
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
          const [time] = formatMatchTimestampTableTennis(
            match.startTimestamp,
            match.status,
            true,
            0
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
        setShouldRefetch(false);
        setMatchesShow([...followedMatches, ...nonFollowedMatches]);
      }
    }
  }, [
    matchTypeFilter,
    dateFilter,
    page,
    matchFollowed,
    matches,
    matchesLive,
    sport,
  ]);

  useEffect(() => {
    setShouldRefetch(true);
  }, [dateFilter, matchTypeFilter]);

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
    }
  }, [matchLiveSocket]);

  if (matchesShow.length === 0 && shouldRefetch) {
    return (
      <>
        <MatchSkeletonMapping />
      </>
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
                      homeSound={homeSound}
                      showTime={isShowTime}
                      page={page}
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
                      homeSound={homeSound}
                      page={page}
                      showTime={isShowTime}
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
