import { useEffect, useRef } from 'react';

import { useLiveMatchData } from '@/hooks/useSportData';

import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { SPORT } from '@/constant/common';

export const TennisLiveMatchesLoaderSection = () => {
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
  } = useLiveMatchData(SPORT.TENNIS);

  useEffect(() => {
    if (liveMatches) {
      // const liveMatches_convert = parseMatchDataArray(liveMatches as string);
      addMatches(liveMatches);
      setMatchesLive(liveMatches);
    }
  }, [liveMatches]);

  useEffect(() => {
    if (prevEventNumberRef.current !== eventNumber) {
      prevEventNumberRef.current = eventNumber;
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
