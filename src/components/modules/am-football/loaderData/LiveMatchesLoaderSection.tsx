import { useEffect, useRef } from 'react';

import { useLiveMatchData } from '@/hooks/useSportData';

import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { SPORT } from '@/constant/common';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { parseMatchDataArrayAMFootball } from '@/utils/americanFootballUtils';

export const LiveMatchesLoaderSection = ({
  sport = SPORT.FOOTBALL,
}: {
  sport?: string;
}) => {
  const { matchTypeFilter } = useFilterStore();

  if (matchTypeFilter === 'live') {
    return <LiveMatchesLoader />;
  }
  return <></>;
};

const LiveMatchesLoader = () => {
  const { addMatches, setMatchesLive } = useHomeStore();
  const { isConnectSocket } = useIsConnectSocketStore();
  const { eventNumber } = useEventCountStore();
  const prevEventNumberRef = useRef<number | null>(eventNumber);
  const {
    data: liveMatches,
    refetch,
    isLoading,
  } = useLiveMatchData(SPORT.AMERICAN_FOOTBALL);

  useEffect(() => {
    const liveMatches_convert = parseMatchDataArrayAMFootball(liveMatches as string);
    addMatches(liveMatches_convert);
    setMatchesLive(liveMatches_convert);
  }, [liveMatches]);

  useEffect(() => {
    if (prevEventNumberRef.current !== eventNumber) {
      prevEventNumberRef.current = eventNumber;

      // refetch();
    }
  }, [eventNumber, refetch]);

  useEffect(() => {
    if (!isConnectSocket) {
      const intervalId = setInterval(() => {
        refetch();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isConnectSocket, refetch]);

  if (isLoading) {
    const ArrayFromOneToNine = Array.from(
      { length: 9 },
      (_, index) => index + 1
    );
    return (
      <div>
        {ArrayFromOneToNine.map((number) => (
          <MatchSkeleton key={number} />
        ))}
      </div>
    );
  }

  return <></>;
};
