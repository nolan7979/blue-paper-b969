import { useEffect, useRef } from 'react';

import { useLiveMatchData } from '@/hooks/useSportData';

import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { SPORT } from '@/constant/common';
import { parseMatchDataBasketBall } from '@/utils';

export const LiveMatchesLoaderSection = ({
  sport = SPORT.FOOTBALL,
}: {
  sport?: string;
}) => {
  const { matchTypeFilter } = useFilterStore();

  if (matchTypeFilter === 'live') {
    return <LiveMatchesLoader sport={sport} />;
  }
  return <></>;
};

const LiveMatchesLoader = ({ sport }: { sport: string }) => {
  const { addMatches, setMatchesLive } = useHomeStore();
  const { isConnectSocket } = useIsConnectSocketStore();
  const { eventNumber } = useEventCountStore();
  const prevEventNumberRef = useRef<number | null>(eventNumber);
  const {
    data: liveMatches,
    refetch,
    isLoading,
  } = useLiveMatchData(sport);

  useEffect(() => {
    // const liveMatches_convert = (liveMatches as string);
    if (liveMatches !== undefined) {
      addMatches(liveMatches);
      setMatchesLive(liveMatches);
    }
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
