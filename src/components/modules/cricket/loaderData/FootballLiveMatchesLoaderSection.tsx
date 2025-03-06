import { useEffect, useRef } from 'react';

import { useLiveMatchData } from '@/hooks/useSportData';

import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { useIsConnectSocketStore } from '@/stores/is-connect-socket';

import { SPORT } from '@/constant/common';
import { parseMatchDataArray } from '@/utils';

export const FootballLiveMatchesLoaderSection = ({
  sport = SPORT.FOOTBALL,
}: {
  sport?: string;
}) => {
  const { matchTypeFilter } = useFilterStore();

  if (matchTypeFilter === 'live') {
    return (
      <FootballLiveMatchesLoader sport={sport}></FootballLiveMatchesLoader>
    );
  }
  return <></>;
};

const FootballLiveMatchesLoader = ({ sport }: { sport: string }) => {
  const { addMatches, setMatchesLive } = useHomeStore();
  const { isConnectSocket } = useIsConnectSocketStore();
  const { eventNumber } = useEventCountStore();
  const prevEventNumberRef = useRef<number | null>(eventNumber);
  const { data: liveMatches, refetch } = useLiveMatchData(sport);

  useEffect(() => {
    let liveMatches_convert = [];
    liveMatches_convert = parseMatchDataArray(liveMatches as string);

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

  return <></>;
};
